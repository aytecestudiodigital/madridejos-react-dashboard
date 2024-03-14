import { supabase } from "../../../../server/supabase";

export const getTasks = async (
  page: number,
  count: number,
  orderBy: string,
  orderDir: string,
  p_created_by: string,
  access: boolean,
  p_group_id: string | null,
  search?: string,
  filters_categories?: string[],
  filters_projects?: string[],
  filters_status?: string[],
  filters_priority?: number[],
): Promise<{ totalItems: number; data: any[] | null }> => {
  const initRange: number = (page - 1) * count;
  const endRange: number = count * page - 1;
  const { data, error } = await supabase.rpc(
    "tasks_with_project_and_category_with_authentication",
    {
      init_range: initRange,
      end_range: endRange,
      p_order_by: orderBy,
      p_order_dir: orderDir,
      p_search_term: search,
      filters_categories: filters_categories,
      filters_projects: filters_projects,
      filters_status: filters_status,
      filters_priority: filters_priority,
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
