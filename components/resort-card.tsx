"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Users, Star, TrendingUp } from "lucide-react"
import type { ResortWithUGC } from "@/lib/types"
import { incrementCheckins } from "@/lib/storage"
import Image from "next/image"

interface ResortCardProps {
  resort: ResortWithUGC
  onUpdate: () => void
}

export function ResortCard({ resort, onUpdate }: ResortCardProps) {
  const handleViewDetails = () => {
    incrementCheckins(resort.id)
    onUpdate()

    // Simulate WordPress redirect
    window.open(`/blog/ski/${resort.slug}`, "_blank")
  }

  const difficultyLabels = {
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={resort.image || "/placeholder.svg"}
          alt={resort.name}
          fill
          className="object-cover"
          loading="lazy"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <Badge variant="secondary" className="bg-background/90 backdrop-blur">
            {resort.price}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg leading-tight text-balance">{resort.name}</h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
            <MapPin className="h-3.5 w-3.5" />
            <span>
              {resort.region}, {resort.country}
            </span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">{resort.description}</p>

        <div className="flex flex-wrap gap-1.5">
          {resort.difficulty.map((level) => (
            <Badge key={level} variant="outline" className="text-xs">
              {difficultyLabels[level]}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{resort.checkins}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Star className="h-4 w-4 fill-current text-yellow-500" />
              <span>{resort.rating.toFixed(1)}</span>
            </div>
          </div>

          <Button size="sm" onClick={handleViewDetails} className="gap-1.5">
            <TrendingUp className="h-3.5 w-3.5" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
