import { useEffect, useState } from 'react'
import './App.css'
import ParagraphDisplay from './components/ParagraphDisplay';
import { Keys } from './enums/Keys';
import { TypedStatus } from './enums/TypedStatus';

function App() {

  // The user's current text input
  const [textInput, setTextInput] = useState<string>('');

  // The list of available words that can be randomly generated in the paragraph
  const [words, setWords] = useState<string[]>([]);

  // The randomly generated paragraph
  const [paragraph, setParagraph] = useState<string>('');

  // The index of the current word to type
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  let currentWord = paragraph.split(' ')[currentWordIndex];

  // The index of the current letter in the current word to type
  const [currentLetterIndex, setCurrentLetterIndex] = useState<number>(0);

  // Check if user made a typo on the current word
  const [hadTypo, setHadTypo] = useState<boolean>(false);

  // Track words that were typed correctly, typo'd, or incorrectly
  const [typedStatusList, setTypedStatusList] = useState<string[]>([]);

  // has the user started typing the paragraph?
  const [started, setStarted] = useState<boolean>(false);

  // Fetch the available words
  useEffect(() => {
    fetch('/words/google-10000-english-no-swears.txt')
      .then(res => res.text())
      .then(text => {
        setWords(text.split('\n').map(w => w.trim()).filter(Boolean));
      })
  }, [])

  // Initial set up of paragraph
  useEffect(() => {
    if (words.length > 0) {
      onReset();
    };
  }, [words]);

  useEffect(() => {
    setCurrentLetterIndex(textInput.length);
  }, [textInput])

  // Reset paragraph to new paragraph
  const onReset = () => {
    const PARAGRAPH_LENGTH = 32;
    const MOST_COMMON_WORDS_RANGE = 1000;

    function getRandomInt(min: number, max: number): number {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }

    let newParagraph = '';
    for (let _ = 0; _ < PARAGRAPH_LENGTH; _++) {
      newParagraph += words[getRandomInt(0, MOST_COMMON_WORDS_RANGE)] + ' ';
    };

    setParagraph(newParagraph);
    setTypedStatusList(new Array(PARAGRAPH_LENGTH).fill(TypedStatus.UNTYPED));
  }

  function onWordCompletion(wordInput: string) {

    // change status list
    const newTypedStatusList = typedStatusList;
    
    if (hadTypo) {
      newTypedStatusList[currentWordIndex] = TypedStatus.TYPO;
    }
    else if (wordInput.trim() === currentWord) {
      newTypedStatusList[currentWordIndex] = TypedStatus.CORRECT;
    } 
    else {
      newTypedStatusList[currentWordIndex] = TypedStatus.INCORRECT;
    }

    // set new status list
    setTypedStatusList(newTypedStatusList);

    // new word, set had typo to false
    setHadTypo(false);

    // set text input back to blank
    setTextInput('');

    // move to next word index
    setCurrentWordIndex(currentWordIndex + 1);
  }

  function onKeyPress(e: React.KeyboardEvent) {

    // if key press is character
    if (e.key.length === 1) {
      setTextInput(textInput + e.key);
      console.log(currentLetterIndex);
    }

    // word is typo'd if key doesn't match the correct next letter
    if (e.key !== currentWord[currentLetterIndex]) {
      setHadTypo(true);
    }

    // handle backspace, space, etc.
    if (e.ctrlKey && e.key === Keys.BACKSPACE) {
      setTextInput('');
    }
    else if (e.key === Keys.SPACE) {
      onWordCompletion(textInput);
    }
    else if (e.key === Keys.BACKSPACE) {
      let input = textInput.substring(0, textInput.length-1);
      setTextInput(input);
    };
    
  }

  return (
    <>
      <div>
        <div>
          Current input: {textInput}
        </div>
        <ParagraphDisplay paragraph={paragraph} typedStatuses={typedStatusList} currentIndex={currentWordIndex} currentInput={textInput} />
        <input onBlur={({target}) => target.focus()} autoFocus className='text-input' onKeyDown={(e: React.KeyboardEvent) => {
          onKeyPress(e);
        }} />
        <button onClick={() => onReset()}>
          Reset
        </button>
      </div>
    </>
  )
}

export default App;
