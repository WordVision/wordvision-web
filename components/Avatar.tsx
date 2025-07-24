import { Inter } from "next/font/google";

const inter500 = Inter({ weight: "500", subsets: ["latin"] });

interface AvatarProps {
  firstName: string;
  lastName: string;
  width: string | number;
  height: string | number;
  fontSize: string | number;
}

export default function Avatar(p: AvatarProps) {
  return (
    <div
      style={{
        ...(inter500.style),
        width: p.width,
        height: p.height,
        fontSize: p.fontSize
      }}
      className="text-[#0A0D14] flex justify-center items-center rounded-full shadow-[inset_0px_-8px_16px_0px_rgba(0,0,0,0.1)]"
    >
      {p.firstName[0] + p.lastName[0]}
    </div>
  )
}
