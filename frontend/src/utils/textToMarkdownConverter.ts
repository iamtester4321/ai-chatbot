export const textToMarkdown = (text: string): string => {
  // Normalize line endings
  const normalizedText = text.replace(/\r\n/g, '\n');

  // Escape special markdown characters
  const escapedText = normalizedText
    .replace(/([*_`#[\](){}|\\])/g, '\\$1')
    .replace(/^(\d+)\. /gm, '$1\\. ');

  // Preserve whitespace and line breaks
  const preservedText = escapedText
    .split('\n')
    .map(line => line.length > 0 ? line : '')
    .join(' \n');

  return preservedText;
};

