import { useContext } from "react";
import { Link } from "react-router-dom";
import { JwtContext } from "../Root";
import { jwtDecode } from "jwt-decode";

const Info = () => {
    const { jwtResponse, setJwtResponse } = useContext(JwtContext);

    return (
        <>
            <dl className="row">
                <dt className="col-sm-2">
                    jwt decoded
                </dt>
                <dd className="col-sm-10 text-break">
                    <pre>
                        {jwtResponse ? JSON.stringify(jwtDecode(jwtResponse?.access), null, 4) : "no jwt"}
                    </pre>
                </dd>

                <dt className="col-sm-2">
                    jwt
                </dt>
                <dd className="col-sm-10 text-break">
                    {jwtResponse?.access}
                </dd>
                <dt className="col-sm-2">
                    refreshToken
                </dt>
                <dd className="col-sm-10">
                    {jwtResponse?.refresh}
                </dd>
            </dl>
        </>
    );
}

export default Info;
