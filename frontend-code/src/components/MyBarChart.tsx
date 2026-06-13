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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function MyBarChart() {
  const data: ChartData<'bar'> = {
    labels: ["Jan", "Feb", "Mar", "Apr"],
    datasets: [
      {
        label: "Sales",
        data: [12, 19, 8, 15],
        backgroundColor: "oklch(70.5% 0.213 47.604)", // Tailwind blue-500
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { grid: { color: '#374151' } }
    },
    plugins: {
      legend: {
        position: "top",
        labels: { color: '#FFFFFF' }
      },
      title: {
        display: true,
        text: "Monthly Sales",
      },
    },
  };

  return <Bar data={data} options={options} />;
}
