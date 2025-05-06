import { useLocation, useNavigate } from "react-router";
import { TypedStatus } from "../enums/TypedStatus";
import clsx from "clsx";
import Tooltip from "../components/Tooltip";
import { Keys } from "../enums/Keys";
import { useEffect, useState } from "react";
import { insertDataToLeaderboard } from "@/data/LeaderboardDataActions";
import { generateRandomRaccoonName } from "@/lib/GenerateRandomRaccoonName";
import FinishGraph from "@/components/FinishGraph";

export default function Finish() {
    const navigate = useNavigate();
    const location = useLocation();
    const [visible, setVisible] = useState<boolean>(false);
    const [submittedScore, setSubmittedScore] = useState<boolean>(false);
    const [raccoonName, setRaccoonName] = useState<string>('DefaultRaccoon');
    const { wpm, accuracy, accuracyPercentage, characters, duration, timestamps, typedWords, typedStatuses, paragraph } = location.state || {};

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

    useEffect(() => {
        const fetchRaccoonName = async () => {
            const name = await generateRandomRaccoonName();
            setRaccoonName(name);
        }

        fetchRaccoonName();
    }, []);

    function onSubmit({raw_wpm, accuracy}: {
        raw_wpm: number;
        accuracy: number;
    }) {
        if (!submittedScore) {
            setSubmittedScore(true);
            insertDataToLeaderboard({username: raccoonName, raw_wpm: raw_wpm, accuracy: accuracy});
        }
    }

    return (
        <div className={`${visible ? 'opacity-100' : 'opacity-0'} transition duration-200 flex flex-col space-y-20 my-20 md:my-40 items-center`}>
            <section className="flex flex-wrap space-x-5">
                {paragraph.split(' ').map((word: string, index: number) => (
                    <span key={index} className={clsx(
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
            <section className="grid grid-cols-2 space-y-12 md:space-y-0 md:grid-cols-5 w-full">
                <div className="flex flex-col items-center">
                    <span className="statistic">
                        {Math.round(wpm * (accuracyPercentage)) / 100}
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
                        {accuracyPercentage}%
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
            <div className="flex flex-col w-full items-center space-y-4">
                <div className="flex space-x-4">
                    <button onClick={() => navigate('/')} className='button relative flex space-x-3 group items-center cursor-pointer'>
                        <img src='/icons/arrow-back.svg' alt='Back arrow' />
                        <p>Return</p>
                        <Tooltip title="Shift + Enter" className='group-hover:opacity-100' />
                    </button>
                    <div className="relative">
                        <button disabled={submittedScore} onClick={() => onSubmit({raw_wpm: wpm, accuracy: accuracy})} className='relative button flex space-x-3 items-center disabled:opacity-20 cursor-pointer'>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1b1b1b"><path d="M360-720h80v-80h-80v80Zm160 0v-80h80v80h-80ZM360-400v-80h80v80h-80Zm320-160v-80h80v80h-80Zm0 160v-80h80v80h-80Zm-160 0v-80h80v80h-80Zm160-320v-80h80v80h-80Zm-240 80v-80h80v80h-80ZM200-160v-640h80v80h80v80h-80v80h80v80h-80v320h-80Zm400-320v-80h80v80h-80Zm-160 0v-80h80v80h-80Zm-80-80v-80h80v80h-80Zm160 0v-80h80v80h-80Zm80-80v-80h80v80h-80Z"/></svg>
                            <p>
                                {submittedScore ? 'Submitted' : 'Submit Score'}
                            </p>
                        </button>
                        <Tooltip title={`Submitted as ${raccoonName}`} className={`${submittedScore ? 'opacity-100' : 'opacity-0'} text-center`} />
                    </div>
                </div>
            </div>
            <section className="w-full">
                <FinishGraph timestamps={timestamps} words={paragraph.trim().split(' ')} typedWords={typedWords} />
            </section>
        </div>
    )
}