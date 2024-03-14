/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Modal, TextInput } from "flowbite-react";
import { t } from "i18next";
import { useContext, useEffect, useState } from "react";
import { LuFileMinus } from "react-icons/lu";
import {
  getOneRow,
  getRowByColumn,
  updateRow,
} from "../server/supabaseQueries";
import { AlertContext } from "../context/AlertContext";

interface BookingDetailsModalProps {
  openModal: boolean;
  booking: any;
  closeModal: (state: boolean) => void;
}

export default function BookingDetailsModal({
  openModal,
  booking,
  closeModal,
}: BookingDetailsModalProps) {
  const [isOpen, setOpen] = useState(false);
  const { openAlert } = useContext(AlertContext);
  const [reason, setReason] = useState("");

  const close = () => {
    setOpen(false);
    closeModal(true);
  };

  useEffect(() => {
    setOpen(openModal);
  }, [openModal]);

  const cancelBooking = async () => {
    const sessions = await getRowByColumn(
      "bookings_id",
      booking.id,
      "bookings_sessions",
    );
    const defaultBooking = await getOneRow("id", booking.id, "bookings");
    for await (const session of sessions) {
      session.bookings_id = null;
      await updateRow(session, "bookings_sessions");
    }
    defaultBooking.state = "CANCELED";
    defaultBooking.reason = reason;
    await updateRow(defaultBooking, "bookings");
    openAlert("Reserva cancelada con éxito", "delete");
    close();
  };

  return (
    <Modal dismissible onClose={() => close()} show={isOpen} size={"lg"}>
      <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
        <strong>{t("BOOKING")}</strong>
      </Modal.Header>
      <Modal.Body className="divide-y">
        <div className="flex justify-between p-2">
          <p className="font-semibold">{t("USER")}:</p>
          <p>
            {booking.name} {booking.surname}
          </p>
        </div>
        <div className="flex justify-between p-2">
          <p className="font-semibold">{t("COURT")}:</p>
          <p>{booking.title}</p>
        </div>
        <div className="flex justify-between p-2">
          <p className="font-semibold">{t("DURATION")}:</p>
          <p>{booking.duration} minutos</p>
        </div>
        <div className="flex justify-between p-2">
          <p className="font-semibold">{t("DATE")}:</p>
          <p>{new Date(booking.date).toLocaleDateString()}</p>
        </div>
        <div className="flex justify-between p-2">
          <p className="font-semibold">{t("STATE")}:</p>
          <p>{t(booking.state)}</p>
        </div>
        <div className="flex pt-8 items-center">
          <p className="font-semibold mb-5">Concepto:</p>
          <div className="w-full ml-4">
            <TextInput onBlur={(e) => setReason(e.currentTarget.value)} />
            <p className="text-xs text-gray-500 mt-1">
              Si deseas cancelar la reserva, debes indicar un motivo
            </p>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="flex place-content-end">
        <Button
          disabled={reason === ""}
          size={"sm"}
          onClick={() => cancelBooking()}
          color="failure"
        >
          <LuFileMinus className="mr-1" /> {t("CANCEL_BOOKING")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
