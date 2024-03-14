/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorMessage } from "@hookform/error-message";
import { Button, Label, Modal, Select, TextInput } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { getOneRow } from "../../../../../server/supabaseQueries";
import { InscriptionFormContext } from "../../context/InscriptionFormContext";

interface InscriptionActivitiesProductsModalProps {
  item?: any;
  openModal: boolean;
  onCloseModal: (data: any) => void;
  editedRowIndex?: number | undefined;
  setInputs: (data: any, editedRowIndex: number | undefined) => void;
}

export const InscriptionDiscountsModal = (
  props: InscriptionActivitiesProductsModalProps,
) => {
  const [isOpen, setIsOpen] = useState(false);
  const [discountType, setDiscountType] = useState(
    props.item ? props.item.discount_type : "PERCENTAGE",
  );
  const [amountLabel, setAmountLabel] = useState("%");
  const [applicationMethod, setApplicationMethod] = useState(
    props.item ? props.item.discount_method : "USER_SELECTION",
  );
  const [methodsTypes, setMethodsTypes] = useState<any[]>([]);
  const [selectedType, setSelectedType] = useState(
    props.item ? props.item.discount_by_method : "",
  );

  const [discount, setDiscount] = useState(
    props.item ? (props.item.discount === true ? "true" : "false") : "true",
  );
  const [productsUnit, setProductsUnit] = useState(
    props.item
      ? props.item.products_unit === true
        ? "true"
        : "false"
      : "true",
  );
  const { t } = useTranslation();
  const entity_table = import.meta.env.VITE_TABLE_PAYMENTS_METHOD;
  const contextMethods = useContext(InscriptionFormContext);

  const { handleSubmit, register, formState, reset } = useForm<any>({
    values: props.item ?? undefined,
    mode: "onBlur",
    reValidateMode: "onBlur",
    criteriaMode: "all",
  });

  const { errors } = formState;
  const { isValid } = formState;

  const getTotalMethods = async () => {
    const methodsSelected = contextMethods.getPaymentMethods();
    const methodsBd: any[] = [];
    if (methodsSelected.length > 0) {
      for await (const method of methodsSelected) {
        const methodBd = await getOneRow(
          "id",
          method.payment_method_id,
          entity_table,
        );
        methodsBd.push(methodBd);
      }
    }
    setMethodsTypes(methodsBd);
  };

  useEffect(() => {
    reset();
    getTotalMethods();
    setIsOpen(props.openModal);
  }, [props.openModal]);

  const close = () => {
    reset();
    setIsOpen(false);
    props.onCloseModal(true);
  };

  const onSubmit = (data: any) => {
    const newProductForm = {
      /*  created_by / updated_by */ //TODO - meter esto en todas las tablas que lo necesiten
      observations: data.observations,
      enabled: true,
      discount_type: discountType,
      discount: discount === "true" ? true : false,
      discount_method: applicationMethod,
      discount_by_method: selectedType !== "" ? selectedType : null,
      title: data.title,
      amount: data.amount,
      products: data.products ? data.products : null,
      products_unit: productsUnit === "true" ? true : false,
    };
    props.setInputs(newProductForm, props.editedRowIndex!);
    close();
  };

  const handleLabels = (e: any) => {
    setDiscountType(e);
    e === "FIXED" ? setAmountLabel("€") : setAmountLabel("%");
  };

  return (
    <Modal dismissible onClose={() => close()} show={isOpen}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          Añadir/Editar descuento o incremento
        </Modal.Header>
        <Modal.Body className="max-h-[70vh] overflow-auto">
          <>
            <div>
              <Label htmlFor="title" color={errors.title && "failure"}>
                Título del descuento *
              </Label>
              <div className="mt-1">
                <TextInput
                  id="title"
                  placeholder="Título del descuento"
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
            <div className="mt-4">
              <Label>Observaciones</Label>
              <div className="mt-1">
                <TextInput
                  id="observations"
                  placeholder="Observaciones"
                  {...register("observations")}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
              <div className="mr-4">
                <Label>Descuento o incremento *</Label>
                <div className="mt-1">
                  <Select
                    onChange={(e) => setDiscount(e.target.value)}
                    defaultValue={discount}
                  >
                    <option value={"true"}>Descuento</option>
                    <option value={"false"}>Incremento</option>
                  </Select>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  La cantidad indicada se sumará o restará
                </p>
              </div>

              <div>
                <Label>Tipo de cálculo *</Label>
                <div className="mt-1">
                  <Select
                    defaultValue={discountType}
                    {...register("discount_type")}
                    onChange={(e) => handleLabels(e.target.value)}
                  >
                    <option key={"PERCENTAGE"} value={"PERCENTAGE"}>
                      {t("PERCENTAGE")}
                    </option>
                    <option key={"FIXED"} value={"FIXED"}>
                      {t("FIXED")}
                    </option>
                  </Select>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Método para calcular la cantidad a descontar o incrementar
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
              <div className="mr-4">
                <Label htmlFor="amount" color={errors.amount && "failure"}>
                  Cantidad *
                </Label>
                <div className="mt-1">
                  <TextInput
                    id="amount"
                    type="number"
                    placeholder={amountLabel}
                    {...register("amount", {
                      required: t("FORM_ERROR_MSG_REQUIRED"),
                    })}
                    color={errors.amount && "failure"}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">Cantidad a aplicar</p>
                <ErrorMessage
                  errors={errors}
                  name="amount"
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
                <Label>Método de aplicación *</Label>
                <div className="mt-1">
                  <Select
                    onChange={(e) => setApplicationMethod(e.target.value)}
                    defaultValue={applicationMethod}
                  >
                    <option key={"USER_SELECTION"} value={"USER_SELECTION"}>
                      {"Por selección del usuario"}
                    </option>
                    <option
                      key={"QUANTITY_PRODUCTS"}
                      value={"QUANTITY_PRODUCTS"}
                    >
                      {"Por cantidades de productos"}
                    </option>
                    <option key={"PAYMENT_METHOD"} value={"PAYMENT_METHOD"}>
                      {"Por método de pago"}
                    </option>
                    <option key={"MANUAL"} value={"MANUAL"}>
                      {"Descuento manual (solo administradores)"}
                    </option>
                  </Select>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Método en el que se aplicará el descuento o incremento
                </p>
              </div>
            </div>

            {applicationMethod === "QUANTITY_PRODUCTS" ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
                <div>
                  <Label htmlFor="products">Producto al que se aplica</Label>
                  <div className="mt-1">
                    <TextInput
                      id="products"
                      placeholder="0"
                      type="number"
                      {...register("products")}
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Producto al que se aplica el descuento o incremento según la
                    selección del usuario
                  </p>
                </div>

                <div>
                  <Label htmlFor="products_unit">Método por unidad</Label>
                  <div className="mt-1">
                    <Select
                      id="products_unit"
                      onChange={(e) => setProductsUnit(e.target.value)}
                      defaultValue={productsUnit}
                    >
                      <option value={"true"}>{"A la unidad"}</option>
                      <option value={"false"}>{"A partir de la unidad"}</option>
                    </Select>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Aplicar este descuento o incremento a esta unidad o 'a
                    partir de'
                  </p>
                </div>
              </div>
            ) : applicationMethod === "PAYMENT_METHOD" ? (
              <div className="mt-4">
                <Label htmlFor="discount_by_method">Método de pago</Label>
                <div className="mt-1">
                  <Select
                    id="discount_by_method"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    <option hidden disabled value="">
                      {t("SELECT")}
                    </option>
                    {methodsTypes &&
                      methodsTypes.map((item) => (
                        <option key={item.id} value={item.id}>
                          {t(item.title)}
                        </option>
                      ))}
                  </Select>
                </div>
              </div>
            ) : null}
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
