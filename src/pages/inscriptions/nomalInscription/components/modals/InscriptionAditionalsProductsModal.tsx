import { ErrorMessage } from "@hookform/error-message";
import {
  Button,
  Label,
  Modal,
  Select,
  TextInput,
  ToggleSwitch,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface InscriptionActivitiesProductsModalProps {
  item?: any;
  openModal: boolean;
  onCloseModal: (data: any) => void;
  editedRowIndex?: number | undefined;
  setInputs: (data: any, editedRowIndex: number | undefined) => void;
}

export const InscriptionAditionalsProductsModal = (
  props: InscriptionActivitiesProductsModalProps,
) => {
  const [isOpen, setIsOpen] = useState(false);
  const [unique, setUnique] = useState(
    props.item ? props.item.advanced : false,
  );
  const [enable, setEnable] = useState(props.item ? props.item.enabled : true);
  const [required, setRequired] = useState(
    props.item ? props.item.required : false,
  );
  const { t } = useTranslation();
  const { handleSubmit, register, formState, reset } = useForm<any>({
    values: props.item ?? undefined,
    mode: "onBlur",
    reValidateMode: "onBlur",
    criteriaMode: "all",
  });

  const { errors } = formState;
  const { isValid } = formState;

  useEffect(() => {
    reset();
    setIsOpen(props.openModal);
  }, [props.openModal]);

  const close = () => {
    reset();
    setIsOpen(false);
    props.onCloseModal(true);
  };

  //? TODO - unique - no está en la bbdd
  const onSubmit: SubmitHandler<any> = async (data) => {
    const newProductForm = {
      title: data.title,
      places: data.places,
      price: data.price,
      required: required,
      enabled: enable,
      advanced: false,
      applicable_discounts: false,
      unique: unique,
      days: null,
      is_additional: true,
      waiting_list: false,
      years: null,
      observations: null,
      order: null,
      place: null,
      teacher: null,
      time_end: null,
      time_init: null,
    };
    props.setInputs(newProductForm, props.editedRowIndex!);
    close();
  };

  return (
    <Modal dismissible onClose={() => close()} show={isOpen}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          Añadir/Editar producto adicional
        </Modal.Header>
        <Modal.Body className="max-h-[70vh] overflow-auto">
          <>
            <div>
              <Label htmlFor="title" color={errors.title && "failure"}>
                Nombre de la actividad *
              </Label>
              <div className="mt-1">
                <TextInput
                  id="title"
                  placeholder="Nombre de la actividad"
                  {...register("title", {
                    required: t("FORM_ERROR_MSG_REQUIRED"),
                  })}
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
              <div className="mr-4">
                <Label htmlFor="price" color={errors.price && "failure"}>
                  Precio *
                </Label>
                <div className="mt-1">
                  <TextInput
                    id="price"
                    placeholder="Precio €"
                    type="number"
                    {...register("price", {
                      required: t("FORM_ERROR_MSG_REQUIRED"),
                    })}
                    color={errors.price && "failure"}
                  />
                </div>
                <ErrorMessage
                  errors={errors}
                  name="price"
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
                <Label htmlFor="places" color={errors.places && "failure"}>
                  Plazas *
                </Label>
                <div className="mt-1">
                  <Select
                    id="places"
                    {...register("places", {
                      required: t("FORM_ERROR_MSG_REQUIRED"),
                    })}
                    color={errors.places && "failure"}
                  >
                    <option key={"UNLIMITED"} value={"Ilimitadas"}>
                      Ilimitadas
                    </option>
                    {[...Array(200).keys()].map((item) => (
                      <option key={item} value={item + 1}>
                        {item + 1}
                      </option>
                    ))}
                  </Select>
                </div>
                <ErrorMessage
                  errors={errors}
                  name="places"
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
            </div>

            <div className="flex mt-8">
              <div className="flex flex-grow items-center">
                <ToggleSwitch
                  id={"unique"}
                  checked={unique}
                  label={"Único"}
                  onChange={setUnique}
                />
              </div>

              <div className="flex flex-grow items-center">
                <ToggleSwitch
                  id={"required"}
                  checked={required}
                  label={"Obligatorio"}
                  onChange={setRequired}
                />
              </div>

              <div className="flex justify-end">
                <ToggleSwitch
                  id={"enable"}
                  checked={enable}
                  label={"Habilitado"}
                  onChange={setEnable}
                />
              </div>
            </div>
          </>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex flex-grow justify-end">
            <Button
              size={"sm"}
              disabled={!isValid}
              type="submit"
              color="primary"
            >
              {t("SAVE")}
            </Button>
          </div>
        </Modal.Footer>
      </form>
    </Modal>
  );
};
