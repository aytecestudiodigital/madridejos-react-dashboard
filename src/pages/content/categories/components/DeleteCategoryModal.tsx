/* eslint-disable @typescript-eslint/ban-types */

import { useState } from "react";
import { deleteRow } from "../../../../server/supabaseQueries";
import { useTranslation } from "react-i18next";
import { Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle, HiTrash } from "react-icons/hi";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface DeleteCategoryModalProps {
  category: any;
  onCategoryDelete: (role: any) => void;
}

export function DeleteCategoryModal({
  category: category,
  onCategoryDelete,
}: DeleteCategoryModalProps) {
  const { t } = useTranslation();
  const [isOpen, setOpen] = useState(false);
  const tableName = import.meta.env.VITE_TABLE_CONTENT_CATEGORIES;

  const confirmDelete = async (category: any) => {
    await deleteRow(category.id!, tableName);
    onCategoryDelete(category);
    setOpen(false);
  };

  return (
    <>
      <Button size="sm" color="failure" onClick={() => setOpen(true)}>
        <div className="flex gap-x-1 text-white items-center">
          <HiTrash className="text-sm text-white" />
          {t("DELETE")}
        </div>
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen} size="md">
        <Modal.Header className="px-6 pb-0 pt-6">
          <span className="sr-only">{t("EDIT_USER_DELETE_LABEL")}</span>
        </Modal.Header>
        <Modal.Body className="px-6 pb-6 pt-0">
          <div className="flex flex-col items-center gap-y-6 text-center">
            <HiOutlineExclamationCircle className="text-7xl text-red-500" />
            <p className="text-xl text-gray-500">
              {t("DELETE_CATEGORY_ALERT")}
            </p>
            <div className="flex items-center gap-x-3">
              <Button color="failure" onClick={() => confirmDelete(category)}>
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
