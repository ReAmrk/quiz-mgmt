import axios from "axios";
import {useState} from "react";


export const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const register = async () => {
        try {
            const {data} = await axios.post(
                'http://localhost:8000/api/auth/register/',
                {
                    username: username,
                    password1: password,
                    password2: password},
                {headers: {'Content-Type': 'application/json'}},
                {withCredentials: true}
            );
            setMessage(data.message);
            window.location.href = 'login/';
        } catch (e) {
            console.log('not auth')
        }
    };
    return (
        <div className="form-signin mt-5 text-center">
        <h1 className="h3 mb-3 fw-normal">Please register</h1>
        <input type="text" className="form-control" placeholder="Username"
               required={true} onChange={e => setUsername(e.target.value)}/>
        <input type="password" className="form-control" placeholder="Password"
               required={true} onChange={e => setPassword(e.target.value)}/>
        <button className="w-100 btn btn-lg btn-primary" type="submit"
                onClick={register}>Register
        </button>
        <p className="mt-5 mb-3 text-muted">{message}</p>
    </div>)
}