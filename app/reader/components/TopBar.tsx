import { Button, ButtonIcon } from "@/components/ui/button";
import { ArrowLeft, TableOfContents } from "lucide-react";
import Link from "next/link";

interface TopBarProps {
  show: boolean;
  dismissHandler: () => void;
  tocHandler: () => void;
}

export default function TopBar(p: TopBarProps) {

  return (<>
      <div className={"fixed inset-x-0 top-0 z-[60] px-4 py-2 bg-violet-800/95 flex justify-between transition" + (p.show ? "" : " -translate-y-full")} >

        <Link href={"/"}>
          <Button
            size="sm"
            variant="outline"
            action="primary"
            className="text-white outline-white"
          >
            <ButtonIcon as={ArrowLeft} />
          </Button>
        </Link>

        <Button
          size="sm"
          variant="outline"
          action="primary"
          className="text-white outline-white"
          onPress={p.tocHandler}
        >
          <ButtonIcon as={TableOfContents} />
        </Button>
      </div>
  </>)


}
