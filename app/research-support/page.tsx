"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Loader2, BookOpen, FileText, Users, Calendar, Award, GraduationCap, Library, Building, Globe, Shield, Lightbulb, IndianRupee } from "lucide-react"

interface UserType {
  _id: string
  name: string
  email: string
  role: string
  isAdmin?: boolean
  isSupervisor?: boolean
}

export default function ResearchSupportPage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch user data
  const fetchUser = async () => {
    try {
      const response = await fetch("/api/auth/session")
      if (!response.ok) {
        setUser(null)
        return
      }

      const data = await response.json()
      setUser(data.user || null)
    } catch (error) {
      console.error("Error fetching user:", error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-[#1B3668] mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[#1F2937]">Loading Research Support</h3>
          <p className="text-sm text-[#6B7280] mt-2">Please wait while we retrieve the research support information</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#1B3668] py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-3 mb-2">
            <Library className="h-8 w-8 text-[#F59E0B]" />
            <h1 className="text-3xl font-bold text-white">Research Support at PES University</h1>
          </div>
          <p className="text-blue-100">Comprehensive support services for research scholars at PES University</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Financial Support */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <IndianRupee className="h-5 w-5 mr-2 text-[#1B3668]" />
                Financial Support
              </CardTitle>
              <CardDescription>Monthly stipends for research scholars</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-1">
                    <h3 className="font-medium text-[#1B3668]">Ph.D. Scholars</h3>
                    <p className="text-sm text-gray-600">₹27,000/- per month for full-time Ph.D. scholars</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-1">
                    <h3 className="font-medium text-[#1B3668]">Research Assistants</h3>
                    <p className="text-sm text-gray-600">₹15,000/- per month for project-based RAs</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-1">
                    <h3 className="font-medium text-[#1B3668]">Junior Fellowship</h3>
                    <p className="text-sm text-gray-600">₹6,000-12,000/- per month for UG/PG students</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Research Funding */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2 text-[#1B3668]" />
                Research Funding
              </CardTitle>
              <CardDescription>Financial support for research projects</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-[#1B3668] rounded-full mr-2"></span>
                  Special Research Funds (Seed and Growth levels)
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-[#1B3668] rounded-full mr-2"></span>
                  External Grants
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-[#1B3668] rounded-full mr-2"></span>
                  Collaborative Grants
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Infrastructure and Facilities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="h-5 w-5 mr-2 text-[#1B3668]" />
                Infrastructure and Facilities
              </CardTitle>
              <CardDescription>State-of-the-art research facilities</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-[#1B3668] rounded-full mr-2"></span>
                  Access to research labs and equipment
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-[#1B3668] rounded-full mr-2"></span>
                  Software and tools
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-[#1B3668] rounded-full mr-2"></span>
                  Transparent sharing policies
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Research Mentorship */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-[#1B3668]" />
                Research Mentorship
              </CardTitle>
              <CardDescription>Guidance and supervision</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-[#1B3668] rounded-full mr-2"></span>
                  Faculty mentorship programs
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-[#1B3668] rounded-full mr-2"></span>
                  Publication guidance
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-[#1B3668] rounded-full mr-2"></span>
                  Co-author opportunities
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Research Travel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2 text-[#1B3668]" />
                Research Travel
              </CardTitle>
              <CardDescription>Conference and collaboration support</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-[#1B3668] rounded-full mr-2"></span>
                  Travel grant policy
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-[#1B3668] rounded-full mr-2"></span>
                  Faculty exchange programs
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-[#1B3668] rounded-full mr-2"></span>
                  Global collaborations
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Ethics and Transparency */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-[#1B3668]" />
                Ethics and Transparency
              </CardTitle>
              <CardDescription>Research integrity and accountability</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-[#1B3668] rounded-full mr-2"></span>
                  Research ethics standards
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-[#1B3668] rounded-full mr-2"></span>
                  Fund allocation monitoring
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-[#1B3668] rounded-full mr-2"></span>
                  Dean of Research oversight
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Commercialization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-[#1B3668]" />
                Commercialization
              </CardTitle>
              <CardDescription>Innovation and patent support</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-[#1B3668] rounded-full mr-2"></span>
                  Patent support
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-[#1B3668] rounded-full mr-2"></span>
                  Industry partnerships
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-[#1B3668] rounded-full mr-2"></span>
                  Government collaborations
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Contact Section */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Contact Dean of Research</CardTitle>
              <CardDescription>For further details on available funds, application procedures, or collaboration opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <Button asChild className="bg-[#1B3668] hover:bg-[#0A2240]">
                  <a href="mailto:dean.research@pes.edu">Contact Dean of Research</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 