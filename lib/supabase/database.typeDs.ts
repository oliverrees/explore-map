export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      events: {
        Row: {
          answer_value: string | null;
          complete: boolean | null;
          created_at: string;
          event_id: string | null;
          id: number;
          meta_data: Json | null;
          question_id: string | null;
          session_id: string | null;
        };
        Insert: {
          answer_value?: string | null;
          complete?: boolean | null;
          created_at?: string;
          event_id?: string | null;
          id?: number;
          meta_data?: Json | null;
          question_id?: string | null;
          session_id?: string | null;
        };
        Update: {
          answer_value?: string | null;
          complete?: boolean | null;
          created_at?: string;
          event_id?: string | null;
          id?: number;
          meta_data?: Json | null;
          question_id?: string | null;
          session_id?: string | null;
        };
        Relationships: [];
      };
      exploremap_users: {
        Row: {
          access_token: string | null;
          athelete_info: Json | null;
          created_at: string;
          expires_at: string | null;
          id: number;
          refresh_token: string | null;
          strava_id: string | null;
          unique_id: string | null;
        };
        Insert: {
          access_token?: string | null;
          athelete_info?: Json | null;
          created_at?: string;
          expires_at?: string | null;
          id?: number;
          refresh_token?: string | null;
          strava_id?: string | null;
          unique_id?: string | null;
        };
        Update: {
          access_token?: string | null;
          athelete_info?: Json | null;
          created_at?: string;
          expires_at?: string | null;
          id?: number;
          refresh_token?: string | null;
          strava_id?: string | null;
          unique_id?: string | null;
        };
        Relationships: [];
      };
      physiological_events: {
        Row: {
          created_at: string;
          data: Json | null;
          id: number;
        };
        Insert: {
          created_at?: string;
          data?: Json | null;
          id?: number;
        };
        Update: {
          created_at?: string;
          data?: Json | null;
          id?: number;
        };
        Relationships: [];
      };
      processed_results: {
        Row: {
          created_at: string;
          id: number;
          meta_data: Json | null;
          phys: Json | null;
          results: Json | null;
          session_id: string | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          meta_data?: Json | null;
          phys?: Json | null;
          results?: Json | null;
          session_id?: string | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          meta_data?: Json | null;
          phys?: Json | null;
          results?: Json | null;
          session_id?: string | null;
        };
        Relationships: [];
      };
      "russ-activities": {
        Row: {
          activity: Json | null;
          activity_id: string | null;
          created_at: string | null;
          date: string | null;
          geo_json: Json | null;
          id: number;
          weather: Json | null;
        };
        Insert: {
          activity?: Json | null;
          activity_id?: string | null;
          created_at?: string | null;
          date?: string | null;
          geo_json?: Json | null;
          id?: number;
          weather?: Json | null;
        };
        Update: {
          activity?: Json | null;
          activity_id?: string | null;
          created_at?: string | null;
          date?: string | null;
          geo_json?: Json | null;
          id?: number;
          weather?: Json | null;
        };
        Relationships: [];
      };
      studio_metadata: {
        Row: {
          created_at: string;
          id: number;
          meta_data: Json | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          meta_data?: Json | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          meta_data?: Json | null;
        };
        Relationships: [];
      };
    };
    Views: {
      latest_physiological_event: {
        Row: {
          created_at: string | null;
          data: Json | null;
          id: number | null;
        };
        Relationships: [];
      };
      sessions_not_processed: {
        Row: {
          session_id: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never;
