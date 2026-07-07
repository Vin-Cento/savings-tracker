import { Link } from "react-router-dom"
import logoImage from '../assets/images/logo-large.svg'
import { useDispatch } from "react-redux"
import type { AppDispatch } from "../stores/store";
import { setGoal } from "../stores/goalSlice";
import { openAddGoalPopup } from "../stores/popupSlice";
import { emptyGoal } from "../constants/defaults";

function Navbar() {
  const dispatch = useDispatch<AppDispatch>();
  return (
    <nav className="flex bg-zinc-900 h-13 items-center shrink-0">
      <li className="h-full flex items-center justify-center">
        <Link to={'/'} className="p-2">
          <img src={logoImage} alt="logo" />
        </Link>
      </li>
      <div className="flex-1" />
      <button
        className="pl-2 pr-2 p-1 m-2 bg-orange-500 text-black rounded-xl font-bold"
        onClick={() => {
          dispatch(setGoal({ goal: emptyGoal }))
          dispatch(openAddGoalPopup())
        }}
      >
        + New Goal
      </button>
    </nav>
  )
}

export default Navbar
