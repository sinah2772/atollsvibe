export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      news_articles: {
        Row: {
          id: string
          title: string
          heading: string
          social_heading: string | null
          content: Json
          category_id: number
          atoll_ids: number[]
          cover_image: string | null
          image_caption: string | null
          status: string
          publish_date: string | null
          views: number
          likes: number
          comments: number
          user_id: string
          created_at: string
          updated_at: string
          news_type: string | null
          news_priority: number | null
          news_source: string | null
          is_featured: boolean | null
          is_breaking: boolean | null
          is_developing: boolean | null
          is_exclusive: boolean | null
          is_sponsored: boolean | null
          sponsored_by: string | null
          sponsored_url: string | null
          meta_title: string | null
          meta_description: string | null
          meta_keywords: string[] | null
          related_articles: string[] | null
          tags: string[] | null
          author_notes: string | null
          editor_notes: string | null
          fact_checked: boolean | null
          fact_checker_id: string | null
          fact_checked_at: string | null
          approved_by_id: string | null
          approved_at: string | null
          published_by_id: string | null
          last_updated_by_id: string | null
          original_source_url: string | null
          translation_source_url: string | null
          translation_source_lang: string | null
          translation_notes: string | null
          revision_history: Json | null
          scheduled_notifications: Json | null
          notification_sent: boolean | null
          notification_sent_at: string | null
        }
        Insert: {
          id?: string
          title: string
          heading: string
          social_heading?: string | null
          content?: Json
          category_id: number
          atoll_ids?: number[]
          cover_image?: string | null
          image_caption?: string | null
          status?: string
          publish_date?: string | null
          views?: number
          likes?: number
          comments?: number
          user_id: string
          created_at?: string
          updated_at?: string
          news_type?: string | null
          news_priority?: number | null
          news_source?: string | null
          is_featured?: boolean | null
          is_breaking?: boolean | null
          is_developing?: boolean | null
          is_exclusive?: boolean | null
          is_sponsored?: boolean | null
          sponsored_by?: string | null
          sponsored_url?: string | null
          meta_title?: string | null
          meta_description?: string | null
          meta_keywords?: string[] | null
          related_articles?: string[] | null
          tags?: string[] | null
          author_notes?: string | null
          editor_notes?: string | null
          fact_checked?: boolean | null
          fact_checker_id?: string | null
          fact_checked_at?: string | null
          approved_by_id?: string | null
          approved_at?: string | null
          published_by_id?: string | null
          last_updated_by_id?: string | null
          original_source_url?: string | null
          translation_source_url?: string | null
          translation_source_lang?: string | null
          translation_notes?: string | null
          revision_history?: Json | null
          scheduled_notifications?: Json | null
          notification_sent?: boolean | null
          notification_sent_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          heading?: string
          social_heading?: string | null
          content?: Json
          category_id?: number
          atoll_ids?: number[]
          cover_image?: string | null
          image_caption?: string | null
          status?: string
          publish_date?: string | null
          views?: number
          likes?: number
          comments?: number
          user_id?: string
          created_at?: string
          updated_at?: string
          news_type?: string | null
          news_priority?: number | null
          news_source?: string | null
          is_featured?: boolean | null
          is_breaking?: boolean | null
          is_developing?: boolean | null
          is_exclusive?: boolean | null
          is_sponsored?: boolean | null
          sponsored_by?: string | null
          sponsored_url?: string | null
          meta_title?: string | null
          meta_description?: string | null
          meta_keywords?: string[] | null
          related_articles?: string[] | null
          tags?: string[] | null
          author_notes?: string | null
          editor_notes?: string | null
          fact_checked?: boolean | null
          fact_checker_id?: string | null
          fact_checked_at?: string | null
          approved_by_id?: string | null
          approved_at?: string | null
          published_by_id?: string | null
          last_updated_by_id?: string | null
          original_source_url?: string | null
          translation_source_url?: string | null
          translation_source_lang?: string | null
          translation_notes?: string | null
          revision_history?: Json | null
          scheduled_notifications?: Json | null
          notification_sent?: boolean | null
          notification_sent_at?: string | null
        }
      }
      categories: {
        Row: {
          id: number
          name: string
          name_en: string
          slug: string
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          name_en: string
          slug: string
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          name_en?: string
          slug?: string
          created_at?: string
        }
      }
      atolls: {
        Row: {
          id: number
          name: string
          name_en: string
          slug: string
          created_at: string
          island_reference: string | null
          island_reference_dv: string | null
          island_category: string | null
          island_category_en: string | null
        }
        Insert: {
          id?: number
          name: string
          name_en: string
          slug: string
          created_at?: string
          island_reference?: string | null
          island_reference_dv?: string | null
          island_category?: string | null
          island_category_en?: string | null
        }
        Update: {
          id?: number
          name?: string
          name_en?: string
          slug?: string
          created_at?: string
          island_reference?: string | null
          island_reference_dv?: string | null
          island_category?: string | null
          island_category_en?: string | null
        }
      }
    }
  }
}