import { Link } from "react-router-dom";
import type { DepositSchema } from "../client";
import DepositBarChart from "./DepositBarChart";

type DepositStatsProps = {
  deposits: DepositSchema[];
};

function DepositCardStats({ deposits }: DepositStatsProps) {
  return (

    <div className="flex gap-x-2 m-2">
      <Link
        to="/goals/management"
        className="w-full flex p-4 items-center bg-zinc-800 rounded-xl"
      >
        <div className="w-full">
          <h1 className="text-sm">Monthly Deposits</h1>

          <div className="m-2 flex">
            <div className="w-full h-50">
              <DepositBarChart deposits={deposits} />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default DepositCardStats
