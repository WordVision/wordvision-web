"use client"

import { useEffect, useRef } from "react";
import { Location, NavItem } from "epubjs";
import { Drawer } from "vaul";
import { X } from "lucide-react";
import { Inter } from "next/font/google";

const inter500 = Inter({ weight: '500', subsets: ['latin'] })

interface TableOfContentsProps {
  isOpen: boolean;
  onClose: () => void;
  toc: NavItem[];
  onItemPress: (item: NavItem) => void;
  curLocation: Location | undefined;
}

function isCurrentLocation(curLocHref: string | undefined, navItemHref: string): boolean {
  if (curLocHref && navItemHref.startsWith(curLocHref)) {
    return true;
  }
  return false;
}

export default function TableOfContents(p: TableOfContentsProps) {

  const tocItemRef = useRef<HTMLButtonElement>(null);
  let visited = true;

  useEffect(() => {
    if (p.isOpen) {
      // Give the browser time to render and open the drawer before scrolling
      // into view
      const timer = setTimeout(() => {
        if (tocItemRef.current) {
          tocItemRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start"
          })
        }
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [p.isOpen]);

  return (
    <Drawer.Root
      open={p.isOpen}
      onClose={p.onClose}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40"/>
        <Drawer.Content className="pb-6 bg-gray-100 fixed bottom-0 left-0 right-0 outline-none rounded-t-xl">
          <div className="py-2 pl-5 pr-2 flex justify-between items-center bg-white rounded-t-xl">
            <Drawer.Title
              style={inter500.style}
              className="text-base"
            >
              Table of Contents
            </Drawer.Title>

            <button
              className="p-2 rounded-full active:bg-neutral-200"
              onClick={p.onClose}
            >
              <X color="#162664" size={20}/>
            </button>
          </div>

          <div className="max-h-[80vh] overflow-y-auto">
            {p.toc.map((item, i) => {
              const isCurLoc = isCurrentLocation(p.curLocation?.start.href, item.href);
              if (isCurLoc) visited = false;
              return (
                <button
                  key={i}
                  ref={isCurLoc ? tocItemRef : null}
                  className="w-full px-4 active:bg-neutral-200 flex items-center gap-2"
                  onClick={() => p.onItemPress(item)}
                >
                  {!p.curLocation?.atStart && (visited || isCurLoc) ?
                    <TocBulletActive />
                  :
                    <TocBulletPassive />
                  }
                  <p
                    style={{
                      ...inter500.style,
                      color: isCurLoc ? "#0A0D14" : "#525866",
                    }}
                    className="text-left text-sm border-b py-3 flex-1"
                  >
                    {item.label.trim()}
                  </p>
                </button>
              )
            })}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}


function TocBulletActive() {
  return (
    <svg width="9" height="14" viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 7L4.04199 0L8.08301 7L4.04199 14L0 7Z" fill="url(#paint0_linear_232_4223)"/>
      <defs>
      <linearGradient id="paint0_linear_232_4223" x1="4.0415" y1="0" x2="4.0415" y2="14" gradientUnits="userSpaceOnUse">
        <stop stop-color="#375DFB"/>
        <stop offset="1" stop-color="#253EA7"/>
      </linearGradient>
      </defs>
    </svg>
  );
}


function TocBulletPassive() {
  return (
    <svg width="9" height="14" viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 7L4.04199 0L8.08301 7L4.04199 14L0 7Z" fill="#E2E4E9"/>
    </svg>
  )
}

