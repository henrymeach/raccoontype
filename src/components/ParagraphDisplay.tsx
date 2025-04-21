import { TypedStatus } from "../enums/TypedStatus";
import '../App.css';
import clsx from 'clsx';
import { useEffect, useState } from "react";


type ParagraphDisplayProps = {
    paragraph: string;
    typedStatuses: string[];
    currentIndex: number;
    currentInput: string;
}

const ParagraphDisplay = ({ paragraph, typedStatuses, currentIndex, currentInput }: ParagraphDisplayProps) => {
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
        <div className={`${visible ? 'opacity-100' : 'opacity-0'} duration-100 min-w-full`}>
            <p>
                {renderParagraph({paragraph: displayedParagraph, typedStatuses, currentIndex, currentInput})}
            </p>
        </div>
    )
}

const renderParagraph = ({paragraph, typedStatuses, currentIndex, currentInput}: ParagraphDisplayProps) => {
    return (
        <div>
        {
            paragraph.split(' ').map((word, wordIndex) => (
                <span key={wordIndex} className={clsx('word',
                    typedStatuses[wordIndex] === TypedStatus.CORRECT ? 'correct-word' :
                    typedStatuses[wordIndex] === TypedStatus.INCORRECT ? 'incorrect-word' :
                    typedStatuses[wordIndex] === TypedStatus.TYPO ? 'typoed-word' :
                    'untyped-word'
                )}
                >
                    {word.split('').map((letter, letterIndex) => (
                        <span key={letterIndex} className={clsx(
                            '',
                            currentIndex === wordIndex && currentInput.length === letterIndex
                            ? 'underline underline-offset-8'
                            : ''
                        )}>
                            {letter}
                        </span>
                    ))}{' '}
                </span>
            ))
        }
        </div>
    )
}

export default ParagraphDisplay;