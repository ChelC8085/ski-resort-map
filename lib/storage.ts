import type { Resort, ResortWithUGC } from "./types"

const STORAGE_KEY = "snow-resort-ugc"

interface UGCData {
  [resortId: string]: {
    checkins: number
    rating: number
  }
}

export function getUGCData(): UGCData {
  if (typeof window === "undefined") return {}

  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : {}
  } catch {
    return {}
  }
}

export function saveUGCData(data: UGCData): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error("Failed to save UGC data:", error)
  }
}

export function incrementCheckins(resortId: string): void {
  const data = getUGCData()

  if (!data[resortId]) {
    data[resortId] = { checkins: 0, rating: 0 }
  }

  data[resortId].checkins += 1
  saveUGCData(data)
}

export function updateRating(resortId: string, rating: number): void {
  const data = getUGCData()

  if (!data[resortId]) {
    data[resortId] = { checkins: 0, rating }
  } else {
    data[resortId].rating = rating
  }

  saveUGCData(data)
}

export function enrichResortsWithUGC(resorts: Resort[]): ResortWithUGC[] {
  const ugcData = getUGCData()

  return resorts.map((resort) => ({
    ...resort,
    checkins: ugcData[resort.id]?.checkins ?? resort.checkinsSeed,
    rating: ugcData[resort.id]?.rating ?? resort.ratingSeed,
  }))
}
