import { Link } from "react-router-dom"
import { formatMoney } from "../composables/format";
import type { RootState, AppDispatch } from "../stores/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchDeposit } from "../stores/depositSlice";
import { fetchGoalCount } from "../composables/goalUtil";
import type { DepositPaginationSchema } from "../client";
import { fetchDepositUtil } from "../composables/depositUtil";
import DepositBarChart from "../components/DepositBarChart";
import { useQuery } from "@tanstack/react-query";
import { listGoalsGetOptions } from "../client/@tanstack/react-query.gen";
import { FaSort } from "react-icons/fa";
import { FaSliders } from "react-icons/fa6";

function HomePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { deposits } = useSelector(
    (state: RootState) => state.deposits
  )
  const [countActiveGoal, setCountActiveGoal] = useState<number>(0);
  const [countCompletedGoal, setCountCompletedGoal] = useState<number>(0);
  const [deposit, setDeposit] = useState<DepositPaginationSchema>({} as DepositPaginationSchema)

  const page = 1;
  const limit = 15;

  const goalsQuery = useQuery({
    ...listGoalsGetOptions({
      query: { page, limit },
    }),
  });

  const gridPositions = [
    "col-start-1 col-span-2 row-start-1 row-span-1",
    "col-start-3 col-span-3 row-start-1 row-span-2",
    "col-start-1 col-span-1 row-start-2 row-span-1",
    "col-start-2 col-span-1 row-start-2 row-span-1",

    "col-start-1 col-span-1 row-start-3 row-span-2",
    "col-start-2 col-span-4 row-start-3 row-span-1",
    "col-start-2 col-span-1 row-start-4 row-span-1",
    "col-start-3 col-span-3 row-start-4 row-span-1",
  ];

  const getGridPositionClass = (index: number) => {
    const patternIndex = index % gridPositions.length;
    return gridPositions[patternIndex];
  };

  const goals = goalsQuery.data

  useEffect(() => {
    dispatch(fetchDeposit({ id: [], page: 1, limit: 1000 }));
    fetchGoalCount(setCountActiveGoal);
    fetchGoalCount(setCountCompletedGoal, false);
    fetchDepositUtil(setDeposit)
  }, [dispatch]);

  return (
    <>
      <main className="overflow-auto min-w-6xl max-w-7xl ml-auto mr-auto">
        <div className="flex gap-x-2">
          <Link to={"/goals/management"} className="m-2 w-2/4 flex p-4 bg-linear-to-r from-red-700 to-amber-700 rounded-xl">
            <div>
              <h1 className="mb-5 text-sm">Total savings</h1>
              <p className="text-5xl font-bold">{formatMoney(deposits.sum ? deposits.sum : 0)}</p>
            </div>
          </Link>
          <Link to={"/goals/management"} className="m-2 w-1/4 flex p-4 items-center bg-zinc-800 rounded-xl" >
            <div>
              <h1 className="mb-5 text-sm">Active goals</h1>
              <p className="text-5xl font-bold text-orange-600">{countActiveGoal}</p>
            </div>
          </Link>
          <Link to={"/goals/management"} className="m-2 w-1/4 flex p-4 items-center bg-zinc-800 rounded-xl" >
            <div>
              <h1 className="mb-5 text-sm">Goals completed</h1>
              <p className="text-5xl font-bold text-green-400">{countCompletedGoal}</p>
            </div>
          </Link>
        </div>
        <div className="flex gap-x-2 m-2">
          <Link to={"/goals/management"} className="w-full flex p-4 items-center bg-zinc-800 rounded-xl" >
            <div className="w-full">
              <h1 className="text-sm">Monthly Deposits</h1>
              <div className="m-2 flex">
                <div className="w-full h-50">
                  <DepositBarChart deposits={deposit.data ? deposit.data : []} />
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
                <div className="w-full">
                  <h3 className="font-bold">{goal.name}</h3>
                  <p>Target: {goal.target}</p>
                  <div className="w-full bg-zinc-600">
                    <div className="h-5 w-75/100 bg-amber-50"></div>
                  </div>
                  <p>
                    Deadline:{' '}
                    {goal.deadline ? new Date(goal.deadline).toLocaleDateString() : 'No deadline'}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>No goals available</p>
          )}
        </div>
      </main>
    </>
  );
}

export default HomePage
