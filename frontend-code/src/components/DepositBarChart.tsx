import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, type ChartData } from "chart.js";
import { Bar } from "react-chartjs-2";
import type { DepositSchema } from "../client";
import { options, barValueLabels } from "./DepositBarChartConst"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function getLastXMonths(months: number) {
  const result = [];
  const now = new Date();
  now.setDate(1); // start of this month

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthAbbr = d.toLocaleString('en-US', { month: 'short' });
    result.push(monthAbbr);
  }
  return result;
}

interface DepositBarChartProps {
  deposits: DepositSchema[];
}

export default function DepositBarChart({ deposits }: DepositBarChartProps) {
  const last12Months = getLastXMonths(12);

  // Initialize aggregation object with zero values for all months
  const aggregation: Record<string, number> = {};
  last12Months.forEach(m => { aggregation[m] = 0; });

  // Filter data for last 6 months and aggregate amounts
  deposits.forEach((item) => {
    const date = new Date(item.createdAt);
    const monthAbbr = date.toLocaleString('en-US', { month: 'short' });
    if (aggregation.hasOwnProperty(monthAbbr)) {
      aggregation[monthAbbr] += item.amount;
    }
  });

  // Prepare labels and data for the chart
  const chartLabels = last12Months;
  const chartData = last12Months.map(m => aggregation[m]);

  const data: ChartData<'bar'> = {
    labels: chartLabels,
    datasets: [
      {
        label: "Deposits",
        data: chartData,
        backgroundColor: "oklch(64.6% 0.222 41.116)",
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  return <Bar data={data} options={options} plugins={[barValueLabels]} />;
}
