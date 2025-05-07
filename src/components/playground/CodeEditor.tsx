"use client";

import Editor, { EditorProps } from "@monaco-editor/react";
import Button from "../common/Button";
import Paragraph from "../common/Paragraph";
import { useEffect, useRef, useState } from "react";
import Timer from "../common/Timer";
import { HistoryIcon } from "lucide-react";
import { useResize } from "@/hooks/useHandleResize";
import ResizeRuler from "../common/ResizeRuler";

type Props = EditorProps & {
  defaultValue: string;
};

function CodeEditor({
  language = "javascript",
  onChange,
  value = "",
  options = {},
  ...props
}: Props) {
  const editorRef = useRef(null);
  const [timerTime, setTimerTimer] = useState(0); // in minutes

  const { boxRef, handleResize } = useResize({ direction: "vertical" });

  const onMount = (editor: any) => {
    editorRef.current = editor;
  };

  return (
    <div className="relative flex w-full h-screen flex-col">
      {/* editor */}
      <div className="min-h-[60vh] w-full bg-[#1E1E1E] -mb-2.5">
        <Editor
          language={language.replace("++", "pp")}
          onChange={onChange}
          value={value}
          theme="vs-dark"
          className="pt-10 pb-3 text-2xl"
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
            ...options,
          }}
          onMount={onMount}
          {...props}
        />
      </div>

      {/* terminal & actions */}
      <div
        ref={boxRef}
        className="relative flex-1 w-full min-h-[28vh] max-h-[43vh] pb-5 px-5 flex flex-col gap-3 border-t-4 rounded-t-2xl border-bg bg-[#212121]"
      >
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

        {/* resize ruler */}
        {/* <ResizeRuler
          direction="horizontal"
          onResize={handleResize}
          className="-top-1 z-50 left-0 w-full"
        /> */}
      </div>

      {/* timer */}
      <div className="absolute z-50 top-0 right-0 py-2 pr-4 flex gap-2 opacity-85 text-primary">
        <Timer
          minutes={timerTime}
          seconds={0}
          onTimeUp={() => {}}
          onChange={setTimerTimer}
          upTimer
        />
      </div>
    </div>
  );
}

export default CodeEditor;
