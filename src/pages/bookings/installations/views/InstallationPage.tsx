/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Tabs } from "flowbite-react";
import { FC, useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { HeaderItemPageComponent } from "../../../../components/ListPage/HeaderItemPage";
import { AlertContext } from "../../../../context/AlertContext";
import { getOneRow } from "../../../../server/supabaseQueries";
import { ItemModel } from "../../items/models/ItemModel";
import { InstallationBookingsCard } from "../components/InstallationBookingsCard";
import { InstallationDetailsCard } from "../components/InstallationDetailsCard";
import { InstallationItemsCard } from "../components/InstallationItemsCard";
import { InstallationStatesCard } from "../components/InstallationStatesCard";
import {
  getInstallationItems,
  getInstallationStates,
  updateOrCreateInstallation,
} from "../data/InstallationProvider";
import { InstallationModel } from "../models/InstallationModel";
import { InstallationStatesModel } from "../models/InstallationStatesModel";

export const InstallationPage: FC = () => {
  /**
   * Definición de datos
   */
  const { openAlert } = useContext(AlertContext);
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Configuración de la página
   */
  const breadcrumb = [
    {
      title: "BOOKINGS",
      path: "/bookings",
    },
    {
      title: "INSTALLATIONS",
      path: "/bookings/installations",
    },
    {
      title: "INSTALLATION_PAGE_CARD_DETAILS",
    },
  ];

  const { t } = useTranslation();

  const [pageTitle, setPageTitle] = useState<string>("EDIT_INSTALLATION");

  const orgId = import.meta.env.VITE_ORG_ID;
  const installationTable = import.meta.env.VITE_TABLE_BOOKINGS_INSTALLATIONS;

  const [saving, setSaving] = useState<boolean>(false);
  const [installation, setInstallation] = useState<InstallationModel | any>(
    location.state,
  );
  const [installationStates, setInstallationStates] = useState<
    InstallationStatesModel[]
  >([]);
  const [installationItems, setInstallationItems] = useState<ItemModel[] | []>(
    [],
  );
  const { id } = useParams();

  const user = JSON.parse(localStorage.getItem("userLogged")!);
  const userGroupId = localStorage.getItem("groupSelected")!;

  useEffect(() => {
    if (user) {
      if (!user.users_roles.rules.bookings.installations.access_module) {
        openAlert("No tienes acceso a esta página", "error");
        navigate("/");
      }
    }
  }, [user]);

  useEffect(() => {
    setPageTitle(installation || id ? "EDIT_INSTALLATION" : "NEW_INSTALLATION");

    if (id) {
      getOneRow("id", id, installationTable).then((data) => {
        setInstallation(data);
        form.reset(data); // Utiliza reset para cargar los datos en el formulario
      });
      getInstallationItems(id).then((items) =>
        setInstallationItems(items ?? []),
      );
      getInstallationStates(id).then((states) =>
        setInstallationStates(states ?? []),
      );
    } else if (installation) {
      getInstallationStates(installation.id!).then((states) =>
        setInstallationStates(states ?? []),
      );
    }
  }, [id]);

  const onBack = () => {
    navigate("/bookings/installations");
  };

  const form = useForm<InstallationModel>({
    values: installation ?? undefined,
    mode: "onBlur",
    reValidateMode: "onBlur",
    criteriaMode: "all",
  });

  const { formState, getValues } = form;
  const { isValid } = formState;

  const onSave = async (close: boolean) => {
    setSaving(true);
    if (isValid) {
      const data = getValues();
      const result = await updateOrCreateInstallation(
        { ...data, org_id: orgId, group_id: userGroupId },
        installationStates,
      );

      if (result) {
        setInstallation(result);
        openAlert(t("INSTALLATION_SAVED_OK"), "insert");
      } else {
        openAlert(t("INSTALLATION_SAVED_KO"), "error");
      }
    }
    setSaving(false);
    close && onBack();
  };
  return (
    <>
      <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
        <div className="mb-1 w-full">
          <HeaderItemPageComponent
            title={pageTitle}
            breadcrumb={breadcrumb}
            saving={saving}
            showBackButton={true}
            showButtonSave={true}
            showButtonSaveAndClose={true}
            saveButtonDisabled={
              installation
                ? !isValid ||
                  (!user.users_roles.rules.bookings.installations.update_all &&
                    !user.users_roles.rules.bookings.installations
                      .update_group &&
                    !user.users_roles.rules.bookings.installations
                      .update_own) ||
                  (!user.users_roles.rules.bookings.installations.update_all &&
                    user.users_roles.rules.bookings.installations
                      .update_group &&
                    userGroupId !== installation.group_id) ||
                  (!user.users_roles.rules.bookings.installations.update_all &&
                    !user.users_roles.rules.bookings.installations
                      .update_group &&
                    user.users_roles.rules.bookings.installations.update_own &&
                    user.id !== installation.created_by)
                : !isValid ||
                  !user.users_roles.rules.bookings.installations.create
            }
            onBack={onBack}
            onSave={onSave}
          />
        </div>
      </div>
      <form>
        <div className="p-4 dark:bg-gray-900 mb-5">
          <div className="xl:col-auto order-last xl:order-first">
            <div className="gap-y-4">
              <Card>
                {installation ? (
                  <>
                    <Tabs.Group>
                      <Tabs.Item title="Reservas">
                        <InstallationBookingsCard
                          items={
                            installationItems.length > 0
                              ? installationItems
                              : []
                          }
                          states={installationStates}
                        />
                      </Tabs.Item>
                      <Tabs.Item
                        title={
                          installation?.type === "INSTALLATION"
                            ? t(
                                "INSTALLATION_PAGE_ITEMS_DEPENDENCIES_CARD_TITLE",
                              )
                            : t("INSTALLATION_PAGE_ITEMS_SERVICES_CARD_TITLE")
                        }
                      >
                        <InstallationItemsCard
                          type={installation?.type ?? "INSTALLATION"}
                          installation={installation ? installation : null}
                          initialInstallationItems={
                            installationItems.length > 0
                              ? installationItems
                              : null
                          }
                        />
                      </Tabs.Item>
                      <Tabs.Item title="Detalles">
                        <InstallationDetailsCard
                          installation={installation!}
                          form={form}
                        />
                      </Tabs.Item>
                      <Tabs.Item title="Estados">
                        <InstallationStatesCard
                          states={installationStates}
                          setStates={setInstallationStates}
                          newInstallation={installation?.id ? true : false}
                        />
                      </Tabs.Item>
                    </Tabs.Group>
                  </>
                ) : (
                  <>
                    <Tabs.Group>
                      <Tabs.Item title="Detalles">
                        <InstallationDetailsCard
                          installation={installation!}
                          form={form}
                        />
                      </Tabs.Item>
                      <Tabs.Item title="Estados">
                        <InstallationStatesCard
                          states={installationStates}
                          setStates={setInstallationStates}
                          newInstallation={installation?.id ? true : false}
                        />
                      </Tabs.Item>
                    </Tabs.Group>
                  </>
                )}
              </Card>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};
