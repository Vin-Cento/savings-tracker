import { Link } from "react-router-dom"
import { formatMoney } from "../composables/format";
import type { RootState, AppDispatch } from "../stores/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchDeposit } from "../stores/depositSlice";

function HomePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { deposits } = useSelector(
    (state: RootState) => state.deposits
  )

  useEffect(() => {
    dispatch(fetchDeposit({ id: -1, page: 1, limit: 1 }));
  }, [dispatch]);

  return (
    <>
      <div className="flex gap-x-2 m-2">
        <Link to={"/goals/management"} className="m-2 w-2/4 flex p-4 bg-linear-to-r from-red-700 to-amber-700 rounded-xl">
          <div>
            <h1 className="mb-5 text-sm">Total savings</h1>
            <p className="text-5xl font-bold">{formatMoney(deposits.sum ? deposits.sum : 0)}</p>
          </div>
        </Link>
        <Link to={"/goals/management"} className="m-2 w-1/4 flex p-4 items-center bg-zinc-800 rounded-xl" >
          <div>
            <h1 className="mb-5 text-sm">Active goals</h1>
            <p className="text-5xl font-bold text-orange-600">2</p>
          </div>
        </Link>
        <Link to={"/goals/management"} className="m-2 w-1/4 flex p-4 items-center bg-zinc-800 rounded-xl" >
          <div>
            <h1 className="mb-5 text-sm">Goals completed</h1>
            <p className="text-5xl font-bold text-green-400">0</p>
          </div>
        </Link>
      </div>
    </>
  );
}

export default HomePage
