import { Button, ButtonText } from "@/components/ui/button";
import {
  Drawer,
  DrawerBackdrop,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader
} from "@/components/ui/drawer";
import { Heading } from "@/components/ui/heading";
import { Link, LinkText } from "@/components/ui/link";
import { NavItem } from "epubjs";

interface TableOfContentsProps {
  isOpen: boolean;
  onClose: () => void;
  toc: NavItem[];
  onItemPress: (item: NavItem) => void;
}

export default function TableOfContents(p: TableOfContentsProps) {
  return (
    <Drawer
      isOpen={p.isOpen}
      onClose={p.onClose}
      size="lg"
      anchor="left"
    >
      <DrawerBackdrop />
      <DrawerContent>

        <DrawerHeader>
          <Heading size="3xl">Table of Contents</Heading>
        </DrawerHeader>

        <DrawerBody>
          {p.toc.map((item, i) => (
            <Link key={i} onPress={() => p.onItemPress(item)}>
              <LinkText>{item.label}</LinkText>
            </Link>
          ))}
        </DrawerBody>

        <DrawerFooter>
          <Button onPress={p.onClose} className="flex-1">
            <ButtonText>Close</ButtonText>
          </Button>
        </DrawerFooter>

      </DrawerContent>
    </Drawer>
  )
}
