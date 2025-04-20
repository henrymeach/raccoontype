import { useEffect, useState } from 'react'
import './App.css'
import ParagraphDisplay from './components/ParagraphDisplay';
import { Keys } from './enums/Keys';
import { TypedStatus } from './enums/TypedStatus';
import { useNavigate } from 'react-router';
import Tooltip from './components/Tooltip';

function App() {
  let navigate = useNavigate();

  // game constants
  const PARAGRAPH_LENGTH = 16;
  const MOST_COMMON_WORDS_RANGE = 1000;

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
  // words spelled by the user
  const [typedWords, setTypedWords] = useState<string[]>([]);
  // timestamps for each word
  const [timestamps, setTimestamps] = useState<Date[]>([]);


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

  // Set the current letter index (weird function)
  useEffect(() => {
    setCurrentLetterIndex(textInput.length);
  }, [textInput]);

  // if user finishes paragraph
  useEffect(() => {
    if (typedWords.length === PARAGRAPH_LENGTH) {
      onParagraphFinish();
    }
  }, [typedWords]);


  // Reset paragraph to new paragraph
  const onReset = () => {

    function getRandomInt(min: number, max: number): number {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }

    let newParagraph = '';
    for (let _ = 0; _ < PARAGRAPH_LENGTH; _++) {
      newParagraph += words[getRandomInt(0, MOST_COMMON_WORDS_RANGE)] + ' ';
    };

    setTextInput('');
    // const [words, setWords] = useState<string[]>([]);
    // const [paragraph, setParagraph('');
    setCurrentWordIndex(0);
    // currentWord = paragraph.split(' ')[currentWordIndex];
    setCurrentLetterIndex(0);
    setHadTypo(false);
    setTypedStatusList(new Array(PARAGRAPH_LENGTH).fill(TypedStatus.UNTYPED));
    setTypedWords([]);
    setTimestamps([]);

    setParagraph(newParagraph);
    
  }

  function onWordFinish(wordInput: string) {

    // change status list
    const newTypedStatusList = [...typedStatusList];

    const wordInputTrimmed = wordInput.trim();
    
    if (wordInputTrimmed !== currentWord) {
      newTypedStatusList[currentWordIndex] = TypedStatus.INCORRECT;
    }
    else if (hadTypo) {
      newTypedStatusList[currentWordIndex] = TypedStatus.TYPO;
    } 
    else if (wordInputTrimmed === currentWord) {
      newTypedStatusList[currentWordIndex] = TypedStatus.CORRECT;
    }

    // set new status list
    setTypedStatusList(newTypedStatusList);

    // new word, set had typo to false
    setHadTypo(false);

    setTimestamps(prev => [...prev, new Date()]);

    setTypedWords(prev => [...prev, wordInput]);

    // set text input back to blank
    setTextInput('');

    // move to next word index
    setCurrentWordIndex(currentWordIndex + 1);
  }

  function onParagraphFinish() {

    const startTime = timestamps[0];
    const finishTime = timestamps[PARAGRAPH_LENGTH];
    const durationSeconds = Math.abs(finishTime.getTime() - startTime.getTime()) / 1000;
    const characters = paragraph.length;

    // standardised word is 5 letters long
    const wpm = Math.round((characters / (durationSeconds/60) / 5 * 100)) / 100

    const paragraphWords = paragraph.split(' ');

    // calculate accuracy
    const incorrectWords: string[] = [];
    typedStatusList.forEach((typedStatus, index) => {
      if (typedStatus === TypedStatus.INCORRECT) incorrectWords.push(paragraphWords[index]);
    } );

    const accuracy = Math.round(((characters - incorrectWords.join('').length) / characters) * 10000) / 100;
    
    setParagraph(`${durationSeconds.toString()} seconds ${wpm} wpm ${characters} characters ${accuracy} accuracy ${wpm * accuracy} calculated`);
  
    navigate('/finish', {state: {wpm: wpm, accuracy: accuracy, characters: characters, duration: durationSeconds.toString(), typedWords: typedWords, typedStatuses: typedStatusList, paragraph: paragraph}});
  }

  function onKeyPress(e: React.KeyboardEvent) {

    const newTextInput = textInput + e.key;
    const isLastWord = currentWordIndex === PARAGRAPH_LENGTH - 1;

    if (timestamps.length === 0) {
      setTimestamps([new Date()]);
    }

    // finish if last word spelled correctly
    if (isLastWord && newTextInput === currentWord) {
      onWordFinish(newTextInput);
    }

    // ensure user doesn't skip words through consecutive spacebar inputs
    if (e.key === Keys.SPACE && textInput.trim() === '') {
      return;
    }

    // if key press is character
    if (e.key.length === 1) {
      setTextInput(newTextInput);
    }

    // word is typo'd if character key doesn't match the correct next letter
    if (e.key.length === 1 && e.key !== currentWord[currentLetterIndex]) {
      setHadTypo(true);
    }

    // handle backspace, space, etc.
    if (e.ctrlKey && e.key === Keys.BACKSPACE) {
      setTextInput('');
    }
    else if (e.key === Keys.SPACE) {
      onWordFinish(textInput);
    }
    else if (e.key === Keys.BACKSPACE) {
      let input = textInput.substring(0, textInput.length-1);
      setTextInput(input);
    };

    // if user wants to reset
    if (e.ctrlKey && e.key === Keys.ENTER) {
      onReset();
    }
    
  }

  return (
    <>
      <div className='flex flex-col items-center'>
        <div className={`${textInput === currentWord.substring(0,textInput.length) ? 'text-[rgb(230,230,230)]' : 'text-[rgb(207,0,0)]'} word-input min-h-10`}>
          {textInput}
        </div>
        <ParagraphDisplay paragraph={paragraph} typedStatuses={typedStatusList} currentIndex={currentWordIndex} currentInput={textInput} />
        <input onBlur={({target}) => target.focus()} autoFocus className='text-input' onKeyDown={(e: React.KeyboardEvent) => {
          onKeyPress(e);
        }} />
        <button onClick={() => onReset()} className='relative button flex flex-row space-x-3 group'>
          <img src='/icons/refresh.svg' />
          <p>
            Reset
          </p>
          <Tooltip title='CTRL + Enter' className='group-hover:opacity-100' />
        </button>
      </div>
    </>
  )
}

export default App;
