import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import db from "@/lib/db";
import { generateId, parseJSON } from "@/lib/utils";

// Video segment type
export interface VideoSegment {
  id: string;
  title: string;
  content: string;
  duration: number;
  visualType: "text" | "animation" | "diagram" | "image" | "mixed";
  script: string;
  keyPoints: string[];
}

const videoInputSchema = z.object({
  prompt: z.string().min(10).max(5000),
  images: z.array(z.string().url()).optional(),
  language: z.enum(["en", "hi", "es", "fr"]).default("en"),
  voiceId: z.string().optional(),
  assistantId: z.string().optional(),
  targetDuration: z.number().min(30).max(600).optional(),
  educationLevel: z
    .enum(["elementary", "middle", "high", "college", "adult"])
    .optional(),
});

export const videoRouter = router({
  // Generate new video
  generate: publicProcedure.input(videoInputSchema).mutation(async ({ input }) => {
    // For MVP, use a demo user
    const demoUserId = "demo-user";

    // Create video record
    const video = await db.video.create({
      data: {
        id: generateId(),
        userId: demoUserId,
        title: input.prompt.slice(0, 100),
        prompt: input.prompt,
        language: input.language,
        status: "PLANNED",
        segments: JSON.stringify([]),
      },
    });

    // Start mock generation process (in real app, this would be async/queue)
    // For MVP, we'll simulate the generation process
    simulateVideoGeneration(video.id, input);

    return { videoId: video.id };
  }),

  // Get video status
  getStatus: publicProcedure
    .input(z.object({ videoId: z.string() }))
    .query(async ({ input }) => {
      const video = await db.video.findUnique({
        where: { id: input.videoId },
      });

      if (!video) {
        return null;
      }

      return {
        ...video,
        segments: parseJSON<VideoSegment[]>(video.segments, []),
        script: parseJSON(video.script, null),
        generationLog: parseJSON(video.generationLog, null),
      };
    }),

  // List user videos
  list: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const demoUserId = "demo-user";

      const videos = await db.video.findMany({
        where: { userId: demoUserId },
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: { createdAt: "desc" },
      });

      let nextCursor: string | undefined;
      if (videos.length > input.limit) {
        const nextItem = videos.pop();
        nextCursor = nextItem!.id;
      }

      return {
        videos: videos.map((v) => ({
          ...v,
          segments: parseJSON<VideoSegment[]>(v.segments, []),
        })),
        nextCursor,
      };
    }),

  // Delete video
  delete: publicProcedure
    .input(z.object({ videoId: z.string() }))
    .mutation(async ({ input }) => {
      await db.video.delete({
        where: { id: input.videoId },
      });

      return { success: true };
    }),
});

// Simulate video generation for MVP
async function simulateVideoGeneration(
  videoId: string,
  input: z.infer<typeof videoInputSchema>
) {
  try {
    // Step 1: Planning phase
    await db.video.update({
      where: { id: videoId },
      data: { status: "PROCESSING" },
    });

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate mock segments based on prompt
    const segments: VideoSegment[] = generateMockSegments(input.prompt);

    // Step 2: Update with segments
    await db.video.update({
      where: { id: videoId },
      data: {
        status: "RENDERING",
        segments: JSON.stringify(segments),
        script: JSON.stringify({
          fullScript: segments.map((s) => s.script).join("\n\n"),
          timing: segments.map((s) => ({ id: s.id, duration: s.duration })),
        }),
      },
    });

    // Simulate rendering delay
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Step 3: Complete
    const totalDuration = segments.reduce((acc, s) => acc + s.duration, 0);

    await db.video.update({
      where: { id: videoId },
      data: {
        status: "COMPLETED",
        duration: totalDuration,
        completedAt: new Date(),
        // Mock video URL - in real app this would be R2/CDN URL
        videoUrl: `/api/mock-video/${videoId}`,
        thumbnailUrl: `/api/mock-thumbnail/${videoId}`,
      },
    });
  } catch (error) {
    console.error("Video generation failed:", error);
    await db.video.update({
      where: { id: videoId },
      data: {
        status: "FAILED",
        generationLog: JSON.stringify({
          error: error instanceof Error ? error.message : "Unknown error",
        }),
      },
    });
  }
}

function generateMockSegments(prompt: string): VideoSegment[] {
  // Generate educational segments based on the prompt
  const topicWords = prompt.split(" ").slice(0, 5).join(" ");

  return [
    {
      id: generateId(),
      title: "Introduction",
      content: `Welcome! Today we'll explore ${topicWords}. Let's begin with the basics.`,
      duration: 15,
      visualType: "text",
      script: `Welcome to this educational video! Today we're going to learn about ${topicWords}. This is an important topic that will help you understand key concepts.`,
      keyPoints: ["Topic introduction", "What you'll learn"],
    },
    {
      id: generateId(),
      title: "Core Concepts",
      content: `The fundamental ideas behind this topic involve understanding key principles.`,
      duration: 30,
      visualType: "diagram",
      script: `Now let's dive into the core concepts. Understanding these fundamentals will give you a solid foundation.`,
      keyPoints: [
        "Key concept 1",
        "Key concept 2",
        "How they connect",
      ],
    },
    {
      id: generateId(),
      title: "Examples",
      content: `Let's look at some practical examples to illustrate these concepts.`,
      duration: 25,
      visualType: "animation",
      script: `Examples help us understand abstract concepts better. Watch as we demonstrate with real-world scenarios.`,
      keyPoints: ["Example 1", "Example 2", "Practical applications"],
    },
    {
      id: generateId(),
      title: "Practice Problem",
      content: `Try solving this problem using what you've learned.`,
      duration: 20,
      visualType: "mixed",
      script: `Now it's your turn! Let's work through a practice problem together to reinforce what we've learned.`,
      keyPoints: ["Problem setup", "Step-by-step solution"],
    },
    {
      id: generateId(),
      title: "Summary",
      content: `Let's recap the key takeaways from this lesson.`,
      duration: 15,
      visualType: "text",
      script: `Great job! Let's summarize what we've covered today and highlight the most important points to remember.`,
      keyPoints: ["Main takeaway 1", "Main takeaway 2", "Next steps"],
    },
  ];
}
