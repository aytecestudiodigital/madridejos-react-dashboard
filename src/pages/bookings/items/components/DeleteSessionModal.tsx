/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Modal } from "flowbite-react";
import { t } from "i18next";
import { useContext, useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { deleteRow } from "../../../../server/supabaseQueries";
import { AlertContext } from "../../../../context/AlertContext";

interface DeleteSessionModal {
  openModal: boolean;
  sessions: any;
  closeModal: (state: boolean) => void;
}

export function DeleteSessionModal({
  openModal,
  closeModal,
  sessions,
}: DeleteSessionModal) {
  const [isOpen, setOpen] = useState(false);
  const tableBookingsSessions = import.meta.env.VITE_TABLE_BOOKINGS_SESSIONS;
  const { openAlert } = useContext(AlertContext);

  const close = () => {
    setOpen(false);
    closeModal(true);
  };

  useEffect(() => {
    setOpen(openModal);
  }, [openModal]);

  const confirmDelete = async () => {
    for await (const session of sessions) {
      await deleteRow(session.id, tableBookingsSessions);
    }
    if (sessions.length > 1) {
      openAlert(t("DELETE_SESSIONS_OK"), "delete");
    } else {
      openAlert(t("DELETE_SESSION_OK"), "delete");
    }
    close();
  };

  return (
    <Modal onClose={() => close()} show={isOpen} size="md">
      <Modal.Header className="px-6 pb-0 pt-6">
        <span className="sr-only">{t("DELETE")}</span>
      </Modal.Header>
      <Modal.Body className="px-6 pb-6 pt-0">
        <div className="flex flex-col items-center gap-y-6 text-center">
          <HiOutlineExclamationCircle className="text-7xl text-red-500" />
          <p className="text-xl text-gray-500">
            {t("DELETE_MODAL_DESCRIPTION")}
          </p>
          <div className="flex items-center gap-x-3">
            <Button color="failure" onClick={() => confirmDelete()}>
              {t("DELETE_BUTTON_OK")}
            </Button>
            <Button color="gray" onClick={() => close()}>
              {t("DELETE_BUTTON_KO")}
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
