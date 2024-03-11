import 'jquery';
import 'popper.js';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

import './site.css'

import React from 'react';
import ReactDOM from 'react-dom/client';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

import Root from './routes/Root';
import ErrorPage from './routes/ErrorPage';
import Login from './routes/identity/Login';
import Register from './routes/identity/Register';
import Privacy from './routes/Privacy';
import Home from './routes/Home';
import Info from './routes/identity/Info';
import Categories from './routes/categories/Categories';


const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "info/",
                element: <Info />,
            },
            {
                path: "login/",
                element: <Login />,
            },
            {
                path: "register/",
                element: <Register />,
            },
            {
                path: "privacy/:id",
                element: <Privacy />,
            },
            {
                path: "categories/",
                element: <Categories />,
            }
        ]
    },

]);

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
