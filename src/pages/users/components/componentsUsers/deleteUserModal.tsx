import { Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle, HiTrash } from "react-icons/hi";
import { AymoUser } from "../../models/AymoUser";
import { deleteUser } from "../../data/UsersProvider";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { PostgrestSingleResponse } from "@supabase/supabase-js";

interface DeleteUserModalProps {
  user: AymoUser;
  closeModal: Function;
  onUserDelete: (user: AymoUser | null | string) => void;
}

export function DeleteUserModal({
  user,
  closeModal,
  onUserDelete,
}: DeleteUserModalProps) {
  const { t } = useTranslation();
  const [isOpen, setOpen] = useState(false);

  const confirmDelete = async (user: AymoUser) => {
    const deletedUser = (await deleteUser(
      user,
    )) as PostgrestSingleResponse<null>;
    if (deletedUser.status === 204) {
      setOpen(false);
      onUserDelete(null);
    } else {
      onUserDelete(t("CAN_NOT_DELETE_USER"));
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
              <Button color="failure" onClick={() => confirmDelete(user)}>
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
