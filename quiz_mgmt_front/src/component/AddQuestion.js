import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminPage = () => {
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [filterCategory, setFilterCategory] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [newCategory, setNewCategory] = useState({
    category_name: "",
    category_description: "",
  });
  const [newQuestion, setNewQuestion] = useState({
    question_text: "",
    question_answer: "",
    question_points: 0,
    question_difficulty: 0,
    question_category: 1, // Set default category ID
  });

  const filteredCategories = filterCategory
  ? categories.filter(category => category.id === parseInt(filterCategory))
  : categories;

// Filtered questions based on the selected category filter and search keyword
  const filteredQuestions = questions
    .filter(question => {
      return (
        (!filterCategory || question.question_category === parseInt(filterCategory)) &&
        (!searchKeyword ||
          question.question_text.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          question.question_answer.toLowerCase().includes(searchKeyword.toLowerCase()))
      );
    });

  useEffect(() => {
    // Fetch categories and questions when the component mounts
    const fetchData = async () => {
      try {
        const categoriesResponse = await axios.get("http://localhost:8000/api/categories/");
        const questionsResponse = await axios.get("http://localhost:8000/api/questions/");

        setCategories(categoriesResponse.data);
        setQuestions(questionsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

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
        category_description: "",
      });
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8000/api/questions/",
        newQuestion,
        { withCredentials: true }
      );

      setQuestions([...questions, response.data]);
      setNewQuestion({
        question_text: "",
        question_answer: "",
        question_points: 0,
        question_difficulty: 0,
        question_category: 1,
      });
    } catch (error) {
      console.error("Error creating question:", error);
    }
  };

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
                value={newCategory.category_description}
                onChange={(e) => setNewCategory({...newCategory, category_description: e.target.value})}
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
                value={newQuestion.question_text}
                onChange={(e) => setNewQuestion({...newQuestion, question_text: e.target.value})}
            />
            <br/>
            <label>Answer:</label>
            <input
                type="text"
                value={newQuestion.question_answer}
                onChange={(e) => setNewQuestion({...newQuestion, question_answer: e.target.value})}
            />
            <br/>
            <label>Points:</label>
            <input
                type="number"
                value={newQuestion.question_points}
                onChange={(e) => setNewQuestion({...newQuestion, question_points: e.target.value})}
            />
            <br/>
            <label>Difficulty:</label>
            <input
                type="number"
                value={newQuestion.question_difficulty}
                onChange={(e) => setNewQuestion({...newQuestion, question_difficulty: e.target.value})}
            />
            <br/>
            <label>Category:</label>
            <select
                value={newQuestion.question_category}
                onChange={(e) => setNewQuestion({...newQuestion, question_category: e.target.value})}
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
            {categories.map(category => (
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

        // Render the filtered questions
        <h3>Filtered Questions</h3>
        <label>Search Questions:</label>
        <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <ul>
          {filteredQuestions.map(question => (
              <li key={question.id}>{question.question}</li>
          ))}
        </ul>
      </div>


  );
};

export default AdminPage;
