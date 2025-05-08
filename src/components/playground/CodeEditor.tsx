"use client";

import { useRef, useState } from "react";
import clsx from "clsx";
import Editor, { EditorProps } from "@monaco-editor/react";

import { useResize } from "@/hooks/useHandleResize";

import { Languages } from "@/models/types/indext";

import {
  sandBoxURL,
  supportedLanguagesData,
} from "@/constant/editor-constants";

import Button from "@/components/common/Button";
import Timer from "@/components/common/Timer";
import ResizeRuler from "@/components/common/ResizeRuler";

type Props = EditorProps & {
  language?: Languages;
  defaultValue: string;
};

function CodeEditor({
  language = "javascript",
  onChange,
  value = "",
  options = {},
  ...props
}: Props) {
  const editorRef = useRef<any>(null);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [timerTime, setTimerTimer] = useState(0); // in minutes

  const { boxRef, handleResize } = useResize({ direction: "vertical" });

  const onMount = (editor: any) => {
    editorRef.current = editor;
  };

  const runCode = async () => {
    if (!editorRef.current) return;
    setIsRunning(true);
    const code = editorRef.current.getValue();
    const { version, extension: ext } = supportedLanguagesData[language];

    const data = {
      language,
      version,
      files: [
        {
          name: `main.${ext}`,
          content: code,
        },
      ],
    };

    try {
      const response = await fetch(`${sandBoxURL}/execute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      console.log("Result:", result);

      const { run, compile } = result;
      if (compile?.stderr) {
        setError(compile.stderr);
        setResult(null);
        return;
      }
      if (run.stderr) {
        setError(run.stderr);

        return;
      }
      setResult(run.stdout);
      setError(null);
    } catch (error: any) {
      console.error("Error running code:", error);
      // Handle error (e.g., show error message in the output area)
      setError(
        `An error occurred while running the code. ${error.message || ""}`
      );
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="relative flex w-full h-screen flex-col">
      {/* editor */}
      <div className="min-h-[60vh] w-full bg-[#1E1E1E] -mb-2.5">
        <Editor
          language={language.replace("++", "pp")} // monaco editor understands c++ as cpp
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
            disabled={isRunning}
          >
            {/* <MessageCircleWarningIcon className="w-4 h-4" /> */}
            <span className="">submit</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            isSimple
            className="gap-2 hover:bg-primary/75 capitalize text-fg"
            onClick={runCode}
            disabled={isRunning}
            isLoading={isRunning}
          >
            {/* <GitCompareIcon className="w-4 h-4 text-fg" /> */}
            <span className="text-fg">run test</span>
          </Button>
        </div>

        {/* output */}
        <div
          className={clsx(
            "terminal w-full flex-1 rounded-lg bg-[#2a2a2a] pl-3 pr-4 py-4 overflow-auto",
            error && "border border-red-600 scroll-error",
            result && "border border-primary"
          )}
        >
          {/* output content */}
          <Terminal result={result} error={error} />
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

function Terminal({
  result,
  error,
}: {
  result: string | null;
  error: string | null;
}) {
  if (!result && !error) {
    return <span className="text-fg">Output will appear here</span>;
  }
  return (
    <pre
      className={clsx(
        "text-sm  font-mono whitespace-pre-wrap",
        error ? "text-red-500 italic" : "text-green-300"
      )}
    >
      {error || result}
    </pre>
  );
}

export default CodeEditor;
