import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Quizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [teamsInQuizzes, setTeamsInQuizzes] = useState([]);

  useEffect(() => {
    // Fetch categories and questions when the component mounts
    const fetchData = async () => {
      try {
        const quizzesResponse = await axios.get("http://localhost:8000/api/quizzes/");
        const teamsInQuizzesResponse = await axios.get("http://localhost:8000/api/teams_in_quizzes/");
        const runningQuizzes = quizzesResponse.data
            .filter(quiz => !quiz.is_completed)
            .sort((a, b) => new Date(a.quiz_date) - new Date(b.quiz_date));
        setQuizzes(runningQuizzes);
        setTeamsInQuizzes(teamsInQuizzesResponse.data);
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

  const getNumberOfTeams = (quizId) => {
    // Filter teamsInQuizzes for the current quizId and count the number of teams
    return teamsInQuizzes.filter(team => team.quiz.id === quizId).length;
  };

  const nextFiveQuizzes = quizzes.slice(0, 5);


  return (
    <div className="d-flex flex-column flex-md-row p-4 gap-4 py-md-5 align-items-center justify-content-left">
      <div className="list-group">
        <h3>Upcoming Quizzes</h3>
        {nextFiveQuizzes.map((quiz) => (
            <Link to={`/edit/${quiz.id}`} className="list-group-item list-group-item-action d-flex gap-3 py-3"
                  key={quiz.id}>
              <img src="https://cdn-icons-png.freepik.com/512/5692/5692030.png" alt="twbs" width="32" height="32"
                   className="rounded-circle flex-shrink-0"/>
              <div className="d-flex gap-2 w-100 justify-content-between">
                <div>
                  <h6 className="mb-0">{quiz.quiz_name}</h6>
                  <p className="mb-0 opacity-75">Number of teams: {getNumberOfTeams(quiz.id)}/{quiz.team_limit}</p>
                  <p className="mb-0 opacity-75">Quiz Date: {formatDate(quiz.quiz_date)}</p>
                </div>
              </div>
            </Link>
        ))}
        <button
            className="btn btn-primary d-inline-flex align-items-center"
            type="button"
            onClick={() => window.location.href = "/create-quiz"}
        >
          Create Quiz
        </button>
        <button
            className="btn btn-primary d-inline-flex align-items-center"
            type="button"
            onClick={() => window.location.href = "#"}
          >
          View All
        </button>
      </div>
    </div>

  );

};

export default Quizzes;