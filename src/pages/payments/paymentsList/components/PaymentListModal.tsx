import { Label, Modal } from "flowbite-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { DeleteModal } from "../../../../components/DeleteModal";
import { getRowByColumn } from "../../../../server/supabaseQueries";
import StateComponent from "../../../../components/ListPage/StatesComponent";

interface PaymentListModalProps {
  item: any | null;
  subItems: any | null;
  openModal: boolean;
  closeModal: Function;
}

export function PaymentListModal({
  item: item,
  subItems: subItems,
  openModal = false,
  closeModal,
}: PaymentListModalProps) {
  const { t } = useTranslation();
  const [isOpen, setOpen] = useState(false);
  const [subItemsWithDates, setSubItemsWithDates] = useState<any>();

  const user = JSON.parse(localStorage.getItem("userLogged")!);

  const { reset } = useForm<any>({
    values: item ?? undefined,
    mode: "onBlur",
    reValidateMode: "onBlur",
    criteriaMode: "all",
  });

  useEffect(() => {
    const fetch = async () => {
      if (item.order_module === "payments") {
        const records = await getRowByColumn(
          "payments_id",
          item.order_record_id,
          "payments_sessions",
        );
        const updatedSubItems = subItems.map((element: any, index: any) => {
          const record = index < records.length ? records[index] : null;
          element.date = record ? record.date : null;
          return element;
        });

        setSubItemsWithDates(updatedSubItems);
      } else {
        setSubItemsWithDates(subItems);
      }
    };
    fetch();
  }, [item, subItems]);

  useEffect(() => {
    setOpen(openModal);
  }, [openModal]);

  const close = (item: any | null) => {
    reset();
    setOpen(false);
    closeModal(item ? true : false);
  };

  return (
    <>
      <Modal size={"2xl"} dismissible onClose={() => close(null)} show={isOpen}>
        <form>
          <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
            <strong>{t("PAYMENT_DATA")}</strong>
          </Modal.Header>
          <Modal.Body>
            <div className="max-h-[60vh]">
              {/* DATOS PRINCIPALES */}
              <div className="flex justify-between mb-4 mr-4">
                <div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Label
                      htmlFor="order_created_at"
                      style={{ marginRight: "10px" }}
                    >
                      {t("ORDER_CREATED_AT")}:
                    </Label>
                    <p className="flex flex-grow">
                      {new Date(item.order_created_at).toLocaleString()}
                    </p>
                  </div>

                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Label
                      htmlFor="order_created_at"
                      style={{ marginRight: "10px" }}
                    >
                      {t("ORDERED_BY")}:
                    </Label>
                    <p>
                      {item.order_user_name + " " + item.order_user_surname}
                    </p>
                  </div>
                </div>

                <div>
                  <StateComponent state={item.order_state} />
                </div>
              </div>

              {/* DATOS DE LA OPERACIÓN */}
              <div className="border border-gray-200 dark:border-gray-700"></div>
              <div className="pt-4">
                <strong className="text-blue-800 font-semibold">
                  {t("PAYMENT_DATA").toUpperCase()}:
                </strong>

                <div
                  className="px-4 pt-4"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <Label htmlFor="order_amount" style={{ marginRight: "10px" }}>
                    {t("ORDER_AMOUNT")}:
                  </Label>
                  <p>{item.order_amount + " " + "€"}</p>
                </div>

                <div
                  className="px-4"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <Label htmlFor="method_title" style={{ marginRight: "10px" }}>
                    {t("METHOD_TITLE")}:
                  </Label>
                  <p>{item.method_title}</p>
                </div>

                <div
                  className="px-4 pb-4"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <Label style={{ marginRight: "10px" }}>
                    {t("ORDER_CONCEPT")}:
                  </Label>
                  <p>{item.order_concept}</p>
                </div>
              </div>

              {/* REGISTROS */}
              <div className="border border-gray-200 dark:border-gray-700"></div>
              <div className="pt-4">
                <strong className="text-blue-800 font-semibold">
                  DATOS DE LOS PAGOS:
                </strong>
                {subItemsWithDates &&
                  subItemsWithDates.map((subItem: any, index: number) => (
                    <div key={index}>
                      <div className="px-4 pt-4">
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <Label className="text-blue-900 font-bold flex flex-grow">{`${t(
                            "PAYMENT",
                          )} ${index + 1}`}</Label>

                          <StateComponent state={subItem.payment_state} />
                        </div>
                        <div
                          className="mt-1"
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <Label
                            htmlFor="order_created_at"
                            style={{ marginRight: "10px" }}
                          >
                            {t("ORDER_CREATED_AT")}
                          </Label>
                          <p>
                            {new Date(
                              subItem.payment_created_at,
                            ).toLocaleString()}
                          </p>
                        </div>

                        {item.order_module === "payments" ? (
                          <div
                            className="pt-4"
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <Label
                              htmlFor="date"
                              style={{ marginRight: "10px" }}
                            >
                              Fecha reserva:
                            </Label>
                            <p>{new Date(subItem.date).toLocaleString()}</p>
                          </div>
                        ) : null}

                        <div
                          className="pb-4"
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <Label style={{ marginRight: "10px" }}>
                            {t("PRICE")}:
                          </Label>
                          <p>{subItem.payment_amount} €</p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {/* DATOS RESPONSABLE OPERACIÓN */}
              <div className="border border-gray-200 dark:border-gray-700"></div>
              <div className="pt-4">
                <strong className="text-blue-800 font-semibold">
                  {t("PAYMENTS_RESPOSIBLE").toUpperCase()}:
                </strong>

                <div
                  className="px-4 pt-4"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <Label style={{ marginRight: "10px" }}>Titular:</Label>
                  <p>{item.order_user_name + " " + item.order_user_surname}</p>
                </div>

                <div
                  className="px-4"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <Label style={{ marginRight: "10px" }}>
                    {t("DOCUMENT")}:
                  </Label>
                  <p>{item.user_document}</p>
                </div>

                <div
                  className="px-4"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <Label style={{ marginRight: "10px" }}>{t("EMAIL")}:</Label>
                  <p>{item.order_user_email}</p>
                </div>

                <div
                  className="px-4 pb-4"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <Label style={{ marginRight: "10px" }}>{t("PHONE")}:</Label>
                  <p>{item.order_user_phone}</p>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="flex justify-start">
            <DeleteModal
              data={item}
              deleteFn={() => {}}
              onlyIcon={false}
              toastSuccessMsg={t("PAYMENT_DELETE_OK")}
              toastErrorMsg={t("PAYMENT_DELETE_KO")}
              title={t("DELETE_PAYMENT")}
              disableButton={!user.users_roles.rules.payments.payments.delete}
            />
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}
