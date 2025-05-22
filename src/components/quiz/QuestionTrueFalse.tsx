import { Check, X } from "lucide-react";
import { RenderMarkdown } from "@/components/common/RenderMarkdown";

type Props = {
  question: string;
  setAnswer: (answer: string) => void;
  lastQuestion?: boolean;
};

function QuestionTrueFalse({ question, setAnswer }: Props) {
  return (
    <div className="w-full flex flex-col items-center justify-center text-bg/85">
      <div className="w-full font-semibold text-bg/80">
        <RenderMarkdown markdownText={question} />
      </div>

      <div className="flex items-center justify-center gap-20 my-5">
        {/* true */}
        <div
          className="size-16 flex items-center justify-center rounded-full bg-fg border-[0.6px] border-primary cursor-pointer hover:bg-primary/25 transition-all duration-200"
          onClick={() => setAnswer("true")}
        >
          <Check className="size-12 text-primary stroke-2" />
        </div>
        {/* false */}
        <div
          className="size-16 flex items-center justify-center rounded-full bg-fg border-[0.6px] border-primary cursor-pointer hover:bg-primary/25 transition-all duration-200"
          onClick={() => setAnswer("false")}
        >
          <X className="size-12 text-primary stroke-2" />
        </div>
      </div>
    </div>
  );
}

export default QuestionTrueFalse;
