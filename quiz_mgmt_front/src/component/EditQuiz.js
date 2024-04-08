import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const EditQuiz = () => {
    const { quizId } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [categories, setCategories] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState("");
    const [questionsInQuizzes, setQuestionsInQuizzes] = useState([]);
    const [teamsInQuizzes, setTeamsInQuizzes] = useState([]);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const quizResponse = await axios.get(`http://localhost:8000/api/quizzes/${quizId}`);
                const categoriesResponse = await axios.get("http://localhost:8000/api/categories/");
                const questionsResponse = await axios.get("http://localhost:8000/api/questions/");
                const questionsInQuizzesResponse = await axios.get(`http://localhost:8000/api/questions_in_quizzes/`);
                const teamsInQuizzesResponse = await axios.get(`http://localhost:8000/api/teams_in_quizzes/`);

                setQuiz(quizResponse.data);
                setCategories(categoriesResponse.data);
                setQuestions(questionsResponse.data);
                setQuestionsInQuizzes(questionsInQuizzesResponse.data);
                const teamsForCurrentQuiz = teamsInQuizzesResponse.data.filter(teamInQuiz => teamInQuiz.quiz.id == quizId);
                setTeamsInQuizzes(teamsForCurrentQuiz);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchQuiz();
    }, [quizId]);

    const handleQuestionSelection = (questionId) => {
        // Toggle the selected question
        setSelectedQuestions((prevSelected) =>
            prevSelected.includes(questionId)
                ? prevSelected.filter((id) => id !== questionId)
                : [...prevSelected, questionId]
        );
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            // Update the quiz details and selected questions
            await axios.put(`http://localhost:8000/api/quizzes/${quizId}`, {
                ...quiz,
                quiz_questions: selectedQuestions,
            });
            // Redirect or display success message
        } catch (error) {
            console.error("Error updating quiz:", error);
        }
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


    if (!quiz) {
        return <div>Loading...</div>;
    }

  return (
      <div className="container mt-5">
        <h2>Edit Quiz</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="quizName" className="form-label">Quiz Name</label>
            <input type="text" className="form-control" id="quizName" value={quiz.quiz_name}/>
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea className="form-control" id="description" rows="3" value={quiz.description}></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="category" className="form-label">Category ID</label>
            <input type="text" className="form-control" id="category" value={quiz.category_id}/>
          </div>
          <div className="mb-3">
            <label htmlFor="teamLimit" className="form-label">Team Limit</label>
            <input type="text" className="form-control" id="teamLimit" value={quiz.team_limit}/>
          </div>
          <div className="mb-3">
            <label htmlFor="quizDate" className="form-label">Quiz Date</label>
            <input type="date" className="form-control" id="quizDate" value={quiz.quiz_date}/>
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
          <div>
              <h3>Existing Questions</h3>
              <ul>
                  {getQuestionsForQuiz(quiz.id).map((question) => (
                      <li key={question.id}>{question.question}</li>
                  ))}
              </ul>
          </div>

          <div>
              <h3>Add New Question</h3>
              <select value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)}>
                  <option value="">Select a question</option>
                  {questions.map((question) => (
                <option key={question.id} value={question.id}>{question.question}</option>
            ))}
          </select>
          <button onClick={() => setNewQuestion("")}>Clear Selection</button>
          <button onClick={() => setNewQuestion("")}>Add Question</button>
        </div>
          <div>
              <h3>Registred Teams</h3>
                <ul>
                    {teamsInQuizzes.map((teamInQuiz) => (
                        <li key={teamInQuiz.id}>{teamInQuiz.team.team_name}</li>
                    ))}
                </ul>
          </div>
      </div>
  );
};

export default EditQuiz;