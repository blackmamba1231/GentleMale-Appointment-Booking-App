import type { CorsOptions } from "cors";

export const corsOptions: CorsOptions = {
  origin: [/^http:\/\/localhost:\d+$/, /\.gentlemale\.com$/],
  credentials: true
};
