"use client"

import { useEffect, useState } from "react";
import { CommentQueries, RawComment } from "../../../types/query-results";
import { createSupabaseClient } from "../supabase/client";

type Props = {
  preset_id?: number; // Needed for preset page
  topComments?: boolean; // If true, fetch top comments
  selectClause?: string; // Select clause for supabase
}

export default function useComments<T extends CommentQueries[keyof CommentQueries]>({ topComments: isTopComments, preset_id, selectClause }: Props) {
  const [comments, setComments] = useState<T[] | T>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const supabase = createSupabaseClient();

  useEffect(() => {
    fetchComments();
  }, []);

  async function fetchComments() {
    if (!preset_id) return;

    setLoading(true);
    let query = supabase.from(isTopComments ? "top_comments" : "comments").select(selectClause ?? '*');

    if (preset_id)
      query = query.eq("preset_id", preset_id);
    // else if (profile_id) For future use
    //   query = query.eq("profile_id", profile_id);

    if (isTopComments)
      query = query.limit(3);

    const { data } = await query.returns<T[]>();
    setComments(data ?? []);

    setLoading(false);
  }

  async function submitComment(comment: RawComment, profile_id: number | null) {
    if (!profile_id) return {
      valid: false,
      message: "You must be logged in to comment",
    };

    await supabase.from("comments").insert(comment);
    fetchComments();

    return {
      valid: true,
      message: "Comment submitted",
    }
  }

  async function deleteComment(comment_id: number, profile_id: number | null) {
    if (!profile_id) return;
    await supabase.from("comments").delete().eq("id", comment_id);
    fetchComments();
  }

  async function likeComment(comment_id: number, profile_id: number | null) {
    if (!profile_id) return;
    await supabase.from("likes").insert({ comment_id, profile_id });
    fetchComments();
  }

  async function unlikeComment(comment_id: number, profile_id: number | null) {
    if (!profile_id) return;
    await supabase.from("likes").delete().eq("comment_id", comment_id).eq("profile_id", profile_id);
    fetchComments();
  }

  async function isLiked(comment_id: number, profile_id: number | null) {
    if (!profile_id) return false;
    const { data } = await supabase.from("likes").select("profile_id").eq("comment_id", comment_id);
    return data?.some(like => like.profile_id === profile_id) ?? false;
  }

  return { comments, submitComment, deleteComment, loading, likeComment, unlikeComment, isLiked };
}