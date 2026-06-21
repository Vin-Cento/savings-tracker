// import { Link } from "react-router-dom"
import { formatMoney } from "../composables/format";

function HomePage() {
  return (
    <>
      <div className="flex gap-x-2 m-2">
        <div className="m-2 w-2/4 flex p-4 bg-amber-700 rounded-xl" >
          <div>
            <h1>Total savings</h1>
            <p className="text-5xl">{formatMoney(100000)}</p>
          </div>
        </div>
        <div className="m-2 w-1/4 flex p-4 items-center bg-zinc-800 rounded-xl" >
          <div>
            <h1>Active goals</h1>
            <p className="text-5xl">2</p>
          </div>
        </div>
        <div className="m-2 w-1/4 flex p-4 items-center bg-zinc-800 rounded-xl" >
          <div>
            <h1>Goals completed</h1>
            <p className="text-5xl">0</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage
