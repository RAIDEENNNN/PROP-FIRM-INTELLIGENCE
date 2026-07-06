import cors from "cors";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { env } from "./shared/env";
import { HttpError } from "./shared/http";
import { authRouter } from "./modules/auth/auth.routes";
import { usersRouter } from "./modules/users/users.routes";
import { traderProfileRouter } from "./modules/trader-profile/trader-profile.routes";
import { firmsRouter } from "./modules/firms/firms.routes";
import { compareRouter } from "./modules/compare/compare.routes";
import { spreadsRouter } from "./modules/spreads/spreads.routes";
import { newsRouter } from "./modules/news/news.routes";
import { alertsRouter } from "./modules/alerts/alerts.routes";
import { reviewsRouter } from "./modules/reviews/reviews.routes";
import { billingRouter } from "./modules/billing/billing.routes";
import { toolsRouter } from "./modules/tools/tools.routes";
import { adminRouter } from "./modules/admin/admin.routes";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(
  rateLimit({
    windowMs: 60_000,
    max: 180
  })
);

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "FundedScope API",
    version: "0.1.0",
    timestamp: new Date().toISOString()
  });
});

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/trader-profile", traderProfileRouter);
app.use("/api/firms", firmsRouter);
app.use("/api/compare", compareRouter);
app.use("/api/spreads", spreadsRouter);
app.use("/api/news", newsRouter);
app.use("/api/alerts", alertsRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/billing", billingRouter);
app.use("/api/tools", toolsRouter);
app.use("/api/admin", adminRouter);

app.use((_req, _res, next) => {
  next(new HttpError(404, "Route not found"));
});

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (error instanceof HttpError) {
    return res.status(error.statusCode).json({
      ok: false,
      error: error.message,
      details: error.details
    });
  }

  console.error(error);
  return res.status(500).json({
    ok: false,
    error: "Internal server error"
  });
});

app.listen(env.PORT, () => {
  console.log(`FundedScope API running on http://localhost:${env.PORT}`);
});
