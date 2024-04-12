import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const QuizAdmin = () => {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const quizzesResponse = await axios.get("http://localhost:8000/api/quizzes/");
        const sortedQuizzes = quizzesResponse.data.sort((a, b) => new Date(a.quiz_date) - new Date(b.quiz_date));
        setQuizzes(sortedQuizzes);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('et-EE', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  const handleDeleteQuiz = async (quizId) => {
    try {
      await axios.delete(`http://localhost:8000/api/quizzes/${quizId}`);
      // After deletion, fetch and update the quizzes list
      const quizzesResponse = await axios.get("http://localhost:8000/api/quizzes/");
      const sortedQuizzes = quizzesResponse.data.sort((a, b) => new Date(a.quiz_date) - new Date(b.quiz_date));
      setQuizzes(sortedQuizzes);
    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  };

const handleEndQuiz = async (quizId) => {
  try {
    // Fetch the existing quiz data
    const quizResponse = await axios.get(`http://localhost:8000/api/quizzes/${quizId}`);
    const existingQuizData = quizResponse.data;
    existingQuizData.team_limit = String(existingQuizData.team_limit)
    existingQuizData.is_completed = true;

    // Update the existing quiz data
    const updatedQuizData = {
      ...existingQuizData,
      category_id: existingQuizData.category.id,
    };

    updatedQuizData.quiz_date = existingQuizData.quiz_date.split("T")[0];
    // Send PUT request with updated quiz data
    await axios.put(`http://localhost:8000/api/quizzes/${quizId}`, updatedQuizData);

    // After completion, fetch and update the quizzes list
    const quizzesResponse = await axios.get("http://localhost:8000/api/quizzes/");
    const sortedQuizzes = quizzesResponse.data.sort((a, b) => new Date(a.quiz_date) - new Date(b.quiz_date));
    setQuizzes(sortedQuizzes);
  } catch (error) {
    console.error("Error ending quiz:", error);
  }
};

return (
  <div className="container mt-5">
    <div className="mt-5">
      <button
          className="btn btn-primary d-inline-flex align-items-center"
          type="button"
          onClick={() => window.location.href = "/create-quiz"}
      >
        Create Quiz
      </button>
      <h2>Ongoing Quizzes</h2>
      <ul className="list-group">
        {quizzes
            .filter((quiz) => !quiz.is_completed)
            .map((quiz) => (
                <li key={quiz.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <Link to={`/edit-quiz/${quiz.id}`}>
                    <strong>{quiz.quiz_name}</strong> - {formatDate(quiz.quiz_date)}
                  </Link>
                  <div>
                    <button
                        className="btn btn-danger me-2"
                        onClick={() => handleDeleteQuiz(quiz.id)}
                    >
                      Delete
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={() => handleEndQuiz(quiz.id)}
                    >
                      End
                    </button>
                  </div>
                </li>
            ))}
      </ul>
    </div>
    <div className="mt-5">
      <h2>Ended Quizzes</h2>
      <ul className="list-group">
        {quizzes
            .filter((quiz) => quiz.is_completed)
            .map((quiz) => (
                <li key={quiz.id} className="list-group-item d-flex justify-content-between align-items-center">
              <Link to={`/edit-quiz/${quiz.id}`}>
                <strong>{quiz.quiz_name}</strong> - {formatDate(quiz.quiz_date)}
              </Link>
              <div>
                <button
                  className="btn btn-danger me-2"
                  onClick={() => handleDeleteQuiz(quiz.id)}
                >
                  Delete
                </button>
                {/* No "End" button for ended quizzes */}
              </div>
            </li>
          ))}
      </ul>
    </div>
  </div>
);
};

export default QuizAdmin;
