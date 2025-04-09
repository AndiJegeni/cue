"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SendIcon, Sliders, PlayCircle, PauseCircle, Heart, RefreshCw, Edit, Music } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"

// Mock search results
const generateMockResults = (query: string) => [
  {
    id: 1,
    name: `${query} Melody`,
    bpm: Math.floor(Math.random() * 40) + 80, // 80-120 BPM
    key: ["C", "D", "E", "F", "G", "A", "B"][Math.floor(Math.random() * 7)],
    duration: 43, // seconds
  },
  {
    id: 2,
    name: `${query} Rhythm`,
    bpm: Math.floor(Math.random() * 40) + 80,
    key: ["C", "D", "E", "F", "G", "A", "B"][Math.floor(Math.random() * 7)],
    duration: 52, // seconds
  },
  {
    id: 3,
    name: `${query} Ambient`,
    bpm: Math.floor(Math.random() * 40) + 80,
    key: ["C", "D", "E", "F", "G", "A", "B"][Math.floor(Math.random() * 7)],
    duration: 65, // seconds
  },
]

// Format seconds to MM:SS with option for countdown
const formatTime = (seconds: number, totalDuration = 0, isCountdown = false) => {
  // For countdown, calculate remaining time
  const timeToFormat = isCountdown ? totalDuration - seconds : seconds
  const mins = Math.floor(timeToFormat / 60)
  const secs = Math.floor(timeToFormat % 60)
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

export default function SearchInterface() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showOptions, setShowOptions] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [bpm, setBpm] = useState([107])
  const [key, setKey] = useState("C")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [playing, setPlaying] = useState<number | null>(null)
  const [liked, setLiked] = useState<number[]>([])
  const [playbackPositions, setPlaybackPositions] = useState<Record<number, number>>({})
  const [currentTimes, setCurrentTimes] = useState<Record<number, number>>({})
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const timelineRefs = useRef<Record<number, HTMLDivElement | null>>({})
  const playbackIntervals = useRef<Record<number, NodeJS.Timeout | null>>({})

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Generate mock results based on the search query
      const results = generateMockResults(searchQuery)
      setSearchResults(results)
      setShowResults(true)
      // Reset playback positions and times
      const initialPositions: Record<number, number> = {}
      const initialTimes: Record<number, number> = {}
      results.forEach((result) => {
        initialPositions[result.id] = 0
        initialTimes[result.id] = 0
      })
      setPlaybackPositions(initialPositions)
      setCurrentTimes(initialTimes)
    }
  }

  const toggleOptions = () => {
    setShowOptions(!showOptions)
  }

  const togglePlay = (id: number) => {
    if (playing === id) {
      setPlaying(null)
      // Clear the interval if it exists
      if (playbackIntervals.current[id]) {
        clearInterval(playbackIntervals.current[id]!)
        playbackIntervals.current[id] = null
      }
    } else {
      // Stop any currently playing track
      if (playing !== null && playbackIntervals.current[playing]) {
        clearInterval(playbackIntervals.current[playing]!)
        playbackIntervals.current[playing] = null
      }

      setPlaying(id)
      // Start playback simulation for this track
      startPlaybackSimulation(id)
    }
  }

  const startPlaybackSimulation = (id: number) => {
    const result = searchResults.find((r) => r.id === id)
    if (!result) return

    const totalDuration = result.duration

    // Simulate playback by advancing the position every 100ms
    const interval = setInterval(() => {
      setPlaybackPositions((prev) => {
        const currentPosition = prev[id] || 0
        const newPosition = currentPosition + 0.5
        if (newPosition >= 100) {
          clearInterval(interval)
          setPlaying(null)
          playbackIntervals.current[id] = null

          // Reset time and position
          setCurrentTimes((prev) => ({ ...prev, [id]: 0 }))
          return { ...prev, [id]: 0 }
        }

        // Update current time based on position percentage
        const newTime = (newPosition / 100) * totalDuration
        setCurrentTimes((prev) => ({ ...prev, [id]: newTime }))

        return { ...prev, [id]: newPosition }
      })
    }, 100)

    // Store the interval ID to clear it when needed
    playbackIntervals.current[id] = interval
  }

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>, id: number) => {
    const timelineEl = timelineRefs.current[id]
    if (!timelineEl) return

    const result = searchResults.find((r) => r.id === id)
    if (!result) return

    const rect = timelineEl.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percentage = (clickX / rect.width) * 100

    // Update the playback position
    setPlaybackPositions((prev) => ({
      ...prev,
      [id]: Math.min(Math.max(percentage, 0), 100),
    }))

    // Update the current time based on position
    const newTime = (percentage / 100) * result.duration
    setCurrentTimes((prev) => ({ ...prev, [id]: newTime }))

    // If this track is playing, restart the simulation from the new position
    if (playing === id) {
      if (playbackIntervals.current[id]) {
        clearInterval(playbackIntervals.current[id]!)
      }
      startPlaybackSimulation(id)
    }
  }

  const toggleLike = (id: number) => {
    if (liked.includes(id)) {
      setLiked(liked.filter((likedId) => likedId !== id))
    } else {
      setLiked([...liked, id])
    }
  }

  const retrySearch = () => {
    // Reset results and re-perform search with the same query
    setShowResults(false)
    setTimeout(() => {
      const results = generateMockResults(searchQuery)
      setSearchResults(results)
      setShowResults(true)
    }, 500)
  }

  const iterateSearch = () => {
    // Open a dialog or prompt to refine the search
    const refinedQuery = window.prompt("Refine your search:", searchQuery)
    if (refinedQuery && refinedQuery.trim() !== "") {
      setSearchQuery(refinedQuery)
      const results = generateMockResults(refinedQuery)
      setSearchResults(results)
      setShowResults(true)
    }
  }

  // Focus the input when options are shown
  useEffect(() => {
    if (showOptions && inputRef.current) {
      // Small delay to ensure the DOM has updated
      setTimeout(() => {
        inputRef.current?.focus()
      }, 10)
    }
  }, [showOptions])

  // Clean up intervals on unmount
  useEffect(() => {
    return () => {
      Object.values(playbackIntervals.current).forEach((interval) => {
        if (interval) clearInterval(interval)
      })
    }
  }, [])

  return (
    <div className="w-full flex flex-col items-center">
      <h1 className="text-xl font-medium text-gray-600 mb-6">Search for your perfect sound</h1>

      <div className="w-full max-w-xl mx-auto">
        <form onSubmit={handleSearch} className="w-full">
          <div ref={searchContainerRef} className="relative">
            <div className={`bg-white rounded-lg shadow-sm transition-all ${showOptions ? "pb-6" : ""}`}>
              <div className="relative">
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="Search for your perfect sound"
                  className="w-full h-12 pl-4 pr-12 text-base rounded-lg border-0 bg-transparent focus:ring-0 shadow-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />

                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={toggleOptions}>
                    <Sliders className="h-4 w-4 text-gray-400" />
                  </Button>

                  <Button type="submit" variant="ghost" size="icon" className="h-8 w-8">
                    <SendIcon className="h-4 w-4 text-gray-400" />
                  </Button>
                </div>
              </div>

              {showOptions && (
                <div className="px-4 pt-2">
                  <div className="flex flex-col md:flex-row md:items-center md:gap-8">
                    <div className="flex items-center flex-1 mb-4 md:mb-0">
                      <span className="text-sm font-medium mr-4 w-10">BPM</span>
                      <div className="flex-1 mx-2">
                        <Slider
                          id="bpm"
                          min={60}
                          max={200}
                          step={1}
                          value={bpm}
                          onValueChange={setBpm}
                          thumbClassName="h-5 w-5 border-2 border-white"
                        />
                      </div>
                      <span className="text-sm ml-4 w-10 text-right">{bpm[0]}</span>
                    </div>

                    <div className="flex items-center flex-1">
                      <span className="text-sm font-medium mr-4 w-10">Key</span>
                      <div className="flex-1">
                        <Select value={key} onValueChange={setKey}>
                          <SelectTrigger className="h-10 text-sm rounded-full border-0 bg-white shadow-sm">
                            <SelectValue placeholder="Select key" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="C">C</SelectItem>
                            <SelectItem value="C#">C#</SelectItem>
                            <SelectItem value="D">D</SelectItem>
                            <SelectItem value="D#">D#</SelectItem>
                            <SelectItem value="E">E</SelectItem>
                            <SelectItem value="F">F</SelectItem>
                            <SelectItem value="F#">F#</SelectItem>
                            <SelectItem value="G">G</SelectItem>
                            <SelectItem value="G#">G#</SelectItem>
                            <SelectItem value="A">A</SelectItem>
                            <SelectItem value="A#">A#</SelectItem>
                            <SelectItem value="B">B</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>

        {showResults && (
          <div className="mt-8 space-y-4">
            <div className="space-y-3 mb-6">
              {searchResults.map((result) => (
                <Card key={result.id} className="bg-white shadow-sm p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-full"
                        onClick={() => togglePlay(result.id)}
                      >
                        {playing === result.id ? (
                          <PauseCircle className="h-10 w-10 text-black" />
                        ) : (
                          <PlayCircle className="h-10 w-10 text-black" />
                        )}
                      </Button>

                      <div>
                        <h3 className="font-medium">{result.name}</h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-sm text-gray-500 mr-2">
                        <Music className="h-3.5 w-3.5" />
                        <span>{result.key}</span>
                      </div>

                      <div className="flex items-center gap-1 text-sm text-gray-500 mr-2">
                        <span>{result.bpm} BPM</span>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-gray-600"
                        onClick={() => toggleLike(result.id)}
                      >
                        <Heart className={`h-4 w-4 ${liked.includes(result.id) ? "fill-red-500 text-red-500" : ""}`} />
                      </Button>
                    </div>
                  </div>

                  {/* Timeline positioned below the text and aligned with play button */}
                  <div className="mt-6 flex items-center">
                    <div className="w-10"></div> {/* Spacer to align with play button */}
                    <div className="flex-1 flex items-center">
                      <div
                        ref={(el) => (timelineRefs.current[result.id] = el)}
                        className="relative h-2 bg-gray-200 rounded-full overflow-hidden cursor-pointer flex-1"
                        onClick={(e) => handleTimelineClick(e, result.id)}
                      >
                        {/* Progress indicator */}
                        <div
                          className="absolute top-0 bottom-0 left-0 bg-black rounded-full"
                          style={{ width: `${playbackPositions[result.id] || 0}%` }}
                        ></div>
                      </div>

                      {/* Time display at right */}
                      <div className="text-sm text-gray-500 ml-3 min-w-[40px] text-right">
                        {formatTime(currentTimes[result.id] || 0, result.duration, true)}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Action buttons at the bottom */}
            <div className="flex justify-center gap-3 mt-6">
              <Button variant="outline" size="lg" className="flex items-center gap-2 px-6" onClick={retrySearch}>
                <RefreshCw className="h-4 w-4" />
                <span>Retry</span>
              </Button>
              <Button variant="outline" size="lg" className="flex items-center gap-2 px-6" onClick={iterateSearch}>
                <Edit className="h-4 w-4" />
                <span>Refine</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
