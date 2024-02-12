import { Link, Outlet } from "react-router-dom";

function AuthLayout() {
    return (
        <>
            {/* <div>Auth Layout</div>
            <Link to="/">Login</Link> | <Link to="/register">Register</Link> */}

            <Outlet></Outlet>
        </>
    )
}

export default AuthLayout;