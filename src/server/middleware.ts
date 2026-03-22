import cors from "cors";
import { config, type MiddlewareConfigFn } from "wasp/server";

export const serverMiddlewareFn: MiddlewareConfigFn = (middlewareConfig) => {
  middlewareConfig.set(
    "cors",
    cors({
      origin: [
        ...config.allowedCORSOrigins,
        "https://ibprophet-client.fly.dev",
      ],
      credentials: true,
    }),
  );
  return middlewareConfig;
};
