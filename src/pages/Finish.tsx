import { useLocation } from "react-router";

export default function Finish() {
    const location = useLocation();
    const { wpm } = location.state || {};

    return (
        <>
            <p>
                hello
            </p>
            <h1>
                {wpm}
            </h1>
        </>
    )
}