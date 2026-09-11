import { formatMoney } from "../composables/format";
import DepositStatCard from "../components/DepositStatCard";
import { useQuery } from "@tanstack/react-query";
import { countGoalOptions, fetchDepositsOptions, fetchGoalsOptions } from "../client/@tanstack/react-query.gen";
import { page, limit } from "./HomePage/constant"
import AddGoalPopUpMenu from "../components/AddGoalPopUpForm";
import type { GoalSchema } from "../client";
import { useState } from "react";
import StatCard from "../components/StatCard";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../stores/store";
import { openAddDepositPopup } from "../stores/popupSlice";
import { setGoal } from "../stores/goalSlice";
import AddDepositPopUpForm from "../components/AddDepositPopUpForm";
import DepositFilterBar from "../components/DepositFilterBar";
import GoalGrid from "../components/GoalGrid";

type SortByEnum =
  | "name"
  | "target"
  | "amount"
  | "deadline"
  | "createdAt";

type SortOrderEnum = "asc" | "desc";

function HomePage() {
  const dispatch = useDispatch<AppDispatch>();
  const [activeFilter, setActiveFilter] = useState<boolean | undefined>(undefined)
  const [completedFilter, setCompletedFilter] = useState<boolean | undefined>(undefined)
  const [sortBy, setSortBy] = useState<SortByEnum>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrderEnum>("desc");

  const goalsQuery = useQuery({
    ...fetchGoalsOptions({
      query: {
        page,
        limit,
        active: activeFilter,
        completed: completedFilter,
        sort_by: sortBy,
        sort_order: sortOrder,
      },
    }),
  });
  let goals = goalsQuery.data ? goalsQuery.data : { data: [], total: 0 }

  const activeCountQuery = useQuery({ ...countGoalOptions({ query: { active: true } }) })
  const activeCount = activeCountQuery.data

  const completeCountQuery = useQuery({ ...countGoalOptions({ query: { completed: true } }) })
  const completeCount = completeCountQuery.data

  const depositQuery = useQuery({ ...fetchDepositsOptions({ query: { limit: limit, page: page, } }) })
  const deposit = depositQuery.data?.data
  let totalDeposit = depositQuery.data?.sum ? depositQuery.data?.sum : 0

  const filterOptions = [
    {
      label: "All Goals", onClick: () => {
        setActiveFilter(undefined)
        setCompletedFilter(undefined)
      }
    },
    {
      label: "Active Goals", onClick: () => {
        setActiveFilter(true)
        setCompletedFilter(undefined)
      }
    },
    {
      label: "Completed Goals", onClick: () => {
        setCompletedFilter(true)
        setActiveFilter(undefined)
      }
    },
  ]

  const sortOptions = [
    {
      label: "Created At", onClick: () => {
        setSortBy('createdAt')
        setSortOrder('desc')
      }
    },
    {
      label: "Name Asc", onClick: () => {
        setSortBy('name')
        setSortOrder('asc')
      }
    },
    {
      label: "Name Desc", onClick: () => {
        setSortBy('name')
        setSortOrder('desc')
      }
    },
  ]

  const depositGoal = (goal: GoalSchema) => {
    dispatch(setGoal({ goal: goal }))
    dispatch(openAddDepositPopup())
  }

  return (
    <>
      <main className="overflow-auto min-w-6xl max-w-7xl ml-auto mr-auto">
        <div className="flex gap-x-2">
          <StatCard
            to="/goals/management"
            title="Total savings"
            value={formatMoney(totalDeposit)}
            className="w-2/4 bg-linear-to-r from-red-700 to-amber-700"
          />
          <StatCard
            title="Active goals"
            value={activeCount}
            className="w-1/4 items-center bg-zinc-800"
            valueClassName="text-orange-600"
          />
          <StatCard
            title="Goals completed"
            value={completeCount}
            className="w-1/4 items-center bg-zinc-800"
            valueClassName="text-green-400"
          />
        </div>
        <DepositStatCard deposits={deposit ?? []} />
        <DepositFilterBar filterOptions={filterOptions} sortOptions={sortOptions} />
        <GoalGrid goals={goals.data} depositGoal={depositGoal} />
      </main >
      <AddGoalPopUpMenu />
      <AddDepositPopUpForm />
    </>
  );
}

export default HomePage
