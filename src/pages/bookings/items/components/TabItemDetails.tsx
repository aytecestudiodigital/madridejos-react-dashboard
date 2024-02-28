/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorMessage } from "@hookform/error-message";
import { Label, TextInput, ToggleSwitch } from "flowbite-react";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ItemModel } from "../models/ItemModel";
import { DeleteModal } from "../../../../components/DeleteModal";
import { deleteRow } from "../../../../server/supabaseQueries";
import { UploadArea } from "../../../../components/UploadFilesArea/UploadFilesArea";
import ModalImage from "react-modal-image";
import { useNavigate } from "react-router-dom";

interface ItemTabProps {
  deleteButtonLabel: string;
  deleteOKLabel: string;
  deleteKOLabel: string;
  item: ItemModel | null;
  onChangeData: (data: any) => void;
}

export const TabItemDetails = (props: ItemTabProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [itemData, setItemData] = useState<ItemModel>();
  const tableName = import.meta.env.VITE_TABLE_BOOKINGS_ITEMS;
  const [images, setImages] = useState<any>(itemData?.image ?? []);
  const [switchNotifiable, setSwitchNotifiable] = useState<boolean>(false);
  const [installationId, setInstallationId] = useState("");

  useEffect(() => {
    if (props.item) {
      setItemData(props.item);
      setSwitchNotifiable(props.item.state!);
      setInstallationId(props.item.installation_id);
      setImages(props.item.image);
    } else {
      setValue("image", null);
    }
  }, [props.item]);

  const { register, formState, setValue, getValues } = useFormContext();

  const { errors } = formState;

  const onChangeInput = () => {
    const data = getValues();
    const object = {
      title: data.title,
      description: data.description,
      image: data.image !== undefined ? data.image : null,
      order: data.order,
      state: switchNotifiable,
    };
    props.onChangeData(object);
  };

  useEffect(() => {
    setValue("state", switchNotifiable);
  }, [switchNotifiable]);

  useEffect(() => {
    onChangeInput();
  }, [props.item]);

  const deleteDependency = async () => {
    try {
      if (itemData) {
        await deleteRow(itemData!.id!, tableName);
        navigate(`/bookings/installations/${installationId}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onUploadFiles = (filesUrl: any[]) => {
    const newArray: string[] = [];
    filesUrl.forEach((image) => {
      newArray.push(image.url);
    });
    setImages(newArray);
    setValue("image", newArray[0]);
    onChangeInput();
  };

  return (
    <div className="flex flex-col gap-4 mb-5">
      <div>
        <Label htmlFor="name" color={errors.title && "failure"}>
          {t("TITLE")} *
        </Label>
        <div className="mt-1">
          <TextInput
            placeholder={t("CONTENT_TITLE")}
            {...register("title", {
              required: t("FORM_ERROR_MSG_REQUIRED"),
            })}
            onBlur={() => onChangeInput()}
            color={errors.title && "failure"}
          />
        </div>
        <ErrorMessage
          errors={errors}
          name="title"
          render={({ messages }) =>
            messages &&
            Object.entries(messages).map(([type, message]) => (
              <p
                className="mt-2 text-sm text-red-600 dark:text-red-500"
                key={type}
              >
                {message}
              </p>
            ))
          }
        />
      </div>

      <div>
        <Label htmlFor="description" color={errors.description && "failure"}>
          {t("DESCRIPTION")} *
        </Label>
        <div className="mt-1">
          <TextInput
            placeholder={t("DESCRIPTION")}
            {...register("description", {
              required: t("FORM_ERROR_MSG_REQUIRED"),
            })}
            onBlur={() => onChangeInput()}
            color={errors.description && "failure"}
          />
        </div>
        <ErrorMessage
          errors={errors}
          name="description"
          render={({ messages }) =>
            messages &&
            Object.entries(messages).map(([type, message]) => (
              <p
                className="mt-2 text-sm text-red-600 dark:text-red-500"
                key={type}
              >
                {message}
              </p>
            ))
          }
        />
      </div>

      <div>
        <Label htmlFor="order" color={errors.order && "failure"}>
          {t("CATEGORY_ORDER_REQUIRED")}
        </Label>
        <input
          id="order"
          type="number"
          aria-describedby="helper-text-explanation"
          className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder={"0"}
          min="0"
          {...register("order", {
            required: t("FORM_ERROR_MSG_REQUIRED"),
          })}
          onBlur={() => onChangeInput()}
          required
        />
        <ErrorMessage
          errors={errors}
          name="order"
          render={({ messages }) =>
            messages &&
            Object.entries(messages).map(([type, message]) => (
              <p
                className="mt-2 text-sm text-red-600 dark:text-red-500"
                key={type}
              >
                {message}
              </p>
            ))
          }
        />
      </div>
      <div>
        {images &&
          images.map((image: any, index: any) => (
            <div key={index} className="flex justify-center p-2">
              <ModalImage
                key={index}
                small={image}
                large={image}
                className="h-32"
              />
            </div>
          ))}
      </div>
      <div>
        <UploadArea
          onUpload={onUploadFiles}
          height="200px"
          maxFiles={1}
          fileTypes={["image/*"]}
          location={"bookings/installations"}
        />
      </div>
      <div className="flex justify-between items-center">
        <DeleteModal
          data={itemData}
          deleteFn={deleteDependency}
          onlyIcon={false}
          toastSuccessMsg={props.deleteOKLabel}
          toastErrorMsg={props.deleteKOLabel}
          title={props.deleteButtonLabel}
        />
        <ToggleSwitch
          checked={switchNotifiable}
          label={t("ENABLE")}
          onChange={setSwitchNotifiable}
          onBlur={() => onChangeInput()}
        />
      </div>
    </div>
  );
};
