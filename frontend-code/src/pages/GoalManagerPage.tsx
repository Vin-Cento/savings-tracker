import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaEdit, FaSort, FaTrash, FaSortDown, FaSortUp } from "react-icons/fa";
import { formatMoney, formatTimeLocale } from '../composables/format'

import PopUpMenu from "../components/PopUpMenu.tsx"
import { fetchGoals, deleteGoal } from "../stores/goalSlice.ts";
import type { RootState, AppDispatch } from "../stores/store.ts";
import type { GoalSchema } from "../client/types.gen.ts";

function GoalManagerPage() {
  const dispatch = useDispatch<AppDispatch>();

  const { goals, status, error } = useSelector(
    (state: RootState) => state.goals
  )

  const [sortConfig, setSortConfig] = useState<{
    attr: string; direction: 'asc' | 'desc' | 'na'
  } | null>(null);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchGoals());
  }, [dispatch]);

  const handleDeleteGoal = (id: number) => {
    dispatch(deleteGoal(id))
  };

  const handleEditGoal = (goal: GoalSchema) => {
    console.log(goal)
  }

  const sortedGoals = [...goals].sort((a, b) => {
    if (!sortConfig || sortConfig.direction === "na") return 0; // No sorting

    const attr = sortConfig.attr as keyof typeof a;

    const aValue = a[attr];
    const bValue = b[attr];

    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return 1;
    if (bValue == null) return -1;

    let comparison = 0;

    // Helper to check if value is a valid date string or Date object
    function isValidDate(value: any): boolean {
      const date = new Date(value);
      return !isNaN(date.getTime());
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      comparison = aValue - bValue;
    } else if (isValidDate(aValue) && isValidDate(bValue)) {
      const dateA = new Date(aValue);
      const dateB = new Date(bValue);
      comparison = dateA.getTime() - dateB.getTime();
    } else if (typeof aValue === "string" && typeof bValue === "string") {
      comparison = aValue.toLowerCase().localeCompare(bValue.toLowerCase());
    } else {
      comparison = String(aValue).localeCompare(String(bValue));
    }

    return sortConfig.direction === "asc" ? -comparison : comparison;
  });

  const handleSort = (attr: string) => {
    let direction: "asc" | "desc" | "na" = "asc";

    if (sortConfig?.attr === attr) {
      if (sortConfig.direction === "asc") direction = "desc";
      else if (sortConfig.direction === "desc") direction = "na";
      else direction = "asc";
    }

    setSortConfig({ attr, direction });
  };

  const SortIcon = ({ attr }: { attr: string }) => {
    if (sortConfig?.attr !== attr || sortConfig.direction === "na") {
      return <FaSort className="text-sm" />;
    }
    if (sortConfig.direction === "asc") {
      return <FaSortUp className="text-sm" />;
    }
    return <FaSortDown className="text-sm" />;
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
                <span>Name</span>
                <button onClick={() => handleSort("name")}>
                  <SortIcon attr="name" />
                </button>
              </div>
            </th>

            <th className="p-3">
              <div className="flex items-center gap-2">
                <span>Target</span>
                <button onClick={() => handleSort("target")}>
                  <SortIcon attr="target" />
                </button>
              </div>
            </th>

            <th className="p-3">
              <div className="flex items-center gap-2">
                <span>DeadLine</span>
                <button onClick={() => handleSort("deadline")}>
                  <SortIcon attr="deadline" />
                </button>
              </div>
            </th>
            {/* New header for actions */}
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {sortedGoals.map((goal) => (
            <tr key={goal.id} className="bg-amber-700 border-b border-amber-900">
              <td className="p-3">{goal.name}</td>
              <td className="p-3">{formatMoney(goal.target)}</td>
              <td className="p-3">{formatTimeLocale(goal.deadline)}</td>
              {/* New column for Edit and Delete buttons */}
              <td className="p-3 flex gap-2 justify-center items-center">
                <button
                  onClick={() => handleEditGoal(goal)}
                  title="Edit Goal"
                >
                  <FaEdit className='text-sm' />
                </button>
                <button
                  onClick={() => handleDeleteGoal(goal.id)}
                  title="Delete Goal"
                >
                  <FaTrash className='text-sm' />
                </button>
              </td>
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
      </div>

      <PopUpMenu open={open} setOpen={setOpen} />
    </>
  );
}

export default GoalManagerPage
