import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminPage = () => {
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [filterCategory, setFilterCategory] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [newCategory, setNewCategory] = useState({ category_name: "", description: "" });
  const [newQuestion, setNewQuestion] = useState({ question: "", answer: "", points: "0", difficulty: "0", category_id: "1" });

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

  const filteredCategories = categories.filter(category => !filterCategory || category.id === parseInt(filterCategory));
  const filteredQuestions = questions.filter(question => (
    (!filterCategory || question.category.id === parseInt(filterCategory)) &&
    (!searchKeyword ||
      question.question.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      question.answer.toLowerCase().includes(searchKeyword.toLowerCase()))
  ));

  return (
    <div className="container mt-5">
      <h2>Questions and Categories</h2>

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
              <li key={question.id} className="list-group-item">
                {question.question} || {question.answer}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
