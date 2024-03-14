/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Label, Modal } from "flowbite-react";
import { t } from "i18next";
import { useEffect, useState } from "react";
import {
  getOneRow,
  getRowByColumn,
  updateRow,
} from "../../../../server/supabaseQueries";
import StateComponent from "../../../../components/ListPage/StatesComponent";
import { HiTrash } from "react-icons/hi";

interface TicketModalProps {
  openModal: boolean;
  closeModal: () => void;
  item: any;
  onUpdateTicket: () => void;
}

export const TicketModal = (props: TicketModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [aditionalData, setAditionalData] = useState<any[]>([]);
  const [ticketDb, setTicketDb] = useState<any>(null);

  useEffect(() => {
    setIsOpen(props.openModal);
  }, [props.openModal]);

  const close = () => {
    setIsOpen(false);
    props.closeModal();
  };

  useEffect(() => {
    const fetchData = async () => {
      const ticketDb = await getRowByColumn(
        "ticket_record_id",
        props.item.id,
        "tickets_product_record",
      );
      const productDb = await getOneRow("id", props.item.id, "tickets_records");
      if (productDb) {
        setTicketDb(productDb);
      }
      if (ticketDb[0]) {
        if (
          ticketDb[0].additional_data &&
          ticketDb[0].additional_data.length > 0
        ) {
          setAditionalData(ticketDb[0].additional_data);
        }
      }
    };
    fetchData();
  }, [props.item]);

  const updateTicket = async () => {
    ticketDb.state = "CANCELED";
    await updateRow(ticketDb, "tickets_records");
    close();
    props.onUpdateTicket();
    props.closeModal();
  };

  return (
    <Modal size={"2xl"} dismissible onClose={() => close()} show={isOpen}>
      <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
        {props.item.type === "TICKET" ? (
          <strong>Datos de la entrada</strong>
        ) : (
          <strong>Datos del abono</strong>
        )}
      </Modal.Header>
      <Modal.Body className="max-h-[60vh]">
        <div className="flex justify-between mb-4 mr-4">
          <div>
            {props.item.formalisation_date ? (
              <div style={{ display: "flex", alignItems: "center" }}>
                <Label style={{ marginRight: "10px" }}>
                  Fecha de formalización:
                </Label>
                <p className="flex flex-grow">
                  {new Date(props.item.formalisation_date).toLocaleString()}
                </p>
              </div>
            ) : (
              <div>
                <Label style={{ marginRight: "10px" }}>
                  Fecha de formalización:
                </Label>
                <p className="flex flex-grow">No definida</p>
              </div>
            )}

            <div style={{ display: "flex", alignItems: "center" }}>
              <Label style={{ marginRight: "10px" }}>Realizada por:</Label>
              <p>
                {props.item.owner_name && props.item.owner_surname
                  ? props.item.owner_name + " " + props.item.owner_surname
                  : "No definido"}
              </p>
            </div>
          </div>

          <div>
            <StateComponent state={props.item.state} />
          </div>
        </div>

        <div className="border border-gray-200 dark:border-gray-700"></div>
        <div className="mt-4">
          <strong className="text-blue-800 font-semibold">
            DETALLES DEL ABONO:
          </strong>
          <div>
            <div
              className="px-4 pt-4"
              style={{ display: "flex", alignItems: "center" }}
            >
              <Label htmlFor="order_amount" style={{ marginRight: "10px" }}>
                Título:
              </Label>
              <p>{props.item.tickets_products_title}</p>
            </div>

            <div
              className="px-4"
              style={{ display: "flex", alignItems: "center" }}
            >
              <Label htmlFor="method_title" style={{ marginRight: "10px" }}>
                Evento:
              </Label>
              <p>{props.item.tickets_title}</p>
            </div>
            <div
              className="px-4 mb-4"
              style={{ display: "flex", alignItems: "center" }}
            >
              <Label htmlFor="method_title" style={{ marginRight: "10px" }}>
                Precio:
              </Label>
              <p>{props.item.price + " " + "€"}</p>
            </div>
          </div>
          <div className="border border-gray-200 dark:border-gray-700"></div>
          <div className="mt-4">
            <strong className="text-blue-800 font-semibold">
              DATOS DEL TITULAR:
            </strong>
            <div
              className="px-4 pt-4"
              style={{ display: "flex", alignItems: "center" }}
            >
              <Label htmlFor="method_title" style={{ marginRight: "10px" }}>
                Nombre:
              </Label>
              <p>
                {props.item.owner_name && props.item.owner_surname
                  ? props.item.owner_name + " " + props.item.owner_surname
                  : "No definido"}
              </p>
            </div>

            <div
              className="px-4"
              style={{ display: "flex", alignItems: "center" }}
            >
              <Label htmlFor="method_title" style={{ marginRight: "10px" }}>
                Documento:
              </Label>
              <p>
                {props.item.owner_nif ? props.item.owner_nif : "No definido"}
              </p>
            </div>

            <div
              className="px-4"
              style={{ display: "flex", alignItems: "center" }}
            >
              <Label htmlFor="method_title" style={{ marginRight: "10px" }}>
                Email:
              </Label>
              <p>
                {props.item.owner_email
                  ? props.item.owner_email
                  : "No definido"}
              </p>
            </div>

            <div
              className="px-4 mb-4"
              style={{ display: "flex", alignItems: "center" }}
            >
              <Label htmlFor="method_title" style={{ marginRight: "10px" }}>
                Teléfono:
              </Label>
              <p>
                {props.item.owner_phone
                  ? props.item.owner_phone
                  : "No definido"}
              </p>
            </div>
          </div>
          {aditionalData.length > 0 ? (
            <>
              <div className="border border-gray-200 dark:border-gray-700"></div>
              <div className="mt-4">
                <strong className="text-blue-800 font-semibold">
                  CAMPOS ADICIONALES:
                </strong>
                <div className="mt-2">
                  {aditionalData.map((field, index) => (
                    <div key={index} className="mt-4">
                      <div
                        className="px-4"
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <Label
                          htmlFor="order_amount"
                          style={{ marginRight: "10px" }}
                        >
                          Título:
                        </Label>
                        <p>{field.title}</p>
                      </div>
                      <div
                        className="px-4"
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <Label
                          htmlFor="order_amount"
                          style={{ marginRight: "10px" }}
                        >
                          Valor:
                        </Label>
                        <p>{field.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          size="sm"
          className=""
          color="light"
          onClick={() => updateTicket()}
        >
          <div className="flex items-center gap-x-2 text-red-500">
            <HiTrash className="text-xs text-red-500" />
            Anular {t(props.item.type)}
          </div>
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
