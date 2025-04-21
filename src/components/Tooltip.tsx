export default function Tooltip({title, className}: {
    title: string;
    className?: string;
}) {
    return (
        <div className={`${className} opacity-0 pointer-events-none transition absolute text-sm bottom-[105%] right-1/2 translate-x-1/2 px-3 py-2 w-[95%] rounded bg-[rgb(230,230,230)] group-hover:opacity-100 group-active:opacity-100`}>
            {title}
            <div className="absolute w-3 h-3 bg-[rgb(230,230,230)] right-1/2 translate-x-1/2 rotate-45" />
        </div>
    )
}