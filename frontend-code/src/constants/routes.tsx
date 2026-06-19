import { createBrowserRouter } from "react-router-dom";
import DefaultLayout from "../layouts/DefaultLayout";
import HomePage from "../pages/HomePage";
import GoalManagerPage from "../pages/GoalManagerPage";
import GoalPage from "../pages/Goals";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'goals/:id', element: <GoalPage /> },
      { path: 'goals/management', element: <GoalManagerPage /> }
    ]
  }
])

export default routes
