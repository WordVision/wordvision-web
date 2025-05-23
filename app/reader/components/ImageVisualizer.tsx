import Image from "next/image";
import { Inter } from "next/font/google";
import { Drawer } from "vaul";
import { DotLottieReact } from "@lottiefiles/dotlottie-react"

import { Button, ButtonText } from "@/components/ui/button";

import { Visualization } from "../types";

const interBold = Inter({
  weight: '600',
  subsets: ['latin'],
})

const interNormal = Inter({
  weight: '400',
  subsets: ['latin'],
})

interface ImageVisualizerProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: (v: Visualization) => void;
  visualization?: Visualization;
  error?: string;
}

export default function ImageVisualizer(p: ImageVisualizerProps) {
  return (
    <Drawer.Root
      open={p.isOpen}
      onClose={p.onClose}
      dismissible={p.visualization !== undefined || p.error !== undefined}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40"/>
        <Drawer.Content className="px-6 pb-6 pt-4 bg-gray-100 h-fit fixed bottom-0 left-0 right-0 outline-none rounded-t-xl overflow-clip">
          <div aria-hidden className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-4" />
          <div className="w-full h-full flex flex-col gap-4">
            {p.error ?
              <div className="aspect-square w-full rounded-xl bg-red-200 p-8">
                <p className={interNormal.className + " text-lg"}>{p.error}</p>
              </div>
            :
              <div className="relative aspect-square w-full rounded-xl overflow-clip">
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
            }
            <div className="w-full flex flex-col justify-center">
              {p.error ?
                <button
                  className={interBold.className + " p-2 w-full text-center text-xl text-white bg-red-800 rounded-xl"}
                  onClick={p.onClose}
                >
                  Close
                </button>
              : p.visualization ?
                <>
                  <p className={interBold.className + " p-2 w-full text-center text-xl text-white bg-slate-800 rounded-xl"}>
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
                <p className={interBold.className + " p-2 w-full text-center text-xl text-white bg-violet-800 rounded-xl"}>
                  Visualizing...
                </p>
              }
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
