import { Database } from "../../../server/supabaseTypes";

export type AccessControl = {
  auto_off?: boolean | null;
  created_at?: string;
  created_by?: string | null;
  device_id: string;
  enabled: boolean;
  id?: string;
  model_name?: string | null;
  org_id: string;
  phone?: string | null;
  provider: Database["public"]["Enums"]["device_provider"];
  channel_id?: string;
  remote_endpoint?: string | null;
  status?: boolean | null;
  time_off?: string | null;
  title: string;
  toggle_after?: number | null;
  type: Database["public"]["Enums"]["device_type"];
  updated_at?: string;
  updated_by?: string | null;
  mqtt_id: string | null;
};
