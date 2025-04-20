import { Outlet } from "react-router";


export default function Layout() {
    return (
        <div>
            <header className="fixed top-2 right-1/2 translate-x-1/2">
                <h1>
                    raccoontype
                </h1>
            </header>
            <main>
                <Outlet />
            </main>
        </div>
    )
}