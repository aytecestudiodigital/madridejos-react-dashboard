import {
  DarkThemeToggle,
  Dropdown,
  Navbar,
  useTheme
} from "flowbite-react";
import { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { HiMenuAlt1, HiOutlineLogout, HiSearch, HiX } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSidebarContext } from "../context/SidebarContext";
import isSmallScreen from "../helpers/is-small-screen";
import { singout } from "../store/auth/thunks";
import { AppDispatch, RootState } from "../store/store";

export default function NavbarComponent() {
  const { isOpenOnSmallScreens, isPageWithSidebar, setOpenOnSmallScreens } =
    useSidebarContext();
  const { t } = useTranslation();
  const { mode } = useTheme();
  const isDarkTheme = mode === "dark";
  return (
    <Navbar fluid>
      <div className="w-full p-2 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {isPageWithSidebar && (
              <button
                onClick={() => setOpenOnSmallScreens(!isOpenOnSmallScreens)}
                className="mr-3 cursor-pointer rounded p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white lg:inline"
              >
                <span className="sr-only">Toggle sidebar</span>
                {isOpenOnSmallScreens && isSmallScreen() ? (
                  <HiX className="h-6 w-6" />
                ) : (
                  <HiMenuAlt1 className="h-6 w-6" />
                )}
              </button>
            )}
            <Navbar.Brand href="/">
              <img
                alt="Aymo, tu ayuntamiento en el móvil"
                src={
                  isDarkTheme
                    ? "/images/logos/AYMO_Logo_RGB_negativo_A.svg"
                    : "/images/logos/AYMO_Logo_RGB_positivo.svg"
                }
                className="mr-3 h-6 sm:h-14"
              />
            </Navbar.Brand>
            {/*   <form className="ml-16 hidden md:block">
              <Label htmlFor="search" className="sr-only">
                {t("SEARCH")}
              </Label>
              <TextInput
                icon={HiSearch}
                id="search"
                name="search"
                placeholder={t("SEARCH")}
                required
                size={32}
                type="search"
              />
            </form> */}
          </div>
          <div className="flex items-center lg:gap-3">
            <div className="flex items-center">
              <button
                onClick={() => setOpenOnSmallScreens(!isOpenOnSmallScreens)}
                className="cursor-pointer rounded p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:ring-2 focus:ring-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:bg-gray-700 dark:focus:ring-gray-700 lg:hidden"
              >
                <span className="sr-only">{t("SEARCH")}</span>
                <HiSearch className="h-6 w-6" />
              </button>
              <Toaster />
              <DarkThemeToggle />
            </div>
            <div className="hidden lg:block">
              <UserDropdown />
            </div>
          </div>
        </div>
      </div>
    </Navbar>
  );
}

export function UserDropdown() {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector((state: RootState) => state.auth.user);

  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(singout());
    navigate("/login", { replace: true });
  };

  return (
    <Dropdown
      arrowIcon={false}
      inline
      label={
        <span>
          <span className="sr-only">User menu</span>
          <img src="/public/images/logos/logo-vector-ayuntamiento-de-madridejos.jpg" className="h-10 w-auto rounded-3xl" alt="" />
          {/* <Avatar
            alt=""
            img="/public/images/logos/logo-vector-ayuntamiento-de-madridejos.jpg"
            rounded
            size="sm"
            className="bg-cover"
          /> */}
        </span>
      }
    >
      <Dropdown.Header>
        <span className="block text-sm">{user?.name}</span>
        <span className="block truncate text-sm font-medium">
          {user?.email}
        </span>
      </Dropdown.Header>
      <Dropdown.Item className="font-bold" onClick={handleLogout}>
        <HiOutlineLogout className="mr-3 h-4 w-4" />
        {t("LOGOUT")}
      </Dropdown.Item>
    </Dropdown>
  );
}
