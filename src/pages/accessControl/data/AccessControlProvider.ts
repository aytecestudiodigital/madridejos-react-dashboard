/* import { Dispatch, SetStateAction } from "react";
import { supabase } from "../../../server/supabase";

export const handleButtonClick = async (
  item: any,
  socket?: any | null,
  status?: boolean,
  setPinCode?: Dispatch<SetStateAction<string | null>>,
): Promise<number | string | undefined> => {
  if (item) {
    const { provider, channel_id, device_id, type, mqtt_id } = item;
    switch (provider) {
      case "SHELLY":
        try {
          const userSessionUID = (await supabase.auth.getSession()).data.session
            ?.user.id;
          const deviceId = item!.id;
          const data = {
            method: "Switch.Set",
            params: { id: channel_id, on: status ? false : true },
          };
          const path = `${mqtt_id}/rpc`;

          const payload = {
            deviceId: deviceId,
            uid: userSessionUID,
            path: path,
            data: JSON.stringify(data),
          };

          socket.emit("command", payload);
          return 204;
        } catch (error: any) {
          console.log("error: ", error);
          // Manejar errores
          return error.status;
        }
        break;
      case "RAIXER":
        const doorEndpoint = `https://api.raixer.com/devices/${device_id}/open-door/${channel_id}`;
        try {
          const response = await fetch(doorEndpoint, {
            method: "POST",
            headers: {
              Authorization:
                "Basic YXltbzo2QkFIMzI5RDQzUTJkYnRkUjd3UnFNOVk0Rm1qcXZ4Ng==",
            },
          });
          return response.status;
        } catch (error: any) {
          // Manejar errores
          return error.status;
        }
        break;

      case "AKILES":
        if (type === "CODE") {
          const codeEndpoint = `https://api.akiles.app/v2/members/mem_3ydzgvy85kvrud7pqrhh/pins`;

          try {
            const pin =
              Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
            const response = await fetch(codeEndpoint, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization:
                  "Bearer ak_3ua213n6nf66d3dt66uh_4618d587bfd9465dae37e90a8e7216cb3763e564acbbedd3",
              },
              body: JSON.stringify({
                length: 6,
                pin: pin.toString(),
                metadata: {},
              }),
            });

            const responseData = await response.json();

            // Actualizar el estado del pinCode
            setPinCode!(responseData.pin);
            return response.status;
          } catch (error: any) {
            // Manejar errores
            return error.status;
          }
        } else if (type === "DOOR") {
          const doorEndpoint = `https://api.akiles.app/v2/gadgets/${channel_id}/actions/open`;
          try {
            const response = await fetch(doorEndpoint, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization:
                  "Bearer ak_3ua213n6nf66d3dt66uh_4618d587bfd9465dae37e90a8e7216cb3763e564acbbedd3",
              },
              body: JSON.stringify({}),
            });
            return response.status;
          } catch (error: any) {
            // Manejar errores
            return error.status;
          }
        }

        break;

      default:
        console.error("Tipo de dispositivo no reconocido");
    }
  }
};

export const getAccessControl = async (
  page: number,
  count: number,
  orderBy: string,
  orderDir: string,
  p_created_by: string,
  access: boolean,
  p_group_id: string | null,
  search?: string,
  filters?: string[],
): Promise<{ totalItems: number; data: any[] | null }> => {
  const initRange: number = (page - 1) * count;
  const endRange: number = count * page - 1;
  const { data, error } = await supabase.rpc(
    "access_control_with_authorization",
    {
      init_range: initRange,
      end_range: endRange,
      p_order_by: orderBy,
      p_order_dir: orderDir,
      p_search_term: search,
      filters_type: filters,
      p_created_by: p_created_by,
      access: access,
      p_group_id: p_group_id,
    },
  );

  if (data) {
    return {
      totalItems: data.count,
      data: data.data,
    };
  } else if (error) {
    return {
      totalItems: 0,
      data: null,
    };
  } else {
    return {
      totalItems: 0,
      data: null,
    };
  }
};
 */