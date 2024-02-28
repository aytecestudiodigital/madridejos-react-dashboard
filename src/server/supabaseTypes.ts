export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      access_control: {
        Row: {
          auto_off: boolean | null;
          created_at: string;
          created_by: string | null;
          enabled: boolean;
          id: string;
          model_name: string | null;
          org_id: string;
          phone: string | null;
          provider: Database["public"]["Enums"]["device_provider"];
          channel_id: string;
          device_id: string;
          remote_endpoint: string | null;
          status: boolean | null;
          time_off: string | null;
          title: string;
          toggle_after: number | null;
          type: Database["public"]["Enums"]["device_type"];
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          auto_off?: boolean | null;
          created_at?: string;
          created_by?: string | null;
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
        };
        Update: {
          auto_off?: boolean | null;
          created_at?: string;
          created_by?: string | null;
          enabled?: boolean;
          id?: string;
          model_name?: string | null;
          org_id?: string;
          phone?: string | null;
          provider?: Database["public"]["Enums"]["device_provider"];
          channel_id?: string;
          remote_endpoint?: string | null;
          status?: boolean | null;
          time_off?: string | null;
          title?: string;
          toggle_after?: number | null;
          type?: Database["public"]["Enums"]["device_type"];
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "access_control_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "access_control_org_id_fkey";
            columns: ["org_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "access_control_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      access_control_history: {
        Row: {
          access_control_id: string;
          enviroment: Database["public"]["Enums"]["enviroment_type"] | null;
          module: Database["public"]["Enums"]["module"] | null;
          module_id: string | null;
          result: boolean | null;
          status: boolean;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          access_control_id: string;
          enviroment?: Database["public"]["Enums"]["enviroment_type"] | null;
          module?: Database["public"]["Enums"]["module"] | null;
          module_id?: string | null;
          result?: boolean | null;
          status: boolean;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          access_control_id?: string;
          enviroment?: Database["public"]["Enums"]["enviroment_type"] | null;
          module?: Database["public"]["Enums"]["module"] | null;
          module_id?: string | null;
          result?: boolean | null;
          status?: boolean;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "access_control_history_access_control_id_fkey";
            columns: ["access_control_id"];
            isOneToOne: false;
            referencedRelation: "access_control";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "access_control_history_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      access_control_provider_users: {
        Row: {
          created_at: string;
          created_by: string | null;
          id: string;
          provider: Database["public"]["Enums"]["device_provider"];
          channel_id: string;
          provider_password: string | null;
          updated_at: string;
          updated_by: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          id?: string;
          provider: Database["public"]["Enums"]["device_provider"];
          channel_id: string;
          provider_password?: string | null;
          updated_at?: string;
          updated_by?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          id?: string;
          provider?: Database["public"]["Enums"]["device_provider"];
          channel_id?: string;
          provider_password?: string | null;
          updated_at?: string;
          updated_by?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "access_control_provider_users_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "access_control_provider_users_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "access_control_provider_users_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      attachments: {
        Row: {
          created_at: string;
          created_by: string | null;
          format: string | null;
          id: string;
          order: number;
          state: string;
          title: string;
          type: string;
          updated_at: string;
          updated_by: string | null;
          url: string;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          format?: string | null;
          id?: string;
          order: number;
          state: string;
          title: string;
          type: string;
          updated_at?: string;
          updated_by?: string | null;
          url: string;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          format?: string | null;
          id?: string;
          order?: number;
          state?: string;
          title?: string;
          type?: string;
          updated_at?: string;
          updated_by?: string | null;
          url?: string;
        };
        Relationships: [
          {
            foreignKeyName: "attachments_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "attachments_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      bookings: {
        Row: {
          bookings_items_id: string;
          coupon_id: string | null;
          created_at: string;
          created_by: string | null;
          discount: number | null;
          id: string;
          price: number;
          state: Database["public"]["Enums"]["states"];
          total_sessions: number;
          updated_at: string;
          updated_by: string | null;
          user_id: string | null;
        };
        Insert: {
          bookings_items_id: string;
          coupon_id?: string | null;
          created_at?: string;
          created_by?: string | null;
          discount?: number | null;
          id?: string;
          price: number;
          state: Database["public"]["Enums"]["states"];
          total_sessions: number;
          updated_at?: string;
          updated_by?: string | null;
          user_id?: string | null;
        };
        Update: {
          bookings_items_id?: string;
          coupon_id?: string | null;
          created_at?: string;
          created_by?: string | null;
          discount?: number | null;
          id?: string;
          price?: number;
          state?: Database["public"]["Enums"]["states"];
          total_sessions?: number;
          updated_at?: string;
          updated_by?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "bookings_bookings_items_id_fkey";
            columns: ["bookings_items_id"];
            isOneToOne: false;
            referencedRelation: "bookings_items";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookings_coupon_id_fkey";
            columns: ["coupon_id"];
            isOneToOne: false;
            referencedRelation: "payments_coupons";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookings_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookings_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookings_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      bookings_calendar: {
        Row: {
          bookings_item_id: string;
          bookings_state_id: string | null;
          created_at: string;
          created_by: string | null;
          day: Database["public"]["Enums"]["week_days"];
          duration: number;
          id: string;
          init: string;
          light: boolean;
          order: number;
          price: number;
          price_light: number;
          state: boolean;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          bookings_item_id: string;
          bookings_state_id?: string | null;
          created_at?: string;
          created_by?: string | null;
          day: Database["public"]["Enums"]["week_days"];
          duration: number;
          id?: string;
          init: string;
          light?: boolean;
          order: number;
          price: number;
          price_light: number;
          state?: boolean;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          bookings_item_id?: string;
          bookings_state_id?: string | null;
          created_at?: string;
          created_by?: string | null;
          day?: Database["public"]["Enums"]["week_days"];
          duration?: number;
          id?: string;
          init?: string;
          light?: boolean;
          order?: number;
          price?: number;
          price_light?: number;
          state?: boolean;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "bookings_calendar_bookings_item_id_fkey";
            columns: ["bookings_item_id"];
            isOneToOne: false;
            referencedRelation: "bookings_items";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookings_calendar_bookings_state_id_fkey";
            columns: ["bookings_state_id"];
            isOneToOne: false;
            referencedRelation: "bookings_states";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookings_calendar_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookings_calendar_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      bookings_installation: {
        Row: {
          created_at: string;
          created_by: string | null;
          description: string | null;
          enable: boolean;
          id: string;
          images: string[] | null;
          order: number | null;
          org_id: string;
          title: string;
          type: Database["public"]["Enums"]["bookings_installations_type"];
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          enable?: boolean;
          id?: string;
          images?: string[] | null;
          order?: number | null;
          org_id: string;
          title: string;
          type: Database["public"]["Enums"]["bookings_installations_type"];
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          enable?: boolean;
          id?: string;
          images?: string[] | null;
          order?: number | null;
          org_id?: string;
          title?: string;
          type?: Database["public"]["Enums"]["bookings_installations_type"];
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "bookings_installation_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookings_installation_org_id_fkey";
            columns: ["org_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookings_installation_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      bookings_item_legal_text: {
        Row: {
          content_category_id: string | null;
          content_id: string | null;
          created_at: string;
          id: string;
          mandatory: boolean;
          title: string | null;
        };
        Insert: {
          content_category_id?: string | null;
          content_id?: string | null;
          created_at?: string;
          id?: string;
          mandatory: boolean;
          title?: string | null;
        };
        Update: {
          content_category_id?: string | null;
          content_id?: string | null;
          created_at?: string;
          id?: string;
          mandatory?: boolean;
          title?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "bookings_item_legal_text_content_category_id_fkey";
            columns: ["content_category_id"];
            isOneToOne: false;
            referencedRelation: "content_categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookings_item_legal_text_content_id_fkey";
            columns: ["content_id"];
            isOneToOne: false;
            referencedRelation: "content";
            referencedColumns: ["id"];
          },
        ];
      };
      bookings_items: {
        Row: {
          address: string | null;
          apply_cupons: boolean | null;
          avalaible_seats: number | null;
          calendar_days: number | null;
          calendar_weeks: number | null;
          courtesy_time: number | null;
          created_at: string;
          created_by: string | null;
          description: string | null;
          free: boolean;
          id: string;
          image: string | null;
          installation_id: string;
          legal_text_id: string | null;
          max_selected_time: number | null;
          max_sessions: number | null;
          next_booking: number | null;
          order: number;
          payments_account_id: string | null;
          position: number[] | null;
          price_item: number | null;
          price_light: number | null;
          session_type:
            | Database["public"]["Enums"]["bookings_session_type"]
            | null;
          state: boolean;
          time_cancel: number | null;
          time_check_in: string | null;
          time_check_out: string | null;
          time_limit: number | null;
          title: string;
          updated_at: string;
          updated_by: string | null;
          valuable_limit: string | null;
        };
        Insert: {
          address?: string | null;
          apply_cupons?: boolean | null;
          avalaible_seats?: number | null;
          calendar_days?: number | null;
          calendar_weeks?: number | null;
          courtesy_time?: number | null;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          free?: boolean;
          id?: string;
          image?: string | null;
          installation_id: string;
          legal_text_id?: string | null;
          max_selected_time?: number | null;
          max_sessions?: number | null;
          next_booking?: number | null;
          order: number;
          payments_account_id?: string | null;
          position?: number[] | null;
          price_item?: number | null;
          price_light?: number | null;
          session_type?:
            | Database["public"]["Enums"]["bookings_session_type"]
            | null;
          state?: boolean;
          time_cancel?: number | null;
          time_check_in?: string | null;
          time_check_out?: string | null;
          time_limit?: number | null;
          title: string;
          updated_at?: string;
          updated_by?: string | null;
          valuable_limit?: string | null;
        };
        Update: {
          address?: string | null;
          apply_cupons?: boolean | null;
          avalaible_seats?: number | null;
          calendar_days?: number | null;
          calendar_weeks?: number | null;
          courtesy_time?: number | null;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          free?: boolean;
          id?: string;
          image?: string | null;
          installation_id?: string;
          legal_text_id?: string | null;
          max_selected_time?: number | null;
          max_sessions?: number | null;
          next_booking?: number | null;
          order?: number;
          payments_account_id?: string | null;
          position?: number[] | null;
          price_item?: number | null;
          price_light?: number | null;
          session_type?:
            | Database["public"]["Enums"]["bookings_session_type"]
            | null;
          state?: boolean;
          time_cancel?: number | null;
          time_check_in?: string | null;
          time_check_out?: string | null;
          time_limit?: number | null;
          title?: string;
          updated_at?: string;
          updated_by?: string | null;
          valuable_limit?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "bookings_items_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookings_items_image_fkey";
            columns: ["image"];
            isOneToOne: false;
            referencedRelation: "attachments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookings_items_installation_id_fkey";
            columns: ["installation_id"];
            isOneToOne: false;
            referencedRelation: "bookings_installation";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookings_items_legal_text_id_fkey";
            columns: ["legal_text_id"];
            isOneToOne: false;
            referencedRelation: "bookings_item_legal_text";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookings_items_payments_account_id_fkey";
            columns: ["payments_account_id"];
            isOneToOne: false;
            referencedRelation: "payments_accounts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookings_items_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      bookings_items_devices: {
        Row: {
          access_control_id: string;
          bookings_item_id: string;
          created_at: string;
          created_by: string | null;
          enabled: boolean | null;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          access_control_id: string;
          bookings_item_id: string;
          created_at?: string;
          created_by?: string | null;
          enabled?: boolean | null;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          access_control_id?: string;
          bookings_item_id?: string;
          created_at?: string;
          created_by?: string | null;
          enabled?: boolean | null;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "bookings_items_devices_access_control_id_fkey";
            columns: ["access_control_id"];
            isOneToOne: false;
            referencedRelation: "access_control";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookings_items_devices_bookings_item_id_fkey";
            columns: ["bookings_item_id"];
            isOneToOne: false;
            referencedRelation: "bookings_items";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookings_items_devices_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookings_items_devices_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      bookings_items_payments_methods: {
        Row: {
          booking_item_id: string;
          created_at: string;
          created_by: string | null;
          enviroment: Database["public"]["Enums"]["enviroment_type"];
          payments_method_id: number;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          booking_item_id: string;
          created_at?: string;
          created_by?: string | null;
          enviroment: Database["public"]["Enums"]["enviroment_type"];
          payments_method_id: number;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          booking_item_id?: string;
          created_at?: string;
          created_by?: string | null;
          enviroment?: Database["public"]["Enums"]["enviroment_type"];
          payments_method_id?: number;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "bookings_items_payments_methods_booking_item_id_fkey";
            columns: ["booking_item_id"];
            isOneToOne: false;
            referencedRelation: "bookings_items";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookings_items_payments_methods_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookings_items_payments_methods_payments_method_id_fkey";
            columns: ["payments_method_id"];
            isOneToOne: false;
            referencedRelation: "payments_methods";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookings_items_payments_methods_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      bookings_items_responsibles: {
        Row: {
          created_at: string;
          id: string;
          item_id: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          item_id?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          item_id?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "bookings_items_responsibles_item_id_fkey";
            columns: ["item_id"];
            isOneToOne: false;
            referencedRelation: "bookings_items";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookings_items_responsibles_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      bookings_sessions: {
        Row: {
          bookings_id: string | null;
          bookings_item_id: string;
          bookings_state_id: string | null;
          created_at: string;
          created_by: string | null;
          date: string;
          duration: number;
          id: string;
          light: boolean;
          price: number;
          price_light: number;
          selected: boolean;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          bookings_id?: string | null;
          bookings_item_id: string;
          bookings_state_id?: string | null;
          created_at?: string;
          created_by?: string | null;
          date: string;
          duration: number;
          id?: string;
          light?: boolean;
          price: number;
          price_light: number;
          selected?: boolean;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          bookings_id?: string | null;
          bookings_item_id?: string;
          bookings_state_id?: string | null;
          created_at?: string;
          created_by?: string | null;
          date?: string;
          duration?: number;
          id?: string;
          light?: boolean;
          price?: number;
          price_light?: number;
          selected?: boolean;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "bookings_sessions_bookings_id_fkey";
            columns: ["bookings_id"];
            isOneToOne: false;
            referencedRelation: "bookings";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookings_sessions_bookings_item_id_fkey";
            columns: ["bookings_item_id"];
            isOneToOne: false;
            referencedRelation: "bookings_items";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookings_sessions_bookings_state_id_fkey";
            columns: ["bookings_state_id"];
            isOneToOne: false;
            referencedRelation: "bookings_states";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookings_sessions_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookings_sessions_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      bookings_states: {
        Row: {
          bookeable: boolean;
          color: string;
          created_at: string;
          created_by: string | null;
          enable: boolean;
          id: string;
          installation_id: string;
          title: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          bookeable?: boolean;
          color: string;
          created_at?: string;
          created_by?: string | null;
          enable?: boolean;
          id?: string;
          installation_id: string;
          title: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          bookeable?: boolean;
          color?: string;
          created_at?: string;
          created_by?: string | null;
          enable?: boolean;
          id?: string;
          installation_id?: string;
          title?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "bookings_states_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookings_states_installation_id_fkey";
            columns: ["installation_id"];
            isOneToOne: false;
            referencedRelation: "bookings_installation";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookings_states_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      competition_calendar: {
        Row: {
          competition_id: string;
          created_at: string;
          created_by: string | null;
          date: string | null;
          id: string;
          journey: number;
          local_presented: boolean;
          local_team_id: string;
          played: boolean;
          results: Json[] | null;
          round: number;
          updated_at: string;
          updated_by: string | null;
          visit_presented: boolean;
          visit_team_id: string | null;
          winner_id: string | null;
        };
        Insert: {
          competition_id: string;
          created_at?: string;
          created_by?: string | null;
          date?: string | null;
          id?: string;
          journey: number;
          local_presented?: boolean;
          local_team_id: string;
          played?: boolean;
          results?: Json[] | null;
          round: number;
          updated_at?: string;
          updated_by?: string | null;
          visit_presented?: boolean;
          visit_team_id?: string | null;
          winner_id?: string | null;
        };
        Update: {
          competition_id?: string;
          created_at?: string;
          created_by?: string | null;
          date?: string | null;
          id?: string;
          journey?: number;
          local_presented?: boolean;
          local_team_id?: string;
          played?: boolean;
          results?: Json[] | null;
          round?: number;
          updated_at?: string;
          updated_by?: string | null;
          visit_presented?: boolean;
          visit_team_id?: string | null;
          winner_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "competition_calendar_competition_id_fkey";
            columns: ["competition_id"];
            isOneToOne: false;
            referencedRelation: "competitions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "competition_calendar_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "competition_calendar_local_team_id_fkey";
            columns: ["local_team_id"];
            isOneToOne: false;
            referencedRelation: "competitions_teams";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "competition_calendar_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "competition_calendar_visit_team_id_fkey";
            columns: ["visit_team_id"];
            isOneToOne: false;
            referencedRelation: "competitions_teams";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "competition_calendar_winner_id_fkey";
            columns: ["winner_id"];
            isOneToOne: false;
            referencedRelation: "competitions_teams";
            referencedColumns: ["id"];
          },
        ];
      };
      competition_journeis: {
        Row: {
          competition_id: string;
          created_at: string;
          created_by: string | null;
          games_against: number;
          games_scored: number;
          goals_against: number;
          goals_difference: number;
          goals_scored: number;
          id: string;
          journey: number;
          matches_lost: number;
          matches_not_presented: number;
          matches_played: number;
          matches_tied: number;
          matches_won: number;
          points: number;
          team_id: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          competition_id: string;
          created_at?: string;
          created_by?: string | null;
          games_against?: number;
          games_scored?: number;
          goals_against?: number;
          goals_difference?: number;
          goals_scored?: number;
          id?: string;
          journey: number;
          matches_lost?: number;
          matches_not_presented?: number;
          matches_played?: number;
          matches_tied?: number;
          matches_won?: number;
          points?: number;
          team_id: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          competition_id?: string;
          created_at?: string;
          created_by?: string | null;
          games_against?: number;
          games_scored?: number;
          goals_against?: number;
          goals_difference?: number;
          goals_scored?: number;
          id?: string;
          journey?: number;
          matches_lost?: number;
          matches_not_presented?: number;
          matches_played?: number;
          matches_tied?: number;
          matches_won?: number;
          points?: number;
          team_id?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "competition_journeis_competition_id_fkey";
            columns: ["competition_id"];
            isOneToOne: false;
            referencedRelation: "competitions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "competition_journeis_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "competition_journeis_team_id_fkey";
            columns: ["team_id"];
            isOneToOne: false;
            referencedRelation: "competitions_teams";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "competition_journeis_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      competitions: {
        Row: {
          booking_items_id: string[] | null;
          booking_teams_discount: number | null;
          competition_type: Database["public"]["Enums"]["competition_type"];
          created_at: string;
          created_by: string | null;
          criterians: Json[];
          description: string | null;
          elimination_phase:
            | Database["public"]["Enums"]["competition_elimination_phase"]
            | null;
          enable_booking_teams: boolean;
          enabled: boolean;
          id: string;
          image: string | null;
          order: number | null;
          org_id: string;
          rounds: number | null;
          score_loss: number | null;
          score_not_presented: number | null;
          score_tie: number | null;
          score_win: number | null;
          sets: number | null;
          sport_type: Database["public"]["Enums"]["competitions_sports_types"];
          teams_edit_results: boolean;
          title: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          booking_items_id?: string[] | null;
          booking_teams_discount?: number | null;
          competition_type: Database["public"]["Enums"]["competition_type"];
          created_at?: string;
          created_by?: string | null;
          criterians: Json[];
          description?: string | null;
          elimination_phase?:
            | Database["public"]["Enums"]["competition_elimination_phase"]
            | null;
          enable_booking_teams?: boolean;
          enabled?: boolean;
          id?: string;
          image?: string | null;
          order?: number | null;
          org_id: string;
          rounds?: number | null;
          score_loss?: number | null;
          score_not_presented?: number | null;
          score_tie?: number | null;
          score_win?: number | null;
          sets?: number | null;
          sport_type: Database["public"]["Enums"]["competitions_sports_types"];
          teams_edit_results?: boolean;
          title: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          booking_items_id?: string[] | null;
          booking_teams_discount?: number | null;
          competition_type?: Database["public"]["Enums"]["competition_type"];
          created_at?: string;
          created_by?: string | null;
          criterians?: Json[];
          description?: string | null;
          elimination_phase?:
            | Database["public"]["Enums"]["competition_elimination_phase"]
            | null;
          enable_booking_teams?: boolean;
          enabled?: boolean;
          id?: string;
          image?: string | null;
          order?: number | null;
          org_id?: string;
          rounds?: number | null;
          score_loss?: number | null;
          score_not_presented?: number | null;
          score_tie?: number | null;
          score_win?: number | null;
          sets?: number | null;
          sport_type?: Database["public"]["Enums"]["competitions_sports_types"];
          teams_edit_results?: boolean;
          title?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "competitions_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "competitions_org_id_fkey";
            columns: ["org_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "competitions_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      competitions_teams: {
        Row: {
          competition_id: string;
          created_at: string;
          created_by: string | null;
          id: string;
          image: string | null;
          name: string;
          sport_type: Database["public"]["Enums"]["competitions_sports_types"];
          team_members: string[] | null;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          competition_id: string;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          image?: string | null;
          name: string;
          sport_type: Database["public"]["Enums"]["competitions_sports_types"];
          team_members?: string[] | null;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          competition_id?: string;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          image?: string | null;
          name?: string;
          sport_type?: Database["public"]["Enums"]["competitions_sports_types"];
          team_members?: string[] | null;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "competitions_teams_competition_id_fkey";
            columns: ["competition_id"];
            isOneToOne: false;
            referencedRelation: "competitions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "competitions_teams_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "competitions_teams_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      config_pages: {
        Row: {
          app_section_id: string;
          created_at: string;
          data: Json | null;
          design: Json | null;
          id: string;
          order: number | null;
          type: string;
        };
        Insert: {
          app_section_id: string;
          created_at?: string;
          data?: Json | null;
          design?: Json | null;
          id?: string;
          order?: number | null;
          type: string;
        };
        Update: {
          app_section_id?: string;
          created_at?: string;
          data?: Json | null;
          design?: Json | null;
          id?: string;
          order?: number | null;
          type?: string;
        };
        Relationships: [
          {
            foreignKeyName: "config_pages_app_section_id_fkey";
            columns: ["app_section_id"];
            isOneToOne: false;
            referencedRelation: "config_sections";
            referencedColumns: ["id"];
          },
        ];
      };
      config_sections: {
        Row: {
          app_bar: boolean;
          created_at: string;
          created_by: string | null;
          description: string | null;
          design: Json | null;
          enable: boolean;
          icon: string;
          id: string;
          order: number;
          org_id: string;
          public: boolean;
          tab_label: string;
          title: string;
          type: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          app_bar?: boolean;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          design?: Json | null;
          enable?: boolean;
          icon: string;
          id?: string;
          order: number;
          org_id: string;
          public?: boolean;
          tab_label: string;
          title: string;
          type: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          app_bar?: boolean;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          design?: Json | null;
          enable?: boolean;
          icon?: string;
          id?: string;
          order?: number;
          org_id?: string;
          public?: boolean;
          tab_label?: string;
          title?: string;
          type?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "config_sections_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "config_sections_org_id_fkey";
            columns: ["org_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "config_sections_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      config_widgets: {
        Row: {
          created_at: string;
          data: Json[];
          design: Json | null;
          id: string;
          order: number;
          page_id: string;
          type: string;
        };
        Insert: {
          created_at?: string;
          data: Json[];
          design?: Json | null;
          id?: string;
          order: number;
          page_id: string;
          type: string;
        };
        Update: {
          created_at?: string;
          data?: Json[];
          design?: Json | null;
          id?: string;
          order?: number;
          page_id?: string;
          type?: string;
        };
        Relationships: [
          {
            foreignKeyName: "config_widgets_page_id_fkey";
            columns: ["page_id"];
            isOneToOne: false;
            referencedRelation: "config_pages";
            referencedColumns: ["id"];
          },
        ];
      };
      content: {
        Row: {
          contact_info: Json | null;
          content: string | null;
          content_category_id: string;
          created_at: string;
          created_by: string | null;
          data: Json[] | null;
          documents: Json[] | null;
          event_date_end: string | null;
          event_date_init: string | null;
          external_url: string | null;
          id: string;
          images: Json[] | null;
          order: number;
          place_location: Json | null;
          publish_date_end: string | null;
          publish_date_init: string | null;
          state: string;
          summary: string | null;
          title: string;
          updated_at: string | null;
          updated_by: string | null;
          videos: Json[] | null;
        };
        Insert: {
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
        Update: {
          contact_info?: Json | null;
          content?: string | null;
          content_category_id?: string;
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
          title?: string;
          updated_at?: string | null;
          updated_by?: string | null;
          videos?: Json[] | null;
        };
        Relationships: [
          {
            foreignKeyName: "content_content_category_id_fkey";
            columns: ["content_category_id"];
            isOneToOne: false;
            referencedRelation: "content_categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "content_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "content_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      content_categories: {
        Row: {
          content_type: Database["public"]["Enums"]["content_types"] | null;
          content_type_id: string | null;
          created_at: string;
          created_by: string | null;
          entity_id: string | null;
          id: string;
          notifiable: boolean;
          order: number;
          org_id: string | null;
          state: string;
          title: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          content_type?: Database["public"]["Enums"]["content_types"] | null;
          content_type_id?: string | null;
          created_at?: string;
          created_by?: string | null;
          entity_id?: string | null;
          id?: string;
          notifiable?: boolean;
          order: number;
          org_id?: string | null;
          state: string;
          title: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          content_type?: Database["public"]["Enums"]["content_types"] | null;
          content_type_id?: string | null;
          created_at?: string;
          created_by?: string | null;
          entity_id?: string | null;
          id?: string;
          notifiable?: boolean;
          order?: number;
          org_id?: string | null;
          state?: string;
          title?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "content_categories_content_type_id_fkey";
            columns: ["content_type_id"];
            isOneToOne: false;
            referencedRelation: "content_type";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "content_categories_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "content_categories_entity_id_fkey";
            columns: ["entity_id"];
            isOneToOne: false;
            referencedRelation: "content_entities";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "content_categories_org_id_fkey";
            columns: ["org_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "content_categories_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      content_category_tags: {
        Row: {
          content_category_id: string;
          created_at: string;
          created_by: string | null;
          id: string;
          title: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          content_category_id: string;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          title: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          content_category_id?: string;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          title?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "content_category_tags_content_category_id_fkey";
            columns: ["content_category_id"];
            isOneToOne: false;
            referencedRelation: "content_categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "content_category_tags_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "content_category_tags_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      content_entities: {
        Row: {
          created_at: string;
          created_by: string | null;
          description: string | null;
          enabled: boolean;
          id: string;
          title: string;
          updated_at: string | null;
          updated_by: string | null;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          enabled?: boolean;
          id?: string;
          title: string;
          updated_at?: string | null;
          updated_by?: string | null;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          enabled?: boolean;
          id?: string;
          title?: string;
          updated_at?: string | null;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "content_entities_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "content_entities_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      content_entities_fields: {
        Row: {
          created_at: string;
          entity_group_id: string;
          filterable: boolean;
          id: string;
          label: string;
          optional: boolean;
          order: number;
          type: Database["public"]["Enums"]["entities_fields"];
          value: string | null;
        };
        Insert: {
          created_at?: string;
          entity_group_id: string;
          filterable?: boolean;
          id?: string;
          label: string;
          optional?: boolean;
          order: number;
          type?: Database["public"]["Enums"]["entities_fields"];
          value?: string | null;
        };
        Update: {
          created_at?: string;
          entity_group_id?: string;
          filterable?: boolean;
          id?: string;
          label?: string;
          optional?: boolean;
          order?: number;
          type?: Database["public"]["Enums"]["entities_fields"];
          value?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "content_entities_fields_entity_group_id_fkey";
            columns: ["entity_group_id"];
            isOneToOne: false;
            referencedRelation: "content_entities_groups";
            referencedColumns: ["id"];
          },
        ];
      };
      content_entities_groups: {
        Row: {
          created_at: string;
          created_by: string | null;
          entity_id: string | null;
          id: string;
          title: string | null;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          entity_id?: string | null;
          id?: string;
          title?: string | null;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          entity_id?: string | null;
          id?: string;
          title?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "content_entities_groups_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "content_entities_groups_entity_id_fkey";
            columns: ["entity_id"];
            isOneToOne: false;
            referencedRelation: "content_entities";
            referencedColumns: ["id"];
          },
        ];
      };
      content_fields: {
        Row: {
          content_id: string | null;
          created_at: string;
          field_id: string | null;
          id: number;
          value: string | null;
        };
        Insert: {
          content_id?: string | null;
          created_at?: string;
          field_id?: string | null;
          id?: number;
          value?: string | null;
        };
        Update: {
          content_id?: string | null;
          created_at?: string;
          field_id?: string | null;
          id?: number;
          value?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "content_fields_field_id_fkey";
            columns: ["field_id"];
            isOneToOne: false;
            referencedRelation: "content_entities_fields";
            referencedColumns: ["id"];
          },
        ];
      };
      content_tags: {
        Row: {
          content_category_tags_id: string;
          content_id: string;
        };
        Insert: {
          content_category_tags_id: string;
          content_id: string;
        };
        Update: {
          content_category_tags_id?: string;
          content_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "content_tags_content_category_tags_id_fkey";
            columns: ["content_category_tags_id"];
            isOneToOne: false;
            referencedRelation: "content_category_tags";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "content_tags_content_id_fkey";
            columns: ["content_id"];
            isOneToOne: false;
            referencedRelation: "content";
            referencedColumns: ["id"];
          },
        ];
      };
      content_type: {
        Row: {
          alias: string;
          created_at: string;
          created_by: string | null;
          id: string;
          title: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          alias: string;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          title: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          alias?: string;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          title?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "content_type_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "content_type_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      emails: {
        Row: {
          cc: string[] | null;
          cco: string[] | null;
          content: string | null;
          created_at: string;
          created_by: string | null;
          id: string;
          subject: string;
          to: string[];
        };
        Insert: {
          cc?: string[] | null;
          cco?: string[] | null;
          content?: string | null;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          subject: string;
          to: string[];
        };
        Update: {
          cc?: string[] | null;
          cco?: string[] | null;
          content?: string | null;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          subject?: string;
          to?: string[];
        };
        Relationships: [
          {
            foreignKeyName: "emails_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      groups: {
        Row: {
          access_all: boolean;
          created_at: string;
          created_by: string | null;
          id: string;
          title: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          access_all?: boolean;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          title: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          access_all?: boolean;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          title?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "groups_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "groups_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      inscriptions: {
        Row: {
          activity_max_products: number | null;
          activity_min_products: number;
          activity_order_asc: boolean;
          activity_order_by: Database["public"]["Enums"]["inscriptions_activities_order_by"];
          activity_title: string;
          activity_type: string;
          acumulated_discounts: boolean;
          aditional_activity_description: string | null;
          aditional_activity_title: string | null;
          advanced: boolean;
          attached_description: string | null;
          attached_title: string | null;
          authorizations_description: string | null;
          authorizations_title: string;
          created_at: string;
          created_by: string | null;
          date_end: string | null;
          date_init: string;
          description: string | null;
          discounts_description: string | null;
          enable: boolean;
          group_id: string | null;
          id: string;
          image: string | null;
          inscription_type: Database["public"]["Enums"]["inscription_type"];
          org_id: string;
          payment_period_type:
            | Database["public"]["Enums"]["payment_fraction_period"]
            | null;
          payments_account_id: string | null;
          period_end_date: string | null;
          period_init_date: string | null;
          period_month_day: number | null;
          period_week_day: Database["public"]["Enums"]["week_days"] | null;
          report_email: string | null;
          report_user: string | null;
          title: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          activity_max_products?: number | null;
          activity_min_products?: number;
          activity_order_asc?: boolean;
          activity_order_by?: Database["public"]["Enums"]["inscriptions_activities_order_by"];
          activity_title: string;
          activity_type: string;
          acumulated_discounts?: boolean;
          aditional_activity_description?: string | null;
          aditional_activity_title?: string | null;
          advanced?: boolean;
          attached_description?: string | null;
          attached_title?: string | null;
          authorizations_description?: string | null;
          authorizations_title: string;
          created_at?: string;
          created_by?: string | null;
          date_end?: string | null;
          date_init: string;
          description?: string | null;
          discounts_description?: string | null;
          enable?: boolean;
          group_id?: string | null;
          id?: string;
          image?: string | null;
          inscription_type?: Database["public"]["Enums"]["inscription_type"];
          org_id: string;
          payment_period_type?:
            | Database["public"]["Enums"]["payment_fraction_period"]
            | null;
          payments_account_id?: string | null;
          period_end_date?: string | null;
          period_init_date?: string | null;
          period_month_day?: number | null;
          period_week_day?: Database["public"]["Enums"]["week_days"] | null;
          report_email?: string | null;
          report_user?: string | null;
          title: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          activity_max_products?: number | null;
          activity_min_products?: number;
          activity_order_asc?: boolean;
          activity_order_by?: Database["public"]["Enums"]["inscriptions_activities_order_by"];
          activity_title?: string;
          activity_type?: string;
          acumulated_discounts?: boolean;
          aditional_activity_description?: string | null;
          aditional_activity_title?: string | null;
          advanced?: boolean;
          attached_description?: string | null;
          attached_title?: string | null;
          authorizations_description?: string | null;
          authorizations_title?: string;
          created_at?: string;
          created_by?: string | null;
          date_end?: string | null;
          date_init?: string;
          description?: string | null;
          discounts_description?: string | null;
          enable?: boolean;
          group_id?: string | null;
          id?: string;
          image?: string | null;
          inscription_type?: Database["public"]["Enums"]["inscription_type"];
          org_id?: string;
          payment_period_type?:
            | Database["public"]["Enums"]["payment_fraction_period"]
            | null;
          payments_account_id?: string | null;
          period_end_date?: string | null;
          period_init_date?: string | null;
          period_month_day?: number | null;
          period_week_day?: Database["public"]["Enums"]["week_days"] | null;
          report_email?: string | null;
          report_user?: string | null;
          title?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "inscriptions_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "inscriptions_group_id_fkey";
            columns: ["group_id"];
            isOneToOne: false;
            referencedRelation: "groups";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "inscriptions_org_id_fkey";
            columns: ["org_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "inscriptions_payments_account_id_fkey";
            columns: ["payments_account_id"];
            isOneToOne: false;
            referencedRelation: "payments_accounts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "inscriptions_report_user_fkey";
            columns: ["report_user"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "inscriptions_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      inscriptions_attacheds: {
        Row: {
          created_at: string;
          created_by: string | null;
          description: string | null;
          enabled: boolean;
          id: string;
          inscription_id: string;
          required: boolean;
          title: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          enabled?: boolean;
          id?: string;
          inscription_id: string;
          required?: boolean;
          title: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          enabled?: boolean;
          id?: string;
          inscription_id?: string;
          required?: boolean;
          title?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "inscriptions_attacheds_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "inscriptions_attacheds_inscription_id_fkey";
            columns: ["inscription_id"];
            isOneToOne: false;
            referencedRelation: "inscriptions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "inscriptions_attacheds_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      inscriptions_authorizations: {
        Row: {
          content_id: string | null;
          created_at: string;
          created_by: string | null;
          description: string | null;
          enabled: boolean;
          id: string;
          inscription_id: string;
          required: boolean;
          title: string;
          type: Database["public"]["Enums"]["authorization_type"];
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          content_id?: string | null;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          enabled?: boolean;
          id?: string;
          inscription_id: string;
          required?: boolean;
          title: string;
          type?: Database["public"]["Enums"]["authorization_type"];
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          content_id?: string | null;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          enabled?: boolean;
          id?: string;
          inscription_id?: string;
          required?: boolean;
          title?: string;
          type?: Database["public"]["Enums"]["authorization_type"];
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "inscriptions_authorizations_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "inscriptions_authorizations_inscription_id_fkey";
            columns: ["inscription_id"];
            isOneToOne: false;
            referencedRelation: "inscriptions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "inscriptions_authorizations_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      inscriptions_discounts: {
        Row: {
          amount: number;
          created_at: string;
          created_by: string | null;
          discount: boolean;
          discount_by_method: number | null;
          discount_method: Database["public"]["Enums"]["discount_method"];
          discount_type: Database["public"]["Enums"]["discount_type"];
          enabled: boolean;
          id: string;
          inscription_id: string;
          observations: string | null;
          products: number | null;
          products_unit: boolean | null;
          title: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
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
        Update: {
          amount?: number;
          created_at?: string;
          created_by?: string | null;
          discount?: boolean;
          discount_by_method?: number | null;
          discount_method?: Database["public"]["Enums"]["discount_method"];
          discount_type?: Database["public"]["Enums"]["discount_type"];
          enabled?: boolean;
          id?: string;
          inscription_id?: string;
          observations?: string | null;
          products?: number | null;
          products_unit?: boolean | null;
          title?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "inscriptions_discounts_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "inscriptions_discounts_discount_by_method_fkey";
            columns: ["discount_by_method"];
            isOneToOne: false;
            referencedRelation: "payments_methods";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "inscriptions_discounts_inscription_id_fkey";
            columns: ["inscription_id"];
            isOneToOne: false;
            referencedRelation: "inscriptions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "inscriptions_discounts_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      inscriptions_forms: {
        Row: {
          created_at: string;
          created_by: string | null;
          form_type: Database["public"]["Enums"]["inscriptions_forms_type"];
          id: string;
          inscription_id: string;
          title: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          form_type: Database["public"]["Enums"]["inscriptions_forms_type"];
          id?: string;
          inscription_id: string;
          title: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          form_type?: Database["public"]["Enums"]["inscriptions_forms_type"];
          id?: string;
          inscription_id?: string;
          title?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "inscriptions_forms_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "inscriptions_forms_inscription_id_fkey";
            columns: ["inscription_id"];
            isOneToOne: false;
            referencedRelation: "inscriptions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "inscriptions_forms_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      inscriptions_input: {
        Row: {
          created_at: string;
          created_by: string | null;
          deleteable: boolean;
          enabled: boolean;
          form_id: string;
          id: string;
          order: number;
          placeholder: string | null;
          required: boolean;
          title: string;
          type: Database["public"]["Enums"]["inscriptions_input_types"];
          updated_at: string;
          updated_by: string | null;
          values: string[] | null;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          deleteable?: boolean;
          enabled?: boolean;
          form_id: string;
          id?: string;
          order: number;
          placeholder?: string | null;
          required?: boolean;
          title: string;
          type: Database["public"]["Enums"]["inscriptions_input_types"];
          updated_at?: string;
          updated_by?: string | null;
          values?: string[] | null;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          deleteable?: boolean;
          enabled?: boolean;
          form_id?: string;
          id?: string;
          order?: number;
          placeholder?: string | null;
          required?: boolean;
          title?: string;
          type?: Database["public"]["Enums"]["inscriptions_input_types"];
          updated_at?: string;
          updated_by?: string | null;
          values?: string[] | null;
        };
        Relationships: [
          {
            foreignKeyName: "inscriptions_input_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "inscriptions_input_form_id_fkey";
            columns: ["form_id"];
            isOneToOne: false;
            referencedRelation: "inscriptions_forms";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "inscriptions_input_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      inscriptions_products: {
        Row: {
          advanced: boolean | null;
          applicable_discounts: boolean | null;
          created_at: string;
          created_by: string | null;
          days: Database["public"]["Enums"]["week_days"][] | null;
          enabled: boolean;
          id: string;
          inscription_id: string;
          is_additional: boolean;
          observations: string | null;
          order: number | null;
          place: string | null;
          places: number;
          price: number;
          required: boolean;
          teacher: string | null;
          time_end: string | null;
          time_init: string | null;
          title: string;
          updated_at: string;
          updated_by: string | null;
          waiting_list: boolean | null;
          years: number[] | null;
        };
        Insert: {
          advanced?: boolean | null;
          applicable_discounts?: boolean | null;
          created_at?: string;
          created_by?: string | null;
          days?: Database["public"]["Enums"]["week_days"][] | null;
          enabled?: boolean;
          id?: string;
          inscription_id: string;
          is_additional?: boolean;
          observations?: string | null;
          order?: number | null;
          place?: string | null;
          places: number;
          price: number;
          required?: boolean;
          teacher?: string | null;
          time_end?: string | null;
          time_init?: string | null;
          title: string;
          updated_at?: string;
          updated_by?: string | null;
          waiting_list?: boolean | null;
          years?: number[] | null;
        };
        Update: {
          advanced?: boolean | null;
          applicable_discounts?: boolean | null;
          created_at?: string;
          created_by?: string | null;
          days?: Database["public"]["Enums"]["week_days"][] | null;
          enabled?: boolean;
          id?: string;
          inscription_id?: string;
          is_additional?: boolean;
          observations?: string | null;
          order?: number | null;
          place?: string | null;
          places?: number;
          price?: number;
          required?: boolean;
          teacher?: string | null;
          time_end?: string | null;
          time_init?: string | null;
          title?: string;
          updated_at?: string;
          updated_by?: string | null;
          waiting_list?: boolean | null;
          years?: number[] | null;
        };
        Relationships: [
          {
            foreignKeyName: "inscriptions_products_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "inscriptions_products_inscription_id_fkey";
            columns: ["inscription_id"];
            isOneToOne: false;
            referencedRelation: "inscriptions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "inscriptions_products_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      inscriptions_record_products: {
        Row: {
          created_at: string;
          id: string;
          product_id: string;
          record_id: string;
          state: Database["public"]["Enums"]["states"];
        };
        Insert: {
          created_at?: string;
          id?: string;
          product_id: string;
          record_id: string;
          state: Database["public"]["Enums"]["states"];
        };
        Update: {
          created_at?: string;
          id?: string;
          product_id?: string;
          record_id?: string;
          state?: Database["public"]["Enums"]["states"];
        };
        Relationships: [
          {
            foreignKeyName: "inscriptions_record_products_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "inscriptions_products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "inscriptions_record_products_record_id_fkey";
            columns: ["record_id"];
            isOneToOne: false;
            referencedRelation: "inscriptions_records";
            referencedColumns: ["id"];
          },
        ];
      };
      inscriptions_records: {
        Row: {
          amount_discount: number | null;
          amount_total: number;
          auth_form: Json[] | null;
          authorizations: string[] | null;
          coupon_id: string | null;
          created_at: string;
          created_by: string | null;
          discounts_auto: string[] | null;
          discounts_selected: string[] | null;
          id: string;
          inscription_id: string;
          main_form: Json[];
          payment_order: string | null;
          state: Database["public"]["Enums"]["states"];
          updated_at: string;
          user_id: string;
        };
        Insert: {
          amount_discount?: number | null;
          amount_total: number;
          auth_form?: Json[] | null;
          authorizations?: string[] | null;
          coupon_id?: string | null;
          created_at?: string;
          created_by?: string | null;
          discounts_auto?: string[] | null;
          discounts_selected?: string[] | null;
          id?: string;
          inscription_id: string;
          main_form: Json[];
          payment_order?: string | null;
          state: Database["public"]["Enums"]["states"];
          updated_at?: string;
          user_id: string;
        };
        Update: {
          amount_discount?: number | null;
          amount_total?: number;
          auth_form?: Json[] | null;
          authorizations?: string[] | null;
          coupon_id?: string | null;
          created_at?: string;
          created_by?: string | null;
          discounts_auto?: string[] | null;
          discounts_selected?: string[] | null;
          id?: string;
          inscription_id?: string;
          main_form?: Json[];
          payment_order?: string | null;
          state?: Database["public"]["Enums"]["states"];
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "inscriptions_records_coupon_id_fkey";
            columns: ["coupon_id"];
            isOneToOne: false;
            referencedRelation: "payments_coupons";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "inscriptions_records_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "inscriptions_records_inscription_id_fkey";
            columns: ["inscription_id"];
            isOneToOne: false;
            referencedRelation: "inscriptions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "inscriptions_records_payment_order_fkey";
            columns: ["payment_order"];
            isOneToOne: false;
            referencedRelation: "payments_orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "inscriptions_records_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      organization_modules: {
        Row: {
          action: Database["public"]["Enums"]["org_mudules_action"] | null;
          created_at: string;
          enable: boolean | null;
          id: string;
          label: string | null;
          order: number | null;
          org_id: string | null;
          type: Database["public"]["Enums"]["org_modules_type"] | null;
        };
        Insert: {
          action?: Database["public"]["Enums"]["org_mudules_action"] | null;
          created_at?: string;
          enable?: boolean | null;
          id?: string;
          label?: string | null;
          order?: number | null;
          org_id?: string | null;
          type?: Database["public"]["Enums"]["org_modules_type"] | null;
        };
        Update: {
          action?: Database["public"]["Enums"]["org_mudules_action"] | null;
          created_at?: string;
          enable?: boolean | null;
          id?: string;
          label?: string | null;
          order?: number | null;
          org_id?: string | null;
          type?: Database["public"]["Enums"]["org_modules_type"] | null;
        };
        Relationships: [
          {
            foreignKeyName: "organization_modules_org_id_fkey";
            columns: ["org_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
        ];
      };
      organizations: {
        Row: {
          address: string | null;
          city: string | null;
          cover: string | null;
          created_at: string;
          created_by: string | null;
          drawer: Json[] | null;
          email: string | null;
          enable: boolean;
          facebook: string | null;
          firebase_id: string | null;
          id: string;
          instagram: string | null;
          logo: string | null;
          organization_type:
            | Database["public"]["Enums"]["organization_type"]
            | null;
          phone: string | null;
          position: Json | null;
          postal_code: string | null;
          primary_color: string | null;
          province: string;
          slug: string;
          title: string;
          twitter: string | null;
          updated_at: string | null;
          updated_by: string | null;
          web: string | null;
          youtube: string | null;
        };
        Insert: {
          address?: string | null;
          city?: string | null;
          cover?: string | null;
          created_at?: string;
          created_by?: string | null;
          drawer?: Json[] | null;
          email?: string | null;
          enable?: boolean;
          facebook?: string | null;
          firebase_id?: string | null;
          id?: string;
          instagram?: string | null;
          logo?: string | null;
          organization_type?:
            | Database["public"]["Enums"]["organization_type"]
            | null;
          phone?: string | null;
          position?: Json | null;
          postal_code?: string | null;
          primary_color?: string | null;
          province: string;
          slug: string;
          title: string;
          twitter?: string | null;
          updated_at?: string | null;
          updated_by?: string | null;
          web?: string | null;
          youtube?: string | null;
        };
        Update: {
          address?: string | null;
          city?: string | null;
          cover?: string | null;
          created_at?: string;
          created_by?: string | null;
          drawer?: Json[] | null;
          email?: string | null;
          enable?: boolean;
          facebook?: string | null;
          firebase_id?: string | null;
          id?: string;
          instagram?: string | null;
          logo?: string | null;
          organization_type?:
            | Database["public"]["Enums"]["organization_type"]
            | null;
          phone?: string | null;
          position?: Json | null;
          postal_code?: string | null;
          primary_color?: string | null;
          province?: string;
          slug?: string;
          title?: string;
          twitter?: string | null;
          updated_at?: string | null;
          updated_by?: string | null;
          web?: string | null;
          youtube?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "organizations_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "organizations_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      organizations_users: {
        Row: {
          created_at: string;
          organization_id: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          organization_id: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string;
          organization_id?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "organizations_users_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "organizations_users_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      payment_coupons_records: {
        Row: {
          coupon_id: string;
          created_at: string;
          id: string;
          user_id: string;
        };
        Insert: {
          coupon_id: string;
          created_at?: string;
          id?: string;
          user_id: string;
        };
        Update: {
          coupon_id?: string;
          created_at?: string;
          id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "payment_coupons_records_coupon_id_fkey";
            columns: ["coupon_id"];
            isOneToOne: false;
            referencedRelation: "payments_coupons";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "payment_coupons_records_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      payments: {
        Row: {
          amount: number;
          collection_date: string | null;
          created_at: string;
          id: string;
          payments_order_id: string;
          product_id: string;
          redsys_message_result: string | null;
          redsys_order: string | null;
          state: Database["public"]["Enums"]["states"];
          updated_at: string;
        };
        Insert: {
          amount: number;
          collection_date?: string | null;
          created_at?: string;
          id?: string;
          payments_order_id: string;
          product_id: string;
          redsys_message_result?: string | null;
          redsys_order?: string | null;
          state: Database["public"]["Enums"]["states"];
          updated_at?: string;
        };
        Update: {
          amount?: number;
          collection_date?: string | null;
          created_at?: string;
          id?: string;
          payments_order_id?: string;
          product_id?: string;
          redsys_message_result?: string | null;
          redsys_order?: string | null;
          state?: Database["public"]["Enums"]["states"];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "payments_payments_order_id_fkey";
            columns: ["payments_order_id"];
            isOneToOne: false;
            referencedRelation: "payments_orders";
            referencedColumns: ["id"];
          },
        ];
      };
      payments_accounts: {
        Row: {
          created_at: string;
          created_by: string | null;
          enable: boolean;
          id: string;
          org_id: string;
          title: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          enable?: boolean;
          id?: string;
          org_id: string;
          title: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          enable?: boolean;
          id?: string;
          org_id?: string;
          title?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "payments_accounts_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "payments_accounts_org_id_fkey";
            columns: ["org_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "payments_accounts_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      payments_cards: {
        Row: {
          card_number: string | null;
          created_at: string;
          enabled: boolean;
          id: string;
          title: string | null;
          token: string;
          user_id: string;
          user_visibility: boolean;
        };
        Insert: {
          card_number?: string | null;
          created_at?: string;
          enabled?: boolean;
          id?: string;
          title?: string | null;
          token: string;
          user_id: string;
          user_visibility?: boolean;
        };
        Update: {
          card_number?: string | null;
          created_at?: string;
          enabled?: boolean;
          id?: string;
          title?: string | null;
          token?: string;
          user_id?: string;
          user_visibility?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "payments_cards_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      payments_coupons: {
        Row: {
          code: string;
          created_at: string;
          created_by: string | null;
          discount_amount: number;
          discount_type: Database["public"]["Enums"]["discount_type"];
          enable: boolean;
          id: string;
          limit_date_end: string | null;
          limit_date_init: string | null;
          org_id: string;
          procedure_type: string;
          title: string;
          updated_at: string;
          updated_by: string | null;
          use_limit: number;
          used_count: number | null;
          users_allowed: string[] | null;
        };
        Insert: {
          code: string;
          created_at?: string;
          created_by?: string | null;
          discount_amount: number;
          discount_type: Database["public"]["Enums"]["discount_type"];
          enable: boolean;
          id?: string;
          limit_date_end?: string | null;
          limit_date_init?: string | null;
          org_id: string;
          procedure_type: string;
          title: string;
          updated_at?: string;
          updated_by?: string | null;
          use_limit: number;
          used_count?: number | null;
          users_allowed?: string[] | null;
        };
        Update: {
          code?: string;
          created_at?: string;
          created_by?: string | null;
          discount_amount?: number;
          discount_type?: Database["public"]["Enums"]["discount_type"];
          enable?: boolean;
          id?: string;
          limit_date_end?: string | null;
          limit_date_init?: string | null;
          org_id?: string;
          procedure_type?: string;
          title?: string;
          updated_at?: string;
          updated_by?: string | null;
          use_limit?: number;
          used_count?: number | null;
          users_allowed?: string[] | null;
        };
        Relationships: [
          {
            foreignKeyName: "payments_coupons_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "payments_coupons_org_id_fkey";
            columns: ["org_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "payments_coupons_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      payments_coupons_accounts: {
        Row: {
          accounts_id: string;
          coupons_id: string;
          created_at: string;
          created_by: string | null;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          accounts_id: string;
          coupons_id: string;
          created_at?: string;
          created_by?: string | null;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          accounts_id?: string;
          coupons_id?: string;
          created_at?: string;
          created_by?: string | null;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "payments_coupons_accounts_accounts_id_fkey";
            columns: ["accounts_id"];
            isOneToOne: false;
            referencedRelation: "payments_accounts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "payments_coupons_accounts_coupons_id_fkey";
            columns: ["coupons_id"];
            isOneToOne: false;
            referencedRelation: "payments_coupons";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "payments_coupons_accounts_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "payments_coupons_accounts_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      payments_coupons_procedures: {
        Row: {
          bookings_items_id: string | null;
          coupons_id: string;
          created_at: string;
          created_by: string | null;
          id: string;
          inscriptions_id: string | null;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          bookings_items_id?: string | null;
          coupons_id: string;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          inscriptions_id?: string | null;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          bookings_items_id?: string | null;
          coupons_id?: string;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          inscriptions_id?: string | null;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "payments_coupons_procedures_bookings_items_id_fkey";
            columns: ["bookings_items_id"];
            isOneToOne: false;
            referencedRelation: "bookings_items";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "payments_coupons_procedures_coupons_id_fkey";
            columns: ["coupons_id"];
            isOneToOne: false;
            referencedRelation: "payments_coupons";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "payments_coupons_procedures_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "payments_coupons_procedures_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      payments_mandates: {
        Row: {
          app_code: string | null;
          audit_trail_page: string | null;
          callback_mail: string | null;
          callback_phone: string | null;
          callback_response: string | null;
          callback_url: string | null;
          code: string | null;
          created_at: string;
          created_by: string | null;
          data: Json | null;
          document: Json | null;
          enabled: boolean;
          group_code: string | null;
          id: string;
          notification: Json | null;
          org_id: string;
          policies: Json[] | null;
          server: string | null;
          sign_page_server: string | null;
          time_zone: string | null;
          updated_at: string;
          updated_by: string | null;
          user_id: string | null;
          workflow: Json | null;
        };
        Insert: {
          app_code?: string | null;
          audit_trail_page?: string | null;
          callback_mail?: string | null;
          callback_phone?: string | null;
          callback_response?: string | null;
          callback_url?: string | null;
          code?: string | null;
          created_at?: string;
          created_by?: string | null;
          data?: Json | null;
          document?: Json | null;
          enabled?: boolean;
          group_code?: string | null;
          id?: string;
          notification?: Json | null;
          org_id: string;
          policies?: Json[] | null;
          server?: string | null;
          sign_page_server?: string | null;
          time_zone?: string | null;
          updated_at?: string;
          updated_by?: string | null;
          user_id?: string | null;
          workflow?: Json | null;
        };
        Update: {
          app_code?: string | null;
          audit_trail_page?: string | null;
          callback_mail?: string | null;
          callback_phone?: string | null;
          callback_response?: string | null;
          callback_url?: string | null;
          code?: string | null;
          created_at?: string;
          created_by?: string | null;
          data?: Json | null;
          document?: Json | null;
          enabled?: boolean;
          group_code?: string | null;
          id?: string;
          notification?: Json | null;
          org_id?: string;
          policies?: Json[] | null;
          server?: string | null;
          sign_page_server?: string | null;
          time_zone?: string | null;
          updated_at?: string;
          updated_by?: string | null;
          user_id?: string | null;
          workflow?: Json | null;
        };
        Relationships: [
          {
            foreignKeyName: "payments_mandates_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "payments_mandates_org_id_fkey";
            columns: ["org_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "payments_mandates_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "payments_mandates_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      payments_methods: {
        Row: {
          created_at: string;
          created_by: string | null;
          enable: boolean;
          enviroment: string;
          id: number;
          key_signature_production: string | null;
          key_signature_sandbox: string | null;
          merchant_code: string | null;
          org_id: string;
          provider:
            | Database["public"]["Enums"]["payments_methods_provider"]
            | null;
          terminal: number | null;
          title: string;
          type: Database["public"]["Enums"]["payments_methods_type"];
          updated_at: string;
          updated_by: string | null;
          viafirma_group: string | null;
          viafirma_template: string | null;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          enable: boolean;
          enviroment: string;
          id?: number;
          key_signature_production?: string | null;
          key_signature_sandbox?: string | null;
          merchant_code?: string | null;
          org_id: string;
          provider?:
            | Database["public"]["Enums"]["payments_methods_provider"]
            | null;
          terminal?: number | null;
          title: string;
          type: Database["public"]["Enums"]["payments_methods_type"];
          updated_at?: string;
          updated_by?: string | null;
          viafirma_group?: string | null;
          viafirma_template?: string | null;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          enable?: boolean;
          enviroment?: string;
          id?: number;
          key_signature_production?: string | null;
          key_signature_sandbox?: string | null;
          merchant_code?: string | null;
          org_id?: string;
          provider?:
            | Database["public"]["Enums"]["payments_methods_provider"]
            | null;
          terminal?: number | null;
          title?: string;
          type?: Database["public"]["Enums"]["payments_methods_type"];
          updated_at?: string;
          updated_by?: string | null;
          viafirma_group?: string | null;
          viafirma_template?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "payments_methods_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "payments_methods_org_id_fkey";
            columns: ["org_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "payments_methods_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      payments_orders: {
        Row: {
          amount: number;
          card_id: string | null;
          created_at: string;
          created_by: string | null;
          id: string;
          module: Database["public"]["Enums"]["module"];
          payment_account_id: string;
          payment_method_id: number;
          record_id: string;
          state: Database["public"]["Enums"]["states"];
          total_payments: number | null;
          updated_at: string;
          updated_by: string | null;
          user_id: string;
        };
        Insert: {
          amount: number;
          card_id?: string | null;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          module: Database["public"]["Enums"]["module"];
          payment_account_id: string;
          payment_method_id: number;
          record_id: string;
          state: Database["public"]["Enums"]["states"];
          total_payments?: number | null;
          updated_at?: string;
          updated_by?: string | null;
          user_id: string;
        };
        Update: {
          amount?: number;
          card_id?: string | null;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          module?: Database["public"]["Enums"]["module"];
          payment_account_id?: string;
          payment_method_id?: number;
          record_id?: string;
          state?: Database["public"]["Enums"]["states"];
          total_payments?: number | null;
          updated_at?: string;
          updated_by?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "payments_orders_card_id_fkey";
            columns: ["card_id"];
            isOneToOne: false;
            referencedRelation: "payments_cards";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "payments_orders_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "payments_orders_payment_account_id_fkey";
            columns: ["payment_account_id"];
            isOneToOne: false;
            referencedRelation: "payments_accounts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "payments_orders_payment_method_id_fkey";
            columns: ["payment_method_id"];
            isOneToOne: false;
            referencedRelation: "payments_methods";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "payments_orders_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "payments_orders_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      payments_pocket: {
        Row: {
          amount: number;
          created_at: string;
          id: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          amount: number;
          created_at?: string;
          id?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          amount?: number;
          created_at?: string;
          id?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "payments_pocket_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      payments_pocket_history: {
        Row: {
          amount: number;
          created_at: string;
          id: string;
          pocket_id: string;
          updated_at: string;
        };
        Insert: {
          amount: number;
          created_at?: string;
          id?: string;
          pocket_id: string;
          updated_at?: string;
        };
        Update: {
          amount?: number;
          created_at?: string;
          id?: string;
          pocket_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "payments_pocket_history_pocket_id_fkey";
            columns: ["pocket_id"];
            isOneToOne: false;
            referencedRelation: "payments_pocket";
            referencedColumns: ["id"];
          },
        ];
      };
      tasks: {
        Row: {
          created_at: string;
          created_by: string | null;
          description: string;
          documents: string[] | null;
          id: string;
          images: string[] | null;
          position: number[] | null;
          priority: number | null;
          state: string;
          tasks_category_id: string;
          title: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          description: string;
          documents?: string[] | null;
          id?: string;
          images?: string[] | null;
          position?: number[] | null;
          priority?: number | null;
          state?: string;
          tasks_category_id: string;
          title: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          description?: string;
          documents?: string[] | null;
          id?: string;
          images?: string[] | null;
          position?: number[] | null;
          priority?: number | null;
          state?: string;
          tasks_category_id?: string;
          title?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "tasks_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tasks_tasks_category_id_fkey";
            columns: ["tasks_category_id"];
            isOneToOne: false;
            referencedRelation: "tasks_projects_categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tasks_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      tasks_assigned_technician: {
        Row: {
          created_at: string;
          created_by: string | null;
          id: string;
          task_id: string;
          technician_id: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          id?: string;
          task_id: string;
          technician_id: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          id?: string;
          task_id?: string;
          technician_id?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_technician_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tasks_assigned_technician_task_id_fkey";
            columns: ["task_id"];
            isOneToOne: false;
            referencedRelation: "tasks";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tasks_assigned_technician_technician_id_fkey";
            columns: ["technician_id"];
            isOneToOne: false;
            referencedRelation: "wa_technicians";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tasks_assigned_technician_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      tasks_project_administrators: {
        Row: {
          admin_id: string;
          created_at: string;
          created_by: string | null;
          id: string;
          project_id: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          admin_id: string;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          project_id: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          admin_id?: string;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          project_id?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "tasks_project_administrators_admin_id_fkey";
            columns: ["admin_id"];
            isOneToOne: false;
            referencedRelation: "groups";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tasks_project_administrators_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tasks_project_administrators_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "tasks_projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tasks_project_administrators_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      tasks_projects: {
        Row: {
          created_at: string;
          created_by: string | null;
          description: string | null;
          enable: boolean;
          id: string;
          org_id: string;
          title: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          enable?: boolean;
          id?: string;
          org_id: string;
          title: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          enable?: boolean;
          id?: string;
          org_id?: string;
          title?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "tasks_projects_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tasks_projects_org_id_fkey";
            columns: ["org_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tasks_projects_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      tasks_projects_categories: {
        Row: {
          auto_assign: boolean;
          created_at: string;
          created_by: string | null;
          description: string | null;
          enabled: boolean | null;
          id: string;
          tasks_project_id: string;
          title: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          auto_assign?: boolean;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          enabled?: boolean | null;
          id?: string;
          tasks_project_id: string;
          title: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          auto_assign?: boolean;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          enabled?: boolean | null;
          id?: string;
          tasks_project_id?: string;
          title?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "tasks_projects_categories_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tasks_projects_categories_tasks_project_id_fkey";
            columns: ["tasks_project_id"];
            isOneToOne: false;
            referencedRelation: "tasks_projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tasks_projects_categories_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      tasks_projects_category_technicians: {
        Row: {
          created_at: string;
          created_by: string | null;
          id: string;
          project_category_id: string;
          technician_id: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          id?: string;
          project_category_id: string;
          technician_id: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          id?: string;
          project_category_id?: string;
          technician_id?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "tasks_projects_category_technicians_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tasks_projects_category_technicians_project_category_id_fkey";
            columns: ["project_category_id"];
            isOneToOne: false;
            referencedRelation: "tasks_projects_categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tasks_projects_category_technicians_technician_id_fkey";
            columns: ["technician_id"];
            isOneToOne: false;
            referencedRelation: "wa_technicians";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tasks_projects_category_technicians_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      tasks_projects_technicians: {
        Row: {
          created_at: string;
          created_by: string | null;
          id: string;
          tasks_project_id: string;
          technician_id: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          id?: string;
          tasks_project_id: string;
          technician_id: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          id?: string;
          tasks_project_id?: string;
          technician_id?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "tasks_projects_technicians_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tasks_projects_technicians_tasks_project_id_fkey";
            columns: ["tasks_project_id"];
            isOneToOne: false;
            referencedRelation: "tasks_projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tasks_projects_technicians_technician_id_fkey";
            columns: ["technician_id"];
            isOneToOne: false;
            referencedRelation: "wa_technicians";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tasks_projects_technicians_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      tickets: {
        Row: {
          access_control_device: string | null;
          address: string | null;
          apply_coupons: boolean;
          capacity: number;
          created_at: string;
          created_by: string | null;
          description: string | null;
          enabled: boolean;
          entry_control: boolean;
          event_date_end: string | null;
          event_date_init: string | null;
          event_type: Database["public"]["Enums"]["tickets_event_type"];
          id: string;
          image: string | null;
          is_free: boolean;
          legal_content: string | null;
          legal_required: boolean | null;
          legal_title: string | null;
          order: number;
          org_id: string;
          payment_period_type:
            | Database["public"]["Enums"]["payment_fraction_period"]
            | null;
          payments_account_id: string | null;
          period_end_date: string | null;
          period_init_date: string | null;
          period_month_day: number | null;
          period_week_day: Database["public"]["Enums"]["week_days"] | null;
          position: number[] | null;
          sell_date_end: string | null;
          sell_date_init: string | null;
          shifts: boolean | null;
          title: string;
          updated_at: string;
          updated_by: string | null;
          validation_date_end: string | null;
          validation_date_init: string | null;
        };
        Insert: {
          access_control_device?: string | null;
          address?: string | null;
          apply_coupons?: boolean;
          capacity: number;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          enabled?: boolean;
          entry_control?: boolean;
          event_date_end?: string | null;
          event_date_init?: string | null;
          event_type?: Database["public"]["Enums"]["tickets_event_type"];
          id?: string;
          image?: string | null;
          is_free?: boolean;
          legal_content?: string | null;
          legal_required?: boolean | null;
          legal_title?: string | null;
          order: number;
          org_id: string;
          payment_period_type?:
            | Database["public"]["Enums"]["payment_fraction_period"]
            | null;
          payments_account_id?: string | null;
          period_end_date?: string | null;
          period_init_date?: string | null;
          period_month_day?: number | null;
          period_week_day?: Database["public"]["Enums"]["week_days"] | null;
          position?: number[] | null;
          sell_date_end?: string | null;
          sell_date_init?: string | null;
          shifts?: boolean | null;
          title: string;
          updated_at?: string;
          updated_by?: string | null;
          validation_date_end?: string | null;
          validation_date_init?: string | null;
        };
        Update: {
          access_control_device?: string | null;
          address?: string | null;
          apply_coupons?: boolean;
          capacity?: number;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          enabled?: boolean;
          entry_control?: boolean;
          event_date_end?: string | null;
          event_date_init?: string | null;
          event_type?: Database["public"]["Enums"]["tickets_event_type"];
          id?: string;
          image?: string | null;
          is_free?: boolean;
          legal_content?: string | null;
          legal_required?: boolean | null;
          legal_title?: string | null;
          order?: number;
          org_id?: string;
          payment_period_type?:
            | Database["public"]["Enums"]["payment_fraction_period"]
            | null;
          payments_account_id?: string | null;
          period_end_date?: string | null;
          period_init_date?: string | null;
          period_month_day?: number | null;
          period_week_day?: Database["public"]["Enums"]["week_days"] | null;
          position?: number[] | null;
          sell_date_end?: string | null;
          sell_date_init?: string | null;
          shifts?: boolean | null;
          title?: string;
          updated_at?: string;
          updated_by?: string | null;
          validation_date_end?: string | null;
          validation_date_init?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "tickets_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tickets_org_id_fkey";
            columns: ["org_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tickets_payments_account_id_fkey";
            columns: ["payments_account_id"];
            isOneToOne: false;
            referencedRelation: "payments_accounts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tickets_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      tickets_payments_methods: {
        Row: {
          created_at: string;
          created_by: string | null;
          for_technician: boolean;
          id: string;
          payment_method: number;
          ticket_id: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          for_technician?: boolean;
          id?: string;
          payment_method: number;
          ticket_id: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          for_technician?: boolean;
          id?: string;
          payment_method?: number;
          ticket_id?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "tickets_payments_methods_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tickets_payments_methods_payment_method_fkey";
            columns: ["payment_method"];
            isOneToOne: false;
            referencedRelation: "payments_methods";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tickets_payments_methods_ticket_id_fkey";
            columns: ["ticket_id"];
            isOneToOne: false;
            referencedRelation: "tickets";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tickets_payments_methods_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      tickets_product_record: {
        Row: {
          additional_data: Json[] | null;
          created_at: string;
          created_by: string | null;
          id: string;
          product_id: string;
          session_date_end: string | null;
          session_date_init: string | null;
          ticket_record_id: string;
          ticket_timetable_id: string | null;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          additional_data?: Json[] | null;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          product_id: string;
          session_date_end?: string | null;
          session_date_init?: string | null;
          ticket_record_id: string;
          ticket_timetable_id?: string | null;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          additional_data?: Json[] | null;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          product_id?: string;
          session_date_end?: string | null;
          session_date_init?: string | null;
          ticket_record_id?: string;
          ticket_timetable_id?: string | null;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "tickets_product_record_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tickets_product_record_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "tickets_products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tickets_product_record_ticket_record_id_fkey";
            columns: ["ticket_record_id"];
            isOneToOne: false;
            referencedRelation: "tickets_records";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tickets_product_record_ticket_timetable_id_fkey";
            columns: ["ticket_timetable_id"];
            isOneToOne: false;
            referencedRelation: "tickets_timetable";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tickets_product_record_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      tickets_products: {
        Row: {
          aditional_form: Json[] | null;
          amount_max: number | null;
          amount_min: number | null;
          capacity: number | null;
          created_at: string;
          created_by: string | null;
          description: string | null;
          enabled: boolean;
          id: string;
          is_free: boolean;
          limit_date_end: string | null;
          limit_date_init: string | null;
          limit_type:
            | Database["public"]["Enums"]["ticket_product_limit_type"]
            | null;
          price: number | null;
          ticket_id: string;
          title: string;
          type: Database["public"]["Enums"]["ticket_product_type"];
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          aditional_form?: Json[] | null;
          amount_max?: number | null;
          amount_min?: number | null;
          capacity?: number | null;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          enabled?: boolean;
          id?: string;
          is_free?: boolean;
          limit_date_end?: string | null;
          limit_date_init?: string | null;
          limit_type?:
            | Database["public"]["Enums"]["ticket_product_limit_type"]
            | null;
          price?: number | null;
          ticket_id: string;
          title: string;
          type?: Database["public"]["Enums"]["ticket_product_type"];
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          aditional_form?: Json[] | null;
          amount_max?: number | null;
          amount_min?: number | null;
          capacity?: number | null;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          enabled?: boolean;
          id?: string;
          is_free?: boolean;
          limit_date_end?: string | null;
          limit_date_init?: string | null;
          limit_type?:
            | Database["public"]["Enums"]["ticket_product_limit_type"]
            | null;
          price?: number | null;
          ticket_id?: string;
          title?: string;
          type?: Database["public"]["Enums"]["ticket_product_type"];
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "tickets_products_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tickets_products_ticket_id_fkey";
            columns: ["ticket_id"];
            isOneToOne: false;
            referencedRelation: "tickets";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tickets_products_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      tickets_records: {
        Row: {
          coupon_id: string | null;
          created_at: string;
          created_by: string;
          discount: number | null;
          id: string;
          owner_email: string | null;
          owner_name: string | null;
          owner_nif: string | null;
          owner_phone: string | null;
          owner_surname: string | null;
          payment_method: string | null;
          price: number;
          state: Database["public"]["Enums"]["states"];
          ticket_id: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          coupon_id?: string | null;
          created_at?: string;
          created_by: string;
          discount?: number | null;
          id?: string;
          owner_email?: string | null;
          owner_name?: string | null;
          owner_nif?: string | null;
          owner_phone?: string | null;
          owner_surname?: string | null;
          payment_method?: string | null;
          price: number;
          state: Database["public"]["Enums"]["states"];
          ticket_id: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          coupon_id?: string | null;
          created_at?: string;
          created_by?: string;
          discount?: number | null;
          id?: string;
          owner_email?: string | null;
          owner_name?: string | null;
          owner_nif?: string | null;
          owner_phone?: string | null;
          owner_surname?: string | null;
          payment_method?: string | null;
          price?: number;
          state?: Database["public"]["Enums"]["states"];
          ticket_id?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "tickets_records_coupon_id_fkey";
            columns: ["coupon_id"];
            isOneToOne: false;
            referencedRelation: "payments_coupons";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tickets_records_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tickets_records_payment_method_fkey";
            columns: ["payment_method"];
            isOneToOne: false;
            referencedRelation: "tickets_payments_methods";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tickets_records_ticket_id_fkey";
            columns: ["ticket_id"];
            isOneToOne: false;
            referencedRelation: "tickets";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tickets_records_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      tickets_timetable: {
        Row: {
          created_at: string;
          created_by: string | null;
          id: string;
          ticket_id: string;
          time_end: string;
          time_init: string;
          updated_at: string;
          updated_by: string | null;
          week_day: Database["public"]["Enums"]["week_days"];
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          id?: string;
          ticket_id: string;
          time_end: string;
          time_init: string;
          updated_at?: string;
          updated_by?: string | null;
          week_day: Database["public"]["Enums"]["week_days"];
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          id?: string;
          ticket_id?: string;
          time_end?: string;
          time_init?: string;
          updated_at?: string;
          updated_by?: string | null;
          week_day?: Database["public"]["Enums"]["week_days"];
        };
        Relationships: [
          {
            foreignKeyName: "tickets_timetable_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tickets_timetable_ticket_id_fkey";
            columns: ["ticket_id"];
            isOneToOne: false;
            referencedRelation: "tickets";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tickets_timetable_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      users: {
        Row: {
          created_at: string;
          document: string;
          document_type: Database["public"]["Enums"]["document_type"];
          email: string;
          group_id: string | null;
          id: string;
          is_superadmin: boolean;
          name: string | null;
          phone: string | null;
          role: string | null;
          surname: string | null;
          uid: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          document: string;
          document_type?: Database["public"]["Enums"]["document_type"];
          email: string;
          group_id?: string | null;
          id?: string;
          is_superadmin?: boolean;
          name?: string | null;
          phone?: string | null;
          role?: string | null;
          surname?: string | null;
          uid?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          document?: string;
          document_type?: Database["public"]["Enums"]["document_type"];
          email?: string;
          group_id?: string | null;
          id?: string;
          is_superadmin?: boolean;
          name?: string | null;
          phone?: string | null;
          role?: string | null;
          surname?: string | null;
          uid?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "users_group_id_fkey";
            columns: ["group_id"];
            isOneToOne: false;
            referencedRelation: "groups";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "users_role_fkey";
            columns: ["role"];
            isOneToOne: false;
            referencedRelation: "users_roles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "users_uid_fkey";
            columns: ["uid"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      users_groups: {
        Row: {
          created_at: string;
          group_id: string;
          id: number;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          group_id: string;
          id?: number;
          user_id: string;
        };
        Update: {
          created_at?: string;
          group_id?: string;
          id?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "users_groups_group_id_fkey";
            columns: ["group_id"];
            isOneToOne: false;
            referencedRelation: "groups";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "users_groups_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      users_roles: {
        Row: {
          created_at: string;
          created_by: string | null;
          id: string;
          rules: Json;
          title: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          id?: string;
          rules: Json;
          title: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          id?: string;
          rules?: Json;
          title?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "users_roles_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "users_roles_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      wa_conversations: {
        Row: {
          billable: boolean | null;
          bot_number: string | null;
          category: string | null;
          conversation_id: string | null;
          created_at: string;
          current_state: string | null;
          expiration_date: string | null;
          expiration_timestamp: string | null;
          expired: boolean | null;
          id: string;
          message_creator: string | null;
          user_id: string | null;
          user_name: string | null;
          user_number: string | null;
        };
        Insert: {
          billable?: boolean | null;
          bot_number?: string | null;
          category?: string | null;
          conversation_id?: string | null;
          created_at?: string;
          current_state?: string | null;
          expiration_date?: string | null;
          expiration_timestamp?: string | null;
          expired?: boolean | null;
          id?: string;
          message_creator?: string | null;
          user_id?: string | null;
          user_name?: string | null;
          user_number?: string | null;
        };
        Update: {
          billable?: boolean | null;
          bot_number?: string | null;
          category?: string | null;
          conversation_id?: string | null;
          created_at?: string;
          current_state?: string | null;
          expiration_date?: string | null;
          expiration_timestamp?: string | null;
          expired?: boolean | null;
          id?: string;
          message_creator?: string | null;
          user_id?: string | null;
          user_name?: string | null;
          user_number?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "wa_conversations_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      wa_messages: {
        Row: {
          conversation_state: string | null;
          created_at: string;
          id: string;
          interactive_id: string | null;
          interactive_title: string | null;
          interactive_type: string | null;
          payload: Json | null;
          sender_type: string | null;
          state: string | null;
          text: string | null;
          type: string | null;
          wa_conversation_id: string | null;
          wa_process_id: string | null;
          wa_user: string | null;
          wam_id: string | null;
        };
        Insert: {
          conversation_state?: string | null;
          created_at?: string;
          id?: string;
          interactive_id?: string | null;
          interactive_title?: string | null;
          interactive_type?: string | null;
          payload?: Json | null;
          sender_type?: string | null;
          state?: string | null;
          text?: string | null;
          type?: string | null;
          wa_conversation_id?: string | null;
          wa_process_id?: string | null;
          wa_user?: string | null;
          wam_id?: string | null;
        };
        Update: {
          conversation_state?: string | null;
          created_at?: string;
          id?: string;
          interactive_id?: string | null;
          interactive_title?: string | null;
          interactive_type?: string | null;
          payload?: Json | null;
          sender_type?: string | null;
          state?: string | null;
          text?: string | null;
          type?: string | null;
          wa_conversation_id?: string | null;
          wa_process_id?: string | null;
          wa_user?: string | null;
          wam_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "wa_messages_wa_conversation_id_fkey";
            columns: ["wa_conversation_id"];
            isOneToOne: false;
            referencedRelation: "wa_conversations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "wa_messages_wa_process_id_fkey";
            columns: ["wa_process_id"];
            isOneToOne: false;
            referencedRelation: "wa_process";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "wa_messages_wa_user_fkey";
            columns: ["wa_user"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      wa_process: {
        Row: {
          conversation_id: string;
          created_at: string;
          data: Json | null;
          id: string;
          module: string;
        };
        Insert: {
          conversation_id: string;
          created_at?: string;
          data?: Json | null;
          id?: string;
          module: string;
        };
        Update: {
          conversation_id?: string;
          created_at?: string;
          data?: Json | null;
          id?: string;
          module?: string;
        };
        Relationships: [
          {
            foreignKeyName: "wa_process_conversation_id_fkey";
            columns: ["conversation_id"];
            isOneToOne: false;
            referencedRelation: "wa_conversations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "wa_process_module_fkey";
            columns: ["module"];
            isOneToOne: false;
            referencedRelation: "organization_modules";
            referencedColumns: ["id"];
          },
        ];
      };
      wa_technicians: {
        Row: {
          created_at: string;
          created_by: string | null;
          id: string;
          logged_on: boolean | null;
          updated_at: string;
          updated_by: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          id?: string;
          logged_on?: boolean | null;
          updated_at?: string;
          updated_by?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          id?: string;
          logged_on?: boolean | null;
          updated_at?: string;
          updated_by?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "wa_technicians_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "wa_technicians_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "wa_technicians_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      wa_users: {
        Row: {
          created_at: string;
          id: string;
          user_id: string;
          wa_conversation_id: string | null;
          wa_id: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          user_id: string;
          wa_conversation_id?: string | null;
          wa_id?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          user_id?: string;
          wa_conversation_id?: string | null;
          wa_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "wa_users_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "wa_users_wa_conversation_id_fkey";
            columns: ["wa_conversation_id"];
            isOneToOne: false;
            referencedRelation: "wa_conversations";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      general_entities: {
        Args: {
          p_table_name: string;
          search_data: Json;
          p_order_by?: string;
          p_order_dir?: string;
          init_range?: number;
          end_range?: number;
        };
        Returns: { data: any[]; count: number };
      };

      access_control: {
        Args: {
          init_range?: number;
          end_range?: number;
          p_order_by?: string;
          p_order_dir?: string;
          p_search_term?: string;
          filters_type?: string[];
        };
        Returns: { data: any[]; count: number };
      };

      content_with_categories: {
        Args: {
          p_order_by?: string;
          p_order_dir?: string;
          init_range?: number;
          end_range?: number;
          p_search_term?: string;
          filters_category?: string[];
        };
        Returns: { data: any[]; count: number };
      };

      inscriptions: {
        Args: {
          init_range?: number;
          end_range?: number;
          p_order_by?: string;
          p_order_dir?: string;
          p_search_term?: string;
          p_enabled_filters?: string[];
        };
        Returns: { data: any[]; count: number };
      };

      get_payments_for_order_id: {
        Args: {
          p_payments_order_id: string;
        };
        Returns: { data: any[] };
      };

      payments_orders: {
        Args: {
          init_range: number;
          end_range: number;
          p_order_by?: string;
          p_order_dir?: string;
          p_search_term?: string;
          filters_status?: string[];
          filters_modules?: string[];
          filters_methods?: number[];
        };
        Returns: { data: any[]; count: number };
      };

      payments_methods: {
        Args: {
          init_range: number;
          end_range: number;
          p_order_by?: string;
          p_order_dir?: string;
          p_search_term?: string;
          p_types_filters?: string[];
        };
        Returns: { data: any[]; count: number };
      };

      bookings_info_by_items: {
        Args: {
          bookings_items_ids_param: string[];
          init_range: number;
          end_range: number;
        };
        Returns: { data: any[]; count: number };
      };
    };
    Enums: {
      authorization_type: "TEXT" | "ARTICLE";
      bookings_installations_type: "INSTALLATION" | "SERVICE";
      bookings_session_type: "HOURS" | "DAYS";
      competition_elimination_phase:
        | "NOT_APPLICABLE"
        | "ROUND_OF_16"
        | "QUARTERFINALS"
        | "SEMIFINALS"
        | "EIGHTH_FINALS";
      competition_type: "LEAGUE" | "TOURNAMENT";
      competitions_sports_types: "FOOTBALL" | "TENNIS";
      content_types: "ARTICLES" | "EVENTS" | "PLACES";
      device_provider: "RAIXER" | "IGLOOHOME" | "SHELLY" | "AKILES";
      device_type: "LIGHT" | "DOOR" | "CODE";
      discount_method:
        | "USER_SELECTION"
        | "QUANTITY_PRODUCTS"
        | "PAYMENT_METHOD"
        | "MANUAL";
      discount_type: "PERCENTAGE" | "FIXED";
      document_type: "DNI" | "NIE" | "CIF";
      entities_fields:
        | "STRING"
        | "INTEGER"
        | "FLOAT"
        | "DATETIME"
        | "BOOLEAN"
        | "LIST_MULTIPLE"
        | "LIST_UNIQUE"
        | "WYSIWYG"
        | "HTML"
        | "LIST_IMAGES"
        | "LIST_VIDEOS"
        | "DOCUMENTS"
        | "MAP"
        | "PHONE"
        | "URL"
        | "EMAIL";
      enviroment_type: "DASHBOARD" | "APP" | "DEVELOP" | "PRODUCTION";
      inscription_type: "NORMAL" | "COMPETITION";
      inscriptions_activities_order_by: "ALPHABETICAL" | "MANUAL";
      inscriptions_forms_type: "MAIN" | "AUTH";
      inscriptions_input_types:
        | "NAME"
        | "SURNAME"
        | "NIF"
        | "EMAIL"
        | "PHONE"
        | "ADDRESS"
        | "LOCALITY"
        | "POSTAL_CODE"
        | "PROVINCE"
        | "DATE_BIRTH"
        | "STRING"
        | "LIST_SIMPLE"
        | "LIST_MULTIPLE"
        | "BOOLEAN"
        | "INTEGER"
        | "FLOAT"
        | "DATE";
      module: "BOOKINGS" | "INSCRIPTIONS" | "TICKETS";
      org_modules_type:
        | "TECHNICALS"
        | "ARTICLES"
        | "EVENTS"
        | "INSCRIPTIONS"
        | "INSTALLATION"
        | "SERVICE"
        | "TASK";
      org_mudules_action:
        | "technicals-list"
        | "content-list"
        | "inscriptions-list"
        | "bookings"
        | "tasks";
      organization_type: "COUNCIL";
      payment_fraction_period: "MONTH" | "WEEK" | "ANNUAL" | "QUATERLY";
      payments_methods_provider: "REDSYS" | "VIAFIRMA";
      payments_methods_type: "CASH" | "DEPOSIT" | "POCKET" | "TPV" | "DEBIT";
      states:
        | "CONFIRMED"
        | "IN_PROGRESS"
        | "CANCELED"
        | "PENDING"
        | "COMPLETED"
        | "DENIED"
        | "ERROR";
      ticket_product_limit_type: "DATE" | "DAY" | "UNIT";
      ticket_product_type: "TICKET" | "SUBSCRIPTION";
      tickets_event_type: "SINGLE" | "RECURRENT";
      week_days:
        | "MONDAY"
        | "TUESDAY"
        | "WEDNESDAY"
        | "THURSDAY"
        | "FRIDAY"
        | "SATURDAY"
        | "SUNDAY";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never;
