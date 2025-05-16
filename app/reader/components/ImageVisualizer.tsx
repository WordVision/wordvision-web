import {
  Drawer,
  DrawerBackdrop,
  DrawerContent,
} from "@/components/ui/drawer";
import Image from "next/image";
import { Inter } from "next/font/google";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { X } from "lucide-react";
import { Visualization } from "../types";

import {DotLottieReact} from "@lottiefiles/dotlottie-react"

const inter = Inter({
  weight: '600',
  subsets: ['latin'],
})

interface ImageVisualizerProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: (v: Visualization) => void;
  visualization?: Visualization
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
        <div className="flex flex-col items-center gap-6">

          <Button
            size="lg"
            className="w-fit rounded-full p-2.5 bg-violet-800 text-white self-end"
            onPress={p.onClose}
          >
            <ButtonIcon as={X}/>
          </Button>

          <div className="relative h-[325px] w-[325px] rounded-xl overflow-clip">
          {p.visualization ?
            <Image
              src={p.visualization.img_url}
              alt=""
              fill={true}
              objectFit="cover"
            />
              :
            <DotLottieReact
              src="/image_loading.lottie"
              loop
              autoplay
            />
          }
          </div>

          <div className="w-full flex flex-col justify-center">
            {p.visualization ?
              <>
                <p className={inter.className + " p-2 w-full text-center text-xl text-white bg-slate-800 rounded-xl"}>
                  Image Generated
                </p>

                <Button
                  size="lg"
                  variant="link"
                  action="negative"
                  onPress={() => p.onDelete(p.visualization!)}
                >
                  <ButtonText>Delete Visualization</ButtonText>
                </Button>
              </>
                :
              <p className={inter.className + " p-2 w-full text-center text-xl text-white bg-violet-800 rounded-xl"}>
                Visualizing...
              </p>
            }

          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
