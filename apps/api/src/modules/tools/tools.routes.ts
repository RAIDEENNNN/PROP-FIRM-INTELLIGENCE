import { Router } from "express";
import { asyncHandler, sendOk } from "../../shared/http";

export const toolsRouter = Router();

toolsRouter.post(
  "/lot-size",
  asyncHandler(async (req, res) => {
    const { balance = 0, riskPercent = 1, stopLossPips = 10, pipValue = 10 } = req.body ?? {};
    const riskAmount = Number(balance) * (Number(riskPercent) / 100);
    const lots = riskAmount / (Number(stopLossPips) * Number(pipValue));
    return sendOk(res, { riskAmount, lots: Number.isFinite(lots) ? Number(lots.toFixed(2)) : 0 });
  })
);

toolsRouter.post(
  "/drawdown",
  asyncHandler(async (req, res) => {
    const { startingBalance = 0, currentBalance = 0, limitPercent = 10 } = req.body ?? {};
    const loss = Number(startingBalance) - Number(currentBalance);
    const limitAmount = Number(startingBalance) * (Number(limitPercent) / 100);
    return sendOk(res, {
      loss,
      limitAmount,
      remainingBuffer: limitAmount - loss,
      usedPercent: limitAmount > 0 ? Number(((loss / limitAmount) * 100).toFixed(1)) : 0
    });
  })
);

toolsRouter.post(
  "/profit-target",
  asyncHandler(async (req, res) => {
    const { accountSize = 0, targetPercent = 8, currentProfit = 0 } = req.body ?? {};
    const targetAmount = Number(accountSize) * (Number(targetPercent) / 100);
    return sendOk(res, {
      targetAmount,
      remaining: targetAmount - Number(currentProfit),
      progressPercent: targetAmount > 0 ? Number(((Number(currentProfit) / targetAmount) * 100).toFixed(1)) : 0
    });
  })
);
