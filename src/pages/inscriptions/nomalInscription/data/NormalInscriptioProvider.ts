import { supabase } from "../../../../server/supabase";

export const getInscriptions = async (
  page: number,
  count: number,
  orderBy: string,
  orderDir: string,
  search?: string,
  filters?: string[],
): Promise<{ totalItems: number; data: any[] | null }> => {
  const initRange: number = (page - 1) * count;
  const endRange: number = count * page - 1;

  const { data, error } = await supabase.rpc("inscriptions", {
    init_range: initRange,
    end_range: endRange,
    p_order_by: orderBy,
    p_order_dir: orderDir,
    p_search_term: search,
    p_enabled_filters: filters,
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

export const getDataByColumn = async (
  table: string,
  column: string,
  dataToCompare: string,
): Promise<any[] | null> => {
  try {
    let { data, error } = await supabase
      .from(table)
      .select("*")
      .eq(column, dataToCompare)
      .returns<any[]>();
    if (error) return null;

    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
