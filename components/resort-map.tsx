"use client"

import { useEffect, useRef } from "react"
import type { ResortWithUGC } from "@/lib/types"
import { incrementCheckins } from "@/lib/storage"

interface ResortMapProps {
  resorts: ResortWithUGC[]
  onUpdate: () => void
}

export function ResortMap({ resorts, onUpdate }: ResortMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current) return

    // Dynamically import Leaflet
    import("leaflet").then((L) => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
      }

      // Initialize map
      const map = L.map(mapRef.current).setView([38, 120], 4)
      mapInstanceRef.current = map

      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map)

      // Custom icon
      const skiIcon = L.divIcon({
        html: "🎿",
        className: "ski-marker",
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      })

      // Add markers
      resorts.forEach((resort) => {
        const marker = L.marker([resort.lat, resort.lng], { icon: skiIcon }).addTo(map)

        const popupContent = `
          <div class="p-3 min-w-[200px]">
            <h3 class="font-semibold text-base mb-1">${resort.name}</h3>
            <p class="text-sm text-gray-600 mb-2">${resort.country} · ${resort.elevation}</p>
            <div class="flex items-center gap-3 text-sm mb-3">
              <span>⭐ ${resort.rating.toFixed(1)}</span>
              <span>👥 ${resort.checkins}</span>
            </div>
            <button 
              onclick="window.handleResortClick('${resort.id}', '${resort.slug}')"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors"
            >
              View Details
            </button>
          </div>
        `

        marker.bindPopup(popupContent, {
          maxWidth: 250,
          className: "resort-popup",
        })
      })

      // Global handler for popup buttons
      ;(window as any).handleResortClick = (resortId: string, slug: string) => {
        incrementCheckins(resortId)
        onUpdate()
        window.open(`/blog/ski/${slug}`, "_blank")
      }
    })

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [resorts, onUpdate])

  return <div ref={mapRef} className="w-full h-full min-h-[400px] lg:min-h-[600px] rounded-lg" />
}
