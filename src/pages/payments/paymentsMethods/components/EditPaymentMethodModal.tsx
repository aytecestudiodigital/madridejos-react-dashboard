import { ErrorMessage } from "@hookform/error-message";
import {
  Button,
  Label,
  Modal,
  Select,
  TextInput,
  ToggleSwitch,
} from "flowbite-react";
import { ChangeEvent, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { DeleteModal } from "../../../../components/DeleteModal";
import {
  deleteRow,
  insertRow,
  updateRow,
} from "../../../../server/supabaseQueries";
import { PaymentsMethod } from "../models/PaymentsMethods";

interface EditMethodProps {
  item: PaymentsMethod | null;
  types: string[];
  openModal: boolean;
  closeModal: Function;
}

export function EditPaymentMethodModal({
  item: item,
  openModal = false,
  closeModal,
  types: types,
}: EditMethodProps) {
  const { t } = useTranslation();
  const [isOpen, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [loading, setLoading] = useState(false);
  const [switchEnable, setSwitchEnable] = useState(false);

  const { handleSubmit, register, formState, reset } = useForm<any>({
    values: item ?? undefined,
    mode: "onBlur",
    reValidateMode: "onBlur",
    criteriaMode: "all",
  });

  const { errors } = formState;
  const { isValid } = formState;
  const orgId = import.meta.env.VITE_ORG_ID;

  const deletePaymentMethod = async () => {
    try {
      await deleteRow(item!.id!, "payments_methods");
      closeModal(true);
    } catch (error) {}
  };

  const onSubmit: SubmitHandler<PaymentsMethod> = async (data) => {
    if (isValid) {
      setLoading(true);
      const itemUpdated = item?.id
        ? ((await updateRow(
            {
              ...data,
              org_id: orgId,
              enable: switchEnable,
            },
            "payments_methods",
          )) as PaymentsMethod)
        : ((await insertRow(
            {
              ...data,
              org_id: orgId,
              enable: switchEnable,
            },
            "payments_methods",
          )) as PaymentsMethod);

      close(itemUpdated);
      setLoading(false);
    }
  };

  useEffect(() => {
    reset({
      id: item ? item.id : undefined,
      title: item ? item.title : undefined,
      terminal: item ? item.terminal : null,
      merchant_code: item ? item.merchant_code : null,
      key_signature_sandbox: item ? item.key_signature_sandbox : null,
      type: item
        ? typesFilters.find((typeFilter) => typeFilter.title === item.type)
            ?.title
        : null,
      viafirma_group: item ? item.viafirma_group : null,
      viafirma_template: item ? item.viafirma_template : null,
      enviroment: item ? item.enviroment : null,
    });
    setSwitchEnable(item ? item.enable : false);
    setSelectedType(item ? item.type : "");
    setOpen(openModal);
  }, [openModal]);

  const selectedTypeTitle = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.currentTarget.value; // Get the selected title directly
    setSelectedType(selectedValue);
  };

  const close = (item: PaymentsMethod | null) => {
    reset();
    setOpen(false);
    closeModal(item ? true : false);
  };

  const typesFilters: { title: string; id: number }[] = [];
  const idSet = new Set();
  let count: number = 0;

  types.forEach((item) => {
    const title = item;
    let id: number | null = null;

    if (!idSet.has(id)) {
      id = count += 1;
      typesFilters.push({ title: title, id: id });
      idSet.add(id);
    }
  });

  return (
    <>
      <Modal size={"lg"} dismissible onClose={() => close(null)} show={isOpen}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
            {item ? (
              <strong>{t("EDIT_METHOD")}</strong>
            ) : (
              <strong>{t("ADD_METHOD")}</strong>
            )}
          </Modal.Header>
          <Modal.Body>
            {item && item.id && (
              <div className="flex justify-end items-center text-gray-800">
                <DeleteModal
                  data={item}
                  deleteFn={deletePaymentMethod}
                  onlyIcon={false}
                  toastSuccessMsg={t("METHOD_DELETE_OK")}
                  toastErrorMsg={t("METHOD_DELETE_KO")}
                  title={t("DELETE_METHOD")}
                />
              </div>
            )}

            <div className="max-h-[60vh]">
              <div className="pb-4">
                <Label htmlFor="title">{t("TITLE")}</Label>
                <div className="mt-1">
                  <TextInput
                    id="title"
                    placeholder={t("TITLE")}
                    {...register("title")}
                  />
                </div>
              </div>

              <div className="pb-4">
                <Label htmlFor="type" color={errors.type && "failure"}>
                  {t("TYPE")} *
                </Label>
                <div className="mt-1">
                  <Select
                    id="type"
                    {...register("type", {
                      required: t("FORM_ERROR_MSG_REQUIRED"),
                    })}
                    defaultValue={selectedType} // Set the default value to the title
                    color={errors.type && "failure"}
                    onChange={selectedTypeTitle}
                  >
                    <option disabled value="">
                      {t("SELECT")}
                    </option>
                    {types &&
                      typesFilters.map((item) => (
                        <option key={item.id} value={item.title}>
                          {t(item.title)}
                        </option>
                      ))}
                  </Select>
                </div>
                <ErrorMessage
                  errors={errors}
                  name="type"
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

              <div className="pb-4">
                <Label
                  htmlFor="enviroment"
                  color={errors.enviroment && "failure"}
                >
                  {t("ENVIROMENT")} *
                </Label>
                <div className="mt-1">
                  <Select
                    id="enviroment"
                    {...register("enviroment", {
                      required: t("FORM_ERROR_MSG_REQUIRED"),
                    })}
                    defaultValue={item ? item.enviroment : ""}
                    color={errors.enviroment && "failure"}
                  >
                    <option value="">{t("SELECT")}</option>
                    <option value="PRODUCTION">{t("PRODUCTION")}</option>
                    <option value="DEVELOP">{t("DEVELOP")}</option>
                  </Select>
                </div>
                <ErrorMessage
                  errors={errors}
                  name="enviroment"
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

              {selectedType === "TPV" ? (
                <>
                  <div className="pb-4">
                    <Label htmlFor="terminal">{t("TERMINAL")}</Label>
                    <div className="mt-1">
                      <TextInput
                        id="terminal"
                        placeholder={t("TERMINAL")}
                        {...register("terminal")}
                      />
                    </div>
                  </div>

                  <div className="pb-4">
                    <Label htmlFor="merchant_code">{t("MERCHANT_CODE")}</Label>
                    <div className="mt-1">
                      <TextInput
                        id="merchant_code"
                        placeholder={t("MERCHANT_CODE")}
                        {...register("merchant_code")}
                      />
                    </div>
                  </div>

                  <div className="pb-4">
                    <Label htmlFor="key_signature_sandbox">
                      {t("KEY_SIGNATURE")}
                    </Label>
                    <div className="mt-1">
                      <TextInput
                        id="key_signature_sandbox"
                        placeholder={t("KEY_SIGNATURE")}
                        {...register("key_signature_sandbox")}
                      />
                    </div>
                  </div>
                </>
              ) : selectedType === "DEBIT" ? (
                <>
                  <div className="pb-4">
                    <Label htmlFor="viafirma_group">
                      {t("VIAFIRMA_GROUP")}
                    </Label>
                    <div className="mt-1">
                      <TextInput
                        id="viafirma_group"
                        placeholder={t("VIAFIRMA_GROUP")}
                        {...register("viafirma_group")}
                      />
                    </div>
                  </div>

                  <div className="pb-4">
                    <Label htmlFor="viafirma_template">
                      {t("VIAFIRMA_TEMPLATE")}
                    </Label>
                    <div className="mt-1">
                      <TextInput
                        id="viafirma_template"
                        placeholder={t("VIAFIRMA_TEMPLATE")}
                        {...register("viafirma_template")}
                      />
                    </div>
                  </div>
                </>
              ) : null}

              <ToggleSwitch
                className="mt-4 pb-5"
                checked={switchEnable}
                label={t("ENABLE")}
                onChange={setSwitchEnable}
              />
            </div>
          </Modal.Body>
          <Modal.Footer className="flex place-content-end">
            <Button
              disabled={!isValid}
              color="primary"
              type="submit"
              isProcessing={loading}
            >
              {loading ? t("LOADING") : t("SAVE_METHOD")}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}
