/* eslint-disable @typescript-eslint/no-explicit-any */
import { ToggleSwitch } from "flowbite-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ItemModel } from "../models/ItemModel";
import { TabCalendarModal } from "./TabCalendarModal";

interface TabCalendarProps {
  onSessionsChange: (sessions: any) => void;
  defaultSessions: any;
  installationStates: any[];
  item: ItemModel | null;
  onSessionsUpdate: (sessions: any) => void;
  onSessionsDelete: (sessions: any) => void;
}

export default function TabItemCalendar({
  onSessionsChange: onSessionsChange,
  defaultSessions,
  installationStates,
  onSessionsUpdate: onSessionsUpdate,
  onSessionsDelete: onSessionsDelete,
}: TabCalendarProps) {
  const formatDays = [
    {
      name: "Lunes",
      checked: true,
      sessions: [],
      index: 0,
      nameBd: "MONDAY",
    },
    {
      name: "Martes",
      checked: true,
      sessions: [],
      index: 1,
      nameBd: "TUESDAY",
    },
    {
      name: "Miercoles",
      checked: true,
      sessions: [],
      index: 2,
      nameBd: "WEDNESDAY",
    },
    {
      name: "Jueves",
      checked: true,
      sessions: [],
      index: 3,
      nameBd: "THURSDAY",
    },
    {
      name: "Viernes",
      checked: true,
      sessions: [],
      index: 4,
      nameBd: "FRIDAY",
    },
    {
      name: "Sábado",
      checked: true,
      sessions: [],
      index: 5,
      nameBd: "SATURDAY",
    },
    {
      name: "Domingo",
      checked: true,
      sessions: [],
      index: 6,
      nameBd: "SUNDAY",
    },
  ];
  const [arrayDays, setArrayDays] = useState<any>(formatDays);
  const [isOpen, setIsOpen] = useState(false);
  const [item, setItem] = useState<any>(null);
  const [sessionsIdUpdated, setSessionsIdUpdated] = useState<any>([]);
  const [sessionsUpdated, setSessionsUpdated] = useState<any>([]);
  const [sessionsDeleted, setSessionsDeleted] = useState<any>([]);

  const { t } = useTranslation();

  const handlecheck = (index: number, state: boolean) => {
    const newArray = [...arrayDays];
    newArray[index].checked = !state;
    setArrayDays(newArray);
  };

  const openModal = (item: any) => {
    setIsOpen(true);
    setItem(item);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const updateSessions = (index: any, sessions: any) => {
    const newArray = [...arrayDays];
    newArray[index].sessions = sessions;
    setArrayDays(newArray);
  };

  const sessionsToUpdate = (ids: any) => {
    const newArray = [...sessionsIdUpdated];
    ids.forEach((id: any) => {
      if (id !== newArray[newArray.indexOf(id)]) newArray.push(id);
    });
    setSessionsIdUpdated(newArray);
  };

  const sessionsToDelete = (sessions: any) => {
    const newArray = [...sessionsDeleted];
    sessions.forEach((session: any) => {
      newArray.push(session);
    });
    setSessionsDeleted(newArray);
  };

  useEffect(() => {
    const newArray = [...sessionsUpdated];
    arrayDays.forEach((day: any) => {
      day.sessions.forEach((session: any) => {
        if (sessionsIdUpdated.includes(session.id)) {
          if (newArray.length > 0) {
            if (
              sessionsIdUpdated[sessionsIdUpdated.indexOf(session.id)] ===
              session.id
            ) {
              if (newArray[newArray.indexOf(session)] === undefined) {
                newArray.push(session);
              }
            }
          } else {
            newArray.push(session);
          }
        }
      });
    });
    setSessionsUpdated(newArray);
  }, [sessionsIdUpdated]);

  useEffect(() => {
    onSessionsUpdate(sessionsUpdated);
  }, [sessionsUpdated]);

  useEffect(() => {
    onSessionsDelete(sessionsDeleted);
  }, [sessionsDeleted]);

  useEffect(() => {
    onSessionsChange(arrayDays);
  }, [arrayDays]);

  useEffect(() => {
    if (defaultSessions.length > 0) {
      const newArray = [...arrayDays];
      newArray.forEach((day) => {
        day.sessions = [];
      });
      defaultSessions.forEach((session: any) => {
        newArray[
          newArray.findIndex((day: any) => day.nameBd === session.day)
        ].sessions.push(session);
      });
      setArrayDays(newArray);
    }
  }, [defaultSessions]);

  return (
    <>
      <div className="divide-y">
        {arrayDays.map((day: any, index: any) => (
          <div key={index} className="p-2">
            <div className="flex justify-between p-2">
              <div>
                <div className="flex justify-center gap-4">
                  <ToggleSwitch
                    checked={day.checked}
                    onChange={() => handlecheck(index, day.checked)}
                  />
                  <h1 className="cursor-pointer" onClick={() => openModal(day)}>
                    {day.name}
                  </h1>
                </div>
              </div>
              <div>
                <div className="flex justify-center gap-4">
                  <h1 className="cursor-pointer" onClick={() => openModal(day)}>
                    {day.sessions.length} {t("SESSIONS").toLocaleLowerCase()}
                  </h1>
                  {/* <Dropdown
                    label=""
                    dismissOnClick={false}
                    renderTrigger={() => (
                      <span className="cursor-pointer rounded-full hover:bg-gray-200">
                        <LuMoreVertical size={30} />
                      </span>
                    )}
                  >
                    <Dropdown.Item>
                      <LuCopy />{" "}
                      <span className="ml-2">{t("COPY_SESSIONS")}</span>
                    </Dropdown.Item>
                  </Dropdown> */}
                </div>
              </div>
            </div>
          </div>
        ))}
        {isOpen ? (
          <TabCalendarModal
            item={item}
            openModal={isOpen}
            defaultSessions={item.sessions}
            closeModal={closeModal}
            installationStates={installationStates}
            onSessions={(sessions, index) => updateSessions(index, sessions)}
            onSessionsUpdated={(sessions) => sessionsToUpdate(sessions)}
            onSessionsDeleted={(sessions) => sessionsToDelete(sessions)}
          />
        ) : null}
      </div>
    </>
  );
}
