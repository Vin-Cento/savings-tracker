import type { DepositSchema, GoalSchema } from "../client/types.gen.ts";

export const emptyGoal: GoalSchema = {
  id: "f84f6b2d-e443-4206-bde2-e64357201a57", name: '', target: 0, active: true, deadline: null, createdAt: new Date().toISOString(), amount: 0,
};

export const emptyDeposit: DepositSchema = {
  id: -1, note: "", amount: 0, createdAt: new Date().toISOString(), goal_id: -1
};
