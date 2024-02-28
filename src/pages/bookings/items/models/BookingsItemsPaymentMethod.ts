import { Database } from "../../../../server/supabaseTypes";

export type BookingsItemsPaymentMethod = {
  booking_item_id: string;
  created_at: string;
  created_by: string | null;
  enviroment: Database["public"]["Enums"]["enviroment_type"];
  payments_method_id: number;
  updated_at: string;
  updated_by: string | null;
};
