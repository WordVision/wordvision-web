import { Inter } from "next/font/google";

const inter = Inter({
  weight: '600',
  subsets: ['latin'],
})

interface ActionBarProps {
  show: boolean;
  dismissHandler: () => void;
  visualizeHandler: () => void;
}

export default function ActionBar(p: ActionBarProps) {

  return <>
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 flex p-4 items-center transition ${p.show ? "" : "translate-y-full"}`}
    >
      <button
        className={inter.className + " w-full px-4 py-2 bg-violet-800 rounded-full  text-white"}
        onClick={p.visualizeHandler}
      >
        Visualize it
      </button>
    </div>
  </>;
}

