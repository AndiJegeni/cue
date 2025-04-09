"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  PlayIcon,
  PauseIcon,
  DownloadIcon,
  BookmarkIcon,
  InfoIcon,
  AudioWaveformIcon as WaveformIcon,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Mock sound results
const mockSounds = [
  {
    id: 1,
    name: "Melancholic Piano Loop",
    duration: "0:32",
    bpm: 85,
    mood: "sad",
    tags: ["piano", "melancholic", "loop"],
    waveform: [0.2, 0.3, 0.5, 0.8, 0.6, 0.4, 0.7, 0.9, 0.5, 0.3, 0.2, 0.1, 0.4, 0.6, 0.8, 0.7],
  },
  {
    id: 2,
    name: "Underwater Heartbeat",
    duration: "0:45",
    bpm: 72,
    mood: "dark",
    tags: ["ambient", "heartbeat", "underwater"],
    waveform: [0.1, 0.2, 0.8, 0.3, 0.1, 0.2, 0.8, 0.3, 0.1, 0.2, 0.8, 0.3, 0.1, 0.2, 0.8, 0.3],
  },
  {
    id: 3,
    name: "Emotional Strings",
    duration: "1:12",
    bpm: 90,
    mood: "sad",
    tags: ["strings", "emotional", "orchestral"],
    waveform: [0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8],
  },
  {
    id: 4,
    name: "Distant Memories",
    duration: "0:58",
    bpm: 80,
    mood: "melancholic",
    tags: ["piano", "ambient", "atmospheric"],
    waveform: [0.2, 0.4, 0.3, 0.5, 0.4, 0.6, 0.5, 0.7, 0.6, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2],
  },
  {
    id: 5,
    name: "Gentle Waves",
    duration: "1:05",
    bpm: 75,
    mood: "calm",
    tags: ["water", "ambient", "nature"],
    waveform: [0.1, 0.3, 0.2, 0.4, 0.3, 0.5, 0.4, 0.6, 0.5, 0.4, 0.3, 0.2, 0.3, 0.4, 0.3, 0.2],
  },
]

export default function ResultsPanel() {
  const [playing, setPlaying] = useState<number | null>(null)
  const [saved, setSaved] = useState<number[]>([])

  const togglePlay = (id: number) => {
    if (playing === id) {
      setPlaying(null)
    } else {
      setPlaying(id)
    }
  }

  const toggleSave = (id: number) => {
    if (saved.includes(id)) {
      setSaved(saved.filter((savedId) => savedId !== id))
    } else {
      setSaved([...saved, id])
    }
  }

  return (
    <Card className="h-[calc(100vh-12rem)] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WaveformIcon className="h-5 w-5 text-violet-500" />
            Results
          </div>
          <Badge variant="outline" className="ml-2">
            5 sounds
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto pb-4">
        <div className="space-y-4">
          {mockSounds.map((sound) => (
            <div key={sound.id} className="border rounded-lg p-3 hover:border-violet-300 transition-colors">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">{sound.name}</h3>
                <div className="flex items-center gap-1">
                  <Badge variant="secondary" className="text-xs">
                    {sound.bpm} BPM
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {sound.duration}
                  </Badge>
                </div>
              </div>

              <div className="relative h-12 bg-gray-100 dark:bg-gray-800 rounded-md mb-2 overflow-hidden">
                {/* Waveform visualization */}
                <div className="absolute inset-0 flex items-center justify-around">
                  {sound.waveform.map((value, index) => (
                    <div
                      key={index}
                      className={`w-1 rounded-full ${playing === sound.id ? "bg-violet-500" : "bg-gray-400"}`}
                      style={{
                        height: `${value * 100}%`,
                        animationName: playing === sound.id ? "pulse" : "none",
                        animationDuration: "1s",
                        animationIterationCount: "infinite",
                        animationDelay: `${index * 0.1}s`,
                      }}
                    ></div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {sound.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => togglePlay(sound.id)}>
                          {playing === sound.id ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{playing === sound.id ? "Pause" : "Play"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleSave(sound.id)}>
                          <BookmarkIcon
                            className={`h-4 w-4 ${saved.includes(sound.id) ? "fill-violet-500 text-violet-500" : ""}`}
                          />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{saved.includes(sound.id) ? "Unsave" : "Save"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <DownloadIcon className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Download</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <InfoIcon className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Details</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
