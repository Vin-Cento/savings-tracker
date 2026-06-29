import {
  type ChartOptions,
} from "chart.js";

import type { Plugin } from "chart.js"
export const barValueLabels: Plugin<"bar"> = {
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

export const options: ChartOptions<"bar"> = {
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
