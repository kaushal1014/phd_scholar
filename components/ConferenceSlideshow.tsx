import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar, MapPin, Globe } from "lucide-react"

const conferences = [
  {
    name: "International Conference on Advanced Computing",
    date: "2024-09-15",
    location: "Virtual",
    website: "https://example.com/icac2024",
  },
  {
    name: "Global Symposium on Machine Learning and AI",
    date: "2024-10-22",
    location: "New York, USA",
    website: "https://example.com/gsmlai2024",
  },
  {
    name: "European Workshop on Software Engineering",
    date: "2024-11-05",
    location: "Berlin, Germany",
    website: "https://example.com/ewse2024",
  },
]

export function ConferenceSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % conferences.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % conferences.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + conferences.length) % conferences.length)
  }

  return (
    <Card className="border-t-4 border-t-[#F7941D] relative overflow-hidden">
      <CardHeader>
        <CardTitle className="text-[#F7941D] text-xl">Upcoming Conferences</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-[#1B3668] leading-tight">{conferences[currentIndex].name}</h3>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2 text-[#F7941D]" />
            <span>
              {new Date(conferences[currentIndex].date).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2 text-[#F7941D]" />
            <span>{conferences[currentIndex].location}</span>
          </div>
          <a
            href={conferences[currentIndex].website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-[#1B3668] hover:text-[#F7941D] transition-colors"
          >
            <Globe className="w-4 h-4 mr-2" />
            <span>Visit Website</span>
          </a>
        </div>
        <div className="absolute top-1/2 left-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={prevSlide}
            className="text-[#F7941D] hover:text-[#1B3668] transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </div>
        <div className="absolute top-1/2 right-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={nextSlide}
            className="text-[#F7941D] hover:text-[#1B3668] transition-colors"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

