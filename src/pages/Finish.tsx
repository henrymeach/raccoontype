import { useLocation, useNavigate } from "react-router";
import { TypedStatus } from "../enums/TypedStatus";
import clsx from "clsx";
import Tooltip from "../components/Tooltip";
import { Keys } from "../enums/Keys";
import { useEffect, useState } from "react";

export default function Finish() {
    const navigate = useNavigate();
    const location = useLocation();
    const [visible, setVisible] = useState<boolean>(false);
    const { wpm, accuracy, characters, duration, typedWords, typedStatuses, paragraph } = location.state || {};

    useEffect(() => {
        const onKeyPress = (event: KeyboardEvent) => {
            if (event.shiftKey && event.key === Keys.ENTER) {
                navigate('/');
            };
        }

        document.addEventListener('keydown',
            onKeyPress
        );

        return () => {
            document.removeEventListener('keydown', onKeyPress);
        };
    }, [])

    useEffect(() => {
        setTimeout(() => setVisible(true), 200)
    }, []);

    return (
        <div className={`${visible ? 'opacity-100' : 'opacity-0'} transition duration-200 flex flex-col space-y-20 items-center`}>
            <section className="flex flex-wrap space-x-5">
                {paragraph.split(' ').map((word: string, index: number) => (
                    <span className={clsx(
                        'relative word',
                        typedStatuses[index] === TypedStatus.INCORRECT ? 'incorrect-word' :
                        typedStatuses[index] === TypedStatus.TYPO ? 'typoed-word' :
                        ''
                    )}>
                        {word}
                        {
                            typedStatuses[index] === TypedStatus.INCORRECT ?
                            (
                            <span className="!text-sm !font-normal absolute -top-2 right-1/2 translate-x-1/2 line-through">
                                {typedWords[index]}
                            </span>
                            ) :
                            null
                        }
                    </span>
                ))}
            </section>
            <section className="grid grid-cols-2 space-y-12 md:grid-cols-5 w-full">
                <div className="flex flex-col items-center">
                    <span className="statistic">
                        {Math.round(wpm * (accuracy)) / 100}
                    </span>
                    <span className="statistic-category">
                        wpm
                    </span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="statistic">
                        {wpm}
                    </span>
                    <span className="statistic-category">
                        raw wpm
                    </span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="statistic">
                        {accuracy}%
                    </span>
                    <span className="statistic-category">
                        accuracy
                    </span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="statistic">
                        {characters}
                    </span>
                    <span className="statistic-category">
                        characters
                    </span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="statistic">
                        {duration}
                    </span>
                    <span className="statistic-category">
                        seconds
                    </span>
                </div>
            </section>
            <button onClick={() => navigate('/')} className='button relative flex space-x-3 group'>
                <img src='/icons/arrow-back.svg' alt='Back arrow' />
                <p>Return</p>
                <Tooltip title="Shift + Enter" className='group-hover:opacity-100' />
            </button>
        </div>
    )
}