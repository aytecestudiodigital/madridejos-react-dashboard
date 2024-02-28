/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HeaderItemPageComponent } from "../../../../components/ListPage/HeaderItemPage";
import { useForm } from "react-hook-form";
import {
  Button,
  Card,
  Label,
  TextInput,
  Textarea,
  ToggleSwitch,
} from "flowbite-react";
import { ItemResponsiblesModal } from "../../../bookings/items/components/ItemResposiblesModal";
import { LuPlus, LuUserCog2, LuUserPlus2 } from "react-icons/lu";
import { t } from "i18next";
import { ProjectCategoryModal } from "../components/ProjectCategoryModal";
import { HiTrash } from "react-icons/hi";
import { ErrorMessage } from "@hookform/error-message";
import {
  deleteRow,
  getOneRow,
  insertRow,
  updateRow,
} from "../../../../server/supabaseQueries";
import { supabase } from "../../../../server/supabase";
import { DeleteModal } from "../../../../components/DeleteModal";
import { AlertContext } from "../../../../context/AlertContext";
import { RootState } from "../../../../store/store";
import { useSelector } from "react-redux";

export default function EditProjectPage() {
  const breadcrumb = [
    {
      title: "PROJECTS_LIST",
      path: "/tasks/projects",
    },
    {
      title: "PROJECT_DETAILS",
    },
  ];

  const [pageTitle, setPageTitle] = useState<string>("EDIT_PROJECT");
  const { id } = useParams();
  const navigate = useNavigate();
  const { openAlert } = useContext(AlertContext);

  const [project, setProject] = useState<any>(null);
  const [admins, setAdmins] = useState<any[]>([]);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [isOpenModalAdmin, setIsOpenModalAdmin] = useState(false);
  const [isOpenModalTechnicians, setIsOpenModalTechnicians] = useState(false);
  const [isOpenProjectCategoryModal, setIsOpenProjectCategoryModal] =
    useState(false);
  const [projectCategories, setProjectCategories] = useState<any[]>([]);
  const [projectCategoriesToUpdate, setProjectCategoriesToUpdate] = useState<
    any[]
  >([]);
  const [projectCategoriesToDelete, setProjectCategoriesToDelete] = useState<
    any[]
  >([]);
  const [enable, setEnable] = useState(project ? project.enable : false);
  const [selectedProjectCategory, setSelectedProjectCategory] =
    useState<any>(null);
  const [defaultAdminsDb, setDefaultAdminsDb] = useState<any[]>([]);
  const [defaultTechniciansDb, setDefaultTechniciansDb] = useState<any[]>([]);
  const [
    defaultProjectCategoryTechnicians,
    setDefaultProjectCategoryTechnicians,
  ] = useState<any[]>([]);
  const [selectedProjectCategoryIndex, setSelectedProjectCategoryIndex] =
    useState<number>(0);

  const { register, getValues, setValue, formState } = useForm<any>({
    values: project ?? undefined,
    mode: "onChange",
    reValidateMode: "onBlur",
    criteriaMode: "all",
  });

  const { errors, isValid } = formState;

  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (user) {
      if (!user.users_roles.rules.tasks.projects.access_module) {
        openAlert("No tienes acceso a esta página", "error");
        navigate("/");
      }
    }
  }, [user]);

  useEffect(() => {
    if (id) {
      setPageTitle("EDIT_PROJECT");
      getDataFromServer();
    } else {
      setPageTitle("NEW_PROJECT");
    }
  }, [id]);

  useEffect(() => {
    setValue("enable", enable);
  }, [enable]);

  const getDataFromServer = async () => {
    if (id || project) {
      const actualId = project ? project.id : id;
      const projectDb = await getOneRow("id", actualId, "tasks_projects");
      if (projectDb) {
        const defaultAdmins: any = [];
        const defaultTechnicals: any[] = [];
        const defaultProjectCategories: any[] = [];
        const defaultDb: any[] = [];
        const adminsDb = await supabase
          .from("tasks_project_administrators")
          .select(
            "users!public_tasks_project_administrators_admin_id_fkey(id, name, surname, email)",
          )
          .eq("project_id", projectDb.id);
        const technicalsDb = await supabase
          .from("tasks_projects_technicians")
          .select(
            "users!public_tasks_projects_technicians_technician_id_fkey(id, name, surname, email)",
          )
          .eq("tasks_project_id", projectDb.id);
        const projectCategoriesDb = await supabase
          .from("tasks_projects_categories")
          .select("*")
          .eq("tasks_project_id", projectDb.id);
        if (adminsDb) {
          if (adminsDb.data && adminsDb.data?.length > 0) {
            adminsDb.data?.forEach((data: any) => {
              const adminDb = {
                id: data.users.id,
                name: data.users.name,
                surname: data.users.surname,
                email: data.users.email,
              };
              defaultAdmins.push(adminDb);
            });
          }
          setAdmins(defaultAdmins);
          setDefaultAdminsDb(defaultAdmins);
        }
        if (technicalsDb) {
          if (technicalsDb.data && technicalsDb.data.length > 0) {
            technicalsDb.data?.forEach((data: any) => {
              const adminDb = {
                id: data.users.id,
                name: data.users.name,
                surname: data.users.surname,
                email: data.users.email,
              };
              defaultTechnicals.push(adminDb);
            });
          }
          setTechnicians(defaultTechnicals);
          setDefaultTechniciansDb(defaultTechnicals);
        }
        if (projectCategoriesDb) {
          if (projectCategoriesDb.data && projectCategoriesDb.data.length > 0) {
            for await (const category of projectCategoriesDb.data) {
              const newCategory: any = {
                id: category.id,
                title: category.title,
                description: category.description,
                auto_assign: category.auto_assign,
                enabled: category.enabled,
                techniciansSelected: [],
              };
              const categoryTechnicals = await supabase
                .from("tasks_projects_category_technicians")
                .select("technician_id")
                .eq("project_category_id", category.id);
              if (categoryTechnicals) {
                if (
                  categoryTechnicals.data &&
                  categoryTechnicals.data.length > 0
                ) {
                  categoryTechnicals.data.forEach((tech) => {
                    newCategory.techniciansSelected.push(tech.technician_id);
                    defaultDb.push(tech.technician_id);
                  });
                }
              }
              defaultProjectCategories.push(newCategory);
            }
            setProjectCategories(defaultProjectCategories);
            setDefaultProjectCategoryTechnicians(defaultDb);
          }
        }
        setProject(projectDb);
        setEnable(projectDb.enable);
      }
    }
  };

  const openModalAdmin = () => {
    setIsOpenModalAdmin(true);
  };

  const openModalTech = () => {
    setIsOpenModalTechnicians(true);
  };

  const openModalCategory = (item: any, index: any) => {
    if (item) {
      setSelectedProjectCategory(item);
      setSelectedProjectCategoryIndex(index);
    } else {
      setSelectedProjectCategory(null);
      setSelectedProjectCategoryIndex(index);
    }
    setIsOpenProjectCategoryModal(true);
  };

  const onCreateProjectCategory = (data: any) => {
    const categories = [...projectCategories];
    categories.push(data);
    setProjectCategories(categories);
  };

  const onUpdateCategory = (data: any) => {
    const toUpdate = [...projectCategoriesToUpdate];
    const defaultCategories = [...projectCategories];
    defaultCategories[selectedProjectCategoryIndex] = data;
    if (toUpdate[toUpdate.findIndex((e) => e.id === data.id)] === undefined) {
      toUpdate.push(data);
    } else {
      toUpdate[toUpdate.findIndex((e) => e.id === data.id)] = data;
    }
    setProjectCategoriesToUpdate(toUpdate);
    setProjectCategories(defaultCategories);
  };

  const onDeleteCategory = (index: number) => {
    const actualCategories = [...projectCategories];
    const toDelete = [...projectCategoriesToDelete];
    toDelete.push(actualCategories[index]);
    actualCategories.splice(index, 1);
    setProjectCategories(actualCategories);
    setProjectCategoriesToDelete(toDelete);
  };

  const onSave = async (close: boolean) => {
    const formValues = getValues();
    const projectToSave: any = {
      title: formValues.title,
      description: formValues.description,
      enable: formValues.enable,
      org_id: "043ec7c2-572a-4199-9aa1-af6af822e76a",
    };
    if (!project) {
      const createdProject = await insertRow(projectToSave, "tasks_projects");
      if (createdProject) {
        if (admins.length > 0) {
          for await (const admin of admins) {
            const newAdmin = {
              admin_id: admin.id,
              project_id: createdProject.id,
            };
            await insertRow(newAdmin, "tasks_project_administrators");
          }
        }
        if (technicians.length > 0) {
          for await (const technician of technicians) {
            const newTech = {
              technician_id: technician.id,
              tasks_project_id: createdProject.id,
            };
            await insertRow(newTech, "tasks_projects_technicians");
          }
        }
        if (projectCategories.length > 0) {
          for await (const category of projectCategories) {
            const categoryToSave = {
              title: category.title,
              description: category.description,
              auto_assign: category.auto_assign,
              enabled: category.enabled,
              tasks_project_id: createdProject.id,
            };
            const createdCategory = await insertRow(
              categoryToSave,
              "tasks_projects_categories",
            );
            if (createdCategory) {
              if (category.techniciansSelected.length > 0) {
                for await (const technician of category.techniciansSelected) {
                  const newTech = {
                    technician_id: technician,
                    project_category_id: createdCategory.id,
                  };
                  await insertRow(
                    newTech,
                    "tasks_projects_category_technicians",
                  );
                }
              }
            }
          }
        }
        openAlert("Proyecto creado con éxito", "insert");
        setProject(createdProject);
        navigate(`/tasks/projects/${createdProject.id}`);
      }
    } else {
      projectToSave.id = project.id;
      const projectUpdated = await updateRow(projectToSave, "tasks_projects");
      if (projectUpdated) {
        if (defaultAdminsDb.length > 0) {
          for await (const admin of defaultAdminsDb) {
            if (admin.id) {
              if (
                admins[admins.findIndex((e) => e.id === admin.id)] === undefined
              ) {
                await supabase
                  .from("tasks_project_administrators")
                  .delete()
                  .eq("admin_id", admin.id)
                  .eq("project_id", project.id);
              }
            }
          }
        }
        if (admins.length > 0) {
          for await (const admin of admins) {
            if (
              defaultAdminsDb[
                defaultAdminsDb.findIndex((e) => e.id === admin.id)
              ] === undefined
            ) {
              const newAdmin = {
                admin_id: admin.id,
                project_id: project.id,
              };
              await insertRow(newAdmin, "tasks_project_administrators");
            }
          }
        }
        if (defaultTechniciansDb.length > 0) {
          for await (const technician of defaultTechniciansDb) {
            if (technician.id) {
              if (
                technicians[
                  technicians.findIndex((e) => e.id === technician.id)
                ] === undefined
              ) {
                await supabase
                  .from("tasks_projects_technicians")
                  .delete()
                  .eq("technician_id", technician.id)
                  .eq("tasks_project_id", project.id);
              }
            }
          }
        }
        if (technicians.length > 0) {
          for await (const technician of technicians) {
            if (
              defaultTechniciansDb[
                defaultTechniciansDb.findIndex((e) => e.id === technician.id)
              ] === undefined
            ) {
              const newTech = {
                technician_id: technician.id,
                tasks_project_id: project.id,
              };
              await insertRow(newTech, "tasks_projects_technicians");
            }
          }
        }
        if (projectCategories.length > 0) {
          for await (const category of projectCategories) {
            if (!category.id) {
              const categoryToSave = {
                title: category.title,
                description: category.description,
                auto_assign: category.auto_assign,
                enabled: category.enabled,
                tasks_project_id: project.id,
              };
              const createdCategory = await insertRow(
                categoryToSave,
                "tasks_projects_categories",
              );
              if (createdCategory) {
                if (category.techniciansSelected.length > 0) {
                  for await (const technician of category.techniciansSelected) {
                    const newTech = {
                      technician_id: technician,
                      project_category_id: createdCategory.id,
                    };
                    await insertRow(
                      newTech,
                      "tasks_projects_category_technicians",
                    );
                  }
                }
              }
            }
          }
        }
        if (projectCategoriesToUpdate.length > 0) {
          for await (const category of projectCategoriesToUpdate) {
            if (category.id) {
              const toUpdate = {
                id: category.id,
                title: category.title,
                description: category.description,
                auto_assign: category.auto_assign,
                enabled: category.enabled,
                tasks_project_id: project.id,
              };
              const updatedCategory = await updateRow(
                toUpdate,
                "tasks_projects_categories",
              );
              if (updatedCategory) {
                if (category.techniciansSelected.length > 0) {
                  for await (const tech of category.techniciansSelected) {
                    if (
                      defaultProjectCategoryTechnicians[
                        defaultProjectCategoryTechnicians.findIndex(
                          (e) => e === tech,
                        )
                      ] === undefined
                    ) {
                      const newTech = {
                        technician_id: tech,
                        project_category_id: category.id,
                      };
                      await insertRow(
                        newTech,
                        "tasks_projects_category_technicians",
                      );
                    }
                  }
                }
                if (defaultProjectCategoryTechnicians.length > 0) {
                  for await (const tech of defaultProjectCategoryTechnicians) {
                    if (
                      category.techniciansSelected[
                        category.techniciansSelected.findIndex(
                          (e: any) => e === tech,
                        )
                      ] === undefined
                    ) {
                      await supabase
                        .from("tasks_projects_category_technicians")
                        .delete()
                        .eq("technician_id", tech)
                        .eq("project_category_id", updatedCategory.id);
                    }
                  }
                }
              }
            }
          }
        }
        if (projectCategoriesToDelete.length > 0) {
          for await (const category of projectCategoriesToDelete) {
            if (category.id) {
              await deleteRow(category.id, "tasks_projects_categories");
            }
          }
        }
        openAlert("Proyecto actualizado con éxito", "insert");
      }
    }
    getDataFromServer();
    close && navigate("/tasks/projects");
  };

  const deleteProject = async (item: any) => {
    await deleteRow(item.id, "tasks_projects");
    navigate("/tasks/projects");
  };

  return (
    <>
      <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
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
      <div className="flex gap-4 p-4">
        <div className="w-2/3">
          <Card>
            <div>
              <p className="font-bold text-xl">
                Añade o modifica las propiedades del proyecto
              </p>
            </div>
            <form>
              <div>
                <Label>Título *</Label>
                <div className="mt-1">
                  <TextInput
                    id="title"
                    placeholder="Inserta un título"
                    {...register("title", {
                      required: t("FORM_ERROR_MSG_REQUIRED"),
                    })}
                    color={errors.title && "failure"}
                  />
                  <ErrorMessage
                    errors={errors}
                    name="title"
                    render={({ messages }) =>
                      messages &&
                      Object.entries(messages).map(([type, message]) => (
                        <p
                          className="mt-2 text-sm text-red-600 dark:text-red-500"
                          key={type}
                        >
                          {message}
                        </p>
                      ))
                    }
                  />
                </div>
              </div>
              <div className="mt-4">
                <Label>Descripción</Label>
                <div className="mt-1">
                  <Textarea
                    placeholder="Inserta una descripción"
                    {...register("description")}
                  />
                </div>
              </div>
            </form>
            <div>
              <div>
                <Card>
                  <div className="flex items-center justify-between gap-4">
                    <Label htmlFor="responsibles">Administradores</Label>
                    <Button
                      size="sm"
                      color="light"
                      onClick={() => openModalAdmin()}
                    >
                      {admins.length === 0 ? (
                        <div className="flex items-center text-blue-900">
                          <LuUserPlus2 className="mr-1 text-lg text-blue-900" />
                          {t("ADD_BTN")}
                        </div>
                      ) : (
                        <div className="flex items-center text-blue-900">
                          <LuUserCog2 className=" mr-1 text-lg text-blue-900" />
                          {t("EDIT_BTN")}
                        </div>
                      )}
                    </Button>
                  </div>

                  <ItemResponsiblesModal
                    showModal={isOpenModalAdmin}
                    closeModal={() => setIsOpenModalAdmin(false)}
                    setTechnicians={setAdmins}
                    selectedTechnicians={admins}
                  />

                  <div className="flex flex-col">
                    {admins.length > 0 ? (
                      <div>
                        <ul>
                          {admins.map((admin) => (
                            <li className="text-sm" key={admin.id}>
                              <div className="flex justify-between">
                                <div className="flex-grow w-1">
                                  <p className="font-semibold">{`${admin.name} ${admin.surname}`}</p>
                                </div>
                                <div className="flex-grow w-1/2">
                                  <p>{admin.email}</p>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500 mt-1">
                        {t("RESPONSIBLES_NOT_FOUND")}
                      </p>
                    )}
                  </div>
                </Card>
              </div>
              <div className="mt-4">
                <Card>
                  <div className="flex items-center justify-between gap-4">
                    <Label htmlFor="responsibles">Técnicos</Label>
                    <Button
                      size="sm"
                      color="light"
                      onClick={() => openModalTech()}
                    >
                      {technicians.length === 0 ? (
                        <div className="flex items-center text-blue-900">
                          <LuUserPlus2 className="mr-1 text-lg text-blue-900" />
                          {t("ADD_BTN")}
                        </div>
                      ) : (
                        <div className="flex items-center text-blue-900">
                          <LuUserCog2 className=" mr-1 text-lg text-blue-900" />
                          {t("EDIT_BTN")}
                        </div>
                      )}
                    </Button>
                  </div>

                  <ItemResponsiblesModal
                    showModal={isOpenModalTechnicians}
                    closeModal={() => setIsOpenModalTechnicians(false)}
                    setTechnicians={setTechnicians}
                    selectedTechnicians={technicians}
                  />

                  <div className="flex flex-col">
                    {technicians.length > 0 ? (
                      <div>
                        <ul>
                          {technicians.map((technician) => (
                            <li className="text-sm" key={technician.id}>
                              <div className="flex justify-between">
                                <div className="flex-grow w-1">
                                  <p className="font-semibold">{`${technician.name} ${technician.surname}`}</p>
                                </div>
                                <div className="flex-grow w-1/2">
                                  <p>{technician.email}</p>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500 mt-1">
                        {t("RESPONSIBLES_NOT_FOUND")}
                      </p>
                    )}
                  </div>
                </Card>
              </div>
            </div>
            <div className="mt-4 flex justify-between">
              <div className="mt-1">
                <ToggleSwitch
                  label="Habilitado"
                  checked={enable}
                  onChange={(e) => setEnable(e)}
                />
              </div>
              {id ? (
                <DeleteModal
                  data={project}
                  deleteFn={deleteProject}
                  onlyIcon={false}
                  toastSuccessMsg={"Proyecto eliminado correctamente"}
                  toastErrorMsg={"Error al eliminar el proyecto"}
                  title="Eliminar proyecto"
                />
              ) : null}
            </div>
          </Card>
        </div>
        <div className="w-1/3">
          <Card>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-xl font-semibold">Categorías</h1>
              </div>
              <div className="mb-2 flex">
                <div className="flex">
                  <LuPlus className="mt-1.5 mr-1 text-blue-700 font-bold" />
                  <a
                    className="text-blue-700 cursor-pointer"
                    onClick={() => openModalCategory(null, "")}
                  >
                    {t("ADD_BTN")}
                  </a>
                </div>
              </div>
              {/* <div>
                                <Button color="primary" onClick={() => openModalCategory(null, "")}>Añadir categoría</Button>
                            </div> */}
            </div>
            <div className="mt-4">
              {projectCategories && projectCategories.length > 0 ? (
                <>
                  <div className="text-gray-400 font-semibold border-b p-4">
                    <h1>Título</h1>
                  </div>
                  {projectCategories.map((category, index) => (
                    <div
                      key={index}
                      className="flex justify-between p-4 border-b"
                    >
                      <div
                        className="cursor-pointer"
                        onClick={() => openModalCategory(category, index)}
                      >
                        {category.title}
                      </div>
                      <div className="">
                        <Button
                          onClick={() => onDeleteCategory(index)}
                          color="failure"
                          size={"xs"}
                        >
                          <HiTrash />
                        </Button>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <p className="text-center">
                  No hay categorías asociadas a este proyecto
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
      {isOpenProjectCategoryModal ? (
        <ProjectCategoryModal
          openModal={isOpenProjectCategoryModal}
          onCloseModal={() => setIsOpenProjectCategoryModal(false)}
          technicians={technicians}
          item={selectedProjectCategory}
          onCreateCategory={(data: any) => onCreateProjectCategory(data)}
          onUpdateCategory={(data) => onUpdateCategory(data)}
        />
      ) : null}
    </>
  );
}
