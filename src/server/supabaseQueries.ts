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
    const userLogged = JSON.parse(localStorage.getItem("userLogged")!);
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
  created_by: string,
  showAll: boolean,
  group: string | null,
  search?: string,
): Promise<{ totalItems: number; data: any[] | null }> => {
  const initRange: number = (page - 1) * count;
  const endRange: number = count * page - 1;

  const { data, error } = await supabase.rpc(
    "general_entities_with_authorization",
    {
      p_table_name: tableName,
      search_data: { search_term: search },
      p_created_by: created_by,
      p_access: showAll,
      p_group_id: group,
      p_order_by: orderBy,
      p_order_dir: orderDir,
      init_range: initRange,
      end_range: endRange,
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

/* export type SupabaseFilterCondition = {
  column: string;
  operator:
    | "eq"
    | "neq"
    | "gt"
    | "lt"
    | "gte"
    | "lte"
    | "like"
    | "ilike"
    | "is"
    | "in"
    | "cs"
    | "cd";
  value: string | number | boolean | Array<string | number>;
};

export type SupabaseRelatedTable = {
  tableName: string;
  select: string;
};

export type SupabaseOrderBy = {
  column: string;
  ascending: boolean;
};

export interface SupabaseQueryParams {
  tableName: string;
  select?: string;
  relations?: SupabaseRelatedTable[];
  filters?: SupabaseFilterCondition[];
  orderBy?: SupabaseOrderBy;
  initRange?: number;
  endRange?: number;
}
 */
/* export const fetchFromSupabase = async ({
  tableName,
  select = "*",
  relations,
  filters,
  orderBy,
  initRange = 0,
  endRange = 9,
}: SupabaseQueryParams): Promise<{ totalItems: number | null; data: any[] | null }> => {
  // Construye la cadena de selección para incluir relaciones
  if (relations) {
    const relationStrings = relations.map(
      (rel) => `${rel.tableName}(${rel.select})`,
    );
    select = `${select}, ${relationStrings.join(", ")}`;
  }

  // Inicializa la consulta a Supabase con la tabla y la selección de columnas
  let query = supabase
    .from(tableName)
    .select(select, { count: "exact" });

  // Aplica los filtros proporcionados a la consulta
  if (filters) {
    filters.forEach((filter) => {
      switch (filter.operator) {
        case "eq":
          // Igual a
          query = query.eq(filter.column, filter.value);
          break;
        case "neq":
          // No igual a
          query = query.neq(filter.column, filter.value);
          break;
        case "gt":
          // Mayor que
          query = query.gt(filter.column, filter.value);
          break;
        case "lt":
          // Menor que
          query = query.lt(filter.column, filter.value);
          break;
        case "gte":
          // Mayor o igual que
          query = query.gte(filter.column, filter.value);
          break;
        case "lte":
          // Menor o igual que
          query = query.lte(filter.column, filter.value);
          break;
        case "like":
          // Contiene (case-sensitive)
          query = query.like(filter.column, filter.value as string);
          break;
        case "ilike":
          // Contiene (case-insensitive)
          query = query.ilike(filter.column, filter.value as string);
          break;
        case "is":
          // Es exactamente (para valores nulos y booleanos)
          query = query.is(filter.column, filter.value);
          break;
        case "in":
          // Dentro de un conjunto de valores
          query = query.in(filter.column, filter.value as any[]);
          break;
      }
    });
  }

  // Añadimos una ordenación si se necesita
  if (orderBy) {
    query = query.order(orderBy.column, { ascending: orderBy.ascending });
  }

  // Aplica el rango si se proporciona
  if (initRange != null && endRange != null) {
    query = query.range(initRange, endRange);
  }

  // Ejecuta la consulta y maneja la respuesta o errores
  const { data, error, count } = await query;

  if (data) {
    return {
      totalItems: count,
      data: data,
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
} */
