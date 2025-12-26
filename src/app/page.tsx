"use client"

import { useState, useEffect } from "react"

interface DayNote {
  date: string
  text: string
}

const COLORS = [
  { name: "green", class: "border-green-400", bg: "bg-green-400" },
  { name: "blue", class: "border-blue-400", bg: "bg-blue-400" },
  { name: "yellow", class: "border-yellow-400", bg: "bg-yellow-400" },
  { name: "red", class: "border-red-400", bg: "bg-red-400" },
  { name: "purple", class: "border-purple-400", bg: "bg-purple-400" },
  { name: "pink", class: "border-pink-400", bg: "bg-pink-400" },
  { name: "orange", class: "border-orange-400", bg: "bg-orange-400" },
  { name: "cyan", class: "border-cyan-400", bg: "bg-cyan-400" },
  { name: "lightgray", class: "border-gray-400", bg: "bg-gray-400" }
]

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [colors, setColors] = useState<Record<string, string>>({})
  const [currentText, setCurrentText] = useState("")
  const [currentColor, setCurrentColor] = useState<string | null>(null)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [isNextMonth, setIsNextMonth] = useState(false)

  // Load notes from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("calendar-notes")
    if (stored) {
      setNotes(JSON.parse(stored))
    }
    const storedColors = localStorage.getItem("calendar-colors")
    if (storedColors) {
      setColors(JSON.parse(storedColors))
    }
  }, [])

  // Save notes to localStorage whenever they change
  useEffect(() => {
    if (Object.keys(notes).length > 0) {
      localStorage.setItem("calendar-notes", JSON.stringify(notes))
    }
  }, [notes])

  // Save colors to localStorage whenever they change
  useEffect(() => {
    if (Object.keys(colors).length > 0) {
      localStorage.setItem("calendar-colors", JSON.stringify(colors))
    }
  }, [colors])

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
    setCurrentColor(colors[dateStr] || null)
    setShowColorPicker(false)
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
    if (selectedDate && currentColor) {
      setColors((prev) => ({
        ...prev,
        [selectedDate]: currentColor,
      }))
    } else if (selectedDate && !currentColor) {
      // Remove color if none selected
      setColors((prev) => {
        const newColors = { ...prev }
        delete newColors[selectedDate]
        return newColors
      })
    }
    setSelectedDate(null)
    setCurrentText("")
    setCurrentColor(null)
    setShowColorPicker(false)
  }

  const handleColorSelect = (colorName: string | null) => {
    setCurrentColor(colorName)
    setShowColorPicker(false)
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
            const dayColor = colors[dateStr]

            const today = new Date()
            today.setHours(0, 0, 0, 0)
            const todayStr = formatDate(today)
            const isToday = dateStr === todayStr

            const compareDate = new Date(date)
            compareDate.setHours(0, 0, 0, 0)
            const isPast = compareDate < today

            const dayOfWeek = date.getDay()
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

            const colorClass = dayColor ? COLORS.find(c => c.name === dayColor)?.class : ""

            return (
                <button
                key={dateStr}
                onClick={() => handleDayClick(date)}
                className={`
                  aspect-square p-3
                  transition-colors
                  flex flex-col items-start justify-start
                  rounded-lg
                  relative
                  group
                  ${dayColor ? `border-2 ${colorClass}` : isPast && !isToday ? "border border-border hover:border-foreground/20" : "border border-foreground/30 hover:border-foreground/40"}
                  ${isWeekend ? "bg-muted/90" : "bg-card"}
                  ${isPast && !isToday ? "opacity-40" : ""}
                `}
                >
                {isToday && <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 group-hover:bg-gray-400 rounded-full transition-colors" />}
                <span className="text-sm font-light text-foreground mb-2">{date.getDate()}</span>
                {hasNote && (
                  <span className={`leading-tight text-left whitespace-pre-wrap line-clamp-5 ${
                    isPast && !isToday ? "text-muted-foreground" : "text-foreground/70"
                  } ${
                    hasNote.length <= 8 ? "text-lg" : hasNote.length <= 20 ? "text-normalsize" : hasNote.length <= 35 ? "text-sm" : hasNote.length <= 50 ? "text-xs" : "text-[0.65rem]"
                  }`}>
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
            <div className="p-6 border-b border-border flex items-center justify-between">
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
              
              {/* Color picker */}
              <div className="relative">
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="w-8 h-8 rounded-full border-2 border-border flex items-center justify-center hover:border-foreground/40 transition-colors"
                >
                  {currentColor ? (
                    <div className={`w-6 h-6 rounded-full ${COLORS.find(c => c.name === currentColor)?.bg}`} />
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="lightgray" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                    </svg>
                  )}
                </button>
                
                {showColorPicker && (
                  <div className="absolute right-0 top-12 bg-card border border-border rounded-lg shadow-xl p-3 flex gap-2 z-10">
                    <button
                      onClick={() => handleColorSelect(null)}
                      className="w-8 h-8 rounded-full border-2 border-border flex items-center justify-center hover:bg-muted transition-colors"
                      title="None"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="lightgray" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                      </svg>
                    </button>
                    {COLORS.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => handleColorSelect(color.name)}
                        className={`w-8 h-8 rounded-full ${color.bg} hover:scale-110 transition-transform ${currentColor === color.name ? "ring-2 ring-foreground ring-offset-2" : ""}`}
                        title={color.name}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Textarea */}
            <textarea
              value={currentText}
              onChange={(e) => setCurrentText(e.target.value)}
              className="flex-1 p-6 bg-transparent text-foreground resize-none outline-none font-light leading-relaxed"
              placeholder="Escriu aquí..."
              autoFocus
            />

            {/* Close hint */}
            <div className="p-4 text-center text-xs text-muted-foreground">Clica fora per tancar</div>
          </div>
        </div>
      )}
    </div>
  )
}
