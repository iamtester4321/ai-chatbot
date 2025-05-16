import { CSSProperties, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus, vs} from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check } from "lucide-react";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";
import "../styles/markdown.css";
import DynamicChart from "../components/chart/DynamicCharts";

interface CodeProps {
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}


// Function to replace opening ``` with ```bash when no language is specified
const setDefaultBashLanguage = (text: string) => {
  // Split the text into lines to process each line individually
  const lines = text.split("\n");
  let insideCodeBlock = false;

  const processedLines = lines.map((line) => {
    // Trim whitespace for comparison
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith("```")) {
      if (!insideCodeBlock) {
        // This is an opening backtick
        // Check if it has a language specified (e.g., ```javascript)
        if (trimmedLine === "```") {
          // No language specified, replace with ```bash
          insideCodeBlock = true;
          return line.replace("```", "```bash");
        }
        // Language already specified, leave it as is
        insideCodeBlock = true;
        return line;
      } else {
        // This is a closing backtick, leave it unchanged
        insideCodeBlock = false;
        return line;
      }
    }
    // Not a backtick line, return unchanged
    return line;
  });

  return processedLines.join("\n");
};

// Function to fix unclosed code blocks
const fixUnclosedCodeBlock = (text: string) => {
  const codeBlockMatches = text.match(/```/g);
  if (codeBlockMatches && codeBlockMatches.length % 2 !== 0) {
    return text + "\n```";
  }
  return text;
};

// Code block component with copy functionality
const CodeBlock = ({ language, children }: { language: string; children?: React.ReactNode }) => {
  const { isDarkMode } = useSelector((state: RootState) => state.theme);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (children) {
      navigator.clipboard.writeText(String(children));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`relative group rounded-lg overflow-hidden my-4 border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}>
      <div className={`flex items-center justify-between px-4 py-2 ${isDarkMode ? 'bg-gray-800 text-gray-300 border-gray-700' : 'bg-gray-300 text-gray-700 border-gray-300'} text-sm border-b`}>
        <span className={`font-mono ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{language || "text"}</span>
        <button 
          onClick={handleCopy}
          className={`flex items-center gap-1 ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'} transition-colors p-1 rounded`}
          aria-label={copied ? "Copied!" : "Copy code"}
        >
          {copied ? (
            <Check size={16} className={isDarkMode ? 'text-green-500' : 'text-green-600'} />
          ) : (
            <Copy size={16} />
          )}
          <span className="text-xs">{copied ? "Copied!" : "Copy"}</span>
        </button>
      </div>
      <SyntaxHighlighter
        language={language || "text"}
        style={isDarkMode ? vscDarkPlus : vs as { [key: string]: CSSProperties }}
        customStyle={{ 
          margin: 0,
          padding: "1rem",
          borderRadius: 0,
          fontSize: "0.9rem",
          lineHeight: 1.5,
          background: isDarkMode ? "#130f29" : "#f3f4f6",
        }}
        PreTag="div"
      >
        {children ? String(children).replace(/\n$/, "") : ""}
      </SyntaxHighlighter>
    </div>
  );
};

const MarkdownRenderer = ({ content, flag }: { content: string, flag?:boolean }) => {
  const { isDarkMode } = useSelector((state: RootState) => state.theme);
  const safeContent = fixUnclosedCodeBlock(content);
  const processedContent = setDefaultBashLanguage(safeContent);

  return (
    <div className="markdown-content prose prose-slate dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }: CodeProps) {
            const match = /language-(\w+)/.exec(className || "");
            const isInline = !match;
            const lang = match?.[1] || "";

            if (isInline) {
              return (
              <code className={`px-1.5 py-0.5 rounded font-mono text-sm ${isDarkMode ? "bg-gray-800" : "bg-gray-200" }`} {...props}>
                {children}
              </code>
            )} else {
              if (lang === "json" && flag && typeof children === "string") {
                try {
                  const parsed = JSON.parse(children.trim());
                  return <DynamicChart data={parsed.data} name={parsed.name} />;
                } catch (error) {
                  console.error("Invalid JSON for DynamicChart:", error);
                  return <CodeBlock language={lang}>{children}</CodeBlock>;
                }
              }
            } return(
              <CodeBlock language={match?.[1] || "text"}>
                
                {children ? String(children).replace(/\n$/, "") : ""}
              </CodeBlock>
            );
          },
          h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mt-8 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mt-6 mb-3" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-xl font-bold mt-5 mb-2" {...props} />,
          h4: ({ node, ...props }) => <h4 className="text-lg font-bold mt-4 mb-2" {...props} />,
          p: ({ node, ...props }) => <p className="leading-relaxed" {...props} />,
          a: ({ node, ...props }) => <a className="text-blue-600 dark:text-blue-400 hover:underline" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc pl-5 my-4 space-y-2" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal pl-5 my-4 space-y-2" {...props} />,
          li: ({ node, ...props }) => <li className="mb-1" {...props} />,
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 my-4 italic text-gray-700 dark:text-gray-300"
              {...props}
            />
          ),
          table: ({ node, ...props }) => (
            <div className=" my-6">
              <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700 rounded-lg" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => <thead className="bg-gray-100 dark:bg-gray-800" {...props} />,
          tbody: ({ node, ...props }) => <tbody className="divide-y divide-gray-200 dark:divide-gray-700" {...props} />,
          tr: ({ node, ...props }) => <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/60" {...props} />,
          th: ({ node, ...props }) => <th className="px-4 py-3 text-left text-sm font-semibold text-gray-100" {...props} />,
          td: ({ node, ...props }) => <td className="px-4 py-3 text-sm" {...props} />,
          img: ({ node, ...props }) => <img className="max-w-full h-auto rounded-lg my-4" {...props} />,
          hr: ({ node, ...props }) => <hr className="my-8 border-gray-200 dark:border-gray-800" {...props} />,
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
