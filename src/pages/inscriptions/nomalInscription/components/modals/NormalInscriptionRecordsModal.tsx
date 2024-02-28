/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Modal, Tabs } from "flowbite-react";
import { useEffect, useState } from "react";
import { supabase } from "../../../../../server/supabase";
import { deleteRow, getOneRow } from "../../../../../server/supabaseQueries";
import { DeleteModal } from "../../../../../components/DeleteModal";

interface NormalInscriptionRecordsModalProps {
  openModal: boolean;
  onCloseModal: (value: boolean) => void;
  item: any;
}

export const NormalInscriptionRecordsModal = (
  props: NormalInscriptionRecordsModalProps,
) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activities, setActivities] = useState<any[]>([]);
  const [authorizations, setAuthorizations] = useState<any[]>([]);
  const [paymentOrder, setPaymentOrder] = useState<any>(null);
  const [discounts, setDiscounts] = useState<any[]>([]);

  useEffect(() => {
    setIsOpen(props.openModal);
  }, [props.openModal]);

  useEffect(() => {
    if (props.item) {
      const fetchData = async () => {
        const authorizationsDb: any[] = [];
        const discountsDb: any[] = [];
        const recordProductsDb = await supabase
          .from("inscriptions_record_products")
          .select("*, inscriptions_products(title, price)")
          .eq("record_id", props.item.id);
        if (recordProductsDb.data) {
          setActivities(recordProductsDb.data);
        }
        if (props.item.authorizations && props.item.authorizations.length > 0) {
          for await (const authorization of props.item.authorizations) {
            const authorizationDb = await getOneRow(
              "id",
              authorization,
              "inscriptions_authorizations",
            );
            if (authorizationDb) {
              authorizationsDb.push(authorizationDb);
            }
          }
          setAuthorizations(authorizationsDb);
        }
        if (props.item.payment_order) {
          const paymentOrderDb = await getOneRow(
            "id",
            props.item.payment_order,
            "payments_order",
          );
          if (paymentOrderDb) {
            setPaymentOrder(paymentOrderDb);
          }
        }
        if (
          props.item.discounts_selected &&
          props.item.discounts_selected.length > 0
        ) {
          for await (const discount of props.item.discounts_selected) {
            const discountDb = await getOneRow(
              "id",
              discount,
              "inscriptions_discounts",
            );
            if (discountDb) {
              discountsDb.push(discountDb);
            }
          }
          setDiscounts(discountsDb);
        }
      };
      fetchData();
    }
  }, [props.item]);

  const close = (value: boolean) => {
    setIsOpen(false);
    props.onCloseModal(value);
  };

  const deleteRecord = async (item: any) => {
    const deletedItem = await deleteRow(item.id, "inscriptions_records");
    close(true);
    return deletedItem;
  };

  return (
    <Modal
      dismissible
      onClose={() => close(false)}
      show={isOpen}
      size={"2xl"}
      className="z-40"
    >
      <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
        <span className="font-bold">Registro:</span> {props.item.id}
      </Modal.Header>
      <Modal.Body className="max-h-[70vh] overflow-auto">
        <div className="mt-4 flex justify-between">
          <h1 className="text-xl font-bold text-blue-700">Estado</h1>
          <div className="">
            {props.item.state === "CONFIRMED" ? (
              <div className="container items-center flex flex-row max-w-max px-4 bg-green-300 rounded-full font-semibold">
                Confirmado
              </div>
            ) : props.item.state === "PENDING" ? (
              <div className="container items-center flex flex-row max-w-max px-4 bg-yellow-300 rounded-full font-semibold">
                Pendiente
              </div>
            ) : props.item.state === "IN_PROGRESS" ? (
              <div className="container items-center flex flex-row max-w-max px-4 bg-orange-300 rounded-full font-semibold">
                En proceso
              </div>
            ) : props.item.state === "CANCELED" ? (
              <div className="container items-center flex flex-row max-w-max px-4 bg-red-300 rounded-full font-semibold">
                Cancelado
              </div>
            ) : props.item.state === "COMPLETED" ? (
              <div className="container items-center flex flex-row max-w-max px-4 bg-green-300 rounded-full font-semibold">
                Completado
              </div>
            ) : props.item.state === "DENIED" ? (
              <div className="container items-center flex flex-row max-w-max px-4 bg-gray-300 rounded-full font-semibold">
                Denegado
              </div>
            ) : props.item.state === "ERROR" ? (
              <div className="container items-center flex flex-row max-w-max px-4 bg-black-300 rounded-full font-semibold">
                Error
              </div>
            ) : null}
          </div>
        </div>
        <div className="mt-4">
          <h1 className="text-xl font-bold text-blue-700 mb-2">Actividades</h1>
          {activities.length > 0 ? (
            activities.map((activity) => (
              <div
                key={activity.id}
                className="flex justify-between border-b p-2"
              >
                <div>
                  <p>{activity.inscriptions_products.title}</p>
                </div>
                <div>
                  <p>{activity.inscriptions_products.price} €</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center border-b p-2">No hay actividades</p>
          )}
        </div>
        <div className="mt-4">
          <h1 className="text-xl font-bold text-blue-700 mb-2">
            Autorizaciones
          </h1>
          {authorizations.length > 0 ? (
            authorizations.map((authorization) => (
              <div
                key={authorization.id}
                className="flex justify-start border-b p-2"
              >
                <p>{authorization.title}</p>
              </div>
            ))
          ) : (
            <p className="text-center border-b p-2">No hay autorizaciones</p>
          )}
        </div>
        <div className="mt-4">
          <h1 className="text-xl font-bold text-blue-700 mb-2">
            Datos del pago
          </h1>
          {paymentOrder ? (
            <div>Datos del payment</div>
          ) : (
            <div className="text-center border-b p-2">
              No se ha realizado ningún pago
            </div>
          )}
        </div>
        <div className="mt-4">
          <h1 className="text-xl font-bold text-blue-700 mb-2">Descuentos</h1>
          {discounts.length > 0 ? (
            discounts.map((discount) => (
              <div
                key={discount.id}
                className="flex justify-between border-b p-2"
              >
                <div>
                  <p>{discount.title}</p>
                </div>
                <div>
                  {discount.discount_type === "FIXED" ? (
                    <p>{discount.amount} €</p>
                  ) : (
                    <p>{discount.amount} %</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center border-b p-2">No se aplican descuentos</p>
          )}
        </div>
        <div className="mt-4">
          <h1 className="text-xl font-bold text-blue-700 mb-2">
            Datos del registro
          </h1>
          <Tabs.Group>
            <Tabs.Item title="Principal">
              {props.item.main_form && props.item.main_form.length > 0 ? (
                props.item.main_form.map((formData: any, index: number) => (
                  <div
                    key={index}
                    className="flex justify-start gap-4 mt-2 p-2 border-b"
                  >
                    <div>
                      <p className="font-bold">{formData.title}:</p>
                    </div>
                    <div>
                      <p>{formData.value}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center border-b p-2">
                  No hay datos del formulario
                </div>
              )}
            </Tabs.Item>
            <Tabs.Item title="Autorización">
              {props.item.auth_form && props.item.auth_form.length > 0 ? (
                props.item.auth_form.map((formData: any, index: number) => (
                  <div
                    key={index}
                    className="flex justify-start gap-4 mt-2 p-2 border-b"
                  >
                    <div>
                      <p className="font-bold">{formData.title}:</p>
                    </div>
                    <div>
                      <p>{formData.value}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center border-b p-2">
                  No hay datos del formulario
                </div>
              )}
            </Tabs.Item>
          </Tabs.Group>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          size={"xs"}
          onClick={() => close(false)}
          color="light"
          className="font-semibold"
        >
          Cancelar
        </Button>
        <div className="flex justify-end">
          <DeleteModal
            data={props.item}
            deleteFn={deleteRecord}
            onlyIcon={false}
            toastSuccessMsg={"Registro eliminado correctamente"}
            toastErrorMsg={"Error al eliminar el registro"}
            title="Eliminar registro"
          />
        </div>
      </Modal.Footer>
    </Modal>
  );
};
