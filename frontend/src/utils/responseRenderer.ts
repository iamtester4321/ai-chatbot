import DOMPurify from "dompurify";
import hljs from "highlight.js";
import { marked } from "marked";

const renderer = new marked.Renderer();
renderer.code = ({ text, lang }) => {
  const validLang = lang && hljs.getLanguage(lang);
  const highlighted = validLang
    ? hljs.highlight(text, { language: lang }).value
    : hljs.highlightAuto(text).value;

  const languageClass = lang ? `language-${lang}` : "";

  return `
    <div class="code-block-wrapper relative group">
      <button class="copy-button absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 text-xs text-white bg-[#444] rounded hover:bg-[#666]">
        Copy
      </button>
      <pre><code class="hljs ${languageClass}">${highlighted}</code></pre>
    </div>
  `;
};

marked.setOptions({ renderer });

export const formatMarkdownResponse = (text: string): string => {
  const html = marked.parse(text) as string;
  return DOMPurify.sanitize(html);
};
