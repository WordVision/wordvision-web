import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface ContextMenuProps {
  top: number;
  left: number;
  dismissHandler: () => void;
  visualizeHandler: () => void;
}

export default function ContextMenu(p: ContextMenuProps) {

  return <>
    <div
      className="fixed inset-0 z-50 bg-transparent"
      onClick={p.dismissHandler}
    ></div>
    <div
      className="h-[50px] z-50 bg-gray-800 absolute flex px-2 items-center gap-2 rounded-md"
      style={{
        top: p.top < 50 ? p.top + 20 : p.top - 50,
        left: p.left
      }}
    >
      <Button
        size="xs"
        variant="outline"
        className="text-white"
        onPress={p.visualizeHandler}
      >
        <ButtonIcon as={Eye}/>
        <ButtonText className="text-white">Visualize</ButtonText>
      </Button>
    </div>
  </>;
}

