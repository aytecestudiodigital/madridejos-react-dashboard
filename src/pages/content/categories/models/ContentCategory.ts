export type ContentCategory = {
  content_type_id: string;
  created_at?: string;
  created_by?: string | null;
  entity_id?: string | null;
  id?: string;
  notifiable?: boolean;
  order: number;
  state: string;
  title: string;
  updated_at?: string;
  updated_by?: string | null;
};
