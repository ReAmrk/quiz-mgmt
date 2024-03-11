import { useContext, useEffect, useState } from "react";
import { CategoryService } from "../../services/CategoryService";
import { JwtContext } from "../Root";
import { useNavigate } from "react-router-dom";
import { ICategory } from "../../domain/ICategory";

const Categories = () => {
        const categoryService = new CategoryService();
        const { jwtResponse, setJwtResponse } = useContext(JwtContext);

        const [categories, setCategories] = useState<ICategory[]>([]); // Update initial state to an empty array of type ICategory[]
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
        }, [jwtResponse, categoryService]);

        return (
            <div>
                <h1>Categories</h1>
                <button onClick={() => navigate('/categories/new')}>New Category</button>
                <table>
                    <thead>
                        <tr>
                            <th>Category Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) => (
                            <tr key={category.id}>
                                <td>{category.category_name}</td>
                                <td>
                                    <button onClick={() => navigate(`/categories/${category.id}`)}>Edit</button>
                                    <button onClick={() => navigate(`/categories/${category.id}/delete`)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
};
export default Categories;