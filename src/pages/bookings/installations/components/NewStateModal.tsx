import { Button, Checkbox, Label, Modal, TextInput } from "flowbite-react";
import { ChangeEvent, useState } from "react";
import { ColorResult } from "react-color";
import Circle from "react-color/lib/components/circle/Circle";
import { useTranslation } from "react-i18next";
import { HiPlus } from "react-icons/hi";

interface NewStateModalProps {
  onSave: (title: string, color: string, bookeable: boolean) => void;
}
export const NewStateModal = ({ onSave }: NewStateModalProps) => {
  const { t } = useTranslation();
  const [currentColor, setcurrentColor] = useState<string>("#4caf50");
  const [title, setTitle] = useState<string>("");
  const [bookeable, setBookeable] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const onChangeColor = (color: ColorResult) => {
    setcurrentColor(color.hex);
  };

  const onChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const onChangeBookeable = (event: ChangeEvent<HTMLInputElement>) => {
    setBookeable(event.target.checked);
  };

  const saveState = () => {
    setOpenModal(false);
    onSave(title, currentColor, bookeable);
    setcurrentColor("#4caf50");
    setTitle("");
    setBookeable(false);
  };

  return (
    <>
      <Button
        size="xs"
        className="bg-primary"
        onClick={() => setOpenModal(true)}
      >
        <HiPlus />
        <div className="ml-1">{t("ADD_BTN")}</div>
      </Button>
      <Modal show={openModal} onClose={() => setOpenModal(false)} size="sm">
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>{t("INSTALLATION_STATES_MODAL_TITLE")}</strong>
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <TextInput
              value={title}
              onChange={(event) => onChangeTitle(event)}
              required
            />
            <Circle
              color={currentColor}
              onChange={onChangeColor}
              className="!mx-auto"
            />
            <div className="flex items-center gap-2">
              <Checkbox
                id="bookeable"
                checked={bookeable}
                onChange={(event) => onChangeBookeable(event)}
              />
              <Label htmlFor="bookeable" className="flex">
                {t("STATE_BOOKABLE")}
              </Label>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="flex flex-row justify-end">
          <Button color="primary" onClick={saveState}>
            {t("SAVE")}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
