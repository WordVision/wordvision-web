import { Button, ButtonIcon } from "@/components/ui/button";
import { Eye, Highlighter } from "lucide-react";

interface ContextMenuProps {
  top: number;
  left: number;
  dismissHandler: () => void;
  highlightHandler: () => void;
  visualizeHandler: () => void;
}

export default function ContextMenu(p: ContextMenuProps) {

  return <>
    <div
      className="fixed inset-0 z-50 bg-transparent"
      onClick={p.dismissHandler}
    ></div>
    <div
      className="z-50 bg-gray-800 p-2 absolute flex gap-2"
      style={{
        top: p.top,
        left: p.left
      }}
    >
      <Button size="xs" variant="outline" onPress={p.highlightHandler}>
        <ButtonIcon as={Highlighter}/>
      </Button>

      <Button size="xs" variant="outline" onPress={p.visualizeHandler}>
        <ButtonIcon as={Eye}/>
      </Button>
    </div>
  </>;
}

