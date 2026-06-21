import { Link } from "react-router-dom"

function HomePage() {
  return (
    <>
      <div>
        <div className="m-2">
          <Link to={'/goals/management'}>Goto Goal Management Page</Link>
        </div>
      </div>
    </>
  )
}

export default HomePage
