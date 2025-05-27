import React, { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

function hexToRGBA(hex, opacity) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export default function ChartComponent({ className }) {
  const [chartConfig, setChartConfig] = useState({
    desktop: {
      label: "Desktop",
      color: "var(--color-validGreen)",
    },
    mobile: {
      label: "Mobile",
      color: "rgba(12, 221, 8, 0.3)", // default fallback
    },
  });

  useEffect(() => {
    const dynamicGreen = getComputedStyle(document.documentElement)
      .getPropertyValue("--color-validGreen")
      .trim();

    // Only proceed if it's a valid hex
    if (dynamicGreen.startsWith("#")) {
      setChartConfig({
        desktop: {
          label: "Desktop",
          color: dynamicGreen,
        },
        mobile: {
          label: "Mobile",
          color: hexToRGBA(dynamicGreen, 0.3),
        },
      });
    }
  }, []);

  return (
    <Card className={`" ${className}`}>
      <CardHeader>
        <div className="flex w-full items-center justify-between">
          <div>
            <CardTitle>Bar Chart - Multiple</CardTitle>
            <CardDescription>January - June 2024</CardDescription>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <p className="text-sm">Option 1</p>
              <div className="bg-validGreen h-3 w-3 rounded"></div>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm">Option 2</p>
              <div className="bg-validGreen/30 h-3 w-3 rounded"></div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="w-full overflow-x-auto">
        <ChartContainer config={chartConfig}>
          <BarChart width={700} height={350} data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar
              dataKey="desktop"
              fill={chartConfig.desktop.color}
              radius={4}
              barSize={30}
            />
            <Bar
              dataKey="mobile"
              fill={chartConfig.mobile.color}
              radius={4}
              barSize={30}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        {/*  */}
        <div className="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
