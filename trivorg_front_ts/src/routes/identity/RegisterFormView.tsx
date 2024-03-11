import { MouseEvent } from "react";
import { IRegisterData } from "../../dto/IRegisterData";

interface IProps {
    values: IRegisterData;

    validationErrors: string[];

    handleChange: (target: EventTarget & HTMLInputElement) => void;

    onSubmit: (event: MouseEvent) => void;

}

const RegisterFormView = (props: IProps) => {
    return (
        <form>
            <h2>Create a new account.</h2>
            <hr />
            
            <ul style={{'display': props.validationErrors.length == 0 ? 'none' : ''}}>
                <li>{props.validationErrors.length > 0 ? props.validationErrors[0] : ''}</li>
            </ul>

            <div className="form-floating mb-3">
                <input
                    onChange={(e) => props.handleChange(e.target)}
                    value={props.values.username}
                    className="form-control" autoComplete="username" aria-required="true" placeholder="username" type="username"
                    id="Input_Username" name="username" />
                <label htmlFor="Input_Username">Username</label>
            </div>
            <div className="form-floating mb-3">
                <input
                    onChange={(e) => props.handleChange(e.target)}
                    value={props.values.password}
                    className="form-control" autoComplete="new-password" aria-required="true" placeholder="password" type="password"
                    id="Input_Password" maxLength={100} name="password" />
                <label htmlFor="Input_Password">Password</label>
            </div>
            <div className="form-floating mb-3">
                <input
                    onChange={(e) => props.handleChange(e.target)}
                    value={props.values.confirmPassword}
                    className="form-control" autoComplete="new-password" aria-required="true" placeholder="password" type="password"
                    id="Input_ConfirmPassword" name="confirmPassword" />
                <label htmlFor="Input_ConfirmPassword">Confirm Password</label>
            </div>
            <div className="form-floating mb-3">
                <input
                    onChange={(e) => props.handleChange(e.target)}
                    value={props.values.firstName}
                    className="form-control" autoComplete="firstname" aria-required="true" placeholder="FirstName" type="text"
                    id="Input_FirstName" maxLength={128} name="firstName" />
                <label htmlFor="Input_FirstName">First name</label>
            </div>
            <div className="form-floating mb-3">
                <input
                    onChange={(e) => props.handleChange(e.target)}
                    value={props.values.lastName}
                    className="form-control" autoComplete="lastname" aria-required="true" placeholder="LastName" type="text"
                    id="Input_LastName" maxLength={128} name="lastName" />
                <label htmlFor="Input_LastName">Last name</label>
            </div>

            <button 
            onClick={(e) => props.onSubmit(e)}
            id="registerSubmit" className="w-100 btn btn-lg btn-primary" type="button">Register</button>

        </form>
    );
}

export default RegisterFormView;
