import React, { useState, useEffect } from "react";
import axios from "axios";

const QuizResult = () => {
    const [teams, setTeams] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [points, setPoints] = useState([]);
    const [teamInQuiz, setTeamInQuiz] = useState([]);
    const [selectedQuiz, setSelectedQuiz] = useState("");
    const [quizResults, setQuizResults] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const teamsResponse = await axios.get("http://localhost:8000/api/teams/");
                const quizzesResponse = await axios.get("http://localhost:8000/api/quizzes/");
                const pointsResponse = await axios.get("http://localhost:8000/api/points/");
                const teamsInQuizzes = await axios.get("http://localhost:8000/api/teams_in_quizzes/");
                const completedQuizzes = quizzesResponse.data.filter(quiz => quiz.is_completed);

                const selectedTeams = selectedQuiz ?
                    teamsInQuizzes.data
                        .filter(teamInQuiz => teamInQuiz.quiz.id === parseInt(selectedQuiz))
                        .map(teamInQuiz => teamInQuiz.team) :
                    [];
                setTeams(selectedTeams);
                setQuizzes(completedQuizzes);
                setPoints(pointsResponse.data);
                setTeamInQuiz(teamsInQuizzes.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [selectedQuiz]);

    useEffect(() => {
        if (selectedQuiz && points.length > 0) {
            const quizPoints = points.filter(point => point.quiz.id === parseInt(selectedQuiz));
            const results = [];
            teams.forEach(team => {
                const teamPoints = quizPoints.filter(point => point.team.id === team.id);
                const totalPoints = teamPoints.reduce((acc, curr) => acc + curr.points, 0);
                results.push({ teamName: team.team_name, points: totalPoints });
            });
            results.sort((a, b) => b.points - a.points);
            setQuizResults(results);
        }
    }, [selectedQuiz, points, teams]);

        return (
        <div className="container mt-5">
            <div className="row justify-content-end">
                <div className="col-md-6">
                    <h2>Quiz Results</h2>
                    <div>
                        <h4>Select Quiz:</h4>
                        <select value={selectedQuiz} onChange={(e) => setSelectedQuiz(e.target.value)}>
                            <option value="">Select Quiz</option>
                            {quizzes.map((quiz) => (
                                <option key={quiz.id} value={quiz.id}>{quiz.quiz_name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            {selectedQuiz && (
                <div className="row justify-content-end">
                    <div className="col-md-6">
                        <div>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Team Name</th>
                                        <th>Points</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {quizResults.map((result, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{result.teamName}</td>
                                            <td>{result.points}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuizResult;
