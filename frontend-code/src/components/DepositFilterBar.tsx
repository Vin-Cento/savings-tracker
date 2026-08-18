import { FaSort } from "react-icons/fa";
import { FaSliders } from "react-icons/fa6";
import DropdownButton, { type DropdownItem } from "./DropdownButton";

type DepositFilterBarProps = {
  filterOptions: DropdownItem[];
  sortOptions: DropdownItem[];
};

function DepositFilterBar({
  filterOptions,
  sortOptions,
}: DepositFilterBarProps) {
  return (
    <div className="flex gap-x-2 m-2 mt-9">
      <h1 className="font-extrabold text-2xl">
        Your goals
      </h1>

      <div className="flex-1" />

      <div className="relative">
        <DropdownButton
          label="Filters"
          icon={<FaSliders />}
          items={filterOptions}
        />
      </div>

      <div className="relative">
        <DropdownButton
          label="Sort"
          icon={<FaSort />}
          items={sortOptions}
        />
      </div>
    </div>
  );
}

export default DepositFilterBar;
