import React, { useState, useEffect } from "react";
import axios from "axios";

const QuizCreationPage = () => {
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [questionsInQuizzes, setQuestionsInQuizzes] = useState([]);
  const [newQuiz, setNewQuiz] = useState({
    quiz_name: "",
    description: "",
    category_id: "1", // Set default category ID
    quiz_questions: [], // Array to store selected question IDs
  });

  useEffect(() => {
    // Fetch categories and questions when the component mounts
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
      // Create the quiz first
      const quizResponse = await axios.post(
        "http://localhost:8000/api/quizzes/",
        {
          quiz_name: newQuiz.quiz_name,
          description: newQuiz.description,
          category_id: newQuiz.category_id,
        },
        { withCredentials: true }
      );

      // Extract the quiz ID from the response
      const quizId = quizResponse.data.id;

      // Create an array of promises for each selected question
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

      // Execute all promises in parallel
      await Promise.all(questionPromises);

      // Reset form after successful submission
      setNewQuiz({
        quiz_name: "",
        description: "",
        category_id: "1",
        quiz_questions: [],
      });

      // Fetch updated quizzes data
      const quizzesResponse = await axios.get("http://localhost:8000/api/quizzes/");
      setQuizzes(quizzesResponse.data);
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


  const getQuestionsForQuiz = (quizId) => {
    // Filter questionsInQuizzes based on the current quiz ID
    const filteredQuestionsInQuiz = questionsInQuizzes.filter((qiq) => qiq.quiz.id === quizId)

    // Map over the filtered questionsInQuiz and return an array of question objects
    const newQuestions = filteredQuestionsInQuiz.map((qq) => qq.question);


    // Use the questionIds to filter the questions
    // const filteredQuestions = questions.filter((question) => questionIds.includes(question.id));

    return newQuestions;
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
              value={newQuiz.description}
              onChange={(e) => setNewQuiz({...newQuiz, description: e.target.value})}
          />
          <br/>
          <label>Category:</label>
          <select
              value={newQuiz.category_id}
              onChange={(e) => setNewQuiz({...newQuiz, category_id: e.target.value})}
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
                    {question.question}
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
            {quizzes.map((quiz) => (
                <li key={quiz.id}>
                  <strong>{quiz.quiz_name}</strong> - {quiz.description}<br/>
                  Category: {quiz.category.category_name}<br/>
                  Questions:
                  <ul>
                    {getQuestionsForQuiz(quiz.id).map((question) => (
                        <li key={question.id}>{question.question}</li>
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