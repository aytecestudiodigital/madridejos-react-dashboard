export type Category = {
  id?: string;
  title?: string;
  state?: "PUBLISH" | "UNPUBLISH" | "ARCHIVED";
  order?: number;
  notifiable?: boolean;
  created_at?: string;
  content_type?: "ARTICLES" | "PLACES" | "EVENTS";
  tags?: string | null;
  group_id?: string;
  created_by?: string;
};
