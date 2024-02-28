/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tabs } from "flowbite-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineClipboard,
} from "react-icons/hi";
import {
  LuCalendar,
  LuCalendarClock,
  LuClipboardPaste,
  LuCreditCard,
  LuMapPin,
  LuUnlock,
} from "react-icons/lu";
import { AccessControl } from "../../../accessControl/models/AccessControl";
import { PaymentAccount } from "../models/PaymentAcc";
import { PaymentMethod } from "../models/PaymentMethod";
import { customThemeTab } from "./CustomThemeScrollableTabs";
import { TabItemAdvanced } from "./TabItemAdvanced";
import TabItemCalendar from "./TabItemCalendar";
import { TabItemDetails } from "./TabItemDetails";
import { TabItemDevices } from "./TabItemDevices";
import TabItemLocation from "./TabItemLocation";
import { TabItemPayments } from "./TabItemPayments";
import { ItemModel } from "../models/ItemModel";
import React from "react";
import { ItemSessionsCard } from "./ItemSessionsCard";

const tabsData = [
  { title: "BOOKINGS", icon: LuCalendarClock },
  { title: "DETAILS", icon: HiOutlineClipboard },
  { title: "ADVANCED", icon: LuClipboardPaste },
  { title: "CALENDAR", icon: LuCalendar },
  { title: "PAYMENTS", icon: LuCreditCard },
  { title: "ACCESS_CONTROL", icon: LuUnlock },
  { title: "LOCATION", icon: LuMapPin },
];

interface ItemCardProps {
  deleteButtonLabel: string;
  deleteOKLabel: string;
  deleteKOLabel: string;
  paymentsMethods: PaymentMethod[] | [];
  paymentsAcc: PaymentAccount[] | [];
  accessControl: AccessControl[] | [];
  labelResponsibleCard: string;
  installationStates: any[];
  onSessions: (sessions: any) => void;
  item: ItemModel | null;
  itemCalendar: any[];
  onDataChange: (data: any) => void;
  onDevicesChange: (devices: any) => void;
  onSessionsUpdate: (sessions: any) => void;
  onSessionsDelete: (sessions: any) => void;
}

export const ItemDetailsCard = ({
  onSessions: onSessions,
  deleteButtonLabel,
  deleteKOLabel,
  deleteOKLabel,
  paymentsMethods,
  paymentsAcc,
  accessControl,
  labelResponsibleCard,
  installationStates,
  item,
  itemCalendar,
  onDataChange: onDataChange,
  onDevicesChange: onDevicesChange,
  onSessionsUpdate: onSessionsUpdate,
  onSessionsDelete: onSessionsDelete,
}: ItemCardProps) => {
  const { t } = useTranslation();
  const [sessions, setSessions] = useState<any>([]);

  const [tabIndex, setTabIndex] = useState<number>(0);
  const [latLng, setLatLng] = useState<any>(
    item !== null && item.position !== null
      ? {
        lat: item.position![0],
        lng: item.position![1],
      }
      : {
        lat: 39.1577,
        lng: -3.02081,
      },
  );
  const [isScrollbarVisible, setIsScrollbarVisible] = useState(false);
  const [newAddress, setNewAddress] = useState(null);
  const [newMapPosition, setNewMapPosition] = useState<any>(null);
  const scrollRight = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault(); // Evitar la recarga de la página
    document.getElementById("Tabs-scroll")!.scrollBy(100, 0);
  };

  const [formData, setFormData] = useState<ItemModel | null>(
    item ? item : null,
  );

  const [dataToSend, setDataToSend] = useState<any>(null);
  const [newDevices, setNewDevices] = useState<any>([]);
  const [sessionsToUpdate, setSessionsToUpdate] = useState<any>([]);
  const [sessionsToDelete, setSessionsToDelete] = useState<any>([]);

  useEffect(() => {
    if (item) {
      setFormData(item);
      if (item.position !== null) {
        setLatLng({
          lat: item.position![0],
          lng: item.position![1],
        });
      }
    }
  }, [item]);

  useEffect(() => {
    onDataChange(dataToSend);
  }, [dataToSend]);

  useEffect(() => {
    onDevicesChange(newDevices);
  }, [newDevices]);

  useEffect(() => {
    if (newMapPosition !== null) {
      const position = [newMapPosition.lat, newMapPosition.lng];
      const address = newAddress;
      const object = {
        data: {
          position: position,
          address: address,
        },
      };
      onDataChange(object);
    }
  }, [newMapPosition, newAddress]);

  useEffect(() => {
    onSessionsUpdate(sessionsToUpdate);
  }, [sessionsToUpdate]);

  useEffect(() => {
    onSessionsDelete(sessionsToDelete);
  }, [sessionsToDelete]);

  const setData = (data: any) => {
    setDataToSend({ ...dataToSend, data });
  };

  const handleFormChange = (data: any) => {
    setFormData(data);
  };

  const handleTabChange = (tab: number) => {
    // Guardar el estado del formulario al cambiar de tab (si estás en el primer tab)
    if (tab === 0) {
      setFormData(contents[0].props.item);
    }

    setTabIndex(tab);
  };

  const changeSessions = (sessions: any) => {
    setSessions(sessions);
  };

  useEffect(() => {
    onSessions(sessions);
  }, [sessions]);

  const contents = [
    <ItemSessionsCard
      item={item}
      installationStates={installationStates}
      installation={item ? item.id : ""}
    />,
    <TabItemDetails
      deleteButtonLabel={deleteButtonLabel}
      deleteOKLabel={deleteOKLabel}
      deleteKOLabel={deleteKOLabel}
      onChangeData={(data) => setData(data)}
      item={item ? item : null}
    />,
    <TabItemAdvanced
      deleteButtonLabel={deleteButtonLabel}
      deleteOKLabel={deleteOKLabel}
      deleteKOLabel={deleteKOLabel}
      labelResponsibleCard={labelResponsibleCard}
      onChangeData={(data) => setData(data)}
      item={item ? item : null}
    />,
    <TabItemCalendar
      defaultSessions={itemCalendar}
      installationStates={installationStates}
      onSessionsChange={(sessions: any) => changeSessions(sessions)}
      onSessionsUpdate={(sessions) => setSessionsToUpdate(sessions)}
      onSessionsDelete={(sessions) => setSessionsToDelete(sessions)}
      item={item ? item : null}
    />,
    <TabItemPayments
      paymentsMethods={paymentsMethods}
      paymentsAcc={paymentsAcc}
      item={item ? item : null}
      onChangeData={(data) => setData(data)}
    />,
    <TabItemDevices
      accessControl={accessControl}
      item={item ? item : null}
      onDevicesChange={(devices) => setNewDevices(devices)}
    />,
    <TabItemLocation
      position={latLng}
      onPosition={(position) => setNewMapPosition(position)}
      onAddress={(address) => setNewAddress(address)}
      item={item ? item : null}
    />,
  ];

  const handleScroll = () => {
    // Verificar si la barra de desplazamiento es necesaria
    const container = document.getElementById("Tabs-scroll");
    if (container) {
      const isOverflowing = container.scrollWidth > container.clientWidth;
      setIsScrollbarVisible(isOverflowing);
    }
  };

  useEffect(() => {
    // Verificar inicialmente y al cambiar el tamaño de la pantalla
    handleScroll();
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const scrollLeft = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault(); // Evitar la recarga de la página
    document.getElementById("Tabs-scroll")!.scrollBy(-100, 0);
  };

  return (
    <div className="mb-5">
      <div
        className={`${isScrollbarVisible ? "flex place-items-start" : ""}`}
      >
        {isScrollbarVisible && (
          <button
            onClick={scrollLeft}
            className="icon-button my-4 py-1 px-1 m-1 text-lg border border-gray-200 rounded-md"
          >
            <HiOutlineChevronLeft />
          </button>
        )}

        <div className="overflow-x-auto no-scrollbar" id={"Tabs-scroll"}>
          <Tabs.Group
            theme={customThemeTab}
            style={"fullWidth"}
            onActiveTabChange={(tab) => handleTabChange(tab)}
          >
            {tabsData.map((tab, index) => (
              <Tabs.Item
                key={index}
                title={
                  <span style={{ whiteSpace: "nowrap" }}>{t(tab.title)}</span>
                }
                icon={tab.icon}
              ></Tabs.Item>
            ))}
          </Tabs.Group>
        </div>
        {isScrollbarVisible && (
          <button
            onClick={scrollRight}
            className="icon-button my-4 py-1 px-1 m-1 text-lg border border-gray-200 rounded-md"
          >
            <HiOutlineChevronRight />
          </button>
        )}
      </div>
      {contents.map((content, index) => (
        <div
          key={index}
          style={{ display: index === tabIndex ? "block" : "none" }}
        >
          <>
            {React.cloneElement(content, {
              item: formData,
              onFormChange: handleFormChange,
            })}
          </>
        </div>
      ))}
    </div>
  );
};
