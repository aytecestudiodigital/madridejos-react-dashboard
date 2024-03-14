/* eslint-disable @typescript-eslint/ban-types */

import { useState } from "react";
import { deleteRow } from "../../../../server/supabaseQueries";
import { useTranslation } from "react-i18next";
import { Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle, HiTrash } from "react-icons/hi";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface DeleteRoleModalProps {
  role: any;
  closeModal: Function;
  onRoleDelete: (role: any) => void;
  disableButton: boolean;
}

export function DeleteRoleModal({
  role: role,
  onRoleDelete,
  disableButton,
}: DeleteRoleModalProps) {
  const { t } = useTranslation();
  const [isOpen, setOpen] = useState(false);
  const tableName = import.meta.env.VITE_TABLE_USER_ROLES;

  const confirmDelete = async (role: any) => {
    await deleteRow(role.id!, tableName);
    onRoleDelete(role);
    setOpen(false);
  };

  return (
    <>
      <Button
        disabled={disableButton}
        size="xs"
        color="failure"
        onClick={() => setOpen(true)}
      >
        <div className="flex items-end gap-x-2 text-white">
          <HiTrash className="text-sm text-white" />
          {t("DELETE")}
        </div>
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen} size="md">
        <Modal.Header className="px-6 pb-0 pt-6">
          <span className="sr-only">{t("DELETE")}</span>
        </Modal.Header>
        <Modal.Body className="px-6 pb-6">
          <div className="flex flex-col items-center gap-y-6 text-center">
            <HiOutlineExclamationCircle className="text-7xl text-red-500" />
            <p className="text-xl text-gray-500">{t("DELETE_ROL_ALERT")}</p>
            <div className="flex items-center gap-x-3">
              <Button color="failure" onClick={() => confirmDelete(role)}>
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
