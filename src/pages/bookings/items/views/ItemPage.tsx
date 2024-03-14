/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card } from "flowbite-react";
import { FC, useContext, useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import {
  BreadcrumbItem,
  HeaderItemPageComponent,
} from "../../../../components/ListPage/HeaderItemPage";
import { AlertContext } from "../../../../context/AlertContext";
import { supabase } from "../../../../server/supabase";
import {
  deleteRow,
  getAll,
  getOneRow,
  getRowByColumn,
  insertRow,
  updateRow,
} from "../../../../server/supabaseQueries";
import { AccessControl } from "../../../accessControl/models/AccessControl";
import { Users } from "../../../users/models/Users";
import { ItemDetailsCard } from "../components/ItemsDetailsCard";
import { ItemContext } from "../context/ItemContext";
import { ItemModel } from "../models/ItemModel";
import { PaymentAccount } from "../models/PaymentAcc";
import { PaymentMethod } from "../models/PaymentMethod";

export const ItemPage: FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const installationTableName = import.meta.env
    .VITE_TABLE_BOOKINGS_INSTALLATIONS;
  const itemTableName = import.meta.env.VITE_TABLE_BOOKINGS_ITEMS;

  const paymentsMethodsTableName = import.meta.env.VITE_TABLE_PAYMENTS_METHOD;
  const itemPaymentMethods = import.meta.env
    .VITE_TABLE_BOOKINGS_ITEMS_PAYMENTS_METHOD;
  const paymentsAccountsTableName = import.meta.env.VITE_TABLE_PAYMENTS_ACC;
  const accessControlTableName = import.meta.env.VITE_TABLE_ACCESS_CONTROL;
  const responsiblesTableName = import.meta.env
    .VITE_TABLE_BOOKINGS_ITEMS_RESPONSIBLES;
  const legalTableName = import.meta.env.VITE_TABLE_BOOKINGS_ITEMS_LEGAL_TEXT;
  const usersTableName = import.meta.env.VITE_TABLE_USERS;
  const calendarTableName = import.meta.env.VITE_TABLE_BOOKINGS_CALENDAR;
  const itemDevicesTable = import.meta.env.VITE_TABLE_ITEMS_DEVICES;
  const installationStatesTableName = import.meta.env
    .VITE_TABLE_BOOKINGS_INSTALLATIONS_STATES;
  const itemSessionsTable = import.meta.env.VITE_TABLE_BOOKINGS_SESSIONS;
  const itemsMethodsTableName = import.meta.env
    .VITE_TABLE_BOOKINGS_ITEMS_PAYMENTS_METHOD;

  const { id } = useParams();
  const { itemId } = useParams();
  const [pageTitle, setPageTitle] = useState<string>("");
  const [breadcrumb, setBreadcrumb] = useState<BreadcrumbItem[]>([]);
  const [saving, setSaving] = useState<boolean>(false);

  const [buttonDeteleType, setButtonDeteleType] = useState<string>("");
  const [deleteOKLabel, setDeleteOKLabel] = useState<string>("");
  const [deleteKOLabel, setDeleteKOLabel] = useState<string>("");
  const [installationId, setInstallationId] = useState<string>("");
  const [item, setItem] = useState<any>(null);

  const [paymentMethods, setPaymentMethod] = useState<PaymentMethod[]>([]);
  const [paymentAccounts, setPaymentAccounts] = useState<PaymentAccount[]>([]);
  const [accessControl, setAccessControl] = useState<AccessControl[]>([]);
  const [labelResponsibleCard, setLabelResponsibleCard] = useState<string>("");
  const [sessions, setSessions] = useState<any>([]);
  const [installationStates, setInstallationStates] = useState<any[]>([]);
  const [itemCalendar, setItemCalendar] = useState<any[]>([]);
  const [newDevices, setNewDevices] = useState<any>([]);
  const [sessionsToUpdate, setSessionsToUpdate] = useState<any>([]);
  const [sessionsToDelete, setSessionsToDelete] = useState<any>([]);
  const [itemTechnicals, setItemTechnicals] = useState<any>([]);
  const { openAlert } = useContext(AlertContext);
  const contextMethods = useContext(ItemContext);
  const [paymentMethodsSelected, setPaymentMethodsSelected] = useState<any[]>(
    [],
  );

  const user = JSON.parse(localStorage.getItem("userLogged")!);
  const userGroupId = localStorage.getItem("groupSelected")!;

  useEffect(() => {
    if (user) {
      if (!user.users_roles.rules.bookings.installation_items.access_module) {
        openAlert("No tienes acceso a esta página", "error");
        navigate("/");
      }
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      const installation = await getOneRow("id", id!, installationTableName);
      let newBreadcrumb: BreadcrumbItem[] = [];
      setInstallationId(installation.id);

      const states = await getAll(installationStatesTableName);
      const calendar = await getAll(calendarTableName);
      const aSessions = await getAll(itemSessionsTable);
      const pMethods = await getAll(itemsMethodsTableName);

      const statesArray: any[] = [];
      const formatCalendar: any[] = [];
      const formatSessions: any[] = [];
      const formatMethods: any[] = [];
      states.data?.forEach((state) => {
        if (state.installation_id === installation.id) {
          statesArray.push(state);
        }
      });
      setInstallationStates(statesArray);

      if (itemId) {
        const item = await getOneRow("id", itemId!, itemTableName);
        setItem(item);
        getRowByColumn("item_id", item.id!, responsiblesTableName).then(
          async (responsibles: any[]) => {
            const usersResponsibles: Users[] = [];
            if (responsibles.length > 0) {
              // Utiliza Promise.all para esperar a que todas las promesas se completen
              await Promise.all(
                responsibles.map(async (responsible) => {
                  const user = await getOneRow(
                    "id",
                    responsible.user_id,
                    usersTableName,
                  );
                  user.responsible_id = responsible.id;
                  usersResponsibles.push(user);
                }),
              );
              setItemTechnicals(usersResponsibles);
            }
          },
        );
        calendar.data?.forEach((day) => {
          if (day.bookings_item_id === item.id) {
            formatCalendar.push(day);
          }
        });
        aSessions.data?.forEach((session) => {
          if (session.bookings_item_id === item.id) {
            formatSessions.push(session);
          }
        });
        pMethods.data?.forEach((method) => {
          if (method.booking_item_id === item.id) {
            formatMethods.push(method);
          }
        });
      }
      setItemCalendar(formatCalendar);
      setPaymentMethodsSelected(formatMethods);

      //Definir el breadcrumb, títulos y botones
      if (installation.type === "INSTALLATION") {
        newBreadcrumb = [
          {
            title: "BOOKINGS",
            path: "/bookings",
          },
          {
            title: "INSTALLATIONS",
            path: "/bookings/installations",
          },
          {
            title: itemId ? "EDIT_DEPENDENCY" : "NEW_DEPENDENCY",
          },
        ];
        setPageTitle(itemId ? "EDIT_DEPENDENCY" : "NEW_DEPENDENCY");
        setButtonDeteleType(t("DELETE_ITEM_DEPENDENCY"));
        setDeleteOKLabel(t("ITEM_DEPENDENCY_DELETE_OK"));
        setDeleteKOLabel(t("ITEM_DEPENDENCY_DELETE_KO"));
        setLabelResponsibleCard(t("DEPENDENCY_RESPOSIBLES"));
      } else {
        newBreadcrumb = [
          {
            title: "BOOKINGS",
            path: "/bookings",
          },
          {
            title: "INSTALLATIONS",
            path: "/bookings/installations",
          },
          {
            title: "NEW_SERVICE",
          },
        ];

        setPageTitle("NEW_SERVICE");
        setButtonDeteleType(t("DELETE_ITEM_SERVICE"));
        setDeleteOKLabel(t("ITEM_SERVICE_DELETE_OK"));
        setDeleteKOLabel(t("ITEM_SERVICE_DELETE_KO"));
        setLabelResponsibleCard(t("SERVICE_RESPOSIBLES"));
      }
      setBreadcrumb(newBreadcrumb);

      //Obtener todos los métodos de pago
      const devices: AccessControl[] = [];
      const allAccessControl = await getAll(accessControlTableName);
      if (allAccessControl.data) {
        for (const device of allAccessControl.data) {
          devices.push(device);
        }
        setAccessControl(devices);
      }

      //Obtener todas las cuentas de pago
      const paymentAcc: PaymentAccount[] = [];
      const allAcc = await getAll(paymentsAccountsTableName);
      if (allAcc.data) {
        for (const acc of allAcc.data) {
          paymentAcc.push(acc);
        }
        setPaymentAccounts(paymentAcc);
      }

      //Obtener todos los dispositivos
      const paymentMethods: PaymentMethod[] = [];
      const allMethods = await getAll(paymentsMethodsTableName);
      if (allMethods.data) {
        for (const method of allMethods.data) {
          paymentMethods.push(method);
        }
        setPaymentMethod(paymentMethods);
      }
    };

    fetchData();
  }, [id, installationTableName, itemId]);

  const methods = useForm<ItemModel>({
    values: item ?? undefined,
    mode: "onBlur",
    reValidateMode: "onBlur",
    criteriaMode: "all",
  });

  const { isValid } = methods.formState;

  const [dataToSend, setDataToSend] = useState<any>({});

  const onBack = () => {
    navigate(`/bookings/installations/${installationId}`);
  };

  const changeSessions = (sessions: any) => {
    const newArray: any[] = [];
    sessions.forEach((session: any) => {
      if (session.sessions && session.sessions.length > 0) {
        session.sessions.forEach((format: any) => {
          newArray.push(format);
        });
      }
    });
    setSessions(newArray);
  };

  const changeData = (data: any) => {
    if (data !== null) {
      const newData = data.data;
      const prevData = { ...dataToSend, ...newData };
      setDataToSend(prevData);
    }
  };

  const onSave: SubmitHandler<any> = async (close: boolean) => {
    setSaving(true);
    let result: any;
    const formValue: any = methods.getValues();
    formValue.group_id = userGroupId;
    formValue.courtesy_time = 5;
    if (!item) {
      delete dataToSend.legal.id;
      if (dataToSend.legal) {
        const legalCreated = await insertRow(dataToSend.legal, legalTableName);
        formValue.legal_text_id = legalCreated.id;
      } else {
        formValue.legal_text_id = null;
      }
      const technicals = dataToSend.technicians;
      const paymentMethods = dataToSend.payments_methods;
      formValue.installation_id = installationId;
      formValue.calendar_days = formValue.calendar_weeks! * 7;
      result = await insertRow(formValue, itemTableName);
      if (technicals.length > 0) {
        technicals.forEach(async (technical: any) => {
          const object = {
            item_id: result.id,
            user_id: technical.id,
          };
          await insertRow(object, responsiblesTableName);
        });
      }
      if (paymentMethods.length > 0) {
        paymentMethods.forEach(async (method: any) => {
          const object = {
            booking_item_id: result.id,
            payments_method_id: method.id,
            enviroment: "DASHBOARD",
          };
          await insertRow(object, itemPaymentMethods);
        });
      }
      if (sessions.length > 0) {
        sessions.forEach(async (session: any) => {
          session.bookings_item_id = result.id;
          await insertRow(session, calendarTableName);
        });
      }
      if (newDevices.length > 0) {
        newDevices.forEach(async (device: any) => {
          const object = {
            bookings_item_id: result.id,
            access_control_id: device.value,
            enabled: true,
          };
          await insertRow(object, itemDevicesTable);
        });
      }
    } else {
      const technicals = dataToSend.technicians;
      const paymentMethods = contextMethods.getPaymentMethods();
      if (dataToSend.legal) {
        await updateRow(dataToSend.legal, legalTableName);
      }
      result = await updateRow(formValue, itemTableName);
      if (itemTechnicals.length > 0) {
        itemTechnicals.forEach(async (technical: any) => {
          if (
            technicals[
              technicals.findIndex((e: any) => e.id === technical.id)
            ] === undefined
          ) {
            await supabase
              .from(responsiblesTableName)
              .delete()
              .eq("user_id", technical.id)
              .eq("item_id", item.id);
          }
        });
      }
      if (technicals.length > 0) {
        technicals.forEach(async (technical: any) => {
          if (
            itemTechnicals[
              itemTechnicals.findIndex((e: any) => e.id === technical.id)
            ] === undefined
          ) {
            const object = {
              item_id: item.id,
              user_id: technical.id,
            };
            await insertRow(object, responsiblesTableName);
          }
        });
      }
      if (sessions.length > 0) {
        sessions.forEach(async (session: any) => {
          if (!session.id) {
            session.bookings_item_id = item.id;
            await insertRow(session, calendarTableName);
          }
        });
      }
      if (sessionsToUpdate.length > 0) {
        sessionsToUpdate.forEach(async (session: any) => {
          await updateRow(session, calendarTableName);
        });
      }
      if (sessionsToDelete.length > 0) {
        sessionsToDelete.forEach(async (session: any) => {
          if (session.id) {
            await deleteRow(session.id, calendarTableName);
          }
        });
      }
      if (paymentMethodsSelected.length > 0) {
        paymentMethodsSelected.forEach(async (method) => {
          if (
            paymentMethods[
              paymentMethods.findIndex(
                (e: any) => e.id === method.payments_method_id,
              )
            ] === undefined
          ) {
            await supabase
              .from(itemPaymentMethods)
              .delete()
              .eq("booking_item_id", item.id)
              .eq("payments_method_id", method.payments_method_id);
          }
        });
      }
      if (paymentMethods.length > 0) {
        paymentMethods.forEach(async (method: any) => {
          if (
            paymentMethodsSelected[
              paymentMethodsSelected.findIndex(
                (e) => e.payments_method_id === method.id,
              )
            ] === undefined
          ) {
            const object = {
              booking_item_id: item.id,
              payments_method_id: method.id,
              enviroment: "DASHBOARD",
            };
            await insertRow(object, itemPaymentMethods);
          }
        });
      }
      if (newDevices.length > 0) {
        newDevices.forEach(async (device: any) => {
          if (device.id === null) {
            const object = {
              bookings_item_id: item.id,
              access_control_id: device.value,
              enabled: true,
            };
            await insertRow(object, itemDevicesTable);
          }
        });
      }
    }
    setSaving(false);
    if (result) {
      setItem(result);
      openAlert(t("INSTALLATION_SAVED_OK"), "insert");
    } else {
      openAlert(t("INSTALLATION_SAVED_KO"), "error");
    }
    close && onBack();
  };

  return (
    <>
      <div className="block items-center justify-between border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 sm:flex">
        <div className="mb-1 w-full">
          {item ? (
            <HeaderItemPageComponent
              title={pageTitle}
              breadcrumb={breadcrumb}
              saving={saving}
              showBackButton={true}
              showButtonSave={true}
              showButtonSaveAndClose={true}
              saveButtonDisabled={
                !isValid ||
                (!user.users_roles.rules.bookings.installation_items
                  .update_all &&
                  !user.users_roles.rules.bookings.installation_items
                    .update_group &&
                  !user.users_roles.rules.bookings.installation_items
                    .update_own) ||
                (!user.users_roles.rules.bookings.installation_items
                  .update_all &&
                  user.users_roles.rules.bookings.installation_items
                    .update_group &&
                  userGroupId !== item.group_id) ||
                (!user.users_roles.rules.bookings.installation_items
                  .update_all &&
                  !user.users_roles.rules.bookings.installation_items
                    .update_group &&
                  user.users_roles.rules.bookings.installation_items
                    .update_own &&
                  user.id !== item.created_by)
              }
              onBack={onBack}
              onSave={onSave}
            />
          ) : (
            <HeaderItemPageComponent
              title={pageTitle}
              breadcrumb={breadcrumb}
              saving={saving}
              showBackButton={true}
              showButtonSave={true}
              showButtonSaveAndClose={true}
              saveButtonDisabled={
                !isValid ||
                !user.users_roles.rules.bookings.installation_items.create
              }
              onBack={onBack}
              onSave={onSave}
            />
          )}
        </div>
      </div>
      <div className="p-4">
        <Card className=" dark:bg-gray-900">
          <FormProvider {...methods}>
            <ItemDetailsCard
              deleteButtonLabel={buttonDeteleType}
              deleteOKLabel={deleteOKLabel}
              deleteKOLabel={deleteKOLabel}
              paymentsMethods={paymentMethods}
              paymentsAcc={paymentAccounts}
              accessControl={accessControl}
              labelResponsibleCard={labelResponsibleCard}
              installationStates={installationStates}
              onSessions={(sessions) => changeSessions(sessions)}
              item={item ? item : null}
              itemCalendar={itemCalendar}
              onDataChange={(data) => changeData(data)}
              onDevicesChange={(devices) => setNewDevices(devices)}
              onSessionsUpdate={(sessions) => setSessionsToUpdate(sessions)}
              onSessionsDelete={(sessions) => setSessionsToDelete(sessions)}
            />
          </FormProvider>
        </Card>
      </div>
    </>
  );
};
