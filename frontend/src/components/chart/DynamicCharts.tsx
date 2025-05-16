import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { RootState } from "../../store/store";
import React from "react";
import StreamLoader from "../StreamLoader/StreamLoader";

const COLORS = [
  "#4F46E5",
  "#0D9488",
  "#E11D48",
  "#D97706",
  "#0284C7",
  "#7C3AED",
  "#65A30D",
  "#DB2777",
  "#059669",
  "#EA580C",
  "#0891B2",
  "#C026D3",
  "#CA8A04",
  "#2563EB",
  "#DC2626",
  "#16A34A",
  "#9333EA",
  "#475569",
  "#57534E",
  "#8B5CF6",
];

type ChartType = "line" | "area" | "bar" | "composed" | "scatter" | "pie";

interface DynamicChartProps {
  data: Record<string, any> | Array<Record<string, any>>;
  name: string;
}

function DynamicChartComponent({ data, name }: DynamicChartProps) {
  const { isDarkMode } = useSelector((state: RootState) => state.theme);
  const [chartType, setChartType] = useState<ChartType>("line");
  const [jsonData, setJsonData] = useState<Array<Record<string, any>>>([]);

  // Transform object-of-arrays into array-of-objects
  useEffect(() => {
    if (Array.isArray(data)) {
      setJsonData(data);
    } else if (typeof data === "object" && data !== null) {
      const keys = Object.keys(data);
      const lengths = keys.map((k) =>
        Array.isArray(data[k]) ? data[k].length : 0
      );
      const maxLen = Math.max(...lengths, 0);
      const arr: Array<Record<string, any>> = [];
      for (let i = 0; i < maxLen; i++) {
        const obj: Record<string, any> = {};
        for (const k of keys) {
          if (Array.isArray(data[k])) {
            obj[k] = data[k][i];
          }
        }
        arr.push(obj);
      }
      setJsonData(arr);
    } else {
      setJsonData([]);
    }
  }, [data]);

  // Detect category (string array) and numeric series
  const { categoryKey, numericKeys } = useMemo(() => {
    if (!jsonData.length) return { categoryKey: "", numericKeys: [] };
    const sample = jsonData[0];
    const keys = Object.keys(sample);
    const categoryKey =
      keys.find(
        (k) => typeof sample[k] === "string" || Array.isArray(sample[k])
      ) || keys[0];
    const numericKeys = keys.filter((k) => typeof sample[k] === "number");
    return { categoryKey, numericKeys };
  }, [jsonData]);

  const renderSeries = useCallback(
    () =>
      numericKeys.map((key, idx) => {
        const color = COLORS[idx % COLORS.length];
        switch (chartType) {
          case "line":
            return <Line key={key} dataKey={key} stroke={color} />;
          case "area":
            return <Area key={key} dataKey={key} stroke={color} fill={color} />;
          case "bar":
            return <Bar key={key} dataKey={key} fill={color} />;
          case "composed":
            if (idx === 0)
              return (
                <Area key={key} dataKey={key} stroke={color} fill={color} />
              );
            if (idx === 1) return <Bar key={key} dataKey={key} fill={color} />;
            return <Line key={key} dataKey={key} stroke={color} />;
          default:
            return null;
        }
      }),
    [chartType, numericKeys]
  );

  // Memoize the entire chart element
  const chartElement = useMemo(() => {
    if (!categoryKey || !numericKeys.length) {
      return <p className="text-red-500">Insufficient data for chart</p>;
    }
    switch (chartType) {
      case "line":
        return (
          <LineChart data={jsonData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={categoryKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            {renderSeries()}
          </LineChart>
        );
      case "area":
        return (
          <AreaChart data={jsonData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={categoryKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            {renderSeries()}
          </AreaChart>
        );
      case "bar":
        return (
          <BarChart data={jsonData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={categoryKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            {renderSeries()}
          </BarChart>
        );
      case "composed":
        return (
          <ComposedChart data={jsonData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={categoryKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            {renderSeries()}
          </ComposedChart>
        );
      case "scatter":
        if (numericKeys.length < 2) {
          return (
            <p className="text-red-500">
              Scatter requires at least 2 numeric fields
            </p>
          );
        }
        return (
          <ScatterChart>
            <CartesianGrid />
            <XAxis dataKey={numericKeys[0]} name={numericKeys[0]} />
            <YAxis dataKey={numericKeys[1]} name={numericKeys[1]} />
            <ZAxis range={[60]} />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            <Legend />
            <Scatter data={jsonData} fill={COLORS[0]} />
          </ScatterChart>
        );
      case "pie":
        // For pie, take the first numeric series
        return (
          <PieChart>
            <Pie
              data={jsonData}
              dataKey={numericKeys[0]}
              nameKey={categoryKey}
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {jsonData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        );
      default:
        return null;
    }
  }, [chartType, categoryKey, numericKeys, jsonData, renderSeries]);

  return (
    <div className="p-6">
      <h2
        className={`text-2xl font-semibold mb-4 ${
          isDarkMode ? "text-[#e5e7eb]" : "text-[#111827]"
        }`}
      >
        {name}
      </h2>
      <select
        className={`border p-2 rounded mb-4  ${
          isDarkMode ? "text-[#e5e7eb]" : "text-[#111827]"
        }`}
        value={chartType}
        onChange={(e) => setChartType(e.target.value as ChartType)}
      >
        <option value="line">Line</option>
        <option value="area">Area</option>
        <option value="bar">Bar</option>
        <option value="composed">Composed</option>
        <option value="scatter">Scatter</option>
        <option value="pie">Pie</option>
      </select>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          {chartElement || <StreamLoader />}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Only re-render when `data` or `name` change
export default React.memo(DynamicChartComponent, (prev, next) => {
  return (
    prev.name === next.name &&
    JSON.stringify(prev.data) === JSON.stringify(next.data)
  );
});
