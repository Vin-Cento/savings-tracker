import { Outlet } from "react-router-dom";
import Navbar from '../components/NavBar'

function DefaultLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}

export default DefaultLayout
