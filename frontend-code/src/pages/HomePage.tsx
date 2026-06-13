import MyBarChart from "../components/MyBarChart"
import { listGoalsGet } from "../client/sdk.gen";
import { useEffect, useState } from "react";

function HomePage() {
  const [goals, setGoal] = useState<any[]>([]);

  useEffect(() => {
    async function loadJobs() {
      const { data, error } = await listGoalsGet();

      if (error) {
        console.error(error);
        return;
      }

      setGoal(data ?? []);
    }

    loadJobs();
  }, []);
  return (
    <>
      <div className="m-2 flex text-white">
        <div className="w-100 h-100">
          <MyBarChart />
        </div>
        <pre>{JSON.stringify(goals, null, 2)}</pre>
        <ul className="">
          {goals.map((goal) => (
            <li key={goal.id}>
              {goal.name ?? goal.title ?? JSON.stringify(goal)}
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default HomePage
