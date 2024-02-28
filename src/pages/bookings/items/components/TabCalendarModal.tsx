/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { Button, Checkbox, Modal, Select, TextInput } from "flowbite-react";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { HiTrash } from "react-icons/hi";
import { LuRefreshCcw } from "react-icons/lu";

interface TabCalendarModalProps {
  item: any | null;
  openModal: boolean;
  defaultSessions: any;
  closeModal: Function;
  onSessions: (sessions: any, index: number) => void;
  onSessionsUpdated: (sessions: any) => void;
  onSessionsDeleted: (sessions: any) => void;
  installationStates: any[];
}

export function TabCalendarModal({
  item: item,
  openModal,
  closeModal,
  defaultSessions,
  onSessions: onSessions,
  onSessionsUpdated: onSessionsUpdated,
  onSessionsDeleted: onSessionsDeleted,
  installationStates,
}: TabCalendarModalProps) {
  const [isOpen, setOpen] = useState(false);
  const [sessions, setSessions] = useState<any>(
    defaultSessions.length == 0
      ? [
          {
            init: "09:00",
            duration: 60,
            price: 10,
            state: true,
            light: false,
            day: item.nameBd,
            order: 0,
            price_light: 0,
            bookings_state_id: installationStates[0].id,
          },
        ]
      : defaultSessions,
  );

  const [sessionsUpdated, setSessionsUpdated] = useState<any>([]);
  const [sessionsToDelete, setSessionsToDelete] = useState<any>([]);

  const createSessions = () => {
    onSessions(sessions, item.index);
    closeModal(true);
  };

  useEffect(() => {
    if (defaultSessions.length > 0) {
      defaultSessions.sort((a: any, b: any) => a.order - b.order);
      setSessions(defaultSessions);
    }
  }, [defaultSessions]);

  const close = () => {
    setOpen(false);
    closeModal(true);
  };

  useEffect(() => {
    setOpen(openModal);
  }, [openModal]);

  const addRow = () => {
    const duration =
      sessions.length > 0 ? sessions[sessions.length - 1].duration : 60;
    const date_init =
      sessions.length > 0
        ? calculateInit(
            sessions[sessions.length - 1].init,
            sessions[sessions.length - 1].duration,
          )
        : "09:00";
    const state = true;
    const light = false;
    const price = sessions.length > 0 ? sessions[sessions.length - 1].price : 0;
    const order =
      sessions.length > 0 ? sessions[sessions.length - 1].order + 1 : 0;

    const row = {
      init: date_init,
      duration: duration,
      state: state,
      light: light,
      price: price,
      day: item.nameBd,
      order: order,
      price_light: 0,
      bookings_state_id: installationStates[0].id,
    };

    setSessions([...sessions, row]);
  };

  const changeSession = (index: any, data: any, prop: any) => {
    const newArray = [...sessions];
    const newArrayUpdated = [...sessionsUpdated];
    newArray[index][prop] = data;
    if (newArrayUpdated.length > 0) {
      if (
        newArrayUpdated[newArrayUpdated.indexOf(newArray[index].id)] !==
        newArray[index].id
      ) {
        newArrayUpdated.push(newArray[index].id);
      }
    } else {
      newArrayUpdated.push(newArray[index].id);
    }
    setSessions(newArray);
    setSessionsUpdated(newArrayUpdated);
  };

  useEffect(() => {
    onSessionsUpdated(sessionsUpdated);
  }, [sessionsUpdated]);

  const deleteRow = (index: any) => {
    const newRows = [...sessions];
    const rowsToDelete = [...sessionsToDelete];
    rowsToDelete.push(newRows[index]);
    newRows.splice(index, 1);
    setSessionsToDelete(rowsToDelete);
    setSessions(newRows);
  };

  useEffect(() => {
    onSessionsDeleted(sessionsToDelete);
  }, [sessionsToDelete]);

  const calculateInit = (init: any, duration: any) => {
    const date = new Date();
    const time = init.split(":");
    date.setHours(parseInt(time[0]), parseInt(time[1]));
    if (duration > 60) {
      const h = duration / 60;
      duration = duration % 60;
      date.setHours(+date.getHours() + +Math.trunc(h));
    }
    date.setMinutes(+date.getMinutes() + +duration);
    time[0] = date.getHours().toString();
    time[1] = date.getMinutes().toString();
    time[0].length < 2 ? (time[0] = "0" + time[0]) : null;
    time[1].length < 2 ? (time[1] = "0" + time[1]) : null;
    init = time[0].concat(":", time[1]);
    return init;
  };

  useEffect(() => {
    setOpen(openModal);
  }, [openModal]);

  const recalculateSessions = () => {
    const defaultSessions = [...sessions];
    let i = 0;
    defaultSessions.forEach((session) => {
      if (i > 0) {
        session.init = calculateInit(
          sessions[i - 1].init,
          sessions[i - 1].duration,
        );
      }
      i++;
    });
    console.log("defaultSessions", defaultSessions);
    setSessions(defaultSessions);
  };

  return (
    <>
      <Modal dismissible onClose={() => close()} show={isOpen} size={"5xl"}>
        <form>
          <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
            <strong>
              {t("EDIT_BTN")} {item.name}
            </strong>
          </Modal.Header>
          <Modal.Body className="max-h-[70vh]">
            <div>
              <div className="flex flex-row sm:flex-col w-full mb-5">
                <div className="hidden sm:display-1 w-1/2 sm:w-full sm:grid sm:grid-cols-12 sm:gap-4 sm:items-center sm:border-b sm:border-gray-200 sm:pt-5">
                  <a className="py-4 col-span-2 block text-sm font-bold leading-5 text-gray-700 sm:mt-px sm:pt-2">
                    {t("DATE_INIT")}
                  </a>
                  <a className="py-3 col-span-2 block text-sm font-bold leading-5 text-gray-700 sm:mt-px sm:pt-2">
                    {t("DURATION")}
                  </a>
                  <a className="py-3 col-span-2 block text-sm font-bold leading-5 text-gray-700 sm:mt-px sm:pt-2">
                    {t("PRICE")}
                  </a>
                  <a className="py-3 col-span-2 block text-sm font-bold leading-5 text-gray-700 sm:mt-px sm:pt-2">
                    {t("STATE")}
                  </a>
                  <a className="py-3 ml-12 col-span-2 block text-sm font-bold leading-5 text-gray-700 sm:mt-px sm:pt-2">
                    {t("LIGHT")}
                  </a>
                  <a className="py-2.5 col-span-2 block text-sm font-bold leading-5 text-gray-700 sm:mt-px sm:pt-2">
                    {t("LIGHT_PRICE")}
                  </a>
                </div>
              </div>
              <div className="flex flex-col sm:flex-grow sm:w-full w-1/2 overflow-auto max-h-96">
                {sessions.map((session: any, index: number) => (
                  <div
                    key={session.init}
                    className="border-b mb-2 sm:grid sm:grid-cols-12 sm:gap-4 sm:items-start sm:border-b sm:border-gray-200 sm:pt-5 sm:pb-5"
                  >
                    <div className="col-span-2 mt-1 sm:mt-0">
                      <TextInput
                        onBlur={(e) =>
                          changeSession(index, e.currentTarget.value, "init")
                        }
                        defaultValue={session.init}
                      />
                    </div>
                    <div className="col-span-2 mt-1 sm:mt-0">
                      <TextInput
                        onBlur={(e) =>
                          changeSession(
                            index,
                            e.currentTarget.value,
                            "duration",
                          )
                        }
                        defaultValue={session.duration}
                      />
                    </div>
                    <div className="col-span-2 mt-1 sm:mt-0">
                      <TextInput
                        onBlur={(e) =>
                          changeSession(index, e.currentTarget.value, "price")
                        }
                        defaultValue={session.price}
                      />
                    </div>
                    <div className="col-span-2 mt-1 sm:mt-0">
                      <Select
                        onBlur={(e) =>
                          changeSession(
                            index,
                            e.currentTarget.value,
                            "bookings_state_id",
                          )
                        }
                        defaultValue={session.bookings_state_id}
                      >
                        {installationStates.map((state, index) => (
                          <option key={index} value={state.id}>
                            {state.title}
                          </option>
                        ))}
                      </Select>
                    </div>
                    <div className="col-span-2 mt-1 sm:mt-0">
                      <Checkbox
                        className="mt-2 ml-12"
                        onChange={(e) =>
                          changeSession(index, e.currentTarget.checked, "light")
                        }
                        defaultChecked={session.light}
                      />
                    </div>
                    <div className="col-span-2 mt-1 sm:mt-0">
                      <div className="flex gap-4">
                        <TextInput
                          onBlur={(e) =>
                            changeSession(
                              index,
                              e.currentTarget.value,
                              "light_price",
                            )
                          }
                          defaultValue={session.price_light}
                        />

                        {index === sessions.length - 1 ? (
                          <Button
                            size="sm"
                            color="light"
                            onClick={() => deleteRow(index)}
                          >
                            <HiTrash className="text-red-500" />
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-row sm:flex-col w-full px-10 mt-5">
                <Button color="gray" onClick={() => addRow()}>
                  {t("ADD_BTN")}
                </Button>
                <Button color="gray" onClick={() => addRow()}>
                  {t("ADD_BTN")}
                </Button>
              </div>
            </div>
          </Modal.Body>

          <Modal.Footer className="flex justify-between">
            <div className="flex items-center">
              <LuRefreshCcw className="mr-1 text-blue-700 font-bold" />
              <a
                className="text-blue-700 cursor-pointer"
                onClick={() => recalculateSessions()}
                /*  onClick={() => openModalEdit("add")} */
              >
                Recalcular
              </a>
            </div>
            <Button color="primary" onClick={createSessions}>
              {t("SAVE")}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}
