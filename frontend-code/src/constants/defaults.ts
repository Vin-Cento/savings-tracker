import type { GoalSchema } from "../client/types.gen.ts";

export const emptyGoal: GoalSchema = {
  id: -1, name: '', target: 0, active: true, deadline: new Date(
    new Date().setMonth(new Date().getMonth() + 1)
  ).toISOString(), createdAt: new Date().toISOString()
};
