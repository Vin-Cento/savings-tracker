import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
  type ChartData,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import type { DepositSchema } from "../client";
import type { Plugin } from "chart.js"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const barValueLabels: Plugin<"bar"> = {
  id: "barValueLabels",

  afterDraw(chart) {
    const { ctx } = chart;
    const meta = chart.getDatasetMeta(0);
    const dataset = chart.data.datasets[0];
    const xAxis = chart.scales.x;

    ctx.save();
    ctx.fillStyle = "#71717b";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    dataset.data.forEach((value, index) => {
      const bar = meta.data[index];

      if (!bar) return;

      ctx.fillText(
        `$${Number(value).toLocaleString()}`,
        bar.x,
        xAxis.top + 12
      );
    });

    ctx.restore();
  },
};

const options: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      ticks: {
        color: "#ffffff",
        padding: 24, // pushes month labels down
      },
      grid: {
        display: false,
      },
      border: {
        display: false,
      },
    },

    y: {
      grid: {
        drawTicks: false,
        color: "transparent",
      },
      border: {
        display: false,
      },
      ticks: {
        display: false,
      },
    },
  },

  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },
};

function getLastXMonths(months: number) {
  const result = [];
  const now = new Date();
  now.setDate(1); // start of this month

  for (let i = months; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    // Get abbreviated month name
    const monthAbbr = d.toLocaleString('en-US', { month: 'short' });
    result.push(monthAbbr);
  }
  return result;
}

interface DepositBarChartProps {
  deposits: DepositSchema[];
}

export default function DepositBarChart({ deposits }: DepositBarChartProps) {
  const last6Months = getLastXMonths(11);

  // Initialize aggregation object with zero values for all months
  const aggregation: Record<string, number> = {};
  last6Months.forEach(m => { aggregation[m] = 0; });

  // Filter data for last 6 months and aggregate amounts
  deposits.forEach((item) => {
    const date = new Date(item.createdAt);
    const monthAbbr = date.toLocaleString('en-US', { month: 'short' });
    if (aggregation.hasOwnProperty(monthAbbr)) {
      aggregation[monthAbbr] += item.amount;
    }
  });

  // Prepare labels and data for the chart
  const chartLabels = last6Months;
  const chartData = last6Months.map(m => aggregation[m]);

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
