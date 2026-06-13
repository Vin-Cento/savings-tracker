import { Link } from "react-router-dom"

function Navbar() {
  return (
    <nav className="flex bg-black h-10 items-center">
      <li className="bg-gray-500 h-full flex items-center justify-center">
        <Link to={'/'} className="p-2">Home</Link>
      </li>
    </nav>
  )
}

export default Navbar
