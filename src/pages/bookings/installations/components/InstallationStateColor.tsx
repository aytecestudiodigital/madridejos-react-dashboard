import { Button, Checkbox, Label, Modal, TextInput } from "flowbite-react";
import Circle from "react-color/lib/components/circle/Circle";
import { DeleteModal } from "../../../../components/DeleteModal";
import { HiOutlinePencil } from "react-icons/hi";
import { ChangeEvent, useState } from "react";
import { ColorResult } from "react-color";
import { useTranslation } from "react-i18next";
import { InstallationStatesModel } from "../models/InstallationStatesModel";

interface StateColorProps {
  state: InstallationStatesModel;
  onSave: (title: string, color: string, bookeable: boolean) => void;
  onDelete: (state: InstallationStatesModel) => void;
}
export const InstallationStateColor = ({
  state,
  onSave,
  onDelete,
}: StateColorProps) => {
  const { t } = useTranslation();
  const [currentColor, setcurrentColor] = useState<string>(
    state.color ?? "#4caf50",
  );
  const [title, setTitle] = useState<string>(state.title ?? "");
  const [bookeable, setBookeable] = useState<boolean>(state.bookeable ?? false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openMenu, setOpenMenu] = useState<boolean>(false);

  const user = JSON.parse(localStorage.getItem("userLogged")!);

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
  };

  const deleteState = () => {
    onDelete(state);
  };

  return (
    <>
      <div className="flex flex-row justify-start items-center border-b py-4">
        <div
          className="w-8 h-8 rounded mr-4"
          style={{ backgroundColor: state.color! }}
        ></div>
        <div className="flex flex-col grow">
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {state.title}
          </span>
          <span className="text-xs text-gray-400 dark:text-white">
            {state.bookeable ? "Reservable" : "No reservable"}
          </span>
        </div>
        <div className="flex flex-row gap-2">
          <Button
            size="xs"
            color="light"
            onClick={() => setOpenModal(!openMenu)}
          >
            <HiOutlinePencil />
          </Button>
          <DeleteModal
            data={state}
            deleteFn={deleteState}
            onlyIcon={true}
            toastSuccessMsg={t("DELETE_STATE_OK")}
            toastErrorMsg={t("DELETE_STATE_KO")}
            disableButton={
              !user.users_roles.rules.bookings.installation_state.delete
            }
          />
        </div>
      </div>
      <Modal
        show={openModal}
        onClose={() => {
          setOpenModal(false);
          setOpenMenu(false);
        }}
        size="sm"
      >
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
          <Button
            size={"sm"}
            disabled={
              !user.users_roles.rules.bookings.installation_state.update
            }
            color="primary"
            onClick={saveState}
          >
            {t("SAVE")}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
