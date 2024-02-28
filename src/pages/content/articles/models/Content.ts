import { Json } from "../../../../server/supabaseTypes";

export type Content = {
  contact_info?: Json | null;
  content?: string | null;
  content_category_id: string;
  created_at?: string;
  created_by?: string | null;
  data?: Json[] | null;
  documents?: Json[] | null;
  event_date_end?: string | null;
  event_date_init?: string | null;
  external_url?: string | null;
  id?: string;
  images?: Json[] | null;
  order?: number;
  place_location?: Json | null;
  publish_date_end?: string | null;
  publish_date_init?: string | null;
  state?: string;
  summary?: string | null;
  title: string;
  updated_at?: string | null;
  updated_by?: string | null;
  videos?: Json[] | null;
};
