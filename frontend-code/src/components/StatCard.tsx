import { Link } from "react-router-dom";
import type { ReactNode } from "react";

type StatCardProps = {
  to?: string;
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
  const content = (
    <div>
      <h1 className="mb-5 text-sm">{title}</h1>

      <p className={`text-5xl font-bold ${valueClassName}`}>
        {value}
      </p>
    </div>
  );
  return to ? (
    <Link
      to={to}
      className={`m-2 flex rounded-xl p-4 ${className}`}
    >
      {content}
    </Link>
  ) : (
    <div className={`m-2 flex rounded-xl p-4 ${className}`}>
      {content}
    </div>
  );
}

export default StatCard;
