"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { SendIcon, MusicIcon, AudioWaveformIcon as WaveformIcon, HeartIcon, RefreshCwIcon } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

// Mock conversation data
const initialMessages = [
  {
    role: "system",
    content:
      "Welcome to SoundSeeker! Describe the sound you're looking for, and I'll help you find it. You can specify mood, genre, BPM, and other characteristics.",
  },
]

export default function ChatInterface() {
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [bpm, setBpm] = useState([120])
  const [mood, setMood] = useState("neutral")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const userMessage = {
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsSearching(true)

    // Simulate AI response after delay
    setTimeout(() => {
      const parameters = []
      if (showAdvanced) {
        parameters.push(`BPM: ${bpm[0]}`)
        parameters.push(`Mood: ${mood}`)
      }

      const parameterText = parameters.length > 0 ? `\n\nParameters: ${parameters.join(", ")}` : ""

      const aiMessage = {
        role: "system",
        content: `I've found 5 sounds that match your description "${input}"${parameterText}. Check the results panel to preview and download them.`,
      }

      setMessages((prev) => [...prev, aiMessage])
      setIsSearching(false)

      // Notify the results panel (this would be handled by state management in a real app)
      toast({
        title: "Sounds Found",
        description: "5 matching sounds have been found based on your query.",
      })
    }, 1500)
  }

  const clearChat = () => {
    setMessages(initialMessages)
    setInput("")
    setBpm([120])
    setMood("neutral")
  }

  return (
    <Card className="h-[calc(100vh-12rem)] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <WaveformIcon className="h-5 w-5 text-violet-500" />
          Sound Search
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto pb-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === "user" ? "bg-violet-600 text-white" : "bg-gray-100 dark:bg-gray-800"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isSearching && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg px-4 py-2 bg-gray-100 dark:bg-gray-800">
                <div className="flex items-center gap-2">
                  <div className="animate-pulse">Searching for sounds</div>
                  <div className="flex space-x-1">
                    <div
                      className="w-2 h-2 rounded-full bg-violet-500 animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-violet-500 animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-violet-500 animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-4 pt-4 border-t">
        <div className="w-full">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs flex items-center gap-1 mb-2"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? "Hide" : "Show"} Advanced Options
          </Button>

          {showAdvanced && (
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="bpm" className="text-xs flex items-center gap-1 mb-1">
                  <MusicIcon className="h-3 w-3" /> BPM: {bpm[0]}
                </Label>
                <Slider id="bpm" min={60} max={200} step={1} value={bpm} onValueChange={setBpm} />
              </div>

              <div>
                <Label htmlFor="mood" className="text-xs flex items-center gap-1 mb-1">
                  <HeartIcon className="h-3 w-3" /> Mood
                </Label>
                <Select value={mood} onValueChange={setMood}>
                  <SelectTrigger id="mood">
                    <SelectValue placeholder="Select mood" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="happy">Happy</SelectItem>
                    <SelectItem value="sad">Sad</SelectItem>
                    <SelectItem value="energetic">Energetic</SelectItem>
                    <SelectItem value="calm">Calm</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="uplifting">Uplifting</SelectItem>
                    <SelectItem value="neutral">Neutral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              placeholder="Describe the sound you're looking for..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1"
            />
            <Button
              type="submit"
              size="icon"
              disabled={isSearching || !input.trim()}
              className="bg-violet-600 hover:bg-violet-700"
            >
              <SendIcon className="h-4 w-4" />
            </Button>
            <Button type="button" variant="outline" size="icon" onClick={clearChat}>
              <RefreshCwIcon className="h-4 w-4" />
            </Button>
          </form>
        </div>

        {showAdvanced && (
          <div className="w-full flex flex-wrap gap-1">
            <Badge variant="outline" className="cursor-pointer hover:bg-violet-100">
              acoustic
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-violet-100">
              ambient
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-violet-100">
              bass
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-violet-100">
              drums
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-violet-100">
              electronic
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-violet-100">
              guitar
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-violet-100">
              piano
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-violet-100">
              synth
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-violet-100">
              vocal
            </Badge>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
