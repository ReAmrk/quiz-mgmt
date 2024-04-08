import React, { useState, useEffect } from "react";
import axios from "axios";
import {useLocation, useNavigate} from "react-router-dom";

const CreateNewQuestion = () => {
    const navigate = useNavigate()
    const location = useLocation();
    const [categories, setCategories] = useState([]);
    const [newQuestion, setNewQuestion] = useState({
        question: "",
        answer: "",
        points: "0",
        difficulty: "0",
        category_id: "1", // Set default category ID as string
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoriesResponse = await axios.get("http://localhost:8000/api/categories/", { withCredentials: true });
                setCategories(categoriesResponse.data);

                const searchParams = new URLSearchParams(location.search);
                const questionParam = searchParams.get("question");
                if (questionParam) {
                    // Update only the question property
                    setNewQuestion(prevQuestion => ({
                        ...prevQuestion,
                        question: decodeURIComponent(questionParam)
                    }));
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchData();
    }, [location]);

    const handleInputChange = (e, setter) => {
        setter(e.target.value);
    };

    const handleQuestionSubmit = async (e) => {
        e.preventDefault();

        try {
            // If new category is selected, first create the category
            let categoryId = newQuestion.category_id;
            if (newQuestion.newCategory) {
                const categoryResponse = await axios.post(
                    "http://localhost:8000/api/categories/",
                    {
                        category_name: newQuestion.newCategoryName,
                        description: newQuestion.newCategoryDescription,
                    },
                    { withCredentials: true }
                );
                categoryId = categoryResponse.data.id;
            }

            // Create the question using the selected or newly created category ID
            const response = await axios.post(
                "http://localhost:8000/api/questions/",
                {
                    question: newQuestion.question,
                    answer: newQuestion.answer,
                    points: newQuestion.points,
                    difficulty: newQuestion.difficulty,
                    category_id: String(categoryId),
                },
                { withCredentials: true }
            );

            // Handle successful submission here, e.g., display a success message
            console.log("Question created:", response.data);
            navigate("/");
        } catch (error) {
            console.error("Error creating question:", error);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center">Add a Question</h2>
            <form onSubmit={handleQuestionSubmit}>
                <div className="mb-3">
                    <label htmlFor="questionInput" className="form-label">Question:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="questionInput"
                        value={newQuestion.question}
                        onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="answerInput" className="form-label">Answer:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="answerInput"
                        value={newQuestion.answer}
                        onChange={(e) => setNewQuestion({...newQuestion, answer: e.target.value})}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="pointsInput" className="form-label">Points:</label>
                    <input
                        type="number"
                        className="form-control"
                        id="pointsInput"
                        value={newQuestion.points}
                        onChange={(e) => setNewQuestion({...newQuestion, points: e.target.value})}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="difficultyInput" className="form-label">Difficulty:</label>
                    <input
                        type="number"
                        className="form-control"
                        id="difficultyInput"
                        value={newQuestion.difficulty}
                        onChange={(e) => setNewQuestion({...newQuestion, difficulty: e.target.value})}
                    />
                </div>
<div className="mb-3">
                    <label htmlFor="categoryInput" className="form-label">Category:</label>
                    <select
                        className="form-select"
                        id="categoryInput"
                        value={newQuestion.category_id}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value === "new") {
                                // If 'New Category' is selected, set newCategory to true
                                setNewQuestion({
                                    ...newQuestion,
                                    category_id: "1",
                                    newCategory: true,
                                });
                            } else {
                                setNewQuestion({
                                    ...newQuestion,
                                    category_id: value,
                                    newCategory: false,
                                });
                            }
                        }}
                    >
                        <option value="">Select a category</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>{category.category_name}</option>
                        ))}
                        <option value="new">New Category</option>
                    </select>
                </div>

                {/* Conditional rendering for new category input fields */}
                {newQuestion.newCategory && (
                    <div>
                        <div className="mb-3">
                            <label htmlFor="newCategoryNameInput" className="form-label">Category Name:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="newCategoryNameInput"
                                value={newQuestion.newCategoryName}
                                onChange={(e) => setNewQuestion({ ...newQuestion, newCategoryName: e.target.value })}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="newCategoryDescriptionInput" className="form-label">Category Description:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="newCategoryDescriptionInput"
                                value={newQuestion.newCategoryDescription}
                                onChange={(e) => setNewQuestion({ ...newQuestion, newCategoryDescription: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                )}
                <button type="submit" className="btn btn-primary">Create Question</button>
            </form>
        </div>
    );
};

export default CreateNewQuestion;
