/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Label, Modal, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { getOneRow, getRowByColumn } from "../../../../server/supabaseQueries";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { ValidateSpanishID } from "../../../../helpers/validate-document";
import { ErrorMessage } from "@hookform/error-message";
import { HiTrash } from "react-icons/hi";
interface BookingSessionModalProps {
  openModal: boolean;
  defaultSessions: any;
  closeModal: (state: boolean) => void;
  onSessions: (sessions: any, paymentMethod: any) => void;
  item: any;
}

export function BookingSessionModal({
  openModal,
  defaultSessions,
  closeModal,
  onSessions: onSessions,
  item,
}: BookingSessionModalProps) {
  const [isOpen, setOpen] = useState(false);
  const [activeUser, setActiveUser] = useState<any>(null);
  const [dni, setDni] = useState<any>("");
  const [formattedSessions, setFormattedSessions] = useState<any>([]);
  const [paymentMethods, setPaymentMethods] = useState<any>([]);
  const [selectedMethod, setSelectedMethod] = useState<any>("");
  const tableBookingsStates = import.meta.env.VITE_TABLE_BOOKINGS_STATES;
  const tableUsers = import.meta.env.VITE_TABLE_USERS;
  const itemsMethodsTableName = import.meta.env
    .VITE_TABLE_BOOKINGS_ITEMS_PAYMENTS_METHOD;
  const paymentMethodsTableName = import.meta.env.VITE_TABLE_PAYMENTS_METHOD;
  const user = JSON.parse(localStorage.getItem("userLogged")!);
  const [notFoundUser, setNotFoundUser] = useState(false);
  const [validDni, setValidDni] = useState(false);

  const { t } = useTranslation();

  const close = () => {
    setOpen(false);
    closeModal(true);
  };

  const { formState, setError, clearErrors, register, setValue } = useForm<any>(
    {
      values: undefined,
      mode: "onBlur",
      reValidateMode: "onBlur",
      criteriaMode: "all",
    },
  );

  const { errors } = formState;

  useEffect(() => {
    setOpen(openModal);
    const payMethods: any[] = [];
    const fetchData = async () => {
      if (defaultSessions.length > 0) {
        for await (const session of defaultSessions) {
          session.init =
            new Date(session.date).toLocaleTimeString().split(":")[0] +
            ":" +
            new Date(session.date).toLocaleTimeString().split(":")[1];
          if (session.bookings_state_id !== null) {
            session.state = await getOneRow(
              "id",
              session.bookings_state_id,
              tableBookingsStates,
            );
          }
        }
        setFormattedSessions(defaultSessions);
        getRowByColumn("booking_item_id", item.id!, itemsMethodsTableName).then(
          async (methods: any) => {
            for await (const method of methods) {
              const row = await getOneRow(
                "id",
                method.payments_method_id,
                paymentMethodsTableName,
              );
              payMethods.push(row);
            }
            setPaymentMethods(payMethods);
          },
        );
      }
    };
    fetchData();
  }, [openModal]);

  useEffect(() => {
    const fetchData = async () => {
      if (defaultSessions.length > 0) {
        for await (const session of defaultSessions) {
          session.init =
            new Date(session.date).toLocaleTimeString().split(":")[0] +
            ":" +
            new Date(session.date).toLocaleTimeString().split(":")[1];
          if (session.bookings_state_id !== null) {
            session.state = await getOneRow(
              "id",
              session.bookings_state_id,
              tableBookingsStates,
            );
          }
        }
        setFormattedSessions(defaultSessions);
      }
    };
    fetchData();
  }, [defaultSessions]);

  const search = async (key: string) => {
    if (key === "Enter") {
      setActiveUser(null);
      if (validDni) {
        setNotFoundUser(false);
        const user = await getOneRow("document", dni, tableUsers);
        if (user) {
          setValue("document", "");
          setActiveUser(user);
        } else {
          setNotFoundUser(true);
        }
      }
    }
  };

  const deleteUser = () => {
    setActiveUser(undefined);
  };

  const confirmBooking = async () => {
    let totalPrice = 0;
    let duration = 0;
    defaultSessions.forEach((session: any) => {
      totalPrice = totalPrice + session.price;
      duration = duration + session.duration;
    });
    const booking = {
      user_id: activeUser.id,
      state: "PENDING",
      discount: 0,
      price: totalPrice,
      bookings_items_id: item.id,
      total_sessions: defaultSessions.length,
      coupon_id: null,
      date: defaultSessions[0].date,
      duration: duration,
    };
    onSessions(booking, selectedMethod);
    close();
  };

  const changeActiveUser = () => {
    setNotFoundUser(false);
    setActiveUser(user);
    setDni("");
    setValue("document", "");
    clearErrors();
  };

  const changeDni = (value: any) => {
    const validation = ValidateSpanishID(value!);
    if (validation.type?.toLocaleUpperCase() !== "DNI") {
      setError("document", {
        type: "custom",
        message: t("EDIT_USER_FORM_ERROR_MSG_DOCUMENT_FORMAT"),
        types: {
          validate: t("EDIT_USER_FORM_ERROR_MSG_DOCUMENT_FORMAT"),
        },
      });
      setValidDni(false);
    } else {
      clearErrors();
      if (!validation.valid) {
        setError("document", {
          type: "custom",
          message: t("EDIT_USER_FORM_ERROR_MSG_DOCUMENT_INVALID"),
          types: {
            validate: t("EDIT_USER_FORM_ERROR_MSG_DOCUMENT_INVALID"),
          },
        });
        setValidDni(false);
      } else {
        clearErrors();
      }
    }
    if (validation.valid) {
      setValidDni(true);
    }
    setValue("document", value);
    setDni(value);
  };

  useEffect(() => {
    if (dni === "") {
      clearErrors();
    }
  }, [dni]);

  return (
    <>
      <Modal dismissible onClose={() => close()} show={isOpen} size={"5xl"}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>{t("BOOK")}</strong>
        </Modal.Header>
        <Modal.Body>
          <div>
            <Label className="font-normal">
              {t("RESERVE_DESCRIPTION_1")}{" "}
              <Label
                onClick={() => changeActiveUser()}
                className="text-pink-600 cursor-pointer"
              >
                {t("RESERVE_DESCRIPTION_2")}
              </Label>
            </Label>
            <div className="flex items-center mt-4">
              <Label className="font-normal mr-1.5">
                {t("SEARCH_USER_BY_DNI")}
              </Label>
              <TextInput
                placeholder="Pulsa Enter para buscar"
                {...register("document")}
                onChange={(e) => changeDni(e.currentTarget.value)}
                type="text"
                color={errors.document && "failure"}
                onKeyUp={(event) => search(event.key)}
              />
              <div className="ml-4">
                <ErrorMessage
                  errors={errors}
                  name="document"
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

              {activeUser !== null ? (
                <div className="flex items-center  ml-2 p-2">
                  <div className="bg-green-200 p-2 rounded-md">
                    <p className="text-md">
                      <span className="font-bold">{t("SELECTED_USER")}</span>{" "}
                      {activeUser.name} {activeUser.surname}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <Button
                      onClick={deleteUser}
                      color="light"
                      size={"xs"}
                      className="mt-1 ml-1.5 cursor-pointer"
                    >
                      <HiTrash className="text-red-500" />
                    </Button>
                  </div>
                </div>
              ) : (
                <></>
              )}
              {notFoundUser ? (
                <Label className="text-red-500 ml-2 p-2">
                  No se ha encontrado al usuario
                </Label>
              ) : null}
            </div>
          </div>
          <div className="flex flex-row sm:flex-col w-full mb-5">
            <div className="hidden sm:display-1 w-1/2 sm:w-full sm:grid sm:grid-cols-12 sm:gap-4 sm:items-center sm:border-b sm:border-gray-200 sm:pt-5">
              <a className="py-4 col-span-2 block text-sm font-bold leading-5 text-gray-700 sm:mt-px sm:pt-2">
                {t("SERVICE")}
              </a>
              <a className="py-3 col-span-2 block text-sm font-bold leading-5 text-gray-700 sm:mt-px sm:pt-2">
                {t("DAY")}
              </a>
              <a className="py-3 col-span-2 block text-sm font-bold leading-5 text-gray-700 sm:mt-px sm:pt-2">
                {t("DATE_INIT")}
              </a>
              <a className="py-3 col-span-2 block text-sm font-bold leading-5 text-gray-700 sm:mt-px sm:pt-2">
                {t("DURATION")}
              </a>
              <a className="py-3 col-span-2 block text-sm font-bold leading-5 text-gray-700 sm:mt-px sm:pt-2">
                {t("LIGHT")}
              </a>
              <a className="py-2.5 col-span-2 block text-sm font-bold leading-5 text-gray-700 sm:mt-px sm:pt-2">
                {t("STATE")}
              </a>
            </div>
          </div>
          <div className="flex flex-col sm:flex-grow sm:w-full w-1/2 overflow-auto max-h-96">
            {formattedSessions.map((session: any, index: number) => (
              <div
                key={index}
                className="border-b mb-2 sm:grid sm:grid-cols-12 sm:gap-4 sm:items-start sm:border-b sm:border-gray-200 sm:pt-5 sm:pb-5"
              >
                <div className="col-span-2 mt-1 sm:mt-0">{item.title}</div>
                <div className="col-span-2 mt-1 sm:mt-0">
                  {new Date(session.date).toLocaleDateString()}
                </div>
                <div className="col-span-2 mt-1 sm:mt-0">{session.init}</div>
                <div className="col-span-2 mt-1 sm:mt-0">
                  {session.duration}
                </div>
                <div className="col-span-2 mt-1 sm:mt-0">
                  {session.light ? <p>Si</p> : <p>No</p>}
                </div>
                <div className="col-span-2 mt-1 sm:mt-0">
                  {session.state ? session.state.title : "Sin estado"}
                </div>
              </div>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer className="flex justify-between p-4">
          <div className="flex items-center">
            <Label className="mr-2">{t("SELECT_PAYMENT_METHOD")}:</Label>
            <Select
              className="mr-2"
              onChange={(e) => setSelectedMethod(e.currentTarget.value)}
            >
              <option hidden value="">
                {t("SELECT")}
              </option>
              {paymentMethods.map((method: any, index: any) => (
                <option key={index} value={method.id}>
                  {method.title}
                </option>
              ))}
            </Select>
          </div>
          <Button
            size={"sm"}
            color="primary"
            disabled={activeUser === undefined || selectedMethod === ""}
            onClick={confirmBooking}
          >
            {t("PROCESS_PAYMENT")}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
