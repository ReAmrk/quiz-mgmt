import React, { useState, useEffect } from "react";
import axios from "axios";

const QuizCreationPage = () => {
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [newQuiz, setNewQuiz] = useState({
    quiz_name: "",
    quiz_description: "",
    quiz_category: 1, // Set default category ID
    quiz_questions: [], // Array to store selected question IDs
  });

  useEffect(() => {
    // Fetch categories and questions when the component mounts
    const fetchData = async () => {
      try {
        const categoriesResponse = await axios.get("http://localhost:8000/api/question-categories/");
        const questionsResponse = await axios.get("http://localhost:8000/api/questions/");
        const quizzesResponse = await axios.get("http://localhost:8000/api/quizzes/");
        setCategories(categoriesResponse.data);
        setQuestions(questionsResponse.data);
        setQuizzes(quizzesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleQuizSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8000/api/quizzes/",
        newQuiz,
        { withCredentials: true }
      );

      console.log("Quiz created:", response.data);
      // Reset form after successful submission
      setNewQuiz({
        quiz_name: "",
        quiz_description: "",
        quiz_category: 1,
        quiz_questions: [],
      });

      const quizzesResponse = await axios.get("http://localhost:8000/api/quizzes/");
    } catch (error) {
      console.error("Error creating quiz:", error);
    }
  };

  const handleQuestionSelection = (questionId) => {
    // Add or remove question from the selected questions array
    const isSelected = newQuiz.quiz_questions.includes(questionId);
    const updatedQuestions = isSelected
      ? newQuiz.quiz_questions.filter((id) => id !== questionId)
      : [...newQuiz.quiz_questions, questionId];

    setNewQuiz({ ...newQuiz, quiz_questions: updatedQuestions });
  };

  return (
      <div>
        <h2>Create Quiz</h2>

        <form onSubmit={handleQuizSubmit}>
          <label>Name:</label>
          <input
              type="text"
              value={newQuiz.quiz_name}
              onChange={(e) => setNewQuiz({...newQuiz, quiz_name: e.target.value})}
          />
          <br/>
          <label>Description:</label>
          <input
              type="text"
              value={newQuiz.quiz_description}
              onChange={(e) => setNewQuiz({...newQuiz, quiz_description: e.target.value})}
          />
          <br/>
          <label>Category:</label>
          <select
              value={newQuiz.quiz_category}
              onChange={(e) => setNewQuiz({...newQuiz, quiz_category: e.target.value})}
          >
            {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.category_name}
                </option>
            ))}
          </select>
          <br/>
          <label>Questions:</label>
          <ul>
            {questions.map(question => (
                <li key={question.id}>
                  <label>
                    <input
                        type="checkbox"
                        checked={newQuiz.quiz_questions.includes(question.id)}
                        onChange={() => handleQuestionSelection(question.id)}
                    />
                    {question.question_text}
                  </label>
                </li>
            ))}
          </ul>
          <br/>
          <button type="submit">Create Quiz</button>
        </form>
        <div>
          <h2>Existing Quizzes</h2>
          <ul>
            {quizzes.map(quiz => (
                <li key={quiz.id}>
                  <strong>{quiz.quiz_name}</strong> - {quiz.quiz_description}<br/>
                  Category: {quiz.quiz_category.category_name}<br/>
                  Questions:
                  <ul>
                    {quiz.quiz_questions.map(question => (
                        <li key={question.id}>{question.question_text}</li>
                    ))}
                  </ul>
                </li>
            ))}
          </ul>
        </div>
      </div>
  );
};

export default QuizCreationPage;