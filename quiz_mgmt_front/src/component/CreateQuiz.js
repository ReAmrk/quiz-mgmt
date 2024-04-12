import React, { useState, useEffect } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import CreateNewQuestion from "./CreateQuestion";

const CreateNewQuiz = () => {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [questionsInQuizzes, setQuestionsInQuizzes] = useState([]);
  const [newQuiz, setNewQuiz] = useState({
    quiz_name: "",
    description: "",
    category_id: "1",
    team_limit: "1",
    quiz_date: "",
    quiz_questions: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesResponse = await axios.get("http://localhost:8000/api/categories/");
        const questionsResponse = await axios.get("http://localhost:8000/api/questions/");
        const quizzesResponse = await axios.get("http://localhost:8000/api/quizzes/");
        const questionsInQuizzesResponse = await axios.get("http://localhost:8000/api/questions_in_quizzes/");
        setCategories(categoriesResponse.data);
        setQuestions(questionsResponse.data);
        setQuizzes(quizzesResponse.data);
        setQuestionsInQuizzes(questionsInQuizzesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleQuizSubmit = async (e) => {
    e.preventDefault();

    try {
      const quizResponse = await axios.post(
        "http://localhost:8000/api/quizzes/",
        {
          quiz_name: newQuiz.quiz_name,
          description: newQuiz.description,
          category_id: newQuiz.category_id,
          team_limit: newQuiz.team_limit,
          quiz_date: newQuiz.quiz_date,
          is_completed: false,
        },
        { withCredentials: true }
      );

      const quizId = quizResponse.data.id;

      const questionPromises = newQuiz.quiz_questions.map((questionId) =>
        axios.post(
          "http://localhost:8000/api/questions_in_quizzes/",
          {
            question_id: questionId,
            quiz_id: quizId,
          },
          { withCredentials: true }
        )
      );

      await Promise.all(questionPromises);
      navigate("/");
    } catch (error) {
      console.error("Error creating quiz:", error);
    }
  };

  const handleQuestionSelection = (questionId) => {
    const isSelected = newQuiz.quiz_questions.includes(questionId);
    const updatedQuestions = isSelected
      ? newQuiz.quiz_questions.filter((id) => id !== questionId)
      : [...newQuiz.quiz_questions, questionId];

    setNewQuiz({ ...newQuiz, quiz_questions: updatedQuestions });
  };

  return (
    <div className="container mt-5">
      <h2>Create Quiz</h2>

      <form onSubmit={handleQuizSubmit}>
        <div className="mb-3">
          <label className="form-label">Name:</label>
          <input
            type="text"
            className="form-control"
            value={newQuiz.quiz_name}
            onChange={(e) => setNewQuiz({ ...newQuiz, quiz_name: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description:</label>
          <input
            type="text"
            className="form-control"
            value={newQuiz.description}
            onChange={(e) => setNewQuiz({ ...newQuiz, description: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Team Limit:</label>
          <input
            type="text"
            className="form-control"
            value={newQuiz.team_limit}
            onChange={(e) => setNewQuiz({ ...newQuiz, team_limit: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Date:</label>
          <input
            type="date"
            className="form-control"
            value={newQuiz.quiz_date}
            onChange={(e) => setNewQuiz({ ...newQuiz, quiz_date: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Category:</label>
          <select
            className="form-select"
            value={newQuiz.category_id}
            onChange={(e) => setNewQuiz({ ...newQuiz, category_id: e.target.value })}
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.category_name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Questions:</label>
          <ul className="list-group">
            {questions.map(question => (
              <li key={question.id} className="list-group-item">
                <label className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={newQuiz.quiz_questions.includes(question.id)}
                    onChange={() => handleQuestionSelection(question.id)}
                  />
                  {question.question}
                </label>
              </li>
            ))}
          </ul>
        </div>
        <button type="submit" className="btn btn-primary">Create Quiz</button>
      </form>
    </div>
  );
};

export default CreateNewQuiz;
