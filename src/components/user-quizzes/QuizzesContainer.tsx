import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import { useAuth } from "@/context/AuthProvider";
import { UserQuizDTO } from "@/models/dto/user-dto";

import Loading from "@/components/common/Loading";
import CustomToast from "@/components/common/CustomToast";

import QuizCard from "./QuizCard";

type Props = {
  className?: string;
};

function QuizzesContainer({ className }: Props) {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<UserQuizDTO[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      if (!user?.quizzes || user.quizzes.length === 0) {
        setIsLoading(false);
        return;
      }
      try {
        const quizzes = await user.getQuizzes();
        setQuizzes(quizzes);
        setIsLoading(false);
      } catch {
        setError("Failed to fetch quizzes. Please try again later.");
        setIsLoading(false);
      }
    };
    fetchQuizzes();
  }, [user, user?.quizzes]);

  useEffect(() => {
    if (error) {
      toast.custom((t) => <CustomToast t={t} type="error" message={error} />);
    }
  }, [error]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className={className}>
      {quizzes.length > 0 ? (
        quizzes.map((quiz) => <QuizCard key={quiz.id} quiz={quiz} />)
      ) : (
        <h2 className="text-md text-fg">
          {"You haven't taken any quizzes yet."}
        </h2>
      )}
    </div>
  );
}

export default QuizzesContainer;
