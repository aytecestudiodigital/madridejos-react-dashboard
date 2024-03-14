/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Modal, Tabs } from "flowbite-react";
import { useEffect, useState } from "react";
import { DeleteModal } from "../../../../../components/DeleteModal";
import { supabase } from "../../../../../server/supabase";
import { deleteRow, getOneRow } from "../../../../../server/supabaseQueries";

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

  const user = JSON.parse(localStorage.getItem("userLogged")!);
  const userGroupId = localStorage.getItem("groupSelected")!;

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
        <strong>Registro</strong>
      </Modal.Header>
      <Modal.Body className="max-h-[70vh] overflow-auto">
        <div className="mt-4 flex border-b-2 pb-2 justify-between">
          <strong className="text-blue-800 font-semibold text-lg">
            Estado
          </strong>
          <div className="">
            {props.item.state === "CONFIRMED" ? (
              <div className="container items-center flex flex-row max-w-max px-4 bg-green-100 text-green-800  rounded-full font-semibold">
                Confirmado
              </div>
            ) : props.item.state === "PENDING" ? (
              <div className="container items-center flex flex-row max-w-max px-4 bg-yellow-100 text-yellow-800 rounded-full font-semibold">
                Pendiente
              </div>
            ) : props.item.state === "IN_PROGRESS" ? (
              <div className="container items-center flex flex-row max-w-max px-4 bg-orange-100 text-orange-800 rounded-full font-semibold">
                En proceso
              </div>
            ) : props.item.state === "CANCELED" ? (
              <div className="container items-center flex flex-row max-w-max px-4 bg-red-100 text-red-800 rounded-full font-semibold">
                Cancelado
              </div>
            ) : props.item.state === "COMPLETED" ? (
              <div className="container items-center flex flex-row max-w-max px-4 bg-green-100 text-green-800 rounded-full font-semibold">
                Completado
              </div>
            ) : props.item.state === "DENIED" ? (
              <div className="container items-center flex flex-row max-w-max px-4 bg-gray-100 text-gray-800 rounded-full font-semibold">
                Denegado
              </div>
            ) : props.item.state === "ERROR" ? (
              <div className="container items-center flex flex-row max-w-max px-4 bg-red-100 text-red-800 rounded-full font-semibold">
                Error
              </div>
            ) : null}
          </div>
        </div>
        <div className="mt-4 border-b-2">
          <strong className="text-blue-800 font-semibold text-lg">
            Actividades
          </strong>
          {activities.length > 0 ? (
            activities.map((activity) => (
              <div key={activity.id} className="flex justify-between p-2">
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
        <div className="mt-4 border-b-2">
          <strong className="text-blue-800 font-semibold text-lg">
            Autorizaciones
          </strong>
          {authorizations.length > 0 ? (
            authorizations.map((authorization) => (
              <div key={authorization.id} className="flex justify-start p-2">
                <p>{authorization.title}</p>
              </div>
            ))
          ) : (
            <p className="text-center p-2">No hay autorizaciones</p>
          )}
        </div>
        <div className="mt-4 border-b-2">
          <strong className="text-blue-800 font-semibold text-lg">
            Datos del pago
          </strong>
          {paymentOrder ? (
            <div>Datos del payment</div>
          ) : (
            <div className="text-center p-2">
              No se ha realizado ningún pago
            </div>
          )}
        </div>
        <div className="mt-4 border-b-2">
          <strong className="text-blue-800 font-semibold text-lg">
            Descuentos
          </strong>
          {discounts.length > 0 ? (
            discounts.map((discount) => (
              <div key={discount.id} className="flex justify-between p-2">
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
            <p className="text-center p-2">No se aplican descuentos</p>
          )}
        </div>
        <div className="mt-4">
          <strong className="text-blue-800 font-semibold text-lg">
            Datos del registro
          </strong>
          <div className="mt-2">
            <Card>
              <Tabs.Group>
                <Tabs.Item title="Principal">
                  {props.item.main_form && props.item.main_form.length > 0 ? (
                    props.item.main_form.map((formData: any, index: number) => (
                      <div
                        key={index}
                        className="flex justify-start gap-4 px-2"
                      >
                        <div>
                          <p className="font-semibold">{formData.title}:</p>
                        </div>
                        <div>
                          <p>{formData.value}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center px-2">
                      No hay datos del formulario
                    </div>
                  )}
                </Tabs.Item>
                <Tabs.Item title="Autorización">
                  {props.item.auth_form && props.item.auth_form.length > 0 ? (
                    props.item.auth_form.map((formData: any, index: number) => (
                      <div
                        key={index}
                        className="flex justify-start gap-4 px-2"
                      >
                        <div>
                          <p className="font-semibold">{formData.title}:</p>
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
            </Card>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div>
          <DeleteModal
            data={props.item}
            deleteFn={deleteRecord}
            onlyIcon={false}
            toastSuccessMsg={"Registro eliminado correctamente"}
            toastErrorMsg={"Error al eliminar el registro"}
            title="Eliminar registro"
            disableButton={
              (!user.users_roles.rules.inscriptions.records.delete_all &&
                !user.users_roles.rules.inscriptions.records.delete_group &&
                !user.users_roles.rules.inscriptions.records.delete_own) ||
              (!user.users_roles.rules.inscriptions.records.delete_all &&
                user.users_roles.rules.inscriptions.records.delete_group &&
                userGroupId !== props.item.group_id) ||
              (!user.users_roles.rules.inscriptions.records.delete_all &&
                !user.users_roles.rules.inscriptions.records.delete_group &&
                user.users_roles.rules.inscriptions.records.delete_own &&
                user.id !== props.item.created_by)
            }
          />
        </div>
      </Modal.Footer>
    </Modal>
  );
};
