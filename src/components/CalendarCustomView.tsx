/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Pagination, Select, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { supabase } from "../server/supabase";
import { t } from "i18next";
import BookingDetailsModal from "./BookingDetailsModal";
import { HiOutlineInformationCircle } from "react-icons/hi";
import { Navigate } from "react-big-calendar";
import * as dates from "date-arithmetic";

export function BookingsView() {
  const [bookings, setBookings] = useState<any[] | null>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(20);
  const [initRange, setInitRange] = useState(1);
  const [endRange, setEndRange] = useState(pageSize);

  const [totalItems, setTotalItems] = useState<number>(0);
  const [item, setItem] = useState<any[]>(BookingsView.item);
  const [isOpen, setIsOpen] = useState(false);
  const [booking, setBooking] = useState<any>();
  const tableBookings = import.meta.env.VITE_TABLE_BOOKINGS;

  useEffect(() => {
    setItem(BookingsView.item);
    setCurrentPage(1);
  }, [BookingsView.item]);

  useEffect(() => {
    const fetchData = async () => {
      setInitRange((currentPage - 1) * pageSize + 1);
      setEndRange(currentPage * pageSize);

      await getData2();
    };
    fetchData();
  }, [currentPage, pageSize, item]);

  const getData2 = async () => {
    if (item[0] && item.length > 0) {
      const initRange1: number = (currentPage - 1) * pageSize;
      const endRange1: number = pageSize * currentPage - 1;
      const itemsId: string[] = [];

      item.forEach((element: any) => {
        itemsId.push(element.id);
      });
      const { data } = await supabase.rpc("bookings_info_by_items", {
        bookings_items_ids_param: itemsId,
        init_range: initRange1,
        end_range: endRange1,
      });

      setTotalItems(data ? data.count : 0);
      setTotalPages(Math.ceil(data!.count / pageSize));
      setBookings(data ? data.data : null);
    } else if (item.length === 0) {
      const initRange1: number = (currentPage - 1) * pageSize;
      const endRange1: number = pageSize * currentPage - 1;
      const { data, count } = await supabase
        .from(tableBookings)
        .select(
          `*,users!bookings_user_id_fkey(name, surname),bookings_items(id,title) `,
          { count: "exact" },
        )
        .order("date", { ascending: false })
        .range(initRange1, endRange1);
      data?.forEach((booking) => {
        booking.name = booking.users.name;
        booking.surname = booking.users.surname;
        booking.title = booking.bookings_items.title;
      });
      setTotalItems(count!);
      setTotalPages(Math.ceil(count! / pageSize));
      setBookings(data);
    } else if (item[0] === "Vacía") {
      setBookings([]);
    }
  };

  const changeSize = (count: number) => {
    setCurrentPage(1);
    setPageSize(count);
  };

  const openModal = (data: any) => {
    setBooking(data);
    setIsOpen(true);
  };

  const closeModal = async () => {
    setIsOpen(false);
  };

  return (
    <>
      {bookings && bookings.length > 0 ? (
        <>
          <Card className="h-full mt-4 overflow-auto">
            <div className="overflow-auto">
              <Table>
                <Table.Head className="">
                  <Table.HeadCell>{t("DATE")}</Table.HeadCell>
                  <Table.HeadCell>{t("DURATION")}</Table.HeadCell>
                  <Table.HeadCell>{t("USER")}</Table.HeadCell>
                  <Table.HeadCell>{t("COURT")}</Table.HeadCell>
                  <Table.HeadCell>{t("STATE")}</Table.HeadCell>
                </Table.Head>
                <Table.Body>
                  {bookings.map((booking, index) => (
                    <Table.Row
                      key={index}
                      className="cursor-pointer font-bold hover:bg-gray-200"
                      onClick={() => openModal(booking)}
                    >
                      <Table.Cell>
                        {new Date(booking.date).toLocaleDateString()}
                      </Table.Cell>
                      <Table.Cell>{booking.duration}</Table.Cell>
                      <Table.Cell>
                        {booking.name} {booking.surname}
                      </Table.Cell>
                      <Table.Cell>{booking.title}</Table.Cell>
                      <Table.Cell>{t(booking.state)}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          </Card>

          <div className="flex justify-between mt-2 mx-4 items-center">
            <div className="flex items-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
                showIcons
                previousLabel={t("PAGINATION_PREV_PAGE")}
                nextLabel={t("PAGINATION_NEXT_PAGE")}
                className="mb-2"
              />
              <Select
                className="ml-4"
                id="pageSize"
                value={pageSize}
                onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                  changeSize(Number(event.target.value))
                }
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="1000">1000</option>
              </Select>
            </div>
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-4">
              {t("PAGINATION_SHOWING")}&nbsp;
              <span className="font-semibold text-gray-900 dark:text-white">
                {initRange}-{endRange}
              </span>
              &nbsp;{t("PAGINATION_OF")}&nbsp;
              <span className="font-semibold text-gray-900 dark:text-white">
                {totalItems}
              </span>
            </span>
          </div>
        </>
      ) : (
        <div className="flex self-center items-center m-auto">
          <HiOutlineInformationCircle className="mr-2 h-12 w-6" />
          <p>{t("BOOKINGS_NOT_FOUND")}</p>
        </div>
      )}
      {isOpen ? (
        <BookingDetailsModal
          closeModal={closeModal}
          openModal={isOpen}
          booking={booking}
        />
      ) : null}
    </>
  );
}

BookingsView.range = (date: any, { localizer }: any) => {
  const start = date;
  const end = dates.add(start, 2, "day");

  let current = start;
  const range = [];

  while (localizer.lte(current, end, "day")) {
    range.push(current);
    current = localizer.add(current, 1, "day");
  }

  return range;
};

BookingsView.navigate = (date: any, action: any, { localizer }: any) => {
  switch (action) {
    case Navigate.PREVIOUS:
      return localizer.add(date, -1, "day");

    case Navigate.NEXT:
      return localizer.add(date, 1, "day");

    default:
      return date;
  }
};

BookingsView.title = () => {
  return `Reservas realizadas`;
};

/**
 * @type {unknown}
 */
BookingsView.item = [] as any[];
