import { countGoalsCountGet } from "../client"

export async function fetchGoalCount(setCount: React.Dispatch<React.SetStateAction<number>>, active: boolean = true) {
  try {
    const result = await countGoalsCountGet({ query: { active: active } })
    setCount(result.data ? result.data : 0)
  } catch (error) {
    console.error('Failed to fetch goals count:', error)
  }
}
