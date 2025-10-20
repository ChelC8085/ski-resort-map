"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import type { Filters } from "@/lib/types"
import { X } from "lucide-react"

interface FilterPanelProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
  resultCount: number
}

export function FilterPanel({ filters, onFiltersChange, resultCount }: FilterPanelProps) {
  const toggleDifficulty = (level: "beginner" | "intermediate" | "advanced") => {
    const newDifficulty = filters.difficulty.includes(level)
      ? filters.difficulty.filter((d) => d !== level)
      : [...filters.difficulty, level]

    onFiltersChange({ ...filters, difficulty: newDifficulty })
  }

  const togglePrice = (price: "$" | "$$" | "$$$") => {
    const newPrice = filters.price.includes(price)
      ? filters.price.filter((p) => p !== price)
      : [...filters.price, price]

    onFiltersChange({ ...filters, price: newPrice })
  }

  const toggleCoaching = () => {
    onFiltersChange({
      ...filters,
      hasCoaching: filters.hasCoaching === true ? null : true,
    })
  }

  const clearFilters = () => {
    onFiltersChange({
      difficulty: [],
      price: [],
      hasCoaching: null,
    })
  }

  const hasActiveFilters = filters.difficulty.length > 0 || filters.price.length > 0 || filters.hasCoaching !== null

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Filters</CardTitle>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 gap-1">
              <X className="h-3.5 w-3.5" />
              Clear
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          {resultCount} {resultCount === 1 ? "resort" : "resorts"} found
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Difficulty Level</Label>
          <div className="space-y-2">
            {(["beginner", "intermediate", "advanced"] as const).map((level) => (
              <div key={level} className="flex items-center space-x-2">
                <Checkbox
                  id={`difficulty-${level}`}
                  checked={filters.difficulty.includes(level)}
                  onCheckedChange={() => toggleDifficulty(level)}
                />
                <Label htmlFor={`difficulty-${level}`} className="text-sm font-normal cursor-pointer capitalize">
                  {level}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Price Range</Label>
          <div className="flex gap-2">
            {(["$", "$$", "$$$"] as const).map((price) => (
              <Badge
                key={price}
                variant={filters.price.includes(price) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => togglePrice(price)}
              >
                {price}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Coaching</Label>
          <div className="flex items-center space-x-2">
            <Checkbox id="coaching" checked={filters.hasCoaching === true} onCheckedChange={toggleCoaching} />
            <Label htmlFor="coaching" className="text-sm font-normal cursor-pointer">
              Has coaching services
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
