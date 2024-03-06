/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { supabase } from "../../../../server/supabase"
import { Wrapper } from "@googlemaps/react-wrapper"
import Marker from "../../../content/articles/components/MapMarkerComponent"
import GoogleMaps from "../../../content/articles/components/MapComponent"
import { Button, Card, Label, Select, Spinner, TextInput, Textarea } from "flowbite-react"
import ModalImage from "react-modal-image"
import { HeaderItemPageComponent } from "../../../../components/ListPage/HeaderItemPage"
import { CategoryTechniciansModal } from "../components/CategoryTechniciansModal"
import { deleteRow, getAll, getOneRow, getRowByColumn, insertRow, updateRow } from "../../../../server/supabaseQueries"
import { AlertContext } from "../../../../context/AlertContext"
import { UploadArea } from "../../../../components/UploadFilesArea/UploadFilesArea"
import { HiOutlineInformationCircle, HiTrash } from "react-icons/hi"
import { useForm } from "react-hook-form"
import { t } from "i18next"
import { ErrorMessage } from "@hookform/error-message"
import { DeleteModal } from "../../../../components/DeleteModal"

export const TaskDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const breadcrumb = [
        {
            title: "TASKS_PANEL",
            path: "/tasks",
        },
        {
            title: "CONSULT_TASK",
        },
    ];

    const [pageTitle, setPageTitle] = useState<string>("CONSULT_TASK");
    const [actualTask, setActualTask] = useState<any>(null);
    const [address, setAddress] = useState("");
    const [technicals, setTechnicals] = useState<any[]>([]);
    const [categoryTechnicians, setCategoryTechnicians] = useState<any[]>([]);
    const [isOpenTechniciansModal, setIsOpenTechniciansModal] = useState(false);
    const { openAlert } = useContext(AlertContext);
    const [taskProjects, setTaskProjects] = useState<any[]>([]);
    const [projectSelected, setProjectSelected] = useState<any>("");
    const [projectCategories, setProjectCategories] = useState<any[]>([]);
    const [clicks, setClicks] = useState<google.maps.LatLng[]>([]);
    const [latLng, setLatLng] = useState<any>({ lat: 39.1577, lng: -3.02081 });
    const [images, setImages] = useState<any[]>([]);
    const [documents, setDocuments] = useState<any[]>([]);
    //const [user, setUser] = useState<AymoUser | null>()
    const user = JSON.parse(localStorage.getItem("userLogged")!);

    useEffect(() => {
        if (user) {
            if (!user.users_roles.rules.tasks.tasks.access_module) {
                openAlert("No tienes acceso a esta página", "error");
                navigate("/");
            }
        }
    }, [user]);

    const { register, formState, getValues } = useForm<any>({
        values: undefined,
        mode: "all",
        reValidateMode: "onBlur",
        criteriaMode: "all",
    });

    const { errors, isValid } = formState;


    useEffect(() => {
        if (id) {
            getDataFromServer();
        } else {
            setPageTitle("NEW_TASK");
            const fetchData = async () => {
                const projectsDb = await getAll("tasks_projects");
                if (projectsDb && projectsDb.data && projectsDb.data?.length > 0) {
                    setTaskProjects(projectsDb.data);
                }
            };
            fetchData();
        }
    }, [id]);

    useEffect(() => {
        if (projectSelected !== "") {
            const fetchData = async () => {
                const categoriesDb = await getRowByColumn(
                    "tasks_project_id",
                    projectSelected,
                    "tasks_projects_categories",
                );
                if (categoriesDb) {
                    setProjectCategories(categoriesDb);
                }
            };
            fetchData();
        }
    }, [projectSelected]);

    useEffect(() => {
        clicks.map((latLng) => {
            const position = latLng.toJSON();
            setLatLng(position);
            getMapAddress(position);
        });
    }, [clicks]);

    const getDataFromServer = async () => {
        if (id) {
            const taskDb = await supabase
                .from("tasks")
                .select(
                    "*, users!tasks_created_by_fkey(name, surname), tasks_projects_categories(id, title)",
                )
                .eq("id", id);
            if (taskDb) {
                if (taskDb.data && taskDb.data.length > 0) {
                    setActualTask(taskDb.data[0]);
                    if (taskDb.data[0].position) {
                        getMapAddress({
                            lat: taskDb.data[0].position[0],
                            lng: taskDb.data[0].position[1],
                        });
                    }
                    if (taskDb.data[0].tasks_category_id) {
                        const techs = await supabase
                            .from("tasks_projects_category_technicians")
                            .select(
                                "users!public_tasks_projects_category_technicians_technician_id_fkey(id, name, surname, email)",
                            )
                            .eq("project_category_id", taskDb.data[0].tasks_category_id);
                        if (techs) {
                            if (techs.data && techs.data.length > 0) {
                                setCategoryTechnicians(techs.data);
                            }
                        }
                    }
                    if(taskDb.data[0].images){
                        setImages(taskDb.data[0].images)
                    }
                    const assignedTechs = await supabase
                        .from("tasks_assigned_technician")
                        .select(
                            "users!public_tasks_assigned_technician_technician_id_fkey(id, name, surname, email)",
                        )
                        .eq("task_id", taskDb.data[0].id);
                    if (assignedTechs) {
                        if (assignedTechs.data && assignedTechs.data.length > 0) {
                            setTechnicals(assignedTechs.data);
                        }
                    }
                }
            }
        }
    };

    const getMapAddress = async (pos: any) => {
        const geocoder = new google.maps.Geocoder();
        const address: any = await geocoder.geocode({ location: pos });
        setAddress(address.results[0].formatted_address);
    };

    const openTechniciansModal = () => {
        setIsOpenTechniciansModal(true);
    };

    const afterAssignTechnicians = async (data: any) => {
        if (data.length > 0) {
            for await (const tech of data) {
                const newAssignedTech = {
                    task_id: actualTask.id,
                    technician_id: tech.users.id,
                };
                await insertRow(newAssignedTech, "tasks_assigned_technician");
            }
            const taskDb = await getOneRow("id", actualTask.id, "tasks");
            if (taskDb) {
                taskDb.state = "ASSIGNED";
                await updateRow(taskDb, "tasks");
            }
            getDataFromServer();
        }
    };

    const handleChangePriority = (value: any) => {
        const defaultTask = { ...actualTask };
        defaultTask.priority = value;
        setActualTask(defaultTask);
    };

    const handleChangeStateButtons = async (value: any) => {
        const defaultTask = { ...actualTask };
        const taskDb = await getOneRow("id", defaultTask.id, "tasks");
        taskDb.state = value;
        const updatedTask = await updateRow(taskDb, "tasks");
        if (updatedTask) {
            openAlert("Estado de la incidencia actualizado con éxito", "update");
        } else {
            openAlert(
                "Ha ocurrido un error al modificar el estado de la incidencia",
                "error",
            );
        }
        getDataFromServer();
    };

    const onSave = async (close: boolean) => {
        if (id) {
            const defaultTask = { ...actualTask };
            const taskDb = await getOneRow("id", actualTask.id, "tasks");
            if (taskDb) {
                taskDb.state = defaultTask.state;
                taskDb.priority = parseInt(defaultTask.priority);
                const taskUpdated = await updateRow(taskDb, "tasks");
                if (taskUpdated) {
                    openAlert("Incidencia actualizada correctamente", "update");
                } else {
                    openAlert(
                        "Ha ocurrido un error al actualizar la incidencia",
                        "error",
                    );
                }
                getDataFromServer();
                close && history.back();
            }
        } else {
            const formValues = getValues();
            const newTask = {
                title: formValues.title,
                description: formValues.description,
                priority: formValues.priority,
                tasks_category_id: formValues.tasks_category_id,
                images: images.length > 0 ? images : null,
                documents: documents.length > 0 ? documents : null,
                position: [latLng.lat, latLng.lng],
                created_by: user?.id,
            };
            const createdTask = await insertRow(newTask, "tasks");
            if (createdTask) {
                openAlert("Incidencia creada con éxito", "insert");
            } else {
                openAlert("Ha ocurrido un error al crear la incidencia");
            }
            if (!close) {
                navigate(`/tasks/${createdTask.id}`);
            } else {
                history.back();
            }
        }
    };

    const onClickMap = (e: google.maps.MapMouseEvent) => {
        // avoid directly mutating state
        setClicks([e.latLng!]);
    };

    const onUploadImages = (imagesUrl: any[]) => {
        const newArray = [...images];
        imagesUrl.forEach((image) => {
            newArray.push(image.url);
        });
        setImages(newArray);
    };

    const onUploadDocuments = (documentsUrl: any[]) => {
        const newArray = [...documents];
        documentsUrl.forEach((document) => {
            newArray.push(document.url);
        });
        setDocuments(newArray);
    };

    const deleteTask = async (task: any) => {
        const deletedTask = await deleteRow(task.id, "tasks");
        if (deletedTask) {
            navigate("/tasks");
        } else {
            return deletedTask;
        }
    };

    return (
        <>
            <div className="block items-center justify-between sm:flex">
                <div className="mb-1 w-full">
                    <HeaderItemPageComponent
                        title={pageTitle}
                        breadcrumb={breadcrumb}
                        saving={false}
                        showBackButton={true}
                        showButtonSave={true}
                        showButtonSaveAndClose={true}
                        saveButtonDisabled={!id ? (!isValid || !user.users_roles.rules.tasks.tasks.update) : false}
                        onBack={() => history.back()}
                        onSave={onSave} />
                </div>
            </div>
            <div className="p-4">
                {
                    id ? (
                        <>
                            {
                                actualTask ? (
                                    <Card>
                                        <div>
                                            <div className="border-b mb-6 pb-4">
                                                <Label className="text-lg ">Detalles</Label>
                                            </div>
                                            <div className="flex flex-col md:flex-row gap-4">
                                                <div className="w-full md:w-1/2">

                                                    <div className="flex justify-between mb-2 gap-4">
                                                        <div className="flex">
                                                            <Label className="font-semibold text-base" style={{ marginRight: "10px" }}>Fecha creación:</Label>
                                                            <p>{new Date(actualTask.created_at).toLocaleString()}</p>
                                                        </div>
                                                        <div className="flex">
                                                            <Label className="font-semibold text-base" style={{ marginRight: "10px" }}>Creado por:</Label>
                                                            <p>{actualTask.users ? actualTask.users.name : ""} {actualTask.users ? actualTask.users.surname : ""}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between mb-2">
                                                        <div className="flex">
                                                            <Label className="font-semibold text-base" style={{ marginRight: "10px" }}>Categoría:</Label>
                                                            <p>{actualTask.tasks_projects_categories.title}</p>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Label className="mr-2 font-semibold text-base" htmlFor="status">
                                                                Estado:
                                                            </Label>
                                                            <div className="">
                                                                {
                                                                    actualTask.state === "CREATED" ? (
                                                                        <div className="bg-green-300 px-2 py-0.5 rounded-full font-semibold">Creada</div>
                                                                    ) : actualTask.state === "ASSIGNED" ? (
                                                                        <div className="bg-orange-300 px-2 py-0.5 rounded-full font-semibold">Asignada</div>
                                                                    ) : actualTask.state === "OPEN" ? (
                                                                        <div className="bg-green-400 px-2 py-0.5 rounded-full font-semibold">Abierta</div>
                                                                    ) : actualTask.state === "IN_PROGRESS" ? (
                                                                        <div className="bg-yellow-300 px-2 py-0.5 rounded-full font-semibold">En progreso</div>
                                                                    ) : actualTask.state === "VALIDATED" ? (
                                                                        <div className="bg-green-600 px-2 py-0.5 rounded-full font-semibold text-white">Validada</div>
                                                                    ) : actualTask.state === "REOPEN" ? (
                                                                        <div className="bg-blue-500 px-2 py-0.5 rounded-full font-semibold">Reabierta</div>
                                                                    ) : actualTask.state === "CANCELLED" ? (
                                                                        <div className="bg-black px-2 py-0.5 rounded-full font-semibold text-white">Cancelada</div>
                                                                    ) : actualTask.state === "CLOSED" ? (
                                                                        <div className="bg-red-700 px-2 py-0.5 rounded-full font-semibold text-white">Cerrada</div>
                                                                    ) : null
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="mt-4">
                                                        <p className="font-semibold text-base mb-2">Descripción:</p>
                                                        <p>{actualTask.description}</p>
                                                    </div>
                                                </div>
                                                <div className="w-full flex md:w-1/2 px-4 gap-4">
                                                    <div className="w-full">
                                                        <Label className=" font-semibold text-base">Cambiar prioridad</Label>
                                                        <Select value={actualTask.priority ? actualTask.priority : "0"} onChange={(e) => handleChangePriority(e.currentTarget.value)}>
                                                            <option value="0">Baja</option>
                                                            <option value="1">Normal</option>
                                                            <option value="2">Alta</option>
                                                            <option value="3">Urgente</option>
                                                        </Select>

                                                    </div>
                                                    <div className="flex items-center gap-4 mb-11">
                                                        {
                                                            technicals.length == 0 && actualTask.state === "CREATED" ? (
                                                                <Button onClick={openTechniciansModal} color="primary">Asignar</Button>
                                                            ) : null
                                                        }
                                                        {
                                                            technicals.length > 0 && actualTask.state === "ASSIGNED" ? (
                                                                <Button onClick={() => handleChangeStateButtons('IN_PROGRESS')} color="warning">Iniciar</Button>
                                                            ) : null
                                                        }
                                                        {
                                                            actualTask.state === "IN_PROGRESS" || actualTask.state === "REOPEN" ? (
                                                                <Button onClick={() => handleChangeStateButtons('CLOSED')} color="purple">Cerrar</Button>
                                                            ) : null
                                                        }
                                                        {
                                                            actualTask.state === "CLOSED" ? (
                                                                <>
                                                                    <Button onClick={() => handleChangeStateButtons('REOPEN')} color="warning">Reabrir</Button>
                                                                    <Button onClick={() => handleChangeStateButtons('VALIDATED')} color="success">Validar</Button>
                                                                </>
                                                            ) : null
                                                        }
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <div className="border-b mb-6 pb-4">
                                                <Label className="text-lg">Técnicos</Label>
                                            </div>
                                            {technicals.length > 0 ? (
                                                <>
                                                    <div className=" flex justify-start gap-72">
                                                        <div>
                                                            <Label className="font-semibold">Nombre</Label>
                                                        </div>
                                                        <div>
                                                            <Label className="font-semibold">Email</Label>
                                                        </div>
                                                    </div>
                                                    {
                                                        technicals.map((tech) => (
                                                            <div key={tech.users.id} className="flex justify-start gap-60">
                                                                <div>
                                                                    <div className="">
                                                                        <p>{tech.users.name} {tech.users.surname}</p>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div className="ml-1">
                                                                        <p>{tech.users.email}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))
                                                    }

                                                </>
                                            ) : (
                                                <div className="flex justify-center items-center h-full md:mb-6">
                                                    <div className="flex">
                                                        <HiOutlineInformationCircle className="mt-1 mr-2" />No hay técnicos asignados a esta tarea
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="mt-4">
                                            <div className="border-b mb-6 pb-4">
                                                <Label className="text-lg">Localización</Label>
                                            </div>
                                            <div>
                                                <h1 className="px-2"><span className="font-bold">Ubicación:</span> {address}</h1>
                                                <div className="grid grid-cols-1">
                                                    <div className="px-2 py-2">
                                                        <Wrapper apiKey={import.meta.env.VITE_GOOGLE_MAPS}>
                                                            <GoogleMaps>
                                                                <Marker position={{ lat: actualTask.position[0], lng: actualTask.position[1] }} />
                                                            </GoogleMaps>
                                                        </Wrapper>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <div className="border-b mb-6 pb-4">
                                                <Label className="text-lg">Imágenes</Label>
                                            </div>
                                            {actualTask.images && actualTask.images.length > 0 ? (
                                                <>
                                                    <div className="grid grid-cols-12 gap-12 mx-4">
                                                        {actualTask.images.map((image: any, index: any) => (
                                                            <div key={index} className="col-span-4">
                                                                <ModalImage
                                                                    className="h-32"
                                                                    small={image}
                                                                    large={image} />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex justify-center items-center h-full md:mb-6">
                                                    <div className="flex">
                                                        <HiOutlineInformationCircle className="mt-1 mr-2" />No hay imágenes asignadas a esta tarea
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="mt-4">
                                            <div className="border-b mb-6 pb-4">
                                                <Label className="text-lg">Documentos</Label>
                                            </div>
                                            {
                                                actualTask.documents && actualTask.documents.length > 0 ? (
                                                    <div className="flex flex-row flex-wrap gap-4">
                                                        {
                                                            actualTask.documents.map((document: any, index: any) => (
                                                                <div key={index} className="flex">
                                                                    <div className="m-auto">
                                                                        <img src={"/images/logos/icon.png"} className="h-32 m-auto" />
                                                                        <div className="flex gap-4 mt-2">
                                                                            <TextInput defaultValue={document} readOnly />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                                ) : (
                                                    <div className="flex justify-center items-center h-full md:mb-6">
                                                        <div className="flex">
                                                            <HiOutlineInformationCircle className="mt-1 mr-2" />No hay documentos asignados a esta tarea
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        </div>
                                        <div className="flex">
                                            <DeleteModal
                                                data={actualTask}
                                                deleteFn={deleteTask}
                                                onlyIcon={false}
                                                toastSuccessMsg={"Incidencia eliminada correctamente"}
                                                toastErrorMsg={"Error al eliminar la incidencia"}
                                                title='Eliminar incidencia'
                                                disableButton={
                                                    !user.users_roles.rules.tasks.tasks.delete
                                                  }
                                            />
                                        </div>
                                    </Card>

                                ) : (
                                    <Spinner />
                                )
                            }
                        </>
                    ) : (
                        <Card>
                            <div>
                                <div className=" border-b mb-6 pb-4">
                                    <Label className="text-lg">Detalles</Label>
                                </div>

                                <div className="flex flex-col md:flex-row justify-start gap-4">
                                    <div className="w-full md:w-1/2">
                                        <Label color={errors.title && "failure"} className="font-semibold">Título de la tarea *</Label>
                                        <div className="mt-1">
                                            <TextInput {...register("title", {
                                                required: t("FORM_ERROR_MSG_REQUIRED"),
                                            })} placeholder="Inserta un título" color={errors.title && "failure"} />
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
                                    <div className="w-full md:w-1/2 flex gap-2">
                                        <div className="w-full">
                                            <Label color={errors.priority && "failure"} className="font-semibold">Prioridad *</Label>
                                            <div className="mt-1">
                                                <Select color={errors.email && "priority"} {...register("priority", {
                                                    required: t("FORM_ERROR_MSG_REQUIRED"),
                                                })}>
                                                    <option value="0">Baja</option>
                                                    <option value="1">Normal</option>
                                                    <option value="2">Alta</option>
                                                    <option value="3">Urgente</option>
                                                </Select>
                                            </div>

                                        </div>
                                        <div className="w-full">
                                            <Label color={errors.project_id && "failure"} className="font-semibold">Proyecto *</Label>
                                            <div className="mt-1">
                                                <Select color={errors.project_id && "failure"} {...register("project_id", {
                                                    required: t("FORM_ERROR_MSG_REQUIRED"),
                                                })} onChange={(e) => setProjectSelected(e.currentTarget.value)}>
                                                    <option value="">Selecciona un proyecto</option>
                                                    {
                                                        taskProjects.length > 0 && taskProjects.map((project) => (
                                                            <option key={project.id} value={project.id}>{project.title}</option>
                                                        ))
                                                    }
                                                </Select>
                                                <ErrorMessage
                                                    errors={errors}
                                                    name="project_id"
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

                                        {
                                            projectSelected !== "" && projectCategories.length > 0 ? (
                                                <div className="w-full">
                                                    <Label color={errors.tasks_category_id && "failure"} className="font-semibold">Categoría *</Label>
                                                    <div className="mt-1">
                                                        <Select color={errors.tasks_category_id && "failure"} {...register("tasks_category_id", {
                                                            required: t("FORM_ERROR_MSG_REQUIRED"),
                                                        })}>
                                                            <option value="">Selecciona una categoria</option>
                                                            {projectCategories.length > 0 && projectCategories.map((category) => (
                                                                <option key={category.id} value={category.id}>{category.title}</option>
                                                            ))}
                                                        </Select>
                                                        <ErrorMessage
                                                            errors={errors}
                                                            name="tasks_category_id"
                                                            render={({ messages }) => messages &&
                                                                Object.entries(messages).map(([type, message]) => (
                                                                    <p
                                                                        className="mt-2 text-sm text-red-600 dark:text-red-500"
                                                                        key={type}
                                                                    >
                                                                        {message}
                                                                    </p>
                                                                ))} />
                                                    </div>

                                                </div>
                                            ) : null
                                        }
                                    </div>
                                </div>
                                <div className=" mt-4">
                                    <Label className="font-semibold">Descripción de la tarea</Label>
                                    <div className="mt-1">
                                        <Textarea placeholder="Inserta una descripción..." {...register("description")} rows={5} />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="border-b mb-6 pb-4">
                                    <Label className="text-lg">Localización</Label>
                                </div>
                                <div className="">
                                    <h1 className="px-2"><span className="font-bold">Ubicación:</span> {address}</h1>
                                    <div className="grid grid-cols-1">
                                        <div className="px-2 py-2">
                                            <Wrapper apiKey={import.meta.env.VITE_GOOGLE_MAPS}>
                                                <GoogleMaps onClick={onClickMap}>
                                                    <Marker position={{ lat: latLng.lat, lng: latLng.lng }} />
                                                </GoogleMaps>
                                            </Wrapper>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="border-b mb-6 pb-4">
                                    <Label className="text-lg">Imágenes</Label>
                                </div>
                                <div className="flex flex-col md:flex-row md:gap-4 md:divide-x">
                                    <div className="w-full md:w-2/3 md:mb-6">
                                        {
                                            images.length > 0 ? (
                                                <div className="flex flex-row flex-wrap gap-4">
                                                    {
                                                        images.map((image: any, index: any) => (
                                                            <div key={index} className="flex">
                                                                <Card>
                                                                    <ModalImage
                                                                        className="h-32 m-auto"
                                                                        small={image}
                                                                        large={image}
                                                                    />
                                                                </Card>
                                                            </div>
                                                        ))
                                                    }
                                                </div>

                                            ) : (
                                                <div className="flex justify-center items-center h-full md:mb-6">
                                                    <div className="flex">
                                                        <HiOutlineInformationCircle className="mt-1 mr-2" />No se ha subido ninguna imagen
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </div>
                                    <div className="w-full md:w-1/3 px-4">
                                        <UploadArea
                                            onUpload={onUploadImages}
                                            height="320px"
                                            maxFiles={10}
                                            fileTypes={["image/*"]}
                                            location={"procedures/tasks"}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="border-b mb-6 pb-4">
                                    <Label className="text-lg">Documentos</Label>
                                </div>
                                <div className="flex gap-4 divide-x">
                                    <div className="w-2/3">
                                        {
                                            documents.length > 0 ? (
                                                <div className="flex flex-row flex-wrap gap-4">
                                                    {
                                                        documents.map((document: any, index: any) => (
                                                            <div key={index} className="flex">
                                                                <Card>
                                                                    <div className="m-auto">
                                                                        <img src={"/images/logos/icon.png"} className="h-32 m-auto" />
                                                                        <div className="flex gap-4 mt-2">
                                                                            <TextInput defaultValue={document} readOnly />
                                                                            <div className="flex justify-center items-center">
                                                                                <Button color="light"><HiTrash className="text-red-500" /></Button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </Card>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            ) : (
                                                <div className="flex justify-center items-center h-full">
                                                    <div className="flex">
                                                        <HiOutlineInformationCircle className="mt-1 mr-2" />No se ha subido ningún documento
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </div>
                                    <div className="w-1/3 px-4">
                                        <UploadArea
                                            onUpload={onUploadDocuments}
                                            height="320px"
                                            maxFiles={10}
                                            fileTypes={["text/*", "application/*"]}
                                            location={"procedures/tasks"}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )
                }
            </div>
            {
                isOpenTechniciansModal ? (
                    <CategoryTechniciansModal openModal={isOpenTechniciansModal} closeModal={() => setIsOpenTechniciansModal(false)} technicians={categoryTechnicians} onTechniciansSelected={(data) => afterAssignTechnicians(data)} />
                ) : null
            }
        </>
    )
}