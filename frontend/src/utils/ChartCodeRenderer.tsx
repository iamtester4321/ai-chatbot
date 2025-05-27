import { useMemo } from "react";
import DynamicChart from "../components/chart/DynamicCharts";

const ChartCodeRenderer = ({ children }: { children: string }) => {
  const content = useMemo(() => {
    try {
      const parsed = JSON.parse(children.trim());
      return <DynamicChart data={parsed.data} name={parsed.name} />;
    } catch (error) {
      console.error("Invalid JSON for DynamicChart:", error);
    }
  }, [children]);

  return content;
};

export default ChartCodeRenderer;
