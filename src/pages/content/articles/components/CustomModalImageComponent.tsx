/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Card, TextInput, ToggleSwitch } from "flowbite-react";
import ModalImage from "react-modal-image";
import { useState } from "react";
import { HiTrash } from "react-icons/hi";
import { t } from "i18next";
import { LuMoveVertical } from "react-icons/lu";

interface ModalImageProps {
  url: string;
  imageName: string;
  index: any;
  state: boolean;
  type: string;
  onImageDelete: (index: any) => void;
  onChangeName: (index: any, imageName: any) => void;
  onFileDelete: (index: any) => void;
  onFileChangeName: (index: any, fileName: any) => void;
  onStateChange: (index: number, state: boolean) => void;
}

export default function CustomModalImage({
  url,
  imageName,
  state,
  index,
  onImageDelete: onImageDelete,
  onChangeName: onChangeName,
  type,
  onFileDelete: onFileDelete,
  onFileChangeName: onFileChangeName,
  onStateChange: onStateChange,
}: ModalImageProps) {
  const handleClick = async (index: any, type: string) => {
    if (type === "image") {
      onImageDelete(index);
    } else {
      onFileDelete(index);
    }
  };

  const [checked, setChecked] = useState(state);

  const handleCheck = (index: number) => {
    let newCheck;
    checked == true ? (newCheck = false) : (newCheck = true);
    setChecked(!checked);
    onStateChange(index, newCheck);
  };

  return (
    <>
      {type === "image" ? (
        <Card className="mb-4 p-2">
          <div className="grid grid-cols-12 gap-4 -my-4">
            <div className="col-span-3">
              <ModalImage className="h-32" small={url} large={url} />
            </div>
            <div className="col-span-8">
              <div className="flex justify-between">
                <p>
                  #{index + 1} {t("IMAGE_DETAILS")}
                </p>
                <ToggleSwitch
                  checked={checked}
                  onChange={() => handleCheck(index)}
                />
              </div>
              <TextInput
                onChange={(e) => onChangeName(index, e.currentTarget.value)}
                className="mt-4"
                type="text"
                defaultValue={imageName}
              />
              <TextInput
                className="mt-4"
                type="text"
                disabled
                defaultValue={url}
              />
              <Button
                onClick={() => handleClick(index, type)}
                size="xs"
                color="light"
                className="mt-4"
              >
                <div className="flex items-center gap-x-2 text-red-500">
                  <HiTrash className="text-xs text-red-500" />
                  {t("DELETE")}
                </div>
              </Button>
            </div>
            <div className="col-span-1 flex justify-center">
              <div className="mt-16">
                <LuMoveVertical className="cursor-move text-5xl" />
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="mb-4 p-2">
          <div className="grid grid-cols-12 gap-4 -my-4">
            <div className="col-span-3 flex items-center">
              <img src={"/images/logos/icon.png"} className="h-32" />
            </div>
            <div className="col-span-8">
              <div className="flex justify-between">
                <p>
                  #{index + 1} {t("FILE_DETAILS")}
                </p>
                <ToggleSwitch
                  checked={checked}
                  onChange={() => handleCheck(index)}
                />
              </div>
              <TextInput
                onChange={(e) => onFileChangeName(index, e.currentTarget.value)}
                className="mt-4"
                type="text"
                defaultValue={imageName}
              />
              <TextInput
                className="mt-4"
                type="text"
                disabled
                defaultValue={url}
              />
              <Button
                onClick={() => handleClick(index, type)}
                size="xs"
                color="light"
                className="mt-4"
              >
                <div className="flex items-center gap-x-2 text-red-500">
                  <HiTrash className="text-xs text-red-500" />
                  {t("DELETE")}
                </div>
              </Button>
            </div>
            <div className="col-span-1 flex justify-center">
              <div className="mt-16">
                <LuMoveVertical className="cursor-move text-5xl" />
              </div>
            </div>
          </div>
        </Card>
      )}
    </>
  );
}
