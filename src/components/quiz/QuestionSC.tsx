import { RenderMarkdown } from "@/components/common/RenderMarkdown";

type Props = {
  question: string;
  options: string[];
  setAnswer: (answer: string) => void;
  lastQuestion?: boolean;
};

function QuestionSC({ question, options, setAnswer }: Props) {
  return (
    <div className="w-full flex flex-col items-center justify-center text-bg/85">
      <div className="w-full font-semibold text-bg/80">
        <RenderMarkdown markdownText={question} />
      </div>
      <div className="flex flex-wrap gap-5 my-5">
        {options.map((option) => (
          <div
            key={option}
            onClick={() => setAnswer(option)}
            className="min-w-[126px] h-[40px] py-6 px-4 flex items-center justify-center gap-5 rounded-lg cursor-pointer bg-fg drop-shadow-lg hover:scale-95 transition-all duration-200"
          >
            <div className="flex-1 text-xl font-body">{option}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuestionSC;
