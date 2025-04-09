"use client"

import { useEffect, useState } from "react";
import ePub, { Contents, Rendition } from "epubjs";
import Section from "epubjs/types/section";

import { Button, ButtonGroup, ButtonText } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import ContextMenu from "./components/ContextMenu";

export default function Reader() {

  const [rendition, setRendition] = useState<Rendition | null>(null);
  const [bookLoaded, setBookLoaded] = useState<boolean>(false);
  const [sectionPage, setSectionPage] = useState<number>(0);
  const [selection, setSelection] = useState<{text: string, location: string} | null>(null);
  const [menuPos, setMenuPos] = useState<{top: number, left: number} | null>({top: 0, left: 0});
  const [showMenu, setShowMenu] = useState<boolean>(false);

  useEffect(() => {
    (async () => {

      const book = ePub("https://s3.amazonaws.com/moby-dick/OPS/package.opf");
      await book.ready;

      setBookLoaded(true)
      const rendition = book.renderTo("reader", { width: "100%", height: "100%" });
      rendition.display();

      rendition.on("selected", (cfiRange: string, _: Contents) => {
        const selection = {
          text: rendition.getRange(cfiRange).toString(),
          location: cfiRange,
        };
        console.debug({selection})
        setSelection(selection);
      })

      rendition.on("rendered", (_: Section, view: any) => {
        console.debug("rendered view:", {view})

        const viewDoc: Document = view.document;
        viewDoc.oncontextmenu = e => e.preventDefault();
        viewDoc.onmouseup = finishSelection;
        viewDoc.ontouchcancel = finishSelection;
        viewDoc.onselectionchange = calculateMenuPosition;
      })

      setRendition(rendition);

    })();
  }, []);


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
  function finishSelection(e: MouseEvent | TouchEvent) {
    e.preventDefault();
    console.debug("finish selection event: ", e);
    if (!e.view?.document.getSelection()?.isCollapsed) {
      setShowMenu(true);
    }
  }


  return (

    <div className="h-screen flex flex-col justify-center items-center">

      {bookLoaded &&
        <ButtonGroup flexDirection="row">
          <Button size="md" variant="solid" action="primary" onPress={() => {
            console.log({sectionPage})
            rendition?.prev().then(() => {
              setSectionPage(prev => prev + 1);
            })
          }}>
            <ButtonText>Prev</ButtonText>
          </Button>

          <Button size="md" variant="solid" action="primary" onPress={() => {
            console.log({sectionPage})
            rendition?.next().then(() => {
              setSectionPage(prev => prev + 1);
            })
          }}>
            <ButtonText>Next</ButtonText>
          </Button>
        </ButtonGroup>
      }

      <div id="reader" className="relative bg-blue-200 w-full h-[80vh] lg:w-1/2">
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

            highlightHandler={() => console.log(selection)}
          />
        }
      </div>

    </div>
  );
}
