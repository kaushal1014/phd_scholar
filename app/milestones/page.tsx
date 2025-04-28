"use client"

import React, { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowDown, BookOpen, GraduationCap, Microscope, PenTool, Award, Moon, Sun } from "lucide-react"
import Confetti from "react-confetti"

type Milestone = {
  id: string
  label: string
  icon: React.ElementType
}

const milestones: Milestone[] = [
  { id: "admission", label: "Admission to PhD Program", icon: GraduationCap },
  { id: "supervisor", label: "Supervisor Allotment & DC Formation", icon: PenTool },
  { id: "coursework", label: "Course Work", icon: BookOpen },
  { id: "ce", label: "Comprehensive Examination (CE)", icon: Microscope },
  { id: "pd", label: "Proposal Defense (PD)", icon: PenTool },
  { id: "openSeminar", label: "Open Seminar - 1", icon: Microscope },
  { id: "preSub", label: "Pre-Submission Seminar", icon: BookOpen },
  { id: "synopsis", label: "Synopsis and Thesis Submission", icon: PenTool },
  { id: "defense", label: "Thesis Defense", icon: Microscope },
  { id: "award", label: "Award of Degree", icon: Award },
]

type MilestoneBoxProps = {
  milestone: Milestone
  isActive: boolean
  isCompleted: boolean
}

const MilestoneBox: React.FC<MilestoneBoxProps> = ({ milestone, isActive, isCompleted }) => {
  const Icon = milestone.icon
  return (
    <div
      className={`relative border-2 rounded-lg p-6 pt-8 mb-6 transition-all ${
        isActive
          ? "bg-gradient-to-br from-purple-100 to-purple-50 border-purple-500 shadow-lg dark:from-purple-900 dark:to-purple-800 dark:border-purple-400"
          : isCompleted
            ? "bg-gradient-to-br from-green-100 to-green-50 border-green-500 dark:from-green-900 dark:to-green-800 dark:border-green-400"
            : "bg-gradient-to-br from-gray-100 to-white border-gray-300 dark:from-gray-800 dark:to-gray-700 dark:border-gray-600"
      }`}
    >
      {isActive && (
        <div className="absolute left-0 top-0 bg-purple-500 text-white px-2 py-1 text-xs font-semibold rounded-tl-md rounded-br-md">
          Current Stage
        </div>
      )}
      <div className="flex items-center mt-6">
        <div className="mr-4">
          <Icon
            className={`${
              isActive
                ? "text-purple-600 dark:text-purple-300"
                : isCompleted
                  ? "text-green-600 dark:text-green-300"
                  : "text-gray-500 dark:text-gray-400"
            }`}
            size={32}
          />
        </div>
        <div>
          <p
            className={`text-lg font-semibold ${
              isActive
                ? "text-purple-800 dark:text-purple-200"
                : isCompleted
                  ? "text-green-800 dark:text-green-200"
                  : "text-gray-800 dark:text-gray-200"
            }`}
          >
            {milestone.label}
          </p>
          {milestone.id === "coursework" && (
            <div className="text-sm mt-2 text-gray-700 dark:text-gray-300">
              <p>• Research Methodology & Technical Communication (RMTC) (4-Credits)</p>
              <p>• Research & Publication Ethics (RPE) (2-Credits)</p>
              <p>• 2 Research related courses (4-credit each)</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const PhDMilestoneFlowchart: React.FC = () => {
  const [currentMilestone, setCurrentMilestone] = useState<string>("admission")
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false)
  const [showConfetti, setShowConfetti] = useState<boolean>(false)

  useEffect(() => {
    if (currentMilestone === "award") {
      setShowConfetti(true)
      const timer = setTimeout(() => setShowConfetti(false), 10000) // Stop confetti after 10 seconds
      return () => clearTimeout(timer)
    }
  }, [currentMilestone])

  const handleMilestoneChange = (value: string) => {
    if (currentMilestone !== "award") {
      setCurrentMilestone(value)
    }
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
      {showConfetti && <Confetti />}
      <Card className="max-w-4xl mx-auto p-4 sm:p-8 bg-gradient-to-br from-gray-50 to-white shadow-xl dark:from-gray-900 dark:to-gray-800 dark:text-white w-full">
        <CardHeader className="flex flex-col sm:flex-row items-center justify-between">
          <CardTitle className="text-xl sm:text-3xl font-bold text-center mb-4 sm:mb-8 text-gray-800 dark:text-white w-full">
            PhD Scholar's Journey
          </CardTitle>
        </CardHeader>
        <div className="max-w-md mx-auto mb-6 sm:mb-8 w-full">
          <Select
            value={currentMilestone}
            onValueChange={handleMilestoneChange}
            disabled={currentMilestone === "award"}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select your current milestone" />
            </SelectTrigger>
            <SelectContent>
              {milestones.map((milestone) => (
                <SelectItem key={milestone.id} value={milestone.id}>
                  {milestone.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <CardContent>
          <div className="relative pl-0 sm:pl-16 mt-8 sm:mt-12 w-full">
            {milestones.map((milestone, index) => (
              <React.Fragment key={milestone.id}>
                <MilestoneBox
                  milestone={milestone}
                  isActive={currentMilestone === milestone.id}
                  isCompleted={milestones.findIndex((m) => m.id === currentMilestone) > index}
                />
                {index < milestones.length - 1 && (
                  <div className="flex justify-center my-2 sm:my-4">
                    <ArrowDown className="text-gray-400 dark:text-gray-500" size={24} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
        {currentMilestone === "award" && (
          <div className="text-center mt-6 sm:mt-8 text-xl sm:text-2xl font-bold text-purple-600 dark:text-purple-300 animate-pulse">
            Congratulations on completing your PhD journey!
          </div>
        )}
      </Card>
    </div>
  )
}

export default PhDMilestoneFlowchart

