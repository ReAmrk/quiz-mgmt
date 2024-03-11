import { MouseEvent, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IRegisterData } from "../../dto/IRegisterData";
import { IdentityService } from "../../services/IdentityService";
import { JwtContext } from "../Root";
import RegisterFormView from "./RegisterFormView";

const Register = () => {
    const navigate = useNavigate();

    const [values, setInput] = useState({
        password: "",
        confirmPassword: "",
        username: "",
        firstName: "",
        lastName: "",
    } as IRegisterData);

    const [validationErrors, setValidationErrors] = useState([] as string[]);

    const handleChange = (target: EventTarget & HTMLInputElement) => {
        // debugger;
        // console.log(target.name, target.value, target.type)

        setInput({ ...values, [target.name]: target.value });
    }

    const {jwtResponse, setJwtResponse} = useContext(JwtContext);

    const identityService = new IdentityService();

    const onSubmit = async (event: MouseEvent) => {
        console.log('onSubmit', event);
        event.preventDefault();

        if (values.firstName.length === 0) {
            setValidationErrors(["First name is required"]);
            return;
        }
        
        if (values.lastName.length === 0) {
            setValidationErrors(["Last name is required"]);
            return;
        }
        
        if (values.username.length === 0) {
            setValidationErrors(["Username is required"]);
            return;
        }
        
        if (values.password.length === 0) {
            setValidationErrors(["Password is required"]);
            return;
        }
        
        if (values.password !== values.confirmPassword) {
            setValidationErrors(["Passwords do not match"]);
            return;
        }
        // remove errors
        setValidationErrors([]);

        var jwtData = await identityService.register(values);

        if (!jwtData) {
            setValidationErrors(["Registration failed. Please try again."]);
            return;
        }

        if (setJwtResponse){
            setJwtResponse(jwtData);
            navigate("/");
       }

    }

    return (
        <RegisterFormView values={values} handleChange={handleChange} onSubmit={onSubmit} validationErrors={validationErrors} />
    );
}

export default Register;
