/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import validator from "validator";
import { StatusSocketRenderComponent } from "../../../components/ListPage/StatusSocketRenderComponent";
import {
  getRowByColumn,
  insertRow,
  updateRow,
} from "../../../server/supabaseQueries";
import { handleButtonClick } from "../data/AccessControlProvider";
import { AccessControl } from "../models/AccessControl";
import { AkilesData } from "./AkilesData";
import { DeleteDeviceModal } from "./DeleteDeviceModal";
import { RaixerData } from "./RaixerData";
import { ShellyData } from "./ShellyData";

interface EditDeviceModalProps {
  item: AccessControl | null;
  openModal: boolean;
  closeModal: Function;
  onItem: (item: AccessControl | null | string) => void;
}

export function EditDeviceModal({
  item: item,
  openModal = false,
  closeModal,
  onItem: onItem,
}: EditDeviceModalProps) {
  const { t } = useTranslation();
  const [isOpen, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AccessControl | null>(null);

  const { handleSubmit, reset } = useForm<any>({
    values: item ?? undefined,
    mode: "onBlur",
    reValidateMode: "onBlur",
    criteriaMode: "all",
  });

  const [hourEvent, setHourEvent] = useState<any>(null);
  const [autoOff, setAutoOff] = useState<boolean | null>(false);
  const [phoneValid, setPhoneValid] = useState(false);
  const [checkProvider, setCheckProvider] = useState("");
  const [akilesType, setAkilesType] = useState("");
  const [channel, setChannel] = useState("");
  const [asignedChannels, setAsignedChannels] = useState<any[]>([]);
  const [pinCode, setPinCode] = useState<string | null>(null);

  const [formValid, setFormValid] = useState(false);

  const closeAfterDelete = () => {
    reset();
    setOpen(false);
    closeModal(true);
  };

  const onSubmit: SubmitHandler<AccessControl> = async () => {
    if (formValid) {
      setLoading(true);

      try {
        let itemUpdated: AccessControl;

        if (formData?.id !== undefined) {
          // Update existing item
          itemUpdated = (await updateRow(
            {
              ...formData,
              updated_at: new Date(),
              org_id: "043ec7c2-572a-4199-9aa1-af6af822e76a",
            },
            "access_control",
          )) as AccessControl;
        } else {
          itemUpdated = (await insertRow(
            {
              ...formData,
              created_at: new Date(),
              org_id: "043ec7c2-572a-4199-9aa1-af6af822e76a",
            },
            "access_control",
          )) as AccessControl;
        }

        close(itemUpdated);
        setLoading(false);
        onItem(itemUpdated);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }
  };

  const formatTime = (inputTime: any) => {
    const hours = inputTime.split(":")[0];
    const minutes = inputTime.split(":")[1];

    const formattedTime = `${hours}:${minutes}`;

    return formattedTime;
  };

  useEffect(() => {
    reset();
    setOpen(openModal);
    if (item) {
      setFormData(item);
      setCheckProvider(item.provider);
      setAkilesType(item.type);
      if (item.provider === "SHELLY") {
        getRowByColumn("device_id", item.device_id, "access_control").then(
          (items: AccessControl[]) => {
            const channels = items
              .filter((element) => element.id !== item.id)
              .map((element) => element.channel_id);
            setAsignedChannels(channels);
          },
        );
      }
    }

    if (item && item.auto_off !== null) {
      setAutoOff(item.auto_off!);
    }
    if (item && item.time_off !== null) {
      const formattedTime = formatTime(item.time_off);
      setHourEvent(formattedTime);
    }

    if (item && item.phone !== null) {
      checkValidPhone(item.phone);
    }
    setPhoneValid(true);
  }, [openModal]);

  const close = (device: AccessControl | null) => {
    reset();
    setOpen(false);
    closeModal(device ? true : false);
  };

  const autoOffEnabled = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setAutoOff(event.target.value === "true");
  };

  const checkValidPhone = (event: any) => {
    const isValid = validator.isMobilePhone(event, "es-ES");
    setPhoneValid(isValid);
  };

  return (
    <>
      <Modal
        size={"5xl"}
        dismissible
        onClose={() => close(null)}
        show={isOpen}
        className="z-40"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
            {item ? (
              <strong>{t("EDIT_DEVICE")}</strong>
            ) : (
              <strong>{t("ADD_DEVICE")}</strong>
            )}
          </Modal.Header>
          <Modal.Body className="max-h-[60vh]">
            {item ? (
              <div className="mx-4">
                <div>
                  <div className="pr-4">
                    {item.type === "CODE" ? (
                      <div className="flex justify-between flex-grow">
                        <div className="flex justify-stretch">
                          <TextInput
                            readOnly
                            className="pr-4"
                            placeholder="Código del dispositivo"
                            value={pinCode || ""}
                          />
                          <Button
                            onClick={() => {
                              handleButtonClick(
                                item,
                                undefined,
                                undefined,
                                setPinCode,
                              );
                            }}
                            isProcessing={loading}
                          >
                            {loading ? t("LOADING") : "Generar código"}
                          </Button>
                        </div>

                        <div className="flex justify-end">
                          <div>
                            {item && item.id && (
                              <>
                                <div className="flex justify-end">
                                  {/* Botón de Eliminar */}
                                  <DeleteDeviceModal
                                    device={item}
                                    closeModal={closeAfterDelete}
                                    onDeviceDelete={onItem}
                                  />
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between flex-grow">
                          <div>
                            <Label>Cambiar estado</Label>
                            <div className="mt-1">
                              <StatusSocketRenderComponent item={item} />
                            </div>
                          </div>

                          <div className="flex justify-end">
                            <div>
                              {item && item.id && (
                                <>
                                  <div className="flex justify-end">
                                    {/* Botón de Eliminar */}
                                    <DeleteDeviceModal
                                      device={item}
                                      closeModal={closeAfterDelete}
                                      onDeviceDelete={onItem}
                                    />
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : null}

            <div className="mx-4">
              {checkProvider === "AKILES" ? (
                <AkilesData
                  item={item}
                  setCheckProvider={setCheckProvider}
                  provider={checkProvider}
                  setAkilesType={setAkilesType}
                  onValidationChange={(isValid) => setFormValid(isValid)}
                  formData={formData}
                  setFormData={setFormData}
                  akilesType={akilesType}
                />
              ) : checkProvider === "RAIXER" ? (
                <RaixerData
                  item={item}
                  checkValidPhone={checkValidPhone}
                  setCheckProvider={setCheckProvider}
                  provider={checkProvider}
                  phoneValid={phoneValid}
                  onValidationChange={(isValid) => setFormValid(isValid)}
                  formData={formData}
                  setFormData={setFormData}
                />
              ) : checkProvider === "SHELLY" ? (
                <ShellyData
                  item={item}
                  setCheckProvider={setCheckProvider}
                  provider={checkProvider}
                  autoOff={autoOff!}
                  hourEvent={hourEvent}
                  setHourEvent={setHourEvent}
                  autoOffEnabled={autoOffEnabled}
                  channel={channel}
                  setChannel={setChannel}
                  asignedChannels={asignedChannels}
                  onValidationChange={(isValid) => setFormValid(isValid)}
                  formData={formData}
                  setFormData={setFormData}
                />
              ) : (
                <RaixerData
                  item={null}
                  checkValidPhone={checkValidPhone}
                  setCheckProvider={setCheckProvider}
                  provider={""}
                  phoneValid={phoneValid}
                  onValidationChange={(isValid) => setFormValid(isValid)}
                  formData={formData}
                  setFormData={setFormData}
                />
              )}
            </div>
          </Modal.Body>
          <Modal.Footer className="flex place-content-end">
            <div>
              <Button
                disabled={!formValid}
                color="primary"
                type="submit"
                isProcessing={loading}
              >
                {loading ? t("LOADING") : t("SAVE_DEVICE")}
              </Button>
            </div>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}
