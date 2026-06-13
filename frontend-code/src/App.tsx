import { RouterProvider } from "react-router-dom"
import routes from './constants/routes'

function App() {
  return (
    <>
      <RouterProvider router={routes} />
    </>
  )
}

export default App
