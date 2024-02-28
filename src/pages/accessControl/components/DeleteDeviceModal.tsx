import { Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle, HiTrash } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { AccessControl } from "../models/AccessControl";
import { deleteRow } from "../../../server/supabaseQueries";

interface DeleteDeviceModalProps {
  device: AccessControl;
  closeModal: Function;
  onDeviceDelete: (device: AccessControl | null | string) => void;
}

export function DeleteDeviceModal({
  device,
  closeModal,
  onDeviceDelete: onUserDelete,
}: DeleteDeviceModalProps) {
  const { t } = useTranslation();
  const [isOpen, setOpen] = useState(false);

  const confirmDelete = async (device: AccessControl) => {
    const deletedDevice = (await deleteRow(
      device.id!,
      "access_control",
    )) as PostgrestSingleResponse<null>;
    if (deletedDevice.status === 204) {
      setOpen(false);
      onUserDelete(null);
    } else {
      onUserDelete("No se puede borrar este usuario");
    }
    closeModal(true);
  };

  return (
    <>
      <Button size="xs" color="light" onClick={() => setOpen(true)}>
        <div className="flex items-center gap-x-2 text-red-500">
          <HiTrash className="text-sm text-red-500" />
          {t("DELETE")}
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
              <Button color="failure" onClick={() => confirmDelete(device)}>
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
