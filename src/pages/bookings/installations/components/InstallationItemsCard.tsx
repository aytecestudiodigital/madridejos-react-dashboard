import { Button, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { HiPlus } from "react-icons/hi";
import { LuMoveVertical } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { ItemModel } from "../../items/models/ItemModel";
import { InstallationModel } from "../models/InstallationModel";

interface InstallationItemsCardProps {
  type: "INSTALLATION" | "SERVICE";
  installation: InstallationModel | null;
  initialInstallationItems: ItemModel[] | null;
}
export const InstallationItemsCard = ({
  type,
  installation,
  initialInstallationItems,
}: InstallationItemsCardProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [installationItems, setInstallationItems] = useState<
    ItemModel[] | null
  >(null);

  useEffect(() => {
    // Actualizar el estado cuando initialInstallationItems cambie
    setInstallationItems(initialInstallationItems);
  }, [initialInstallationItems]);

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropItemId: string) => {
    e.preventDefault();
    const newOrder = [...installationItems!];

    const draggedIndex = installationItems!.findIndex(
      (item) => item.id === draggedItem,
    );
    const dropIndex = installationItems!.findIndex(
      (item) => item.id === dropItemId,
    );

    if (draggedIndex !== -1 && dropIndex !== -1 && draggedIndex !== dropIndex) {
      // Reorganizar el array localmente
      const [draggedItem] = newOrder.splice(draggedIndex, 1);
      newOrder.splice(dropIndex, 0, draggedItem);

      // Implementar lógica para actualizar el orden en la base de datos

      setInstallationItems(newOrder);
    }

    setDraggedItem(null);
  };

  return (
    <>
      <div className="flex items-center justify-between p-1">
        <h3 className="text-xl font-bold dark:text-white mb-4">
          {type === "INSTALLATION"
            ? t("INSTALLATION_PAGE_ITEMS_DEPENDENCIES_CARD_TITLE")
            : t("INSTALLATION_PAGE_ITEMS_SERVICES_CARD_TITLE")}
        </h3>
        {installation != null ? (
          <Button
            size="xs"
            className="bg-primary"
            onClick={() =>
              navigate(`/bookings/installations/${installation.id}/item/new`, {
                state: null,
              })
            }
          >
            <HiPlus />
            <div className="ml-1">
              {" "}
              {type === "INSTALLATION" ? t("NEW_DEPENDENCY") : t("NEW_SERVICE")}
            </div>
          </Button>
        ) : null}
      </div>
      <div>
        {installationItems ? (
          <Table>
            <Table.Head>
              <Table.HeadCell>{t("TITLE")}</Table.HeadCell>
            </Table.Head>

            <Table.Body>
              {installationItems.map((item) => (
                <Table.Row
                  key={item.id}
                  className={`hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer table-row-divider`}
                  onClick={() =>
                    navigate(
                      `/bookings/installations/${item.installation_id}/item/${item.id}`,
                      {
                        state: null,
                      },
                    )
                  }
                  draggable
                  onDragStart={(e) => handleDragStart(e, item.id!)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, item.id!)}
                >
                  <Table.Cell className="flex items-center max-w-md p-4 text-base font-medium text-gray-900 dark:text-white">
                    <LuMoveVertical className="mr-2" />
                    {item.title}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        ) : (
          <p>{t("DEPENDENCIES_LIST_DESCRIPTION")}</p>
        )}
      </div>
    </>
  );
};
