/* eslint-disable react-hooks/rules-of-hooks */
import { supabase } from "./supabase";

export const getOneRow = async (
  key: string,
  value: string | number,
  table: string,
): Promise<any | null> => {
  let { data, error } = await supabase.from(table).select("*").eq(key, value);
  if (data) {
    return data[0];
  } else if (error) {
    console.log(error);
    return null;
  } else {
    return null;
  }
};

export const getRowByColumn = async (
  key: string,
  value: string,
  table: string,
): Promise<any | null> => {
  let { data, error } = await supabase.from(table).select("*").eq(key, value);
  if (data) {
    return data;
  } else if (error) {
    console.log(error);
    return null;
  } else {
    return null;
  }
};

export const getRowsByNotNullColumn = async (
  columnName: string,
  tableName: string,
): Promise<any[] | null> => {
  const { data, error } = await supabase
    .from(tableName)
    .select("*")
    .not(columnName, "is", null);

  if (data) {
    return data;
  } else if (error) {
    console.error(error);
    return null;
  } else {
    console.error("No data");
    return null;
  }
};

export const getAll = async (
  tableName: string,
): Promise<{ totalItems: number; data: any[] | null }> => {
  const { data, error } = await supabase.from(tableName).select("*");

  if (data) {
    const entities: any[] = [];
    data.map((item: any) => {
      entities.push(item);
    });
    return {
      totalItems: data.length ?? 0,
      data: entities,
    };
  } else if (error) {
    console.log(error);
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

export const updateRow = async (dataToUpdate: any, table: string) => {
  try {
    const userLogged = JSON.parse(localStorage.getItem('userLogged')!)
    const { data, error } = await supabase
      .from(table)
      .update({
        ...dataToUpdate,
        updated_at: new Date().toISOString(),
        updated_by: userLogged.id,
      })
      .eq("id", dataToUpdate.id!)
      .select();

    if (error) return null;

    return data[0];
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const insertRow = async (dataToInsert: any, table: string) => {
  try {
    const userLogged = JSON.parse(localStorage.getItem("userLogged")!);
    const newRow = {
      ...dataToInsert,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: userLogged.id,
    };

    const { data, error } = await supabase.from(table).insert(newRow).select();

    if (error) return null;
    return data[0];
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const deleteRow = async (id: string | number, table: string) => {
  try {
    if (id) {
      const data = await supabase.from(table).delete().eq("id", id);
      return data;
    }
  } catch (error) {
    return error;
  }
};

export const getEntities = async (
  tableName: string,
  page: number,
  count: number,
  orderBy: string,
  orderDir: string,
  search?: string,
): Promise<{ totalItems: number; data: any[] | null }> => {
  const initRange: number = (page - 1) * count;
  const endRange: number = count * page - 1;

  const { data, error } = await supabase.rpc("general_entities", {
    p_table_name: tableName,
    search_data: { search_term: search },
    p_order_by: orderBy,
    p_order_dir: orderDir,
    init_range: initRange,
    end_range: endRange,
  });

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
