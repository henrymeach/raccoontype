import { TypedStatus } from "../enums/TypedStatus";
import '../App.css';
import clsx from 'clsx';
import { useEffect, useState } from "react";


type ParagraphDisplayProps = {
    paragraph: string;
    typedStatuses: string[];
    currentIndex: number;
    currentInput: string;
    focused: boolean;
    onClick?: () => void;
}

const ParagraphDisplay = ({ paragraph, typedStatuses, currentIndex, currentInput, focused, onClick }: ParagraphDisplayProps) => {
    const [visible, setVisible] = useState<boolean>(true);
    const [displayedParagraph, setDisplayedParagraph] = useState<string>(paragraph);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDisplayedParagraph(paragraph);
            setVisible(true);
        }, 100)
        

        return () => {
            setVisible(false);
            clearTimeout(timeout);
        };
    }, [paragraph]);

    return (
        <div className={`${visible ? 'opacity-100' : 'opacity-0'} duration-100 min-w-full`} onClick={onClick}>
            {renderParagraph({paragraph: displayedParagraph, typedStatuses, currentIndex, currentInput, focused})}
        </div>
    )
}

const renderParagraph = ({paragraph, typedStatuses, currentIndex, currentInput, focused}: ParagraphDisplayProps) => {
    return (
        <div className="relative">
        {
            paragraph.split(' ').map((word, wordIndex) => (
                <span key={wordIndex} className={clsx(`word duration-500 ${focused ? '' : 'blur-xs'}`,
                    typedStatuses[wordIndex] === TypedStatus.CORRECT ? 'correct-word' :
                    typedStatuses[wordIndex] === TypedStatus.INCORRECT ? 'incorrect-word' :
                    typedStatuses[wordIndex] === TypedStatus.TYPO ? 'typoed-word' :
                    'untyped-word'
                )}
                >
                    {word.split('').map((letter, letterIndex) => (
                        <span key={letterIndex} className={clsx(
                            '',
                            currentIndex === wordIndex && currentInput.length === letterIndex ?
                            'underline underline-offset-8' :
                            ''
                            
                        )}>
                            {letter}
                        </span>
                    ))}{' '}
                </span>
            ))
        }
        <p className={`${focused ? 'opacity-0' : 'opacity-100'} transition duration-1000 absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 click-to-focus`}>Click here to focus</p>
        </div>
    )
}

export default ParagraphDisplay;