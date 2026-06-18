import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaEdit, FaSort, FaTrash, FaSortDown, FaSortUp, FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import { formatMoney, formatTimeLocale } from '../composables/format'

import PopUpMenu from "../components/PopUpMenu.tsx"
import { fetchGoals, deleteGoal } from "../stores/goalSlice.ts";
import type { RootState, AppDispatch } from "../stores/store.ts";
import type { GoalSchema } from "../client/types.gen.ts";

function GoalManagerPage() {
  const dispatch = useDispatch<AppDispatch>();


  const { goals } = useSelector(
    (state: RootState) => state.goals
  )
  const emptyGoal: GoalSchema = { id: -1, name: '', target: 0, deadline: "" };
  const [goalSelected, setGoalSelected] = useState<GoalSchema>(emptyGoal);

  const PAGE_SIZE = 20;
  const emptyRows = Math.max(0, PAGE_SIZE - goals.length);

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

  return (
    <>
      <main className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-30 h-14 bg-zinc-950 flex items-center">
          <div className="flex text-black w-4/5 m-auto">
            <div className="flex w-4/5">
              <input
                type="text"
                className="text-black rounded-l-xl bg-amber-50 w-full focus:outline-none pl-4"
              />

              <button className="bg-amber-50 hover:text-black rounded-r-lg p-2">
                <FaSearch />
              </button>
            </div>

            <div className="flex-1" />

            <button
              className="p-1 rounded-xl bg-green-300 text-gray-700 font-bold"
              onClick={() => {
                setOpen(true);
                setGoalSelected(emptyGoal);
              }}
            >
              Create Goal
            </button>
          </div>
        </div>

        <table className="w-4/5 rounded-xl text-white m-auto">
          <thead >
            <tr className="bg-zinc-800 text-left h-12">

              <th className="p-3 bg-zinc-800 sticky top-14 z-10">
                <div className="flex items-center gap-2">
                  <span>Name</span>
                  <button onClick={() => handleSort("name")}>
                    <SortIcon attr="name" />
                  </button>
                </div>
              </th>

              <th className="p-3 bg-zinc-800 sticky top-14 z-10">
                <div className="flex items-center gap-2">
                  <span>Target</span>
                  <button onClick={() => handleSort("target")}>
                    <SortIcon attr="target" />
                  </button>
                </div>
              </th>

              <th className="p-3 bg-zinc-800 sticky top-14 z-10">
                <div className="flex items-center gap-2">
                  <span>DeadLine</span>
                  <button onClick={() => handleSort("deadline")}>
                    <SortIcon attr="deadline" />
                  </button>
                </div>
              </th>
              {/* New header for actions */}
              <th className="p-3 bg-zinc-800 sticky top-14 z-10">Actions</th>
            </tr>
          </thead>

          <tbody>
            {sortedGoals.map((goal) => (
              <tr key={goal.id} className="bg-amber-700 border-b border-amber-900">
                <td className="p-3">{goal.name}</td>
                <td className="p-3">{formatMoney(goal.target)}</td>
                <td className="p-3">{formatTimeLocale(goal.deadline)}</td>

                {/* Actions */}
                <td className="items-center gap-2">
                  <button
                    onClick={() => handleEditGoal(goal)}
                    title="Edit Goal"
                    className="p-1"
                  >
                    <FaEdit className='text-sm' />
                  </button>
                  <button
                    onClick={() => handleDeleteGoal(goal.id)}
                    title="Delete Goal"
                    className="p-1"
                  >
                    <FaTrash className='text-sm' />
                  </button>
                </td>
              </tr>
            ))}

            {Array.from({ length: emptyRows }).map((_, index) => (
              <tr key={`empty-${index}`} className="bg-amber-700 border-b border-amber-900 h-14">
                <td className="p-3 bg-orange-300">&nbsp;</td>
                <td className="p-3 bg-orange-300">&nbsp;</td>
                <td className="p-3 bg-orange-300">&nbsp;</td>
                <td className="p-3 bg-orange-300">&nbsp;</td>
              </tr>
            ))}
          </tbody>
          <tfoot >
            <tr className="h-12">
              <td colSpan={4} className='sticky bottom-0 z-10 bg-zinc-800 p-3 text-white'>
                <span className="flex items-center justify-center">
                  <button className="m-1"><FaArrowLeft className="text-sm" /></button>
                  <button className="m-1 underline text-sm">1</button>
                  <button className="m-1 underline text-sm">2</button>
                  <button className="m-1 underline text-sm">3</button>
                  <button className="m-1 underline text-sm">4</button>
                  <button className="m-1 underline text-sm">5</button>
                  <button className="m-1 underline text-sm">6</button>
                  <button className="m-1"><FaArrowRight className="text-sm" /></button>
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </main>

      <PopUpMenu open={open} setOpen={setOpen} goal={goalSelected} />
    </>
  );
}

export default GoalManagerPage
