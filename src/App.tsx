import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "semantic-ui-css/components/placeholder.min.css";
import FlowbiteWrapper from "./components/flowbite-wrapper";
import NotFoundPage from "./pages/common/404";
import DashboardPage from "./pages/dashboard/DashboardPage";
import { MainPage } from "./pages/dashboard/MainPage";
import SignInPage from "./pages/login/LoginPage";
import UserListPage from "./pages/users/views/UsersListPage";

import "semantic-ui-css/components/placeholder.min.css";

import "semantic-ui-css/components/placeholder.min.css";
import GroupsPage from "./pages/users/views/GroupsPage";
import PermissionsPage from "./pages/users/views/PermissionsPage";
import RolesPage from "./pages/users/views/RolesPage";

import "semantic-ui-css/components/placeholder.min.css";

import EntitiesListPage from "./pages/content/entities/EntitiesPage";
import ContentPage from "./pages/content/articles/views/ContentPage";
import CategoriesPage from "./pages/content/categories/views/CategoriesPage";
import CategoryPage from "./pages/content/categories/views/CategoryPage";
import EditContentPage from "./pages/content/articles/views/EditContentPage";
import { ContentProvider } from "./pages/content/context/contentProvider";
import ProjectsPage from "./pages/tasks/projects/views/ProjectsPage";
import EditProjectPage from "./pages/tasks/projects/views/EditProjectPage";
import { TasksPage } from "./pages/tasks/tasks/views/TasksPage";
import { TaskDetailsPage } from "./pages/tasks/tasks/views/TaskDetailsPage";
import { NotificationsListPage } from "./pages/communications/notifications/views/NotificationsListPage";
import { AlertsListPage } from "./pages/communications/alerts/views/AlertsListPage";
import { EmailsListPage } from "./pages/communications/emails/views/EmailsListPage";

export default function App() {
  //TODO: Revisar bien las rutas privadas y públicas

  const router = createBrowserRouter([
    {
      path: "",
      element: <FlowbiteWrapper />,
      errorElement: <NotFoundPage />,
      children: [
        {
          path: "/login",
          element: <SignInPage />,
        },
        {
          path: "",
          element: <DashboardPage />,
          children: [
            {
              errorElement: <NotFoundPage />,
              children: [
                {
                  path: "",
                  element: <MainPage />,
                },

                {
                  path: "users",
                  element: <UserListPage />,
                },
                {
                  path: "users/groups",
                  element: <GroupsPage />,
                },
                {
                  path: "users/roles",
                  element: <RolesPage />,
                },
                {
                  path: "users/roles/permissions/:id",
                  element: <PermissionsPage />,
                },

                {
                  path: "content",
                  element: (
                    <ContentProvider>
                      <ContentPage />
                    </ContentProvider>
                  ),
                },
                {
                  path: "content/new",
                  element: <EditContentPage />,
                },
                {
                  path: "content/:id",
                  element: <EditContentPage />,
                },
                {
                  path: "content/categories",
                  element: (
                    <ContentProvider>
                      <CategoriesPage />
                    </ContentProvider>
                  ),
                },
                {
                  path: "content/categories/:id",
                  element: <CategoryPage />,
                },
                {
                  path: "content/entities",
                  element: <EntitiesListPage />,
                },
                {
                  path: "content/templates",
                  element: <MainPage />,
                },

                {
                  path: "users/roles/permissions/:id",
                  element: <PermissionsPage />,
                },
                /* {
                  path: "bookings",
                  element: <BookingsList />,
                },
                {
                  path: "bookings/installations",
                  element: <InstallationsListPage />,
                },
                {
                  path: "bookings/installations/:id",
                  element: <InstallationPage />,
                },
                {
                  path: "bookings/installations/new",
                  element: <InstallationPage />,
                },
                {
                  path: "bookings/installations/:id/item/new",
                  element: (
                    <ItemProvider>
                      <ItemPage />
                    </ItemProvider>
                  ),
                },
                {
                  path: "bookings/installations/:id/item/:itemId",
                  element: (
                    <ItemProvider>
                      <ItemPage />
                    </ItemProvider>
                  ),
                }, */
                /* {
                  path: "access-control",
                  element: <AccessControlPage />,
                }, */
                /* {
                  path: "/payments/methods",
                  element: <PaymentsMethodsPage />,
                },
                {
                  path: "/payments/accounts",
                  element: <PaymentsAccountPage />,
                },
                {
                  path: "/payments",
                  element: <PaymentsListPage />,
                }, */
                /* {
                  path: "inscriptions/normal",
                  element: <NormalInscriptionPage />,
                },
                {
                  path: "inscriptions/normal/new",
                  element: (
                    <InscriptionFormProvider>
                      <EditNormalInscriptionsPage />
                    </InscriptionFormProvider>
                  ),
                },
                {
                  path: "inscriptions/normal/:id",
                  element: (
                    <InscriptionFormProvider>
                      <EditNormalInscriptionsPage />
                    </InscriptionFormProvider>
                  ),
                },
                {
                  path: "inscriptions/normal/records/:id",
                  element: <NormalInscriptionRecords />,
                }, */
                {
                  path: "tasks",
                  element: <TasksPage />,
                },
                {
                  path: "tasks/new",
                  element: <TaskDetailsPage />,
                },
                {
                  path: "tasks/:id",
                  element: <TaskDetailsPage />,
                },
                {
                  path: "tasks/projects",
                  element: <ProjectsPage />,
                },
                {
                  path: "tasks/projects/new",
                  element: <EditProjectPage />,
                },
                {
                  path: "tasks/projects/:id",
                  element: <EditProjectPage />,
                },
                /* {
                  path: "tickets/events",
                  element: <EventsListPage />,
                },
                {
                  path: "tickets/events/new",
                  element: (
                    <EventProvider>
                      <EditEventPage />
                    </EventProvider>
                  ),
                },
                {
                  path: "tickets/events/:id",
                  element: (
                    <EventProvider>
                      <EditEventPage />
                    </EventProvider>
                  ),
                },
                {
                  path: "tickets",
                  element: <TicketsListPage />,
                }, */
                {
                  path: "communications/notifications",
                  element: <NotificationsListPage />,
                },
                {
                  path: "communications/alerts",
                  element: <AlertsListPage />,
                },
                {
                  path: "communications/emails",
                  element: <EmailsListPage />,
                },
              ],
            },
          ],
        },
      ],
    },
  ]);

  /* useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        const userDb = await supabase.from('users').select("*, users_roles!users_role_fkey(*)").eq('uid', session.user.id)
        if (userDb && userDb.data) {
          const user = userDb.data[0]
          dispatch(login({ session, user }));
        }
      } else {
        dispatch(logout({}));
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        const userDb = await supabase.from('users').select("*, users_roles!users_role_fkey(*)").eq('uid', session.user.id)
        if (userDb && userDb.data) {
          const user = userDb.data[0]
          dispatch(login({ session, user }));
        }
      } else {
        dispatch(logout({}));
      }
    });

    return () => subscription.unsubscribe();
  }, []); */

  return <RouterProvider router={router} />;
}
