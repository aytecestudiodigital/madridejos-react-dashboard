import { supabase } from "../../../../server/supabase";
import {
  deleteRow,
  getRowByColumn,
  insertRow,
  updateRow,
} from "../../../../server/supabaseQueries";
import { ItemModel } from "../../items/models/ItemModel";
import { InstallationModel } from "../models/InstallationModel";
import { InstallationStatesModel } from "../models/InstallationStatesModel";

const installationsTableName = import.meta.env
  .VITE_TABLE_BOOKINGS_INSTALLATIONS;
const statesTableName = import.meta.env
  .VITE_TABLE_BOOKINGS_INSTALLATIONS_STATES;
const itemsTableName = import.meta.env.VITE_TABLE_BOOKINGS_ITEMS;
const userGroupId = localStorage.getItem("groupSelected")!;

export const updateOrCreateInstallation = async (
  installation: InstallationModel,
  states: InstallationStatesModel[],
) => {
  try {
    let result: any;
    if (!installation.id) {
      result = await insertRow(installation, installationsTableName);
    } else {
      result = await updateRow(installation, installationsTableName);
    }

    const allInstallationStateBeforeSaving = (await getRowByColumn(
      "installation_id",
      result!.id!,
      statesTableName,
    )) as InstallationModel[];

    for (const savedState of allInstallationStateBeforeSaving) {
      const matchingState = states.find((state) => state.id === savedState.id);

      if (!matchingState) {
        await deleteRow(savedState!.id!, statesTableName);
      }
    }

    for (const state of states) {
      if (state.id) {
        const matchingState = allInstallationStateBeforeSaving.find(
          (installationState) => installationState.id === state.id,
        );

        if (matchingState) {
          state.group_id = userGroupId;
          await updateRow(state, statesTableName);
        } else {
          await deleteRow(state.id, statesTableName);
        }
      } else {
        state.installation_id = result.id;
        state.group_id = userGroupId;
        await insertRow(state, statesTableName);
      }
    }

    return result;
  } catch (error) {
    console.error(error);

    return false;
  }
};

export const getInstallationStates = async (
  installationId: string,
): Promise<InstallationStatesModel[] | null> => {
  try {
    let { data, error } = await supabase
      .from(statesTableName)
      .select("*")
      .eq("installation_id", installationId)
      .returns<InstallationStatesModel[]>();
    if (error) return null;

    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getInstallationItems = async (
  installationId: string,
): Promise<ItemModel[] | null> => {
  try {
    let { data, error } = await supabase
      .from(itemsTableName)
      .select("*")
      .eq("installation_id", installationId)
      .order("order", { ascending: true })
      .returns<ItemModel[]>();

    if (error) return null;
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
