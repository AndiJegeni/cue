"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Heart, Trash2, PlayCircle, PauseCircle, Download, Filter, X, Music, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock data for sounds
const mockSounds = [
  {
    id: 1,
    name: "Melancholic Piano Loop",
    query: "sad piano with reverb",
    bpm: 85,
    key: "C",
    duration: "0:32",
    date: "2025-04-08",
    liked: true,
  },
  {
    id: 2,
    name: "Underwater Heartbeat",
    query: "underwater heartbeat rhythm",
    bpm: 72,
    key: "F",
    duration: "0:45",
    date: "2025-04-07",
    liked: false,
  },
  {
    id: 3,
    name: "Emotional Strings",
    query: "emotional string section",
    bpm: 90,
    key: "G",
    duration: "1:12",
    date: "2025-04-06",
    liked: true,
  },
  {
    id: 4,
    name: "Distant Memories",
    query: "atmospheric piano memories",
    bpm: 80,
    key: "D",
    duration: "0:58",
    date: "2025-04-05",
    liked: false,
  },
  {
    id: 5,
    name: "Gentle Waves",
    query: "gentle ocean waves ambient",
    bpm: 75,
    key: "A",
    duration: "1:05",
    date: "2025-04-04",
    liked: false,
  },
  {
    id: 6,
    name: "Urban Night",
    query: "urban night city sounds",
    bpm: 95,
    key: "E",
    duration: "1:22",
    date: "2025-04-03",
    liked: true,
  },
  {
    id: 7,
    name: "Forest Ambience",
    query: "forest nature sounds birds",
    bpm: 60,
    key: "B",
    duration: "2:15",
    date: "2025-04-02",
    liked: false,
  },
  {
    id: 8,
    name: "Retro Synth Wave",
    query: "80s retro synth wave",
    bpm: 120,
    key: "F#",
    duration: "1:45",
    date: "2025-04-01",
    liked: true,
  },
]

export default function LibraryInterface() {
  const [searchQuery, setSearchQuery] = useState("")
  const [playing, setPlaying] = useState<number | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [bpmRange, setBpmRange] = useState<[number, number]>([60, 140])
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [likedOnly, setLikedOnly] = useState(false)
  const [sounds, setSounds] = useState(mockSounds)

  const togglePlay = (id: number) => {
    if (playing === id) {
      setPlaying(null)
    } else {
      setPlaying(id)
    }
  }

  const toggleLike = (id: number) => {
    setSounds(sounds.map((sound) => (sound.id === id ? { ...sound, liked: !sound.liked } : sound)))
  }

  const deleteSound = (id: number) => {
    setSounds(sounds.filter((sound) => sound.id !== id))
  }

  const resetFilters = () => {
    setBpmRange([60, 140])
    setSelectedKey(null)
    setLikedOnly(false)
  }

  // Filter sounds based on search query and filters
  const filteredSounds = sounds.filter((sound) => {
    // Search filter
    const matchesSearch =
      searchQuery === "" ||
      sound.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sound.query.toLowerCase().includes(searchQuery.toLowerCase())

    // BPM filter
    const matchesBpm = sound.bpm >= bpmRange[0] && sound.bpm <= bpmRange[1]

    // Key filter
    const matchesKey = selectedKey === null || sound.key === selectedKey

    // Liked filter
    const matchesLiked = !likedOnly || sound.liked

    return matchesSearch && matchesBpm && matchesKey && matchesLiked
  })

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-medium text-gray-600">Your Sound Library</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">{sounds.length} sounds</span>
        </div>
      </div>

      <div className="mb-6 flex justify-end items-center gap-4">
        <div className="relative w-96 max-w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search your library"
            className="pl-10 h-10 border-0 bg-transparent focus:ring-0 shadow-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={`gap-2 ${showFilters ? "bg-gray-100" : ""}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-4">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">
                    BPM Range: {bpmRange[0]} - {bpmRange[1]}
                  </Label>
                </div>
                <Slider
                  min={60}
                  max={200}
                  step={1}
                  value={bpmRange}
                  onValueChange={(value) => setBpmRange(value as [number, number])}
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Key</Label>
                <Select value={selectedKey || ""} onValueChange={(value) => setSelectedKey(value || null)}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="Any key" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any key</SelectItem>
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

              <div className="flex items-center justify-between">
                <Label htmlFor="liked-only" className="text-sm font-medium">
                  Liked sounds only
                </Label>
                <Switch id="liked-only" checked={likedOnly} onCheckedChange={setLikedOnly} />
              </div>

              <div className="flex justify-between pt-2">
                <Button variant="outline" size="sm" onClick={resetFilters}>
                  Reset
                </Button>
                <Button size="sm" onClick={() => setShowFilters(false)}>
                  Apply
                </Button>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Active filters display */}
      {(selectedKey || likedOnly || bpmRange[0] !== 60 || bpmRange[1] !== 140) && (
        <div className="flex flex-wrap gap-2 justify-end mb-4">
          {bpmRange[0] !== 60 || bpmRange[1] !== 140 ? (
            <Badge variant="outline" className="bg-gray-50 gap-1 pl-2 pr-1 py-1">
              <span>
                BPM: {bpmRange[0]}-{bpmRange[1]}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1 hover:bg-gray-200 rounded-full p-0"
                onClick={() => setBpmRange([60, 140])}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ) : null}

          {selectedKey && (
            <Badge variant="outline" className="bg-gray-50 gap-1 pl-2 pr-1 py-1">
              <span>Key: {selectedKey}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1 hover:bg-gray-200 rounded-full p-0"
                onClick={() => setSelectedKey(null)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {likedOnly && (
            <Badge variant="outline" className="bg-gray-50 gap-1 pl-2 pr-1 py-1">
              <span>Liked only</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1 hover:bg-gray-200 rounded-full p-0"
                onClick={() => setLikedOnly(false)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm">
        {filteredSounds.length > 0 ? (
          <div className="divide-y">
            {filteredSounds.map((sound) => (
              <div key={sound.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-full"
                      onClick={() => togglePlay(sound.id)}
                    >
                      {playing === sound.id ? (
                        <PauseCircle className="h-10 w-10 text-black" />
                      ) : (
                        <PlayCircle className="h-10 w-10 text-black" />
                      )}
                    </Button>

                    <div>
                      <h3 className="font-medium">{sound.name}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">"{sound.query}"</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-sm text-gray-500 mr-2">
                      <Music className="h-3.5 w-3.5" />
                      <span>{sound.key}</span>
                    </div>

                    <div className="flex items-center gap-1 text-sm text-gray-500 mr-2">
                      <span>{sound.bpm} BPM</span>
                    </div>

                    <div className="flex items-center gap-1 text-sm text-gray-500 mr-4">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{sound.duration}</span>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-gray-600"
                      onClick={() => toggleLike(sound.id)}
                    >
                      <Heart className={`h-4 w-4 ${sound.liked ? "fill-red-500 text-red-500" : ""}`} />
                    </Button>

                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600">
                      <Download className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-gray-600"
                      onClick={() => deleteSound(sound.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
              <Music className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">No sounds found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {sounds.length > 0
                ? "Try adjusting your filters or search query to find what you're looking for."
                : "Your library is empty. Start searching for sounds to add them to your library."}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
