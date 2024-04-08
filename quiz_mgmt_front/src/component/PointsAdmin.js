import React, { useState, useEffect } from "react";
import axios from "axios";


const PointsInQuizzesPage = () => {

    const [teams, setTeams] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [points, setPoints] = useState([]);
    const [teamInQuiz, setTeamInQuiz] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState("");
    const [selectedQuiz, setSelectedQuiz] = useState("");
    const [pointsToAdd, setPointsToAdd] = useState(0);
    const [selectedTeamInQuiz, setSelectedTeamInQuiz] = useState({ teamId: "", quizId: "" });
    const [newTeamName, setNewTeamName] = useState("");


    useEffect(() => {
        const fetchData = async () => {
            try {
                const teamsResponse = await axios.get("http://localhost:8000/api/teams/");
                const quizzesResponse = await axios.get("http://localhost:8000/api/quizzes/");
                const pointsResponse = await axios.get("http://localhost:8000/api/points/");
                const teamsInQuizzes = await axios.get("http://localhost:8000/api/teams_in_quizzes/");
                setTeams(teamsResponse.data);
                setQuizzes(quizzesResponse.data);
                setPoints(pointsResponse.data);
                setTeamInQuiz(teamsInQuizzes.data);
            } catch (error) {
                console.error("Error fetching data:", error)
            }
        };
        fetchData();
    }, []);

    const handleAddTeamToQuiz = async () => {
        try {
          const response = await axios.post("http://localhost:8000/api/teams_in_quizzes/", {
            team_id: selectedTeam,
            quiz_id: selectedQuiz
          });
          console.log("Team added to quiz:", response.data);
          const teamsInQuizzesresponse = await axios.get("http://localhost:8000/api/teams_in_quizzes/")
          setTeamInQuiz(teamsInQuizzesresponse.data)
        } catch (error) {
          console.error("Error adding team to quiz:", error);
        }
      };

      const handleAddPoints = async () => {
        try {
          const response = await axios.post("http://localhost:8000/api/points/", {
            quiz_id: selectedTeamInQuiz.quizId,  
            team_id: selectedTeamInQuiz.teamId,
            points: pointsToAdd
          });
          console.log("Points added:", response.data);
          const pointsResponse = await axios.get("http://localhost:8000/api/points/")
          setPoints(pointsResponse.data)
        } catch (error) {
          console.error("Error adding points:", error);
        }
      };

      const handleAddNewTeam = async () => {
        try {
            const response = await axios.post("http://localhost:8000/api/teams/", {
                team_name: newTeamName
            });
            console.log("New team added:", response.data);
            // Update the list of teams after adding the new team
            setTeams([...teams, response.data]);
            // Clear the new team name input field
            setNewTeamName("");
            const teamResponse = await axios.get("http://localhost:8000/api/teams/")
            setTeams(teamResponse.data)
        } catch (error) {
            console.error("Error adding new team:", error);
        }
    };

      return (
        <div>
          <h1>Points in Quizzes Page</h1>
          <div>
                <h2>Add New Team</h2>
                <label>New Team Name:</label>
                <input
                    type="text"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                />
                <button onClick={handleAddNewTeam}>Add New Team</button>
            </div>


          <div>
            <h2>Add Team to Quiz</h2>
            <label>Select Team:</label>
            <select value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)}>
              <option value="">Select Team</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>{team.team_name}</option>
              ))}
            </select>
            <label>Select Quiz:</label>
            <select value={selectedQuiz} onChange={(e) => setSelectedQuiz(e.target.value)}>
              <option value="">Select Quiz</option>
              {quizzes.map((quiz) => (
                <option key={quiz.id} value={quiz.id}>{quiz.quiz_name}</option>
              ))}
            </select>
            <button onClick={handleAddTeamToQuiz}>Add Team to Quiz</button>
          </div>
          <div>
            <h2>Add Points to Team in Quiz</h2>
            <label>Select Team in Quiz:</label>
            <select value={`${selectedTeamInQuiz.teamId}-${selectedTeamInQuiz.quizId}`} onChange={(e) => {
                const [teamId, quizId] = e.target.value.split("-");
                setSelectedTeamInQuiz({ teamId, quizId });
                }}>
              <option value="">Select Team in Quiz</option>
              {teamInQuiz.map((teamInQuiz) => (
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

export default PointsInQuizzesPage