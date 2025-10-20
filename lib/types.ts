export interface Resort {
  id: string
  name: string
  slug: string
  country: string
  region: string
  lat: number
  lng: number
  elevation: string
  description: string
  image: string
  difficulty: ("beginner" | "intermediate" | "advanced")[]
  season: string
  price: "$" | "$$" | "$$$"
  hasCoaching: boolean
  checkinsSeed: number
  ratingSeed: number
}

export interface ResortWithUGC extends Resort {
  checkins: number
  rating: number
}

export interface Filters {
  difficulty: ("beginner" | "intermediate" | "advanced")[]
  price: ("$" | "$$" | "$$$")[]
  hasCoaching: boolean | null
}
