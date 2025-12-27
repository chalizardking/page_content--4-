"use client";

import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { formatDate, formatDuration } from "@/lib/utils";
import Link from "next/link";
import { Film, Clock, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function HistoryPage() {
  const { data, isLoading, refetch } = trpc.video.list.useQuery({ limit: 20 });
  const deleteMutation = trpc.video.delete.useMutation();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (videoId: string) => {
    if (!confirm("Are you sure you want to delete this video?")) return;

    setDeletingId(videoId);
    try {
      await deleteMutation.mutateAsync({ videoId });
      refetch();
    } catch (error) {
      console.error("Failed to delete video:", error);
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="size-8 text-[var(--primary)] animate-spin" />
      </div>
    );
  }

  const videos = data?.videos || [];

  return (
    <div className="flex-1 overflow-y-auto px-6 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Video History</h1>
            <p className="text-[var(--muted-foreground)] mt-1">
              Your generated educational videos
            </p>
          </div>
        </div>

        {videos.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="size-16 rounded-full bg-[var(--muted)] flex items-center justify-center mx-auto mb-4">
              <Film className="size-8 text-[var(--muted-foreground)]" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No videos yet</h3>
            <p className="text-[var(--muted-foreground)] mb-4">
              Create your first educational video to see it here.
            </p>
            <Link href="/app">
              <Button>Create Video</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video) => (
              <Card
                key={video.id}
                className="overflow-hidden group hover:border-[var(--primary)]/50 transition-colors"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-[var(--muted)]/50 flex items-center justify-center">
                  {video.thumbnailUrl ? (
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Film className="size-10 text-[var(--muted-foreground)]" />
                  )}

                  {/* Status badge */}
                  <div className="absolute top-2 right-2">
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded-md ${
                        video.status === "COMPLETED"
                          ? "bg-green-500/20 text-green-400"
                          : video.status === "FAILED"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {video.status.toLowerCase()}
                    </span>
                  </div>

                  {/* Duration */}
                  {video.duration && (
                    <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/70 rounded text-xs">
                      {formatDuration(video.duration)}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-medium truncate mb-1">{video.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
                    <Clock className="size-3" />
                    <span>{formatDate(video.createdAt)}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    {video.status === "COMPLETED" && (
                      <Link href={`/app/video/${video.id}`} className="flex-1">
                        <Button variant="secondary" size="sm" className="w-full">
                          Watch
                        </Button>
                      </Link>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(video.id)}
                      disabled={deletingId === video.id}
                    >
                      {deletingId === video.id ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Trash2 className="size-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
