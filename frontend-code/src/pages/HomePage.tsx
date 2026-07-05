import { Link } from "react-router-dom"
import { formatMoney } from "../composables/format";
import DepositBarChart from "../components/DepositBarChart";
import { useQuery } from "@tanstack/react-query";
import { countGoalOptions, fetchDepositsOptions, fetchGoalsOptions } from "../client/@tanstack/react-query.gen";
import { FaSort } from "react-icons/fa";
import { FaSliders } from "react-icons/fa6";
import { page, limit, gridPositions } from "./HomePage/constant"

function calculateProgressPercent(amount: number, target: number): number {
  if (target <= 0) return 100;
  return Math.min(Math.round((amount / target) * 100), 100);
}

function HomePage() {
  const getGridPositionClass = (index: number) => {
    const patternIndex = index % gridPositions.length;
    return gridPositions[patternIndex];
  };

  const goalsQuery = useQuery({ ...fetchGoalsOptions({ query: { page, limit }, }) });
  const goals = goalsQuery.data

  const activeCountQuery = useQuery({ ...countGoalOptions({ query: { 'active': true } }) })
  const activeCount = activeCountQuery.data

  const completeCountQuery = useQuery({ ...countGoalOptions({ query: { 'active': false } }) })
  const completeCount = completeCountQuery.data

  const depositQuery = useQuery({ ...fetchDepositsOptions({ query: { limit: limit, page: page } }) })
  const deposit = depositQuery.data?.data
  let totalDeposit = depositQuery.data?.sum ? depositQuery.data?.sum : 0

  return (
    <>
      <main className="overflow-auto min-w-6xl max-w-7xl ml-auto mr-auto">
        <div className="flex gap-x-2">
          <Link to={"/goals/management"} className="m-2 w-2/4 flex p-4 bg-linear-to-r from-red-700 to-amber-700 rounded-xl">
            <div>
              <h1 className="mb-5 text-sm">Total savings</h1>
              <p className="text-5xl font-bold">{formatMoney(totalDeposit)}</p>
            </div>
          </Link>
          <Link to={"/goals/management"} className="m-2 w-1/4 flex p-4 items-center bg-zinc-800 rounded-xl" >
            <div>
              <h1 className="mb-5 text-sm">Active goals</h1>
              <p className="text-5xl font-bold text-orange-600">{activeCount}</p>
            </div>
          </Link>
          <Link to={"/goals/management"} className="m-2 w-1/4 flex p-4 items-center bg-zinc-800 rounded-xl" >
            <div>
              <h1 className="mb-5 text-sm">Goals completed</h1>
              <p className="text-5xl font-bold text-green-400">{completeCount}</p>
            </div>
          </Link>
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
          <h1 className="font-extrabold text-2xl">Your goals</h1>
          <div className="flex-1" />
          <button className="bg-zinc-700 pl-4 pr-4 pt-1 pb-1 rounded-xl">
            <div className="flex items-center">
              <FaSliders className="mr-2" />
              Filters
            </div>
          </button>
          <button className="bg-zinc-700 pl-4 pr-4 rounded-xl">
            <div className="flex items-center">
              <FaSort className="mr-2" />
              Sort by
            </div>
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2 w-full">
          {Array.isArray(goals?.data) && goals.data.length > 0 ? (
            goals.data.map((goal, index) => (
              <div
                key={goal.id}
                className={`${getGridPositionClass(index)} bg-zinc-700 flex font-bold border border-gray-700 p-2 rounded-2xl`}
              >
                <div className="w-full p-3 flex flex-col h-full">
                  <h3 className="text-xl font-bold m-2">{goal.name}</h3>
                  {/* have this fill the empty space */}
                  <div className="flex-1" />
                  <h3 className="text-4xl m-2">{`${calculateProgressPercent(goal.amount, goal.target)}%`}</h3>

                  <div className="w-full m-2 bg-zinc-600 rounded-2xl">
                    <div className={`h-5 bg-amber-600 rounded-2xl`}
                      style={{
                        width: `${calculateProgressPercent(goal.amount, goal.target)}%`,
                      }}
                    />
                  </div>
                  <div className="flex">
                    <p className="m-2">
                      ${goal.amount.toLocaleString()} of ${goal.target.toLocaleString()}
                    </p>
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
            <p>No goals available</p>
          )}
        </div>
      </main >
    </>
  );
}

export default HomePage
