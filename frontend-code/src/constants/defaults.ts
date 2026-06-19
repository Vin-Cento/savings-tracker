import type { GoalSchema } from "../client/types.gen.ts";

export const emptyGoal: GoalSchema = {
  id: -1, name: '', target: 0, active: true, deadline: null, createdAt: new Date().toISOString()
};
