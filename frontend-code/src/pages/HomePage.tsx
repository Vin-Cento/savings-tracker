import { Link } from "react-router-dom"
import { formatMoney } from "../composables/format";
import DepositBarChart from "../components/DepositBarChart";
import { useQuery } from "@tanstack/react-query";
import { countGoalOptions, fetchDepositsOptions, fetchGoalsOptions } from "../client/@tanstack/react-query.gen";
import { FaSort } from "react-icons/fa";
import { FaSliders } from "react-icons/fa6";
import { page, limit, gridPositions } from "./HomePage/constant"
import GoalPopUpMenu from "../components/GoalPopUpForm";
import type { GoalSchema } from "../client";
import { useState } from "react";
import { sortByConfig, type SortConfig } from "../composables/sortUtil";
import { sortingComparison } from "../composables/util";
import DropdownButton from "../components/DropdownButton";
import StatCard from "../components/StatCard";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../stores/store";
import { openAddDepositPopup, openAddGoalPopup } from "../stores/popupSlice";
import { setGoal } from "../stores/goalSlice";
import AddDepositPopUpForm from "../components/AddDepositPopUpForm";

function calculateProgressPercent(amount: number, target: number): number {
  if (target <= 0) return -1;
  return Math.min(Math.round((amount / target) * 100), 100);
}

function HomePage() {
  const dispatch = useDispatch<AppDispatch>();

  const getGridPositionClass = (index: number) => {
    const patternIndex = index % gridPositions.length;
    return gridPositions[patternIndex];
  };

  const goalsQuery = useQuery({ ...fetchGoalsOptions({ query: { page, limit }, }) });
  const goals = goalsQuery.data ? goalsQuery.data : { data: [], total: 0 }

  const activeCountQuery = useQuery({ ...countGoalOptions({ query: { active: true } }) })
  const activeCount = activeCountQuery.data

  const completeCountQuery = useQuery({ ...countGoalOptions({ query: { completed: true } }) })
  const completeCount = completeCountQuery.data

  const depositQuery = useQuery({ ...fetchDepositsOptions({ query: { limit: limit, page: page, } }) })
  const deposit = depositQuery.data?.data
  let totalDeposit = depositQuery.data?.sum ? depositQuery.data?.sum : 0

  const [sortConfig, _] = useState<SortConfig<GoalSchema>>(null);

  const filterOptions = [{ label: "Active Goals", onClick: () => { console.log('active goal') } },
  { label: "Completed Goals" },
  { label: "Due This Month" },
  { label: "Overdue" },
  { label: "Progress > 50%" },]

  const sortOptions = [{ label: "Active Goals", onClick: () => { console.log('active goal') } },
  { label: "Completed Goals" },
  { label: "Due This Month" },
  { label: "Overdue" },
  { label: "Progress > 50%" },]

  const handleEditGoal = (goal: GoalSchema) => {
    dispatch(setGoal({ goal: goal }))
    dispatch(openAddGoalPopup())
  }

  const depositGoal = (goal: GoalSchema) => {
    dispatch(setGoal({ goal: goal }))
    dispatch(openAddDepositPopup())
  }

  // how does this work?
  const sortedGoals = sortByConfig(
    goals.data,
    sortConfig,
    sortingComparison
  );
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
        <div className="flex gap-x-2 m-2">
          <Link to={"/goals/management"} className="w-full flex p-4 items-center bg-zinc-800 rounded-xl" >
            <div className="w-full">
              <h1 className="text-sm">Monthly Deposits</h1>
              <div className="m-2 flex">
                <div className="w-full h-50">
                  <DepositBarChart deposits={deposit ? deposit : []} />
                </div>
              </div>
            </div>
          </Link>
        </div>
        <div className="flex gap-x-2 m-2 mt-9">
          <h1 className="font-extrabold text-2xl">
            Your goals
          </h1>
          <div className="flex-1" />
          <div className="relative" >
            <DropdownButton
              label="Filters"
              icon={<FaSliders />}
              items={filterOptions}
            />
          </div>
          <div className="relative">
            <DropdownButton
              label="Filters"
              icon={<FaSort />}
              items={sortOptions}
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 w-full">
          {Array.isArray(goals?.data) && goals.data.length > 0 ? (
            sortedGoals.map((goal, index) => (
              <div
                key={goal.id}
                className={`${getGridPositionClass(index)} bg-zinc-700 flex font-bold border border-gray-700 p-2 rounded-2xl cursor-pointer`}
                onClick={() => depositGoal(goal)}
              >
                <div className="w-full p-3 flex flex-col h-full">
                  <h3 className="text-xl font-bold m-2">
                    {goal.name}
                  </h3>

                  {/* fills empty space */}
                  <div className="flex-1" />

                  {calculateProgressPercent(goal.amount, goal.target) !== -1 && (
                    <>
                      <h3 className="text-4xl m-2">
                        {`${calculateProgressPercent(goal.amount, goal.target)}%`}
                      </h3>
                      <div className="w-full m-2 bg-zinc-600 rounded-2xl">
                        <div
                          className="h-5 bg-amber-600 rounded-2xl"
                          style={{
                            width: `${calculateProgressPercent(goal.amount, goal.target)}%`,
                          }}
                        />
                      </div>
                    </>
                  )}

                  <div className="flex">
                    {calculateProgressPercent(goal.amount, goal.target) !== -1 ?
                      (<p className="m-2">
                        ${goal.amount.toLocaleString()} of ${goal.target.toLocaleString()}
                      </p>)
                      :
                      (<p className="m-2">
                        No Target
                      </p>)
                    }

                    <p className="m-2">
                      {goal.deadline
                        ? `Due ${new Date(goal.deadline).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}`
                        : "No deadline"}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 w-full text-center p-12">
              <h1 className="text-2xl">
                No goals available
              </h1>
            </div>
          )}
        </div>
      </main >
      <GoalPopUpMenu />
      <AddDepositPopUpForm />
    </>
  );
}

export default HomePage
