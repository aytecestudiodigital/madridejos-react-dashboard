import { Breadcrumb } from "flowbite-react";
import BookingsCalendar from "../../../../components/BookingsCalendar";
import { HiHome } from "react-icons/hi";
import { t } from "i18next";
import { RootState } from "../../../../store/store";
import { useSelector } from "react-redux";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlertContext } from "../../../../context/AlertContext";

export default function BookingsList() {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const { openAlert } = useContext(AlertContext);

  useEffect(() => {
    if (user) {
      if (!user.users_roles.rules.bookings.bookings.access_module) {
        openAlert("No tienes acceso a esta página", "error");
        navigate("/");
      }
    }
  }, [user]);
  return (
    <>
      <div className="p-block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
        <div className="mb-1 w-full">
          <Breadcrumb className="mb-4 mt-2">
            <Breadcrumb.Item href="/">
              <div className="flex items-center gap-x-3">
                <HiHome className="text-xl" />
                <span className="dark:text-white">{t("HOME")}</span>
              </div>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{t("BOOKINGS")}</Breadcrumb.Item>
          </Breadcrumb>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
            {t("BOOKINGS_LIST")}
          </h1>
        </div>
      </div>
      <div className="p-4">
        <BookingsCalendar
          installation={""}
          defaultView="agenda"
          component="bookings"
          item={[]}
          states={[]}
        />
      </div>
    </>
  );
}
