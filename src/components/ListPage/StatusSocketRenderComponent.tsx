import { Button } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { LuLightbulb, LuLightbulbOff, LuPower } from "react-icons/lu";
import { Socket } from "socket.io-client";
import { AlertContext } from "../../context/AlertContext";
import { handleButtonClick } from "../../pages/accessControl/data/AccessControlProvider";
import { DeviceSocketConection } from "../../pages/accessControl/data/ConnectionSockect";

interface props {
  item: any;
}

const token = localStorage.getItem("accessToken");
let socket = DeviceSocketConection.getInstance(token!).getSocket();

export function StatusSocketRenderComponent({ item: item }: props) {
  const { openAlert } = useContext(AlertContext);
  const [deviceConnected, setDeviceConnected] = useState(false);
  const [deviceStatusMqtt, setDeviceStatusMqtt] = useState(false);
  const [powerDevice, setPowerDevice] = useState<number>(0);

  const [buttonDisabledState, setButtonDisabledState] = useState<{
    [key: string]: boolean;
  }>({});

  const { t } = useTranslation();
  useEffect(() => {
    socket.on("device", (info: any) => {
      //console.log("Device info comming", info);
      setDeviceConnected(true);
      if (item.mqtt_id === info.id) {
        setDeviceStatusMqtt(info[`switch:${item.channel_id}`].isOn);
        item.status = info[`switch:${item.channel_id}`].isOn;
        setPowerDevice(info[`switch:${item.channel_id}`].apower);
      }
    });
    socket.on("ping", (data: any) => {
      console.log("Received data:", data);
    });

    const deviceId = item!.id;
    const path = `${item.mqtt_id}/rpc`;
    let payload: any;
    if (item.model_type === "shelly-4-way-rele") {
      payload = {
        deviceId: deviceId,
        uid: "96ad9d59-1457-4445-8f6f-bbdbdb42fcf7",
        path: path,
        data: '{"method": "NotifyStatus"}',
      };
    } else {
      payload = {
        deviceId: deviceId,
        uid: "96ad9d59-1457-4445-8f6f-bbdbdb42fcf7",
        path: path,
        data: "{}",
      };
    }

    setTimeout(() => {
      socket.emit("command", payload);
    }, 1000);
  }, []);

  const handleStatusClick = async (
    item: any,
    event: React.MouseEvent,
    socket: Socket,
  ) => {
    try {
      event.stopPropagation();
      // Check if the button is already disabled
      if (buttonDisabledState[item.id]) {
        return;
      }

      setButtonDisabledState((prev) => ({
        ...prev,
        [item.id]: true,
      }));

      const status = await handleButtonClick(item, socket, deviceStatusMqtt);

      // Reset the button state and countdown timer
      setTimeout(() => {
        setButtonDisabledState((prev) => ({
          ...prev,
          [item.id]: false,
        }));
      }, 1500);

      if (status === 204) {
        if (powerDevice === 0) {
          openAlert(t("DEVICE_ACTION_KO"), "error");
        } else {
          openAlert(t("DEVICE_ACTION_OK"), "insert");
        }
      } else if (status === 200) {
        // Puedes manejar el éxito aquí
        openAlert(t("DEVICE_ACTION_OK"), "insert");
      } else {
        // Manejar el error de la llamada aquí
        openAlert(t("DEVICE_ACTION_KO"), "error");
      }
    } catch (error) {
      // Manejar errores generales aquí
      openAlert(t("DEVICE_API_KO"), "error");
    }
  };

  return (
    <>
      {item.type === "LIGHT" && !deviceConnected ? (
        <div className="flex items-center">
          <div className="container items-center flex flex-row max-w-max px-4 bg-gray-100 rounded-full">
            <label className="font-medium text-gray-800">Desconectado</label>
          </div>
        </div>
      ) : item.type === "LIGHT" ? (
        deviceStatusMqtt ? (
          <div className="flex items-center">
            <div className="container items-center flex flex-row max-w-max px-4 bg-green-100 rounded-full">
              <label className="font-medium text-green-800">{t("ON")}</label>
            </div>
            <Button
              className="ml-2"
              size="xs"
              color="light"
              onClick={(event) => handleStatusClick(item, event, socket)}
              disabled={buttonDisabledState[item.id]}
            >
              <LuLightbulbOff className="text-red-800" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center">
            <div className="container items-center flex flex-row max-w-max px-4 bg-red-100 rounded-full">
              <label className="font-medium text-red-800">{t("OFF")}</label>
            </div>
            <Button
              className="ml-4"
              size="xs"
              color="light"
              onClick={(event) => handleStatusClick(item, event, socket)}
              disabled={buttonDisabledState[item.id]}
            >
              <LuLightbulb className="text-green-800" />
            </Button>
          </div>
        )
      ) : item.type === "DOOR" ? (
        <div className="flex items-center">
          <Button
            className="mr-2"
            size="xs"
            color="light"
            onClick={(event) => handleStatusClick(item, event, socket)}
            disabled={buttonDisabledState[item.id]}
          >
            Activar
            <LuPower className="ml-2" />
          </Button>
        </div>
      ) : null}
    </>
  );
}
