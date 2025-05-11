import {
  Drawer,
  DrawerBackdrop,
  DrawerContent,
} from "@/components/ui/drawer";
import Image from "next/image";
import { Inter } from "next/font/google";
import { Button, ButtonIcon } from "@/components/ui/button";
import { X } from "lucide-react";

const inter = Inter({
  weight: '600',
  subsets: ['latin'],
})

interface ImageVisualizerProps {
  isOpen: boolean;
  onClose: () => void;
  imgUrl?: string;
}

export default function ImageVisualizer(p: ImageVisualizerProps) {
  return (
    <Drawer
      isOpen={p.isOpen}
      onClose={p.onClose}
      size="lg"
      anchor="bottom"
    >
      <DrawerBackdrop />
      <DrawerContent className="p-4 flex flex-col">
        <div className="flex flex-col items-center gap-8">

          <Button
            size="lg"
            className="w-fit rounded-full p-2.5 bg-violet-800 text-white self-end"
            onPress={p.onClose}
          >
            <ButtonIcon as={X}/>
          </Button>

          <div className="relative h-[325px] w-[325px] rounded-xl overflow-clip">
          {p.imgUrl ?
            <Image
              src={p.imgUrl}
              alt=""
              fill={true}
              objectFit="cover"
            />
              :
            <Image
              src="/visualizing_placeholder.png"
              alt=""
              fill={true}
              objectFit="cover"
            />
          }
          </div>

          {p.imgUrl ?
            <p className={inter.className + " p-2 w-full text-center text-xl text-white bg-violet-800 rounded-xl"}>
              Generated Image
            </p>
              :
            <p className={inter.className + " p-2 w-full text-center text-xl text-white bg-violet-800 rounded-xl"}>
              Visualizing...
            </p>
          }

        </div>
      </DrawerContent>
    </Drawer>
  )
}
