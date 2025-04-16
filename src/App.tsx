import { useEffect, useState } from 'react'
import './App.css'

function App() {

  const [words, setWords] = useState<string[]>([]);
  const [paragraph, setParagraph] = useState<string>('');

  useEffect(() => {
    fetch('/words/google-10000-english-no-swears.txt')
      .then(res => res.text())
      .then(text => {
        setWords(text.split('\n').map(w => w.trim()).filter(Boolean));
      })
  }, [])

  useEffect(() => {
    if (words.length > 0) {
      onReset();
    };
  }, [words]);

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
  }

  return (
    <>
      <div>
        <p>
          {paragraph}
        </p>
        <input>
        
        </input>
        <button onClick={() => onReset()}>
          Reset
        </button>
      </div>
    </>
  )
}

export default App;
