/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorMessage } from "@hookform/error-message";
import axios from "axios";
import * as EmailValidator from "email-validator";
import {
  Button,
  Label,
  Modal,
  TextInput,
  Textarea,
  ToggleSwitch,
} from "flowbite-react";
import { t } from "i18next";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { HiXCircle } from "react-icons/hi";
import { DeleteModal } from "../../../../components/DeleteModal";
import {
  deleteRow,
  getOneRow,
  insertRow,
  updateRow,
} from "../../../../server/supabaseQueries";
import { AlertContext } from "../../../../context/AlertContext";
import StateComponent from "../../../../components/ListPage/StatesComponent";

interface EmailModalProps {
  openModal: boolean;
  closeModal: () => void;
  item: any;
  onEmail: () => void;
  onDeleteEmail: () => void;
}

export const EmailModal = (props: EmailModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCc, setShowCc] = useState(false);
  const [toSend, setToSend] = useState<any[]>([]);
  const [sendInput, setSendInput] = useState("");
  const [toSendCc, setToSendCc] = useState<any[]>([]);
  const [sendInputCc, setSendInputCc] = useState("");
  const [toSendCco, setToSendCco] = useState<any[]>([]);
  const [sendInputCco, setSendInputCco] = useState("");
  const [userEmail, setUserEmail] = useState<any>(null);
  const { openAlert } = useContext(AlertContext);

  const user = JSON.parse(localStorage.getItem("userLogged")!);

  const { register, formState, getValues, setError, clearErrors } =
    useForm<any>({
      values: props.item ?? undefined,
      mode: "all",
      reValidateMode: "onBlur",
      criteriaMode: "all",
    });

  const { errors, isValid } = formState;

  useEffect(() => {
    setIsOpen(props.openModal);
  }, [props.openModal]);

  useEffect(() => {
    if (props.item) {
      const fetchData = async () => {
        const userDb = await getOneRow("id", props.item.created_by, "users");
        setUserEmail(userDb);
      };
      fetchData();
    }
  }, [props.item]);

  const close = () => {
    setIsOpen(false);
    props.closeModal();
  };

  const handleTagInputBlur = () => {
    clearErrors();
    if (sendInput !== "") {
      if (EmailValidator.validate(sendInput!)) {
        setToSend([...toSend, sendInput]);
        setSendInput("");
      } else {
        setError("to", {
          type: "custom",
          message: "Email no válido",
          types: { required: "Email no válido" },
        });
      }
    }
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    clearErrors();
    if (sendInput !== "") {
      if (e.key === "," || e.key === "Enter") {
        e.preventDefault();
        if (EmailValidator.validate(sendInput!)) {
          setToSend([...toSend, sendInput.trim()]);
          setSendInput("");
        } else {
          setError("to", {
            type: "custom",
            message: "Email no válido",
            types: { required: "Email no válido" },
          });
        }
      }
    }
  };

  const handleTagInputBlurCc = () => {
    clearErrors();
    if (sendInputCc !== "") {
      if (EmailValidator.validate(sendInputCc!)) {
        setToSendCc([...toSendCc, sendInputCc]);
        setSendInputCc("");
      } else {
        setError("cc", {
          type: "custom",
          message: "Email no válido",
          types: { required: "Email no válido" },
        });
      }
    }
  };

  const handleTagInputKeyDownCc = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    clearErrors();
    if (e.key === "," || e.key === "Enter") {
      e.preventDefault();
      if (sendInputCc !== "") {
        if (EmailValidator.validate(sendInputCc!)) {
          setToSendCc([...toSendCc, sendInputCc.trim()]);
          setSendInputCc("");
        } else {
          setError("cc", {
            type: "custom",
            message: "Email no válido",
            types: { required: "Email no válido" },
          });
        }
      }
    }
  };

  const handleTagInputBlurCco = () => {
    clearErrors();
    if (sendInputCco !== "") {
      if (EmailValidator.validate(sendInputCco!)) {
        setToSendCco([...toSendCco, sendInputCco]);
        setSendInputCco("");
      } else {
        setError("cco", {
          type: "custom",
          message: "Email no válido",
          types: { required: "Email no válido" },
        });
      }
    }
  };

  const handleTagInputKeyDownCco = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    clearErrors();
    if (e.key === "," || e.key === "Enter") {
      e.preventDefault();
      if (sendInputCco !== "") {
        if (EmailValidator.validate(sendInputCco!)) {
          setToSendCco([...toSendCco, sendInputCco.trim()]);
          setSendInputCco("");
        } else {
          setError("cco", {
            type: "custom",
            message: "Email no válido",
            types: { required: "Email no válido" },
          });
        }
      }
    }
  };

  const sendData = async (state: string) => {
    const data = getValues();
    const newEmail: any = {
      to: toSend.length > 0 ? toSend : null,
      cc: toSendCc.length > 0 ? toSendCc : null,
      cco: toSendCco.length > 0 ? toSendCco : null,
      subject: data.subject,
      content: data.content,
      state: state,
    };
    if (!props.item) {
      const createdEmail = await insertRow(newEmail, "emails");
      if (createdEmail) {
        openAlert("Email creado con éxito", "insert");
      } else {
        openAlert("Ha ocurrido un problema al crear el email", "error");
      }
    } else {
      newEmail.id = props.item.id;
      const updatedEmail = await updateRow(newEmail, "emails");
      if (updatedEmail) {
        openAlert("Email actualizado con éxito", "update");
      } else {
        openAlert("Ha ocurrido un problema al editar el email", "error");
      }
    }

    if (state === "SEND") {
      const emailData = {
        orgId: "30f3a4ed-0b43-4489-85a8-244ac94019f5",
        subject: data.subject,
        emailTemplateId: "16a027fc-4807-4e17-b9e7-d828992352c6",
        createdBy: user.id,
        to: toSend,
        cc: toSendCc,
        cco: toSendCco,
        html: data.content,
      };

      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://europe-west2-aymo-madridejos.cloudfunctions.net/emails/custom/send-email",
        headers: {
          "Authorization-Token": localStorage.getItem("accessToken"),
          "Content-Type": "application/json",
        },
        data: JSON.stringify(emailData),
      };

      axios
        .request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
          if (response) {
            openAlert("Email enviado con éxito", "insert");
          } else {
            openAlert("Ha ocurrido un problema al enviar el email", "error");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
    props.onEmail();
    close();
  };

  const deleteItemMethod = async () => {
    try {
      await deleteRow(props.item.id!, "emails");
      close();
      props.onDeleteEmail();
    } catch (error) { }
  };

  return (
    <Modal dismissible onClose={() => close()} show={isOpen}>
      <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
        {!props.item || props.item.state === "STANDBY"
          ? "Editar email"
          : "Detalles del email"}
      </Modal.Header>
      <Modal.Body className="max-h-[60vh]">
        {!props.item || props.item.state === "STANDBY" ? (
          <div>
            <div>
              <Label color={errors.to && "failure"}>Para *</Label>
              <div>
                <div className="flex flex-wrap gap-2 pb-2">
                  {toSend.map((people, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-gray-100 rounded-full px-2 py-1"
                    >
                      <span>{people}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setToSend(toSend.filter((_, i) => i !== index))
                        }
                        className="ml-1 text-gray-500"
                      >
                        <HiXCircle />
                      </button>
                    </div>
                  ))}
                </div>
                <TextInput
                  id="tagInput"
                  value={sendInput}
                  onChange={(e) => setSendInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  onBlur={handleTagInputBlur}
                  color={errors.to && "failure"}
                />
              </div>
              <ErrorMessage
                errors={errors}
                name="to"
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
              <ToggleSwitch
                checked={showCc}
                onChange={(e) => setShowCc(e)}
                label="Mostrar CC/CCO"
              />
            </div>
            {showCc && (
              <div className="flex gap-4 mt-4">
                <div className="w-full">
                  <Label color={errors.cc && "failure"}>CC</Label>
                  <div>
                    <TextInput
                      className="mt-1"
                      id="tagInput"
                      value={sendInputCc}
                      onChange={(e) => setSendInputCc(e.target.value)}
                      onKeyDown={handleTagInputKeyDownCc}
                      onBlur={handleTagInputBlurCc}
                      color={errors.cc && "failure"}
                    />
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {toSendCc.map((people, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-gray-100 rounded-full px-2 py-1"
                      >
                        <span>{people}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setToSendCc(toSendCc.filter((_, i) => i !== index))
                          }
                          className="ml-1 text-gray-500"
                        >
                          <HiXCircle />
                        </button>
                      </div>
                    ))}
                  </div>
                  <ErrorMessage
                    errors={errors}
                    name="cc"
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
                <div className="w-full">
                  <Label color={errors.cco && "failure"}>CCO</Label>
                  <div>
                    <TextInput
                      className="mt-1"
                      id="tagInput"
                      value={sendInputCco}
                      onChange={(e) => setSendInputCco(e.target.value)}
                      onKeyDown={handleTagInputKeyDownCco}
                      onBlur={handleTagInputBlurCco}
                      color={errors.cco && "failure"}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {toSendCco.map((people, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-gray-100 rounded-full px-2 py-1"
                      >
                        <span>{people}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setToSendCco(
                              toSendCco.filter((_, i) => i !== index),
                            )
                          }
                          className="ml-1 text-gray-500"
                        >
                          <HiXCircle />
                        </button>
                      </div>
                    ))}
                  </div>
                  <ErrorMessage
                    errors={errors}
                    name="cco"
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
            )}
            <div className="mt-4">
              <Label color={errors.subject && "failure"}>Asunto *</Label>
              <div className="mt-1">
                <TextInput
                  color={errors.subject && "failure"}
                  {...register("subject", {
                    required: t("FORM_ERROR_MSG_REQUIRED"),
                  })}
                />
                <ErrorMessage
                  errors={errors}
                  name="subject"
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
            <div className="mt-4">
              <Label>Contenido</Label>
              <div className="mt-1">
                <Textarea {...register("content")} />
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between mb-4">
              <div style={{ display: "flex", alignItems: "center" }}>
                <Label
                  htmlFor="order_created_at"
                  style={{ marginRight: "10px" }}
                >
                  Fecha de creación:
                </Label>
                <p className="flex flex-grow">
                  {new Date(props.item.created_at).toLocaleString()}
                </p>
              </div>
              <div>
                <StateComponent state={props.item.state} />
              </div>
            </div>

            <div className="border border-gray-200 dark:border-gray-700"></div>
            <div className="mt-4">
              <strong className="text-blue-800 font-semibold">
                DESTINATARIOS:
              </strong>

              <div
                className="px-4 pt-4"
                style={{ display: "flex", alignItems: "center" }}
              >
                <Label htmlFor="order_amount" style={{ marginRight: "10px" }}>
                  Para:
                </Label>
                {props.item.to.map((email: any, index: number) => (
                  <p key={index}>{email}</p>
                ))}
              </div>

              {props.item.cc && (
                <div
                  className="px-4"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <Label htmlFor="method_title" style={{ marginRight: "10px" }}>
                    Cc:
                  </Label>
                  {props.item.cc.map((email: any, index: number) => (
                    <p key={index}>{email}</p>
                  ))}
                </div>
              )}
              {props.item.cco && (
                <div
                  className="px-4"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <Label htmlFor="method_title" style={{ marginRight: "10px" }}>
                    Cco:
                  </Label>
                  {props.item.cco.map((email: any, index: number) => (
                    <p key={index}>{email}</p>
                  ))}
                </div>
              )}

              <div className="border border-gray-200 dark:border-gray-700 mt-4"></div>
              <div className="mt-4">
                <strong className="text-blue-800 font-semibold">
                  DATOS DEL EMAIL:
                </strong>

                <div
                  className="px-4 pt-4"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <Label style={{ marginRight: "10px" }}>Asunto:</Label>
                  <p>{props.item.subject}</p>
                </div>

                <div className="px-4 mt-2" style={{ display: "flex" }}>
                  <Label style={{ marginRight: "10px" }}>Contenido:</Label>
                </div>
                <p className="px-4 mt-1">{props.item.content}</p>
              </div>
              {userEmail && (
                <>
                  <div className="border border-gray-200 dark:border-gray-700 mt-4"></div>
                  <div className="mt-4">
                    <strong className="text-blue-800 font-semibold">
                      DATOS DEL USUARIO:
                    </strong>

                    <div
                      className="px-4 pt-4"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <Label style={{ marginRight: "10px" }}>Email:</Label>
                      <p>{userEmail.email}</p>
                    </div>

                    <div
                      className="px-4"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <Label style={{ marginRight: "10px" }}>Documento:</Label>
                      <p>{userEmail.document}</p>
                    </div>
                    <div
                      className="px-4"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <Label style={{ marginRight: "10px" }}>Teléfono:</Label>
                      <p>{userEmail.phone}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </Modal.Body>
      {!props.item || props.item.state === "STANDBY" ? (
        <Modal.Footer className="flex justify-between">
          {
            props.item && props.item.state === "STANDBY" && (
              <div>
                <DeleteModal
                  data={props.item}
                  deleteFn={deleteItemMethod}
                  onlyIcon={false}
                  toastSuccessMsg={"Borrador eliminado correctamente"}
                  toastErrorMsg={"Error al eliminar el borrador"}
                  title={t("DELETE")}
                  disableButton={false}
                />
              </div>
            )
          }

          <div className="flex justify-end gap-4">
            <Button
              size={"sm"}
              onClick={() => sendData("STANDBY")}
              color="primary"
            >
              Guardar como borrador
            </Button>
            <Button
              size={"sm"}
              onClick={() => sendData("SEND")}
              disabled={toSend.length < 1 || !isValid}
            >
              Enviar
            </Button>
          </div>
        </Modal.Footer>
      ) : (
        <Modal.Footer />
      )}
    </Modal>
  );
};
