import React, { useEffect, useState, useRef } from "react"

export default function Stopwatch({isGameOn, gameId, isGameWon}) {
    const [time, setTime] = useState(0)

    const intervalRef = useRef(null)

    useEffect(() => {
        setTime(0)
    }, [gameId])


    useEffect(() => {
        if(isGameOn) {
            intervalRef.current = setInterval(() => {
                setTime((prev) => prev + 1)
            }, 1000)
        }
    
        return () => clearInterval(intervalRef.current)
    }, [isGameOn, gameId])
    
    const formatTime = (value) => String(value).padStart(2, "0")
    
    if(isGameWon) {
        clearInterval(intervalRef.current)
        return <p className="gametime">You completed the game in {time}s</p>
    } else {
        return <span className="gametime">Time: {formatTime(time)}s</span>
    }
}


      


  