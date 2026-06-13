import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaSort } from "react-icons/fa";

import PopUpMenu from "../components/PopUpMenu.tsx"
import { fetchGoals, deleteGoal } from "../stores/goalSlice.ts";
import type { RootState, AppDispatch } from "../stores/store.ts";

function GoalManagerPage() {
  const dispatch = useDispatch<AppDispatch>();

  const { goals, status, error } = useSelector(
    (state: RootState) => state.goals
  )

  const [sortConfig, setSortConfig] = useState<{
    attr: string; direction: 'asc' | 'desc'
  } | null>(null);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchGoals());
  }, [dispatch]);

  const handleDeleteGoal = () => {
    if (goals.length === 0) return;
    let goal = goals[goals.length - 1]
    dispatch(deleteGoal(goal.id))
  };

  const sortedGoals = [...goals].sort((a, b) => {
    if (!sortConfig) return 0;

    const attr = sortConfig.attr as keyof typeof a;

    const aValue = a[attr];
    const bValue = b[attr];

    if (aValue == null) return 1;
    if (bValue == null) return -1;

    let comparison = 0;

    if (typeof aValue === "string" && typeof bValue === "string") {
      comparison = aValue.toLowerCase().localeCompare(bValue.toLowerCase());
    } else if (typeof aValue === "number" && typeof bValue === "number") {
      comparison = aValue - bValue;
    } else {
      comparison = String(aValue).localeCompare(String(bValue));
    }

    return sortConfig.direction === "asc" ? comparison : -comparison;
  });

  const handleSort = (attr: string) => {
    let direction: "asc" | "desc" = "asc"

    if (sortConfig?.attr === attr && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ attr, direction })
  };

  if (status === "loading") return <div className="text-white m-2">Loading...</div>;
  if (error) return <div className="text-red-400 m-2">{error}</div>;
  return (
    <>
      <table className="w-4/5 border-collapse overflow-hidden rounded-xl text-white m-2">
        <thead>
          <tr className="bg-zinc-800 text-left">
            <th className="p-3">
              <div className="flex items-center gap-2">
                <span>Id</span>
                <button onClick={() => handleSort("id")}>
                  <FaSort className="text-sm" />
                </button>
              </div>
            </th>

            <th className="p-3">
              <div className="flex items-center gap-2">
                <span>Name</span>
                <button onClick={() => handleSort("name")}>
                  <FaSort className="text-sm" />
                </button>
              </div>
            </th>

            <th className="p-3">
              <div className="flex items-center gap-2">
                <span>Target</span>
                <button onClick={() => handleSort("target")}>
                  <FaSort className="text-sm" />
                </button>
              </div>
            </th>
          </tr>
        </thead>

        <tbody>
          {sortedGoals.map((goal) => (
            <tr key={goal.id} className="bg-amber-700 border-b border-amber-900">
              <td className="p-3">{goal.id}</td>
              <td className="p-3">{goal.name}</td>
              <td className="p-3">${goal.target}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex m-2 text-white">
        <button
          className="mr-2 p-2 rounded-xl bg-green-300 text-black"
          onClick={() => setOpen(true)}
        >
          Create Goal
        </button>

        <button
          className="p-2 rounded-xl bg-red-400"
          onClick={handleDeleteGoal}
        >
          Delete Goal
        </button>
      </div>

      <PopUpMenu open={open} setOpen={setOpen} />
    </>
  );
}

export default GoalManagerPage
