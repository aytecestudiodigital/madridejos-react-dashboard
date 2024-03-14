/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListPageWithPagination from "../../../../components/ListPage/ListPageWithPagination";
import { AlertContext } from "../../../../context/AlertContext";
import { getAll } from "../../../../server/supabaseQueries";
import { getTasks } from "../data/TasksProvider";

export const TasksPage = () => {
  const navigate = useNavigate();
  const entity_table = "tasks";
  const columns = [
    "title",
    "state",
    "priority",
    "category_title",
    "project_title",
    "created_at",
  ];
  const columnsFilters = ["title", "created_at"];
  const columnsDropdown = ["category_title"];
  const sencondDolumnsDropdown = ["project_title"];
  const thirdDolumnsDropdown = ["state"];
  const thirdDataDropdown = [
    "CREATED",
    "ASSIGNED",
    "OPEN",
    "IN_PROGRESS",
    "VALIDATED",
    "REOPEN",
    "CANCELLED",
    "CLOSED",
  ];
  const fourthColumnsDropdown = ["priority"];
  const fourthDataDropdown = [
    { title: "Baja", id: 0 },
    { title: "Normal", id: 1 },
    { title: "Alta", id: 2 },
    { title: "Urgente", id: 3 },
  ];
  const page_title = "TASKS_PANEL";
  const breadcrumb = [
    {
      title: "TASKS_PANEL",
    },
  ];

  /**
   * Definición de datos
   */
  const { openAlert } = useContext(AlertContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);

  /**
   * Buscador y ordenación
   */
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [itemSearch, setItemSearch] = useState(false);

  const [orderBy, setOrderBy] = useState<string>("created_at");
  const [orderDir, setOrderDir] = useState<string>("DESC");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [totalPages, setTotalPages] = useState<number>(0);

  const [totalItems, setTotalItems] = useState<number>(0);

  const [initRange, setInitRange] = useState(1);
  const [endRange, setEndRange] = useState(pageSize);

  const [alertMsg] = useState("");
  const [actionAlert] = useState("");
  const [totalTasksCategories, setTotalTasksCategories] = useState<any[]>([]);
  const [totalTasksProjects, setTotalTasksProjects] = useState<any[]>([]);
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [projectFilters, setProjectFilters] = useState<string[]>([]);
  const [priorityFilters, setPriorityFilters] = useState<number[]>([]);

  const user = JSON.parse(localStorage.getItem("userLogged")!);

  let showAll: boolean;
  let userGroup: string | null;
  let userCreatedBy: string;

  useEffect(() => {
    if (user) {
      if (!user.users_roles.rules.tasks.tasks.access_module) {
        openAlert("No tienes acceso a esta página", "error");
        navigate("/");
      } else {
        userCreatedBy = user.id;
        userGroup = null;
        showAll = user.users_roles.rules.tasks.tasks.read;
      }
    }
  }, [user]);

  useEffect(() => {
    setInitRange((currentPage - 1) * pageSize + 1);
    setEndRange(currentPage * pageSize);
    setLoading(true);
    if (
      itemSearch ||
      categoryFilters.length > 0 ||
      projectFilters.length > 0 ||
      statusFilters.length > 0 ||
      priorityFilters.length > 0
    ) {
      search(currentPage);
    } else {
      const fetchData = async () => {
        getDataFromServer(orderBy, orderDir, currentPage, pageSize);
        const categoriesDb = await getAll("tasks_projects_categories");
        const projectsDb = await getAll("tasks_projects");
        if (categoriesDb) {
          if (categoriesDb.data && categoriesDb.data.length > 0) {
            setTotalTasksCategories(categoriesDb.data);
          }
        }
        if (projectsDb) {
          if (projectsDb.data && projectsDb.data.length > 0) {
            setTotalTasksProjects(projectsDb.data);
          }
        }
      };
      fetchData();
    }
    setLoading(false);
  }, [
    orderBy,
    orderDir,
    itemSearch,
    searchTerm,
    currentPage,
    pageSize,
    categoryFilters,
    projectFilters,
    statusFilters,
    priorityFilters,
  ]);

  const changeSize = (count: number) => {
    setCurrentPage(1);
    setPageSize(count);
  };

  const getDataFromServer = (
    orderBy: string,
    orderDir: string,
    page: number,
    size: number,
  ) => {
    setLoading(true);
    getTasks(
      page,
      size,
      orderBy,
      orderDir,
      userCreatedBy,
      showAll,
      userGroup,
      "",
    ).then((result: any) => {
      const { totalItems, data } = result;
      setData(data ? data : []);
      setTotalItems(totalItems);
      setTotalPages(Math.ceil(totalItems / pageSize));
      if (currentPage == totalPages) setEndRange(totalItems);
      setLoading(false);
    });
    setItemSearch(false);
  };

  const search = async (page: number) => {
    setInitRange((page - 1) * pageSize + 1);
    setEndRange(page * pageSize);
    setCategoryFilters(categoryFilters ? categoryFilters : []);
    setProjectFilters(projectFilters ? projectFilters : []);
    setStatusFilters(statusFilters ? statusFilters : []);
    setPriorityFilters(priorityFilters ? priorityFilters : []);
    const { totalItems, data } = await getTasks(
      currentPage,
      pageSize,
      orderBy,
      orderDir,
      userCreatedBy,
      showAll,
      userGroup,
      searchTerm,
      categoryFilters,
      projectFilters,
      statusFilters,
      priorityFilters,
    );

    setData(data ? data : []);
    setTotalItems(totalItems);
    setTotalPages(Math.ceil(totalItems / pageSize));
  };

  const clickOnItem = (item: any) => {
    navigate(`/tasks/${item.id}`);
  };

  const newItem = () => {
    navigate(`/tasks/new`);
  };

  const onSearch = async (
    searchTerm: string,
    orderBy: string,
    orderDir: string,
    categoryFilters?: string[],
    projectFilters?: string[],
    statusFilters?: string[],
    priorityFilters?: number[],
  ) => {
    setCurrentPage(1);
    setSearchTerm(searchTerm);
    setCategoryFilters(categoryFilters ? categoryFilters : []);
    setProjectFilters(projectFilters ? projectFilters : []);
    setStatusFilters(statusFilters ? statusFilters : []);
    setPriorityFilters(priorityFilters ? priorityFilters : []);
    setItemSearch(searchTerm !== "" ? true : false);
    setOrderBy(orderBy);
    setOrderDir(orderDir);
  };

  const onClearSearch = () => {
    setCurrentPage(1);
    setSearchTerm("");
    setItemSearch(false);
    setInitRange((currentPage - 1) * pageSize + 1);
    setEndRange(currentPage * pageSize);
  };

  return (
    <>
      <ListPageWithPagination
        page_title={page_title}
        entity_table={entity_table}
        columns={columns}
        columnsFilter={columnsFilters}
        breadcrumb={breadcrumb}
        onSearch={onSearch}
        onClearSearch={onClearSearch}
        newItem={newItem}
        data={data}
        loading={loading}
        clickOnItem={clickOnItem}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page: number) => setCurrentPage(page)}
        pageSize={pageSize}
        onChangeSize={changeSize}
        totalItems={totalItems}
        initRange={initRange}
        endRange={endRange}
        isOpen={openAlert}
        alertMsg={alertMsg}
        action={actionAlert}
        columnsDropdown={columnsDropdown}
        dataDropdown={totalTasksCategories}
        columnsSecondDropdown={sencondDolumnsDropdown}
        secondDataDropdown={totalTasksProjects}
        columnsThirdDropdown={thirdDolumnsDropdown}
        thirdDataDropdown={thirdDataDropdown}
        columnsFourthDropdown={fourthColumnsDropdown}
        fourthDataDropdown={fourthDataDropdown}
        disableAddButton={!user.users_roles.rules.tasks.tasks.create}
        showCleanFilter={false}
      />
    </>
  );
};
