/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Select } from "flowbite-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { HiTrash } from "react-icons/hi";
import { ItemModel } from "../models/ItemModel";
import { AccessControl } from "../../../accessControl/models/AccessControl";
import { getOneRow, getRowByColumn } from "../../../../server/supabaseQueries";
import { LuPlus } from "react-icons/lu";

interface TabItemDevicesProps {
  accessControl: AccessControl[] | [];
  item: ItemModel | null;
  onDevicesChange: (devices: any) => void;
}

export const TabItemDevices = (props: TabItemDevicesProps) => {
  const { t } = useTranslation();

  const [devices, setDevices] = useState<any[]>([]); // Array para almacenar los elementos Select

  const deviceItemsTableName = import.meta.env.VITE_TABLE_ITEMS_DEVICES;
  const accessControlTableName = import.meta.env.VITE_TABLE_ACCESS_CONTROL;

  useEffect(() => {
    const fetchData = async () => {
      if (props.item) {
        const defaultDevices: { id: string; value: string; uuid: string }[] =
          [];

        const results = await getRowByColumn(
          "bookings_item_id",
          props.item.id!,
          deviceItemsTableName,
        );

        for (const result of results) {
          const device = await getOneRow(
            "id",
            result.access_control_id,
            accessControlTableName,
          );

          if (device) {
            defaultDevices.push({
              id: device.id,
              value: device.title,
              uuid: device.uuid ? device.uuid : crypto.randomUUID(),
            });
          }
        }

        setDevices(defaultDevices);
      }
    };

    fetchData();
  }, [props.item]);

  useEffect(() => {
    props.onDevicesChange(devices);
  }, [devices]);

  const handleAddSelect = () => {
    const defaultDevices = [...devices];
    const newDevice = {
      id: null,
      value: "",
      uid: crypto.randomUUID(),
    };
    defaultDevices.push(newDevice);
    setDevices(defaultDevices);
    //setDevices((prevItems) => [...prevItems, { id: null, value: "" }]);
  };

  const handleSelectChange = (index: number, value: string) => {
    const defaultDevices = [...devices];
    defaultDevices[index].value = value;
    setDevices(defaultDevices);
  };

  const deleteRow = (index: number) => {
    const defaultDevices = [...devices];
    defaultDevices.splice(index, 1);
    setDevices(defaultDevices);
  };

  return (
    <div>
      <h3 className="text-xl font-bold dark:text-white py-2">Dispositivos</h3>
      <Button size="xs" color="light" onClick={handleAddSelect}>
        <div className="flex items-center text-blue-900">
          <LuPlus className="text-sm text-blue-900" />
          <div className="ml-1">{t("ADD_DEVICE")}</div>
        </div>
      </Button>
      <div className="py-4">
        {devices.map((device, index) => (
          <div key={device.uuid} className="flex place-items-center mb-4">
            <div className="grow pr-4">
              <Select
                id={`select-${device.uuid}`}
                onChange={(e) => handleSelectChange(index, e.target.value)}
                value={device.value}
              >
                <option hidden value="" disabled>
                  {t("SELECT")}
                </option>
                {props.accessControl.map((device) => (
                  <option key={device.id} value={device.id}>
                    {device.title}
                  </option>
                ))}
              </Select>
            </div>

            <Button size="xs" color="light" onClick={() => deleteRow(index)}>
              <div className="flex items-center gap-x-2 text-red-500">
                <HiTrash className="text-sm text-red-500" />
              </div>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
