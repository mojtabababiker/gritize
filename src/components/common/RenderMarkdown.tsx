"use client";

import Link from "next/link";
import clsx from "clsx";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";

import Paragraph from "@/components/common/Paragraph";
import Heading from "@/components/common/Heading";
import { JSX } from "react";

type Props = {
  markdownText: string;
};

/**
 * A component that renders Markdown content with customized styling and components.
 *
 * @component
 * @param {string} props.markdownText - The markdown text to be rendered
 * @param {...any} props.props - Additional props to be passed to the Markdown (react-markdown) component
 *
 * @remarks
 * This component uses the `react-markdown` library with the following customizations:
 * - Supports GitHub Flavored Markdown through remarkGfm plugin
 * - Custom heading styles (h1, h2, h3)
 * - Syntax highlighting for code blocks using react-syntax-highlighter
 * - Custom styling for inline code blocks
 * - Custom paragraph styling
 * - Custom unordered list styling
 * - Custom link styling with external link behavior
 *
 * @example
 * ```tsx
 * <RenderMarkdown markdownText="# Hello **world**" />
 * ```
 *
 * @returns {JSX.Element} A rendered markdown component with custom styling
 */
export function RenderMarkdown({ markdownText, ...props }: Props): JSX.Element {
  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: (props) => (
          <Heading
            as="h1"
            size="md"
            // className="text-2xl font-bold text-fg"
            {...props}
          >
            {props.children}
          </Heading>
        ),
        h2: (props) => (
          <Heading
            as="h2"
            size="md"
            // className="text-xl font-bold text-fg"
            {...props}
          >
            {props.children}
          </Heading>
        ),
        h3: (props) => (
          <Heading
            as="h3"
            size="md"
            className="text-lg font-bold text-fg"
            {...props}
          >
            {props.children}
          </Heading>
        ),
        code: (props) => {
          const { children, className, node, ...rest } = props;
          const match = /language-(\w+)/.exec(className || "");
          return match ? (
            <SyntaxHighlighter
              // {...rest}
              PreTag="div"
              children={String(children).replace(/\n$/, "")}
              language={match[1]}
              style={dark}
              customStyle={{
                fontSize: "clamp(0.8rem, 0.5vw + 0.5rem, 1rem)",
                fontFamily: "monospace",
              }}
            />
          ) : (
            <code
              {...rest}
              className={clsx(
                "inline-block p-1 rounded-md bg-bg/45 text-surface text-xs  italic font-mono",
                className
              )}
            >
              {children}
            </code>
          );
        },
        p: (props) => {
          const { children, ...rest } = props;
          return (
            <Paragraph size="sm" className="text-fg font-serif" {...rest}>
              {props.children}
            </Paragraph>
          );
        },
        ul: (props) => {
          const { children, ...rest } = props;
          return (
            <ul
              className="list-disc list-inside text-fg font-body font-semibold"
              {...rest}
            >
              {props.children}
            </ul>
          );
        },
        li: (props) => {
          const { children, ...rest } = props;
          return (
            <li className="text-fg font-body font-semibold mt-1.5" {...rest}>
              {props.children}
            </li>
          );
        },
        a: (props) => {
          const { children, href, ...rest } = props;
          return (
            <Link
              className="text-accent font-body font-semibold underline italic hover:text-accent/80 cursor-pointer"
              target="_blank"
              href={href || ""}
              rel="noopener noreferrer"
              {...rest}
            >
              {children}
            </Link>
          );
        },
      }}
    >
      {markdownText}
    </Markdown>
  );
}
