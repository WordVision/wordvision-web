import { Playfair_Display } from "next/font/google";
import { ReactNode } from "react";

const playfairDisplay = Playfair_Display({
  weight: "700",
  style: "italic",
  subsets: ["latin"],
});

interface HeaderProps {
  text: string;
  children: ReactNode;
}

export default function HeaderLayout(p: HeaderProps) {
  return (
    <div className="sticky top-0 left-0 right-0 z-50 p-4 flex justify-between items-center bg-white">
      <p
        style={playfairDisplay.style}
        className="text-[42px] text-[#2C3131]"
      >
        {p.text}
      </p>
      {p.children}
    </div>
  );
}
