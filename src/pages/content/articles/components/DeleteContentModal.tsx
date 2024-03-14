/* eslint-disable @typescript-eslint/ban-types */

import { useContext, useState } from "react";
import { deleteRow } from "../../../../server/supabaseQueries";
import { useTranslation } from "react-i18next";
import { Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle, HiTrash } from "react-icons/hi";
import { AlertContext } from "../../../../context/AlertContext";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface DeleteContentModalProps {
  content: any;
  closeModal: Function;
  onContentDelete: (content: any) => void;
}

export function DeleteContentModal({
  content: content,
  onContentDelete,
}: DeleteContentModalProps) {
  const { t } = useTranslation();
  const [isOpen, setOpen] = useState(false);
  const tableName = import.meta.env.VITE_TABLE_CONTENT;
  const { openAlert } = useContext(AlertContext);

  const confirmDelete = async (content: any) => {
    await deleteRow(content.id!, tableName);
    openAlert(t("DELETE_CONTENT_OK"), "delete");
    onContentDelete(content);
    setOpen(false);
  };

  const user = JSON.parse(localStorage.getItem("userLogged")!);
  const userGroupId = localStorage.getItem("groupSelected");

  return (
    <>
      <Button
        size="sm"
        disabled={
          (!user.users_roles.rules.content.contents.delete_all &&
            !user.users_roles.rules.content.contents.delete_group &&
            !user.users_roles.rules.content.contents.delete_own) ||
          (!user.users_roles.rules.content.contents.delete_all &&
            user.users_roles.rules.content.contents.delete_group &&
            userGroupId !== content.group_id) ||
          (!user.users_roles.rules.content.contents.delete_all &&
            !user.users_roles.rules.content.contents.delete_group &&
            user.users_roles.rules.content.contents.delete_own &&
            user.id !== content.created_by)
        }
        color="failure"
        onClick={() => setOpen(true)}
      >
        <div className="flex gap-x-1 text-white items-center">
          <HiTrash className="text-sm text-white" />
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
            <p className="text-xl text-gray-500">{t("DELETE_CONTENT_ALERT")}</p>
            <div className="flex items-center gap-x-3">
              <Button color="failure" onClick={() => confirmDelete(content)}>
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
