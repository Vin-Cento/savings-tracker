import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatMoney, formatTimeLocale } from '../composables/format'
import { fetchGoals, deleteGoal } from "../stores/goalSlice";
import { sortingComparison } from "../composables/util";
import { emptyGoal } from "../constants/defaults";

import { FaEdit, FaSort, FaTrash, FaSortDown, FaSortUp, FaArrowLeft, FaArrowRight, FaPiggyBank, FaSearch } from "react-icons/fa";
import PopUpMenu from "../components/PopUpMenu"
import DepositPopUpMenu from "../components/DepositPopUpMenu"

import type { RootState, AppDispatch } from "../stores/store";
import type { GoalSchema } from "../client/types.gen";
import { Link } from "react-router-dom";

function GoalManagerPage() {
  const dispatch = useDispatch<AppDispatch>();


  const { goals } = useSelector(
    (state: RootState) => state.goals
  )
  const [goalSelected, setGoalSelected] = useState<GoalSchema>(emptyGoal);
  const [page, setPage] = useState(1);

  let PAGE_SIZE = 15;
  const totalPages = Math.ceil(goals.total / PAGE_SIZE);
  const emptyRows = Math.max(0, PAGE_SIZE - goals.data.length);

  const [sortConfig, setSortConfig] = useState<{
    attr: string; direction: 'asc' | 'desc' | null;
  } | null>(null);

  const [open, setOpen] = useState(false);
  const [openDeposit, setOpenDeposit] = useState(false);

  useEffect(() => {
    dispatch(fetchGoals({ page: page, limit: PAGE_SIZE }));
  }, [dispatch, page]);

  const handleDeleteGoal = (id: number) => {
    dispatch(deleteGoal(id))
  };

  const handleEditGoal = (goal: GoalSchema) => {
    setOpen(true);
    setGoalSelected(goal);
  }

  const handleDeposit = (goal: GoalSchema) => {
    setOpenDeposit(true);
    setGoalSelected(goal);
  }

  const handleSort = (attr: string) => {
    let direction: "asc" | "desc" | null = "asc";

    if (sortConfig?.attr === attr) {
      if (sortConfig.direction === "asc") direction = "desc";
      else if (sortConfig.direction === "desc") direction = null;
      else direction = "asc";
    }

    setSortConfig({ attr, direction });
  };

  const sortedGoals = [...goals.data].sort((a, b) => {
    if (!sortConfig || sortConfig.direction === null) return 0; // No sorting

    const attr = sortConfig.attr as keyof typeof a;

    const aValue = a[attr];
    const bValue = b[attr];

    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return 1;
    if (bValue == null) return -1;

    let comparison = sortingComparison(aValue, bValue)

    return sortConfig.direction === "asc" ? -comparison : comparison;
  });


  const SortIcon = ({ attr }: { attr: string }) => {
    if (sortConfig?.attr !== attr || sortConfig.direction === null) {
      return <FaSort className="text-sm" />;
    }
    if (sortConfig.direction === "asc") {
      return <FaSortUp className="text-sm" />;
    }
    return <FaSortDown className="text-sm" />;
  };

  const getVisiblePages = () => {
    const pages = new Set<number>();
    for (let i = page - 1; i <= page + 9; i++) {
      if (i >= 1 && i <= totalPages) {
        pages.add(i);
      }
    }
    return Array.from(pages).sort((a, b) => a - b);
  };

  const visiblePages = getVisiblePages();

  return (
    <>
      <main className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-30 h-14 bg-zinc-950 flex items-center">
          <div className="flex text-black w-3/5 m-auto">
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
              className="p-1 rounded-xl bg-green-500 font-bold"
              onClick={() => {
                setOpen(true);
                setGoalSelected(emptyGoal);
              }}
            >
              Create Goal
            </button>
          </div>
        </div>

        <table className="w-3/5 rounded-xl m-auto">
          <thead >
            <tr className="text-left h-12">

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
                <td className="p-3">
                  <Link
                    to={`/goals/${goal.id}`}
                    className="hover:text-blue-400 font-bold"
                  >
                    {goal.name}
                  </Link>
                </td>
                <td className="p-3">{formatMoney(goal.target)}</td>
                <td className="p-3">
                  {goal.deadline ? formatTimeLocale(goal.deadline) : ""}
                </td>

                {/* Actions */}
                <td className="items-center gap-2">
                  <button
                    onClick={() => handleDeposit(goal)}
                    title="Deposit"
                    className="p-1"
                  >
                    <FaPiggyBank className='text-sm' />
                  </button>
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
              <td colSpan={4} className='sticky bottom-0 z-10 bg-zinc-800 p-3'>
                <span className="flex items-center justify-center">
                  {page !== 1 && <button className="m-1" onClick={() => { setPage(page - 1) }}><FaArrowLeft className="text-sm" /></button>}
                  {visiblePages.map((pageNumber) => {
                    const shouldShowDots = (pageNumber === visiblePages[visiblePages.length - 1]) && ((pageNumber * PAGE_SIZE) < goals.total);

                    return (
                      <React.Fragment key={pageNumber}>
                        <button
                          onClick={() => setPage(pageNumber)}
                          className={`m-1 text-sm ${page === pageNumber
                            ? "font-bold no-underline text-green-300"
                            : "underline"
                            }`}
                        >
                          {pageNumber}
                        </button>
                        {shouldShowDots && <span className="mx-1">...</span>}
                      </React.Fragment>
                    );
                  })}
                  {page * PAGE_SIZE < goals.total && <button className="m-1" onClick={() => { setPage(page + 1) }}><FaArrowRight className="text-sm" /></button>}
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </main>

      <PopUpMenu open={open} setOpen={setOpen} goal={goalSelected} />
      <DepositPopUpMenu open={openDeposit} setOpen={setOpenDeposit} goal={goalSelected} />
    </>
  );
}

export default GoalManagerPage
