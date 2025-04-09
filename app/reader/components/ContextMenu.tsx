import { Button, ButtonText } from "@/components/ui/button";

interface ContextMenuProps {
  top: number;
  left: number;
  dismissHandler: () => void;
  highlightHandler: () => void;
}

export default function ContextMenu(p: ContextMenuProps) {

  return <>
    <div
      className="fixed inset-0 z-50 bg-transparent"
      onClick={p.dismissHandler}
    ></div>
    <div
      className={`z-50 bg-white p-2 absolute`}
      style={{
        top: p.top,
        left: p.left
      }}
    >
      <Button onPress={p.highlightHandler}>
        <ButtonText>Print selection</ButtonText>
      </Button>
    </div>
  </>;
}

