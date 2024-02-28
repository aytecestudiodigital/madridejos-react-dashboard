/* eslint-disable @typescript-eslint/no-explicit-any */
import { Calendar, View, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { BookingSessionModal } from "../pages/bookings/items/components/BookingSessionModal";
import { ItemSessionModal } from "../pages/bookings/items/components/ItemSessionModal";
import { BookingsView } from "./CalendarCustomView";
import { getOneRow, updateRow } from "../server/supabaseQueries";
import { supabase } from "../server/supabase";
import "moment/locale/es";
import BookingDetailsModal from "./BookingDetailsModal";
import {
  LuCalendarCheck,
  LuPlus,
  LuSettings,
  LuTrash2,
  LuX,
} from "react-icons/lu";
import { DeleteSessionModal } from "../pages/bookings/items/components/DeleteSessionModal";
import { ConfirmBookingModal } from "../pages/bookings/items/components/ConfirmBookingModal";
import { t } from "i18next";
import { useContext } from "react";
import { AlertContext } from "../context/AlertContext";
import SelectCourtFilter from "./SelectCourtFilter";
import SelectCourtState from "./SelectCourtState";
import toast from "react-hot-toast";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";
import { Label, Spinner } from "flowbite-react";

interface BookingsCalendarProps {
  defaultView: View;
  component: string;
  item: any[];
  states: any;
  installation: any;
}

export default function BookingsCalendar({
  defaultView,
  component,
  item,
  states,
  installation,
}: BookingsCalendarProps) {
  const { openAlert } = useContext(AlertContext);
  const [calendarDates, setCalendarDates] = useState<any[]>([]);
  const [datesSelected, setDatesSelected] = useState<any[]>([]);
  const [arraySessionsEdit, setArraySessionsEdit] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState<any>(false);
  const [isOpenBooking, setIsOpenBooking] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpenDetails, setIsOpenDetails] = useState<boolean>(false);
  const [selectedBooking, setSelectedBooking] = useState<any>({});
  const [itemSelected, setItemSelected] = useState<any>(item[0]);
  const [bookingDetails, setBookingDetails] = useState<any>();
  const [selectedMethod, setSelectedMethod] = useState<any>("");
  const user = useSelector((state: RootState) => state.auth.user);
  const [calendarHeight, setCalendarHeight] = useState(550);

  useLayoutEffect(() => {
    function updateSize() {
      // Verifica el ancho de la pantalla y ajusta la altura del calendario en consecuencia
      if (window.innerWidth < 1600) {
        // Si es una pantalla pequeña
        setCalendarHeight(550); // Asigna una altura más pequeña
      } else {
        setCalendarHeight(900); // Asigna la altura normal
      }
    }
    window.addEventListener("resize", updateSize); // Agrega un listener para el evento de cambio de tamaño
    updateSize(); // Llama a la función para ajustar el tamaño inicialmente
    return () => window.removeEventListener("resize", updateSize); // Elimina el listener cuando el componente se desmonta
  }, []); // Se ejecuta solo una vez al montar el componente

  moment.locale("es", {
    week: {
      dow: 1,
      doy: 1,
    },
  });
  const localizer = momentLocalizer(moment);
  const tableBookings = import.meta.env.VITE_TABLE_BOOKINGS;
  const tableBookingsSessions = import.meta.env.VITE_TABLE_BOOKINGS_SESSIONS;
  const tableBookingsItems = import.meta.env.VITE_TABLE_BOOKINGS_ITEMS;
  const [loading, setLoading] = useState(false);
  const [selectedCourts, setSelectedCourts] = useState<any>([]);
  const [selectedStates, setSelectedStates] = useState<any>([]);
  const [itemsDefault, setItemsDefault] = useState<any[]>([]);
  const eventPropGetter = useCallback(
    (event: any) => ({
      className: "",
      ...(event.isSelected && {
        style: {
          backgroundColor: "orange",
          color: "black",
        },
      }),
      ...(!event.isSelected &&
        event.bookings_id === null && {
          style: {
            backgroundColor: "green",
          },
        }),
      ...(!event.isSelected &&
        event.bookings_id === null &&
        event.selected && {
          style: {
            backgroundColor: "purple",
            color: "white",
          },
        }),
      ...(!event.isSelected &&
        event.bookings_id !== null && {
          style: {
            backgroundColor: "yellow",
            color: "black",
          },
        }),
      ...(!event.isSelected &&
        event.bookings_id === null &&
        event.type === "booking" && {
          style: {
            backgroundColor: "cyan",
            color: "black",
          },
        }),
      ...(!event.isSelected &&
        event.bookings_id === null &&
        event.type === "booking" &&
        event.status === "CANCELED" && {
          style: {
            backgroundColor: "red",
            color: "black",
          },
        }),
      ...(!event.isSelected &&
        event.bookings_id === null &&
        event.type === "booking" &&
        event.status === "PENDING" && {
          style: {
            backgroundColor: "orange",
            color: "black",
          },
        }),
      ...(!event.isSelected &&
        event.bookings_id === null &&
        event.type === "booking" &&
        event.status === "CONFIRMED" && {
          style: {
            backgroundColor: "green",
            color: "white",
          },
        }),
      ...(!event.isSelected &&
        event.bookings_id === null &&
        event.type === "booking" &&
        event.status === "IN_PROGRESS" && {
          style: {
            backgroundColor: "yellow",
            color: "black",
          },
        }),
      ...(!event.isSelected &&
        event.bookings_id === null &&
        event.type === "booking" &&
        (event.status === "DENIED" || event.status === "ERROR") && {
          style: {
            backgroundColor: "black",
            color: "white",
          },
        }),
      ...(!event.isSelected &&
        event.bookings_id === null &&
        event.type === "booking" &&
        event.status === "COMPLETED" && {
          style: {
            backgroundColor: "cyan",
            color: "white",
          },
        }),
      ...(!event.isSelected &&
        event.bookings_id === null &&
        event.state && {
          style: {
            backgroundColor: event.state.color,
            color: "black",
          },
        }),
    }),
    [],
  );

  useEffect(() => {
    if (installation && installation !== "") {
      const fetchData = async () => {
        const pre = await getOneRow("id", installation, "bookings_items");
        setItemsDefault([pre]);
      };
      fetchData();
    }
  }, [installation]);

  /* useEffect(() => {
    if(item[0] && item.length > 0){
      setItemsDefault(item)
    }else{
      setItemsDefault([])
    }
  }, [item]) */

  /* useEffect(() => {
    window.onbeforeunload = function () {
      handleUnselectEvents()
      return ""
    };
  }, [window.onbeforeunload]) */

  /* useEffect(() => {
    window.onunload = function () {
      handleUnselectEvents()
      return ""
    }
  }, [window.onunload]) */

  const { messages } = useMemo(
    () => ({
      messages: {
        week: "S",
        day: "D",
        month: "M",
        previous: "Ant.",
        next: "Sig.",
        today: "Hoy",
        agenda: "Reservas",

        showMore: (total: any) => `+${total} más`,
      },
    }),
    [],
  );

  const { views } = useMemo(
    () => ({
      views: {
        month: true,
        week: true,
        day: true,
        agenda: BookingsView,
      },
    }),
    [],
  );

  const formatSessions = (data: any) => {
    const sessions: any[] = [];
    data!.forEach((session: any) => {
      session.init =
        new Date(session.date).getHours() +
        ":" +
        new Date(session.date).getMinutes();
      if (parseInt(session.init.split(":")[0]) < 10) {
        session.init =
          "0" + session.init.split(":")[0] + ":" + session.init.split(":")[1];
      }
      if (parseInt(session.init.split(":")[1]) === 0) {
        session.init =
          session.init.split(":")[0] + ":" + session.init.split(":")[1] + "0";
      }
      sessions.push(session);
    });
    return sessions;
  };

  useEffect(() => {
    BookingsView.item = [];
    const defaultItems = [...itemsDefault];
    const fetchData = async () => {
      if (component === "installation_item") {
        setLoading(true);
        if (defaultItems[0] && defaultItems.length > 0) {
          if (defaultItems.length === 1) {
            const newDates: any[] = [];
            const arrayData: any[] = [];
            for await (const i of defaultItems) {
              const { data } = await supabase
                .from(tableBookingsSessions)
                .select(
                  "*, bookings_states(id, title, color, bookeable), item:bookings_items(title)",
                )
                .eq("bookings_item_id", i.id)
                .is("bookings_id", null);
              data?.forEach((d) => {
                arrayData.push(d);
              });
            }
            for await (const i of defaultItems) {
              const { data } = await supabase
                .from(tableBookingsSessions)
                .select(
                  "*, bookings_states(id, title, color, bookeable), item:bookings_items(title)",
                )
                .eq("bookings_item_id", i.id)
                .not("bookings_id", "is", null);
              data?.forEach((d) => {
                arrayData.push(d);
              });
            }
            if (arrayData.length > 0) {
              const sessions: any[] = formatSessions(arrayData);
              for await (const date of sessions) {
                const object = {
                  start: moment(date.date).toDate(),
                  end: moment(date.date).toDate(),
                  bookings_item_id: date.bookings_item_id,
                  title: date.item.title,
                  id: date.id,
                  isSelected: false,
                  bookings_id: date.bookings_id,
                  state: date.bookings_states,
                  duration: date.duration,
                  selected: date.selected,
                };
                newDates.push(object);
              }
              setCalendarDates(newDates);
              setItemSelected(item[0]);
              setLoading(false);
            } else {
              setCalendarDates([]);
              setLoading(false);
            }
          }
        } else {
          setCalendarDates([]);
          setLoading(false);
        }
      } else if (component === "bookings") {
        setLoading(true);
        const { data } = await supabase
          .from(tableBookings)
          .select(
            `*,users!bookings_user_id_fkey(name, surname),bookings_items(id,title) `,
            { count: "exact" },
          );
        const sessions = formatSessions(data);
        const newDates: any[] = [];
        if (sessions) {
          for await (const date of sessions) {
            const object = {
              start: moment(date.date).toDate(),
              end: moment(date.date).toDate(),
              title: date.users.name,
              id: date.id,
              isSelected: false,
              bookings_id: null,
              type: "booking",
              status: date.state,
            };
            newDates.push(object);
          }
          setCalendarDates(newDates);
          setLoading(false);
        } else {
          setCalendarDates([]);
          setLoading(false);
        }
      }
    };
    fetchData();
    if (itemsDefault.length > 0) {
      BookingsView.item = item;
    } else {
      BookingsView.item = [];
    }
  }, [itemsDefault]);

  /* const changeItem = async (id: string) => {
    if (id !== "") {
      const newDates: any[] = [];
      const newItem = await getOneRow("id", id, tableBookingsItems);
      const { data } = await supabase
        .from(tableBookingsSessions)
        .select("*, bookings_states(title, color, bookeable)")
        .eq("bookings_item_id", id);
      if (data && data?.length > 0) {
        const sessions: any[] = formatSessions(data);
        for await (const date of sessions) {
          const object = {
            start: moment(date.date).toDate(),
            end: moment(date.date).toDate(),
            title: date.init,
            id: date.id,
            isSelected: false,
            bookings_id: date.bookings_id,
            state: date.bookings_states,
          };
          newDates.push(object);
        }
      }
      setCalendarDates(newDates);
      setDatesSelected([]);
      setItemSelected(newItem);
      BookingsView.item = newItem;
    }
  }; */

  const handleSelectEvent = async (e: any) => {
    if (item[0]) {
      if (e.bookings_id === null && e.state === null) {
        const newArray = [...calendarDates];
        const newArraySelected = [...datesSelected];
        newArray[newArray.findIndex((event) => event.id === e.id)].isSelected =
          !newArray[newArray.findIndex((event) => event.id === e.id)]
            .isSelected;
        setCalendarDates(newArray);
        if (datesSelected.length > 0) {
          const x = moment(newArraySelected[newArraySelected.length - 1].start);
          const y = moment(e.start);
          const diffDuration = moment.duration(y.diff(x)).as("minutes");
          if (e.selected) {
            newArray[
              newArray.findIndex((event) => event.id === e.id)
            ].isSelected =
              !newArray[newArray.findIndex((event) => event.id === e.id)]
                .isSelected;
            toast.error("Esta sesión ya está escogida por otro usuario");
          } else {
            if (diffDuration > e.duration || -diffDuration > e.duration) {
              newArray[
                newArray.findIndex((event) => event.id === e.id)
              ].isSelected =
                !newArray[newArray.findIndex((event) => event.id === e.id)]
                  .isSelected;
              //openAlert('Sólo puedes seleccionar sesiones consecutivas', 'error')
              toast.error("Solo puedes seleccionar sesiones consecutivas");
            } else {
              if (
                newArraySelected[0] &&
                newArraySelected[0].bookings_item_id !== e.bookings_item_id
              ) {
                newArray[
                  newArray.findIndex((event) => event.id === e.id)
                ].isSelected =
                  !newArray[newArray.findIndex((event) => event.id === e.id)]
                    .isSelected;
                openAlert(
                  "No se pueden seleccionar sesiones de 2 pistas diferentes",
                  "error",
                );
              } else {
                if (
                  newArraySelected[
                    newArraySelected.findIndex((event) => event.id === e.id)
                  ]
                ) {
                  newArraySelected.splice(
                    newArraySelected.indexOf(
                      newArraySelected.findIndex((event) => event.id === e.id),
                    ),
                    1,
                  );
                  setDatesSelected(newArraySelected);
                  const sessionsSelected = await getOneRow(
                    "id",
                    e.id,
                    "bookings_sessions",
                  );
                  sessionsSelected.selected = false;
                  sessionsSelected.updated_by = user?.id;
                  await updateRow(sessionsSelected, "bookings_sessions");
                } else {
                  newArraySelected.push(
                    newArray[newArray.findIndex((event) => event.id === e.id)],
                  );
                  setDatesSelected(newArraySelected);
                  const sessionsSelected = await getOneRow(
                    "id",
                    e.id,
                    "bookings_sessions",
                  );
                  sessionsSelected.selected = true;
                  sessionsSelected.updated_by = user?.id;
                  await updateRow(sessionsSelected, "bookings_sessions");
                }
              }
            }
          }
        } else {
          if (!e.selected) {
            newArraySelected.push(
              newArray[newArray.findIndex((event) => event.id === e.id)],
            );
            setDatesSelected(newArraySelected);
            const sessionsSelected = await getOneRow(
              "id",
              e.id,
              "bookings_sessions",
            );
            sessionsSelected.selected = true;
            sessionsSelected.updated_by = user?.id;
            await updateRow(sessionsSelected, "bookings_sessions");
          } else {
            newArray[
              newArray.findIndex((event) => event.id === e.id)
            ].isSelected =
              !newArray[newArray.findIndex((event) => event.id === e.id)]
                .isSelected;
            setDatesSelected(newArraySelected);
            toast.error("Esta sesión ya está escogida por otro usuario");
          }
        }
      } else if (e.bookings_id === null && e.state !== null) {
        const newArray = [...calendarDates];
        const newArraySelected = [...datesSelected];
        newArray[newArray.findIndex((event) => event.id === e.id)].isSelected =
          !newArray[newArray.findIndex((event) => event.id === e.id)]
            .isSelected;
        setCalendarDates(newArray);
        if (datesSelected.length > 0) {
          const x = moment(newArraySelected[newArraySelected.length - 1].start);
          const y = moment(e.start);
          const diffDuration = moment.duration(y.diff(x)).as("minutes");
          if (e.selected) {
            newArray[
              newArray.findIndex((event) => event.id === e.id)
            ].isSelected =
              !newArray[newArray.findIndex((event) => event.id === e.id)]
                .isSelected;
            toast.error("Esta sesión ya está escogida por otro usuario");
          } else {
            if (diffDuration > 30) {
              newArray[
                newArray.findIndex((event) => event.id === e.id)
              ].isSelected =
                !newArray[newArray.findIndex((event) => event.id === e.id)]
                  .isSelected;
              //openAlert('Sólo puedes seleccionar sesiones consecutivas', 'error')
              toast.error("Solo puedes seleccionar sesiones consecutivas");
            } else {
              if (
                newArraySelected[0] &&
                newArraySelected[0].bookings_item_id !== e.bookings_item_id
              ) {
                newArray[
                  newArray.findIndex((event) => event.id === e.id)
                ].isSelected =
                  !newArray[newArray.findIndex((event) => event.id === e.id)]
                    .isSelected;
                openAlert(
                  "No se pueden seleccionar sesiones de 2 pistas diferentes",
                  "error",
                );
              } else if (
                newArraySelected[0] &&
                newArraySelected[0].state.id !== e.state.id
              ) {
                newArray[
                  newArray.findIndex((event) => event.id === e.id)
                ].isSelected =
                  !newArray[newArray.findIndex((event) => event.id === e.id)]
                    .isSelected;
                openAlert(
                  "No se pueden seleccionar sesiones con 2 estados diferentes",
                  "error",
                );
              } else {
                if (
                  newArraySelected[
                    newArraySelected.findIndex((event) => event.id === e.id)
                  ]
                ) {
                  newArraySelected.splice(
                    newArraySelected.indexOf(
                      newArraySelected.findIndex((event) => event.id === e.id),
                    ),
                    1,
                  );
                  setDatesSelected(newArraySelected);
                  const sessionsSelected = await getOneRow(
                    "id",
                    e.id,
                    "bookings_sessions",
                  );
                  sessionsSelected.selected = false;
                  sessionsSelected.updated_by = user?.id;
                  await updateRow(sessionsSelected, "bookings_sessions");
                } else {
                  newArraySelected.push(
                    newArray[newArray.findIndex((event) => event.id === e.id)],
                  );
                  setDatesSelected(newArraySelected);
                  const sessionsSelected = await getOneRow(
                    "id",
                    e.id,
                    "bookings_sessions",
                  );
                  sessionsSelected.selected = true;
                  sessionsSelected.updated_by = user?.id;
                  await updateRow(sessionsSelected, "bookings_sessions");
                }
              }
            }
          }
        } else {
          if (!e.selected) {
            newArraySelected.push(
              newArray[newArray.findIndex((event) => event.id === e.id)],
            );
            setDatesSelected(newArraySelected);
            const sessionsSelected = await getOneRow(
              "id",
              e.id,
              "bookings_sessions",
            );
            sessionsSelected.selected = true;
            sessionsSelected.updated_by = user?.id;
            await updateRow(sessionsSelected, "bookings_sessions");
          } else {
            newArray[
              newArray.findIndex((event) => event.id === e.id)
            ].isSelected =
              !newArray[newArray.findIndex((event) => event.id === e.id)]
                .isSelected;
            setDatesSelected(newArraySelected);
            toast.error("Esta sesión ya está escogida por otro usuario");
          }
        }
        /* if (newArraySelected[0]) {
          const bookingIdSelected = newArraySelected[0].bookings_item_id;
          setItemSelected(
            item[item.findIndex((e) => e.id === bookingIdSelected)],
          );
        } */
      } else {
        const { data } = await supabase
          .from(tableBookings)
          .select(
            `*,users!bookings_user_id_fkey(name, surname),bookings_items(id,title) `,
            { count: "exact" },
          )
          .eq("id", e.bookings_id);
        if (data) {
          data[0].name = data[0].users.name;
          data[0].surname = data[0].users.surname;
          data[0].title = data[0].bookings_items.title;
          setSelectedBooking(data[0]);
          setIsOpenBooking(true);
        }
      }
    } else {
      const { data } = await supabase
        .from(tableBookings)
        .select(
          `*,users!bookings_user_id_fkey(name, surname),bookings_items(id,title) `,
          { count: "exact" },
        )
        .eq("id", e.id);
      if (data) {
        data[0].name = data[0].users.name;
        data[0].surname = data[0].users.surname;
        data[0].title = data[0].bookings_items.title;
        setSelectedBooking(data[0]);
        setIsOpenBooking(true);
      }
    }
  };

  const handleUnselectEvents = async () => {
    const newArray = [...calendarDates];
    newArray.forEach((event) => {
      event.isSelected = false;
    });
    const defaultDatesSelected = [...datesSelected];
    for await (const date of defaultDatesSelected) {
      const session = await getOneRow("id", date.id, "bookings_sessions");
      session.selected = false;
      session.updated_by = user?.id;
      await updateRow(session, "bookings_sessions");
    }
    setCalendarDates(newArray);
    setDatesSelected([]);
  };

  const openModal = async () => {
    const arrayDates = [...datesSelected];
    const datesBd: any[] = [];
    for await (const date of arrayDates) {
      const dateBd = await getOneRow("id", date.id, tableBookingsSessions);
      datesBd.push(dateBd);
    }
    setArraySessionsEdit(datesBd);
    setIsOpen(true);
  };

  const openModalEdit = async (action: string) => {
    if (action === "edit") {
      const arrayDates = [...datesSelected];
      const datesBd: any[] = [];
      for await (const date of arrayDates) {
        const dateBd = await getOneRow("id", date.id, tableBookingsSessions);
        datesBd.push(dateBd);
      }
      setArraySessionsEdit(datesBd);
      setIsOpenEdit(true);
    } else {
      setArraySessionsEdit([]);
      setIsOpenEdit(true);
    }
  };

  const openModalDelete = async () => {
    const arrayDates = [...datesSelected];
    const datesBd: any[] = [];
    for await (const date of arrayDates) {
      const dateBd = await getOneRow("id", date.id, tableBookingsSessions);
      datesBd.push(dateBd);
    }
    setArraySessionsEdit(datesBd);
    setIsOpenDelete(true);
  };

  const openBookingDetailsModal = (booking: any, paymentMethhod: any) => {
    setBookingDetails(booking);
    setSelectedMethod(paymentMethhod);
    setIsOpenDetails(true);
  };

  const closeModal = async () => {
    setIsOpen(false);
  };

  const closeModalEdit = () => {
    setIsOpenEdit(false);
  };

  const closeModalBooking = () => {
    setIsOpenBooking(false);
  };

  const closeModalDelete = () => {
    setIsOpenDelete(false);
  };

  const closeModalDetails = async () => {
    setIsOpenDetails(false);
  };

  const handleChangeStates = (states: any) => {
    setSelectedStates(states);
  };

  const handleChangeCourts = (courts: any) => {
    setSelectedCourts(courts);
  };

  useEffect(() => {
    if (item.length > 0) {
      courtChanges(selectedCourts, selectedStates);
      const fetch = async () => {
        const newCourts: any[] = [];
        if (selectedCourts.length > 0) {
          for await (const court of selectedCourts) {
            const data = await getOneRow("id", court, tableBookingsItems);
            newCourts.push(data);
          }
          BookingsView.item = newCourts;
        } else {
          BookingsView.item = ["Vacía"];
        }
      };
      fetch();
    }
  }, [selectedCourts, selectedStates]);

  const courtChanges = async (courts: any, states: any) => {
    setLoading(true);
    const defaultStates: any[] = states;
    const formatStates: any[] = [];
    if (courts.length > 0) {
      const newDates: any[] = [];
      const arrayData: any[] = [];
      if (states.length === 0) {
        for await (const i of courts) {
          const { data } = await supabase
            .from(tableBookingsSessions)
            .select(
              "*, bookings_states(id, title, color, bookeable), item:bookings_items(title)",
            )
            .eq("bookings_item_id", i)
            .is("bookings_id", null);
          data?.forEach((d) => {
            arrayData.push(d);
          });
        }

        for await (const i of courts) {
          const { data } = await supabase
            .from(tableBookingsSessions)
            .select(
              "*, bookings_states(id, title, color, bookeable), item:bookings_items(title)",
            )
            .eq("bookings_item_id", i)
            .not("bookings_id", "is", null);
          data?.forEach((d) => {
            arrayData.push(d);
          });
        }

        if (arrayData.length > 0) {
          const sessions: any[] = formatSessions(arrayData);
          for await (const date of sessions) {
            const object = {
              start: moment(date.date).toDate(),
              end: moment(date.date).toDate(),
              title: date.item.title,
              id: date.id,
              isSelected: false,
              bookings_id: date.bookings_id,
              state: date.bookings_states,
              bookings_item_id: date.bookings_item_id,
              duration: date.duration,
              selected: date.selected,
            };
            newDates.push(object);
          }
          setCalendarDates(newDates);
          setItemSelected(item[0]);
          setLoading(false);
        } else {
          setCalendarDates([]);
          setLoading(false);
        }
      } else if (states.length === 1 && states.includes("booked")) {
        for await (const i of courts) {
          const { data } = await supabase
            .from(tableBookingsSessions)
            .select(
              "*, bookings_states(id, title, color, bookeable), item:bookings_items(title)",
            )
            .eq("bookings_item_id", i)
            .not("bookings_id", "is", null);
          data?.forEach((d) => {
            arrayData.push(d);
          });
        }
        if (arrayData.length > 0) {
          const sessions: any[] = formatSessions(arrayData);
          for await (const date of sessions) {
            const object = {
              start: moment(date.date).toDate(),
              end: moment(date.date).toDate(),
              title: date.item.title,
              id: date.id,
              isSelected: false,
              bookings_id: date.bookings_id,
              state: date.bookings_states,
              bookings_item_id: date.bookings_item_id,
              duration: date.duration,
              selected: date.selected,
            };
            newDates.push(object);
          }
          setCalendarDates(newDates);
          setItemSelected(item[0]);
          setLoading(false);
        } else {
          setCalendarDates([]);
          setLoading(false);
        }
      } else {
        if (defaultStates.includes("booked")) {
          defaultStates.forEach((state) => {
            if (state !== "booked") {
              formatStates.push(state);
            }
          });
          for await (const state of formatStates) {
            if (state !== undefined) {
              for await (const i of courts) {
                const { data } = await supabase
                  .from(tableBookingsSessions)
                  .select(
                    "*, bookings_states(id, title, color, bookeable), item:bookings_items(title)",
                  )
                  .eq("bookings_item_id", i)
                  .eq("bookings_state_id", state)
                  .is("bookings_id", null);
                data?.forEach((d) => {
                  arrayData.push(d);
                });
              }
            }
          }
          for await (const i of courts) {
            const { data } = await supabase
              .from(tableBookingsSessions)
              .select(
                "*, bookings_states(id, title, color, bookeable), item:bookings_items(title)",
              )
              .eq("bookings_item_id", i)
              .not("bookings_id", "is", null);
            data?.forEach((d) => {
              arrayData.push(d);
            });
          }
          if (arrayData.length > 0) {
            const sessions: any[] = formatSessions(arrayData);
            for await (const date of sessions) {
              const object = {
                start: moment(date.date).toDate(),
                end: moment(date.date).toDate(),
                title: date.item.title,
                id: date.id,
                isSelected: false,
                bookings_id: date.bookings_id,
                state: date.bookings_states,
                bookings_item_id: date.bookings_item_id,
                duration: date.duration,
                selected: date.selected,
              };
              newDates.push(object);
            }
            setCalendarDates(newDates);
            setItemSelected(item[0]);
            setLoading(false);
          } else {
            setCalendarDates([]);
            setLoading(false);
          }
        } else {
          for await (const state of selectedStates) {
            for await (const i of courts) {
              const { data } = await supabase
                .from(tableBookingsSessions)
                .select(
                  "*, bookings_states(id, atitle, color, bookeable), item:bookings_items(title)",
                )
                .eq("bookings_item_id", i)
                .eq("bookings_state_id", state)
                .is("bookings_id", null);
              data?.forEach((d) => {
                arrayData.push(d);
              });
            }
          }

          if (arrayData.length > 0) {
            const sessions: any[] = formatSessions(arrayData);
            for await (const date of sessions) {
              const object = {
                start: moment(date.date).toDate(),
                end: moment(date.date).toDate(),
                title: date.item.title,
                id: date.id,
                isSelected: false,
                bookings_id: date.bookings_id,
                state: date.bookings_states,
                bookings_item_id: date.bookings_item_id,
                duration: date.duration,
                selected: date.selected,
              };
              newDates.push(object);
            }
            setCalendarDates(newDates);
            setItemSelected(item[0]);
            setLoading(false);
          } else {
            setCalendarDates([]);
            setLoading(false);
          }
        }
      }
      setLoading(false);
    } else {
      setCalendarDates([]);
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        {item[0] && item !== null ? (
          <>
            {item.length > 1 ? (
              <>
                <div>
                  <Label>{t("FILTER_BY")}:</Label>
                </div>
                <div className="flex gap-4 mb-4">
                  <div className="">
                    <SelectCourtFilter
                      items={item}
                      onCourtChange={(courts) => handleChangeCourts(courts)}
                    />
                  </div>
                  <div className="">
                    <SelectCourtState
                      items={states}
                      onCourtChange={(states) => handleChangeStates(states)}
                    />
                  </div>
                </div>
              </>
            ) : null}
            <div className="flex flex-wrap justify-between mb-1">
              <div className="flex gap-8 mb-2">
                {datesSelected.length > 0 ? (
                  <>
                    <div className="flex">
                      <LuSettings className="mt-1.5 mr-2 text-orange-500" />
                      <a
                        className="text-orange-500 font-bold cursor-pointer"
                        onClick={() => openModalEdit("edit")}
                      >
                        {t("MODIFY_BTN")}
                      </a>
                    </div>
                    <div className="flex">
                      <LuTrash2 className="mt-1.5 mr-2 text-red-500 font-bold" />
                      <a
                        className="text-red-500 font-bold cursor-pointer"
                        onClick={openModalDelete}
                      >
                        {t("DELETE_BTN")}
                      </a>
                    </div>
                    <div className="flex">
                      <LuCalendarCheck className="mt-1.5 mr-2 text-pink-500 font-bold" />
                      <a
                        className="text-pink-500 font-bold cursor-pointer"
                        onClick={openModal}
                      >
                        {t("BOOK")}
                      </a>
                    </div>
                    <div className="flex">
                      <LuX className="mt-1.5 mr-2 font-bold" />
                      <a
                        className="cursor-pointer"
                        onClick={handleUnselectEvents}
                      >
                        {t("DESELECT")}
                      </a>
                    </div>
                  </>
                ) : null}
              </div>
              <div className="mb-2 flex">
                <div className="flex">
                  <LuPlus className="mt-1.5 mr-1 text-blue-700 font-bold" />
                  <a
                    className="text-blue-700 cursor-pointer"
                    onClick={() => openModalEdit("add")}
                  >
                    {t("ADD_BTN")}
                  </a>
                </div>
              </div>
            </div>
          </>
        ) : null}
        {!loading ? (
          <Calendar
            localizer={localizer}
            events={calendarDates}
            startAccessor="start"
            endAccessor="end"
            defaultView={defaultView}
            onSelectEvent={(e) => handleSelectEvent(e)}
            eventPropGetter={eventPropGetter}
            style={{ height: calendarHeight }}
            views={views}
            messages={messages}
          />
        ) : (
          <div className="flex justify-center">
            <Spinner />
          </div>
        )}
      </div>

      {isOpen ? (
        <BookingSessionModal
          openModal={isOpen}
          defaultSessions={arraySessionsEdit}
          closeModal={closeModal}
          onSessions={(booking, paymentMethod) =>
            openBookingDetailsModal(booking, paymentMethod)
          }
          item={itemSelected}
        />
      ) : null}
      {isOpenEdit ? (
        <ItemSessionModal
          openModal={isOpenEdit}
          defaultSessions={arraySessionsEdit}
          closeModal={closeModalEdit}
          items={item}
          itemSelected={itemSelected}
          onSessions={() => {
            courtChanges(selectedCourts, selectedStates), setDatesSelected([]);
          }}
          states={states}
        />
      ) : (
        <></>
      )}
      {isOpenBooking ? (
        <BookingDetailsModal
          closeModal={closeModalBooking}
          openModal={isOpenBooking}
          booking={selectedBooking}
        />
      ) : (
        <></>
      )}
      {isOpenDelete ? (
        <DeleteSessionModal
          closeModal={closeModalDelete}
          openModal={isOpenDelete}
          sessions={arraySessionsEdit}
        />
      ) : null}
      {isOpenDetails ? (
        <ConfirmBookingModal
          openModal={isOpenDetails}
          closeModal={closeModalDetails}
          onSessions={() => {
            courtChanges(selectedCourts, selectedStates), setDatesSelected([]);
          }}
          booking={bookingDetails}
          paymentMethod={selectedMethod}
          defaultSessions={arraySessionsEdit}
        />
      ) : null}
    </>
  );
}
