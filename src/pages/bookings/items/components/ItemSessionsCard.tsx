/* eslint-disable @typescript-eslint/no-explicit-any */
import BookingsCalendar from "../../../../components/BookingsCalendar";

interface ItemSessionsCardProps {
  item: any;
  installationStates: any;
  installation: any;
}

export const ItemSessionsCard = ({
  item,
  installationStates,
  installation,
}: ItemSessionsCardProps) => {



  return (
    <div className="mt-2">
      <BookingsCalendar
        defaultView="month"
        component="installation_item"
        item={item ? [item] : []}
        states={installationStates}
        installation={installation}
      />
    </div>

  );
};
