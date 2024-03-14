/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTranslation } from "react-i18next";
import { LuInfo } from "react-icons/lu";
import BookingsCalendar from "../../../../components/BookingsCalendar";

interface InstallationBookingsCardProps {
  items: any;
  states: any;
}
export const InstallationBookingsCard = ({
  items,
  states,
}: InstallationBookingsCardProps) => {
  const { t } = useTranslation();

  return (
    <>
      <h3 className="text-xl font-bold dark:text-white mb-4 p-1">
        {t("INSTALLATION_PAGE_BOOKING_CARD_TITLE")}
      </h3>
      <div className="h-full p-1 ">
        {items.length > 0 ? (
          <>
            <div>
              <BookingsCalendar
                defaultView="week"
                component="installation_item"
                item={items}
                states={states}
                installation={""}
              />
            </div>
          </>
        ) : (
          <div className="flex justify-center">
            <LuInfo size={25} className="mr-2 " />
            <p className="text-center">
              No hay ningún item de instalación creado
            </p>
          </div>
        )}
      </div>
    </>
  );
};
