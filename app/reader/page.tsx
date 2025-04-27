"use client"

import { useEffect, useRef, useState } from "react";
import ePub, { NavItem, Rendition } from "epubjs";
import Section from "epubjs/types/section";

import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import ContextMenu from "./components/ContextMenu";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Drawer,
  DrawerBackdrop,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader
} from "@/components/ui/drawer";
import { Heading } from "@/components/ui/heading";
import { Link, LinkText } from "@/components/ui/link";
import ActionBar from "./components/ActionBar";

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

export default function Reader() {

  const [rendition, setRendition] = useState<Rendition | null>(null);
  const [bookLoaded, setBookLoaded] = useState<boolean>(false);
  const [selection, setSelection] = useState<BookSelection | null>(null);

  const [menuPos, setMenuPos] = useState<Position>({top: 0, left: 0});
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const [toc, setTOC] = useState<NavItem[]>([]);
  const [showTOC, setShowTOC] = useState<boolean>(false);

  const [showNav, setShowNav] = useState<boolean>(false);

  const [touchStart, setTouchStart] = useState<Coordinates>({x: 0, y: 0});
  const touchStartRef = useRef(touchStart);
  useEffect(() => {
    touchStartRef.current = touchStart;
  }, [touchStart])

  useEffect(() => {
    (async () => {

      const book = ePub("https://s3.amazonaws.com/moby-dick/OPS/package.opf");
      await book.ready;

      setBookLoaded(true)
      setTOC(book.navigation.toc);

      const rendition = book.renderTo("reader", { width: "100%", height: "100%" });
      rendition.display();

      rendition.on("selected", (cfiRange: string) => {
        const selection = {
          text: rendition.getRange(cfiRange).toString(),
          location: cfiRange,
        };
        console.debug({ selection });
        setSelection(selection);
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
        setShowNav(true);
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
      const rect = range?.getBoundingClientRect();
      const clientRects = range?.getClientRects();
      const lastRect = clientRects![clientRects!.length - 1];
      const position = lastRect || rect;

      const clientWidth = e.target.activeElement.clientWidth;
      const top = position.top + position.height;
      let left = position.left;

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

      <ActionBar
        show={showNav}
        tocHandler={() => setShowTOC(true)}
        dismissHandler={() => setShowNav(false)}
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

              highlightHandler={() => {
                rendition?.annotations.highlight(selection?.location!);
                setShowMenu(false);
                setSelection(null);
                // @ts-ignore: DO NOT REMOVE THIS COMMENT
                rendition.getContents()[0]?.window?.getSelection()?.removeAllRanges();
                console.log(selection)
              }}
              visualizeHandler={() => console.log(selection)}
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

    <Drawer
      isOpen={showTOC}
      onClose={() => {
        setShowTOC(false)
      }}
      size="lg"
      anchor="left"
    >
      <DrawerBackdrop />
      <DrawerContent>

        <DrawerHeader>
          <Heading size="3xl">Table of Contents</Heading>
        </DrawerHeader>

        <DrawerBody>
          {toc.map((item, i) => (
            <Link
              key={i}
              onPress={() => {
                rendition?.display(item.href)
                setShowTOC(false);
                setShowNav(false);
              }}
            >
              <LinkText>{item.label}</LinkText>
            </Link>
          ))}
        </DrawerBody>

        <DrawerFooter>
          <Button
            onPress={() => {
              setShowTOC(false)
            }}
            className="flex-1"
          >
            <ButtonText>Close</ButtonText>
          </Button>
        </DrawerFooter>

      </DrawerContent>
    </Drawer>
  </>);
}
