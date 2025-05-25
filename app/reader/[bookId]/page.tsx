"use client"

import { use, useEffect, useRef, useState } from "react";
import ePub, { Contents, Location, NavItem, Rendition } from "epubjs";
import Section from "epubjs/types/section";
import { redirect, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { User } from "@supabase/supabase-js";

import { createClient } from "@/utils/supabase/client";
import { Spinner } from "@/components/ui/spinner";
import { Button, ButtonIcon } from "@/components/ui/button";

import TopBar from "../components/TopBar";
import ActionBar from "../components/ActionBar";
import TableOfContents from "../components/TableOfContents";
import ImageVisualizer from "../components/ImageVisualizer";
import LoadingModal from "../components/LoadingModal";

import {
  downloadFile,
  getBookDetails,
  // getUserLastLocationInBook
} from "../services/bookService";

import {
  getBookHighlights
} from "../services/highlightService";

import { deleteVisualization, visualize } from "../actions";

import type {
  BookSelection,
  Visualization,
  Coordinates
} from "../types";

const MIN_SWIPE_DISTANCE = 1; // Minimum distance in pixels for a swipe

export default function Reader({params}: {params : Promise<{bookId: string}>}) {

  const { bookId } = use(params);
  const router = useRouter();

  const [user, setUser] = useState<User>();

  // Dark/Light mode
  const [darkMode, setDarkMode] = useState<boolean>(true);

  // Book/epub related
  const [bookLoaded, setBookLoaded] = useState<boolean>(false);
  const [selection, setSelection] = useState<BookSelection | null>(null);
  const [visualization, setVisualization] = useState<Visualization | undefined>(undefined);
  const [rendition, setRendition] = useState<Rendition | null>(null);
  const renditionRef = useRef(rendition);
  useEffect(() => {
    renditionRef.current = rendition;
  }, [rendition]);

  // Action Bar
  const [showActionBar, setShowActionBar] = useState<boolean>(false);

  // Table of Contents
  const [toc, setTOC] = useState<NavItem[]>([]);
  const [showTOC, setShowTOC] = useState<boolean>(false);

  // For top bar
  const [showTopBar, setShowTopBar] = useState<boolean>(false);
  const showTopBarRef = useRef(showTopBar);
  useEffect(() => {
    showTopBarRef.current = showTopBar;
  }, [showTopBar]);

  // For Image Viewer drawer
  const [showImageViewer, setShowImageViewer] = useState<boolean>(false);
  const [visualizeError, setVisualizeError] = useState<string | undefined>();

  // For touch gestures
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

  // Loading Modal
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");




  // ========================================
  // DOWNLOAD BOOK AND SETUP READER
  // ========================================

  useEffect(() => {
    (async () => {
      const supabase = createClient();

      // Get user data - need for id
      const { data: { user }} = await supabase.auth.getUser();
      if (!user) {
        return redirect("/login");
      }
      setUser(user);

      let bookDetails, lastLocation, bookData, bookHighlights;
      try {
        bookDetails = await getBookDetails(bookId);
        // lastLocation = await getUserLastLocationInBook(user.id, bookId);
        lastLocation = localStorage.getItem(`${user.id}-${bookId}`);
        bookData = await downloadFile("books", bookDetails.filename);
        bookHighlights = await getBookHighlights(bookId);
      }
      catch (error) {
        console.error("Error downloading book data from remote: ", error);
        return
      }

      // Load book data
      const book = ePub(bookData);
      await book.ready;
      setBookLoaded(true)

      // Set table of contents data
      setTOC(book.navigation.toc);

      // Setup epub rendition
      const rendition = book.renderTo("reader", {
        manager: "continuous",
        flow: "scrolled",
        width: "100%",
        height: "100%",
        allowScriptedContent: true
      });

      bookHighlights.forEach(h => {
        rendition?.annotations.highlight(h.location, h, undefined, "", darkMode ? {
          'fill': '#8E44AD ',
          'fill-opacity': '0.3'
        } : {
          'fill': '#9370DB',
          'fill-opacity': '0.35'
        });
      });

      // Setup rendtion event handlers
      rendition.on("selected", (cfiRange: string) => {
        const selection = {
          text: rendition.getRange(cfiRange).toString(),
          location: cfiRange,
        };
        console.debug({ selection });
        setSelection(selection);
        setShowTopBar(false);
        setShowActionBar(true);
      });

      rendition.on("unselected", () => {
        setShowActionBar(false);
      });

      rendition.on("markClicked", (cfiRange: string, data: Visualization) => {
        setMarkClicked(true);
        console.log("markClicked: ", {cfiRange, data});
        setShowImageViewer(true);
        setVisualization(data)
      });

      rendition.on("relocated", (location: Location) => {
        if (location.atStart) {
          localStorage.removeItem(`${user.id}-${bookId}`);
        }
        else {
          localStorage.setItem(`${user.id}-${bookId}`, location.start.cfi);
        }
      })

      rendition.on("rendered", (_: Section, view: any) => {
        console.debug("rendered view:", {view})
        const viewDoc: Document = view.document;
        // Set event handlers for the document
        viewDoc.ontouchstart = recordTouchStartCoordinates;
        viewDoc.ontouchend = performCustomTouchGesture;
      })

      rendition.themes.override("background-color", "#1E1E1E");
      rendition.themes.override("color", "#D4D4D4");
      rendition.themes.override("text-align", "left");
      rendition.themes.override("line-height", "1.7");
      rendition.themes.font("Verdana, Arial, Helvetica, sans-serif");

      // Display rendition
      rendition.display(lastLocation || undefined);
      setRendition(rendition);
    })();
  }, [bookId]);




  // ========================================
  // HANDLER FUNCTIONS
  // ========================================

  // OnTouchEnd Event Handler
  function performCustomTouchGesture(e: TouchEvent) {
    console.debug("ontouchend flip page", e)
    // If user clicks on annotation, DO NOT PERFROM CUSTOM TOUCH ACTION
    if (markClickedRef.current) return;
    // If there is a current selection, DO NOT PERFROM CUSTOM TOUCH ACTION
    if (!e.view?.document.getSelection()?.isCollapsed) return;
    // If user click on an internal link, DO NOT PERFROM CUSTOM TOUCH ACTION
    for (const el of e.composedPath() as any) {
      console.debug(el.nodeName);
      if (el.nodeName === "A") {
        return;
      }
    }
    const readerWidth = e.view?.outerWidth!;
    // Make sure endX is within the bounds of readerWidth
    let endX = e.changedTouches[0].clientX;
    while (endX > readerWidth) {
      endX -= readerWidth;
    }
    const endY = e.changedTouches[0].clientY;
    const startX = touchStartRef.current.x;
    const startY = touchStartRef.current.y;

    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // If user taps the screen
    if (absDeltaX < MIN_SWIPE_DISTANCE && absDeltaY < MIN_SWIPE_DISTANCE) {
      e.preventDefault();
      console.debug("tapped the center", {absDeltaX, absDeltaY});
      // Toggle top bar
      setShowTopBar(!showTopBarRef.current);
    }
    else {
      setShowTopBar(false);
    }
  }


  // OnTouchStart Event Handler
  function recordTouchStartCoordinates(e: TouchEvent) {
    // Make sure startX is within the bounds of readerWidth
    const readerWidth = e.view?.outerWidth!;
    let x = e.changedTouches[0].clientX;
    while (x > readerWidth) {
      x -= readerWidth;
    }
    setTouchStart({
      x,
      y: e.changedTouches[0].clientY,
    })
  }


  async function visualizeHandler() {
    console.debug({selection});
    removeSelection();
    if (selection) {
      setShowActionBar(false);
      setSelection(null);
      setShowImageViewer(true);
      const { data, error } = await visualize(user?.id!, bookId, selection);
      if (data) {
        // Add new annotation the current epub rendition
        rendition?.annotations.highlight(selection.location, data, undefined, "", darkMode ? {
          'fill': '#8E44AD ',
          'fill-opacity': '0.3'
        } : {
          'fill': '#9370DB',
          'fill-opacity': '0.35'
        });

        setVisualization(data);
      }
      else {
        setVisualizeError(error.message);
      }
    }
    else {
      console.error("No Selection");
    }
  }


  async function onDeleteImageHandler(v: Visualization) {
    setLoadingMessage("Deleting Visualization...")
    setLoading(true);
    const { error } = await deleteVisualization(v);
    if (!error) {
      rendition?.annotations.remove(v.location, "highlight");
      closeImageVisualizer();
    }
    else {
      setVisualizeError(error.message);
    }
    setLoading(false);
    setLoadingMessage("")
  }


  function closeImageVisualizer() {
    setShowImageViewer(false);
    setMarkClicked(false);
    setVisualization(undefined)
    setVisualizeError(undefined);
  }


  function removeSelection() {
    if (rendition) {
      rendition.getContents().forEach((c: Contents) => {
        c.window.getSelection()?.removeAllRanges();
      });
    }
    else {
      console.error("Cannont remove selection from page. Rendition is null");
    }
  }




  // ========================================
  // READER COMPONENT
  // ========================================

  return (
    <div className="h-screen relative flex flex-col justify-center items-center bg-red-200">
      <TopBar
        show={showTopBar}
        dark={darkMode}
        tocHandler={() => setShowTOC(true)}
        backHandler={async () => {
          router.back();
        }}
        darkModeHandler={() => {
          if (darkMode) {
            console.log("changing to light");
            setDarkMode(false);

            renditionRef.current?.themes.update("daylightReader");
          }
          else {
            console.log("changing to dark");
            setDarkMode(true);
            renditionRef.current?.themes.update("midnightReader");
          }

          setShowTopBar(false);
        }}
        dismissHandler={() => setShowTopBar(false)}
      />

      <div className="w-full h-full flex justify-center items-center">

        {/* Previous page button (only on desktop) */}
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

        {/* epub reader container */}
        <div id="reader" className="bg-white h-full w-full lg:w-1/2">
          {!bookLoaded && <Spinner className="self-center"/>}
        </div>

        {/* Next page button (only on desktop) */}
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

      <ActionBar
        show={showActionBar}
        dismissHandler={() => {
          removeSelection();
          setShowActionBar(false);
          setSelection(null);
        }}
        visualizeHandler={visualizeHandler}
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

      <ImageVisualizer
        isOpen={showImageViewer}
        visualization={visualization}
        error={visualizeError}
        onClose={closeImageVisualizer}
        onDelete={onDeleteImageHandler}
      />

      <LoadingModal
        isOpen={loading}
        onClose={() => setLoading(false)}
        text={loadingMessage}
      />
    </div>
  );
}
