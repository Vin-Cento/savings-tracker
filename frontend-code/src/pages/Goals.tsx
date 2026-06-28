import MyBarChart from "../components/MyBarChart"
import { getGoalsIdGet } from "../client/sdk.gen";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { GoalSchema } from "../client";

function GoalPage() {
  const { id } = useParams();

  const [goal, setGoal] = useState<GoalSchema | null>(null);

  useEffect(() => {
    async function loadGoal() {
      if (!id) return;

      const goalId = Number(id);

      if (Number.isNaN(goalId)) {
        console.error("Invalid goal id:", id);
        return;
      }

      const { data, error } = await getGoalsIdGet({
        path: { id: goalId },
      });

      if (error) {
        console.error(error);
        return;
      }

      setGoal(data ?? null);
    }

    loadGoal();
  }, [id]);

  return (
    <div className="m-2 flex">
      <div className="w-100 h-100">
        <MyBarChart />
      </div>

      <pre>{JSON.stringify(goal, null, 2)}</pre>
    </div>
  );
}

export default GoalPage
