import { CSSProperties, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check } from "lucide-react";
import DynamicChart from "../components/chart/DynamicCharts";

interface CodeProps {
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

const fixUnclosedCodeBlock = (text: string) => {
  const codeBlockMatches = text.match(/```/g);
  if (codeBlockMatches && codeBlockMatches.length % 2 !== 0) {
    return text + "\n```";
  }
  return text;
};

const CodeBlock = ({
  language,
  children,
}: {
  language: string;
  children?: React.ReactNode;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (children) {
      navigator.clipboard.writeText(String(children));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative group rounded-lg overflow-hidden my-4 border border-blue-400 dark:border-gray-600">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 text-gray-300 text-sm border-b border-gray-700">
        <span className="font-mono">{language || "text"}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors p-1 rounded"
          aria-label={copied ? "Copied!" : "Copy code"}
        >
          {copied ? (
            <Check size={16} className="text-green-500" />
          ) : (
            <Copy size={16} />
          )}
          <span className="text-xs">{copied ? "Copied!" : "Copy"}</span>
        </button>
      </div>
      <SyntaxHighlighter
        language={language || "text"}
        style={vscDarkPlus as { [key: string]: CSSProperties }}
        customStyle={{
          margin: 0,
          padding: "1rem",
          borderRadius: 0,
          fontSize: "0.9rem",
          lineHeight: 1.5,
          background: "#121212",
        }}
        PreTag="div"
      >
        {children ? String(children).replace(/\n$/, "") : ""}
      </SyntaxHighlighter>
    </div>
  );
};

const MarkdownRenderer = ({
  content,
  flag,
}: {
  content: string;
  flag: boolean;
}) => {
  const safeContent = fixUnclosedCodeBlock(content);

  return (
    <div className="markdown-content prose prose-slate dark:prose-invert max-w-none">
      <style>{`
        .markdown-content pre { background: transparent !important; margin: 0 !important; padding: 0 !important; }
        .markdown-content .syntax-highlighter-wrapper { background-color: transparent; }
        .markdown-content .overflow-x-auto { width: 100% !important; overflow-x: auto !important; margin: 1.5rem 0 !important; padding: 0 !important; border: none !important; outline: none !important; box-shadow: none !important; }
        .markdown-content .overflow-x-auto table { width: 100% !important; min-width: 100% !important; border: 1px solid #d1d5db !important; border-radius: 0.5rem !important; background: transparent !important; border-collapse: collapse !important; }
        .markdown-content .overflow-x-auto table thead { background: #f3f4f6 !important; }
        .markdown-content .overflow-x-auto table th, .markdown-content .overflow-x-auto table td { padding: 0.75rem 1rem !important; border: 1px solid #d1d5db !important; text-align: left !important; }
        .dark .markdown-content .overflow-x-auto table { border: 1px solid #374151 !important; }
        .dark .markdown-content .overflow-x-auto table thead { background: #1f2937 !important; }
      `}</style>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }: CodeProps) {
            const match = /language-(\w+)/.exec(className || "");
            const isInline = !match;
            const lang = match?.[1] || "";

            // Render inline code
            if (isInline) {
              return (
                <code
                  className="px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-800 font-mono text-sm"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            if (lang === "json" && flag && typeof children === "string") {
              try {
                const parsed = JSON.parse(children.trim());
                return <DynamicChart data={parsed.data} name={parsed.name} />;
              } catch (error) {
                console.error("Invalid JSON for DynamicChart:", error);
                return <CodeBlock language={lang}>{children}</CodeBlock>;
              }
            }

            // Default block code
            return (
              <CodeBlock language={lang}>
                {children ? String(children).replace(/\n$/, "") : ""}
              </CodeBlock>
            );
          },
          h1: ({ node, ...props }) => (
            <h1
              className="text-3xl font-bold mt-8 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700"
              {...props}
            />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-2xl font-bold mt-6 mb-3" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-xl font-bold mt-5 mb-2" {...props} />
          ),
          h4: ({ node, ...props }) => (
            <h4 className="text-lg font-bold mt-4 mb-2" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="my-4 leading-relaxed" {...props} />
          ),
          a: ({ node, ...props }) => (
            <a
              className="text-blue-600 dark:text-blue-400 hover:underline"
              {...props}
            />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc pl-5 my-4 space-y-2" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal pl-5 my-4 space-y-2" {...props} />
          ),
          li: ({ node, ...props }) => <li className="mb-1" {...props} />,
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 my-4 italic text-gray-700 dark:text-gray-300"
              {...props}
            />
          ),
          table: ({ node, ...props }) => (
            <div className="my-6">
              <table
                className="min-w-full divide-y divide-gray-300 dark:divide-gray-700 rounded-lg"
                {...props}
              />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-gray-100 dark:bg-gray-800" {...props} />
          ),
          tbody: ({ node, ...props }) => (
            <tbody
              className="divide-y divide-gray-200 dark:divide-gray-700"
              {...props}
            />
          ),
          tr: ({ node, ...props }) => (
            <tr
              className="hover:bg-gray-50 dark:hover:bg-gray-800/60"
              {...props}
            />
          ),
          th: ({ node, ...props }) => (
            <th
              className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
              {...props}
            />
          ),
          td: ({ node, ...props }) => (
            <td
              className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200"
              {...props}
            />
          ),
          img: ({ node, ...props }) => (
            <img className="max-w-full h-auto rounded-lg my-4" {...props} />
          ),
          hr: ({ node, ...props }) => (
            <hr
              className="my-8 border-gray-200 dark:border-gray-800"
              {...props}
            />
          ),
        }}
      >
        {safeContent}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
