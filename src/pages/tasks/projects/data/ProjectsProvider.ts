import { supabase } from "../../../../server/supabase";

export const getProjectsAndRelatedData = async (
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

  const { data, error } = await supabase.rpc("projects_with_tasks", {
    init_range: initRange,
    end_range: endRange,
    p_order_by: orderBy,
    p_order_dir: orderDir,
    p_search_term: search,
    p_created_by: created_by,
    access: showAll,
    p_group_id: group,
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

export const getOneProjectAndRelatedData = async (
  project_id: string,
  created_by: string,
  showAll: boolean,
  group: string | null,
): Promise<{ data: any | null }> => {
  const { data, error } = await supabase.rpc("get_project_by_id", {
    p_project_id: project_id,
    p_created_by: created_by,
    p_access: showAll,
    p_group_id: group,
  });

  if (data) {
    return {
      data: data,
    };
  } else if (error) {
    return {
      data: null,
    };
  } else {
    return {
      data: null,
    };
  }
};
