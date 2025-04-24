"use client"
import { format, parseISO } from "date-fns"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface MoodChartProps {
  data: Array<{
    created_at: string
    mood: number
  }>
}

export function MoodChart({ data }: MoodChartProps) {
  // Process data for the chart
  const chartData = {
    labels: data.map((entry) => format(parseISO(entry.created_at), "MMM d")),
    datasets: [
      {
        label: "Mood",
        data: data.map((entry) => entry.mood),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  }

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 1,
        max: 10,
        ticks: {
          stepSize: 1,
        },
        title: {
          display: true,
          text: "Mood Level",
        },
      },
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            const index = tooltipItems[0].dataIndex
            return format(parseISO(data[index].created_at), "MMMM d, yyyy")
          },
          label: (context) => {
            const value = context.parsed.y
            let label = `Mood: ${value}`

            // Add mood label
            const moodLabels = [
              "Very Poor",
              "Poor",
              "Below Average",
              "Average",
              "Above Average",
              "Good",
              "Very Good",
              "Excellent",
              "Outstanding",
              "Perfect",
            ]
            label += ` (${moodLabels[value - 1] || "Average"})`

            return label
          },
        },
      },
    },
  }

  return (
    <div className="h-[300px]">
      <Line data={chartData} options={options} />
    </div>
  )
}
