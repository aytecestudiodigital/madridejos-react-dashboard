import { Database } from "../../../../server/supabaseTypes";

export type Discount = {
  amount: number;
  created_at?: string;
  created_by?: string | null;
  discount?: boolean;
  discount_by_method?: number | null;
  discount_method?: Database["public"]["Enums"]["discount_method"];
  discount_type?: Database["public"]["Enums"]["discount_type"];
  enabled?: boolean;
  id?: string;
  inscription_id: string;
  observations?: string | null;
  products?: number | null;
  products_unit?: boolean | null;
  title: string;
  updated_at?: string;
  updated_by?: string | null;
};

/**
 * discount_type: "PERCENTAGE" | "FIXED";
 * 
 * discount_method:
        | "USER_SELECTION"
        | "QUANTITY_PRODUCTS"
        | "PAYMENT_METHOD"
        | "MANUAL";
 */
