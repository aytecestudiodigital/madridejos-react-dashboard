/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AlertContext } from "../../../../context/AlertContext";
import { HeaderItemPageComponent } from "../../../../components/ListPage/HeaderItemPage";
import { FormProvider, useForm } from "react-hook-form";
import { Card, Table, Tabs } from "flowbite-react";
import { customThemeTab } from "../../../bookings/items/components/CustomThemeScrollableTabs";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";
import { TabEventDetails } from "../components/TabEventDetails";
import { TabEventDates } from "../components/TabEventDates";
import { TabEventAdvanced } from "../components/TabEventAdvanced";
import { TabEventPayments } from "../components/TabEventPayments";
import { TabEventAccessControl } from "../components/TabEventAccessControl";
import { TabEventLocation } from "../components/TabEventLocation";
import {
  deleteRow,
  getOneRow,
  getRowByColumn,
  insertRow,
  updateRow,
} from "../../../../server/supabaseQueries";
import { EventContext } from "../context/EventContext";
import { supabase } from "../../../../server/supabase";
import { ModalEventProducts } from "../components/ModalEventProducts";
import { t } from "i18next";
import { LuPlus } from "react-icons/lu";
import React from "react";

export const EditEventPage = () => {
  const breadcrumb = [
    {
      title: "EVENTS_LIST",
      path: "/tasks/projects",
    },
    {
      title: "EVENT_DETAILS",
    },
  ];

  const [pageTitle, setPageTitle] = useState<string>("EDIT_EVENT");
  const { id } = useParams();
  const { openAlert } = useContext(AlertContext);
  const [isScrollbarVisible, setIsScrollbarVisible] = useState(false);
  const [event, setEvent] = useState<any>(null);
  const contextMethods = useContext(EventContext);
  const userGroupId = localStorage.getItem("groupSelected");
  const [defaultNormalPaymentMethods, setDefaultNormalPaymentMethods] =
    useState<any[]>([]);
  const [
    defaultTechniciansPaymentMethods,
    setDefaultTechniciansPaymentMethods,
  ] = useState<any[]>([]);
  const [isOpenProductsModal, setIsOpenProductsModal] = useState(false);
  const [ticketProducts, setTicketProducts] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [selectedTicketIndex, setSelectedTicketIndex] = useState("");
  const [ticketProductsToUpdate, setTicketProductsToUpdate] = useState<any[]>(
    [],
  );
  const [ticketProductsToDelete, setTicketProductsToDelete] = useState<any[]>(
    [],
  );

  const [tabIndex, setTabIndex] = useState<number>(0);
  //const [tabsComponent, setTabsComponents] = useState<any[]>();

  const methods = useForm<any>({
    values: event ?? undefined,
    mode: "onChange",
    reValidateMode: "onBlur",
    criteriaMode: "all",
  });

  const { isValid } = methods.formState;

  useEffect(() => {
    setFormData(event);
  }, [event]);

  const tabsData = [
    { title: "Detalles" },
    { title: "Fechas del evento" },
    { title: "Avanzado" },
    { title: "Pagos" },
    { title: "Control de acceso" },
    { title: "Localización" },
  ];

  const contents = [
    <TabEventDetails item={event} />,
    <TabEventDates item={event} />,
    <TabEventAdvanced item={event} />,
    <TabEventPayments item={event} />,
    <TabEventAccessControl item={event} />,
    <TabEventLocation item={event} />,
  ];

  useEffect(() => {
    if (id) {
      refreshData(id);
    } else {
      setPageTitle("ADD_EVENT");
    }
  }, [id]);

  const onSave = async (close: boolean) => {
    const formValues = methods.getValues();
    const normalPaymentMethods = contextMethods.getNormalPaymentMethods();
    const techniciansPaymentMethods =
      contextMethods.getTechniciansPaymentMethods();

    const eventData: any = {
      org_id: "30f3a4ed-0b43-4489-85a8-244ac94019f5",
      title: formValues.title,
      enabled: formValues.enabled,
      description: formValues.description,
      order: formValues.order,
      image: formValues.image ? formValues.image : null,
      sell_date_init: formValues.sell_date_init
        ? formValues.sell_date_init
        : null,
      sell_date_end: formValues.sell_date_end ? formValues.sell_date_end : null,
      event_type: formValues.event_type,
      event_date_init: formValues.event_date_init
        ? formValues.event_date_init
        : null,
      event_date_end: formValues.event_date_end
        ? formValues.event_date_end
        : null,
      legal_title: formValues.legal_title,
      legal_required: formValues.legal_required,
      legal_content: formValues.legal_content ? formValues.legal_content : null,
      capacity: formValues.capacity,
      entry_control: formValues.entry_control,
      validation_date_init: formValues.validation_date_init
        ? formValues.validation_date_init
        : null,
      validation_date_end: formValues.validation_date_end
        ? formValues.validation_date_end
        : null,
      is_free: formValues.is_free,
      payments_account_id: formValues.payments_account_id,
      apply_coupons: formValues.apply_coupons,
      position: formValues.position,
      address: formValues.address ? formValues.address : null,
      shifts: false,
      access_control_device: formValues.access_control_device,
      payment_period_type: null,
      period_week_day: null,
      period_month_day: null,
      period_init_date: null,
      period_end_date: null,
      group_id: userGroupId,
    };

    if (!id) {
      const createdEvent = await insertRow(eventData, "tickets");
      if (createdEvent) {
        if (normalPaymentMethods.length > 0) {
          for await (const method of normalPaymentMethods) {
            const data = {
              ticket_id: createdEvent.id,
              payment_method: method,
              for_technician: false,
            };
            await insertRow(data, "tickets_payments_methods");
          }
        }
        if (techniciansPaymentMethods.length > 0) {
          for await (const method of techniciansPaymentMethods) {
            const data = {
              ticket_id: createdEvent.id,
              payment_method: method,
              for_technician: true,
            };
            await insertRow(data, "tickets_payments_methods");
          }
        }
        if (ticketProducts.length > 0) {
          for await (const ticket of ticketProducts) {
            ticket.ticket_id = createdEvent.id;
            await insertRow(ticket, "tickets_products");
          }
        }
        refreshData(createdEvent.id);
        openAlert("Evento creado con éxito", "insert");
      }
    } else {
      eventData.id = event.id;
      const eventUpdated = await updateRow(eventData, "tickets");
      if (eventUpdated) {
        if (defaultNormalPaymentMethods.length > 0) {
          for await (const method of defaultNormalPaymentMethods) {
            if (
              normalPaymentMethods[normalPaymentMethods.indexOf(method)] ===
              undefined
            ) {
              await supabase
                .from("tickets_payments_methods")
                .delete()
                .eq("ticket_id", event.id)
                .eq("payment_method", method);
            }
          }
        }
        if (normalPaymentMethods.length > 0) {
          for await (const method of normalPaymentMethods) {
            if (
              defaultNormalPaymentMethods[
                defaultNormalPaymentMethods.indexOf(method)
              ] === undefined
            ) {
              const data = {
                ticket_id: event.id,
                payment_method: method,
                for_technician: false,
              };
              await insertRow(data, "tickets_payments_methods");
            }
          }
        }
        if (defaultTechniciansPaymentMethods.length > 0) {
          for await (const method of defaultTechniciansPaymentMethods) {
            if (
              techniciansPaymentMethods[
                techniciansPaymentMethods.indexOf(method)
              ] === undefined
            ) {
              await supabase
                .from("tickets_payments_methods")
                .delete()
                .eq("ticket_id", event.id)
                .eq("payment_method", method);
            }
          }
        }
        if (techniciansPaymentMethods.length > 0) {
          for await (const method of techniciansPaymentMethods) {
            if (
              defaultTechniciansPaymentMethods[
                defaultTechniciansPaymentMethods.indexOf(method)
              ] === undefined
            ) {
              const data = {
                ticket_id: event.id,
                payment_method: method,
                for_technician: true,
              };
              await insertRow(data, "tickets_payments_methods");
            }
          }
        }
        if (ticketProducts.length > 0) {
          for await (const ticket of ticketProducts) {
            if (!ticket.id) {
              ticket.ticket_id = event.id;
              await insertRow(ticket, "tickets_products");
            }
          }
        }
        if (ticketProductsToUpdate.length > 0) {
          for await (const ticket of ticketProductsToUpdate) {
            await updateRow(ticket, "tickets_products");
          }
        }
        if (ticketProductsToDelete.length > 0) {
          for await (const ticket of ticketProductsToDelete) {
            if (ticket.id) {
              await deleteRow(ticket.id, "tickets_products");
            }
          }
        }
        openAlert("Evento actualizado con éxito", "update");
        refreshData(event.id);
      }
    }
    close && history.back();
  };

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

  const scrollRight = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault(); // Evitar la recarga de la página
    document.getElementById("Tabs-scroll")!.scrollBy(100, 0);
  };

  const openModal = (ticket: any, index: any) => {
    setSelectedTicketIndex(index);
    setSelectedTicket(ticket);
    setIsOpenProductsModal(true);
  };

  const onUpdateTicket = (index: any, ticket: any) => {
    const defaultTickets = [...ticketProducts];
    const toUpdate = [...ticketProductsToUpdate];
    if (ticket.id) {
      if (
        toUpdate[toUpdate.findIndex((e) => e.id === ticket.id)] !== undefined
      ) {
        toUpdate[toUpdate.findIndex((e) => e.id === ticket.id)] = ticket;
      } else {
        toUpdate.push(ticket);
      }
    }
    setTicketProductsToUpdate(toUpdate);
    defaultTickets[index] = ticket;
    setTicketProducts(defaultTickets);
  };

  const onCreateTicket = (ticket: any) => {
    const defaultTickets = [...ticketProducts];
    defaultTickets.push(ticket);
    setTicketProducts(defaultTickets);
  };

  const onDeleteTicket = (index: any, ticket: any) => {
    const defaultTickets = [...ticketProducts];
    const toDelete = [...ticketProductsToDelete];
    toDelete.push(ticket);
    defaultTickets.splice(index, 1);
    setTicketProducts(defaultTickets);
    setTicketProductsToDelete(toDelete);
  };

  const refreshData = async (id: string) => {
    const eventDb = await getOneRow("id", id, "tickets");
    if (eventDb) {
      setEvent(eventDb);
      const defaultTechMethodsDb: any[] = [];
      const defaultNormalMethodsDb: any[] = [];
      const defaultPaymentMethodsDb = await getRowByColumn(
        "ticket_id",
        eventDb.id,
        "tickets_payments_methods",
      );
      if (defaultPaymentMethodsDb) {
        defaultPaymentMethodsDb.forEach((method: any) => {
          if (method.for_technicians) {
            defaultTechMethodsDb.push(method.payment_method);
          } else {
            defaultNormalMethodsDb.push(method.payment_method);
          }
        });
        setDefaultNormalPaymentMethods(defaultNormalMethodsDb);
        setDefaultTechniciansPaymentMethods(defaultTechMethodsDb);
      }
      const productsDb = await getRowByColumn(
        "ticket_id",
        eventDb.id,
        "tickets_products",
      );
      if (productsDb) {
        setTicketProducts(productsDb);
      }
    }
  };

  const [formData, setFormData] = useState<any | null>(event ? event : null);

  const handleTabChange = (tab: number) => {
    // Guardar el estado del formulario al cambiar de tab (si estás en el primer tab)
    if (tab === 0) {
      setFormData(contents[0].props.item);
    }

    setTabIndex(tab);
  };

  const handleFormChange = (data: any) => {
    setFormData(data);
  };

  return (
    <>
      <div className="block items-center justify-between bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
        <div className="mb-1 w-full">
          <HeaderItemPageComponent
            title={pageTitle}
            breadcrumb={breadcrumb}
            saving={false}
            showBackButton={true}
            showButtonSave={true}
            showButtonSaveAndClose={true}
            saveButtonDisabled={!isValid}
            onBack={() => history.back()}
            onSave={onSave}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 p-4">
        <div className="w-full md:w-2/3">
          <Card>
            <div
              className={`${
                isScrollbarVisible ? "flex place-items-start" : ""
              }`}
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
                        <span style={{ whiteSpace: "nowrap" }}>
                          {tab.title}
                        </span>
                      }
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
                <FormProvider {...methods}>
                  <>
                    {React.cloneElement(content, {
                      item: formData,
                      onFormChange: handleFormChange,
                    })}
                  </>
                </FormProvider>
              </div>
            ))}
          </Card>
        </div>
        <div className="w-full md:w-1/3">
          <Card>
            <div className="flex flex-col md:flex-row justify-center md:justify-between">
              <div className="flex items-center">
                <p className="text-lg font-semibold">Productos</p>
              </div>
              <div className="mt-1 md:mt-0">
                <div className="flex">
                  <LuPlus className="mt-1.5 mr-1 text-blue-700 font-bold" />
                  <a
                    className="text-blue-700 cursor-pointer"
                    onClick={() => openModal(null, "")}
                  >
                    {t("ADD_BTN")}
                  </a>
                </div>
              </div>
            </div>
            <div>
              <Table>
                <Table.Head>
                  <Table.HeadCell>Título</Table.HeadCell>
                  <Table.HeadCell>Tipo</Table.HeadCell>
                </Table.Head>
                <Table.Body>
                  {ticketProducts.map((product, index) => (
                    <Table.Row
                      className="cursor-pointer font-bold hover:bg-gray-200"
                      onClick={() => openModal(product, index)}
                      key={index}
                    >
                      <Table.Cell className="max-w-md p-4 text-base font-medium text-gray-900 dark:text-white">
                        {product.title}
                      </Table.Cell>
                      <Table.Cell className="max-w-md p-4 text-base font-medium text-gray-900 dark:text-white">
                        {t(product.type)}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          </Card>
        </div>
      </div>
      {isOpenProductsModal ? (
        <ModalEventProducts
          openModal={isOpenProductsModal}
          closeModal={() => setIsOpenProductsModal(false)}
          item={selectedTicket}
          index={selectedTicketIndex}
          onCreateTicket={(ticket) => onCreateTicket(ticket)}
          onUpdateTicket={(ticket, index) => onUpdateTicket(index, ticket)}
          onDeleteTicket={(ticket, index) => onDeleteTicket(index, ticket)}
        />
      ) : null}
    </>
  );
};
