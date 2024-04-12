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

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const quizResponse = await axios.get(`http://localhost:8000/api/quizzes/${quizId}`);
                const categoriesResponse = await axios.get("http://localhost:8000/api/categories/");
                const questionsResponse = await axios.get("http://localhost:8000/api/questions/");
                const questionsInQuizzesResponse = await axios.get(`http://localhost:8000/api/questions_in_quizzes/`);
                const teamsInQuizzesResponse = await axios.get(`http://localhost:8000/api/teams_in_quizzes/`);
                const teamsResponse = await axios.get(`http://localhost:8000/api/teams/`);

                setQuiz(quizResponse.data);
                setCategories(categoriesResponse.data);
                setQuestions(questionsResponse.data);
                setQuestionsInQuizzes(questionsInQuizzesResponse.data);
                const teamsForCurrentQuiz = teamsInQuizzesResponse.data.filter(teamInQuiz => teamInQuiz.quiz.id == quizId);
                setTeamsInQuizzes(teamsForCurrentQuiz);
                setTeams(teamsResponse.data);

                // Fetch points for each team in the selected quiz
                const teamPointsData = {};
                for (const teamInQuiz of teamsForCurrentQuiz) {
                    const response = await axios.get(`http://localhost:8000/api/points/`);
                    const points = response.data.length > 0 ? response.data[0].points : 0;
                    teamPointsData[`${teamInQuiz.team.id}-${teamInQuiz.quiz.id}`] = points;
                }
                setTeamPoints(teamPointsData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchQuiz();
    }, [quizId]);

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

    const handleQuestionSelection = (questionId) => {
        // Toggle the selected question
        setSelectedQuestions((prevSelected) =>
            prevSelected.includes(questionId)
                ? prevSelected.filter((id) => id !== questionId)
                : [...prevSelected, questionId]
        );
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

    const handleDeleteQuestion = async (questionInQuizId) => {
        try {
            await axios.delete(`http://localhost:8000/api/questions_in_quizzes/${questionInQuizId}`);
            const questionsInQuizzesResponse = await axios.get(`http://localhost:8000/api/questions_in_quizzes/`);
            setQuestionsInQuizzes(questionsInQuizzesResponse.data);
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
                <h3>Existing Questions</h3>
                <ul>
                    {getQuestionsForQuiz(quiz.id).map((question) => (
                        <li key={question.id}>
                            {question.question}
                            <button onClick={() => handleDeleteQuestion(question.questionInQuizId)}>Delete</button>
                        </li>
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
                <button onClick={handleAddQuestion}>Add Question</button>
            </div>
            <div>
                <h3>Registered Teams</h3>
                <ul>
                    {teamsInQuizzes.map((teamInQuiz) => (
                        <li key={teamInQuiz.id}>{teamInQuiz.team.team_name} - Points: {teamPoints[`${teamInQuiz.team.id}-${teamInQuiz.quiz.id}`]}</li>
                    ))}
                </ul>
            </div>

            {/* Add team to quiz section */}
            <div>
                <h3>Add Team to Quiz</h3>
                <select value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)}>
                    <option value="">Select Team</option>
                    {teams.map((team) => (
                        <option key={team.id} value={team.id}>{team.team_name}</option>
                    ))}
                </select>
                <button onClick={handleAddTeamToQuiz}>Add Team to Quiz</button>
            </div>

            {/* Add points to team in quiz section */}
            <div>
                <h3>Add Points to Team in Quiz</h3>
                <select value={`${selectedTeamInQuiz.teamId}-${selectedTeamInQuiz.quizId}`} onChange={(e) => {
                    const [teamId, quizId] = e.target.value.split("-");
                    setSelectedTeamInQuiz({ teamId, quizId });
                }}>
                    <option value="">Select Team in Quiz</option>
                    {teamsInQuizzes.map((teamInQuiz) => (
                        <option key={teamInQuiz.id} value={`${teamInQuiz.team.id}-${teamInQuiz.quiz.id}`}>{teamInQuiz.team.team_name} - {teamInQuiz.quiz.quiz_name}</option>
                    ))}
                </select>
                <label>Points to Add:</label>
                <input type="number" value={pointsToAdd} onChange={(e) => setPointsToAdd(e.target.value)} />
                <button onClick={handleAddPoints}>Add Points</button>
            </div>
        </div>
    );
};

export default EditQuiz;
