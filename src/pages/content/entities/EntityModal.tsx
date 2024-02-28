import { Button, Modal } from "flowbite-react";
import { useEffect, useState } from "react";

interface EditEntityModalProps {
  showModal: boolean;
  closeModal: Function;
  onUser?: (data: any) => void;
}
export function EntityPageModal({
  showModal = false,
  closeModal,
}: EditEntityModalProps) {
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    setOpenModal(showModal);
  }, [showModal]);

  const close = () => {
    setOpenModal(false);
    closeModal();
  };

  return (
    <Modal show={openModal} size="7xl" onClose={() => close()}>
      <Modal.Header>Small modal</Modal.Header>
      <Modal.Body>
        <div className="space-y-6 p-6">
          <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
            With less than a month to go before the European Union enacts new
            consumer privacy laws for its citizens, companies around the world
            are updating their terms of service agreements to comply.
          </p>
          <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
            The European Union’s General Data Protection Regulation (G.D.P.R.)
            goes into effect on May 25 and is meant to ensure a common set of
            data rights in the European Union. It requires organizations to
            notify users as soon as possible of high-risk data breaches that
            could personally affect them.
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => close()}>I accept</Button>
        <Button color="gray" onClick={() => close()}>
          Decline
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
