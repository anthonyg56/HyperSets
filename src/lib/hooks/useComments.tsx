"use client"

import { useEffect, useState } from "react";
import { CommentQueries, RawComment } from "../../../types/query-results";
import { createSupabaseClient } from "../supabase/client";

type Props = {
  preset_id?: number; // Needed for preset page
  comment_id?: number | null; // Needed for comment page
  profile_id?: number; // Needed for profile page
  topComments?: boolean; // If true, fetch top comments
  selectClause?: string; // Select clause for supabase
}

export default function useComments<T extends CommentQueries[keyof CommentQueries]>({ topComments: isTopComments, preset_id, comment_id, selectClause, profile_id }: Props) {
  const [comments, setComments] = useState<T[] | T>([]);
  const [topComments, setTopComments] = useState<T[] | T>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const supabase = createSupabaseClient();

  useEffect(() => {
    fetchComments();
    if (isTopComments) fetchTopComments();
  }, []);

  const fetchComments = async () => {
    if (!preset_id) return;
    setLoading(true);

    const { data } = await supabase
      .from("comments")
      .select(selectClause ?? '*')
      .eq("preset_id", preset_id)
      .order("created_at", { ascending: false })
      .returns<T[]>();

    setComments(data ?? []);
    setLoading(false);
  };

  async function fetchTopComments() {
    if (!preset_id) return;
    setLoading(true);

    const { data: comments } = await supabase
      .from('top_comments')
      .select(selectClause ?? '*')
      .eq('preset_id', preset_id)
      .limit(3)
      .returns<T[]>()

    
    setTopComments(comments ?? []);
    setLoading(false);
  };

  async function fetchComment() {
    if (!comment_id) return;
    
    const { data } = await supabase
      .from("comments")
      .select(selectClause ?? '*')
      .eq("comment_id", comment_id)
      .single<T>();

    return data;
  }

  async function insertComment(comment: RawComment) {
    if (!profile_id) return;
    await supabase.from("comments").insert(comment);
    fetchComments();
  }

  async function deleteComment(comment_id: number) {
    if (!profile_id) return;
    await supabase.from("comments").delete().eq("id", comment_id);
    fetchComments();
  }

  return { comments, fetchComments, insertComment, deleteComment, fetchComment, fetchTopComments, loading, topComments, setTopComments };
}