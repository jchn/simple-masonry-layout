import { PrismAsyncLight as SyntaxHighlighter } from "react-syntax-highlighter";
import js from "react-syntax-highlighter/dist/cjs/languages/prism/javascript";
import ts from "react-syntax-highlighter/dist/cjs/languages/prism/typescript";
import jsx from "react-syntax-highlighter/dist/cjs/languages/prism/jsx";
import { vscDarkPlus as theme } from "react-syntax-highlighter/dist/cjs/styles/prism";

SyntaxHighlighter.registerLanguage("js", js);
SyntaxHighlighter.registerLanguage("ts", ts);
SyntaxHighlighter.registerLanguage("jsx", jsx);

const CodeBlock = ({
  children,
  language,
  showLineNumbers,
  startingLineNumber,
}: {
  children: string;
  language: "javascript" | "typescript";
  showLineNumbers?: boolean;
  startingLineNumber?: number;
}) => {
  return (
    <SyntaxHighlighter
      showLineNumbers={showLineNumbers}
      lineNumberStyle={{
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
      language={language}
      style={theme}
      startingLineNumber={startingLineNumber}
    >
      {children}
    </SyntaxHighlighter>
  );
};

export default CodeBlock;

// TODO: light theme
