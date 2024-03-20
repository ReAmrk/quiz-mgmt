import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminPage = () => {
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [filterCategory, setFilterCategory] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [newCategory, setNewCategory] = useState({
    category_name: "",
    description: "",
  });
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    answer: "",
    points: "0",
    difficulty: "0",
    category_id: "1", // Set default category ID as string
  });

  useEffect(() => {
    // Fetch categories and questions when the component mounts
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

  const handleInputChange = (e, setter) => {
    setter(e.target.value);
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8000/api/categories/",
        newCategory,
        { withCredentials: true }
      );

      setCategories([...categories, response.data]);
      setNewCategory({
        category_name: "",
        description: "",
      });
      const categoriesResponse = await axios.get("http://localhost:8000/api/categories/");
      setCategories(categoriesResponse.data);
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

const handleQuestionSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post(
      "http://localhost:8000/api/questions/",
      {
        question: newQuestion.question,
        answer: newQuestion.answer,
        points: newQuestion.points,
        difficulty: newQuestion.difficulty,
        category_id: newQuestion.category_id,
      },
      { withCredentials: true }
    );

    setQuestions([...questions, response.data]);
    setNewQuestion({
      question: "",
      answer: "",
      points: "0",
      difficulty: "0",
      category_id: "1",
    });
    const questionResponse = await axios.get("http://localhost:8000/api/questions/");
    setQuestions(questionResponse.data);
  } catch (error) {
    console.error("Error creating question:", error);
  }
};

  const filteredCategories = categories.filter(category => !filterCategory || category.id === parseInt(filterCategory));
  const filteredQuestions = questions.filter(question => {
    return (
        (!filterCategory || question.category.id === parseInt(filterCategory)) &&
        (!searchKeyword ||
            question.question.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            question.answer.toLowerCase().includes(searchKeyword.toLowerCase()))
    );
});

  return (
    <div>
      <h2>Admin Page</h2>

      <div>
          <h3>Create Category</h3>
          <form onSubmit={handleCategorySubmit}>
            <label>Name:</label>
            <input
                type="text"
                value={newCategory.category_name}
                onChange={(e) => setNewCategory({...newCategory, category_name: e.target.value})}
            />
            <br/>
            <label>Description:</label>
            <input
                type="text"
                value={newCategory.description}
                onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
            />
            <br/>
            <button type="submit">Create Category</button>
          </form>
        </div>

        <div>
          <h3>Create Question</h3>
          <form onSubmit={handleQuestionSubmit}>
            <label>Text:</label>
            <input
                type="text"
                value={newQuestion.question}
                onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})}
            />
            <br/>
            <label>Answer:</label>
            <input
                type="text"
                value={newQuestion.answer}
                onChange={(e) => setNewQuestion({...newQuestion, answer: e.target.value})}
            />
            <br/>
            <label>Points:</label>
            <input
                type="number"
                value={newQuestion.points}
                onChange={(e) => setNewQuestion({...newQuestion, points: e.target.value})}
            />
            <br/>
            <label>Difficulty:</label>
            <input
                type="number"
                value={newQuestion.difficulty}
                onChange={(e) => setNewQuestion({...newQuestion, difficulty: e.target.value})}
            />
            <br/>
            <label>Category:</label>
            <select
                value={newQuestion.category_id}
                onChange={(e) => setNewQuestion({...newQuestion, category_id: e.target.value})}
            >
              {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.category_name}
                  </option>
              ))}
            </select>
            <br/>
            <button type="submit">Create Question</button>
          </form>
        </div>

      <div>
        <h3>Categories</h3>
        <ul>
          {filteredCategories.map(category => (
            <li key={category.id}>{category.category_name}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Questions</h3>
        <ul>
          {questions.map(question => (
            <li key={question.id}>{question.question}</li>
          ))}
        </ul>
      </div>

      <h3>Filtered Categories</h3>
      <select
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

export default AdminPage;
