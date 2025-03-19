"use client"

import type React from "react"
import { useState, useRef, useMemo, useCallback, memo, RefObject } from "react"
import { X, Download, Plus, ArrowUp, ArrowDown, PenLine } from "lucide-react"
import html2canvas from "html2canvas-pro"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Memoized Artist Item component to prevent unnecessary re-renders
const ArtistItem = memo(
  ({
    artist,
    index,
    dayArtists,
    artistIndex,
    daysArray,
    onMoveUp,
    onMoveDown,
    onChangeDay,
    onRemove,
  }: {
    artist: { name: string; day: number }
    index: number
    dayArtists: { name: string; day: number }[]
    artistIndex: number
    daysArray: number[]
    onMoveUp: (index: number) => void
    onMoveDown: (index: number) => void
    onChangeDay: (index: number, newDay: number) => void
    onRemove: (index: number) => void
  }) => {
    return (
      <div className="flex items-center bg-muted/50 p-2 rounded">
        <div className="w-12 h-12 flex-shrink-0 flex flex-col items-center justify-center bg-background rounded-md border">
          <span className="text-sm font-bold">{index + 1}</span>
          <span className="text-[10px] leading-tight text-muted-foreground">{artist.name.substring(0, 4)}</span>
        </div>
        <div className="flex-1 ml-3 mr-2 truncate">{artist.name}</div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onMoveUp(artistIndex)}
            disabled={index === 0}
            className="h-8 w-8 flex-shrink-0"
            title="Move up"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onMoveDown(artistIndex)}
            disabled={index === dayArtists.length - 1}
            className="h-8 w-8 flex-shrink-0"
            title="Move down"
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
          <div className="w-16 flex-shrink-0">
            <Select
              value={artist.day.toString()}
              onValueChange={(value) => onChangeDay(artistIndex, Number.parseInt(value))}
            >
              <SelectTrigger className="h-8 w-full text-xs px-2">
                <SelectValue placeholder="Day" />
              </SelectTrigger>
              <SelectContent>
                {daysArray.map((d) => {
                  const dayCount = dayArtists.filter((a) => a.day === d).length
                  const isDisabled = d !== artist.day && dayCount >= 6

                  return (
                    <SelectItem key={d} value={d.toString()} disabled={isDisabled}>
                      Day {d} {isDisabled ? "(Full)" : ""}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(artistIndex)}
            className="h-8 w-8 flex-shrink-0 text-destructive"
            title="Remove artist"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  },
)
ArtistItem.displayName = "ArtistItem"

// Memoized Day Artists component
const DayArtists = memo(
  ({
    day,
    artists,
    daysArray,
    onMoveUp,
    onMoveDown,
    onChangeDay,
    onRemove,
  }: {
    day: number
    artists: { name: string; day: number }[]
    daysArray: number[]
    onMoveUp: (index: number) => void
    onMoveDown: (index: number) => void
    onChangeDay: (index: number, newDay: number) => void
    onRemove: (index: number) => void
  }) => {
    // Filter artists for this day once
    const dayArtists = useMemo(() => artists.filter((artist) => artist.day === day), [artists, day])

    const isAtCapacity = dayArtists.length >= 6

    return (
      <div className="border rounded-md p-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">Day {day}</h3>
          <span className={`text-xs ${isAtCapacity ? "text-destructive" : "text-muted-foreground"}`}>
            {dayArtists.length}/6 artists
          </span>
        </div>

        {dayArtists.length === 0 ? (
          <p className="text-muted-foreground text-sm italic text-center py-2">No artists added for Day {day}</p>
        ) : (
          <div className="space-y-2">
            {dayArtists.map((artist, index) => {
              const artistIndex = artists.findIndex((a) => a.name === artist.name && a.day === artist.day)
              return (
                <ArtistItem
                  key={artistIndex}
                  artist={artist}
                  index={index}
                  dayArtists={dayArtists}
                  artistIndex={artistIndex}
                  daysArray={daysArray}
                  onMoveUp={onMoveUp}
                  onMoveDown={onMoveDown}
                  onChangeDay={onChangeDay}
                  onRemove={onRemove}
                />
              )
            })}
          </div>
        )}
      </div>
    )
  },
)
DayArtists.displayName = "DayArtists"

// Memoized PosterDisplay component
const PosterDisplay = memo(
  ({
    festivalName,
    festivalDate,
    festivalLocation,
    artists,
    daysArray,
    backgroundColor1,
    backgroundColor2,
    isEditing,
    posterRef,
  }: {
    festivalName: string
    festivalDate: string
    festivalLocation: string
    artists: { name: string; day: number }[]
    daysArray: number[]
    backgroundColor1: string
    backgroundColor2: string
    isEditing: boolean
    posterRef: React.RefObject<HTMLDivElement>
  }) => {
    // Generate website and social media handle from festival name
    const websiteName = useMemo(() => festivalName.toLowerCase().replace(/\s+/g, ""), [festivalName])
    const socialHandle = useMemo(() => "@" + websiteName, [websiteName])

    const festivalDays = daysArray.length

    return (
      <div
        ref={posterRef}
        className="festival-poster relative overflow-hidden rounded-lg shadow-xl"
        style={{
          aspectRatio: "2/3",
          width: "100%",
          maxWidth: isEditing ? "100%" : "800px",
          margin: isEditing ? "0" : "0 auto",
          background: `linear-gradient(135deg, ${backgroundColor1}, ${backgroundColor2})`,
        }}
      >
        <div className="absolute inset-0 p-10 flex flex-col text-white">
          <div className="text-center mb-10">
            <h1
              className={`font-extrabold tracking-tight mb-4 drop-shadow-md ${
                isEditing ? "text-4xl md:text-6xl" : "text-5xl md:text-7xl"
              }`}
            >
              {festivalName}
            </h1>
            <div className={`font-semibold mb-2 ${isEditing ? "text-xl md:text-2xl" : "text-2xl md:text-3xl"}`}>
              {festivalDate}
            </div>
            <div className={isEditing ? "text-lg md:text-xl" : "text-xl md:text-2xl"}>{festivalLocation}</div>
          </div>

          <div className="flex-1 flex flex-col">
            {daysArray.length > 1 && (
              <div
                className={`grid gap-y-20 ${
                  festivalDays <= 2 ? "grid-cols-1 md:grid-cols-2 gap-x-20" : "grid-cols-1 md:grid-cols-2 gap-x-20"
                }`}
              >
                {daysArray.map((day) => {
                  const dayArtists = artists.filter((artist) => artist.day === day)

                  return (
                    <div key={day} className="text-center">
                      <h2
                        className={`font-bold border-b border-white/30 mb-6 pb-2 ${
                          isEditing ? "text-xl" : "text-2xl md:text-3xl"
                        }`}
                      >
                        DAY {day}
                      </h2>
                      <div className="space-y-4">
                        {dayArtists.map((artist, artistIndex) => {
                          // Calculate font size based on position and number of days
                          const viewModeMultiplier = isEditing ? 1 : 1.5
                          const baseFontSize = (festivalDays <= 2 ? 2.0 : 1.6) * viewModeMultiplier
                          const decrementRate = (festivalDays <= 2 ? 0.15 : 0.18) * viewModeMultiplier
                          const fontSize = Math.max(0.8, baseFontSize - artistIndex * decrementRate)

                          const fontWeight =
                            artistIndex === 0 ? 800 : artistIndex === 1 ? 700 : artistIndex === 2 ? 600 : 500

                          return (
                            <div
                              key={`${day}-${artistIndex}`}
                              className="text-center"
                              style={{
                                fontSize: `${fontSize}rem`,
                                fontWeight,
                                opacity: Math.max(0.6, 1 - artistIndex * 0.1),
                                lineHeight: 1.3,
                                marginBottom: artistIndex === 0 ? "0.5rem" : "",
                              }}
                            >
                              {artist.name}
                            </div>
                          )
                        })}

                        {dayArtists.length === 0 && (
                          <div className={`italic opacity-70 ${isEditing ? "text-sm" : "text-lg"}`}>No artists</div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {daysArray.length === 1 && (
              <div className="artists-list text-center space-y-5 mt-6">
                {artists
                  .filter((artist) => artist.day === 1)
                  .map((artist, index) => {
                    // Single day gets larger font sizes, even larger in view mode
                    const viewModeMultiplier = isEditing ? 1 : 1.5
                    const fontSize = Math.max(1.0, (2.5 - index * 0.2) * viewModeMultiplier)
                    const fontWeight =
                      index === 0 ? 800 : index === 1 ? 700 : index === 2 ? 600 : index === 3 ? 550 : 500

                    return (
                      <div
                        key={index}
                        className="text-center"
                        style={{
                          fontSize: `${fontSize}rem`,
                          fontWeight,
                          opacity: Math.max(0.7, 1 - index * 0.05),
                          lineHeight: 1.3,
                          marginBottom: index === 0 ? "0.75rem" : index === 1 ? "0.5rem" : "",
                        }}
                      >
                        {artist.name}
                      </div>
                    )
                  })}

                {artists.filter((artist) => artist.day === 1).length === 0 && (
                  <div className={`italic opacity-70 ${isEditing ? "text-xl" : "text-2xl"}`}>No artists added yet</div>
                )}
              </div>
            )}
          </div>

          <div className={`text-center mt-auto mb-4 opacity-80 ${isEditing ? "text-sm" : "text-base"}`}>
            www.{websiteName}.com | {socialHandle}
          </div>
        </div>
      </div>
    )
  },
)
PosterDisplay.displayName = "PosterDisplay"

export function FestivalPoster() {
  const [festivalName, setFestivalName] = useState("YOUR FESTIVAL")
  const [festivalDate, setFestivalDate] = useState("SUMMER 2025")
  const [festivalLocation, setFestivalLocation] = useState("SOMEWHERE AMAZING")
  const [festivalDays, setFestivalDays] = useState(3)
  const [artists, setArtists] = useState<{ name: string; day: number }[]>([
    { name: "HEADLINER 1", day: 1 },
    { name: "HEADLINER 2", day: 2 },
    { name: "ARTIST 3", day: 3 },
    { name: "ARTIST 4", day: 1 },
    { name: "ARTIST 5", day: 2 },
    { name: "ARTIST 6", day: 3 },
  ])
  const [newArtist, setNewArtist] = useState("")
  const [newArtistDay, setNewArtistDay] = useState(1)
  const [backgroundColor1, setBackgroundColor1] = useState("#ff4e50")
  const [backgroundColor2, setBackgroundColor2] = useState("#f9d423")
  const posterRef = useRef<HTMLDivElement>(null)
  const [isEditing, setIsEditing] = useState(true)

  // Generate website and social media handle from festival name - memoized
  const websiteName = useMemo(() => festivalName.toLowerCase().replace(/\s+/g, ""), [festivalName])
  const socialHandle = useMemo(() => "@" + websiteName, [websiteName])

  // Generate days array based on festivalDays - memoized
  const daysArray = useMemo(() => Array.from({ length: festivalDays }, (_, i) => i + 1), [festivalDays])

  // Memoized function to check if a day is at capacity
  const isDayAtCapacity = useCallback(
    (day: number) => {
      return artists.filter((a) => a.day === day).length >= 6
    },
    [artists],
  )

  // Optimized event handlers with useCallback
  const addArtist = useCallback(() => {
    if (newArtist.trim()) {
      if (!isDayAtCapacity(newArtistDay)) {
        setArtists((prevArtists) => [
          ...prevArtists,
          {
            name: newArtist.trim().toUpperCase(),
            day: newArtistDay,
          },
        ])
        setNewArtist("")
      } else {
        alert(`Day ${newArtistDay} already has 6 artists`)
      }
    }
  }, [newArtist, newArtistDay, isDayAtCapacity])

  const moveArtistUp = useCallback((index: number) => {
    setArtists((prevArtists) => {
      const artist = prevArtists[index]
      const sameDay = prevArtists.filter((a) => a.day === artist.day)
      const artistDayIndex = sameDay.findIndex((a) => a.name === artist.name)

      if (artistDayIndex === 0) return prevArtists

      const newArtists = [...prevArtists]
      const prevIndex = prevArtists.findIndex((a) => a.day === artist.day && a === sameDay[artistDayIndex - 1])
      ;[newArtists[prevIndex], newArtists[index]] = [newArtists[index], newArtists[prevIndex]]
      return newArtists
    })
  }, [])

  const moveArtistDown = useCallback((index: number) => {
    setArtists((prevArtists) => {
      const artist = prevArtists[index]
      const sameDay = prevArtists.filter((a) => a.day === artist.day)
      const artistDayIndex = sameDay.findIndex((a) => a.name === artist.name)

      if (artistDayIndex === sameDay.length - 1) return prevArtists

      const newArtists = [...prevArtists]
      const nextIndex = prevArtists.findIndex((a) => a.day === artist.day && a === sameDay[artistDayIndex + 1])
      ;[newArtists[index], newArtists[nextIndex]] = [newArtists[nextIndex], newArtists[index]]
      return newArtists
    })
  }, [])

  const changeArtistDay = useCallback((index: number, newDay: number) => {
    setArtists((prevArtists) => {
      const targetDayArtists = prevArtists.filter((a) => a.day === newDay)
      if (targetDayArtists.length < 6) {
        const newArtists = [...prevArtists]
        newArtists[index] = { ...newArtists[index], day: newDay }
        return newArtists
      } else {
        alert(`Day ${newDay} already has 6 artists`)
        return prevArtists
      }
    })
  }, [])

  const removeArtist = useCallback((index: number) => {
    setArtists((prevArtists) => prevArtists.filter((_, i) => i !== index))
  }, [])

  const toggleEditing = useCallback(() => {
    setIsEditing((prev) => !prev)
  }, [])

  const exportAsPng = useCallback(async () => {
    if (posterRef.current) {
      try {
        const canvas = await html2canvas(posterRef.current, {
          backgroundColor: null,
          scale: 2,
          logging: true, // Helps debug
          useCORS: true, // Avoid cross-origin issues
        });
  
        const image = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = image;
        link.download = `${festivalName.replace(/\s+/g, "-").toLowerCase()}-poster.png`;
        link.click();
      } catch (error) {
        console.error("Error exporting poster:", error);
      }
    }
  }, [festivalName]);

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex justify-end mb-4 gap-2">
        <Button variant="outline" onClick={toggleEditing} className="gap-2 px-4 py-2 h-auto">
          {isEditing ? (
            <>View Poster</>
          ) : (
            <>
              <PenLine className="h-4 w-4" />
              Edit Poster
            </>
          )}
        </Button>
        <Button onClick={exportAsPng} className="px-4 py-2 h-auto">
          <Download className="mr-2 h-4 w-4" />
          Export as PNG
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {isEditing && (
          <Card className="p-6 w-full md:w-2/5 space-y-4 overflow-y-auto max-h-[85vh]">
            <h2 className="text-xl font-bold border-b pb-2">Edit Festival Details</h2>

            <div>
              <label className="block text-sm font-medium mb-1">Festival Name</label>
              <Input
                value={festivalName}
                onChange={(e) => setFestivalName(e.target.value.toUpperCase())}
                placeholder="Festival Name"
                maxLength={30}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Website: www.{websiteName}.com | Social: {socialHandle}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <Input
                value={festivalDate}
                onChange={(e) => setFestivalDate(e.target.value.toUpperCase())}
                placeholder="Date"
                maxLength={20}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <Input
                value={festivalLocation}
                onChange={(e) => setFestivalLocation(e.target.value.toUpperCase())}
                placeholder="Location"
                maxLength={30}
              />
            </div>

            {/* Update the festivalDays slider to limit to 4 days */}
            <div>
              <label className="block text-sm font-medium mb-1">Number of Days</label>
              <div className="flex items-center gap-2">
                <Slider
                  value={[festivalDays]}
                  min={1}
                  max={4}
                  step={1}
                  onValueChange={(value) => setFestivalDays(value[0])}
                  className="flex-1"
                />
                <span className="w-8 text-center">{festivalDays}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Background Colors</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="color1" className="text-xs">
                    Color 1
                  </Label>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded border" style={{ backgroundColor: backgroundColor1 }} />
                    <Input
                      id="color1"
                      type="color"
                      value={backgroundColor1}
                      onChange={(e) => setBackgroundColor1(e.target.value)}
                      className="w-full h-8"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="color2" className="text-xs">
                    Color 2
                  </Label>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded border" style={{ backgroundColor: backgroundColor2 }} />
                    <Input
                      id="color2"
                      type="color"
                      value={backgroundColor2}
                      onChange={(e) => setBackgroundColor2(e.target.value)}
                      className="w-full h-8"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Update the Add Artist section to check capacity before adding */}
            <div>
              <label className="block text-sm font-medium mb-1">Add Artist</label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newArtist}
                  onChange={(e) => setNewArtist(e.target.value)}
                  placeholder="Artist name"
                  onKeyDown={(e) => e.key === "Enter" && addArtist()}
                  className="flex-1"
                />
                <Select
                  value={newArtistDay.toString()}
                  onValueChange={(value) => setNewArtistDay(Number.parseInt(value))}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue placeholder="Day" />
                  </SelectTrigger>
                  <SelectContent>
                    {daysArray.map((day) => {
                      const isDisabled = isDayAtCapacity(day)

                      return (
                        <SelectItem key={day} value={day.toString()} disabled={isDisabled}>
                          Day {day} {isDisabled ? "(Full)" : ""}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
                <Button onClick={addArtist} size="icon" disabled={isDayAtCapacity(newArtistDay)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Artists Lineup section with memoized components */}
            <div>
              <label className="block text-sm font-medium mb-1">Artists Lineup</label>
              <p className="text-xs text-muted-foreground mb-2">
                Each day can have up to 6 artists. Artists at the top will appear larger.
              </p>

              <div className="space-y-6">
                {daysArray.map((day) => (
                  <DayArtists
                    key={day}
                    day={day}
                    artists={artists}
                    daysArray={daysArray}
                    onMoveUp={moveArtistUp}
                    onMoveDown={moveArtistDown}
                    onChangeDay={changeArtistDay}
                    onRemove={removeArtist}
                  />
                ))}
              </div>
            </div>
          </Card>
        )}

        <div className={`w-full ${isEditing ? "md:w-3/5" : "md:w-full"}`}>
          <PosterDisplay
            festivalName={festivalName}
            festivalDate={festivalDate}
            festivalLocation={festivalLocation}
            artists={artists}
            daysArray={daysArray}
            backgroundColor1={backgroundColor1}
            backgroundColor2={backgroundColor2}
            isEditing={isEditing}
            posterRef={posterRef as RefObject<HTMLDivElement>}
          />
        </div>
      </div>
    </div>
  )
}

