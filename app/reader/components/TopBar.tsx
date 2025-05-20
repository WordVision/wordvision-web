import { ArrowLeft, Moon, Sun, TableOfContents } from "lucide-react";
import Link from "next/link";

interface TopBarProps {
  show: boolean;
  dark: boolean;
  darkModeHandler: () => void;
  dismissHandler: () => void;
  tocHandler: () => void;
}

export default function TopBar(p: TopBarProps) {
  return (<>
      <div className={"fixed inset-x-0 top-0 z-[60] px-2 py-2  shadow-lg flex justify-between transition" + (p.show ? "" : " -translate-y-full") + (p.dark ? " bg-neutral-800" : " bg-neutral-50")} >

        <Link className="flex items-center" href={"/"}>
          <button
            className="active:bg-neutral-200 rounded px-4 py-2"
          >
            <ArrowLeft size={28} color={p.dark ? "white" : "black"}/>
          </button>
        </Link>

        <div>

          <button
            className="active:bg-neutral-200 rounded p-2"
            onClick={p.darkModeHandler}
          >
          {p.dark ?
            <Sun size={28} color={p.dark ? "white" : "black"}/>
          :
            <Moon size={28} color={p.dark ? "white" : "black"}/>
          }
          </button>

          <button
            className="active:bg-neutral-200 rounded p-2"
            onClick={p.tocHandler}
          >
            <TableOfContents size={28} color={p.dark ? "white" : "black"}/>
          </button>

        </div>

      </div>
  </>)
}
