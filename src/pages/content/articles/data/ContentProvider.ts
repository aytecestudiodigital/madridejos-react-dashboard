import { supabase } from "../../../../server/supabase";

const TABLE_CATEGORIES = import.meta.env.VITE_TABLE_CONTENT_CATEGORIES;

export const getContentWithCategories = async (
  page: number,
  count: number,
  orderBy: string,
  orderDir: string,
  search?: string,
  filters?: string[],
): Promise<{ totalItems: number; data: any[] | null }> => {
  const initRange: number = (page - 1) * count;
  const endRange: number = count * page - 1;
  const { data, error } = await supabase.rpc("content_with_categories", {
    p_order_by: orderBy,
    p_order_dir: orderDir,
    init_range: initRange,
    end_range: endRange,
    p_search_term: search,
    filters_category: filters,
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

export const getCategories = async () => {
  const { data, error } = await supabase
    .from(TABLE_CATEGORIES)
    .select("id, title")
    .eq("org_id", import.meta.env.VITE_ORG_ID);

  if (error) {
    console.log(error);
  } else {
    return data;
  }
};
