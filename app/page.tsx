"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResortList } from "@/components/resort-list"
import { ResortMap } from "@/components/resort-map"
import { FilterPanel } from "@/components/filter-panel"
import { enrichResortsWithUGC } from "@/lib/storage"
import type { Resort, ResortWithUGC, Filters } from "@/lib/types"
import resortsData from "@/data/resorts.json"
import { List, Map, Mountain } from "lucide-react"

export default function HomePage() {
  const [resorts, setResorts] = useState<ResortWithUGC[]>([])
  const [filters, setFilters] = useState<Filters>({
    difficulty: [],
    price: [],
    hasCoaching: null,
  })
  const [updateTrigger, setUpdateTrigger] = useState(0)

  useEffect(() => {
    const enrichedResorts = enrichResortsWithUGC(resortsData as Resort[])
    setResorts(enrichedResorts)
  }, [updateTrigger])

  const handleUpdate = () => {
    setUpdateTrigger((prev) => prev + 1)
  }

  const filteredResorts = resorts.filter((resort) => {
    if (filters.difficulty.length > 0) {
      const hasMatchingDifficulty = filters.difficulty.some((level) => resort.difficulty.includes(level))
      if (!hasMatchingDifficulty) return false
    }

    if (filters.price.length > 0) {
      if (!filters.price.includes(resort.price)) return false
    }

    if (filters.hasCoaching !== null) {
      if (resort.hasCoaching !== filters.hasCoaching) return false
    }

    return true
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Mountain className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-balance">🎿 Snow Resort Map</h1>
              <p className="text-sm text-muted-foreground">Discover the best ski resorts across Asia</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          {/* Filters - Desktop Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <FilterPanel filters={filters} onFiltersChange={setFilters} resultCount={filteredResorts.length} />
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="space-y-4">
            {/* Filters - Mobile */}
            <div className="lg:hidden">
              <FilterPanel filters={filters} onFiltersChange={setFilters} resultCount={filteredResorts.length} />
            </div>

            {/* Tabs */}
            <Tabs defaultValue="list" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="list" className="gap-2">
                  <List className="h-4 w-4" />
                  List View
                </TabsTrigger>
                <TabsTrigger value="map" className="gap-2">
                  <Map className="h-4 w-4" />
                  Map View
                </TabsTrigger>
              </TabsList>

              <TabsContent value="list" className="mt-6">
                <ResortList resorts={filteredResorts} onUpdate={handleUpdate} />
              </TabsContent>

              <TabsContent value="map" className="mt-6">
                <div className="rounded-lg overflow-hidden border bg-card">
                  <ResortMap resorts={filteredResorts} onUpdate={handleUpdate} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-12 py-6 bg-card/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Snow Resort Map · Find your perfect ski destination</p>
        </div>
      </footer>
    </div>
  )
}
