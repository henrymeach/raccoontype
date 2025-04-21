import { Link, Outlet } from "react-router";
import '../App.css';

export default function Layout() {
    const year = new Date().getFullYear();

    return (
        <div className="relative min-h-[100vh] flex flex-col">
            <header className="mt-8 flex justify-center">
                <Link to='/' className="flex flex-row items-center group">
                    <div className="rounded outline-2 outline-[#e6e6e6] -outline-offset-2 w-8 h-8 flex items-center justify-center group-hover:scale-110 group-active:scale-90">
                        <h1 className="title text-3xl">
                            R
                        </h1>
                    </div>
                    <h1 className="title text-3xl">
                        accoon_Type
                    </h1>
                </Link>
            </header>
            <main className="px-[4%] md:px-[10%] my-auto">
                <Outlet />
            </main>
            <footer className="text-center mb-4 statistic-category">
                © {year} — Henry Meach
            </footer>
        </div>
    )
}