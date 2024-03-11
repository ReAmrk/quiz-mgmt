import { Link } from "react-router-dom"

const Footer = () => {
    return (
        <footer className="border-top footer text-muted">
            <div className="container">
                &copy; 2023 - WebApp - <Link to="privacy/footer">Privacy</Link>
            </div>
        </footer>
    );
}

export default Footer;
