import { ArrowLeft, TableOfContents } from "lucide-react";
import Link from "next/link";

interface TopBarProps {
  show: boolean;
  dismissHandler: () => void;
  tocHandler: () => void;
}

export default function TopBar(p: TopBarProps) {
  return (<>
      <div className={"fixed inset-x-0 top-0 z-[60] px-2 py-2 bg-neutral-50 shadow-lg flex justify-between transition" + (p.show ? "" : " -translate-y-full")} >

        <Link className="flex items-center" href={"/"}>
          <button
            className="active:bg-neutral-200 rounded px-4 py-2"
          >
            <ArrowLeft size={28} color="black"/>
          </button>
        </Link>

        <button
          className="active:bg-neutral-200 rounded px-4 py-2"
          onClick={p.tocHandler}
        >
          <TableOfContents size={28} color="black"/>
        </button>

      </div>
  </>)
}
