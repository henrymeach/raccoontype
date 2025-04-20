export default function Tooltip({title, className}: {
    title: string;
    className?: string;
}) {
    return (
        <div className={`${className} opacity-0 transition absolute text-sm -top-10 px-3 py-2 rounded bg-[rgb(230,230,230)]`}>
            {title}
            <div className="absolute w-3 h-3 bg-[rgb(230,230,230)] right-1/2 translate-x-1/2 rotate-45" />
        </div>
    )
}