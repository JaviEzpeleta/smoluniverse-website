import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ARenderer,
  h1Renderer,
  h2Renderer,
  h3Renderer,
  liRenderer,
  pRenderer,
  ulRenderer,
} from "./markdown/renderers";

export const MarkdownRenderer = ({
  children,
}: {
  children: React.ReactNode;
  isWebsite?: boolean;
}) => {
  return (
    <Markdown
      components={{
        ul: ulRenderer,
        li: liRenderer,
        // h1: isWebsite ? h1RendererWebsite : h1Renderer,
        h1: h1Renderer,
        h2: h2Renderer,
        h3: h3Renderer,
        p: pRenderer,
        a: ARenderer,
      }}
      remarkPlugins={[remarkGfm]}
    >
      {processContent(children as string)}
    </Markdown>
  );
};

const processContent = (text: string) => {
  const textWithoutBRs = text.replace(
    /<br\/>/g,
    `

`
  );
  return textWithoutBRs.replace(
    /lens\/(\w+)/g,
    "[https://hey.xyz/u/$1](https://hey.xyz/u/$1)"
  );
};
