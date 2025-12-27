import { router } from "./trpc";
import { videoRouter } from "./routers/video.router";

export const appRouter = router({
  video: videoRouter,
});

export type AppRouter = typeof appRouter;
