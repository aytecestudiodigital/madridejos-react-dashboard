/* eslint-disable @typescript-eslint/no-explicit-any */
import { Breadcrumb, Button, Card, TextInput } from "flowbite-react";
import { t } from "i18next";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { HiHome, HiOutlineArrowLeft } from "react-icons/hi";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AlertContext } from "../../../context/AlertContext";
import { getOneRow, updateRow } from "../../../server/supabaseQueries";
import { PermissionsTable } from "../components/componentsPermissions/permissionsTable";
import { DeleteRoleModal } from "../components/componentsRoles/deleteRoleModal";
import { panels } from "../models/RolePanels";
import { UserRol } from "../models/UserRol";

export default function PermissionsPage() {
  const navigate = useNavigate();
  const [panel, setPanel] = useState("organization");
  const [title, setTitle] = useState("");
  const [permission, setPermission] = useState<any>(UserRol);
  const [role, setRole] = useState<any>(null);
  const { id } = useParams();
  const { openAlert } = useContext(AlertContext);

  const { reset } = useForm<any>({
    values: role ?? undefined,
    mode: "onBlur",
    reValidateMode: "onBlur",
    criteriaMode: "all",
  });
  const tableName = import.meta.env.VITE_TABLE_USER_ROLES;

  const user = JSON.parse(localStorage.getItem("userLogged")!);
  const userGroupId = localStorage.getItem("groupSelected")!;

  useEffect(() => {
    if (user) {
      if (!user.users_roles.rules.mod_users.roles.access_module) {
        openAlert("No tienes acceso a esta página", "error");
        navigate("/");
      }
    }
  }, [user]);

  useEffect(() => {
    getOneRow("id", id!, tableName).then((role: any) => {
      setTitle(role.title);
      setRole(role);
    });
  }, [id]);

  const handleClick = (id: string) => {
    switch (id) {
      case "mod_users":
        setPanel("mod_users");
        break;
      case "users":
        setPanel("users");
        break;
      case "organization":
        setPanel("organization");
        break;
      case "content":
        setPanel("content");
        break;
      case "communication":
        setPanel("communication");
        break;
      case "tasks":
        setPanel("tasks");
        break;
      /* case "design":
        setPanel("design");
        break;
      case "bookings":
        setPanel("bookings");
        break;
      case "inscriptions":
        setPanel("inscriptions");
        break;
      case "tasks":
        setPanel("tasks");
        break;
      case "payments":
        setPanel("payments");
        break;
      case "tickets":
        setPanel("tickets");
        break;
      case "access_control":
        setPanel("access_control");
        break;
      case "competitions":
        setPanel("competitions");
        break; */
      default:
        break;
    }
  };

  const closeAfterDelete = () => {
    reset();
  };

  const handleSave = () => {
    const role = {
      title: title,
      rules: permission,
      id: id,
      group_id: userGroupId,
    };

    updateRow(role, tableName).then(() => {
      openAlert(t("EDIT_USER_ROLE_OK"), "update");
      navigate("/users/roles", {
        state: { update: "Rol actualizado con éxito" },
      });
    });
  };

  return (
    <>
      <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
        <div className="mb-1 w-full">
          <div>
            <Breadcrumb className="mb-4 mt-2">
              <Breadcrumb.Item href="/">
                <div className="flex items-center gap-x-3">
                  <HiHome className="text-xl" />
                  <span className="dark:text-white">{t("HOME")}</span>
                </div>
              </Breadcrumb.Item>
              <Breadcrumb.Item href="/users">{t("USERS")}</Breadcrumb.Item>
              <Breadcrumb.Item href="/users/roles">
                {t("USERS_ROLES")}
              </Breadcrumb.Item>
              <Breadcrumb.Item>Roles</Breadcrumb.Item>
            </Breadcrumb>

            <div className="items-center flex ">
              <Button
                size="xs"
                color="light"
                className="mr-4"
                as={Link}
                to="/users/roles"
              >
                <HiOutlineArrowLeft className="mr-2" />
                {t("BACK")}
              </Button>

              <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                {t("USERS_ROLES_LIST_TITLE")}
              </h1>

              <div className="flex flex-grow justify-end gap-x-4">
                {role ? (
                  <>
                    <Button
                      disabled={
                        (!user.users_roles.rules.mod_users.roles.update_all &&
                          !user.users_roles.rules.mod_users.roles
                            .update_group &&
                          !user.users_roles.rules.mod_users.roles.update_own) ||
                        (!user.users_roles.rules.mod_users.roles.update_all &&
                          user.users_roles.rules.mod_users.roles.update_group &&
                          userGroupId !== role.group_id) ||
                        (!user.users_roles.rules.mod_users.roles.update_all &&
                          !user.users_roles.rules.mod_users.roles
                            .update_group &&
                          user.users_roles.rules.mod_users.roles.update_own &&
                          user.id !== role.created_by)
                      }
                      color="primary"
                      onClick={() => handleSave()}
                    >
                      <div className="flex items-center gap-x-3">
                        {t("SAVE")}
                      </div>
                    </Button>
                    <DeleteRoleModal
                      role={role}
                      closeModal={closeAfterDelete}
                      onRoleDelete={() =>
                        navigate("/users/roles/", {
                          state: { delete: "Rol eliminado con éxito" },
                        })
                      }
                      disableButton={
                        (!user.users_roles.rules.mod_users.roles.delete_all &&
                          !user.users_roles.rules.mod_users.roles
                            .delete_group &&
                          !user.users_roles.rules.mod_users.roles.delete_own) ||
                        (!user.users_roles.rules.mod_users.roles.delete_all &&
                          user.users_roles.rules.mod_users.roles.delete_group &&
                          userGroupId !== role.group_id) ||
                        (!user.users_roles.rules.mod_users.roles.delete_all &&
                          !user.users_roles.rules.mod_users.roles
                            .delete_group &&
                          user.users_roles.rules.mod_users.roles.delete_own &&
                          user.id !== role.created_by)
                      }
                    />
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 text-center bg-white dark:bg-gray-800 dark:text-white">
        <div className="col-span-4 p-4">
          <Card>
            <div className="max-h-[90vh] overflow-auto p-2">
              <TextInput
                defaultValue={title}
                className="p-2"
                id="small"
                placeholder="Nombre del rol..."
                type="text"
                sizing="sm"
                onKeyUp={(event) => setTitle(event.currentTarget.value)}
              />
              {panels.map((panel) => {
                return (
                  <React.Fragment key={panel.id}>
                    <div
                      className="hover:bg-gray-200 dark:hover:bg-gray-500 p-2 cursor-pointer"
                      onClick={() => handleClick(panel.id)}
                    >
                      <h1 className=" pl-4 font-bold text-left mb-2">
                        {panel.title}
                      </h1>
                      <p className="text-left pl-4 mb-4">{panel.description}</p>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="col-span-8 overflow-y-auto p-4">
          <PermissionsTable
            panel={panel}
            onPermissionChange={(newPerms) => setPermission(newPerms)}
            id={id}
          />
        </div>
      </div>
    </>
  );
}
