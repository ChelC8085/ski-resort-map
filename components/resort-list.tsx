"use client"

import { useState } from "react"
import { ResortCard } from "./resort-card"
import type { ResortWithUGC } from "@/lib/types"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ResortListProps {
  resorts: ResortWithUGC[]
  onUpdate: () => void
}

export function ResortList({ resorts, onUpdate }: ResortListProps) {
  const [expandedRegions, setExpandedRegions] = useState<Set<string>>(new Set())

  // Group resorts by country
  const groupedResorts = resorts.reduce(
    (acc, resort) => {
      if (!acc[resort.country]) {
        acc[resort.country] = []
      }
      acc[resort.country].push(resort)
      return acc
    },
    {} as Record<string, ResortWithUGC[]>,
  )

  const toggleRegion = (country: string) => {
    setExpandedRegions((prev) => {
      const next = new Set(prev)
      if (next.has(country)) {
        next.delete(country)
      } else {
        next.add(country)
      }
      return next
    })
  }

  if (resorts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No resorts match your filters</p>
        <p className="text-sm text-muted-foreground mt-2">Try adjusting your search criteria</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedResorts).map(([country, countryResorts]) => {
        const isExpanded = expandedRegions.has(country)

        return (
          <div key={country} className="space-y-3">
            <Button
              variant="ghost"
              className="w-full justify-between p-3 h-auto hover:bg-muted/50"
              onClick={() => toggleRegion(country)}
            >
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">{country}</h2>
                <span className="text-sm text-muted-foreground">
                  ({countryResorts.length} {countryResorts.length === 1 ? "resort" : "resorts"})
                </span>
              </div>
              {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </Button>

            {isExpanded && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {countryResorts.map((resort) => (
                  <ResortCard key={resort.id} resort={resort} onUpdate={onUpdate} />
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
