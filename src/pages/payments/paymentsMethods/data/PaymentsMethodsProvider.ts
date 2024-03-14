import { supabase } from "../../../../server/supabase";

export const getPaymentsOrdersAndRelatedData = async (
  page: number,
  count: number,
  orderBy: string,
  orderDir: string,
  p_created_by: string,
  access: boolean,
  p_group_id: string | null,
  search?: string,
  filters_types?: string[],
): Promise<{ totalItems: number; data: any[] | null }> => {
  const initRange: number = (page - 1) * count;
  const endRange: number = count * page - 1;

  const { data, error } = await supabase.rpc(
    "payments_methods_with_authorization",
    {
      init_range: initRange,
      end_range: endRange,
      p_order_by: orderBy,
      p_order_dir: orderDir,
      p_search_term: search,
      p_types_filters: filters_types,
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
