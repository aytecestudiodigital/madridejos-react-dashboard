/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Label,
  Modal,
  Select,
  TextInput,
  Textarea,
  ToggleSwitch,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { deleteRow, insertRow, updateRow } from "../../../../server/supabaseQueries";
import axios from "axios";
import { DeleteModal } from "../../../../components/DeleteModal";
import { t } from "i18next";

interface AlertModalProps {
  openModal: boolean;
  closeModal: () => void;
  item: any;
  onUpdateAlert: () => void;
  onCreateAlert: () => void;
  onDeleteAlert: () => void
  totalAlertsEnabled: number;
}

export const AlertModal = (props: AlertModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [enable, setEnable] = useState(false);
  const [sendNotification, setSendNotification] = useState(false);

  const { register, getValues } = useForm<any>({
    values: props.item ?? undefined,
    mode: "onChange",
    reValidateMode: "onBlur",
    criteriaMode: "all",
  });

  useEffect(() => {
    console.log(props.totalAlertsEnabled);
  }, [props.totalAlertsEnabled]);

  useEffect(() => {
    setIsOpen(props.openModal);
  }, [props.openModal]);

  useEffect(() => {
    if (props.item) {
      setEnable(props.item.enabled);
      setSendNotification(props.item.notifiable);
    }
  }, [props.item]);

  const close = () => {
    setIsOpen(false);
    props.closeModal();
  };

  const onSave = async () => {
    const data = getValues();
    const newAlert: any = {
      title: data.title,
      description: data.description,
      type: data.type,
      enabled: enable,
      notifiable: sendNotification,
    };
    if (!props.item) {
      await insertRow(newAlert, "warnings");
      const dataNoti = {
        toppics: ["30f3a4ed-0b43-4489-85a8-244ac94019f5"],
        message: {
          title: data.title,
          body: data.description,
          appRoute: null,
          contentId: null,
        },
      };

      if (sendNotification) {
        const config = {
          method: "post",
          maxBodyLength: Infinity,
          url: "https://europe-west2-aymo-madridejos.cloudfunctions.net/notifications/send",
          headers: {
            "User-Token": localStorage.getItem("accessToken"),
            "Content-Type": "application/json",
          },
          data: JSON.stringify(dataNoti),
        };

        axios
          .request(config)
          .then((response) => {
            console.log(JSON.stringify(response.data));
          })
          .catch((error) => {
            console.log(error);
          });
      }

      props.onCreateAlert();
    } else {
      newAlert.id = props.item.id;
      await updateRow(newAlert, "warnings");
      const dataNoti = {
        toppics: ["30f3a4ed-0b43-4489-85a8-244ac94019f5"],
        message: {
          title: data.title,
          body: data.description,
          appRoute: null,
          contentId: null,
        },
      };

      if (sendNotification) {
        const config = {
          method: "post",
          maxBodyLength: Infinity,
          url: "https://europe-west2-aymo-madridejos.cloudfunctions.net/notifications/send",
          headers: {
            "User-Token": localStorage.getItem("accessToken"),
            "Content-Type": "application/json",
          },
          data: JSON.stringify(dataNoti),
        };

        axios
          .request(config)
          .then((response) => {
            console.log(JSON.stringify(response.data));
          })
          .catch((error) => {
            console.log(error);
          });
      }
      props.onUpdateAlert();
    }
    close();
  };

  const deleteItemMethod = async (item:any) => {
    await deleteRow(item.id, 'warnings')
    close()
    props.onDeleteAlert()
    props.closeModal()
  }

  return (
    <Modal dismissible onClose={() => close()} show={isOpen}>
      <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
        {!props.item ? "Crear aviso" : "Editar aviso"}
      </Modal.Header>
      <Modal.Body>
        <div>
          <div>
            <Label>Título</Label>
            <div className="mt-1">
              <TextInput {...register("title")} />
            </div>
          </div>
          <div className="mt-4">
            <Label>Descripción</Label>
            <div className="mt-1">
              <Textarea {...register("description")} />
            </div>
          </div>
          <div className="mt-4">
            <Label>Tipo de contenido</Label>
            <div className="mt-1">
              <Select {...register("type")}>
                <option value="ALERT">Alerta</option>
                <option value="WARNING">Aviso</option>
              </Select>
            </div>
          </div>
          {props.totalAlertsEnabled === 2 && (props.item && !props.item.enabled || !props.item) &&
            <>
              <div className="border border-gray-200 dark:border-gray-700 mt-8"></div>
              <p className="text-sm mt-2 text-red-900">No se pueden habilitar más de dos avisos</p></>}
          <div className="flex justify-between mt-4">
            <div>
              <ToggleSwitch
                checked={enable}
                onChange={(e) => setEnable(e)}
                label="Habilitado"
                disabled={props.totalAlertsEnabled === 2 && (props.item && !props.item.enabled || !props.item)}
              />
            </div>
            <div>
              <ToggleSwitch
                checked={sendNotification}
                onChange={(e) => setSendNotification(e)}
                label="Enviar notificación"
                disabled={props.totalAlertsEnabled === 2 && (props.item && !props.item.enabled || !props.item)}
              />
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="flex justify-between">
        <div>
          <DeleteModal
            data={props.item}
            deleteFn={deleteItemMethod}
            onlyIcon={false}
            toastSuccessMsg={"Alerta eliminada correctamente"}
            toastErrorMsg={"Error al eliminar la alerta"}
            title={t("DELETE")}
            disableButton={false}
          />
        </div>
        <div className="flex gap-4">
          <Button size={"sm"} color="primary" onClick={onSave}>
            Guardar
          </Button>
          {props.item && props.item.notifiable ? (
            <Button size={"sm"}>Volver a notificar</Button>
          ) : null}
        </div>

      </Modal.Footer>
    </Modal>
  );
};
