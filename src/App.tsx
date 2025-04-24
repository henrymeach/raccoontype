import { useEffect, useRef, useState } from 'react'
import './App.css'
import ParagraphDisplay from './components/ParagraphDisplay';
import { Keys } from './enums/Keys';
import { TypedStatus } from './enums/TypedStatus';
import { useNavigate } from 'react-router';
import Tooltip from './components/Tooltip';

function App() {
  let navigate = useNavigate();

  // game variables
  const paragraphLengths = [16, 32, 64];
  const wordsRanges = [1000, 2000, 5000, 10000];
  const [paragraphLengthIndex, setParagraphLengthIndex] = useState<number>(1);
  const [wordsRangeIndex, setWordsRangeIndex] = useState<number>(0);

  // ref
  const inputRef = useRef<HTMLInputElement | null>(null);

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
  // user focused on paragraph display?
  const [focused, setFocused] = useState<boolean>(true);


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
  }, [words, paragraphLengthIndex, wordsRangeIndex]);

  // Set the current letter index (weird function)
  useEffect(() => {
    setCurrentLetterIndex(textInput.length);
  }, [textInput]);

  // if user finishes paragraph
  useEffect(() => {
    if (typedWords.length === paragraphLengths[paragraphLengthIndex]) {
      onParagraphFinish();
    }
  }, [typedWords]);

  // Reset paragraph to new paragraph
  const onReset = () => {

    const paragraphLength = paragraphLengths[paragraphLengthIndex];
    const wordsRange = wordsRanges[wordsRangeIndex];

    function getRandomInt(min: number, max: number): number {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }

    let newParagraph = '';
    for (let _ = 0; _ < paragraphLength; _++) {
      newParagraph += words[getRandomInt(0, wordsRange)] + ' ';
    };

    // reset to default values
    setTextInput('');
    setCurrentWordIndex(0);
    setCurrentLetterIndex(0);
    setHadTypo(false);
    setTypedStatusList(new Array(paragraphLength).fill(TypedStatus.UNTYPED));
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
    const finishTime = timestamps[paragraphLengths[paragraphLengthIndex]];
    const durationSeconds = Math.abs(finishTime.getTime() - startTime.getTime()) / 1000;
    const characters = paragraph.length - 1;

    // standardised word is 5 letters long
    const wpm = Math.round((characters / (durationSeconds/60) / 5 * 100)) / 100

    const paragraphWords = paragraph.split(' ');

    // calculate accuracy
    const incorrectWords: string[] = [];
    typedStatusList.forEach((typedStatus, index) => {
      if (typedStatus === TypedStatus.INCORRECT) incorrectWords.push(paragraphWords[index]);
    } );

    const accuracy = Math.max(0, Math.round(((characters - incorrectWords.join('').length - incorrectWords.length) / characters) * 10000) / 100);
    
    setParagraph(`${durationSeconds.toString()} seconds ${wpm} wpm ${characters} characters ${accuracy} accuracy ${wpm * accuracy} calculated`);
  
    navigate('/finish', {state: {wpm: wpm, accuracy: accuracy, characters: characters, duration: durationSeconds.toString(), typedWords: typedWords, typedStatuses: typedStatusList, paragraph: paragraph}});
  }

  function onKeyPress(e: React.KeyboardEvent) {

    const newTextInput = textInput + e.key;
    const isLastWord = currentWordIndex === paragraphLengths[paragraphLengthIndex] - 1;

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
    if (e.key.length === 1 && !(e.ctrlKey)) {
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
    if (e.shiftKey && e.key === Keys.ENTER) {
      onReset();
    }
    
  }

  function handleFocus() {
    if (focused === false) {
      inputRef.current?.focus();
      setFocused(true);
    }
  }

  function handleBlur() {
    if (focused === true) {
      setFocused(false);
    }
  }

  return (
    <>
      <div className='relative'>
        <div className='flex flex-col items-center mb-30'>
          <div className={`${textInput === currentWord.substring(0,textInput.length) ? 'text-[rgb(230,230,230)]' : 'text-[rgb(207,0,0)]'} word-input min-h-10`}>
            {textInput}
          </div>
          <ParagraphDisplay paragraph={paragraph} typedStatuses={typedStatusList} currentIndex={currentWordIndex} currentInput={textInput} focused={focused} onClick={() => handleFocus()} />
          <input ref={inputRef} onBlur={() => handleBlur()} autoFocus className='text-input h-0' onKeyDown={(e: React.KeyboardEvent) => {
          onKeyPress(e);
          }} />
        </div>

        {/* buttons */}
        <div className='w-full fixed flex flex-row right-1/2 translate-x-1/2 justify-center bottom-[16%] space-x-4'>
          <button className='relative button-secondary group' onClick={() => {setParagraphLengthIndex(prev => (prev + 1) % paragraphLengths.length); handleFocus()}}>
            {paragraphLengths[paragraphLengthIndex]}
            <Tooltip title='Words' />
          </button>
          <button onClick={() => {onReset(); handleFocus()}} className='relative !px-10 button flex flex-row justify-center space-x-3 group'>
            <img src='/icons/refresh.svg' />
            <p>
              Reset
            </p>
            <Tooltip title='Shift + Enter' />
          </button>
          <button className='relative button-secondary group' onClick={() => {setWordsRangeIndex(prev => (prev + 1) % wordsRanges.length); handleFocus()}}>
            {wordsRanges[wordsRangeIndex]}
            <Tooltip title='Most Common Words' />
          </button>
        </div>
      </div>
    </>
  )
}

export default App;
