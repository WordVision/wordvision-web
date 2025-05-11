"use client"

import { use, useEffect, useRef, useState } from "react";
import ePub, { Contents, NavItem, Rendition } from "epubjs";
import Section from "epubjs/types/section";
import { redirect } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';

import { createClient } from "@/utils/supabase/client";
import { Spinner } from "@/components/ui/spinner";
import { Button, ButtonIcon } from "@/components/ui/button";

import TopBar from "../components/TopBar";
import ContextMenu from "../components/ContextMenu";
import TableOfContents from "../components/TableOfContents";
import ImageVisualizer from "../components/ImageVisualizer";


const MIN_SWIPE_DISTANCE = 50; // Minimum distance in pixels for a swipe

interface BookSelection {
  text: string;
  location: string;
}

interface Position {
  top: number;
  left: number;
}

interface Coordinates {
  x: number;
  y: number
}

export default function Reader({params}: {params : Promise<{bookId: string}>}) {

  const { bookId } = use(params);
  console.log({bookId});

  // Book/epub related
  const [rendition, setRendition] = useState<Rendition | null>(null);
  const [bookLoaded, setBookLoaded] = useState<boolean>(false);
  const [selection, setSelection] = useState<BookSelection | null>(null);

  // Context Menu
  const [menuPos, setMenuPos] = useState<Position>({top: 0, left: 0});
  const [showMenu, setShowMenu] = useState<boolean>(false);

  // Table of Contents
  const [toc, setTOC] = useState<NavItem[]>([]);
  const [showTOC, setShowTOC] = useState<boolean>(false);

  // For top bar
  const [showTopBar, setShowTopBar] = useState<boolean>(false);

  // For Image Viewer drawer
  const [showImageViewer, setShowImageViewer] = useState<boolean>(false);

  // For swipe gestures
  const [touchStart, setTouchStart] = useState<Coordinates>({x: 0, y: 0});
  const touchStartRef = useRef(touchStart);
  useEffect(() => {
    touchStartRef.current = touchStart;
  }, [touchStart])

  // Mark clicked
  const [markClicked, setMarkClicked] = useState<boolean>(false);
  const markClickedRef = useRef(markClicked);
  useEffect(() => {
    markClickedRef.current = markClicked;
  }, [markClicked])

  // Img Url to pass to imageviewer
  const [imgUrl, setImgUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    (async () => {

      const supabase = createClient();

      // Get book by id
      const { data: userBook, error: userBooksError } = await supabase
        .from("books")
        .select()
        .eq("id", bookId)
        .single();

      if (userBooksError) {
        console.error(`Could not fetch book with id: ${bookId}`, userBooksError)
        return;
      }

      // Create signed url for book
      const { data: urlData, error: urlError } = await supabase
        .storage
        .from("books")
        .createSignedUrl(userBook.filename, 3600);

      if (urlError) {
        console.error(`Could not create signed url for book with id: ${bookId}`, urlError);
        return;
      }

      // Fetch book data from url
      const res = await fetch(urlData.signedUrl);
      const blob = await res.blob();
      const data = await blob.arrayBuffer();

      // Load book data
      const book = ePub(data);
      await book.ready;

      setBookLoaded(true)
      setTOC(book.navigation.toc);

      const rendition = book.renderTo("reader", { width: "100%", height: "100%" });

      // Get book highlights
      const { data: bookHighlights, error: bookHighlightsError } = await supabase
        .from("highlights")
        .select()
        .eq("book_id", bookId)

      if (bookHighlightsError) {
        console.error(`Could not fetch book highlights: `, bookHighlights)
        return;
      }

      console.log({bookHighlights});

      bookHighlights.forEach(h => {
        rendition?.annotations.highlight(h.location, {img_url: h.img_url});
      })

      rendition.display();

      rendition.on("selected", (cfiRange: string) => {
        const selection = {
          text: rendition.getRange(cfiRange).toString(),
          location: cfiRange,
        };
        console.debug({ selection });
        setSelection(selection);
      });

      rendition.on("markClicked", (cfiRange: string, data: {img_url: string}, contents: Contents) => {
        setMarkClicked(true);
        console.log("markClicked: ", {cfiRange});
        setShowImageViewer(true);
        setImgUrl(data.img_url);

      });

      rendition.on("rendered", (_: Section, view: any) => {
        console.debug("rendered view:", {view})

        const viewDoc: Document = view.document;

        // Set event handlers for the document
        viewDoc.oncontextmenu = e => e.preventDefault();
        viewDoc.onmouseup = showMenuForSelection;
        viewDoc.ontouchcancel = showMenuForSelection;
        viewDoc.onselectionchange = calculateMenuPosition;
        viewDoc.ontouchstart = (e) => {
          // Make sure endX is within the bounds of readerWidth
          const readerWidth = e.view?.outerWidth!;
          let x = e.changedTouches[0].clientX;
          while (x > readerWidth) {
            x -= readerWidth;
          }
          setTouchStart({
            x,
            y: e.changedTouches[0].clientY,
          })
        };
        viewDoc.ontouchend = (e) => { flipPage(e, rendition) };
      })

      setRendition(rendition);

    })();
  }, []);


  // OnTouchEnd Event Handler
  function flipPage(e: TouchEvent, rendition: Rendition) {
    console.debug("ontouchend flip page", e)

    e.preventDefault();

    for (const el of e.composedPath()) {
      console.debug({el});
    }

    if (markClickedRef.current) return;

    const readerWidth = e.view?.outerWidth!;

    const startX = touchStartRef.current.x;
    const startY = touchStartRef.current.y;

    // Make sure endX is within the bounds of readerWidth
    let endX = e.changedTouches[0].clientX;
    while (endX > readerWidth) {
      endX -= readerWidth;
    }
    const endY = e.changedTouches[0].clientY;
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // If user just tapped the screen
    if (absDeltaX < MIN_SWIPE_DISTANCE && absDeltaY < MIN_SWIPE_DISTANCE) {
      const readerWidth = e.view?.outerWidth!;

      if ((startX / readerWidth) > 0.75) {
        console.debug("tapped the right-hand side", {startX, readerWidth});
        rendition.next();
      }
      else if ((startX / readerWidth) < 0.25) {
        console.debug("tapped the left-hand side", {startX, readerWidth});
        rendition.prev();
      }
      else {
        console.debug("tapped the center");
        setShowTopBar(true);
      }
    }
    // Else, if user horizontally swipes the screen.
    else if (absDeltaX > MIN_SWIPE_DISTANCE && absDeltaX > absDeltaY) {
      if (deltaX < 0) {
        console.debug('Swiped Left');
        rendition.next();
      }
      else {
        console.debug('Swiped Right');
        rendition.prev();
      }
    }
    // Else, user swiped vertically
    else {
       console.debug('Status: Not a clear horizontal swipe.');
    }
  }


  // OnSelectionChange Event Handler
  function calculateMenuPosition(e: any) {
    e.preventDefault();

    console.debug("selectionchange: ", e);
    console.debug("selectionchange target: ", e.target.activeElement.clientWidth);
    console.debug("selectionchange selection: ", e.target.getSelection());

    const selection: Selection = e.target.getSelection();

    if (!selection.isCollapsed) {
      const range = selection?.getRangeAt(0);
      const clientRects = range?.getClientRects();
      const rect = clientRects![0];

      const clientWidth = e.target.activeElement.clientWidth;
      const top = rect.top < 50 ? rect.top + rect.height : rect.top;
      let left = rect.left;

      while(left > clientWidth) {
        left -= clientWidth;
      }

      setMenuPos({top, left});
    }
  }


  // OnMouseUp and OnTouchCancel Event Handler
  function showMenuForSelection(e: MouseEvent | TouchEvent) {
    e.preventDefault();
    console.debug("finish selection event: ", e);
    if (!e.view?.document.getSelection()?.isCollapsed) {
      setShowMenu(true);
    }
  }


  return (<>
    <div className="h-screen relative flex flex-col justify-center items-center bg-red-200">

      <TopBar
        show={showTopBar}
        tocHandler={() => setShowTOC(true)}
        dismissHandler={() => setShowTopBar(false)}
      />

      <div className="w-full h-full flex justify-center items-center">
        {bookLoaded &&
          <Button
            className="hidden lg:block"
            size="md"
            variant="solid"
            action="primary"
            onPress={() => {
              rendition?.prev()
          }}>
            <ButtonIcon as={ChevronLeft} />
          </Button>
        }

        <div id="reader" className="relative bg-white h-full w-full lg:w-1/2">
          {!bookLoaded && <Spinner />}

          {showMenu &&
            <ContextMenu
              top={menuPos!.top}
              left={menuPos!.left}
              dismissHandler={() => {
                setShowMenu(false);
                setSelection(null);
                // @ts-ignore: DO NOT REMOVE THIS COMMENT
                rendition.getContents()[0]?.window?.getSelection()?.removeAllRanges();
              }}
              visualizeHandler={async () => {
                console.debug({selection});

                if (selection) {
                  setShowMenu(false);
                  setSelection(null);
                  setShowImageViewer(true);

                  const supabase = createClient();

                  // Generate image from prompt and get url
                  const image_id = uuidv4();
                  const {data: genImage, error: genImageError} = await supabase.functions.invoke<{img_url: string}>('generate-image', {
                    body: {
                      image_id,
                      prompt: selection.text,
                    },
                  });

                  if (!genImage || genImageError) {
                    console.error("function visualizeHighlight: genImageRes Error", genImageError)
                     return;
                  }

                  // Get user data - need for id
                  const { data: { user }} = await supabase.auth.getUser();
                  if (!user) {
                    return redirect("/login");
                  }

                  // Insert new visualized highlight
                  const { error: insertError } = await supabase
                    .from("highlights")
                    .insert({
                      user_id: user.id,
                      book_id: bookId,
                      text: selection.text,
                      location: selection.location,
                      img_url: genImage.img_url,
                      img_prompt: selection.text,
                    })

                  if (insertError) {
                    console.error("unable to save highlight error:", insertError?.message);
                    return;
                  }

                  rendition?.annotations.highlight(selection.location, {img_url: genImage.img_url});

                  setImgUrl(genImage.img_url);
                }
                else {
                  console.error("No Selection");
                }

                // @ts-ignore: DO NOT REMOVE THIS COMMENT
                rendition.getContents()[0]?.window?.getSelection()?.removeAllRanges();
              }}
            />
          }
        </div>

        {bookLoaded &&
          <Button
            className="hidden lg:block"
            size="md"
            variant="solid"
            action="primary"
            onPress={() => {
              rendition?.next()
          }}>
            <ButtonIcon as={ChevronRight} />
          </Button>
        }
      </div>

    </div>

    <ImageVisualizer
      isOpen={showImageViewer}
      onClose={() => {
        setShowImageViewer(false);
        setMarkClicked(false);
        setImgUrl(undefined);
      }}
      imgUrl={imgUrl}
    />

    <TableOfContents
      isOpen={showTOC}
      onClose={() => {
        setShowTOC(false)
      }}
      toc={toc}
      onItemPress={(item) => {
        rendition?.display(item.href)
        setShowTOC(false);
        setShowTopBar(false);
      }}
    />

  </>);
}
