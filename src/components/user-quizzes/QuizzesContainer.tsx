import { useEffect, useState } from "react";

import { useAuth } from "@/context/AuthProvider";
import { UserQuizDTO } from "@/models/dto/user-dto";

import Loading from "@/components/common/Loading";

import QuizCard from "./QuizCard";

function QuizzesContainer() {
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
      const quizzes = await user.getQuizzes();
      setQuizzes(quizzes);
      setIsLoading(false);
    };
    fetchQuizzes();
  }, [user]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {quizzes.length > 0 ? (
        quizzes.map((quiz) => <QuizCard key={quiz.id} quiz={quiz} />)
      ) : (
        <h2 className="text-md text-fg">You haven't taken any quizzes yet.</h2>
      )}
    </div>
  );
}

export default QuizzesContainer;
