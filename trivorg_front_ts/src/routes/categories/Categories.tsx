import React, { useContext, useEffect, useState } from "react";
import { CategoryService } from "../../services/CategoryService";
import { JwtContext } from "../Root";
import { useNavigate } from "react-router-dom";
import { ICategory } from "../../domain/ICategory";

const Categories = () => {
        const categoryService = new CategoryService();
        const { jwtResponse, setJwtResponse } = useContext(JwtContext);

        const [categories, setCategories] = useState([] as ICategory[]) // Update initial state to an empty array of type ICategory[]
        const [newCategoryName, setNewCategoryName] = useState('') // Update initial state to an empty string
        const [newCategoryDescription, setNewCategoryDescription] = useState('') // Update initial state to an empty string
        const [errorMessage, setErrorMessage] = useState("");
        const navigate = useNavigate();

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

        const deleteCategory = async (id: string) => {
            if (jwtResponse) {
                categoryService.delete(jwtResponse.access, id).then((response) => {
                    console.log(response);
                    setCategories(categories.filter((category) => category.id !== id));
                })
            }
        }

        const handleNewCategoryNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setNewCategoryName(e.target.value);
        }
        const handleNewCategoryDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setNewCategoryDescription(e.target.value);
        }

        const handleCreateCategory = async (e: React.ChangeEvent<HTMLFormElement>) => {
            e.preventDefault();

            const newCategory = {
                category_name: newCategoryName,
                description: newCategoryDescription
            };

            if (jwtResponse) {
                const response = await categoryService
                    .create(jwtResponse.access, newCategory)
                    .catch((error) => {
                        console.log("Error creating category: ", error);
                        setErrorMessage("Error creating category");
                    });

                if (response) {
                    setCategories([...categories, response]);
                    setNewCategoryName("");
                    setNewCategoryDescription("");
                }
            }
        }

    return (
        <>
        Categories {categories.length}
                <ul>
          {categories.map(category => (
            <li key={category.id}>{category.category_name} | <button onClick={() => deleteCategory(category.id!)}>Delete</button></li>
          ))}
        </ul>
        <br />
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        <form onSubmit={handleCreateCategory}>
        <label htmlFor="new-view-name">Category Name:</label>
            <input className="my-input-class" type="text" id="new-view-name" value={newCategoryName} onChange={handleNewCategoryNameChange} />
            <br />
            <label htmlFor="new-view-name">Category Description:</label>
            <input className="my-input-class" type="text" id="new-view-name" value={newCategoryDescription} onChange={handleNewCategoryDescriptionChange} />
            <br />
            <button type="submit">Add Category</button>
        </form>
        </>
    );

};
export default Categories;