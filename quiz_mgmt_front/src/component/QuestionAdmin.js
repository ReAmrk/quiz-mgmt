import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const AdminPage = () => {
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [filterCategory, setFilterCategory] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [newCategory, setNewCategory] = useState({ category_name: "", description: "" });
  const [newQuestion, setNewQuestion] = useState({ question: "", answer: "", points: "0", difficulty: "0", category_id: "1" });
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesResponse = await axios.get("http://localhost:8000/api/categories/", { withCredentials: true });
        const questionsResponse = await axios.get("http://localhost:8000/api/questions/", { withCredentials: true });

        setCategories(categoriesResponse.data);
        setQuestions(questionsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const deleteCategory = async (categoryId) => {
    try {
      const response = await axios.delete(`http://localhost:8000/api/categories/${categoryId}`);
      const { success, message } = response.data;
      if (!success) {
        setErrorMessage(message);
      } else {
        // After deletion, fetch and update the categories list
        const categoriesResponse = await axios.get("http://localhost:8000/api/categories/", { withCredentials: true });
        setCategories(categoriesResponse.data);
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const deleteQuestion = async (questionId) => {
    try {
      await axios.delete(`http://localhost:8000/api/questions/${questionId}`);
      // After deletion, fetch and update the questions list
      const questionsResponse = await axios.get("http://localhost:8000/api/questions/", { withCredentials: true });
      setQuestions(questionsResponse.data);
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  const filteredCategories = categories.filter(category => !filterCategory || category.id === parseInt(filterCategory));
  const filteredQuestions = questions.filter(question => (
    (!filterCategory || question.category.id === parseInt(filterCategory)) &&
    (!searchKeyword ||
      question.question.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      question.answer.toLowerCase().includes(searchKeyword.toLowerCase()))
  ));

  return (
      <div className="container mt-5">
        {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
        )}
        <h2>Questions and Categories</h2>
        <button
            className="btn btn-primary d-inline-flex align-items-center"
            type="button"
            onClick={() => window.location.href = "/create-question"}
        >
          Create Question
        </button>
        <div className="row">
          <div className="col-md-6 mb-3">
            <select
                className="form-select mb-3"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                  <option key={category.id} value={category.id.toString()}>
                    {category.category_name}
                  </option>
              ))}
            </select>
            <ul className="list-group">
              {filteredCategories.map(category => (
                  <li key={category.id} className="list-group-item d-flex justify-content-between align-items-center">
                    {category.category_name}
                    <div>
                      <Link to={`/edit-category/${category.id}`} className="btn btn-primary me-2">
                        Edit
                      </Link>
                      <button
                          className="btn btn-danger"
                          onClick={() => deleteCategory(category.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
              ))}
            </ul>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Search Questions:</label>
            <input
                type="text"
                className="form-control mb-3"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <ul className="list-group">
              {filteredQuestions.map(question => (
                  <li key={question.id} className="list-group-item d-flex justify-content-between align-items-center">
                    {question.question} || {question.answer}
                    <div>
                      <Link to={`/edit-question/${question.id}`} className="btn btn-primary me-2">
                        Edit
                      </Link>
                      <button
                          className="btn btn-danger"
                          onClick={() => deleteQuestion(question.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
  );
};

export default AdminPage;
