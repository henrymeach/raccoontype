import { Link, Outlet } from "react-router";
import '../App.css';

export default function Layout() {
    return (
        <div>
            <header className="fixed top-2 right-1/2 translate-x-1/2">
                <Link to='/'>
                    <h1 className="title text-3xl text-white">
                        raccoon_type
                    </h1>
                </Link>
            </header>
            <main>
                <Outlet />
            </main>
        </div>
    )
}