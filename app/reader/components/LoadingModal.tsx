import { Modal, ModalBackdrop, ModalContent } from "@/components/ui/modal"
import { Spinner } from "@/components/ui/spinner";

interface LoadingModalProps {
  isOpen: boolean;
  onClose: () => void;
  text: string;
}

export default function LoadingModal(p: LoadingModalProps) {
  return (
    <Modal
      isOpen={p.isOpen}
      onClose={p.onClose}
      size="lg"
      closeOnOverlayClick={false}
    >
      <ModalBackdrop />
      <ModalContent>
        <div className="min-h-[150px] flex flex-col justify-center gap-2">
          <Spinner size="large"/>
          <p className="text-center text-lg text-black">{p.text}</p>
        </div>
      </ModalContent>
    </Modal>
  )
}
