import { useState } from "react"
import { languages } from "./languages"
import { clsx } from "clsx"
import { getFarewellText, getRandomWord } from "./utils"
import Stopwatch from "./Stopwatch"
import Confetti from "react-confetti"

export default function AssemblyEndgame() {
    // State values
    const [currentWord, setCurrentWord] = useState(getRandomWord())
    const [guessedLetters, setGuessedLetters] = useState([])
    const [gameId, setGameId] = useState(0)

    // Derived values
    const totalGuessesLeft = languages.length - 1
    const wrongGuessCount = 
        guessedLetters.filter(letter => !currentWord.includes(letter)).length
    const isGameWon = currentWord.split("").every(letter => guessedLetters.includes(letter))
    const isGameLost = wrongGuessCount >= totalGuessesLeft
    const isGameOver = isGameWon || isGameLost
    const lastGuessedLetter = guessedLetters[guessedLetters.length-1]
    const isLastGuessIncorrect = lastGuessedLetter && !currentWord.includes(lastGuessedLetter)
    const numGuessesLeft = totalGuessesLeft - wrongGuessCount
    const isGameStart = guessedLetters.length > 0
    const isGameOn = isGameStart && !isGameOver

    // Static values
    const alphabet = "abcdefghijklmnopqrstuvwxyz"

    function addGuessedLetters(letter) {
        setGuessedLetters(prevLetters => 
            prevLetters.includes(letter) ?
                prevLetters : 
                [...prevLetters, letter]
        )
    }

    const languageElements = languages.map((lang, index) => {
        const isLanguageLost = index < wrongGuessCount
        
        const styles = {
            backgroundColor: lang.backgroundColor,
            color: lang.color
        }

        return (
            <span 
                className={`chip ${isLanguageLost ? "lost" : ""}`} 
                style={styles}
                key={lang.name}
            >
                {lang.name}
            </span>
        )
    })

    const letterElements = currentWord.split("").map((letter, index) => {
        const shouldRevealLetter = isGameLost ||  guessedLetters.includes(letter)  
        const letterClassName = clsx(
            isGameLost && !guessedLetters.includes(letter) && "missed-letter"
        )
        return (    
            <span key={index} className={letterClassName}>
                {shouldRevealLetter ? letter.toUpperCase() : ""}
            </span>
        )
    })

    const keyboardElements = alphabet.split("").map(letter => {
        const isGuessed = guessedLetters.includes(letter)
        const isCorrect = isGuessed && currentWord.includes(letter)
        const isWrong = isGuessed && !currentWord.includes(letter)
        
        const className = clsx({
            correct: isCorrect,
            wrong: isWrong
        })

        return (
            <button 
                className={className}
                key={letter} 
                onClick={() => addGuessedLetters(letter)}
                disabled={isGameOver}
                aria-disabled={guessedLetters.includes(letter)}
                aria-label={`Letter ${letter}`}
            >
                {letter.toUpperCase()}
            </button>
        )
    })

    const gameStatusClass = clsx("game-status", {
        won: isGameWon,
        lost: isGameLost,
        farewell: !isGameOver && isLastGuessIncorrect
    })

    function renderGameStatus() {
        if(!isGameOver && isLastGuessIncorrect) {
            return (
                <p className="farewell-message">
                    {getFarewellText(languages[wrongGuessCount-1].name)}
                </p>
            )
        }

        if(isGameWon) {
            return (
                <>
                    <h2>You win!</h2>
                    <p>Well done! 🎉</p>
                </> 
            )
        } 
        
        if(isGameLost) {
            return (
                <>
                    <h2>Game over!</h2>
                    <p>You lose! Better start learning Assembly 😭</p>
                </>
            )
        }

        return null
    }

    function findGuessesLeft() {
        if(numGuessesLeft > 1) {
            return `You have ${numGuessesLeft} guesses left`
        } else if (numGuessesLeft === 1) {
            return `You have 1 guess left`
        }
    }

    function resetGame() {
        setCurrentWord(getRandomWord())
        setGuessedLetters([])
        setGameId((prev) => prev + 1)
    }

    
    return (
        <main>
            {isGameWon && <Confetti 
                            recycle={false}
                            numberOfPieces={1000}
            />}
            
            <header>
                <h1>Assembly: Endgame</h1>
                <p>Guess the word within 8 attempts to keep the programming world safe from Assembly!</p>
            </header>

            <Stopwatch 
                isGameOn={isGameOn}
                isGameWon={isGameWon} 
                gameId={gameId}
                resetGame={resetGame}
            />

            <section className={gameStatusClass}>
                {renderGameStatus()}
            </section>

            <section className="language-chips">
                {languageElements}
            </section>

            <section className="word">
                {letterElements}
            </section>

            {/* Combined visually-hidden aria-live region for status update */}
            <section 
                className="sr-only" 
                aria-live="polite" 
                role="status"
            >
                <p>
                    {currentWord.includes(lastGuessedLetter) ? 
                        `Correct! The letter ${lastGuessedLetter} is in the word.` : 
                        `Sorry, the letter ${lastGuessedLetter} is not in the word.`
                    }
                    You have {numGuessesLeft} attempts left.
                </p>
                <p>Current word: {currentWord.split("").map(letter => 
                guessedLetters.includes(letter) ? letter + "." : "blank.")
                .join(" ")}</p>
            </section>

            <section className="keyboard">
                {keyboardElements}
            </section>
            
            {
            isGameOver ? 
                <button className="new-game"
                        onClick={resetGame}
                >
                    New Game
                </button>
                :
                isGameStart && <p className="guesses">{findGuessesLeft()}</p>
            }
        </main>
    )
}