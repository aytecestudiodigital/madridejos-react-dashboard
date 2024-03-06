/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import { Card, Table, Tabs, ToggleSwitch } from "flowbite-react";
import { useEffect, useState } from "react";
import { UserRol } from "../../models/UserRol";
import { permissions } from "../../models/RolePermissions";
import { useTranslation } from "react-i18next";
import { getOneRow } from "../../../../server/supabaseQueries";

interface PermissionProps {
  panel: any;
  onPermissionChange: (permission: any) => void;
  id: any;
}

export function PermissionsTable({
  panel: panel,
  onPermissionChange,
  id: id,
}: PermissionProps) {
  const [permission, setPermission] = useState<any>(UserRol);
  const [changeAll, setChangeAll] = useState<any>({});
  const { t } = useTranslation();
  const tableName = import.meta.env.VITE_TABLE_USER_ROLES;

  const onEnable = (index: any, value: any) => {
    const _enabled: any = { ...changeAll };
    _enabled[index] = value;
    setChangeAll(_enabled);
  };

  useEffect(() => {
    onPermissionChange(permission);
  }, [permission]);

  useEffect(() => {
    getOneRow("id", id!, tableName).then((role: any) => {
      setPermission(role.rules);
    });
  }, []);

  const handleSubPermissionChange = (
    mainPermission: any,
    subPermission: any,
  ) => {
    setPermission((prevPermissions: { [x: string]: { [x: string]: any } }) => ({
      ...prevPermissions,
      [mainPermission]: {
        ...prevPermissions[mainPermission],
        [subPermission]: !prevPermissions[mainPermission][subPermission],
      },
    }));
  };

  const handleActivateAll = (
    mainPermission: any,
    subPermissions: any[],
    value: any,
  ) => {
    subPermissions.forEach((subPermission) => {
      setPermission(
        (prevPermissions: { [x: string]: { [x: string]: any } }) => ({
          ...prevPermissions,
          [mainPermission]: {
            ...prevPermissions[mainPermission],
            [subPermission]: value,
          },
        }),
      );
    });
  };

  const handleActivateSubAll = (
    mainPermission: any,
    subPermission: any,
    subSubPermissions: any[],
    value: any,
  ) => {
    subSubPermissions.forEach((subSubPermission) => {
      setPermission(
        (prevPermissions: {
          [x: string]: { [x: string]: { [x: string]: any } };
        }) => ({
          ...prevPermissions,
          [mainPermission]: {
            ...prevPermissions[mainPermission],
            [subPermission]: {
              ...prevPermissions[mainPermission][subPermission],
              [subSubPermission]: value,
            },
          },
        }),
      );
    });
  };

  const handleSubSubPermissionChange = (
    mainPermission: any,
    subPermission: any,
    subSubPermission: any,
  ) => {
    setPermission(
      (prevPermissions: {
        [x: string]: { [x: string]: { [x: string]: any } };
      }) => ({
        ...prevPermissions,
        [mainPermission]: {
          ...prevPermissions[mainPermission],
          [subPermission]: {
            ...prevPermissions[mainPermission][subPermission],
            [subSubPermission]:
              !prevPermissions[mainPermission][subPermission][subSubPermission],
          },
        },
      }),
    );
  };

  return (
    <>
      {panel === "organization" ? (
        <Tabs.Group key={panel}>
          <Tabs.Item title={t("ORGANIZATION")}>
            <div>
              <div className="flex justify-between p-2">
                <h1 className="text-left text-2xl font-bold mb-4"></h1>
                <div>
                  {changeAll[0] ? (
                    <ToggleSwitch
                      label={t("DISABLED_ALL")}
                      checked={changeAll[0]}
                      onChange={() => {
                        onEnable(0, false);
                        handleActivateAll(
                          "organization",
                          ["access_module", "update", "read"],
                          false,
                        );
                      }}
                    />
                  ) : (
                    <h1></h1>
                  )}
                  {!changeAll[0] ? (
                    <ToggleSwitch
                      label={t("ENABLED_ALL")}
                      checked={changeAll[0]}
                      onChange={() => {
                        onEnable(0, true);
                        handleActivateAll(
                          "organization",
                          ["access_module", "update", "read"],
                          true,
                        );
                      }}
                    />
                  ) : (
                    <h1></h1>
                  )}
                </div>
              </div>

              <Card>
                <Table>
                  <Table.Head className="dark:text-white w-full">
                    <Table.HeadCell>{t("PERMISSION")}</Table.HeadCell>
                    <Table.HeadCell>{t("STATE")}</Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y">
                    <Table.Row>
                      <Table.Cell>{t("ACCESS_DASHBOARD")}</Table.Cell>
                      <Table.Cell>
                        <div className="flex flex-col">
                          <ToggleSwitch
                            checked={permission.organization.access_module}
                            onChange={() =>
                              handleSubPermissionChange(
                                "organization",
                                "access_module",
                              )
                            }
                          />
                        </div>
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>{t("DASHBOARD_UPDATE")}</Table.Cell>
                      <Table.Cell>
                        <div className="flex flex-col">
                          <ToggleSwitch
                            checked={permission.organization.update}
                            onChange={() =>
                              handleSubPermissionChange(
                                "organization",
                                "update",
                              )
                            }
                          />
                        </div>
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>{t("DASHBOARD_READ")}</Table.Cell>
                      <Table.Cell>
                        <div className="flex flex-col">
                          <ToggleSwitch
                            checked={permission.organization.read}
                            onChange={() =>
                              handleSubPermissionChange("organization", "read")
                            }
                          />
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              </Card>
            </div>
          </Tabs.Item>
        </Tabs.Group>
      ) : panel === "content" ? (
        <>
          <Tabs.Group key={panel}>
            <Tabs.Item title={t("CONTENT_TYPE")}>
              <div className="mb-12">
                <div className="flex justify-between p-2">
                  <h1 className="text-left text-2xl font-bold mb-4"></h1>
                  <div>
                    {changeAll[1] ? (
                      <ToggleSwitch
                        label={t("DISABLED_ALL")}
                        checked={changeAll[1]}
                        onChange={() => {
                          onEnable(1, false);
                          handleActivateSubAll(
                            "content",
                            "contents",
                            [
                              "access_module",
                              "create",
                              "read_all",
                              "read_own",
                              "read_group",
                              "update_all",
                              "update_own",
                              "update_group",
                              "delete_all",
                              "delete_own",
                              "delete_group",
                            ],
                            false,
                          );
                        }}
                      />
                    ) : (
                      <h1></h1>
                    )}
                    {!changeAll[1] ? (
                      <ToggleSwitch
                        label={t("ENABLED_ALL")}
                        checked={changeAll[1]}
                        onChange={() => {
                          onEnable(1, true);
                          handleActivateSubAll(
                            "content",
                            "contents",
                            [
                              "access_module",
                              "create",
                              "read_all",
                              "read_own",
                              "read_group",
                              "update_all",
                              "update_own",
                              "update_group",
                              "delete_all",
                              "delete_own",
                              "delete_group",
                            ],
                            true,
                          );
                        }}
                      />
                    ) : (
                      <h1></h1>
                    )}
                  </div>
                </div>

                <Card>
                  <Table>
                    <Table.Head className="dark:text-white w-full">
                      <Table.HeadCell>{t("PERMISSION")}</Table.HeadCell>
                      <Table.HeadCell>{t("DESCRIPTION")}</Table.HeadCell>
                      <Table.HeadCell>{t("STATE")}</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                      <Table.Row>
                        <Table.Cell>
                          {permissions.content.contents.actions[0].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.content.contents.actions[0].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.content.contents.access_module
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "content",
                                  "contents",
                                  "access_module",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.content.contents.actions[1].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.content.contents.actions[1].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.content.contents.create}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "content",
                                  "contents",
                                  "create",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.content.contents.actions[2].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.content.contents.actions[2].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.content.contents.read_all}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "content",
                                  "contents",
                                  "read_all",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.content.contents.actions[3].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.content.contents.actions[3].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.content.contents.read_own}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "content",
                                  "contents",
                                  "read_own",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.content.contents.actions[4].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.content.contents.actions[4].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.content.contents.read_group}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "content",
                                  "contents",
                                  "read_group",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.content.contents.actions[5].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.content.contents.actions[5].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.content.contents.update_all}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "content",
                                  "contents",
                                  "update_all",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.content.contents.actions[6].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.content.contents.actions[6].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.content.contents.update_own}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "content",
                                  "contents",
                                  "update_own",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.content.contents.actions[7].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.content.contents.actions[7].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.content.contents.update_group}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "content",
                                  "contents",
                                  "update_group",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.content.contents.actions[8].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.content.contents.actions[8].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.content.contents.delete_all}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "content",
                                  "contents",
                                  "delete_all",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.content.contents.actions[9].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.content.contents.actions[9].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.content.contents.delete_own}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "content",
                                  "contents",
                                  "delete_own",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.content.contents.actions[10].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.content.contents.actions[10].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.content.contents.delete_group}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "content",
                                  "contents",
                                  "delete_group",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </Card>
              </div>
            </Tabs.Item>
            <Tabs.Item title={t("CATEGORIES_TITLE")}>
              <div className="mb-12">
                <div className="flex justify-between p-2">
                  <h1 className="text-left text-2xl font-bold mb-4"></h1>
                  <div>
                    {changeAll[2] ? (
                      <ToggleSwitch
                        label={t("DISABLED_ALL")}
                        checked={changeAll[2]}
                        onChange={() => {
                          onEnable(2, false);
                          handleActivateSubAll(
                            "content",
                            "categories",
                            [
                              "access_module",
                              "create",
                              "read_all",
                              "read_own",
                              "read_group",
                              "update_all",
                              "update_own",
                              "update_group",
                              "delete_all",
                              "delete_own",
                              "delete_group",
                            ],
                            false,
                          );
                        }}
                      />
                    ) : (
                      <h1></h1>
                    )}
                    {!changeAll[2] ? (
                      <ToggleSwitch
                        label={t("ENABLED_ALL")}
                        checked={changeAll[2]}
                        onChange={() => {
                          onEnable(2, true);
                          handleActivateSubAll(
                            "content",
                            "categories",
                            [
                              "access_module",
                              "create",
                              "read_all",
                              "read_own",
                              "read_group",
                              "update_all",
                              "update_own",
                              "update_group",
                              "delete_all",
                              "delete_own",
                              "delete_group",
                            ],
                            true,
                          );
                        }}
                      />
                    ) : (
                      <h1></h1>
                    )}
                  </div>
                </div>
                <Card>
                  <Table>
                    <Table.Head className="dark:text-white w-full">
                      <Table.HeadCell>{t("PERMISSION")}</Table.HeadCell>
                      <Table.HeadCell>{t("DESCRIPTION")}</Table.HeadCell>
                      <Table.HeadCell>{t("STATE")}</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                      <Table.Row>
                        <Table.Cell>
                          {permissions.content.categories.actions[0].label}
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.content.categories.actions[0]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.content.categories.access_module
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "content",
                                  "categories",
                                  "access_module",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.content.categories.actions[1].label}
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.content.categories.actions[1]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.content.categories.create}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "content",
                                  "categories",
                                  "create",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.content.categories.actions[2].label}
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.content.categories.actions[2]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.content.categories.read_all}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "content",
                                  "categories",
                                  "read_all",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.content.categories.actions[3].label}
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.content.categories.actions[3]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.content.categories.read_own}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "content",
                                  "categories",
                                  "read_own",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.content.categories.actions[4].label}
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.content.categories.actions[4]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.content.categories.read_group}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "content",
                                  "categories",
                                  "read_group",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.content.categories.actions[5].label}
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.content.categories.actions[5]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.content.categories.update_all}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "content",
                                  "categories",
                                  "update_all",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.content.categories.actions[6].label}
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.content.categories.actions[6]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.content.categories.update_own}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "content",
                                  "categories",
                                  "update_own",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.content.categories.actions[7].label}
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.content.categories.actions[7]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.content.categories.update_group
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "content",
                                  "categories",
                                  "update_group",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.content.categories.actions[8].label}
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.content.categories.actions[8]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.content.categories.delete_all}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "content",
                                  "categories",
                                  "delete_all",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.content.categories.actions[9].label}
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.content.categories.actions[9]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.content.categories.delete_own}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "content",
                                  "categories",
                                  "delete_own",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.content.categories.actions[10].label}
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.content.categories.actions[10]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.content.categories.delete_group
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "content",
                                  "categories",
                                  "delete_group",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </Card>
              </div>
            </Tabs.Item>
            <Tabs.Item title={t("ENTITIES")}>
              <div className="mb-12">
                <div className="flex justify-between p-2">
                  <h1 className="text-left text-2xl font-bold mb-4"></h1>
                  <div>
                    {changeAll[3] ? (
                      <ToggleSwitch
                        label={t("DISABLED_ALL")}
                        checked={changeAll[3]}
                        onChange={() => {
                          onEnable(3, false);
                          handleActivateSubAll(
                            "content",
                            "entities",
                            [
                              "access_module",
                              "create",
                              "read_all",
                              "read_own",
                              "read_group",
                              "update_all",
                              "update_own",
                              "update_group",
                              "delete_all",
                              "delete_own",
                              "delete_group",
                            ],
                            false,
                          );
                        }}
                      />
                    ) : (
                      <h1></h1>
                    )}
                    {!changeAll[3] ? (
                      <ToggleSwitch
                        label={t("ENABLED_ALL")}
                        checked={changeAll[3]}
                        onChange={() => {
                          onEnable(3, true);
                          handleActivateSubAll(
                            "content",
                            "entities",
                            [
                              "access_module",
                              "create",
                              "read_all",
                              "read_own",
                              "read_group",
                              "update_all",
                              "update_own",
                              "update_group",
                              "delete_all",
                              "delete_own",
                              "delete_group",
                            ],
                            true,
                          );
                        }}
                      />
                    ) : (
                      <h1></h1>
                    )}
                  </div>
                </div>
                <Card>
                  <Table>
                    <Table.Head className="dark:text-white w-full">
                      <Table.HeadCell>{t("PERMISSION")}</Table.HeadCell>
                      <Table.HeadCell>{t("DESCRIPTION")}</Table.HeadCell>
                      <Table.HeadCell>{t("STATE")}</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                      <Table.Row>
                        <Table.Cell>
                          {permissions.content.entities.actions[0].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.content.entities.actions[0].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.content.entities.access_module
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "content",
                                  "entities",
                                  "access_module",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.content.entities.actions[1].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.content.entities.actions[1].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.content.entities.create}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "content",
                                  "entities",
                                  "create",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.content.entities.actions[2].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.content.entities.actions[2].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.content.entities.read_all}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "content",
                                  "entities",
                                  "read_all",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.content.entities.actions[3].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.content.entities.actions[3].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.content.entities.read_own}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "content",
                                  "entities",
                                  "read_own",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.content.entities.actions[4].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.content.entities.actions[4].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.content.entities.read_group}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "content",
                                  "entities",
                                  "read_group",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.content.entities.actions[5].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.content.entities.actions[5].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.content.entities.update_all}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "content",
                                  "entities",
                                  "update_all",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.content.entities.actions[6].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.content.entities.actions[6].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.content.entities.update_own}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "content",
                                  "entities",
                                  "update_own",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.content.entities.actions[7].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.content.entities.actions[7].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.content.entities.update_group}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "content",
                                  "entities",
                                  "update_group",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.content.entities.actions[8].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.content.entities.actions[8].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.content.entities.delete_all}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "content",
                                  "entities",
                                  "delete_all",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.content.entities.actions[9].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.content.entities.actions[9].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.content.entities.delete_own}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "content",
                                  "entities",
                                  "delete_own",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.content.entities.actions[10].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.content.entities.actions[10].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.content.entities.delete_group}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "content",
                                  "entities",
                                  "delete_group",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </Card>
              </div>
            </Tabs.Item>
          </Tabs.Group>
        </>
      ) : panel === "users" ? (
        <>
          <Tabs.Group key={panel}>
            <Tabs.Item title={t("MENU_USERS_GROUPS")}>
              <div className="mb-12">
                <div className="flex justify-between p-2">
                  <h1 className="text-left text-2xl font-bold mb-4"></h1>
                  <div>
                    {changeAll[4] ? (
                      <ToggleSwitch
                        label={t("DISABLED_ALL")}
                        checked={changeAll[4]}
                        onChange={() => {
                          onEnable(4, false);
                          handleActivateSubAll(
                            "mod_users",
                            "groups",
                            [
                              "access_module",
                              "create",
                              "read_all",
                              "read_own",
                              "read_group",
                              "update_all",
                              "update_own",
                              "update_group",
                              "delete_all",
                              "delete_own",
                              "delete_group",
                            ],
                            false,
                          );
                        }}
                      />
                    ) : (
                      <h1></h1>
                    )}
                    {!changeAll[4] ? (
                      <ToggleSwitch
                        label={t("ENABLED_ALL")}
                        checked={changeAll[4]}
                        onChange={() => {
                          onEnable(4, true);
                          handleActivateSubAll(
                            "mod_users",
                            "groups",
                            [
                              "access_module",
                              "create",
                              "read_all",
                              "read_own",
                              "read_group",
                              "update_all",
                              "update_own",
                              "update_group",
                              "delete_all",
                              "delete_own",
                              "delete_group",
                            ],
                            true,
                          );
                        }}
                      />
                    ) : (
                      <h1></h1>
                    )}
                  </div>
                </div>
                <Card>
                  <Table>
                    <Table.Head className="dark:text-white w-full">
                      <Table.HeadCell>{t("PERMISSION")}</Table.HeadCell>
                      <Table.HeadCell>{t("DESCRIPTION")}</Table.HeadCell>
                      <Table.HeadCell>{t("STATE")}</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                      <Table.Row>
                        <Table.Cell>
                          {permissions.users.groups.actions[0].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.users.groups.actions[0].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.mod_users.groups.access_module
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "mod_users",
                                  "groups",
                                  "access_module",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.users.groups.actions[1].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.users.groups.actions[1].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.mod_users.groups.create}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "mod_users",
                                  "groups",
                                  "create",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.users.groups.actions[2].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.users.groups.actions[2].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.mod_users.groups.read_all}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "mod_users",
                                  "groups",
                                  "read_all",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.users.groups.actions[3].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.users.groups.actions[3].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.mod_users.groups.read_own}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "mod_users",
                                  "groups",
                                  "read_own",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.users.groups.actions[4].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.users.groups.actions[4].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.mod_users.groups.read_group}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "mod_users",
                                  "groups",
                                  "read_group",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.users.groups.actions[5].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.users.groups.actions[5].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.mod_users.groups.update_all}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "mod_users",
                                  "groups",
                                  "update_all",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.users.groups.actions[6].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.users.groups.actions[6].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.mod_users.groups.update_own}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "mod_users",
                                  "groups",
                                  "update_own",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.users.groups.actions[7].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.users.groups.actions[7].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.mod_users.groups.update_group}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "mod_users",
                                  "groups",
                                  "update_group",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.users.groups.actions[8].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.users.groups.actions[8].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.mod_users.groups.delete_all}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "mod_users",
                                  "groups",
                                  "delete_all",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.users.groups.actions[9].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.users.groups.actions[9].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.mod_users.groups.delete_own}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "mod_users",
                                  "groups",
                                  "delete_own",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.users.groups.actions[10].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.users.groups.actions[10].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.mod_users.groups.delete_group}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "mod_users",
                                  "groups",
                                  "delete_group",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </Card>
              </div>
            </Tabs.Item>
            <Tabs.Item title={t("ROLES")}>
              <div className="mb-12">
                <div className="flex justify-between p-2">
                  <h1 className="text-left text-2xl font-bold mb-4"></h1>
                  <div>
                    {changeAll[5] ? (
                      <ToggleSwitch
                        label={t("DISABLED_ALL")}
                        checked={changeAll[5]}
                        onChange={() => {
                          onEnable(5, false);
                          handleActivateSubAll(
                            "mod_users",
                            "roles",
                            [
                              "access_module",
                              "create",
                              "read_all",
                              "read_own",
                              "read_group",
                              "update_all",
                              "update_own",
                              "update_group",
                              "delete_all",
                              "delete_own",
                              "delete_group",
                            ],
                            false,
                          );
                        }}
                      />
                    ) : (
                      <h1></h1>
                    )}
                    {!changeAll[5] ? (
                      <ToggleSwitch
                        label={t("ENABLED_ALL")}
                        checked={changeAll[5]}
                        onChange={() => {
                          onEnable(5, true);
                          handleActivateSubAll(
                            "mod_users",
                            "roles",
                            [
                              "access_module",
                              "create",
                              "read_all",
                              "read_own",
                              "read_group",
                              "update_all",
                              "update_own",
                              "update_group",
                              "delete_all",
                              "delete_own",
                              "delete_group",
                            ],
                            true,
                          );
                        }}
                      />
                    ) : (
                      <h1></h1>
                    )}
                  </div>
                </div>
                <Card>
                  <Table>
                    <Table.Head className="dark:text-white w-full">
                      <Table.HeadCell>{t("PERMISSION")}</Table.HeadCell>
                      <Table.HeadCell>{t("DESCRIPTION")}</Table.HeadCell>
                      <Table.HeadCell>{t("STATE")}</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                      <Table.Row>
                        <Table.Cell>
                          {permissions.users.roles.actions[0].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.users.roles.actions[0].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.mod_users.roles.access_module}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "mod_users",
                                  "roles",
                                  "access_module",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.users.roles.actions[1].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.users.roles.actions[1].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.mod_users.roles.create}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "mod_users",
                                  "roles",
                                  "create",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.users.roles.actions[2].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.users.roles.actions[2].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.mod_users.roles.read_all}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "mod_users",
                                  "roles",
                                  "read_all",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.users.roles.actions[3].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.users.roles.actions[3].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.mod_users.roles.read_own}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "mod_users",
                                  "roles",
                                  "read_own",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.users.roles.actions[4].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.users.roles.actions[4].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.mod_users.roles.read_group}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "mod_users",
                                  "roles",
                                  "read_group",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.users.roles.actions[5].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.users.roles.actions[5].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.mod_users.roles.update_all}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "mod_users",
                                  "roles",
                                  "update_all",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.users.roles.actions[6].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.users.roles.actions[6].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.mod_users.roles.update_own}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "mod_users",
                                  "roles",
                                  "update_own",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.users.roles.actions[7].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.users.roles.actions[7].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.mod_users.roles.update_group}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "mod_users",
                                  "roles",
                                  "update_group",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.users.roles.actions[8].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.users.roles.actions[8].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.mod_users.roles.delete_all}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "mod_users",
                                  "roles",
                                  "delete_all",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.users.roles.actions[9].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.users.roles.actions[9].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.mod_users.roles.delete_own}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "mod_users",
                                  "roles",
                                  "delete_own",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.users.roles.actions[10].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.users.roles.actions[10].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.mod_users.roles.delete_group}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "mod_users",
                                  "roles",
                                  "delete_group",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </Card>
              </div>
            </Tabs.Item>
            <Tabs.Item title={t("USERS")}>
              <div className="mb-12">
                <div className="flex justify-between p-2">
                  <h1 className="text-left text-2xl font-bold mb-4"></h1>
                  <div>
                    {changeAll[6] ? (
                      <ToggleSwitch
                        label={t("DISABLED_ALL")}
                        checked={changeAll[6]}
                        onChange={() => {
                          onEnable(6, false);
                          handleActivateSubAll(
                            "mod_users",
                            "users",
                            [
                              "access_module",
                              "create",
                              "update",
                              "read",
                              "delete",
                            ],
                            false,
                          );
                        }}
                      />
                    ) : (
                      <h1></h1>
                    )}
                    {!changeAll[6] ? (
                      <ToggleSwitch
                        label={t("ENABLED_ALL")}
                        checked={changeAll[6]}
                        onChange={() => {
                          onEnable(6, true);
                          handleActivateSubAll(
                            "mod_users",
                            "users",
                            [
                              "access_module",
                              "create",
                              "update",
                              "read",
                              "delete",
                            ],
                            true,
                          );
                        }}
                      />
                    ) : (
                      <h1></h1>
                    )}
                  </div>
                </div>
                <Card>
                  <Table>
                    <Table.Head className="dark:text-white w-full">
                      <Table.HeadCell>{t("PERMISSION")}</Table.HeadCell>
                      <Table.HeadCell>{t("DESCRIPTION")}</Table.HeadCell>
                      <Table.HeadCell>{t("STATE")}</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                      <Table.Row>
                        <Table.Cell>
                          {permissions.users.users.actions[0].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.users.users.actions[0].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.mod_users.users.access_module}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "mod_users",
                                  "users",
                                  "access_module",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.users.users.actions[1].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.users.users.actions[1].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.mod_users.users.create}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "mod_users",
                                  "users",
                                  "create",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.users.users.actions[2].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.users.users.actions[2].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.mod_users.users.update}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "mod_users",
                                  "users",
                                  "update",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.users.users.actions[3].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.users.users.actions[3].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.mod_users.users.read}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "mod_users",
                                  "users",
                                  "read",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.users.users.actions[4].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.users.users.actions[4].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.mod_users.users.delete}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "mod_users",
                                  "users",
                                  "delete",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </Card>
              </div>
            </Tabs.Item>
          </Tabs.Group>
        </>
      ) : panel === "communication" ? (
        <>
          <Tabs.Group key={panel}>
            <Tabs.Item title={t("PUSH_NOTIFICATIONS")}>
              <div className="mb-12">
                <div className="flex justify-between p-2">
                  <h1 className="text-left text-2xl font-bold mb-4"></h1>
                  <div>
                    {changeAll[7] ? (
                      <ToggleSwitch
                        label={t("DISABLED_ALL")}
                        checked={changeAll[7]}
                        onChange={() => {
                          onEnable(7, false);
                          handleActivateSubAll(
                            "communication",
                            "push",
                            [
                              "access_module",
                              "create",
                              "update",
                              "read",
                              "delete",
                            ],
                            false,
                          );
                        }}
                      />
                    ) : (
                      <h1></h1>
                    )}
                    {!changeAll[7] ? (
                      <ToggleSwitch
                        label={t("ENABLED_ALL")}
                        checked={changeAll[7]}
                        onChange={() => {
                          onEnable(7, true);
                          handleActivateSubAll(
                            "communication",
                            "push",
                            [
                              "access_module",
                              "create",
                              "update",
                              "read",
                              "delete",
                            ],
                            true,
                          );
                        }}
                      />
                    ) : (
                      <h1></h1>
                    )}
                  </div>
                </div>
                <Card>
                  <Table>
                    <Table.Head className="dark:text-white w-full">
                      <Table.HeadCell>{t("PERMISSION")}</Table.HeadCell>
                      <Table.HeadCell>{t("DESCRIPTION")}</Table.HeadCell>
                      <Table.HeadCell>{t("STATE")}</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                      <Table.Row>
                        <Table.Cell>
                          {permissions.communication.push.actions[0].label}
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.communication.push.actions[0]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.communication.push.access_module
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "communication",
                                  "push",
                                  "access_module",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.communication.push.actions[1].label}
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.communication.push.actions[1]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.communication.push.create}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "communication",
                                  "push",
                                  "create",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.communication.push.actions[2].label}
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.communication.push.actions[2]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.communication.push.update}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "communication",
                                  "push",
                                  "update",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.communication.push.actions[3].label}
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.communication.push.actions[3]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.communication.push.read}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "communication",
                                  "push",
                                  "read",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.communication.push.actions[4].label}
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.communication.push.actions[4]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.communication.push.delete}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "communication",
                                  "push",
                                  "delete",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </Card>
              </div>
            </Tabs.Item>
            <Tabs.Item title={t("EMAILS")}>
              <div className="mb-12">
                <div className="flex justify-between p-2">
                  <h1 className="text-left text-2xl font-bold mb-4"></h1>
                  <div>
                    {changeAll[8] ? (
                      <ToggleSwitch
                        label={t("DISABLED_ALL")}
                        checked={changeAll[8]}
                        onChange={() => {
                          onEnable(8, false);
                          handleActivateSubAll(
                            "communication",
                            "emails",
                            [
                              "access_module",
                              "create",
                              "read_all",
                              "read_own",
                              "read_group",
                              "update_all",
                              "update_own",
                              "update_group",
                              "delete_all",
                              "delete_own",
                              "delete_group",
                            ],
                            false,
                          );
                        }}
                      />
                    ) : (
                      <h1></h1>
                    )}
                    {!changeAll[8] ? (
                      <ToggleSwitch
                        label={t("ENABLED_ALL")}
                        checked={changeAll[8]}
                        onChange={() => {
                          onEnable(8, true);
                          handleActivateSubAll(
                            "communication",
                            "emails",
                            [
                              "access_module",
                              "create",
                              "read_all",
                              "read_own",
                              "read_group",
                              "update_all",
                              "update_own",
                              "update_group",
                              "delete_all",
                              "delete_own",
                              "delete_group",
                            ],
                            true,
                          );
                        }}
                      />
                    ) : (
                      <h1></h1>
                    )}
                  </div>
                </div>
                <Card>
                  <Table>
                    <Table.Head className="dark:text-white w-full">
                      <Table.HeadCell>{t("PERMISSION")}</Table.HeadCell>
                      <Table.HeadCell>{t("DESCRIPTION")}</Table.HeadCell>
                      <Table.HeadCell>{t("STATE")}</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                      <Table.Row>
                        <Table.Cell>
                          {permissions.communication.emails.actions[0].label}
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.communication.emails.actions[0]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.communication.emails.access_module
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "communication",
                                  "emails",
                                  "access_module",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.communication.emails.actions[1].label}
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.communication.emails.actions[1]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.communication.emails.create}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "communication",
                                  "emails",
                                  "create",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.communication.emails.actions[2].label}
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.communication.emails.actions[2]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.communication.emails.read_all}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "communication",
                                  "emails",
                                  "read_all",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.communication.emails.actions[3].label}
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.communication.emails.actions[3]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.communication.emails.read_own}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "communication",
                                  "emails",
                                  "read_own",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.communication.emails.actions[4].label}
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.communication.emails.actions[4]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.communication.emails.read_group
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "communication",
                                  "emails",
                                  "read_group",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.communication.emails.actions[5].label}
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.communication.emails.actions[5]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.communication.emails.update_all
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "communication",
                                  "emails",
                                  "update_all",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.communication.emails.actions[6].label}
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.communication.emails.actions[6]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.communication.emails.update_own
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "communication",
                                  "emails",
                                  "update_own",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.communication.emails.actions[7].label}
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.communication.emails.actions[7]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.communication.emails.update_group
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "communication",
                                  "emails",
                                  "update_group",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.communication.emails.actions[8].label}
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.communication.emails.actions[8]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.communication.emails.delete_all
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "communication",
                                  "emails",
                                  "delete_all",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.communication.emails.actions[9].label}
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.communication.emails.actions[9]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.communication.emails.delete_own
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "communication",
                                  "emails",
                                  "delete_own",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.communication.emails.actions[10].label}
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.communication.emails.actions[10]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.communication.emails.delete_group
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "communication",
                                  "emails",
                                  "delete_group",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </Card>
              </div>
            </Tabs.Item>
            <Tabs.Item title={t("WARNINGS")}>
              <div className="mb-12">
                <div className="flex justify-between p-2">
                  <h1 className="text-left text-2xl font-bold mb-4"></h1>
                  <div>
                    {changeAll[9] ? (
                      <ToggleSwitch
                        label={t("DISABLED_ALL")}
                        checked={changeAll[9]}
                        onChange={() => {
                          onEnable(9, false);
                          handleActivateSubAll(
                            "communication",
                            "warnings",
                            [
                              "access_module",
                              "create",
                              "update",
                              "read",
                              "delete",
                            ],
                            false,
                          );
                        }}
                      />
                    ) : (
                      <h1></h1>
                    )}
                    {!changeAll[9] ? (
                      <ToggleSwitch
                        label={t("ENABLED_ALL")}
                        checked={changeAll[9]}
                        onChange={() => {
                          onEnable(9, true);
                          handleActivateSubAll(
                            "communication",
                            "warnings",
                            [
                              "access_module",
                              "create",
                              "update",
                              "read",
                              "delete",
                            ],
                            true,
                          );
                        }}
                      />
                    ) : (
                      <h1></h1>
                    )}
                  </div>
                </div>
                <Card>
                  <Table>
                    <Table.Head className="dark:text-white w-full">
                      <Table.HeadCell>{t("PERMISSION")}</Table.HeadCell>
                      <Table.HeadCell>{t("DESCRIPTION")}</Table.HeadCell>
                      <Table.HeadCell>{t("STATE")}</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                      <Table.Row>
                        <Table.Cell>
                          {permissions.communication.warnings.actions[0].label}
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.communication.warnings.actions[0]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.communication.warnings.access_module
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "communication",
                                  "warnings",
                                  "access_module",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.communication.warnings.actions[1].label}
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.communication.warnings.actions[1]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.communication.warnings.create}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "communication",
                                  "warnings",
                                  "create",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.communication.warnings.actions[2].label}
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.communication.warnings.actions[2]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.communication.warnings.update}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "communication",
                                  "warnings",
                                  "update",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.communication.warnings.actions[3].label}
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.communication.warnings.actions[3]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.communication.warnings.read}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "communication",
                                  "warnings",
                                  "read",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.communication.warnings.actions[4].label}
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.communication.warnings.actions[4]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.communication.warnings.delete}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "communication",
                                  "warnings",
                                  "delete",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </Card>
              </div>
            </Tabs.Item>
          </Tabs.Group>
        </>
      ) : panel === "design" ? (
        <>
          <Tabs.Group key={panel}>
            <Tabs.Item title={t("SECTIONS")}>
              <div className="mb-12">
                <div className="flex justify-between p-2">
                  <h1 className="text-left text-2xl font-bold mb-4"></h1>
                  <div>
                    {changeAll[10] ? (
                      <ToggleSwitch
                        label={t("DISABLED_ALL")}
                        checked={changeAll[10]}
                        onChange={() => {
                          onEnable(10, false);
                          handleActivateSubAll(
                            "design",
                            "sections",
                            [
                              "access_module",
                              "create",
                              "update",
                              "read",
                              "delete",
                            ],
                            false,
                          );
                        }}
                      />
                    ) : (
                      <h1></h1>
                    )}
                    {!changeAll[10] ? (
                      <ToggleSwitch
                        label={t("ENABLED_ALL")}
                        checked={changeAll[10]}
                        onChange={() => {
                          onEnable(10, true);
                          handleActivateSubAll(
                            "design",
                            "sections",
                            [
                              "access_module",
                              "create",
                              "update",
                              "read",
                              "delete",
                            ],
                            true,
                          );
                        }}
                      />
                    ) : (
                      <h1></h1>
                    )}
                  </div>
                </div>
                <Card>
                  <Table>
                    <Table.Head className="dark:text-white w-full">
                      <Table.HeadCell>{t("PERMISSION")}</Table.HeadCell>
                      <Table.HeadCell>{t("DESCRIPTION")}</Table.HeadCell>
                      <Table.HeadCell>{t("STATE")}</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                      <Table.Row>
                        <Table.Cell>
                          {permissions.design.sections.actions[0].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.design.sections.actions[0].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.design.sections.access_module}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "design",
                                  "sections",
                                  "access_module",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.design.sections.actions[1].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.design.sections.actions[1].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.design.sections.create}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "design",
                                  "sections",
                                  "create",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.design.sections.actions[2].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.design.sections.actions[2].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.design.sections.update}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "design",
                                  "sections",
                                  "update",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.design.sections.actions[3].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.design.sections.actions[3].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.design.sections.read}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "design",
                                  "sections",
                                  "read",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.design.sections.actions[4].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.design.sections.actions[4].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.design.sections.delete}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "design",
                                  "sections",
                                  "delete",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </Card>
              </div>
            </Tabs.Item>
            <Tabs.Item title={t("TEMPLATES")}>
              <div className="mb-12">
                <div className="flex justify-between p-2">
                  <h1 className="text-left text-2xl font-bold mb-4"></h1>
                  <div>
                    {changeAll[11] ? (
                      <ToggleSwitch
                        label={t("DISABLED_ALL")}
                        checked={changeAll[11]}
                        onChange={() => {
                          onEnable(11, false);
                          handleActivateSubAll(
                            "design",
                            "templates",
                            [
                              "access_module",
                              "create",
                              "update",
                              "read",
                              "delete",
                            ],
                            false,
                          );
                        }}
                      />
                    ) : (
                      <h1></h1>
                    )}
                    {!changeAll[11] ? (
                      <ToggleSwitch
                        label={t("ENABLED_ALL")}
                        checked={changeAll[11]}
                        onChange={() => {
                          onEnable(11, true);
                          handleActivateSubAll(
                            "design",
                            "templates",
                            [
                              "access_module",
                              "create",
                              "update",
                              "read",
                              "delete",
                            ],
                            true,
                          );
                        }}
                      />
                    ) : (
                      <h1></h1>
                    )}
                  </div>
                </div>
                <Card>
                  <Table>
                    <Table.Head className="dark:text-white w-full">
                      <Table.HeadCell>{t("PERMISSION")}</Table.HeadCell>
                      <Table.HeadCell>{t("DESCRIPTION")}</Table.HeadCell>
                      <Table.HeadCell>{t("STATE")}</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                      <Table.Row>
                        <Table.Cell>
                          {permissions.design.templates.actions[0].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.design.templates.actions[0].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.design.templates.access_module
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "design",
                                  "templates",
                                  "access_module",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.design.templates.actions[1].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.design.templates.actions[1].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.design.templates.create}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "design",
                                  "templates",
                                  "create",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.design.templates.actions[2].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.design.templates.actions[2].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.design.templates.update}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "design",
                                  "templates",
                                  "update",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.design.templates.actions[3].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.design.templates.actions[3].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.design.templates.read}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "design",
                                  "templates",
                                  "read",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.design.templates.actions[4].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.design.templates.actions[4].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.design.templates.delete}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "design",
                                  "templates",
                                  "delete",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </Card>
              </div>
            </Tabs.Item>
            <Tabs.Item title={t("MENU")}>
              <div className="mb-12">
                <div className="flex justify-between p-2">
                  <h1 className="text-left text-2xl font-bold mb-4"></h1>
                  <div>
                    {changeAll[12] ? (
                      <ToggleSwitch
                        label={t("DISABLED_ALL")}
                        checked={changeAll[12]}
                        onChange={() => {
                          onEnable(12, false);
                          handleActivateSubAll(
                            "design",
                            "navigation",
                            [
                              "access_module",
                              "create",
                              "update",
                              "read",
                              "delete",
                            ],
                            false,
                          );
                        }}
                      />
                    ) : (
                      <h1></h1>
                    )}
                    {!changeAll[12] ? (
                      <ToggleSwitch
                        label={t("ENABLED_ALL")}
                        checked={changeAll[12]}
                        onChange={() => {
                          onEnable(12, true);
                          handleActivateSubAll(
                            "design",
                            "navigation",
                            [
                              "access_module",
                              "create",
                              "update",
                              "read",
                              "delete",
                            ],
                            true,
                          );
                        }}
                      />
                    ) : (
                      <h1></h1>
                    )}
                  </div>
                </div>
                <Card>
                  <Table>
                    <Table.Head className="dark:text-white w-full">
                      <Table.HeadCell>{t("PERMISSION")}</Table.HeadCell>
                      <Table.HeadCell>{t("DESCRIPTION")}</Table.HeadCell>
                      <Table.HeadCell>{t("STATE")}</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                      <Table.Row>
                        <Table.Cell>
                          {permissions.design.navigation.actions[0].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.design.navigation.actions[0].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.design.navigation.access_module
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "design",
                                  "navigation",
                                  "access_module",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.design.navigation.actions[1].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.design.navigation.actions[1].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.design.navigation.create}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "design",
                                  "navigation",
                                  "create",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.design.navigation.actions[2].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.design.navigation.actions[2].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.design.navigation.update}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "design",
                                  "navigation",
                                  "update",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.design.navigation.actions[3].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.design.navigation.actions[3].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.design.navigation.read}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "design",
                                  "navigation",
                                  "read",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.design.navigation.actions[4].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.design.navigation.actions[4].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.design.navigation.delete}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "design",
                                  "navigation",
                                  "delete",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </Card>
              </div>
            </Tabs.Item>
          </Tabs.Group>
        </>
      ) : panel === "bookings" ? (
        <>
          <Tabs.Group>
            <Tabs.Item title={t("BOOKINGS")}>
              <div className="mb-12">
                <div className="flex justify-between p-2">
                  <h1 className="text-left text-2xl font-bold mb-4"></h1>
                  <div>
                    {changeAll[13] ? (
                      <ToggleSwitch
                        label={t("DISABLED_ALL")}
                        checked={changeAll[13]}
                        onChange={() => {
                          onEnable(13, false);
                          handleActivateSubAll(
                            "bookings",
                            "bookings",
                            [
                              "access_module",
                              "create",
                              "update",
                              "read",
                              "delete",
                            ],
                            false,
                          );
                        }}
                      />
                    ) : (
                      <h1></h1>
                    )}
                    {!changeAll[13] ? (
                      <ToggleSwitch
                        label={t("ENABLED_ALL")}
                        checked={changeAll[13]}
                        onChange={() => {
                          onEnable(13, true);
                          handleActivateSubAll(
                            "bookings",
                            "bookings",
                            [
                              "access_module",
                              "create",
                              "update",
                              "read",
                              "delete",
                            ],
                            true,
                          );
                        }}
                      />
                    ) : (
                      <h1></h1>
                    )}
                  </div>
                </div>
                <Card>
                  <Table>
                    <Table.Head className="dark:text-white w-full">
                      <Table.HeadCell>{t("PERMISSION")}</Table.HeadCell>
                      <Table.HeadCell>{t("DESCRIPTION")}</Table.HeadCell>
                      <Table.HeadCell>{t("STATE")}</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                      <Table.Row>
                        <Table.Cell>
                          {permissions.bookings.bookings.actions[0].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.bookings.bookings.actions[0].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.bookings.bookings.access_module
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "bookings",
                                  "bookings",
                                  "access_module",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.bookings.bookings.actions[1].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.bookings.bookings.actions[1].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.bookings.bookings.create}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "bookings",
                                  "bookings",
                                  "create",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.bookings.bookings.actions[2].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.bookings.bookings.actions[2].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.bookings.bookings.update}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "bookings",
                                  "bookings",
                                  "update",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.bookings.bookings.actions[3].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.bookings.bookings.actions[3].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.bookings.bookings.read}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "bookings",
                                  "bookings",
                                  "read",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.bookings.bookings.actions[4].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.bookings.bookings.actions[4].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.bookings.bookings.delete}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "bookings",
                                  "bookings",
                                  "delete",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </Card>
              </div>
            </Tabs.Item>
            <Tabs.Item title={t("INSTALLATION")}>
              <div className="mb-12">
                <div className="flex justify-between p-2">
                  <h1 className="text-left text-2xl font-bold mb-4"></h1>
                  <div>
                    {changeAll[14] ? (
                      <ToggleSwitch
                        label={t("DISABLED_ALL")}
                        checked={changeAll[14]}
                        onChange={() => {
                          onEnable(14, false);
                          handleActivateSubAll(
                            "bookings",
                            "installations",
                            [
                              "access_module",
                              "create",
                              "read_all",
                              "read_own",
                              "read_group",
                              "update_all",
                              "update_own",
                              "update_group",
                              "delete_all",
                              "delete_own",
                              "delete_group",
                            ],
                            false,
                          );
                        }}
                      />
                    ) : (
                      <h1></h1>
                    )}
                    {!changeAll[14] ? (
                      <ToggleSwitch
                        label={t("ENABLED_ALL")}
                        checked={changeAll[14]}
                        onChange={() => {
                          onEnable(14, true);
                          handleActivateSubAll(
                            "bookings",
                            "installations",
                            [
                              "access_module",
                              "create",
                              "read_all",
                              "read_own",
                              "read_group",
                              "update_all",
                              "update_own",
                              "update_group",
                              "delete_all",
                              "delete_own",
                              "delete_group",
                            ],
                            true,
                          );
                        }}
                      />
                    ) : (
                      <h1></h1>
                    )}
                  </div>
                </div>
                <Card>
                  <Table>
                    <Table.Head className="dark:text-white w-full">
                      <Table.HeadCell>{t("PERMISSION")}</Table.HeadCell>
                      <Table.HeadCell>{t("DESCRIPTION")}</Table.HeadCell>
                      <Table.HeadCell>{t("STATE")}</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                      <Table.Row>
                        <Table.Cell>
                          {permissions.bookings.installations.actions[0].label}
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.bookings.installations.actions[0]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.bookings.installations.access_module
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "bookings",
                                  "installations",
                                  "access_module",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.bookings.installations.actions[1].label}
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.bookings.installations.actions[1]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.bookings.installations.create}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "bookings",
                                  "installations",
                                  "create",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.bookings.installations.actions[2].label}
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.bookings.installations.actions[2]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.bookings.installations.read_all
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "bookings",
                                  "installations",
                                  "read_all",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.bookings.installations.actions[3].label}
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.bookings.installations.actions[3]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.bookings.installations.read_own
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "bookings",
                                  "installations",
                                  "read_own",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.bookings.installations.actions[4].label}
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.bookings.installations.actions[4]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.bookings.installations.read_group
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "bookings",
                                  "installations",
                                  "read_group",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.bookings.installations.actions[5].label}
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.bookings.installations.actions[5]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.bookings.installations.update_all
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "bookings",
                                  "installations",
                                  "update_all",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.bookings.installations.actions[6].label}
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.bookings.installations.actions[6]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.bookings.installations.update_own
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "bookings",
                                  "installations",
                                  "update_own",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.bookings.installations.actions[7].label}
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.bookings.installations.actions[7]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.bookings.installations.update_group
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "bookings",
                                  "installations",
                                  "update_group",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.bookings.installations.actions[8].label}
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.bookings.installations.actions[8]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.bookings.installations.delete_all
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "bookings",
                                  "installations",
                                  "delete_all",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.bookings.installations.actions[9].label}
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.bookings.installations.actions[9]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.bookings.installations.delete_own
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "bookings",
                                  "installations",
                                  "delete_own",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.bookings.installations.actions[10].label}
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.bookings.installations.actions[10]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.bookings.installations.delete_group
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "bookings",
                                  "installations",
                                  "delete_group",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </Card>
              </div>
            </Tabs.Item>
            <Tabs.Item title={t("COURTS")}>
              <div className="mb-12">
                <div className="flex justify-between p-2">
                  <h1 className="text-left text-2xl font-bold mb-4"></h1>
                  <div>
                    {changeAll[15] ? (
                      <ToggleSwitch
                        label={t("DISABLED_ALL")}
                        checked={changeAll[15]}
                        onChange={() => {
                          onEnable(15, false);
                          handleActivateSubAll(
                            "bookings",
                            "installation_items",
                            [
                              "access_module",
                              "create",
                              "read_all",
                              "read_own",
                              "read_group",
                              "update_all",
                              "update_own",
                              "update_group",
                              "delete_all",
                              "delete_own",
                              "delete_group",
                            ],
                            false,
                          );
                        }}
                      />
                    ) : (
                      <h1></h1>
                    )}
                    {!changeAll[15] ? (
                      <ToggleSwitch
                        label={t("ENABLED_ALL")}
                        checked={changeAll[15]}
                        onChange={() => {
                          onEnable(15, true);
                          handleActivateSubAll(
                            "bookings",
                            "installation_items",
                            [
                              "access_module",
                              "create",
                              "read_all",
                              "read_own",
                              "read_group",
                              "update_all",
                              "update_own",
                              "update_group",
                              "delete_all",
                              "delete_own",
                              "delete_group",
                            ],
                            true,
                          );
                        }}
                      />
                    ) : (
                      <h1></h1>
                    )}
                  </div>
                </div>
                <Card>
                  <Table>
                    <Table.Head className="dark:text-white w-full">
                      <Table.HeadCell>{t("PERMISSION")}</Table.HeadCell>
                      <Table.HeadCell>{t("DESCRIPTION")}</Table.HeadCell>
                      <Table.HeadCell>{t("STATE")}</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                      <Table.Row>
                        <Table.Cell>
                          {
                            permissions.bookings.installation_items.actions[0]
                              .label
                          }
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.bookings.installation_items.actions[0]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.bookings.installation_items
                                  .access_module
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "bookings",
                                  "installation_items",
                                  "access_module",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {
                            permissions.bookings.installation_items.actions[1]
                              .label
                          }
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.bookings.installation_items.actions[1]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.bookings.installation_items.create
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "bookings",
                                  "installation_items",
                                  "create",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {
                            permissions.bookings.installation_items.actions[2]
                              .label
                          }
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.bookings.installation_items.actions[2]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.bookings.installation_items.read_all
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "bookings",
                                  "installation_items",
                                  "read_all",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {
                            permissions.bookings.installation_items.actions[3]
                              .label
                          }
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.bookings.installation_items.actions[3]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.bookings.installation_items.read_own
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "bookings",
                                  "installation_items",
                                  "read_own",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {
                            permissions.bookings.installation_items.actions[4]
                              .label
                          }
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.bookings.installation_items.actions[4]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.bookings.installation_items
                                  .read_group
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "bookings",
                                  "installation_items",
                                  "read_group",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {
                            permissions.bookings.installation_items.actions[5]
                              .label
                          }
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.bookings.installation_items.actions[5]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.bookings.installation_items
                                  .update_all
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "bookings",
                                  "installation_items",
                                  "update_all",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {
                            permissions.bookings.installation_items.actions[6]
                              .label
                          }
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.bookings.installation_items.actions[6]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.bookings.installation_items
                                  .update_own
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "bookings",
                                  "installation_items",
                                  "update_own",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {
                            permissions.bookings.installation_items.actions[7]
                              .label
                          }
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.bookings.installation_items.actions[7]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.bookings.installation_items
                                  .update_group
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "bookings",
                                  "installation_items",
                                  "update_group",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {
                            permissions.bookings.installation_items.actions[8]
                              .label
                          }
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.bookings.installation_items.actions[8]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.bookings.installation_items
                                  .delete_all
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "bookings",
                                  "installation_items",
                                  "delete_all",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {
                            permissions.bookings.installation_items.actions[9]
                              .label
                          }
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.bookings.installation_items.actions[9]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.bookings.installation_items
                                  .delete_own
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "bookings",
                                  "installation_items",
                                  "delete_own",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {
                            permissions.bookings.installation_items.actions[10]
                              .label
                          }
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.bookings.installation_items.actions[10]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.bookings.installation_items
                                  .delete_group
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "bookings",
                                  "installation_items",
                                  "delete_group",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </Card>
              </div>
            </Tabs.Item>
            <Tabs.Item title={t("INSTALLATIONS_STATES")}>
              <div className="mb-12">
                <div className="flex justify-between p-2">
                  <h1 className="text-left text-2xl font-bold mb-4"></h1>
                  <div>
                    {changeAll[16] ? (
                      <ToggleSwitch
                        label={t("DISABLED_ALL")}
                        checked={changeAll[16]}
                        onChange={() => {
                          onEnable(16, false);
                          handleActivateSubAll(
                            "bookings",
                            "installation_state",
                            [
                              "access_module",
                              "create",
                              "update",
                              "read",
                              "delete",
                            ],
                            false,
                          );
                        }}
                      />
                    ) : (
                      <h1></h1>
                    )}
                    {!changeAll[16] ? (
                      <ToggleSwitch
                        label={t("ENABLED_ALL")}
                        checked={changeAll[16]}
                        onChange={() => {
                          onEnable(16, true);
                          handleActivateSubAll(
                            "bookings",
                            "installation_state",
                            [
                              "access_module",
                              "create",
                              "update",
                              "read",
                              "delete",
                            ],
                            true,
                          );
                        }}
                      />
                    ) : (
                      <h1></h1>
                    )}
                  </div>
                </div>
                <Card>
                  <Table>
                    <Table.Head className="dark:text-white w-full">
                      <Table.HeadCell>{t("PERMISSION")}</Table.HeadCell>
                      <Table.HeadCell>{t("DESCRIPTION")}</Table.HeadCell>
                      <Table.HeadCell>{t("STATE")}</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                      <Table.Row>
                        <Table.Cell>
                          {
                            permissions.bookings.installation_state.actions[0]
                              .label
                          }
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.bookings.installation_state.actions[0]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.bookings.installation_state
                                  .access_module
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "bookings",
                                  "installation_state",
                                  "access_module",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {
                            permissions.bookings.installation_state.actions[1]
                              .label
                          }
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.bookings.installation_state.actions[1]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.bookings.installation_state.create
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "bookings",
                                  "installation_state",
                                  "create",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {
                            permissions.bookings.installation_state.actions[2]
                              .label
                          }
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.bookings.installation_state.actions[2]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.bookings.installation_state.update
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "bookings",
                                  "installation_state",
                                  "update",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {
                            permissions.bookings.installation_state.actions[3]
                              .label
                          }
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.bookings.installation_state.actions[3]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.bookings.installation_state.read
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "bookings",
                                  "installation_state",
                                  "read",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {
                            permissions.bookings.installation_state.actions[4]
                              .label
                          }
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.bookings.installation_state.actions[4]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.bookings.installation_state.delete
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "bookings",
                                  "installation_state",
                                  "delete",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </Card>
              </div>
            </Tabs.Item>
          </Tabs.Group>
        </>
      ) : panel === "inscriptions" ? (
        <>
          <Tabs.Group key={panel}>
            <Tabs.Item title={t("INSCRIPTIONS")}>
              <div className="mb-12">
                <div className="flex justify-between p-2">
                  <h1 className="text-left text-2xl font-bold mb-4"></h1>
                  <div>
                    {changeAll[17] ? (
                      <ToggleSwitch
                        label={t("DISABLED_ALL")}
                        checked={changeAll[17]}
                        onChange={() => {
                          onEnable(17, false);
                          handleActivateSubAll(
                            "inscriptions",
                            "inscriptions",
                            [
                              "access_module",
                              "create",
                              "read_all",
                              "read_own",
                              "read_group",
                              "update_all",
                              "update_own",
                              "update_group",
                              "delete_all",
                              "delete_own",
                              "delete_group",
                            ],
                            false,
                          );
                        }}
                      />
                    ) : (
                      <h1></h1>
                    )}
                    {!changeAll[17] ? (
                      <ToggleSwitch
                        label={t("ENABLED_ALL")}
                        checked={changeAll[17]}
                        onChange={() => {
                          onEnable(17, true);
                          handleActivateSubAll(
                            "inscriptions",
                            "inscriptions",
                            [
                              "access_module",
                              "create",
                              "read_all",
                              "read_own",
                              "read_group",
                              "update_all",
                              "update_own",
                              "update_group",
                              "delete_all",
                              "delete_own",
                              "delete_group",
                            ],
                            true,
                          );
                        }}
                      />
                    ) : (
                      <h1></h1>
                    )}
                  </div>
                </div>
                <Card>
                  <Table>
                    <Table.Head className="dark:text-white w-full">
                      <Table.HeadCell>{t("PERMISSION")}</Table.HeadCell>
                      <Table.HeadCell>{t("DESCRIPTION")}</Table.HeadCell>
                      <Table.HeadCell>{t("STATE")}</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                      <Table.Row>
                        <Table.Cell>
                          {
                            permissions.inscriptions.inscriptions.actions[0]
                              .label
                          }
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.inscriptions.inscriptions.actions[0]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.inscriptions.inscriptions
                                  .access_module
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "inscriptions",
                                  "inscriptions",
                                  "access_module",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {
                            permissions.inscriptions.inscriptions.actions[1]
                              .label
                          }
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.inscriptions.inscriptions.actions[1]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.inscriptions.inscriptions.create
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "inscriptions",
                                  "inscriptions",
                                  "create",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {
                            permissions.inscriptions.inscriptions.actions[2]
                              .label
                          }
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.inscriptions.inscriptions.actions[2]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.inscriptions.inscriptions.read_all
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "inscriptions",
                                  "inscriptions",
                                  "read_all",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {
                            permissions.inscriptions.inscriptions.actions[3]
                              .label
                          }
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.inscriptions.inscriptions.actions[3]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.inscriptions.inscriptions.read_own
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "inscriptions",
                                  "inscriptions",
                                  "read_own",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {
                            permissions.inscriptions.inscriptions.actions[4]
                              .label
                          }
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.inscriptions.inscriptions.actions[4]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.inscriptions.inscriptions.read_group
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "inscriptions",
                                  "inscriptions",
                                  "read_group",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {
                            permissions.inscriptions.inscriptions.actions[5]
                              .label
                          }
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.inscriptions.inscriptions.actions[5]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.inscriptions.inscriptions.update_all
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "inscriptions",
                                  "inscriptions",
                                  "update_all",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {
                            permissions.inscriptions.inscriptions.actions[6]
                              .label
                          }
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.inscriptions.inscriptions.actions[6]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.inscriptions.inscriptions.update_own
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "inscriptions",
                                  "inscriptions",
                                  "update_own",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {
                            permissions.inscriptions.inscriptions.actions[7]
                              .label
                          }
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.inscriptions.inscriptions.actions[7]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.inscriptions.inscriptions
                                  .update_group
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "inscriptions",
                                  "inscriptions",
                                  "update_group",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {
                            permissions.inscriptions.inscriptions.actions[8]
                              .label
                          }
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.inscriptions.inscriptions.actions[8]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.inscriptions.inscriptions.delete_all
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "inscriptions",
                                  "inscriptions",
                                  "delete_all",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {
                            permissions.inscriptions.inscriptions.actions[9]
                              .label
                          }
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.inscriptions.inscriptions.actions[9]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.inscriptions.inscriptions.delete_own
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "inscriptions",
                                  "inscriptions",
                                  "delete_own",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {
                            permissions.inscriptions.inscriptions.actions[10]
                              .label
                          }
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.inscriptions.inscriptions.actions[10]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.inscriptions.inscriptions
                                  .delete_group
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "inscriptions",
                                  "inscriptions",
                                  "delete_group",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </Card>
              </div>
            </Tabs.Item>
            <Tabs.Item title={t("REGISTRES")}>
              <div className="mb-12">
                <div className="flex justify-between p-2">
                  <h1 className="text-left text-2xl font-bold mb-4"></h1>
                  <div>
                    {changeAll[18] ? (
                      <ToggleSwitch
                        label={t("DISABLED_ALL")}
                        checked={changeAll[18]}
                        onChange={() => {
                          onEnable(18, false);
                          handleActivateSubAll(
                            "inscriptions",
                            "records",
                            [
                              "access_module",
                              "create",
                              "read",
                              "update",
                              "delete",
                            ],
                            false,
                          );
                        }}
                      />
                    ) : (
                      <h1></h1>
                    )}
                    {!changeAll[18] ? (
                      <ToggleSwitch
                        label={t("ENABLED_ALL")}
                        checked={changeAll[18]}
                        onChange={() => {
                          onEnable(18, true);
                          handleActivateSubAll(
                            "inscriptions",
                            "records",
                            [
                              "access_module",
                              "create",
                              "read",
                              "update",
                              "delete",
                            ],
                            true,
                          );
                        }}
                      />
                    ) : (
                      <h1></h1>
                    )}
                  </div>
                </div>
                <Card>
                  <Table>
                    <Table.Head className="dark:text-white w-full">
                      <Table.HeadCell>{t("PERMISSION")}</Table.HeadCell>
                      <Table.HeadCell>{t("DESCRIPTION")}</Table.HeadCell>
                      <Table.HeadCell>{t("STATE")}</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                      <Table.Row>
                        <Table.Cell>
                          {permissions.inscriptions.records.actions[0].label}
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.inscriptions.records.actions[0]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.inscriptions.records.access_module
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "inscriptions",
                                  "records",
                                  "access_module",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.inscriptions.records.actions[1].label}
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.inscriptions.records.actions[1]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.inscriptions.records.create}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "inscriptions",
                                  "records",
                                  "create",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.inscriptions.records.actions[2].label}
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.inscriptions.records.actions[2]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.inscriptions.records.read}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "inscriptions",
                                  "records",
                                  "read",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.inscriptions.records.actions[3].label}
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.inscriptions.records.actions[3]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.inscriptions.records.update}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "inscriptions",
                                  "records",
                                  "update",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.inscriptions.records.actions[4].label}
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.inscriptions.records.actions[4]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.inscriptions.records.delete}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "inscriptions",
                                  "records",
                                  "delete",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </Card>
              </div>
            </Tabs.Item>
          </Tabs.Group>
        </>
      ) : panel === "tasks" ? (
        <>
          <Tabs.Group key={panel}>
            <Tabs.Item title={t("TASKS")}>
              <div className="mb-12">
                <div className="flex justify-between p-2">
                  <h1 className="text-left text-2xl font-bold mb-4"></h1>
                  <div>
                    {changeAll[19] ? (
                      <ToggleSwitch
                        label={t("DISABLED_ALL")}
                        checked={changeAll[19]}
                        onChange={() => {
                          onEnable(19, false);
                          handleActivateSubAll(
                            "tasks",
                            "tasks",
                            [
                              "access_module",
                              "create",
                              "read",
                              "update",
                              "delete",
                            ],
                            false,
                          );
                        }}
                      />
                    ) : (
                      <h1></h1>
                    )}
                    {!changeAll[19] ? (
                      <ToggleSwitch
                        label={t("ENABLED_ALL")}
                        checked={changeAll[19]}
                        onChange={() => {
                          onEnable(19, true);
                          handleActivateSubAll(
                            "tasks",
                            "tasks",
                            [
                              "access_module",
                              "create",
                              "read",
                              "update",
                              "delete",
                            ],
                            true,
                          );
                        }}
                      />
                    ) : (
                      <h1></h1>
                    )}
                  </div>
                </div>
                <Card>
                  <Table>
                    <Table.Head className="dark:text-white w-full">
                      <Table.HeadCell>{t("PERMISSION")}</Table.HeadCell>
                      <Table.HeadCell>{t("DESCRIPTION")}</Table.HeadCell>
                      <Table.HeadCell>{t("STATE")}</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                      <Table.Row>
                        <Table.Cell>
                          {permissions.tasks.tasks.actions[0].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.tasks.tasks.actions[0].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.tasks.tasks.access_module}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "tasks",
                                  "tasks",
                                  "access_module",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.tasks.tasks.actions[1].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.tasks.tasks.actions[1].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.tasks.tasks.create}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "tasks",
                                  "tasks",
                                  "create",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.tasks.tasks.actions[2].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.tasks.tasks.actions[2].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.tasks.tasks.read}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "tasks",
                                  "tasks",
                                  "read",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.tasks.tasks.actions[3].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.tasks.tasks.actions[3].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.tasks.tasks.update}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "tasks",
                                  "tasks",
                                  "update",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.tasks.tasks.actions[4].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.tasks.tasks.actions[4].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.tasks.tasks.delete}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "tasks",
                                  "tasks",
                                  "delete",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </Card>
              </div>
            </Tabs.Item>
            <Tabs.Item title={t("PROJECTS")}>
              <div className="mb-12">
                <div className="flex justify-between p-2">
                  <h1 className="text-left text-2xl font-bold mb-4"></h1>
                  <div>
                    {changeAll[20] ? (
                      <ToggleSwitch
                        label={t("DISABLED_ALL")}
                        checked={changeAll[20]}
                        onChange={() => {
                          onEnable(20, false);
                          handleActivateSubAll(
                            "tasks",
                            "projects",
                            [
                              "access_module",
                              "create",
                              "read_all",
                              "read_own",
                              "read_group",
                              "update_all",
                              "update_own",
                              "update_group",
                              "delete_all",
                              "delete_own",
                              "delete_group",
                            ],
                            false,
                          );
                        }}
                      />
                    ) : (
                      <h1></h1>
                    )}
                    {!changeAll[20] ? (
                      <ToggleSwitch
                        label={t("ENABLED_ALL")}
                        checked={changeAll[20]}
                        onChange={() => {
                          onEnable(20, true);
                          handleActivateSubAll(
                            "tasks",
                            "projects",
                            [
                              "access_module",
                              "create",
                              "read_all",
                              "read_own",
                              "read_group",
                              "update_all",
                              "update_own",
                              "update_group",
                              "delete_all",
                              "delete_own",
                              "delete_group",
                            ],
                            true,
                          );
                        }}
                      />
                    ) : (
                      <h1></h1>
                    )}
                  </div>
                </div>
                <Card>
                  <Table>
                    <Table.Head className="dark:text-white w-full">
                      <Table.HeadCell>{t("PERMISSION")}</Table.HeadCell>
                      <Table.HeadCell>{t("DESCRIPTION")}</Table.HeadCell>
                      <Table.HeadCell>{t("STATE")}</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                      <Table.Row>
                        <Table.Cell>
                          {permissions.tasks.projects.actions[0].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.tasks.projects.actions[0].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.tasks.projects.access_module}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "tasks",
                                  "projects",
                                  "access_module",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.tasks.projects.actions[1].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.tasks.projects.actions[1].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.tasks.projects.create}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "tasks",
                                  "projects",
                                  "create",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.tasks.projects.actions[2].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.tasks.projects.actions[2].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.tasks.projects.read_all}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "tasks",
                                  "projects",
                                  "read_all",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.tasks.projects.actions[3].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.tasks.projects.actions[3].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.tasks.projects.read_own}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "tasks",
                                  "projects",
                                  "read_own",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.tasks.projects.actions[4].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.tasks.projects.actions[4].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.tasks.projects.read_group}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "tasks",
                                  "projects",
                                  "read_group",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.tasks.projects.actions[5].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.tasks.projects.actions[5].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.tasks.projects.update_all}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "tasks",
                                  "projects",
                                  "update_all",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.tasks.projects.actions[6].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.tasks.projects.actions[6].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.tasks.projects.update_own}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "tasks",
                                  "projects",
                                  "update_own",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.tasks.projects.actions[7].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.tasks.projects.actions[7].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.tasks.projects.update_group}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "tasks",
                                  "projects",
                                  "update_group",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.tasks.projects.actions[8].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.tasks.projects.actions[8].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.tasks.projects.delete_all}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "tasks",
                                  "projects",
                                  "delete_all",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.tasks.projects.actions[9].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.tasks.projects.actions[9].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.tasks.projects.delete_own}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "tasks",
                                  "projects",
                                  "delete_own",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.tasks.projects.actions[10].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.tasks.projects.actions[10].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.tasks.projects.delete_group}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "tasks",
                                  "projects",
                                  "delete_group",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </Card>
              </div>
            </Tabs.Item>
          </Tabs.Group>
        </>
      ) : panel === "payments" ? (
        <>
          <Tabs.Group key={panel}>
            <Tabs.Item title={t("COUPONS")}>
              <div className="mb-12">
                <div className="flex justify-between p-2">
                  <h1 className="text-left text-2xl font-bold mb-4"></h1>
                  <div>
                    {changeAll[21] ? (
                      <ToggleSwitch
                        label={t("DISABLED_ALL")}
                        checked={changeAll[21]}
                        onChange={() => {
                          onEnable(21, false);
                          handleActivateSubAll(
                            "payments",
                            "coupons",
                            [
                              "access_module",
                              "create",
                              "read_all",
                              "read_own",
                              "read_group",
                              "update_all",
                              "update_own",
                              "update_group",
                              "delete_all",
                              "delete_own",
                              "delete_group",
                            ],
                            false,
                          );
                        }}
                      />
                    ) : (
                      <h1></h1>
                    )}
                    {!changeAll[21] ? (
                      <ToggleSwitch
                        label={t("ENABLED_ALL")}
                        checked={changeAll[21]}
                        onChange={() => {
                          onEnable(21, true);
                          handleActivateSubAll(
                            "payments",
                            "coupons",
                            [
                              "access_module",
                              "create",
                              "read_all",
                              "read_own",
                              "read_group",
                              "update_all",
                              "update_own",
                              "update_group",
                              "delete_all",
                              "delete_own",
                              "delete_group",
                            ],
                            true,
                          );
                        }}
                      />
                    ) : (
                      <h1></h1>
                    )}
                  </div>
                </div>
                <Card>
                  <Table>
                    <Table.Head className="dark:text-white w-full">
                      <Table.HeadCell>{t("PERMISSION")}</Table.HeadCell>
                      <Table.HeadCell>{t("DESCRIPTION")}</Table.HeadCell>
                      <Table.HeadCell>{t("STATE")}</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                      <Table.Row>
                        <Table.Cell>
                          {permissions.payments.coupons.actions[0].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.payments.coupons.actions[0].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.payments.coupons.access_module
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "payments",
                                  "coupons",
                                  "access_module",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.payments.coupons.actions[1].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.payments.coupons.actions[1].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.payments.coupons.create}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "payments",
                                  "coupons",
                                  "create",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.payments.coupons.actions[2].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.payments.coupons.actions[2].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.payments.coupons.read_all}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "payments",
                                  "coupons",
                                  "read_all",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.payments.coupons.actions[3].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.payments.coupons.actions[3].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.payments.coupons.read_own}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "payments",
                                  "coupons",
                                  "read_own",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.payments.coupons.actions[4].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.payments.coupons.actions[4].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.payments.coupons.read_group}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "payments",
                                  "coupons",
                                  "read_group",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.payments.coupons.actions[5].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.payments.coupons.actions[5].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.payments.coupons.update_all}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "payments",
                                  "coupons",
                                  "update_all",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.payments.coupons.actions[6].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.payments.coupons.actions[6].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.payments.coupons.update_own}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "payments",
                                  "coupons",
                                  "update_own",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.payments.coupons.actions[7].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.payments.coupons.actions[7].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.payments.coupons.update_group}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "payments",
                                  "coupons",
                                  "update_group",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.payments.coupons.actions[8].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.payments.coupons.actions[8].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.payments.coupons.delete_all}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "payments",
                                  "coupons",
                                  "delete_all",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.payments.coupons.actions[9].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.payments.coupons.actions[9].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.payments.coupons.delete_own}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "payments",
                                  "coupons",
                                  "delete_own",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.payments.coupons.actions[10].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.payments.coupons.actions[10].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.payments.coupons.delete_group}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "payments",
                                  "coupons",
                                  "delete_group",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </Card>
              </div>
            </Tabs.Item>
            <Tabs.Item title={t("MANDATES")}>
              <div className="mb-12">
                <div className="flex justify-between p-2">
                  <h1 className="text-left text-2xl font-bold mb-4"></h1>
                  <div>
                    {changeAll[22] ? (
                      <ToggleSwitch
                        label={t("DISABLED_ALL")}
                        checked={changeAll[22]}
                        onChange={() => {
                          onEnable(22, false);
                          handleActivateSubAll(
                            "payments",
                            "mandates",
                            [
                              "access_module",
                              "create",
                              "update",
                              "read",
                              "delete",
                            ],
                            false,
                          );
                        }}
                      />
                    ) : (
                      <h1></h1>
                    )}
                    {!changeAll[22] ? (
                      <ToggleSwitch
                        label={t("ENABLED_ALL")}
                        checked={changeAll[22]}
                        onChange={() => {
                          onEnable(22, true);
                          handleActivateSubAll(
                            "payments",
                            "mandates",
                            [
                              "access_module",
                              "create",
                              "update",
                              "read",
                              "delete",
                            ],
                            true,
                          );
                        }}
                      />
                    ) : (
                      <h1></h1>
                    )}
                  </div>
                </div>
                <Card>
                  <Table>
                    <Table.Head className="dark:text-white w-full">
                      <Table.HeadCell>{t("PERMISSION")}</Table.HeadCell>
                      <Table.HeadCell>{t("DESCRIPTION")}</Table.HeadCell>
                      <Table.HeadCell>{t("STATE")}</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                      <Table.Row>
                        <Table.Cell>
                          {permissions.payments.mandates.actions[0].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.payments.mandates.actions[0].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.payments.mandates.access_module
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "payments",
                                  "mandates",
                                  "access_module",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.payments.mandates.actions[1].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.payments.mandates.actions[1].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.payments.mandates.create}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "payments",
                                  "mandates",
                                  "create",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.payments.mandates.actions[2].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.payments.mandates.actions[2].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.payments.mandates.update}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "payments",
                                  "mandates",
                                  "update",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.payments.mandates.actions[3].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.payments.mandates.actions[3].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.payments.mandates.read}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "payments",
                                  "mandates",
                                  "read",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.payments.mandates.actions[4].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.payments.mandates.actions[4].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.payments.mandates.delete}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "payments",
                                  "mandates",
                                  "delete",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </Card>
              </div>
            </Tabs.Item>
            <Tabs.Item title={t("PAYMENTS")}>
              <div className="mb-12">
                <div className="flex justify-between p-2">
                  <h1 className="text-left text-2xl font-bold mb-4"></h1>
                  <div>
                    {changeAll[23] ? (
                      <ToggleSwitch
                        label={t("DISABLED_ALL")}
                        checked={changeAll[23]}
                        onChange={() => {
                          onEnable(23, false);
                          handleActivateSubAll(
                            "payments",
                            "payments",
                            [
                              "access_module",
                              "create",
                              "read",
                              "update",
                              "delete",
                            ],
                            false,
                          );
                        }}
                      />
                    ) : (
                      <h1></h1>
                    )}
                    {!changeAll[23] ? (
                      <ToggleSwitch
                        label={t("ENABLED_ALL")}
                        checked={changeAll[23]}
                        onChange={() => {
                          onEnable(23, true);
                          handleActivateSubAll(
                            "payments",
                            "payments",
                            [
                              "access_module",
                              "create",
                              "read",
                              "update",
                              "delete",
                            ],
                            true,
                          );
                        }}
                      />
                    ) : (
                      <h1></h1>
                    )}
                  </div>
                </div>
                <Card>
                  <Table>
                    <Table.Head className="dark:text-white w-full">
                      <Table.HeadCell>{t("PERMISSION")}</Table.HeadCell>
                      <Table.HeadCell>{t("DESCRIPTION")}</Table.HeadCell>
                      <Table.HeadCell>{t("STATE")}</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                      <Table.Row>
                        <Table.Cell>
                          {permissions.payments.payments.actions[0].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.payments.payments.actions[0].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.payments.payments.access_module
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "payments",
                                  "payments",
                                  "access_module",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.payments.payments.actions[1].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.payments.payments.actions[1].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.payments.payments.create}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "payments",
                                  "payments",
                                  "create",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.payments.payments.actions[2].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.payments.payments.actions[2].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.payments.payments.read}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "payments",
                                  "payments",
                                  "read",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.payments.payments.actions[3].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.payments.payments.actions[3].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.payments.payments.update}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "payments",
                                  "payments",
                                  "update",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.payments.payments.actions[4].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.payments.payments.actions[4].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.payments.payments.delete}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "payments",
                                  "payments",
                                  "delete",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </Card>
              </div>
            </Tabs.Item>
            <Tabs.Item title={t("PAYMENTS_METHODS")}>
              <div className="mb-12">
                <div className="flex justify-between p-2">
                  <h1 className="text-left text-2xl font-bold mb-4"></h1>
                  <div>
                    {changeAll[24] ? (
                      <ToggleSwitch
                        label={t("DISABLED_ALL")}
                        checked={changeAll[24]}
                        onChange={() => {
                          onEnable(24, false);
                          handleActivateSubAll(
                            "payments",
                            "method_payments",
                            [
                              "access_module",
                              "create",
                              "read_all",
                              "read_own",
                              "read_group",
                              "update_all",
                              "update_own",
                              "update_group",
                              "delete_all",
                              "delete_own",
                              "delete_group",
                            ],
                            false,
                          );
                        }}
                      />
                    ) : (
                      <h1></h1>
                    )}
                    {!changeAll[24] ? (
                      <ToggleSwitch
                        label={t("ENABLED_ALL")}
                        checked={changeAll[24]}
                        onChange={() => {
                          onEnable(24, true);
                          handleActivateSubAll(
                            "payments",
                            "method_payments",
                            [
                              "access_module",
                              "create",
                              "read_all",
                              "read_own",
                              "read_group",
                              "update_all",
                              "update_own",
                              "update_group",
                              "delete_all",
                              "delete_own",
                              "delete_group",
                            ],
                            true,
                          );
                        }}
                      />
                    ) : (
                      <h1></h1>
                    )}
                  </div>
                </div>
                <Card>
                  <Table>
                    <Table.Head className="dark:text-white w-full">
                      <Table.HeadCell>{t("PERMISSION")}</Table.HeadCell>
                      <Table.HeadCell>{t("DESCRIPTION")}</Table.HeadCell>
                      <Table.HeadCell>{t("STATE")}</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                      <Table.Row>
                        <Table.Cell>
                          {
                            permissions.payments.method_payments.actions[0]
                              .label
                          }
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.payments.method_payments.actions[0]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.payments.method_payments
                                  .access_module
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "payments",
                                  "method_payments",
                                  "access_module",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {
                            permissions.payments.method_payments.actions[1]
                              .label
                          }
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.payments.method_payments.actions[1]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.payments.method_payments.create
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "payments",
                                  "method_payments",
                                  "create",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {
                            permissions.payments.method_payments.actions[2]
                              .label
                          }
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.payments.method_payments.actions[2]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.payments.method_payments.read_all
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "payments",
                                  "method_payments",
                                  "read_all",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {
                            permissions.payments.method_payments.actions[3]
                              .label
                          }
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.payments.method_payments.actions[3]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.payments.method_payments.read_own
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "payments",
                                  "method_payments",
                                  "read_own",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {
                            permissions.payments.method_payments.actions[4]
                              .label
                          }
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.payments.method_payments.actions[4]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.payments.method_payments.read_group
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "payments",
                                  "method_payments",
                                  "read_group",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {
                            permissions.payments.method_payments.actions[5]
                              .label
                          }
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.payments.method_payments.actions[5]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.payments.method_payments.update_all
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "payments",
                                  "method_payments",
                                  "update_all",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {
                            permissions.payments.method_payments.actions[6]
                              .label
                          }
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.payments.method_payments.actions[6]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.payments.method_payments.update_own
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "payments",
                                  "method_payments",
                                  "update_own",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {
                            permissions.payments.method_payments.actions[7]
                              .label
                          }
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.payments.method_payments.actions[7]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.payments.method_payments.update_group
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "payments",
                                  "method_payments",
                                  "update_group",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {
                            permissions.payments.method_payments.actions[8]
                              .label
                          }
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.payments.method_payments.actions[8]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.payments.method_payments.delete_all
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "payments",
                                  "method_payments",
                                  "delete_all",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {
                            permissions.payments.method_payments.actions[9]
                              .label
                          }
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.payments.method_payments.actions[9]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.payments.method_payments.delete_own
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "payments",
                                  "method_payments",
                                  "delete_own",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {
                            permissions.payments.method_payments.actions[10]
                              .label
                          }
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.payments.method_payments.actions[10]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.payments.method_payments.delete_group
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "payments",
                                  "method_payments",
                                  "delete_group",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </Card>
              </div>
            </Tabs.Item>
            <Tabs.Item title={t("PAYMENTS_ACCOUNTS")}>
              <div className="mb-12">
                <div className="flex justify-between p-2">
                  <h1 className="text-left text-2xl font-bold mb-4"></h1>
                  <div>
                    {changeAll[25] ? (
                      <ToggleSwitch
                        label={t("DISABLED_ALL")}
                        checked={changeAll[25]}
                        onChange={() => {
                          onEnable(25, false);
                          handleActivateSubAll(
                            "payments",
                            "payments_accounts",
                            [
                              "access_module",
                              "create",
                              "read_all",
                              "read_own",
                              "read_group",
                              "update_all",
                              "update_own",
                              "update_group",
                              "delete_all",
                              "delete_own",
                              "delete_group",
                            ],
                            false,
                          );
                        }}
                      />
                    ) : (
                      <h1></h1>
                    )}
                    {!changeAll[25] ? (
                      <ToggleSwitch
                        label={t("ENABLED_ALL")}
                        checked={changeAll[25]}
                        onChange={() => {
                          onEnable(25, true);
                          handleActivateSubAll(
                            "payments",
                            "payments_accounts",
                            [
                              "access_module",
                              "create",
                              "read_all",
                              "read_own",
                              "read_group",
                              "update_all",
                              "update_own",
                              "update_group",
                              "delete_all",
                              "delete_own",
                              "delete_group",
                            ],
                            true,
                          );
                        }}
                      />
                    ) : (
                      <h1></h1>
                    )}
                  </div>
                </div>
                <Card>
                  <Table>
                    <Table.Head className="dark:text-white w-full">
                      <Table.HeadCell>{t("PERMISSION")}</Table.HeadCell>
                      <Table.HeadCell>{t("DESCRIPTION")}</Table.HeadCell>
                      <Table.HeadCell>{t("STATE")}</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                      <Table.Row>
                        <Table.Cell>
                          {
                            permissions.payments.payments_accounts.actions[0]
                              .label
                          }
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.payments.payments_accounts.actions[0]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.payments.payments_accounts
                                  .access_module
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "payments",
                                  "payments_accounts",
                                  "access_module",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {
                            permissions.payments.payments_accounts.actions[1]
                              .label
                          }
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.payments.payments_accounts.actions[1]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.payments.payments_accounts.create
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "payments",
                                  "payments_accounts",
                                  "create",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {
                            permissions.payments.payments_accounts.actions[2]
                              .label
                          }
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.payments.payments_accounts.actions[2]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.payments.payments_accounts.read_all
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "payments",
                                  "payments_accounts",
                                  "read_all",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {
                            permissions.payments.payments_accounts.actions[3]
                              .label
                          }
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.payments.payments_accounts.actions[3]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.payments.payments_accounts.read_own
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "payments",
                                  "payments_accounts",
                                  "read_own",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {
                            permissions.payments.payments_accounts.actions[4]
                              .label
                          }
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.payments.payments_accounts.actions[4]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.payments.payments_accounts.read_group
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "payments",
                                  "payments_accounts",
                                  "read_group",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {
                            permissions.payments.payments_accounts.actions[5]
                              .label
                          }
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.payments.payments_accounts.actions[5]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.payments.payments_accounts.update_all
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "payments",
                                  "payments_accounts",
                                  "update_all",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {
                            permissions.payments.payments_accounts.actions[6]
                              .label
                          }
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.payments.payments_accounts.actions[6]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.payments.payments_accounts.update_own
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "payments",
                                  "payments_accounts",
                                  "update_own",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {
                            permissions.payments.payments_accounts.actions[7]
                              .label
                          }
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.payments.payments_accounts.actions[7]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.payments.payments_accounts
                                  .update_group
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "payments",
                                  "payments_accounts",
                                  "update_group",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {
                            permissions.payments.payments_accounts.actions[8]
                              .label
                          }
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.payments.payments_accounts.actions[8]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.payments.payments_accounts.delete_all
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "payments",
                                  "payments_accounts",
                                  "delete_all",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {
                            permissions.payments.payments_accounts.actions[9]
                              .label
                          }
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.payments.payments_accounts.actions[9]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.payments.payments_accounts.delete_own
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "payments",
                                  "payments_accounts",
                                  "delete_own",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {
                            permissions.payments.payments_accounts.actions[10]
                              .label
                          }
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.payments.payments_accounts.actions[10]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.payments.payments_accounts
                                  .delete_group
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "payments",
                                  "payments_accounts",
                                  "delete_group",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </Card>
              </div>
            </Tabs.Item>
          </Tabs.Group>
        </>
      ) : panel === "tickets" ? (
        <>
          <Tabs.Group key={panel}>
            <Tabs.Item title={t("EVENTS")}>
              <div className="mb-12">
                <div className="flex justify-between p-2">
                  <h1 className="text-left text-2xl font-bold mb-4"></h1>
                  <div>
                    {changeAll[26] ? (
                      <ToggleSwitch
                        label={t("DISABLED_ALL")}
                        checked={changeAll[26]}
                        onChange={() => {
                          onEnable(26, false);
                          handleActivateSubAll(
                            "tickets",
                            "events",
                            [
                              "access_module",
                              "create",
                              "read_all",
                              "read_own",
                              "read_group",
                              "update_all",
                              "update_own",
                              "update_group",
                              "delete_all",
                              "delete_own",
                              "delete_group",
                            ],
                            false,
                          );
                        }}
                      />
                    ) : (
                      <h1></h1>
                    )}
                    {!changeAll[26] ? (
                      <ToggleSwitch
                        label={t("ENABLED_ALL")}
                        checked={changeAll[26]}
                        onChange={() => {
                          onEnable(26, true);
                          handleActivateSubAll(
                            "tickets",
                            "events",
                            [
                              "access_module",
                              "create",
                              "read_all",
                              "read_own",
                              "read_group",
                              "update_all",
                              "update_own",
                              "update_group",
                              "delete_all",
                              "delete_own",
                              "delete_group",
                            ],
                            true,
                          );
                        }}
                      />
                    ) : (
                      <h1></h1>
                    )}
                  </div>
                </div>
                <Card>
                  <Table>
                    <Table.Head className="dark:text-white w-full">
                      <Table.HeadCell>{t("PERMISSION")}</Table.HeadCell>
                      <Table.HeadCell>{t("DESCRIPTION")}</Table.HeadCell>
                      <Table.HeadCell>{t("STATE")}</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                      <Table.Row>
                        <Table.Cell>
                          {permissions.tickets.events.actions[0].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.tickets.events.actions[0].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.tickets.events.access_module}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "tickets",
                                  "events",
                                  "access_module",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.tickets.events.actions[1].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.tickets.events.actions[1].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.tickets.events.create}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "tickets",
                                  "events",
                                  "create",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.tickets.events.actions[2].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.tickets.events.actions[2].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.tickets.events.read_all}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "tickets",
                                  "events",
                                  "read_all",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.tickets.events.actions[3].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.tickets.events.actions[3].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.tickets.events.read_own}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "tickets",
                                  "events",
                                  "read_own",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.tickets.events.actions[4].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.tickets.events.actions[4].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.tickets.events.read_group}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "tickets",
                                  "events",
                                  "read_group",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.tickets.events.actions[5].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.tickets.events.actions[5].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.tickets.events.update_all}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "tickets",
                                  "events",
                                  "update_all",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.tickets.events.actions[6].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.tickets.events.actions[6].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.tickets.events.update_own}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "tickets",
                                  "events",
                                  "update_own",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.tickets.events.actions[7].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.tickets.events.actions[7].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.tickets.events.update_group}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "tickets",
                                  "events",
                                  "update_group",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.tickets.events.actions[8].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.tickets.events.actions[8].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.tickets.events.delete_all}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "tickets",
                                  "events",
                                  "delete_all",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.tickets.events.actions[9].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.tickets.events.actions[9].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.tickets.events.delete_own}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "tickets",
                                  "events",
                                  "delete_own",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.tickets.events.actions[10].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.tickets.events.actions[10].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.tickets.events.delete_group}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "tickets",
                                  "events",
                                  "delete_group",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </Card>
              </div>
            </Tabs.Item>
            <Tabs.Item title={t("TICKETS")}>
              <div className="mb-12">
                <div className="flex justify-between p-2">
                  <h1 className="text-left text-2xl font-bold mb-4"></h1>
                  <div>
                    {changeAll[27] ? (
                      <ToggleSwitch
                        label={t("DISABLED_ALL")}
                        checked={changeAll[27]}
                        onChange={() => {
                          onEnable(27, false);
                          handleActivateSubAll(
                            "tickets",
                            "tickets",
                            [
                              "access_module",
                              "create",
                              "read_all",
                              "read_own",
                              "read_group",
                              "update_all",
                              "update_own",
                              "update_group",
                              "delete_all",
                              "delete_own",
                              "delete_group",
                            ],
                            false,
                          );
                        }}
                      />
                    ) : (
                      <h1></h1>
                    )}
                    {!changeAll[27] ? (
                      <ToggleSwitch
                        label={t("ENABLED_ALL")}
                        checked={changeAll[27]}
                        onChange={() => {
                          onEnable(27, true);
                          handleActivateSubAll(
                            "tickets",
                            "tickets",
                            [
                              "access_module",
                              "create",
                              "read_all",
                              "read_own",
                              "read_group",
                              "update_all",
                              "update_own",
                              "update_group",
                              "delete_all",
                              "delete_own",
                              "delete_group",
                            ],
                            true,
                          );
                        }}
                      />
                    ) : (
                      <h1></h1>
                    )}
                  </div>
                </div>
                <Card>
                  <Table>
                    <Table.Head className="dark:text-white w-full">
                      <Table.HeadCell>{t("PERMISSION")}</Table.HeadCell>
                      <Table.HeadCell>{t("DESCRIPTION")}</Table.HeadCell>
                      <Table.HeadCell>{t("STATE")}</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                      <Table.Row>
                        <Table.Cell>
                          {permissions.tickets.tickets.actions[0].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.tickets.tickets.actions[0].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.tickets.tickets.access_module}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "tickets",
                                  "tickets",
                                  "access_module",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.tickets.tickets.actions[1].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.tickets.tickets.actions[1].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.tickets.tickets.create}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "tickets",
                                  "tickets",
                                  "create",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.tickets.tickets.actions[2].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.tickets.tickets.actions[2].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.tickets.tickets.read_all}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "tickets",
                                  "tickets",
                                  "read_all",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.tickets.tickets.actions[3].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.tickets.tickets.actions[3].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.tickets.tickets.read_own}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "tickets",
                                  "tickets",
                                  "read_own",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.tickets.tickets.actions[4].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.tickets.tickets.actions[4].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.tickets.tickets.read_group}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "tickets",
                                  "tickets",
                                  "read_group",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.tickets.tickets.actions[5].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.tickets.tickets.actions[5].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.tickets.tickets.update_all}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "tickets",
                                  "tickets",
                                  "update_all",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.tickets.tickets.actions[6].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.tickets.tickets.actions[6].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.tickets.tickets.update_own}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "tickets",
                                  "tickets",
                                  "update_own",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.tickets.tickets.actions[7].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.tickets.tickets.actions[7].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.tickets.tickets.update_group}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "tickets",
                                  "tickets",
                                  "update_group",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.tickets.tickets.actions[8].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.tickets.tickets.actions[8].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.tickets.tickets.delete_all}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "tickets",
                                  "tickets",
                                  "delete_all",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.tickets.tickets.actions[9].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.tickets.tickets.actions[9].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.tickets.tickets.delete_own}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "tickets",
                                  "tickets",
                                  "delete_own",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.tickets.tickets.actions[10].label}
                        </Table.Cell>
                        <Table.Cell>
                          {permissions.tickets.tickets.actions[10].description}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.tickets.tickets.delete_group}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "tickets",
                                  "tickets",
                                  "delete_group",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </Card>
              </div>
            </Tabs.Item>
          </Tabs.Group>
        </>
      ) : panel === "access_control" ? (
        <>
          <Tabs.Group>
            <Tabs.Item title={t("DEVICES")}>
              <div className="mb-12">
                <div className="flex justify-between p-2">
                  <h1 className="text-left text-2xl font-bold mb-4"></h1>
                  <div>
                    {changeAll[28] ? (
                      <ToggleSwitch
                        label={t("DISABLED_ALL")}
                        checked={changeAll[28]}
                        onChange={() => {
                          onEnable(28, false);
                          handleActivateSubAll(
                            "access_control",
                            "devices",
                            [
                              "access_module",
                              "create",
                              "read_all",
                              "read_own",
                              "read_group",
                              "update_all",
                              "update_own",
                              "update_group",
                              "delete_all",
                              "delete_own",
                              "delete_group",
                            ],
                            false,
                          );
                        }}
                      />
                    ) : (
                      <h1></h1>
                    )}
                    {!changeAll[28] ? (
                      <ToggleSwitch
                        label={t("ENABLED_ALL")}
                        checked={changeAll[28]}
                        onChange={() => {
                          onEnable(28, true);
                          handleActivateSubAll(
                            "access_control",
                            "devices",
                            [
                              "access_module",
                              "create",
                              "read_all",
                              "read_own",
                              "read_group",
                              "update_all",
                              "update_own",
                              "update_group",
                              "delete_all",
                              "delete_own",
                              "delete_group",
                            ],
                            true,
                          );
                        }}
                      />
                    ) : (
                      <h1></h1>
                    )}
                  </div>
                </div>
                <Card>
                  <Table>
                    <Table.Head className="dark:text-white w-full">
                      <Table.HeadCell>{t("PERMISSION")}</Table.HeadCell>
                      <Table.HeadCell>{t("DESCRIPTION")}</Table.HeadCell>
                      <Table.HeadCell>{t("STATE")}</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                      <Table.Row>
                        <Table.Cell>
                          {permissions.access_control.devices.actions[0].label}
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.access_control.devices.actions[0]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.access_control.devices.access_module
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "access_control",
                                  "devices",
                                  "access_module",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.access_control.devices.actions[1].label}
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.access_control.devices.actions[1]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={permission.access_control.devices.create}
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "access_control",
                                  "devices",
                                  "create",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.access_control.devices.actions[2].label}
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.access_control.devices.actions[2]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.access_control.devices.read_all
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "access_control",
                                  "devices",
                                  "read_all",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.access_control.devices.actions[3].label}
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.access_control.devices.actions[3]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.access_control.devices.read_own
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "access_control",
                                  "devices",
                                  "read_own",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.access_control.devices.actions[4].label}
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.access_control.devices.actions[4]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.access_control.devices.read_group
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "access_control",
                                  "devices",
                                  "read_group",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.access_control.devices.actions[5].label}
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.access_control.devices.actions[5]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.access_control.devices.update_all
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "access_control",
                                  "devices",
                                  "update_all",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.access_control.devices.actions[6].label}
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.access_control.devices.actions[6]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.access_control.devices.update_own
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "access_control",
                                  "devices",
                                  "update_own",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.access_control.devices.actions[7].label}
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.access_control.devices.actions[7]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.access_control.devices.update_group
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "access_control",
                                  "devices",
                                  "update_group",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.access_control.devices.actions[8].label}
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.access_control.devices.actions[8]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.access_control.devices.delete_all
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "access_control",
                                  "devices",
                                  "delete_all",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.access_control.devices.actions[9].label}
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.access_control.devices.actions[9]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.access_control.devices.delete_own
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "access_control",
                                  "devices",
                                  "delete_own",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {permissions.access_control.devices.actions[10].label}
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.access_control.devices.actions[10]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.access_control.devices.delete_group
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "access_control",
                                  "devices",
                                  "delete_group",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </Card>
              </div>
            </Tabs.Item>
          </Tabs.Group>
        </>
      ) : panel === "competitions" ? (
        <>
          <Tabs.Group>
            <Tabs.Item title={t("COMPETITIONS")}>
              <div className="mb-12">
                <div className="flex justify-between p-2">
                  <h1 className="text-left text-2xl font-bold mb-4"></h1>
                  <div>
                    {changeAll[29] ? (
                      <ToggleSwitch
                        label={t("DISABLED_ALL")}
                        checked={changeAll[29]}
                        onChange={() => {
                          onEnable(29, false);
                          handleActivateSubAll(
                            "competitions",
                            "competitions",
                            [
                              "access_module",
                              "create",
                              "read_all",
                              "read_own",
                              "read_group",
                              "update_all",
                              "update_own",
                              "update_group",
                              "delete_all",
                              "delete_own",
                              "delete_group",
                            ],
                            false,
                          );
                        }}
                      />
                    ) : (
                      <h1></h1>
                    )}
                    {!changeAll[29] ? (
                      <ToggleSwitch
                        label={t("ENABLED_ALL")}
                        checked={changeAll[29]}
                        onChange={() => {
                          onEnable(29, true);
                          handleActivateSubAll(
                            "competitions",
                            "competitions",
                            [
                              "access_module",
                              "create",
                              "read_all",
                              "read_own",
                              "read_group",
                              "update_all",
                              "update_own",
                              "update_group",
                              "delete_all",
                              "delete_own",
                              "delete_group",
                            ],
                            true,
                          );
                        }}
                      />
                    ) : (
                      <h1></h1>
                    )}
                  </div>
                </div>
                <Card>
                  <Table>
                    <Table.Head className="dark:text-white w-full">
                      <Table.HeadCell>{t("PERMISSION")}</Table.HeadCell>
                      <Table.HeadCell>{t("DESCRIPTION")}</Table.HeadCell>
                      <Table.HeadCell>{t("STATE")}</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                      <Table.Row>
                        <Table.Cell>
                          {
                            permissions.competitions.competitions.actions[0]
                              .label
                          }
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.competitions.competitions.actions[0]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.competitions.competitions
                                  .access_module
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "competitions",
                                  "competitions",
                                  "access_module",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {
                            permissions.competitions.competitions.actions[1]
                              .label
                          }
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.competitions.competitions.actions[1]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.competitions.competitions.create
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "competitions",
                                  "competitions",
                                  "create",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {
                            permissions.competitions.competitions.actions[2]
                              .label
                          }
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.competitions.competitions.actions[2]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.competitions.competitions.read_all
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "competitions",
                                  "competitions",
                                  "read_all",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {
                            permissions.competitions.competitions.actions[3]
                              .label
                          }
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.competitions.competitions.actions[3]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.competitions.competitions.read_own
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "competitions",
                                  "competitions",
                                  "read_own",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {
                            permissions.competitions.competitions.actions[4]
                              .label
                          }
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.competitions.competitions.actions[4]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.competitions.competitions.read_group
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "competitions",
                                  "competitions",
                                  "read_group",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {
                            permissions.competitions.competitions.actions[5]
                              .label
                          }
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.competitions.competitions.actions[5]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.competitions.competitions.update_all
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "competitions",
                                  "competitions",
                                  "update_all",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {
                            permissions.competitions.competitions.actions[6]
                              .label
                          }
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.competitions.competitions.actions[6]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.competitions.competitions.update_own
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "competitions",
                                  "competitions",
                                  "update_own",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {
                            permissions.competitions.competitions.actions[7]
                              .label
                          }
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.competitions.competitions.actions[7]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.competitions.competitions
                                  .update_group
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "competitions",
                                  "competitions",
                                  "update_group",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {
                            permissions.competitions.competitions.actions[8]
                              .label
                          }
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.competitions.competitions.actions[8]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.competitions.competitions.delete_all
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "competitions",
                                  "competitions",
                                  "delete_all",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {
                            permissions.competitions.competitions.actions[9]
                              .label
                          }
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.competitions.competitions.actions[9]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.competitions.competitions.delete_own
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "competitions",
                                  "competitions",
                                  "delete_own",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          {
                            permissions.competitions.competitions.actions[10]
                              .label
                          }
                        </Table.Cell>
                        <Table.Cell>
                          {
                            permissions.competitions.competitions.actions[10]
                              .description
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <ToggleSwitch
                              checked={
                                permission.competitions.competitions
                                  .delete_group
                              }
                              onChange={() =>
                                handleSubSubPermissionChange(
                                  "competitions",
                                  "competitions",
                                  "delete_group",
                                )
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </Card>
              </div>
            </Tabs.Item>
          </Tabs.Group>
        </>
      ) : (
        <></>
      )}
    </>
  );
}
