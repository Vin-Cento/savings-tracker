import React, { useState } from "react";
import { formatMoney, formatTimeLocale } from '../composables/format'
import { sortingComparison } from "../composables/util";
import { FaEdit, FaSort, FaTrash, FaSortDown, FaSortUp, FaArrowLeft, FaArrowRight, FaPiggyBank, FaSearch } from "react-icons/fa";
import GoalPopUpForm from "../components/GoalPopUpForm"
import AddDepositPopUpForm from "../components/AddDepositPopUpForm"
import type { GoalSchema } from "../client/types.gen";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchGoalsOptions,
  deleteGoalMutation,
} from "../client/@tanstack/react-query.gen";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../stores/store";
import { openAddDepositPopup, openAddGoalPopup } from "../stores/popupSlice";
import { setGoal } from "../stores/goalSlice";
import {
  getNextSortConfig,
  sortByConfig,
  type SortConfig,
} from "../composables/sortUtil";

function GoalManagerPage() {
  const dispatch = useDispatch<AppDispatch>();
  let PAGE_SIZE = 10;

  const queryClient = useQueryClient();

  const deleteGoal = useMutation({
    ...deleteGoalMutation(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: fetchGoalsOptions({
          query: {
            page,
            limit: PAGE_SIZE,
          },
        }).queryKey,
      });
    },
  });


  const [page, setPage] = useState(1);

  const goalsQuery = useQuery({ ...fetchGoalsOptions({ query: { page: page, limit: PAGE_SIZE } }) })
  const goals = goalsQuery.data ? goalsQuery.data : { data: [], total: 0 }

  const totalPages = Math.ceil(goals.total / PAGE_SIZE);
  const emptyRows = Math.max(0, PAGE_SIZE - goals.data.length);

  const [sortConfig, setSortConfig] = useState<SortConfig<GoalSchema>>(null);

  const handleDeleteGoal = (id: string) => {
    deleteGoal.mutate({ path: { id, }, });
  };

  const handleEditGoal = (goal: GoalSchema) => {
    dispatch(setGoal({ goal: goal }))
    dispatch(openAddGoalPopup())
  }

  const handleDeposit = (goal: GoalSchema) => {
    dispatch(setGoal({ goal: goal }))
    dispatch(openAddDepositPopup())
  }

  const handleSort = (attr: keyof GoalSchema) => {
    setSortConfig((currentSortConfig) =>
      getNextSortConfig(currentSortConfig, attr)
    );
  };

  const sortedGoals = sortByConfig(
    goals.data,
    sortConfig,
    sortingComparison
  );


  const SortIcon = ({ attr }: { attr: keyof GoalSchema }) => {
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
            <div className="flex w-full">
              <input
                type="text"
                className="text-black rounded-l-xl bg-amber-50 w-full focus:outline-none pl-4"
              />
              <button className="bg-amber-50 hover:text-black rounded-r-xl p-2">
                <FaSearch />
              </button>
            </div>
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
                  <span>Deposit</span>
                  <button onClick={() => handleSort("amount")}>
                    <SortIcon attr="amount" />
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
                <td className="p-3">{formatMoney(goal.amount)}</td>
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
                <td className="p-3 bg-orange-300">&nbsp;</td>
              </tr>
            ))}
          </tbody>
          <tfoot >
            <tr className="h-12">
              <td colSpan={5} className='sticky bottom-0 z-10 bg-zinc-800 p-3'>
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

      <GoalPopUpForm />
      <AddDepositPopUpForm />
    </>
  );
}

export default GoalManagerPage
