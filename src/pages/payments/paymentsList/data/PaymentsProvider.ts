import { supabase } from "../../../../server/supabase";

export const getOrdersAndRelatedData = async (
  page: number,
  count: number,
  orderBy: string,
  orderDir: string,
  p_created_by: string,
  access: boolean,
  p_group_id: string | null,
  search?: string,
  filters_status?: string[],
  filtersModule?: string[],
  filtersMethods?: any[],
): Promise<{ totalItems: number; data: any[] | null }> => {
  const initRange: number = (page - 1) * count;
  const endRange: number = count * page - 1;

  const { data, error } = await supabase.rpc(
    "payments_orders_with_authorization",
    {
      init_range: initRange,
      end_range: endRange,
      p_order_by: orderBy,
      p_order_dir: orderDir,
      p_search_term: search,
      filters_status: filters_status,
      filters_modules: filtersModule,
      filters_methods: filtersMethods,
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

export const getPaymentsAndRelatedData = async (
  orderId: string,
): Promise<{ data: any[] | null }> => {
  const { data, error } = await supabase.rpc("get_payments_for_order_id", {
    p_payments_order_id: orderId,
  });

  //console.log(data);
  if (data) {
    return {
      data: data.data,
    };
  } else if (error) {
    //console.log(error);
    return {
      data: null,
    };
  } else {
    return {
      data: null,
    };
  }
};
