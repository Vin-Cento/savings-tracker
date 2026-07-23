import type { DepositSchema, GoalSchema } from "../client/types.gen.ts";

export const emptyGoal: GoalSchema = {
  id: "", name: '', target: 0, active: true, deadline: null, createdAt: new Date().toISOString(), amount: 0, completed: false
};

export const emptyDeposit: DepositSchema = {
  id: "", note: "", amount: 0, createdAt: new Date().toISOString(), goal_id: ""
};
