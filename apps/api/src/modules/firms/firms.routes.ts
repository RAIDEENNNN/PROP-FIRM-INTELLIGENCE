import { Router } from "express";
import { asyncHandler, notImplemented, sendOk } from "../../shared/http";

export const firmsRouter = Router();

firmsRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    return sendOk(res, notImplemented("Search, filter and paginate prop firms"));
  })
);

firmsRouter.get(
  "/:slug",
  asyncHandler(async (req, res) => {
    return sendOk(res, { slug: req.params.slug, ...notImplemented("Return SEO-ready firm profile") });
  })
);

firmsRouter.get(
  "/:slug/rules/history",
  asyncHandler(async (req, res) => {
    return sendOk(res, { slug: req.params.slug, ...notImplemented("Return historical rule changes") });
  })
);
