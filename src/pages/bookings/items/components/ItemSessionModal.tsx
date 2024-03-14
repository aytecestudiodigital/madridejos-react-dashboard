/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Checkbox,
  Label,
  Modal,
  Select,
  TextInput,
} from "flowbite-react";
import { t } from "i18next";
import { useContext, useEffect, useState } from "react";
import { insertRow, updateRow } from "../../../../server/supabaseQueries";
import { AlertContext } from "../../../../context/AlertContext";

interface ItemSessionModalProps {
  openModal: boolean;
  defaultSessions: any;
  items: any;
  itemSelected: any;
  states: any;
  closeModal: (state: boolean) => void;
  onSessions: (sessions: any) => void;
}

export function ItemSessionModal({
  openModal,
  defaultSessions,
  items,
  itemSelected,
  states,
  closeModal,
  onSessions: onSessions,
}: ItemSessionModalProps) {
  const [isOpen, setOpen] = useState(false);
  const [sessionsChanged, setSessionsChanged] =
    useState<any[]>(defaultSessions);
  const [newSession, setNewSession] = useState<any>({});
  const [selectedItem, setSelectedItem] = useState<any>(itemSelected.id);
  const tableBookingsSessions = import.meta.env.VITE_TABLE_BOOKINGS_SESSIONS;
  const { openAlert } = useContext(AlertContext);

  const close = () => {
    setOpen(false);
    closeModal(true);
  };

  useEffect(() => {
    setOpen(openModal);
  }, [openModal]);

  useEffect(() => {
    if (defaultSessions.length > 0) {
      defaultSessions.forEach((session: any) => {
        if (
          parseInt(new Date(session.date).toLocaleTimeString().split(":")[0]) >=
          10
        ) {
          session.init =
            new Date(session.date).toLocaleTimeString().split(":")[0] +
            ":" +
            new Date(session.date).toLocaleTimeString().split(":")[1];
        } else if (
          new Date(session.date).toLocaleTimeString().startsWith("0") === true
        ) {
          session.init =
            new Date(session.date).toLocaleTimeString().split(":")[0] +
            ":" +
            new Date(session.date).toLocaleTimeString().split(":")[1];
        } else {
          session.init =
            "0" +
            new Date(session.date).toLocaleTimeString().split(":")[0] +
            ":" +
            new Date(session.date).toLocaleTimeString().split(":")[1];
        }
      });
      setSessionsChanged(defaultSessions);
    }
  }, [defaultSessions]);

  const onChangeSession = (data: any, index: any, prop: any, method: any) => {
    if (method === "edit") {
      const newArray = [...sessionsChanged];
      newArray[index][prop] = data;
      setSessionsChanged(newArray);
    } else {
      const newObject = { ...newSession };
      newObject[prop] = data;
      setNewSession(newObject);
    }
  };

  const saveSession = async () => {
    if (defaultSessions.length > 0) {
      for await (const session of sessionsChanged) {
        const sessionToUpdate = {
          id: session.id,
          date: new Date(session.date.split("T")[0] + "T" + session.init),
          bookings_item_id: itemSelected.id,
          bookings_state_id: session.state,
          price: session.price,
          duration: session.duration,
          bookings_id: null,
          price_light: session.price_light,
          selected: false,
          light: session.light,
        };
        await updateRow(sessionToUpdate, tableBookingsSessions);
      }
      if (defaultSessions.length == 1) {
        openAlert(t("SESSION_UPDATE_OK"), "update");
      } else if (defaultSessions.length > 1) {
        openAlert(t("SESSIONS_UPDATE_OK"), "update");
      }
      close();
    } else {
      const sessionToCreate = {
        date: new Date(newSession.date + "T" + newSession.init),
        bookings_item_id: selectedItem,
        bookings_state_id: newSession.state,
        price: newSession.price,
        duration: newSession.duration,
        bookings_id: null,
        price_light: newSession.price_light,
        selected: false,
        light: newSession.light,
      };
      await insertRow(sessionToCreate, tableBookingsSessions);
      openAlert(t("SESSION_INSERT_OK"), "insert");
      close();
    }
    onSessions(true);
  };

  return (
    <Modal dismissible onClose={() => close()} show={isOpen} size={"5xl"}>
      <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
        <strong>{t("CREATE_EDIT_SESSION")}</strong>
      </Modal.Header>
      <Modal.Body>
        <div className="flex flex-row sm:flex-col w-full">
          <div className="hidden sm:display-1 w-1/2 sm:w-full sm:grid sm:grid-cols-12 sm:gap-4 sm:items-center sm:border-b sm:border-gray-200 pb-2">
            <a className="col-span-2 block text-sm font-bold leading-5 text-gray-700 sm:mt-px ">
              {t("DAY")} *
            </a>
            <a className="col-span-2 block text-sm font-bold leading-5 text-gray-700 sm:mt-px">
              {t("DATE_INIT")} *
            </a>
            <a className="col-span-2 block text-sm font-bold leading-5 text-gray-700 sm:mt-px">
              {t("DURATION")} *
            </a>
            <a className="col-span-2 block text-sm font-bold leading-5 text-gray-700 sm:mt-px">
              {t("PRICE")} *
            </a>
            <a className="col-span-2 block text-sm font-bold leading-5 text-gray-700 sm:mt-px">
              {t("STATE")} *
            </a>
            <a className="col-span-1 block text-sm font-bold leading-5 text-gray-700 sm:mt-px">
              {t("LIGHT")} *
            </a>
            <a className="col-span-1 block text-sm font-bold leading-5 text-gray-700 sm:mt-px">
              {t("LIGHT_PRICE")} *
            </a>
          </div>
        </div>
        <div className="flex flex-col sm:flex-grow sm:w-full w-1/2 overflow-auto max-h-[60vh]">
          {defaultSessions.length > 0 ? (
            defaultSessions.map((session: any, index: any) => (
              <div
                key={index}
                className="border-b mb-2 sm:grid sm:grid-cols-12 sm:gap-4 sm:items-center sm:border-b sm:border-gray-200 sm:pt-5 sm:pb-5"
              >
                <div className="col-span-2 mt-1 sm:mt-0 text-sm">
                  {new Date(session.date).toLocaleDateString()}
                </div>
                <div className="col-span-2 mt-1 sm:mt-0">
                  <TextInput
                    onBlur={(e) =>
                      onChangeSession(
                        e.currentTarget.value,
                        index,
                        "init",
                        "edit",
                      )
                    }
                    type="time"
                    defaultValue={session.init}
                  />
                  {/*  <p className="text-xs text-gray-500 mt-1">
                    {t("FORMAT_EXAMPLE")}
                  </p> */}
                </div>
                <div className="col-span-2 mt-1 sm:mt-0">
                  <TextInput
                    placeholder="Minutos"
                    onBlur={(e) =>
                      onChangeSession(
                        e.currentTarget.value,
                        index,
                        "duration",
                        "edit",
                      )
                    }
                    defaultValue={session.duration}
                    type="number"
                  />
                </div>
                <div className="col-span-2 mt-1 sm:mt-0">
                  <TextInput
                    placeholder="€"
                    onBlur={(e) =>
                      onChangeSession(
                        e.currentTarget.value,
                        index,
                        "price",
                        "edit",
                      )
                    }
                    defaultValue={session.price}
                    type="number"
                  />
                </div>
                <div className="col-span-2 mt-1 sm:mt-0">
                  <Select
                    onBlur={(e) =>
                      onChangeSession(
                        e.currentTarget.value,
                        index,
                        "state",
                        "edit",
                      )
                    }
                    defaultValue={session.bookings_state_id}
                  >
                    {states.map((state: any, index: any) => (
                      <option key={index} value={state.id}>
                        {state.title}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="col-span-1 mt-1 sm:mt-0">
                  <Checkbox
                    onBlur={(e) =>
                      onChangeSession(
                        e.currentTarget.checked,
                        index,
                        "light",
                        "edit",
                      )
                    }
                    defaultChecked={session.light}
                  />
                </div>
                <div className="col-span-1 mt-1 sm:mt-0">
                  <TextInput
                    placeholder="€"
                    onBlur={(e) =>
                      onChangeSession(
                        e.currentTarget.value,
                        index,
                        "price_light",
                        "edit",
                      )
                    }
                    defaultValue={session.price_light}
                    type="number"
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="border-b mb-2 sm:grid sm:grid-cols-12 sm:gap-4 sm:items-start sm:border-b sm:border-gray-200 sm:pt-5 sm:pb-5">
              <div className="col-span-2 mt-1 sm:mt-0 text-xs">
                <TextInput
                  onBlur={(e) =>
                    onChangeSession(e.currentTarget.value, 0, "date", "insert")
                  }
                  type="date"
                />
              </div>
              <div className="col-span-2 mt-1 sm:mt-0">
                <TextInput
                  onBlur={(e) =>
                    onChangeSession(e.currentTarget.value, 0, "init", "insert")
                  }
                  type="time"
                />
                {/* <p className="text-xs text-gray-500 mt-1">
                  {t("FORMAT_EXAMPLE")}
                </p> */}
              </div>
              <div className="col-span-2 mt-1 sm:mt-0">
                <TextInput
                  placeholder="Minutos"
                  onBlur={(e) =>
                    onChangeSession(
                      e.currentTarget.value,
                      0,
                      "duration",
                      "insert",
                    )
                  }
                  type="number"
                />
              </div>
              <div className="col-span-2 mt-1 sm:mt-0">
                <TextInput
                  placeholder="€"
                  onBlur={(e) =>
                    onChangeSession(e.currentTarget.value, 0, "price", "insert")
                  }
                  type="number"
                />
              </div>
              <div className="col-span-2 mt-1 sm:mt-0">
                <Select
                  onBlur={(e) =>
                    onChangeSession(e.currentTarget.value, 0, "state", "insert")
                  }
                >
                  {states.map((state: any, index: any) => (
                    <option key={index} value={state.id}>
                      {state.title}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="col-span-1 mt-1 sm:mt-0">
                <Checkbox
                  onBlur={(e) =>
                    onChangeSession(
                      e.currentTarget.checked,
                      0,
                      "light",
                      "insert",
                    )
                  }
                />
              </div>
              <div className="col-span-1 mt-1 sm:mt-0">
                <TextInput
                  placeholder="€"
                  onBlur={(e) =>
                    onChangeSession(
                      e.currentTarget.value,
                      0,
                      "price_light",
                      "insert",
                    )
                  }
                  type="number"
                />
              </div>
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex flex-grow justify-between">
          {defaultSessions.length === 0 ? (
            items.length > 1 ? (
              <>
                <div className="flex items-center">
                  <Label className="mr-2">Pista seleccionada:</Label>
                  <Select
                    onChange={(e) => setSelectedItem(e.currentTarget.value)}
                  >
                    <option value="">Pista</option>
                    {items.map((item: any, index: any) => (
                      <option value={item.id} key={index}>
                        {item.title}
                      </option>
                    ))}
                  </Select>
                </div>
                <Button
                  size={"sm"}
                  color="primary"
                  disabled={
                    selectedItem === "" ||
                    newSession.date == undefined ||
                    newSession.init == undefined ||
                    newSession.duration == undefined ||
                    newSession.price == undefined ||
                    newSession.state == undefined ||
                    newSession.light == undefined ||
                    newSession.price_light == undefined
                  }
                  onClick={saveSession}
                >
                  {t("CONFIRM")}
                </Button>
              </>
            ) : (
              <div className="flex flex-grow justify-end">
                <Button
                  size={"sm"}
                  color="primary"
                  disabled={
                    newSession.date == undefined ||
                    newSession.init == undefined ||
                    newSession.duration == undefined ||
                    newSession.price == undefined ||
                    newSession.state == undefined ||
                    newSession.light == undefined ||
                    newSession.price_light == undefined
                  }
                  onClick={saveSession}
                >
                  {t("CONFIRM")}
                </Button>
              </div>
            )
          ) : (
            <>
              <div className="flex items-center">
                <Label className="mr-2">Pista seleccionada:</Label>
                <p> {itemSelected.title}</p>
              </div>
              <Button size={"sm"} color="primary" onClick={saveSession}>
                {t("CONFIRM")}
              </Button>
            </>
          )}
        </div>
      </Modal.Footer>
    </Modal>
  );
}
