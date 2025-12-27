"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import {
  ArrowUp,
  Mic,
  Plus,
  MessageSquare,
  Video,
  StopCircle,
  Loader2,
  Film,
} from "lucide-react";

type Mode = "text" | "video";

interface VideoGeneratorProps {
  onVideoGenerated?: (videoId: string) => void;
}

export function VideoGenerator({ onVideoGenerated }: VideoGeneratorProps) {
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState<Mode>("video");
  const [language, setLanguage] = useState("en");
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  const generateMutation = trpc.video.generate.useMutation();
  const { data: videoStatus } = trpc.video.getStatus.useQuery(
    { videoId: activeVideoId! },
    {
      enabled: !!activeVideoId,
      refetchInterval: (query) => {
        const data = query.state.data;
        if (!data) return 2000;
        if (data.status === "COMPLETED" || data.status === "FAILED") {
          return false;
        }
        return 2000;
      },
    }
  );

  const isGenerating =
    generateMutation.isPending ||
    (activeVideoId &&
      videoStatus?.status !== "COMPLETED" &&
      videoStatus?.status !== "FAILED");

  const handleSubmit = async () => {
    if (!prompt.trim() || isGenerating) return;

    try {
      const result = await generateMutation.mutateAsync({
        prompt,
        language: language as "en" | "hi" | "es" | "fr",
      });

      setActiveVideoId(result.videoId);
      onVideoGenerated?.(result.videoId);
    } catch (error) {
      console.error("Failed to generate video:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const getProgress = () => {
    if (!videoStatus) return 0;
    switch (videoStatus.status) {
      case "PLANNED":
        return 10;
      case "PROCESSING":
        return 40;
      case "RENDERING":
        return 70;
      case "COMPLETED":
        return 100;
      case "FAILED":
        return 0;
      default:
        return 0;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Message area */}
      <div className="flex-1 overflow-y-auto px-4 pt-6">
        <div className="max-w-3xl mx-auto">
          {/* Show current prompt and status when generating */}
          {activeVideoId && videoStatus && (
            <div className="space-y-6">
              {/* User message */}
              <div className="flex justify-end mb-6">
                <div className="max-w-[80%] bg-[var(--muted)] py-2 px-5 rounded-xl">
                  <p>{prompt}</p>
                </div>
              </div>

              {/* AI Response */}
              <div className="space-y-3">
                <div className="prose prose-base dark:prose-invert max-w-none">
                  <p className="text-[var(--foreground)]">
                    {getStatusMessage(videoStatus.status)}
                  </p>
                </div>

                {/* Generation Progress Card */}
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="size-5 shrink-0">
                      {videoStatus.status === "COMPLETED" ? (
                        <Film className="size-5 text-[var(--primary)]" />
                      ) : videoStatus.status === "FAILED" ? (
                        <StopCircle className="size-5 text-[var(--destructive)]" />
                      ) : (
                        <Loader2 className="size-5 text-[var(--primary)] animate-spin" />
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">
                          {videoStatus.status === "COMPLETED"
                            ? "✓ Video Ready"
                            : videoStatus.status === "FAILED"
                            ? "✗ Generation Failed"
                            : `📋 Planning ${videoStatus.segments?.length || 0} segments`}
                        </h4>
                        {videoStatus.status !== "COMPLETED" &&
                          videoStatus.status !== "FAILED" && (
                            <button className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-[var(--destructive)] hover:bg-[var(--destructive)]/10 rounded-md transition-colors">
                              <StopCircle className="size-3.5" />
                              Stop
                            </button>
                          )}
                      </div>
                      <Progress value={getProgress()} />
                      <p className="text-xs text-[var(--muted-foreground)]">
                        {getProgress()}% complete
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Video Preview */}
                {videoStatus.status !== "FAILED" && (
                  <Card className="overflow-hidden">
                    <div className="relative w-full aspect-video bg-[var(--muted)]/50 flex items-center justify-center">
                      {videoStatus.status === "COMPLETED" &&
                      videoStatus.videoUrl ? (
                        <video
                          src={videoStatus.videoUrl}
                          controls
                          className="w-full h-full"
                          poster={videoStatus.thumbnailUrl || undefined}
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-3">
                          <div className="size-14 rounded-full bg-[var(--background)]/90 flex items-center justify-center shadow-lg border">
                            <Loader2 className="size-5 text-[var(--primary)] animate-spin" />
                          </div>
                          <p className="text-sm text-[var(--muted-foreground)]">
                            Generating video...
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="p-4 space-y-2">
                      <h3 className="text-sm font-semibold">
                        {videoStatus.title}
                      </h3>
                      <div className="flex gap-1.5 pt-1">
                        <span className="px-2 py-0.5 text-[11px] rounded-md bg-[var(--muted)] text-[var(--muted-foreground)] border">
                          AI Generated
                        </span>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          )}

          {/* Empty state */}
          {!activeVideoId && (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
              <div className="size-16 rounded-full bg-[var(--primary)]/10 flex items-center justify-center mb-4">
                <Video className="size-8 text-[var(--primary)]" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">
                Create Educational Videos
              </h2>
              <p className="text-[var(--muted-foreground)] max-w-md">
                Enter a topic or question and get an animated video explanation
                in seconds. Perfect for learning any subject!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Input area */}
      <div className="pb-5 px-4">
        <div className="w-full max-w-4xl mx-auto">
          <div className="w-full rounded-xl p-3 space-y-3 bg-[#181818] border border-[var(--prep-badge-border)] shadow-lg">
            <Textarea
              placeholder={
                isGenerating
                  ? "Wait for video generation to complete..."
                  : "What would you like to learn about?"
              }
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={!!isGenerating}
              className="min-h-10 max-h-[200px] resize-none bg-transparent border-none focus-visible:ring-0"
              rows={1}
            />

            <div className="flex w-full gap-3 items-end justify-between">
              <div className="flex flex-wrap gap-1.5 items-center flex-1">
                {/* Upload button */}
                <button
                  disabled
                  className="py-1.5 px-2.5 border border-[var(--prep-badge-border)] rounded-md flex items-center gap-1.5 text-xs opacity-60 cursor-not-allowed"
                >
                  <Plus className="size-3.5" />
                  <span>Upload</span>
                </button>

                {/* Mode toggle */}
                <div className="hidden sm:flex items-center border border-[var(--prep-badge-border)] rounded-md overflow-hidden">
                  <button
                    onClick={() => setMode("text")}
                    className={`py-1.5 px-2.5 text-xs flex items-center gap-1.5 transition-colors ${
                      mode === "text"
                        ? "bg-[var(--muted)] text-[var(--foreground)]"
                        : "hover:bg-[var(--muted)]/50 text-[var(--muted-foreground)]"
                    }`}
                  >
                    <MessageSquare className="size-3.5" />
                    <span>Text</span>
                  </button>
                  <button
                    onClick={() => setMode("video")}
                    className={`py-1.5 px-2.5 text-xs flex items-center gap-1.5 transition-colors ${
                      mode === "video"
                        ? "bg-[var(--muted)] text-[var(--foreground)]"
                        : "hover:bg-[var(--muted)]/50 text-[var(--muted-foreground)]"
                    }`}
                  >
                    <Video className="size-3.5" />
                    <span>Video</span>
                  </button>
                </div>

                {/* Language selector */}
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="py-1.5 px-2.5 border border-[var(--prep-badge-border)] rounded-md text-xs bg-transparent"
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled
                  className="p-2 rounded-full text-[var(--muted-foreground)] disabled:opacity-50"
                >
                  <Mic className="size-5" />
                </button>

                <Button
                  onClick={handleSubmit}
                  disabled={!prompt.trim() || !!isGenerating}
                  size="icon"
                  className="rounded-md"
                >
                  {isGenerating ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <ArrowUp className="size-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getStatusMessage(status: string): string {
  switch (status) {
    case "PLANNED":
      return "Planning your video segments...";
    case "PROCESSING":
      return "Analyzing content and generating scripts...";
    case "RENDERING":
      return "Rendering video animations...";
    case "COMPLETED":
      return "Your video is ready! Watch it below.";
    case "FAILED":
      return "Sorry, video generation failed. Please try again.";
    default:
      return "Processing...";
  }
}
