import type { GoalSchema } from "../client";
import { gridPositions } from "../pages/HomePage/constant";

export type GoalGridProps = {
  goals: GoalSchema[];
  depositGoal: (goal: GoalSchema) => void;
};

function calculateProgressPercent(amount: number, target: number): number {
  if (target <= 0) return -1;
  return Math.min(Math.round((amount / target) * 100), 100);
}

function GoalGrid({ goals, depositGoal }: GoalGridProps) {

  const getGridPositionClass = (index: number) => {
    const patternIndex = index % gridPositions.length;
    return gridPositions[patternIndex];
  };
  return (
    <div className="grid grid-cols-3 gap-2 w-full">
      {goals.length === 0
        ? (
          <div
            className={
              `bg-zinc-800 col-start-1 col-span-3 row-start-1 row-span-1 border 
              border-dashed border-zinc-700 p-2 rounded-2xl min-h-56 flex
              items-center justify-center`
            }
          >
            <p>empty</p>
          </div>
        )
        : goals.map((goal, index) => {
          const progress = calculateProgressPercent(
            goal.amount,
            goal.target,
          );

          return (
            <div
              key={goal.id}
              className={
                `${getGridPositionClass(index)} 
                  bg-zinc-700 flex font-bold border 
                  border-gray-700 p-2 rounded-2xl 
                  cursor-pointer`
              }
              onClick={() => depositGoal(goal)}
            >
              <div className="w-full p-3 flex flex-col h-full">
                <h3 className="text-xl font-bold m-2">
                  {goal.name}
                </h3>

                <div className="flex-1" />

                {progress !== -1 && (
                  <>
                    <h3 className="text-4xl m-2">
                      {progress}%
                    </h3>

                    <div className="w-full m-2 bg-zinc-600 rounded-2xl">
                      <div
                        className="h-5 bg-amber-600 rounded-2xl"
                        style={{
                          width: `${progress}%`,
                        }}
                      />
                    </div>
                  </>
                )}

                <div className="flex">
                  <p className="m-2">
                    {progress !== -1
                      ? `$${goal.amount.toLocaleString()} of $${goal.target.toLocaleString()}`
                      : "No Target"}
                  </p>

                  <p className="m-2">
                    {goal.deadline
                      ? `Due ${new Date(goal.deadline).toLocaleDateString(
                        "en-GB",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        },
                      )}`
                      : "No deadline"}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default GoalGrid;
