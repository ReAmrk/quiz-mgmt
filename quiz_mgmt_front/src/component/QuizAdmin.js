import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const QuizCreationPage = () => {
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

  return (
    <div className="container mt-5">
      <div className="mt-5">
        <h2>Existing Quizzes</h2>
        <ul className="list-group">
          {quizzes.map((quiz) => (
            <li key={quiz.id} className="list-group-item">
              <Link to={`/edit/${quiz.id}`}>
                <strong>{quiz.quiz_name}</strong> - {formatDate(quiz.quiz_date)}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default QuizCreationPage;
