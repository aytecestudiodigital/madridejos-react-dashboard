import { Button, Modal } from "flowbite-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { HiOutlineExclamationCircle, HiTrash } from "react-icons/hi";
import { deleteRow } from "../../../../server/supabaseQueries";
import { GroupUsers } from "../../models/GroupUser";
import { PostgrestSingleResponse } from "@supabase/supabase-js";

interface DeleteGroupModalProps {
  item: GroupUsers;
  closeModal: Function;
  onDeleteItem: (item: GroupUsers | null | string) => void;
  disableButton: boolean;
}

export function DeleteGroupModal({
  item: item,
  closeModal,
  onDeleteItem: onGroupDelete,
  disableButton,
}: DeleteGroupModalProps) {
  const { t } = useTranslation();
  const [isOpen, setOpen] = useState(false);
  const tableName = import.meta.env.VITE_TABLE_USER_GROUPS;

  const confirmDelete = async (group: GroupUsers) => {
    const deleteGroup = (await deleteRow(
      group.id!,
      tableName,
    )) as PostgrestSingleResponse<null>;
    if (deleteGroup.status === 204) {
      onGroupDelete(null);
    } else {
      onGroupDelete(t("CAN_NOT_DELETE_USER_GROUP"));
    }

    closeModal(true);
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
          {t("DELETE_GROUP")}
        </div>
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen} size="md">
        <Modal.Header className="px-6 pb-0 pt-6">
          <span className="sr-only">{t("EDIT_USER_DELETE_LABEL")}</span>
        </Modal.Header>
        <Modal.Body className="px-6 pb-6 pt-0">
          <div className="flex flex-col items-center gap-y-6 text-center">
            <HiOutlineExclamationCircle className="text-7xl text-red-500" />
            <p className="text-xl text-gray-500">{t("DELETE_GROUP_ALERT")}</p>
            <div className="flex items-center gap-x-3">
              <Button color="failure" onClick={() => confirmDelete(item)}>
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
