import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { RefObject } from "react";
import { DefaultLegendContentProps } from "recharts";

export const handleExportPDF = async (
  chartRef: RefObject<HTMLDivElement | null>,
  name: string,
  isDarkMode: boolean
) => {
  if (!chartRef.current) return;

  const canvas = await html2canvas(chartRef.current, {
    backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
    scale: 2,
  });

  const imgData = canvas.toDataURL("image/png");
  const padding = 40;
  const pdfWidth = canvas.width + padding * 2;
  const pdfHeight = canvas.height + padding * 2;

  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "px",
    format: [pdfWidth, pdfHeight],
  });

  pdf.addImage(imgData, "PNG", padding, padding, canvas.width, canvas.height);
  pdf.save(`${name}-chart.pdf`);
};

export const renderWrappedLegend = (props: DefaultLegendContentProps) => {
  const { payload } = props;
  if (!payload) return <></>;
  return (
    <ul className="flex flex-wrap list-none m-0 p-0 justify-center w-full">
      {payload.map((entry: any, index: number) => (
        <li
          key={`item-${index}`}
          className="flex items-center mr-3 mb-2 text-[var(--color-text)] uppercase"
        >
          <span
            className="inline-block w-[10px] h-[10px] mr-2"
            style={{ backgroundColor: entry.color }}
          />
          {entry.value}
        </li>
      ))}
    </ul>
  );
};
