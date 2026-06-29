import { listDepositPost, type DepositPaginationSchema } from "../client"

export async function fetchDepositUtil(setDeposit: React.Dispatch<React.SetStateAction<DepositPaginationSchema>>) {
  try {
    const date = new Date();
    date.setMonth(date.getMonth() - 6);
    const result = await listDepositPost({ query: { deposit_date: date.toISOString() } })
    setDeposit(result.data ? result.data : {} as DepositPaginationSchema)
  } catch (error) {
    console.error(error)
  }
}
