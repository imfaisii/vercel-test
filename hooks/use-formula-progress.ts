"use client"

import { useState, useEffect } from "react"

interface FormulaProgress {
  masteredFormulas: string[]
  bookmarkedFormulas: string[]
  points: number
  streak: number
  lastStreakDate: string | null
}

export function useFormulaProgress() {
  const [progress, setProgress] = useState<FormulaProgress>({
    masteredFormulas: [],
    bookmarkedFormulas: [],
    points: 0,
    streak: 0,
    lastStreakDate: null,
  })

  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Load progress data from localStorage
    const masteredFormulas = JSON.parse(localStorage.getItem("masteredFormulas") || "[]")
    const bookmarkedFormulas = JSON.parse(localStorage.getItem("bookmarkedFormulas") || "[]")
    const points = Number.parseInt(localStorage.getItem("formulaPoints") || "0")
    const streak = Number.parseInt(localStorage.getItem("formulaStreak") || "0")
    const lastStreakDate = localStorage.getItem("lastStreakDate")

    setProgress({
      masteredFormulas,
      bookmarkedFormulas,
      points,
      streak,
      lastStreakDate,
    })

    setIsLoaded(true)
  }, [])

  const masterFormula = (formulaId: string, pointValue: number) => {
    if (!progress.masteredFormulas.includes(formulaId)) {
      const updatedMastered = [...progress.masteredFormulas, formulaId]
      const updatedPoints = progress.points + pointValue

      // Update localStorage
      localStorage.setItem("masteredFormulas", JSON.stringify(updatedMastered))
      localStorage.setItem("formulaPoints", updatedPoints.toString())

      // Update state
      setProgress((prev) => ({
        ...prev,
        masteredFormulas: updatedMastered,
        points: updatedPoints,
      }))

      return true // Formula was newly mastered
    }

    return false // Formula was already mastered
  }

  const toggleBookmark = (formulaId: string) => {
    const isCurrentlyBookmarked = progress.bookmarkedFormulas.includes(formulaId)
    let updatedBookmarks: string[]

    if (isCurrentlyBookmarked) {
      // Remove from bookmarks
      updatedBookmarks = progress.bookmarkedFormulas.filter((id) => id !== formulaId)
    } else {
      // Add to bookmarks
      updatedBookmarks = [...progress.bookmarkedFormulas, formulaId]
    }

    // Update localStorage
    localStorage.setItem("bookmarkedFormulas", JSON.stringify(updatedBookmarks))

    // Update state
    setProgress((prev) => ({
      ...prev,
      bookmarkedFormulas: updatedBookmarks,
    }))

    return !isCurrentlyBookmarked // Return new bookmark state
  }

  const updateStreak = () => {
    const today = new Date().toDateString()

    // If already updated today, do nothing
    if (progress.lastStreakDate === today) {
      return progress.streak
    }

    let newStreak = progress.streak

    if (progress.lastStreakDate) {
      const lastDate = new Date(progress.lastStreakDate)
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)

      if (lastDate.toDateString() === yesterday.toDateString()) {
        // Consecutive day, increment streak
        newStreak = progress.streak + 1
      } else {
        // Streak broken, reset to 1
        newStreak = 1
      }
    } else {
      // First time, set streak to 1
      newStreak = 1
    }

    // Update localStorage
    localStorage.setItem("formulaStreak", newStreak.toString())
    localStorage.setItem("lastStreakDate", today)

    // Update state
    setProgress((prev) => ({
      ...prev,
      streak: newStreak,
      lastStreakDate: today,
    }))

    return newStreak
  }

  return {
    progress,
    isLoaded,
    masterFormula,
    toggleBookmark,
    updateStreak,
  }
}

