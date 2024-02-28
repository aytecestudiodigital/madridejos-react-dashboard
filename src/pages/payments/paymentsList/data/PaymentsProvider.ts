import { supabase } from "../../../../server/supabase";

export const getOrdersAndRelatedData = async (
  page: number,
  count: number,
  orderBy: string,
  orderDir: string,
  search?: string,
  filters_status?: string[],
  filtersModule?: string[],
  filtersMethods?: any[],
): Promise<{ totalItems: number; data: any[] | null }> => {
  const initRange: number = (page - 1) * count;
  const endRange: number = count * page - 1;

  const { data, error } = await supabase.rpc("payments_orders", {
    init_range: initRange,
    end_range: endRange,
    p_order_by: orderBy,
    p_order_dir: orderDir,
    p_search_term: search,
    filters_status: filters_status,
    filters_modules: filtersModule,
    filters_methods: filtersMethods,
  });

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
