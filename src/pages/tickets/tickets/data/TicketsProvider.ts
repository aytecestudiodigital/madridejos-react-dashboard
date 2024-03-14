import { supabase } from "../../../../server/supabase";
import { getAll, getRowByColumn } from "../../../../server/supabaseQueries";
import { Database } from "../../../../server/supabaseTypes";

export type TicketProductsStates = Database["public"]["Enums"]["states"];
export type TicketProductsTypes =
  Database["public"]["Enums"]["ticket_product_type"];

export const getTicketsProductsAndRelatedData = async (
  page: number,
  count: number,
  orderBy: string,
  orderDir: string,
  p_created_by: string,
  access: boolean,
  search?: string,
  p_dates?: string[],
  filters_status?: string[],
  filters_tickets?: string[],
  filters_products?: string[],
  filters_types?: string[],
): Promise<{ totalItems: number; data: any[] | null }> => {
  const initRange: number = (page - 1) * count;
  const endRange: number = count * page - 1;

  const { data, error } = await supabase.rpc("tickets_products_with_filters", {
    init_range: initRange,
    end_range: endRange,
    p_order_by: orderBy,
    p_order_dir: orderDir,
    p_search_term: search,
    p_dates: p_dates,
    filters_status: filters_status,
    filters_tickets: filters_tickets,
    filters_products: filters_products,
    filters_types: filters_types,
    p_created_by: p_created_by,
    access: access,
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

export const getAllEventsToDropdown = async () => {
  const allTickets = await getAll("tickets");
  const dropdownData: { id: string; title: string }[] = [];
  if (allTickets.data) {
    for await (const ticket of allTickets.data) {
      dropdownData.push({ id: ticket.id, title: ticket.title });
    }
  }
  return dropdownData;
};

export const getAllProductsToDropdown = async (ticket_id: string) => {
  const allProducts = (await getRowByColumn(
    "ticket_id",
    ticket_id,
    "tickets_products",
  )) as any[];
  const dropdownData: { id: string; title: string }[] = [];
  if (allProducts.length > 0) {
    for await (const product of allProducts) {
      dropdownData.push({ id: product.id, title: product.title });
    }
  }
  return dropdownData;
};
