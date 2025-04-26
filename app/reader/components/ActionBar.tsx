import { Button, ButtonIcon } from "@/components/ui/button";
import { ArrowLeft, TableOfContents } from "lucide-react";
import Link from "next/link";

interface ActionBarProps {
  show: boolean;
  dismissHandler: () => void;
  tocHandler: () => void;
}

export default function ActionBar(p: ActionBarProps) {

  return (<>
      {p.show &&
        <div
          className="fixed inset-0 z-50 bg-transparent"
          onClick={p.dismissHandler}
        ></div>
      }
      <div className={"fixed inset-x-0 top-0 z-[60] px-4 py-2 bg-gray-800/95 flex justify-between transition" + (p.show ? "" : " -translate-y-full")} >

        <Link href={"/"}>
          <Button
            size="sm"
            variant="outline"
            action="primary"
            className="text-white"
            onPress={p.tocHandler}
          >
            <ButtonIcon as={ArrowLeft} />
          </Button>
        </Link>

        <Button
          size="sm"
          action="primary"
          variant="outline"
          className="text-white"
          onPress={p.tocHandler}
        >
          <ButtonIcon as={TableOfContents} />
        </Button>
      </div>
  </>)


}
