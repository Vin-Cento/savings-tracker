import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom"
import type { AppDispatch, RootState } from "../stores/store";
import { useEffect } from "react";
import { addHistory, clearHistory } from "../stores/breadcrumbSlice";

function getBreadcrumbLabel(pathname: string) {
  if (pathname === "/") return "Home";
  if (pathname === "/goals/management") return "Goals";

  if (pathname.startsWith("/goals/")) {
    const id = pathname.split("/")[2];
    return `${id}`;
  }
  return pathname;
}

function BreadcrumbBar() {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();

  const { breadcrumb } = useSelector(
    (state: RootState) => state.breadcrumb
  );

  useEffect(() => {
    if (location.pathname === '/') {
      dispatch(clearHistory());
    }
    dispatch(
      addHistory({
        label: getBreadcrumbLabel(location.pathname),
        path: location.pathname,
      })
    );
  }, [dispatch, location.pathname]);


  return (
    <>
      {location.pathname !== "/" &&
        <nav aria-label="Breadcrumb">
          <ol className="flex bg-zinc-800 items-center shrink-0 text-sm italic">
            {breadcrumb.map((item, index) => {
              const isLast = index === breadcrumb.length - 1;

              return (
                <li key={item.path} className="flex items-center">
                  {isLast ? (
                    <span aria-current="page" className="pl-1">
                      {item.label}
                    </span>
                  ) : (
                    <>
                      <Link to={item.path} className="pl-1 hover:underline">
                        {item.label}
                      </Link>
                      <span className="pl-1">/</span>
                    </>
                  )}
                </li>
              );
            })}
          </ol >
        </nav>
      }
    </>
  )
}

export default BreadcrumbBar
