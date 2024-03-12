import React, { useContext, useEffect, useState } from "react";
import { CategoryService } from "../../services/CategoryService";
import { JwtContext } from "../Root";
import { useNavigate } from "react-router-dom";
import { ICategory } from "../../domain/ICategory";
import { IQuestion } from "../../domain/IQuestion";
import {QuestionService} from "../../services/QuestionService";


const Questions = () => {
    const categoryService = new CategoryService();
    const questionService = new QuestionService();
    const { jwtResponse, setJwtResponse } = useContext(JwtContext);

    const [categories, setCategories] = useState([] as ICategory[])
    const [questions, setQuestions] = useState([] as IQuestion[])
    const [categoryId, setCategoryId]  = useState('None')
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [searchKeyword, setSearchKeyword] = useState("");


    const [newQuestion, setNewQuestion] = useState('')
    const [newAnswer, setNewAnswer] = useState('')
    const [newPoints, setNewPoints] = useState('')
    const [difficulty, setDifficulty] = useState('')

    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();


    useEffect(() => {
        if (jwtResponse) {
            questionService.getAll(jwtResponse.access).then((response) => {
                if (response) {
                    setQuestions(response);
                } else {
                    setQuestions([]);
                }
            });
        }
    }, [jwtResponse]);

    useEffect(() => {
        if (jwtResponse) {
            categoryService.getAll(jwtResponse.access).then((response) => {
                if (response) {
                    setCategories(response);
                } else {
                    setCategories([]);
                }
            });
        }
    }, [jwtResponse]);

    const deleteQuestion = async (id: string) => {
        if (jwtResponse) {
            questionService.delete(jwtResponse.access, id).then((response) => {
                console.log(response);
                setQuestions((prevQuestions) => prevQuestions.filter((question) => question.id !== id));
            })
        }
    }

    const filteredCategories = categories.filter((category) => !selectedCategory || category.id === selectedCategory);
    const filteredQuestions = questions.filter((question) => {
      return (
        (!selectedCategory || question.categoryId === selectedCategory) &&
        (!searchKeyword ||
          question.question.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          question.answer.toLowerCase().includes(searchKeyword.toLowerCase()))
      );
    });

    const handleCategoryIdChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCategoryId(e.target.value);
    }

    const handleNewQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewQuestion(e.target.value);
    }
    const handleNewAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewAnswer(e.target.value);
    }
    const handleNewPointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewPoints(e.target.value);
    }
    const handleDifficultyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDifficulty(e.target.value);
    }

    const handleCreateQuestion = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newQuestionData = {
            question: newQuestion,
            answer: newAnswer,
            points: newPoints,
            difficulty: difficulty,
            categoryId: categoryId
        };

        if (jwtResponse) {
            const response = await questionService
                .create(jwtResponse.access, newQuestionData)
                .catch((error) => {
                    console.log("Error creating question: ", error);
                    setErrorMessage("Error creating question");
                });

            if (response) {
                setQuestions([...questions, response]);
                setNewQuestion("");
                setNewAnswer("");
                setNewPoints("");
                setDifficulty("");
            }
        }
    }

        return (
            <div>
                <h1>Questions</h1>

                {/* Display error message if there is one */}
                {errorMessage && <p>{errorMessage}</p>}

                {/* Display form to create new question */}
                <form onSubmit={handleCreateQuestion}>
                    <input
                        type="text"
                        placeholder="Question"
                        value={newQuestion}
                        onChange={handleNewQuestionChange}
                    />
                    <input
                        type="text"
                        placeholder="Answer"
                        value={newAnswer}
                        onChange={handleNewAnswerChange}
                    />
                    <input
                        type="text"
                        placeholder="Points"
                        value={newPoints}
                        onChange={handleNewPointsChange}
                    />
                    <input
                        type="text"
                        placeholder="Difficulty"
                        value={difficulty}
                        onChange={handleDifficultyChange}
                    />
                    <button type="submit">Create Question</button>
                </form>


                {/* Display categories dropdown */}
                <label htmlFor="category-select">Select Category:</label>
                <select id="category-select" name="category-select" value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}>
                    <option value="All">All</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.category_name}</option>
                    ))}
                </select>


                <h3>Filtered Categories</h3>
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>
                            {category.category_name}
                        </option>
                    ))}
                </select>
                <ul>
                    {filteredCategories.map(category => (
                        <li key={category.id}>{category.category_name}</li>
                    ))}
                </ul>


                <h3>Filtered Questions</h3>
                <label>Search Questions:</label>
                <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                />
                <ul>
                    {filteredQuestions.map(question => (
                        <li key={question.id}>
                            {question.question} || {question.answer} ||{" "}
                        </li>
                    ))}
                </ul>

            </div>
        );

};
export default Questions;


