import { Outlet } from "react-router-dom";
import Navbar from '../components/NavBar'
import BreadcrumbBar from '../components/BreadcrumbBar'

function DefaultLayout() {
  return (
    <>
      <div className="h-screen flex flex-col overflow-hidden bg-zinc-950 text-zinc-100">
        <Navbar />
        <BreadcrumbBar />
        <Outlet />
      </div>
    </>
  )
}

export default DefaultLayout
