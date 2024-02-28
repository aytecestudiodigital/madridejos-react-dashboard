import classNames from "classnames";
import { Sidebar } from "flowbite-react";

import {
  HiOutlineCreditCard,
  HiOutlineHome,
  HiOutlinePencilAlt,
  HiOutlineUsers,
} from "react-icons/hi";

import { useTranslation } from "react-i18next";
import {
  LuCalendarClock,
  LuCheckCircle,
  LuClipboardSignature,
  LuTicket,
  LuUnlock,
} from "react-icons/lu";
import { useSidebarContext } from "../context/SidebarContext";
import isSmallScreen from "../helpers/is-small-screen";
import { Link } from "react-router-dom";

export default function SidebarComponent() {
  const { t } = useTranslation();
  const user = JSON.parse(localStorage.getItem("userLogged")!);

  const { isOpenOnSmallScreens: isSidebarOpenOnSmallScreens } =
    useSidebarContext();

  return (
    <div
      className={classNames("lg:!block", {
        hidden: !isSidebarOpenOnSmallScreens,
      })}
    >
      <Sidebar
        key={"sidebar_menu"}
        aria-label="Sidebar with multi-level dropdown example"
        collapsed={isSidebarOpenOnSmallScreens && !isSmallScreen()}
      >
        <div className="flex h-full flex-col justify-between py-2">
          <div>
            <Sidebar.Items key={"menu"}>
              <Sidebar.ItemGroup>
                {user && user.users_roles.rules.organization.access_module ? (
                  <Sidebar.Item as={Link} to="/" icon={HiOutlineHome}>
                    {t("HOME")}
                  </Sidebar.Item>
                ) : null}
                {user &&
                (user.users_roles.rules.content.contents.access_module ||
                  user.users_roles.rules.content.categories.access_module ||
                  user.users_roles.rules.content.entities.access_module) ? (
                  <Sidebar.Collapse
                    icon={HiOutlinePencilAlt}
                    label={t("CONTENT_TYPE")}
                    open={false}
                  >
                    <Sidebar.Item as={Link} to="/content">
                      {t("ARTICLES")}
                    </Sidebar.Item>
                    <Sidebar.Item as={Link} to="/content/categories">
                      {t("CATEGORIES_TITLE")}
                    </Sidebar.Item>
                    {/* <Sidebar.Item as={Link} to="/content/entities">
                        {t("ENTITIES")}
                      </Sidebar.Item>
                      <Sidebar.Item as={Link} to="/content/templates">
                        {t("MENU_CONTENT_TEMPLATES")}
                      </Sidebar.Item> */}
                  </Sidebar.Collapse>
                ) : null}

                {user &&
                (user.users_roles.rules.mod_users.users.access_module ||
                  user.users_roles.rules.mod_users.groups.access_module ||
                  user.users_roles.rules.mod_users.roles.access_module) ? (
                  <Sidebar.Collapse
                    icon={HiOutlineUsers}
                    label={t("USERS")}
                    open={false}
                  >
                    <Sidebar.Item as={Link} to="/users">
                      {t("MENU_USERS_LIST")}
                    </Sidebar.Item>
                    <Sidebar.Item as={Link} to="/users/groups">
                      {t("MENU_USERS_GROUPS")}
                    </Sidebar.Item>
                    <Sidebar.Item as={Link} to="/users/roles">
                      {t("MENU_USERS_ROLES")}
                    </Sidebar.Item>
                  </Sidebar.Collapse>
                ) : null}

                {user &&
                (user.users_roles.rules.bookings.bookings.access_module ||
                  user.users_roles.rules.bookings.installations
                    .access_module) ? (
                  <Sidebar.Collapse
                    icon={LuCalendarClock}
                    label={t("BOOKINGS")}
                    open={false}
                  >
                    <Sidebar.Item as={Link} to="/bookings">
                      {t("BOOKINGS_LIST")}
                    </Sidebar.Item>
                    <Sidebar.Item as={Link} to="/bookings/installations">
                      {t("INSTALLATIONS")}
                    </Sidebar.Item>
                  </Sidebar.Collapse>
                ) : null}

                {user &&
                user.users_roles.rules.inscriptions.inscriptions
                  .access_module ? (
                  <Sidebar.Collapse
                    icon={LuClipboardSignature}
                    label={t("INSCRIPTIONS")}
                    open={false}
                  >
                    <Sidebar.Item as={Link} to="/inscriptions/normal">
                      {t("NORMAL_INSCRIPTION")}
                    </Sidebar.Item>
                    {/* <Sidebar.Item as={Link} to="/inscriptions/normal">
                    {t("FORMATIVE_INSCRIPTION")}
                  </Sidebar.Item> */}
                  </Sidebar.Collapse>
                ) : null}

                {user &&
                (user.users_roles.rules.tasks.tasks.access_module ||
                  user.users_roles.rules.tasks.projects.access_module) ? (
                  <Sidebar.Collapse
                    icon={LuCheckCircle}
                    label="Incidencias y tareas"
                    open={false}
                  >
                    <Sidebar.Item as={Link} to={"/tasks"}>
                      Panel de incidencias
                    </Sidebar.Item>
                    <Sidebar.Item as={Link} to={"/tasks/projects"}>
                      Proyectos
                    </Sidebar.Item>
                  </Sidebar.Collapse>
                ) : null}

                {user &&
                (user.users_roles.rules.tickets.tickets.access_module ||
                  user.users_roles.rules.tickets.events.access_module) ? (
                  <Sidebar.Collapse
                    icon={LuTicket}
                    label="Entradas y abonos"
                    open={false}
                  >
                    <Sidebar.Item as={Link} to={"/tickets"}>
                      Lista de entradas
                    </Sidebar.Item>
                    <Sidebar.Item as={Link} to={"/tickets/events"}>
                      Eventos
                    </Sidebar.Item>
                  </Sidebar.Collapse>
                ) : null}

                {user &&
                user.users_roles.rules.access_control.devices.access_module ? (
                  <Sidebar.Item as={Link} to="/access-control" icon={LuUnlock}>
                    {t("ACCESS_CONTROL")}
                  </Sidebar.Item>
                ) : null}

                {user &&
                (user.users_roles.rules.payments.payments.access_module ||
                  user.users_roles.rules.payments.method_payments
                    .access_module ||
                  user.users_roles.rules.payments.payments_accounts
                    .access_module) ? (
                  <Sidebar.Collapse
                    icon={HiOutlineCreditCard}
                    label={t("PAYMENTS")}
                    open={false}
                  >
                    <Sidebar.Item as={Link} to="/payments">
                      {t("PAYMENTS_LIST")}
                    </Sidebar.Item>
                    <Sidebar.Item as={Link} to="/payments/methods">
                      {t("PAYMENTS_METHODS")}
                    </Sidebar.Item>
                    <Sidebar.Item as={Link} to="/payments/accounts">
                      {t("PAYMENTS_ACCOUNTS")}
                    </Sidebar.Item>
                  </Sidebar.Collapse>
                ) : null}
              </Sidebar.ItemGroup>
            </Sidebar.Items>
          </div>
        </div>
      </Sidebar>
    </div>
  );
}
