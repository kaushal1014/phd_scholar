"use client"
import React from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, FileText, Users, GraduationCap, BookOpen, FileCheck, ScrollText, ExternalLink } from "lucide-react"

export default function ResourcesPage() {
  const resourceCategories = [
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
      title: "Course Work Syllabus",
      icon: BookOpen,
      description: "Detailed syllabus for various engineering disciplines",
      items: [
        { href: "pdf/relatedInformation/courseWork/CSE.docx", text: "Computer Science Engineering" },
        { href: "pdf/relatedInformation/courseWork/Maths.docx", text: "Mathematics" },
        { href: "pdf/relatedInformation/courseWork/Physics.docx", text: "Physics" },
        { href: "pdf/relatedInformation/courseWork/Chemistry.docx", text: "Chemistry" },
        { href: "pdf/relatedInformation/courseWork/EEE.docx", text: "Electrical and Electronics Engineering" },
        { href: "pdf/relatedInformation/courseWork/#", text: "Biotechnology Engineering" },
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
          href: "pdf/relatedInformation/PhD_Proposal_Defense/Proposal-Defense-Synopsis_format.docx",
          text: "Proposal Defense Synopsis Format",
        },
        {
          href: "pdf/relatedInformation/PhD_Proposal_Defense/research-proposal-format-.docx",
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
      items: [
        { href: "pdf/relatedInformation/PhD_Proposal_Defense/PhD_Thesis_Format.zip", text: "Ph.D. Thesis Format" },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <header className="bg-gradient-to-r from-[#1B3668] to-[#0A2240] shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white">Related Information and Resources</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resourceCategories.map((category, index) => (
            <Card
              key={index}
              className="flex flex-col bg-gradient-to-br from-white via-blue-50 to-orange-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 shadow-lg"
              title={`${category.title} resources`}
            >
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <category.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  <CardTitle>{category.title}</CardTitle>
                </div>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2">
                  {category.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <Link
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        <ArrowRight className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>{item.text}</span>
                        <ExternalLink className="h-4 w-4 ml-1 flex-shrink-0" aria-label="Opens in a new tab" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button
            asChild
            size="lg"
            className="bg-blue-600 hover:bg-orange-500 text-white transition-colors duration-200"
          >
            <Link href="/">
              <ScrollText className="mr-2 h-5 w-5" />
              Back to Main Page
            </Link>
          </Button>
        </div>
      </main>
    </div>
  )
}

