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
    const [selectedTeam, setSelectedTeam] = useState("");
    const [selectedTeamInQuiz, setSelectedTeamInQuiz] = useState({ teamId: "", quizId: "" });
    const [pointsToAdd, setPointsToAdd] = useState(0);
    const [teams, setTeams] = useState([]);
    const [teamPoints, setTeamPoints] = useState({});
    const [points, setPoints] = useState([]);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const quizResponse = await axios.get(`http://localhost:8000/api/quizzes/${quizId}`);
                const categoriesResponse = await axios.get("http://localhost:8000/api/categories/");
                const questionsResponse = await axios.get("http://localhost:8000/api/questions/");
                const questionsInQuizzesResponse = await axios.get(`http://localhost:8000/api/questions_in_quizzes/`);
                const teamsInQuizzesResponse = await axios.get(`http://localhost:8000/api/teams_in_quizzes/`);
                const teamsResponse = await axios.get(`http://localhost:8000/api/teams/`);
                const pointsResponse = await axios.get(`http://localhost:8000/api/points/`);

                setQuiz(quizResponse.data);
                setCategories(categoriesResponse.data);
                setQuestions(questionsResponse.data);
                setQuestionsInQuizzes(questionsInQuizzesResponse.data);
                const teamsForCurrentQuiz = teamsInQuizzesResponse.data.filter(teamInQuiz => teamInQuiz.quiz.id == quizId);
                setTeamsInQuizzes(teamsForCurrentQuiz);
                setTeams(teamsResponse.data);
                setPoints(pointsResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchQuiz();
    }, [quizId]);


    useEffect(() => {
        if (quizId && points.length > 0) {
            const quizPoints = points.filter(point => point.quiz.id === parseInt(quizId));
            const teamPointsData = {};
            teams.forEach(team => {
                const teamPoints = quizPoints.find(point => point.team.id === team.id);
                teamPointsData[`${team.id}-${quizId}`] = teamPoints ? teamPoints.points : 0; // If no points found, default to 0
            });
            setTeamPoints(teamPointsData);
        }
    }, [quizId, points, teams]);

    const handleAddTeamToQuiz = async () => {
        try {
            const response = await axios.post("http://localhost:8000/api/teams_in_quizzes/", {
                team_id: selectedTeam,
                quiz_id: quizId
            });
            console.log("Team added to quiz:", response.data);
            const teamsInQuizzesresponse = await axios.get("http://localhost:8000/api/teams_in_quizzes/")
            setTeamsInQuizzes(teamsInQuizzesresponse.data)
        } catch (error) {
            console.error("Error adding team to quiz:", error);
        }
    };

    const handleAddPoints = async () => {
        try {
            const response = await axios.post("http://localhost:8000/api/points/", {
                points: pointsToAdd,
                team_id: selectedTeamInQuiz.teamId,
                quiz_id: selectedTeamInQuiz.quizId
            });
            console.log("Points added:", response.data);
            // Update points state if needed
            const newTeamPoints = { ...teamPoints };
            newTeamPoints[`${selectedTeamInQuiz.teamId}-${selectedTeamInQuiz.quizId}`] += parseInt(pointsToAdd);
            setTeamPoints(newTeamPoints);

            const pointsResponse = await axios.get(`http://localhost:8000/api/points/`);
            const teamPointsData = {};
            // Iterate over each point in the data
            pointsResponse.data.forEach(point => {
                // Check if the point is for the correct quiz
                if (point.quiz.id == quizId) {
                    // Find the team corresponding to the point
                    const team = teams.find(team => team.id == point.team.id);
                    if (team) {
                        // Set the points for the team
                        teamPointsData[`${team.id}-${quizId}`] = point.points;
                    }
                }
            });
            // Update the state with the calculated team points
            setTeamPoints(teamPointsData);
        } catch (error) {
            console.error("Error adding points:", error);
        }
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

    const handleAddQuestion = async () => {
        try {
            await axios.post("http://localhost:8000/api/questions_in_quizzes/", {
                quiz_id: quizId,
                question_id: newQuestion
            });
            const questionsInQuizzesResponse = await axios.get(`http://localhost:8000/api/questions_in_quizzes/`);
            setQuestionsInQuizzes(questionsInQuizzesResponse.data);

        } catch (error) {
            console.error("Error adding question to quiz:", error);
        }
    }

    const handleDeleteQuestion = async (questionId) => {
        try {
            // Filter the questionsInQuizzes array to find the specific question for the current quiz
            console.log(questionsInQuizzes);
            const questionInQuiz = questionsInQuizzes.find(qiq => qiq.question.id == questionId && qiq.quiz.id == quizId);
            console.log(questionInQuiz);
            if (!questionInQuiz) {
                console.error("Question not found for the provided questionId and quizId:", questionId, quizId);
                return;
            }

            const questionInQuizId = questionInQuiz.id;

            console.log("Deleting question from quiz:", questionId, "QuestionInQuiz ID:", questionInQuizId);
            await axios.delete(`http://localhost:8000/api/questions_in_quizzes/${questionInQuizId}`);

            // After deletion, update the questionsInQuizzes array by refetching the data
            const updatedQuestionsInQuizzesResponse = await axios.get(`http://localhost:8000/api/questions_in_quizzes/`);
            setQuestionsInQuizzes(updatedQuestionsInQuizzesResponse.data);
        } catch (error) {
            console.error("Error deleting question from quiz:", error);
        }
    };


    const getQuestionsForQuiz = (quizId) => {
        const filteredQuestionsInQuiz = questionsInQuizzes.filter((qiq) => qiq.quiz.id === quizId)
        const newQuestions = filteredQuestionsInQuiz.map((qq) => qq.question);
        return newQuestions;
    };

    if (!quiz) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Edit Quiz</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="quizName" className="form-label">Quiz Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="quizName"
                        value={quiz.quiz_name}
                        onChange={(e) => setQuiz({...quiz, quiz_name: e.target.value})}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea
                        className="form-control"
                        id="description"
                        rows="3"
                        value={quiz.description}
                        onChange={(e) => setQuiz({...quiz, description: e.target.value})}
                    ></textarea>
                </div>
                <div className="mb-3">
                    <label htmlFor="category" className="form-label">Category</label>
                    <select
                        className="form-select"
                        id="category"
                        value={quiz.category_id}
                        onChange={(e) => setQuiz({...quiz, category_id: e.target.value})}
                    >
                        <option value="">Select a category</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>{category.category_name}</option>
                        ))}
                    </select>
                </div>


                <div className="mb-3">
                    <label htmlFor="teamLimit" className="form-label">Team Limit</label>
                    <input
                        type="text"
                        className="form-control"
                        id="teamLimit"
                        value={quiz.team_limit}
                        onChange={(e) => setQuiz({...quiz, team_limit: e.target.value})}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="quizDate" className="form-label">Quiz Date</label>
                    <input
                        type="date"
                        className="form-control"
                        id="quizDate"
                        value={quiz.quiz_date}
                        onChange={(e) => setQuiz({...quiz, quiz_date: e.target.value})}
                    />
                </div>

                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
            <div className="mt-4">
                <h3 className="mb-3">Existing Questions</h3>
                <ul className="list-group">
                    {getQuestionsForQuiz(quiz.id).map((question) => (
                        <li key={question.id}
                            className="list-group-item d-flex justify-content-between align-items-center">
                            {question.question}
                            <button className="btn btn-danger"
                                    onClick={() => handleDeleteQuestion(question.id)}>Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mt-4">
                <h3 className="mb-3">Add New Question</h3>
                <select className="form-select mb-3" value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)}>
                    <option value="">Select a question</option>
                    {questions.map((question) => (
                        <option key={question.id} value={question.id}>{question.question}</option>
                    ))}
                </select>
                <div>
                    <button className="btn btn-primary" onClick={handleAddQuestion}>Add Question</button>
                </div>
            </div>
            <div className="mt-4">
                <h3 className="mb-3">Registered Teams</h3>
                <ul className="list-group">
                    {teamsInQuizzes.map((teamInQuiz) => (
                        <li key={teamInQuiz.id} className="list-group-item d-flex justify-content-between align-items-center">
                            {teamInQuiz.team.team_name} - Points: {teamPoints[`${teamInQuiz.team.id}-${quizId}`]}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Add team to quiz section */}
            <div className="mt-4">
                <h3 className="mb-3">Add Team to Quiz</h3>
                <select className="form-select mb-3" value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)}>
                    <option value="">Select Team</option>
                    {teams.map((team) => (
                        <option key={team.id} value={team.id}>{team.team_name}</option>
                    ))}
                </select>
                <button className="btn btn-primary" onClick={handleAddTeamToQuiz}>Add Team to Quiz</button>
            </div>

            {/* Add points to team in quiz section */}
            <div className="mt-4">
                <h3 className="mb-3">Add Points to Team in Quiz</h3>
                <select className="form-select mb-3" value={`${selectedTeamInQuiz.teamId}-${selectedTeamInQuiz.quizId}`} onChange={(e) => {
                    const [teamId, quizId] = e.target.value.split("-");
                    setSelectedTeamInQuiz({ teamId, quizId });
                }}>
                    <option value="">Select Team in Quiz</option>
                    {teamsInQuizzes.map((teamInQuiz) => (
                        <option key={teamInQuiz.id} value={`${teamInQuiz.team.id}-${teamInQuiz.quiz.id}`}>{teamInQuiz.team.team_name} - {teamInQuiz.quiz.quiz_name}</option>
                    ))}
                </select>
                <div>
                    <label htmlFor="pointsToAdd" className="form-label me-2">Points to Add:</label>
                    <input type="number" id="pointsToAdd" className="form-control mb-3" value={pointsToAdd} onChange={(e) => setPointsToAdd(e.target.value)} />
                    <button className="btn btn-primary" onClick={handleAddPoints}>Add Points</button>
                </div>
            </div>
        </div>
    );
};

export default EditQuiz;
