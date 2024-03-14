import { supabase } from "../../../../server/supabase";

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

export const getInscriptionsRecords = async (
  page: number,
  count: number,
  inscription_id: string,
  p_created_by: string,
  access: boolean,
  filters_dates?: string[],
  filters_status?: string[],
): Promise<{ totalItems: number; data: any[] | null }> => {
  const initRange: number = (page - 1) * count;
  const endRange: number = count * page - 1;

  const { data, error } = await supabase.rpc("records_with_filters", {
    init_range: initRange,
    end_range: endRange,
    p_inscription_id: inscription_id,
    p_dates: filters_dates,
    filters_status: filters_status,
    p_created_by: p_created_by,
    access: access,
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
