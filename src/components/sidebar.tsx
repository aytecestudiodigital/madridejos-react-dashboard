import classNames from "classnames";
import { Sidebar } from "flowbite-react";

import {
  HiOutlineHome,
  HiOutlineMail,
  HiOutlinePencilAlt,
  HiOutlineUsers,
} from "react-icons/hi";

import { useTranslation } from "react-i18next";
import {
  LuCheckCircle,
} from "react-icons/lu";
import { Link } from "react-router-dom";
import { useSidebarContext } from "../context/SidebarContext";
import isSmallScreen from "../helpers/is-small-screen";

export default function SidebarComponent() {
  const { t } = useTranslation();
  const user = JSON.parse(localStorage.getItem("userLogged")!);
  //const userGroupId = localStorage.getItem("groupSelected")!;
  //const [userGroup, setUserGroup] = useState<any>(null);
  //const [isOpenGroupsModal, setIsOpenGroupsModal] = useState(false);

  const { isOpenOnSmallScreens: isSidebarOpenOnSmallScreens } =
    useSidebarContext();

  /* useEffect(() => {
    const fetchData = async () => {
      if (userGroupId) {
        const groupDb = await getOneRow("id", userGroupId, "groups");
        if (groupDb) {
          setUserGroup(groupDb);
        }
      }
    };
    fetchData();
  }, [userGroupId]); */

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
                {user && user.users_roles.rules.content.access_module ? (
                  <Sidebar.Collapse
                    icon={HiOutlinePencilAlt}
                    label={t("CONTENT_TYPE")}
                    open={false}
                  >
                    {user &&
                    user.users_roles.rules.content.contents.access_module ? (
                      <Sidebar.Item as={Link} to="/content">
                        {t("ARTICLES")}
                      </Sidebar.Item>
                    ) : null}

                    {user &&
                    user.users_roles.rules.content.categories.access_module ? (
                      <Sidebar.Item as={Link} to="/content/categories">
                        {t("CATEGORIES_TITLE")}
                      </Sidebar.Item>
                    ) : null}
                  </Sidebar.Collapse>
                ) : null}

                {user && user.users_roles.rules.mod_users.access_module ? (
                  <Sidebar.Collapse
                    icon={HiOutlineUsers}
                    label={t("USERS")}
                    open={false}
                  >
                    {user &&
                    user.users_roles.rules.mod_users.users.access_module ? (
                      <Sidebar.Item as={Link} to="/users">
                        {t("MENU_USERS_LIST")}
                      </Sidebar.Item>
                    ) : null}

                    {user &&
                    user.users_roles.rules.mod_users.groups.access_module ? (
                      <Sidebar.Item as={Link} to="/users/groups">
                        {t("MENU_USERS_GROUPS")}
                      </Sidebar.Item>
                    ) : null}

                    {user &&
                    user.users_roles.rules.mod_users.roles.access_module ? (
                      <Sidebar.Item as={Link} to="/users/roles">
                        {t("MENU_USERS_ROLES")}
                      </Sidebar.Item>
                    ) : null}
                  </Sidebar.Collapse>
                ) : null}

                {/* {user && user.users_roles.rules.bookings.access_module ? (
                  <Sidebar.Collapse
                    icon={LuCalendarClock}
                    label={t("BOOKINGS")}
                    open={false}
                  >
                    {user &&
                    user.users_roles.rules.bookings.bookings.access_module ? (
                      <Sidebar.Item as={Link} to="/bookings">
                        {t("BOOKINGS_LIST")}
                      </Sidebar.Item>
                    ) : null}

                    {user &&
                    user.users_roles.rules.bookings.installations
                      .access_module ? (
                      <Sidebar.Item as={Link} to="/bookings/installations">
                        {t("INSTALLATIONS")}
                      </Sidebar.Item>
                    ) : null}
                  </Sidebar.Collapse>
                ) : null} */}

                {/* {user && user.users_roles.rules.inscriptions.access_module ? (
                  <Sidebar.Collapse
                    icon={LuClipboardSignature}
                    label={t("INSCRIPTIONS")}
                    open={false}
                  >
                    <Sidebar.Item as={Link} to="/inscriptions/normal">
                      {t("NORMAL_INSCRIPTION")}
                    </Sidebar.Item>
                  </Sidebar.Collapse>
                ) : null} */}

                {user && user.users_roles.rules.tasks.access_module ? (
                  <Sidebar.Collapse
                    icon={LuCheckCircle}
                    label="Incidencias y tareas"
                    open={false}
                  >
                    {user &&
                    user.users_roles.rules.tasks.tasks.access_module ? (
                      <Sidebar.Item as={Link} to={"/tasks"}>
                        Panel de incidencias
                      </Sidebar.Item>
                    ) : null}

                    {user &&
                    user.users_roles.rules.tasks.projects.access_module ? (
                      <Sidebar.Item as={Link} to={"/tasks/projects"}>
                        Proyectos
                      </Sidebar.Item>
                    ) : null}
                  </Sidebar.Collapse>
                ) : null}

                {/* {user && user.users_roles.rules.tickets.access_module ? (
                  <Sidebar.Collapse
                    icon={LuTicket}
                    label="Entradas y abonos"
                    open={false}
                  >
                    {user &&
                    user.users_roles.rules.tickets.tickets.access_module ? (
                      <Sidebar.Item as={Link} to={"/tickets"}>
                        Lista de entradas
                      </Sidebar.Item>
                    ) : null}

                    {user &&
                    user.users_roles.rules.tickets.events.access_module ? (
                      <Sidebar.Item as={Link} to={"/tickets/events"}>
                        Eventos
                      </Sidebar.Item>
                    ) : null}
                  </Sidebar.Collapse>
                ) : null} */}

                {/* {user && user.users_roles.rules.access_control.access_module ? (
                  <Sidebar.Item as={Link} to="/access-control" icon={LuUnlock}>
                    {t("ACCESS_CONTROL")}
                  </Sidebar.Item>
                ) : null} */}

                {/* {user && user.users_roles.rules.payments.access_module ? (
                  <Sidebar.Collapse
                    icon={HiOutlineCreditCard}
                    label={t("PAYMENTS")}
                    open={false}
                  >
                    {user &&
                    user.users_roles.rules.payments.payments.access_module ? (
                      <Sidebar.Item as={Link} to="/payments">
                        {t("PAYMENTS_LIST")}
                      </Sidebar.Item>
                    ) : null}

                    {user &&
                    user.users_roles.rules.payments.method_payments
                      .access_module ? (
                      <Sidebar.Item as={Link} to="/payments/methods">
                        {t("PAYMENTS_METHODS")}
                      </Sidebar.Item>
                    ) : null}

                    {user &&
                    user.users_roles.rules.payments.payments_accounts
                      .access_module ? (
                      <Sidebar.Item as={Link} to="/payments/accounts">
                        {t("PAYMENTS_ACCOUNTS")}
                      </Sidebar.Item>
                    ) : null}
                  </Sidebar.Collapse>
                ) : null} */}

                {user && user.users_roles.rules.communication.access_module ? (
                  <Sidebar.Collapse
                    icon={HiOutlineMail}
                    label={t("COMMUNICATIONS")}
                    open={false}
                  >
                    {user &&
                    user.users_roles.rules.communication.push.access_module ? (
                      <Sidebar.Item
                        as={Link}
                        to="/communications/notifications"
                      >
                        {t("NOTIFICATIONS")}
                      </Sidebar.Item>
                    ) : null}

                    {user &&
                    user.users_roles.rules.communication.warnings
                      .access_module ? (
                      <Sidebar.Item as={Link} to="/communications/alerts">
                        {t("ALERTS")}
                      </Sidebar.Item>
                    ) : null}

                    {user &&
                    user.users_roles.rules.communication.emails
                      .access_module ? (
                      <Sidebar.Item as={Link} to="/communications/emails">
                        {t("EMAILS")}
                      </Sidebar.Item>
                    ) : null}
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
