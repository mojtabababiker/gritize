"use client";

import Editor from "@monaco-editor/react";
import Button from "../common/Button";
import Paragraph from "../common/Paragraph";

type Props = {
  language?: string;
  onChange: (value?: string) => void;
  value?: string;
};

function CodeEditor({ language = "javascript", onChange, value = "" }: Props) {
  return (
    <div className="relative flex w-full h-screen flex-col">
      {/* editor */}
      <div className="h-[60vh] w-full bg-[#1E1E1E]">
        <Editor
          language={language}
          onChange={onChange}
          value={value}
          theme="vs-dark"
          className="py-10 text-2xl"
          options={{
            fontSize: 16,
            minimap: {
              scale: 1.6,
            },
            bracketPairColorization: {
              enabled: true,
              independentColorPoolPerBracketType: true,
            },
            inlineSuggest: {
              enabled: false,
            },
            inlayHints: {
              enabled: "off",
            },
            codeLens: false,
          }}
        />
      </div>

      {/* terminal & actions */}
      <div className="w-full min-h-[43vh] absolute bottom-0 pb-5 px-5 flex flex-col gap-3 border-t-4 rounded-t-2xl border-bg bg-[#212121]">
        {/* actions */}
        <div className="w-full flex items-center gap-2 mt-6">
          <Button
            variant="accent"
            size="sm"
            isSimple
            className="gap-2 hover:bg-accent/85 capitalize"
          >
            {/* <MessageCircleWarningIcon className="w-4 h-4" /> */}
            <span className="">submit</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            isSimple
            className="gap-2 hover:bg-primary/75 capitalize"
          >
            {/* <GitCompareIcon className="w-4 h-4 text-fg" /> */}
            <span className="text-fg">run test</span>
          </Button>
        </div>

        {/* output */}
        <div className="w-full flex-1 rounded-lg bg-[#2a2a2a] px-3 py-4">
          {/* Add output content here */}
          <span className="text-fg">Output will appear here</span>
          {/* <Paragraph>{value}</Paragraph> */}
        </div>
      </div>
    </div>
  );
}

export default CodeEditor;
