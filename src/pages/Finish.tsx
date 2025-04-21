import { useLocation, useNavigate } from "react-router";
import { TypedStatus } from "../enums/TypedStatus";
import clsx from "clsx";
import Tooltip from "../components/Tooltip";
import { Keys } from "../enums/Keys";
import { useEffect } from "react";

export default function Finish() {
    const navigate = useNavigate();
    const location = useLocation();
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

    

    return (
        <>
            <div className="flex flex-col space-y-20 items-center" onKeyDown={(e: React.KeyboardEvent) => onKeyPress(e)}>
                <section className="flex flex-wrap space-x-5">
                    {paragraph.split(' ').map((word: string, index: number) => (
                        <span className={clsx(
                            'relative word !text-3xl/16',
                            typedStatuses[index] === TypedStatus.INCORRECT ? 'incorrect-word' :
                            typedStatuses[index] === TypedStatus.TYPO ? 'typoed-word' :
                            ''
                        )}>
                            {word}
                            {
                                typedStatuses[index] === TypedStatus.INCORRECT ?
                                (
                                <span className="!text-lg absolute -top-2 right-1/2 translate-x-1/2 line-through">
                                    {typedWords[index]}
                                </span>
                                ) :
                                null
                            }
                        </span>
                    ))}
                </section>
                <section className="grid grid-cols-5 w-full">
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
        </>
    )
}