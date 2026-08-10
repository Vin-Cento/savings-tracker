import { Link } from "react-router-dom";
import type { ReactNode } from "react";

type StatCardProps = {
  to: string;
  title: string;
  value: ReactNode;
  className?: string;
  valueClassName?: string;
};

function StatCard({
  to,
  title,
  value,
  className = "",
  valueClassName = "",
}: StatCardProps) {
  return (
    <Link
      to={to}
      className={`m-2 flex p-4 rounded-xl ${className}`}
    >
      <div>
        <h1 className="mb-5 text-sm">{title}</h1>

        <p className={`text-5xl font-bold ${valueClassName}`}>
          {value}
        </p>
      </div>
    </Link>
  );
}

export default StatCard;
