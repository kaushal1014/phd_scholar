"use client"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  FileText,
  BookOpen,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Users,
  GraduationCap,
  FileCheck,
  ScrollText,
} from "lucide-react"
import { useState } from "react"

const standardProtocols = [
  {
    title: "General Information",
    icon: FileText,
    description: "Essential documents and guidelines for PhD scholars",
    items: [
      { href: "pdf/relatedInformation/General_Information/PES_Research_Policy.pdf", text: "Research Policy" },
      { href: "pdf/relatedInformation/General_Information/PES_Research_Policy.pdf", text: "Rules and Regulations" },
      {
        href: "pdf/relatedInformation/General_Information/2021_Amendments_Regulations.pdf",
        text: "Amendments to R&R",
      },
      { href: "pdf/relatedInformation/General_Information/Fee_Structure.pdf", text: "Fee Structure" },
      {
        href: "pdf/relatedInformation/General_Information/Guidelines_to_PhD-candidates-1.pdf",
        text: "Guidelines to PhD Scholars",
      },
    ],
  },
  {
    title: "Doctoral Committee Meetings",
    icon: Users,
    description: "Information about DC meetings and progress reports",
    items: [
      { href: "pdf/relatedInformation/dcM/DCMeetings.pdf", text: "DC Meetings" },
      { href: "pdf/relatedInformation/dcM/Half_Yearly_Progress_report.pdf", text: "Half Yearly Progress Report" },
    ],
  },
  {
    title: "Ph.D. Proposal Defense",
    icon: GraduationCap,
    description: "Guidance for preparing and presenting your research proposal",
    items: [
      {
        href: "pdf/relatedInformation/PhD_Proposal_Defense/Tips_to_prepare_for_ProposalDefense.pdf",
        text: "Tips to prepare for Proposal Defense",
      },
      {
        href: "pdf/relatedInformation/PhD_Proposal_Defense/Proposal-Defense-Synopsis_format.pdf",
        text: "Proposal Defense Synopsis Format",
      },
      {
        href: "pdf/relatedInformation/PhD_Proposal_Defense/research-proposal-format-.pdf",
        text: "Research Proposal Format",
      },
    ],
  },
  {
    title: "Ph.D. Comprehensive Exam",
    icon: BookOpen,
    description: "Details about the comprehensive exam process",
    items: [{ href: "pdf/relatedInformation/PhD_Proposal_Defense/CE_Format.pdf", text: "Ph.D. Comprehensive Exam" }],
  },
  {
    title: "Ph.D. Synopsis Submission",
    icon: FileCheck,
    description: "Instructions for submitting your Ph.D. synopsis",
    items: [{ href: "#", text: "Ph.D. Synopsis Submission" }],
  },
  {
    title: "Ph.D. Thesis Format",
    icon: ScrollText,
    description: "Formatting guidelines for your Ph.D. thesis",
    items: [{ href: "pdf/relatedInformation/PhD_Proposal_Defense/PhD_Thesis_Format.zip", text: "Ph.D. Thesis Format" }],
  },
]

const courseWorkSyllabus = {
  title: "Course Work Syllabus",
  icon: BookOpen,
  description: "Detailed syllabus for various engineering disciplines",
  items: [
    { href: "pdf/relatedInformation/courseWork/CSE.pdf", text: "Computer Science Engineering" },
    { href: "pdf/relatedInformation/courseWork/Maths.pdf", text: "Mathematics" },
    { href: "pdf/relatedInformation/courseWork/Physics.pdf", text: "Physics" },
    { href: "pdf/relatedInformation/courseWork/Chemistry.pdf", text: "Chemistry" },
    { href: "pdf/relatedInformation/courseWork/EEE.pdf", text: "Electrical and Electronics Engineering" },
    { href: "#", text: "Biotechnology Engineering" },
  ],
}

export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [hoverCategory, setHoverCategory] = useState<string | null>(null)

  // Combine all categories for the tree view
  const allCategories = [...standardProtocols, courseWorkSyllabus]

  // The category to display items for (either clicked or hovered)
  const displayCategory = activeCategory || hoverCategory

  // Find the category object that matches the current display category
  const currentCategory = allCategories.find((cat) => cat.title === displayCategory)

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <header className="bg-gradient-to-r from-[#1B3668] to-[#0A2240] shadow">
        <div className="max-w-7xl mx-auto py-8 px-2 sm:py-10 sm:px-4 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Resources & Information</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-2 sm:py-16 sm:px-4 lg:px-8">
        <Card className="group overflow-hidden border-[#E5E7EB] bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="border-b bg-[#F9FAFB] p-4 sm:p-6">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="rounded-full bg-[#4C1D95]/10 p-2 sm:p-3">
                <FileText className="h-7 w-7 sm:h-8 sm:w-8 text-[#4C1D95]" />
              </div>
              <div>
                <CardTitle className="text-lg sm:text-2xl font-bold text-[#1F2937]">Ph.D. Resources & Information</CardTitle>
                <CardDescription className="text-sm sm:text-base mt-1 text-[#6B7280]">
                  Browse through our comprehensive collection of resources for Ph.D. scholars
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
              {/* Left side - Category tree */}
              <div className="w-full md:w-1/3 border rounded-lg overflow-hidden mb-4 md:mb-0">
                <div className="p-3 sm:p-4 bg-[#F9FAFB] border-b">
                  <h3 className="text-base sm:text-lg font-semibold text-[#1F2937]">Resource Categories</h3>
                </div>
                <ul className="divide-y max-h-64 sm:max-h-none overflow-y-auto">
                  {allCategories.map((category, index) => (
                    <li
                      key={index}
                      className={`transition-colors ${displayCategory === category.title ? "bg-[#4C1D95]/10" : "hover:bg-[#F3F4F6]"}`}
                    >
                      <button
                        className="w-full flex items-center p-3 sm:p-4 text-left"
                        onClick={() => setActiveCategory(activeCategory === category.title ? null : category.title)}
                        onMouseEnter={() => setHoverCategory(category.title)}
                        onMouseLeave={() => setHoverCategory(null)}
                      >
                        <div className="rounded-full bg-[#4C1D95]/10 p-1.5 sm:p-2 mr-2 sm:mr-3">
                          <category.icon className="h-4 w-4 sm:h-5 sm:w-5 text-[#4C1D95]" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-[#1F2937] text-sm sm:text-base">{category.title}</h4>
                          <p className="text-xs sm:text-xs text-[#6B7280] line-clamp-1">{category.description}</p>
                        </div>
                        <ChevronRight
                          className={`h-4 w-4 sm:h-5 sm:w-5 text-[#4C1D95] transition-transform ${displayCategory === category.title ? "rotate-90" : ""}`}
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right side - Items for selected category */}
              <div className="w-full md:w-2/3 border rounded-lg overflow-hidden">
                {currentCategory ? (
                  <>
                    <div className="p-3 sm:p-4 bg-[#F9FAFB] border-b">
                      <div className="flex items-center">
                        <div className="rounded-full bg-[#4C1D95]/10 p-1.5 sm:p-2 mr-2 sm:mr-3">
                          <currentCategory.icon className="h-4 w-4 sm:h-5 sm:w-5 text-[#4C1D95]" />
                        </div>
                        <div>
                          <h3 className="text-base sm:text-lg font-semibold text-[#1F2937]">{currentCategory.title}</h3>
                          <p className="text-xs sm:text-sm text-[#6B7280]">{currentCategory.description}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 sm:p-4">
                      <ul className="grid grid-cols-1 gap-2 sm:gap-3">
                        {currentCategory.items.map((item, itemIndex) => (
                          <li key={itemIndex}>
                            <Link
                              href={item.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center p-2 sm:p-3 rounded-lg text-[#1F2937] bg-[#F9FAFB] hover:bg-[#4C1D95]/10 hover:text-[#4C1D95] transition-all duration-200 group/item"
                            >
                              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 flex-shrink-0 transition-transform duration-200 group-hover/item:translate-x-1" />
                              <span className="font-medium text-sm sm:text-base">{item.text}</span>
                              <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5 ml-auto text-[#4C1D95]" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-6">
                    <BookOpen className="h-10 w-10 text-[#4C1D95] mb-4" />
                    <h3 className="text-base sm:text-lg font-semibold text-[#1F2937] mb-2 text-center">Select a resource category to view documents</h3>
                    <p className="text-xs sm:text-sm text-[#6B7280] text-center">Browse the categories on the left to see available resources and information for Ph.D. scholars.</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-16 text-center">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="group rounded-full px-8 border-[#4C1D95] text-[#4C1D95] hover:bg-[#4C1D95] hover:text-white"
          >
            <Link href="/">
              <ChevronLeft className="mr-2 h-5 w-5 transition-transform duration-200 group-hover:-translate-x-1" />
              Back to Main Page
            </Link>
          </Button>
        </div>
      </main>
    </div>
  )
}

