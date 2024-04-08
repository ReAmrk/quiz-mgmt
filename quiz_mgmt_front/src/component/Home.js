import React, { useState, useEffect } from "react";
import axios from "axios";
import QuizResult from "./QuizResult";
import Quizzes from "./GetQuizzes";
import {useNavigate} from "react-router-dom";

export const Home = () => {
    const [message, setMessage] = useState('');
    const [newQuestion, setNewQuestion] = useState('');
    const navigate = useNavigate(); // useNavigate hook for navigation

    useEffect(() => {
        if (localStorage.getItem('access_token') === null) {
            window.location.href = '/login';
        } else {
            (async () => {
                try {
                    const { data } = await axios.get(
                        'http://localhost:8000/api/auth/home/',
                        {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }
                    );
                    setMessage(data.message);
                } catch (e) {
                    console.log('not auth');
                }
            })();
        }
    }, []);

    const handleAddQuestionClick = () => {
        // Forward to the create question page with the newQuestion as a URL parameter
        navigate(`/create-question?question=${encodeURIComponent(newQuestion)}`);
    };

    const handleQuestionChange = (e) => {
        setNewQuestion(e.target.value);
    };

    return (
        <div className="container mt-5">
            <h3 className="text-center">{message}</h3>
            <div className="row">
                <div className="col-md-6">
                    <QuizResult />
                </div>
                <div className="col-md-6">
                    <Quizzes />
                </div>
                <div className="text-center mt-3">
                    <div className="card d-inline-block">
                        <div className="card-body">
                            <input
                                type="text"
                                className="form-control mb-2"
                                placeholder="Quick add a question"
                                value={newQuestion}
                                onChange={handleQuestionChange}
                            />
                            <button
                                className="btn btn-primary"
                                onClick={handleAddQuestionClick}
                                disabled={!newQuestion.trim()}
                            >
                                Create Question
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
