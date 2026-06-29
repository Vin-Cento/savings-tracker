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

function HomePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { deposits } = useSelector(
    (state: RootState) => state.deposits
  )
  const [countActiveGoal, setCountActiveGoal] = useState<number>(0);
  const [countCompletedGoal, setCountCompletedGoal] = useState<number>(0);
  const [deposit, setDeposit] = useState<DepositPaginationSchema>({} as DepositPaginationSchema)

  useEffect(() => {
    dispatch(fetchDeposit({ id: [], page: 1, limit: 1000 }));
    fetchGoalCount(setCountActiveGoal);
    fetchGoalCount(setCountCompletedGoal, false);
    fetchDepositUtil(setDeposit)
  }, [dispatch]);

  return (
    <>
      <main className="overflow-auto max-w-7xl ml-auto mr-auto">
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
      </main>
    </>
  );
}

export default HomePage
