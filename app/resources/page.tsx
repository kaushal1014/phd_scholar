"use client"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, FileText, BookOpen, ExternalLink, ChevronLeft, ChevronRight, Users, GraduationCap, FileCheck, ScrollText } from "lucide-react"
import { useState } from "react"

export default function ResourcesPage() {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})

  const toggleSection = (title: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [title]: !prev[title]
    }))
  }

  const standardProtocols = [
    {
      title: "General Information",
      icon: FileText,
      description: "Essential documents and guidelines for PhD scholars",
      items: [
        { href: "pdf/relatedInformation/General_Information/PES_Research_Policy.pdf", text: "Research Policy" },
        { href: "pdf/relatedInformation/General_Information/PES_Research_Policy.pdf", text: "Rules and Regulations" },
        { href: "pdf/relatedInformation/General_Information/2021_Amendments_Regulations.pdf", text: "Amendments to R&R" },
        { href: "pdf/relatedInformation/General_Information/Fee_Structure.pdf", text: "Fee Structure" },
        { href: "pdf/relatedInformation/General_Information/Guidelines_to_PhD-candidates-1.pdf", text: "Guidelines to PhD Scholars" },
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
        { href: "pdf/relatedInformation/PhD_Proposal_Defense/Tips_to_prepare_for_ProposalDefense.pdf", text: "Tips to prepare for Proposal Defense" },
        { href: "pdf/relatedInformation/PhD_Proposal_Defense/Proposal-Defense-Synopsis_format.pdf", text: "Proposal Defense Synopsis Format" },
        { href: "pdf/relatedInformation/PhD_Proposal_Defense/research-proposal-format-.pdf", text: "Research Proposal Format" },
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

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <header className="bg-gradient-to-r from-[#1B3668] to-[#0A2240] shadow">
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white">Resources & Information</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Ph.D. Resources Card */}
        <Card className="group overflow-hidden border-[#E5E7EB] bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="border-b bg-[#F9FAFB] p-6">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-[#4C1D95]/10 p-3">
                <FileText className="h-8 w-8 text-[#4C1D95]" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-[#1F2937]">
                  Ph.D. Resources
                </CardTitle>
                <CardDescription className="text-base mt-1 text-[#6B7280]">
                  Comprehensive information and guidelines for Ph.D. scholars
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {standardProtocols.map((category, index) => (
              <div key={index} className="border-b last:border-b-0 pb-6 last:pb-0">
                <button
                  onClick={() => toggleSection(category.title)}
                  className="w-full flex items-center justify-between text-left"
                >
                  <div className="flex items-center space-x-4">
                    <div className="rounded-full bg-[#4C1D95]/10 p-2">
                      <category.icon className="h-6 w-6 text-[#4C1D95]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[#1F2937]">
                        {category.title}
                      </h3>
                      <p className="text-sm text-[#6B7280]">
                        {category.description}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className={`h-5 w-5 text-[#4C1D95] transition-transform ${
                    expandedSections[category.title] ? 'rotate-90' : ''
                  }`} />
                </button>
                {expandedSections[category.title] && (
                  <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 pl-12">
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex}>
                        <Link
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center p-3 rounded-lg text-[#1F2937] bg-[#F9FAFB] hover:bg-[#4C1D95]/10 hover:text-[#4C1D95] transition-all duration-200 group/item"
                        >
                          <ArrowRight className="h-5 w-5 mr-3 flex-shrink-0 transition-transform duration-200 group-hover/item:translate-x-1" />
                          <span className="font-medium">{item.text}</span>
                          <ExternalLink
                            className="h-4 w-4 ml-auto flex-shrink-0 opacity-0 group-hover/item:opacity-100 transition-opacity duration-200"
                            aria-label="Opens in a new tab"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Course Work Syllabus Card */}
        <Card className="group overflow-hidden border-[#E5E7EB] bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="border-b bg-[#F9FAFB] p-6">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-[#4C1D95]/10 p-3">
                <BookOpen className="h-8 w-8 text-[#4C1D95]" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-[#1F2937]">
                  {courseWorkSyllabus.title}
                </CardTitle>
                <CardDescription className="text-base mt-1 text-[#6B7280]">
                  {courseWorkSyllabus.description}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <button
              onClick={() => toggleSection(courseWorkSyllabus.title)}
              className="w-full flex items-center justify-between text-left"
            >
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-[#4C1D95]/10 p-2">
                  <courseWorkSyllabus.icon className="h-6 w-6 text-[#4C1D95]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#1F2937]">
                    Syllabus Details
                  </h3>
                  <p className="text-sm text-[#6B7280]">
                    View detailed syllabus for various disciplines
                  </p>
                </div>
              </div>
              <ChevronRight className={`h-5 w-5 text-[#4C1D95] transition-transform ${
                expandedSections[courseWorkSyllabus.title] ? 'rotate-90' : ''
              }`} />
            </button>
            {expandedSections[courseWorkSyllabus.title] && (
              <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 pl-12">
                {courseWorkSyllabus.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <Link
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 rounded-lg text-[#1F2937] bg-[#F9FAFB] hover:bg-[#4C1D95]/10 hover:text-[#4C1D95] transition-all duration-200 group/item"
                    >
                      <ArrowRight className="h-5 w-5 mr-3 flex-shrink-0 transition-transform duration-200 group-hover/item:translate-x-1" />
                      <span className="font-medium">{item.text}</span>
                      <ExternalLink
                        className="h-4 w-4 ml-auto flex-shrink-0 opacity-0 group-hover/item:opacity-100 transition-opacity duration-200"
                        aria-label="Opens in a new tab"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
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