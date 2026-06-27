import type { DepositSchema, GoalSchema } from "../client/types.gen.ts";

export const emptyGoal: GoalSchema = {
  id: -1, name: '', target: 0, active: true, deadline: null, createdAt: new Date().toISOString()
};

export const emptyDeposit: DepositSchema = {
  id: -1, note: "", amount: 0, createdAt: new Date().toISOString(), goal_id: -1
};
