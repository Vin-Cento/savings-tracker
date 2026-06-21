import { Link } from "react-router-dom"
import { FaHome } from "react-icons/fa";

function Navbar() {
  return (
    <nav className="flex bg-zinc-900 h-13 items-center shrink-0">
      <li className="h-full flex items-center justify-center">
        <Link to={'/'} className="p-2"><FaHome className="text-4xl" /></Link>
      </li>
    </nav>
  )
}

export default Navbar
