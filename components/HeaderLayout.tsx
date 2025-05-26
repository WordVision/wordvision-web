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
    <div className="p-4 flex justify-between items-center">
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
