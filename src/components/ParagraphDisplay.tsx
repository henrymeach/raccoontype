import { TypedStatus } from "../enums/TypedStatus";
import '../App.css';
import clsx from 'clsx';
import UnderscoreCaret from "./UnderscoreCaret";


type ParagraphDisplayProps = {
    paragraph: string;
    typedStatuses: string[];
    currentIndex: number;
    currentInput: string;
}

const ParagraphDisplay = ({ paragraph, typedStatuses, currentIndex, currentInput }: ParagraphDisplayProps) => {
    return (
        <div>
            <p>
                {renderParagraph({paragraph, typedStatuses, currentIndex, currentInput})}
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
                        <span key={letterIndex} className={'relative'}>
                            {letter}
                            <UnderscoreCaret
                                className={clsx(
                                '',
                                currentIndex === wordIndex && letterIndex === currentInput.length
                                    ? 'absolute transition left-0 -bottom-[2px]'
                                    : 'hidden'
                                )}
                            />
                        </span>
                    ))}{' '}
                </span>
            ))
        }
        </div>
    )
}

export default ParagraphDisplay;