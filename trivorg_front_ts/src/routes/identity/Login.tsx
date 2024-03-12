import {MouseEvent, useContext, useEffect, useState} from "react";
import { ILoginData } from "../../dto/ILoginData";
import { IdentityService } from "../../services/IdentityService";
import { JwtContext } from "../Root";
import LoginFormView from "./LoginFormView";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
    const navigate = useNavigate();
    const { jwtResponse, setJwtResponse } = useContext(JwtContext);

    const [values, setInput] = useState({
        username: "",
        password: "",
    } as ILoginData);

    const [validationErrors, setValidationErrors] = useState([] as string[]);

    const identityService = new IdentityService();
    const refreshToken = async () => {
        // Check for refresh token in storage
        const refresh_token = localStorage.getItem("refresh");

        if (refresh_token) {
            const refreshedJwtData = await identityService.refreshToken({
                refresh: refresh_token,
            });

            if (refreshedJwtData) {
                setJwtResponse?.(refreshedJwtData);
            } else {
                // Handle refresh token failure (e.g., redirect to login)
                navigate("/login");
            }
        }
    };

    useEffect(() => {
        refreshToken();
    }, []); // Run only once during component initialization


    const handleChange = (target: EventTarget & HTMLInputElement) => {
        // debugger;
        // console.log(target.name, target.value, target.type)

        setInput({ ...values, [target.name]: target.value });
    }

    const onSubmit = async (event: MouseEvent) => {
        console.log('onSubmit', event);
        event.preventDefault();

        if (values.username.length == 0 || values.password.length == 0) {
            setValidationErrors(["Bad input values!"]);
            return;
        }
        // remove errors
        setValidationErrors([]);

        const jwtData = await identityService.login(values);


        if (jwtData == undefined) {
            // TODO: get error info
            setValidationErrors(["no jwt"]);
            return;
        }
        localStorage.clear()
        localStorage.setItem("access", jwtData.access);
        localStorage.setItem("refresh", jwtData.refresh);

        axios.defaults.headers.common['Authorization'] = `Bearer ${jwtData.access}`;

        if (setJwtResponse){
             setJwtResponse(jwtData);
             navigate("/");
        }
    }

    return (
        <LoginFormView values={values} handleChange={handleChange} onSubmit={onSubmit} validationErrors={validationErrors} />
    );
}

export default Login;
