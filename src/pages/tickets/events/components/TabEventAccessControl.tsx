/* eslint-disable @typescript-eslint/no-explicit-any */
import { Label, Select } from "flowbite-react";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { getAll } from "../../../../server/supabaseQueries";

interface TabEventAccessControlProps {
  item: any;
}

export const TabEventAccessControl = (props: TabEventAccessControlProps) => {
  const { t } = useTranslation();

  const [devices, setDevices] = useState<any[]>([]); // Array para almacenar los elementos Select
  const [selectedDevice, setSelectedDevice] = useState("");
  const { setValue } = useFormContext();

  useEffect(() => {
    const fetchData = async () => {
      const devicesDb = await getAll("access_control");
      if (devicesDb.data) {
        setDevices(devicesDb.data);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (props.item) {
      if (props.item.access_control_device) {
        setSelectedDevice(props.item.access_control_device);
      }
    }
  }, [props.item]);

  const handleSelectChange = (value: string) => {
    setSelectedDevice(value);
    setValue("access_control_device", value);
  };

  return (
    <div className="p-2">
      <Label>Dispositivo</Label>
      <div className="mt-1">
        <Select
          onChange={(e) => handleSelectChange(e.target.value)}
          value={selectedDevice}
        >
          <option hidden value="" disabled>
            {t("SELECT")}
          </option>
          {devices.map((device, index) => (
            <option key={index} value={device.id}>
              {device.title}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
};
