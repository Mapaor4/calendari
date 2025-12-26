"use client"

import { useState, useEffect } from "react"

interface DayNote {
  date: string
  text: string
}

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [currentText, setCurrentText] = useState("")
  const [isNextMonth, setIsNextMonth] = useState(false)

  // Load notes from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("calendar-notes")
    if (stored) {
      setNotes(JSON.parse(stored))
    }
  }, [])

  // Save notes to localStorage whenever they change
  useEffect(() => {
    if (Object.keys(notes).length > 0) {
      localStorage.setItem("calendar-notes", JSON.stringify(notes))
    }
  }, [notes])

  const getCalendarDays = (monthOffset = 0) => {
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth() + monthOffset

    // Get first day of month
    const firstDay = new Date(year, month, 1)
    // Get last day of month
    const lastDay = new Date(year, month + 1, 0)

    // Get day of week (0-6, Sunday-Saturday)
    let firstDayOfWeek = firstDay.getDay()
    // Convert to Monday start (0-6, Monday-Sunday)
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1

    const days = []

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0]
  }

  const getMonthName = (monthOffset = 0) => {
    const today = new Date()
    const targetDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1)
    const monthNames = [
      "gener",
      "febrer",
      "març",
      "abril",
      "maig",
      "juny",
      "juliol",
      "agost",
      "setembre",
      "octubre",
      "novembre",
      "desembre",
    ]
    const month = monthNames[targetDate.getMonth()]
    const year = targetDate.getFullYear()
    return `${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`
  }

  const handleDayClick = (date: Date) => {
    const dateStr = formatDate(date)
    setSelectedDate(dateStr)
    setCurrentText(notes[dateStr] || "")
  }

  const handleCloseModal = () => {
    if (selectedDate && currentText.trim()) {
      setNotes((prev) => ({
        ...prev,
        [selectedDate]: currentText,
      }))
    } else if (selectedDate && !currentText.trim()) {
      // Remove note if text is empty
      setNotes((prev) => {
        const newNotes = { ...prev }
        delete newNotes[selectedDate]
        return newNotes
      })
    }
    setSelectedDate(null)
    setCurrentText("")
  }

  const calendarDays = getCalendarDays(isNextMonth ? 1 : 0)
  const weekDays = ["dl", "dt", "dc", "dj", "dv", "ds", "dg"]

  return (
    <div className="min-h-screen bg-background p-8 flex items-center justify-center">
      <div className="w-full max-w-5xl">
        {/* Month title */}
        <div className="relative mb-8 flex justify-center">
          {isNextMonth && (
            <button
              onClick={() => setIsNextMonth(false)}
              className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Mes anterior"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
          )}
          <h1 className="text-2xl font-light text-foreground">{getMonthName(isNextMonth ? 1 : 0)}</h1>
          {!isNextMonth && (
            <button
              onClick={() => setIsNextMonth(true)}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Mes següent"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          )}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Weekday headers */}
          {weekDays.map((day) => (
            <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {calendarDays.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className="aspect-square" />
            }

            const dateStr = formatDate(date)
            const hasNote = notes[dateStr]

            const today = new Date()
            today.setHours(0, 0, 0, 0)
            const todayStr = formatDate(today)
            const isToday = dateStr === todayStr

            const compareDate = new Date(date)
            compareDate.setHours(0, 0, 0, 0)
            const isPast = compareDate < today

            const dayOfWeek = date.getDay()
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

            return (
                <button
                key={dateStr}
                onClick={() => handleDayClick(date)}
                className={`
                  aspect-square border p-3
                  transition-colors
                  flex flex-col items-start justify-start
                  rounded-lg
                  ${isToday ? "border-blue-400 border-2 hover:border-gray-500" : "border-border hover:border-foreground/20"}
                  ${isWeekend ? "bg-muted/90" : "bg-card"}
                  ${isPast && !isToday ? "opacity-40" : ""}
                `}
                >
                <span className="text-sm font-light text-foreground mb-2">{date.getDate()}</span>
                {hasNote && (
                  <span className="text-[0.65rem] leading-tight text-muted-foreground text-left whitespace-pre-wrap line-clamp-5">
                    {hasNote}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Modal */}
      {selectedDate && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50" onClick={handleCloseModal}>
          <div
            className="bg-card w-full max-w-3xl h-[80vh] rounded-lg shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="p-6 border-b border-border">
              <h2 className="text-lg font-light text-foreground">
                {(() => {
                  const date = new Date(selectedDate + "T00:00:00")
                  const weekdayNames = ["diumenge", "dilluns", "dimarts", "dimecres", "dijous", "divendres", "dissabte"]
                  const monthNames = [
                    "gener",
                    "febrer",
                    "març",
                    "abril",
                    "maig",
                    "juny",
                    "juliol",
                    "agost",
                    "setembre",
                    "octubre",
                    "novembre",
                    "desembre",
                  ]
                  const weekday = weekdayNames[date.getDay()]
                  const day = date.getDate()
                  const month = monthNames[date.getMonth()]
                  const year = date.getFullYear()
                  return `${weekday.charAt(0).toUpperCase() + weekday.slice(1)} ${day} de ${month} de ${year}`
                })()}
              </h2>
            </div>

            {/* Textarea */}
            <textarea
              value={currentText}
              onChange={(e) => setCurrentText(e.target.value)}
              className="flex-1 p-6 bg-transparent text-foreground resize-none outline-none font-light leading-relaxed"
              placeholder="Escriu les teves notes aquí..."
              autoFocus
            />

            {/* Close hint */}
            <div className="p-4 text-center text-xs text-muted-foreground">Fes clic fora per tancar</div>
          </div>
        </div>
      )}
    </div>
  )
}
