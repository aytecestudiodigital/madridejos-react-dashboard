/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle, HiTrash } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import { useContext, useState } from "react";
import { AlertContext } from "../context/AlertContext";

interface DeleteModalProps {
  data: any;
  deleteFn: Function;
  onlyIcon: boolean;
  toastSuccessMsg: string;
  toastErrorMsg: string;
  title?: string;
  disableButton: boolean;
}

export function DeleteModal({
  data,
  deleteFn,
  onlyIcon,
  toastSuccessMsg,
  toastErrorMsg,
  title,
  disableButton,
}: DeleteModalProps) {
  const { t } = useTranslation();
  const { openAlert } = useContext(AlertContext);
  const [isOpen, setOpen] = useState(false);
  title ? title : t("DELETE");
  const confirmDelete = async (item: any) => {
    const deleteItem = await deleteFn(item);
    setOpen(false);
    if (deleteItem === undefined) {
      openAlert(toastSuccessMsg, "delete");
    } else {
      openAlert(toastErrorMsg, "error");
    }
  };

  return (
    <>
      <Button
        disabled={disableButton}
        size="sm"
        color="light"
        onClick={() => setOpen(true)}
      >
        <div className="flex items-center gap-x-2 text-red-500">
          <HiTrash className="text-sm text-red-500" />
          {!onlyIcon && title}
        </div>
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen} size="md">
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
              <Button color="failure" onClick={() => confirmDelete(data)}>
                {t("DELETE_BUTTON_OK")}
              </Button>
              <Button color="gray" onClick={() => setOpen(false)}>
                {t("DELETE_BUTTON_KO")}
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
