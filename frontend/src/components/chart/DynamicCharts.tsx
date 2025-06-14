import {
  AreaChart as AreaIcon,
  BarChart3,
  ChartLine,
  ChevronDown,
  ChevronUp,
  Download,
  LayoutGrid,
  PieChart as PieIcon,
  ScatterChart as ScatterIcon,
} from "lucide-react";
import React, {
  JSX,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import { chartOptions, COLORS } from "../../lib/constants";
import { ChartType } from "../../lib/types";
import { RootState } from "../../store/store";
import { handleExportPDF, renderWrappedLegend } from "../../utils/chart.utils";
import StreamLoader from "../Loaders/StreamLoader";

const chartIcons: Record<ChartType, JSX.Element> = {
  line: <ChartLine size={16} className="mr-2" />,
  area: <AreaIcon size={16} className="mr-2" />,
  bar: <BarChart3 size={16} className="mr-2" />,
  composed: <LayoutGrid size={16} className="mr-2" />,
  scatter: <ScatterIcon size={16} className="mr-2" />,
  pie: <PieIcon size={16} className="mr-2" />,
};

interface DynamicChartProps {
  data: Record<string, any> | Array<Record<string, any>>;
  name: string;
}

function DynamicChartComponent({ data, name }: DynamicChartProps) {
  const [chartType, setChartType] = useState<ChartType>("line");
  const [jsonData, setJsonData] = useState<Array<Record<string, any>>>([]);
  const [open, setOpen] = useState(false);
  const { isDarkMode } = useSelector((state: RootState) => state.theme);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const chartElement = useMemo(() => {
    if (!categoryKey || !numericKeys.length) {
      return <p className="text-red-500">Insufficient data for chart</p>;
    }
    switch (chartType) {
      case "line":
        return (
          <LineChart data={jsonData} className="p-2">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={categoryKey} />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
                borderColor: isDarkMode ? "#374151" : "#e5e7eb",
                color: isDarkMode ? "#f9fafb" : "#111827",
              }}
              itemStyle={{
                color: isDarkMode ? "#f3f4f6" : "#111827",
              }}
              cursor={{
                stroke: isDarkMode ? "#9ca3af" : "#6b7280",
                strokeWidth: 1,
              }}
            />
            <Legend content={renderWrappedLegend} />
            {renderSeries()}
          </LineChart>
        );
      case "area":
        return (
          <AreaChart data={jsonData} className="p-2">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={categoryKey} />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
                borderColor: isDarkMode ? "#374151" : "#e5e7eb",
                color: isDarkMode ? "#f9fafb" : "#111827",
              }}
              itemStyle={{
                color: isDarkMode ? "#f3f4f6" : "#111827",
              }}
              cursor={{
                stroke: isDarkMode ? "#9ca3af" : "#6b7280",
                strokeWidth: 1,
              }}
            />
            <Legend content={renderWrappedLegend} />
            {renderSeries()}
          </AreaChart>
        );
      case "bar":
        return (
          <BarChart data={jsonData} className="p-2">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={categoryKey} />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
                borderColor: isDarkMode ? "#374151" : "#e5e7eb",
                color: isDarkMode ? "#f9fafb" : "#111827",
              }}
              itemStyle={{
                color: isDarkMode ? "#f3f4f6" : "#111827",
              }}
              cursor={{
                stroke: isDarkMode ? "#9ca3af" : "#6b7280",
                strokeWidth: 1,
              }}
            />
            <Legend content={renderWrappedLegend} />
            {renderSeries()}
          </BarChart>
        );
      case "composed":
        return (
          <ComposedChart data={jsonData} className="p-2">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={categoryKey} />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
                borderColor: isDarkMode ? "#374151" : "#e5e7eb",
                color: isDarkMode ? "#f9fafb" : "#111827",
              }}
              itemStyle={{
                color: isDarkMode ? "#f3f4f6" : "#111827",
              }}
              cursor={{
                stroke: isDarkMode ? "#9ca3af" : "#6b7280",
                strokeWidth: 1,
              }}
            />
            <Legend content={renderWrappedLegend} />
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
          <ScatterChart className="p-2">
            <CartesianGrid />
            <XAxis dataKey={numericKeys[0]} name={numericKeys[0]} />
            <YAxis dataKey={numericKeys[1]} name={numericKeys[1]} />
            <ZAxis range={[60]} />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            <Legend content={renderWrappedLegend} />
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
            <Tooltip
              contentStyle={{
                backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
                borderColor: isDarkMode ? "#374151" : "#e5e7eb",
                color: isDarkMode ? "#f9fafb" : "#111827",
              }}
              itemStyle={{
                color: isDarkMode ? "#f3f4f6" : "#111827",
              }}
              cursor={{
                stroke: isDarkMode ? "#9ca3af" : "#6b7280",
                strokeWidth: 1,
              }}
            />
            <Legend content={renderWrappedLegend} />
          </PieChart>
        );
      default:
        return null;
    }
  }, [chartType, categoryKey, numericKeys, jsonData, renderSeries]);

  return (
    <div className="p-6">
      <p className="text-[var(--color-text)] text-2xl font-semibold mb-4">
        {name}
      </p>
      <div className="flex justify-between text-left mb-4">
        <div className="relative">
          <button
            ref={buttonRef}
            onClick={() => setOpen((prev) => !prev)}
            className="px-4 py-2 w-36 rounded-md bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-muted)] flex justify-between items-center cursor-pointer transition duration-200"
          >
            <span className="flex items-center">
              {chartIcons[chartType]}
              {chartType.charAt(0).toUpperCase() + chartType.slice(1)}
            </span>
            <span>
              {open ? (
                <ChevronUp
                  size={16}
                  className="text-[color:var(--color-text)]"
                />
              ) : (
                <ChevronDown
                  size={16}
                  className="text-[color:var(--color-text)]"
                />
              )}
            </span>
          </button>
          {open && (
            <div
              ref={dropdownRef}
              className="absolute z-10 mt-1 left-0 top-full w-36 rounded-md shadow-lg bg-[var(--color-bg)] border border-[var(--color-border)]"
            >
              <div className="py-1">
                {chartOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setChartType(option);
                      setOpen(false);
                    }}
                    className={`px-4 py-2 text-sm w-full text-left flex items-center text-[var(--color-text)] hover:bg-[var(--color-muted)] cursor-pointer ${
                      option === chartType ? "font-semibold" : ""
                    }`}
                  >
                    {chartIcons[option]}
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <button
          className="px-4 py-2 rounded-md bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-muted)] flex items-center cursor-pointer transition duration-200"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            handleExportPDF(chartRef, name, isDarkMode);
          }}
        >
          <Download size={16} className="mr-2" />
          <span>Export</span>
        </button>
      </div>
      <div className="h-96" ref={chartRef}>
        <ResponsiveContainer width="100%" height="100%">
          {chartElement || <StreamLoader />}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default React.memo(DynamicChartComponent, (prev, next) => {
  return (
    prev.name === next.name &&
    JSON.stringify(prev.data) === JSON.stringify(next.data)
  );
});
