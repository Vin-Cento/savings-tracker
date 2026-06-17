import { Outlet } from "react-router-dom";
import Navbar from '../components/NavBar'

function DefaultLayout() {
  return (
    <>
      <div className="h-screen flex flex-col overflow-hidden">
        <Navbar />
        <Outlet />
      </div>
    </>
  )
}

export default DefaultLayout
