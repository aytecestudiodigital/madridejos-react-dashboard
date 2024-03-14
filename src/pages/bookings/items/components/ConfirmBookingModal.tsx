/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Modal, Spinner } from "flowbite-react";
import { t } from "i18next";
import { useContext, useEffect, useState } from "react";
import {
  getOneRow,
  insertRow,
  updateRow,
} from "../../../../server/supabaseQueries";
import { AlertContext } from "../../../../context/AlertContext";
import axios from "axios";

interface ConfirmBookingModalProps {
  openModal: boolean;
  closeModal: (state: boolean) => void;
  onSessions: (sessions: any) => void;
  booking: any;
  paymentMethod: any;
  defaultSessions: any;
}

export function ConfirmBookingModal({
  openModal,
  closeModal,
  booking,
  defaultSessions,
  paymentMethod,
  onSessions,
}: ConfirmBookingModalProps) {
  const [isOpen, setOpen] = useState(false);
  const [userBooking, setUserBooking] = useState<any>("");
  const [courtBooking, setCourtBooking] = useState<any>("");
  const tableBookings = import.meta.env.VITE_TABLE_BOOKINGS;
  const tableBookingsSessions = import.meta.env.VITE_TABLE_BOOKINGS_SESSIONS;
  const tableUsers = import.meta.env.VITE_TABLE_USERS;
  const tableBookingsItems = import.meta.env.VITE_TABLE_BOOKINGS_ITEMS;
  const [htmlToRender, setHtmlToRender] = useState<any>(null);
  const [paymentActive, setPaymentActive] = useState(false);
  const [paymentMethodData, setPaymentMethodData] = useState<any>(null);
  const { openAlert } = useContext(AlertContext);
  const [loading, setLoading] = useState(false);

  const close = () => {
    setOpen(false);
    closeModal(true);
  };

  useEffect(() => {
    setOpen(openModal);
    const fetch = async () => {
      const user = await getOneRow("id", booking.user_id, tableUsers);
      const court = await getOneRow(
        "id",
        booking.bookings_items_id,
        tableBookingsItems,
      );
      const paymentDb = await getOneRow(
        "id",
        paymentMethod,
        "payments_methods",
      );
      setPaymentMethodData(paymentDb);
      setUserBooking(user);
      setCourtBooking(court);
    };
    fetch();
  }, [openModal]);

  const confirmBooking = async () => {
    booking.state = "PENDING";
    const bookingData = await insertRow(booking, tableBookings);
    defaultSessions.forEach(async (session: any) => {
      const newSession = {
        id: session.id,
        date: session.date,
        bookings_item_id: session.bookings_item_id,
        bookings_state_id: session.bookings_state_id,
        price: session.price,
        duration: session.duration,
        bookings_id: bookingData.id,
        price_light: session.price_light,
        selected: session.selected,
        light: session.light,
      };
      await updateRow(newSession, tableBookingsSessions);
    });
    const paymentRecord = {
      user_id: booking.user_id,
      state: "PENDING",
      amount: booking.price,
      payment_method_id: paymentMethod,
      payment_account_id: courtBooking.payments_account_id,
      total_payments: 1,
      card_id: null,
      record_id: bookingData.id,
      module: "BOOKINGS",
    };
    const paymentRecordData = await insertRow(paymentRecord, "payments_orders");
    if (paymentRecordData) {
      const payment = {
        payments_order_id: paymentRecordData.id,
        state: "PENDING",
        amount: booking.price,
        collection_date: new Date(),
        redsys_order: null,
        redsys_message_result: null,
        product_id: paymentRecordData.record_id,
      };
      const paymentData = await insertRow(payment, "payments");

      if (paymentMethodData.type === "TPV") {
        setPaymentActive(true);
        setLoading(true);
        const config = {
          method: "get",
          maxBodyLength: Infinity,
          url: `https://europe-west2-aymo-tomelloso.cloudfunctions.net/payments/tpv/redsys/["${paymentData.id}"]`,
          headers: {},
        };

        axios
          .request(config)
          .then((response) => {
            setHtmlToRender(response.data);
            setPaymentActive(true);
            setLoading(false);
            openAlert(t("SESSION_BOOKED_OK"), "insert");
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        openAlert(t("SESSION_BOOKED_OK"), "insert");
        onSessions(true);
        close();
      }
    }
  };

  return (
    <Modal
      dismissible
      onClose={() => close()}
      show={isOpen}
      size={"4xl"}
      className="z-40"
    >
      {!paymentActive ? (
        <>
          {!loading ? (
            <>
              <Modal.Header className="font-bold">
                {t("RESUME_PAYMENT_OPERATION")}
              </Modal.Header>
              <Modal.Body>
                <div className="">
                  <p className="mb-4">{t("CONFIRM_BOOKING_PAYMENTS")}</p>
                  <div className="divide-y p-2">
                    <div className="flex justify-between p-2">
                      <div className="font-bold">
                        <p>{t("STATE")}</p>
                      </div>
                      <div>
                        <p>{t(booking.state)}</p>
                      </div>
                    </div>
                    <div className="flex justify-between p-2">
                      <div className="font-bold">
                        <p>{t("ORDER")}</p>
                      </div>
                      <div>
                        <p>{new Date().valueOf()}</p>
                      </div>
                    </div>
                    <div className="flex justify-between p-2">
                      <div className="font-bold">
                        <p>{t("RESPONSIBLE")}</p>
                      </div>
                      <div>
                        <p>
                          {userBooking.name} {userBooking.surname}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between p-2">
                      <div className="font-bold">
                        <p>{t("ORDER_CONCEPT")}</p>
                      </div>
                      <div>
                        <p>{t("INSTALLATION_BOOKING")}</p>
                      </div>
                    </div>
                    <div className="flex justify-between p-2">
                      <div className="font-bold">
                        <p>{t("PRODUCT")}</p>
                      </div>
                      <div>
                        <p>{courtBooking.title}</p>
                      </div>
                    </div>
                    <div className="flex justify-between p-2">
                      <div className="font-bold">
                        <p>{t("AMOUNT")}</p>
                      </div>
                      <div>
                        <p>{booking.price} €</p>
                      </div>
                    </div>
                    <div className="flex justify-between p-2">
                      <div className="font-bold">
                        <p>{t("ADMINISTRATOR")}</p>
                      </div>
                      <div>
                        <p>{t("ADMINISTRATOR")}</p>
                      </div>
                    </div>
                    <div className="flex justify-between p-2">
                      <div className="font-bold">
                        <p>{t("PAYMENT_METHOD")}</p>
                      </div>
                      <div>
                        <p>{paymentMethod}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Modal.Body>
              <div className="flex justify-end p-4">
                <Button onClick={confirmBooking}>{t("CONFIRM_PAYMENT")}</Button>
              </div>
            </>
          ) : null}
        </>
      ) : (
        <>
          {loading ? (
            <div className="flex justify-center p-12">
              <Spinner />
            </div>
          ) : (
            <div
              className="max-h-96 overflow-auto"
              dangerouslySetInnerHTML={{ __html: htmlToRender }}
            ></div>
          )}
        </>
      )}
    </Modal>
  );
}
