import { createBrowserRouter } from "react-router-dom";
import DefaultLayout from "../layouts/DefaultLayout";
import HomePage from "../pages/HomePage";
import GoalManagerPage from "../pages/GoalManagerPage";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'goals', element: <GoalManagerPage /> }
    ]
  }
])

export default routes
