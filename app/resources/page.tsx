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
  Loader2,
  Plus,
  Trash2,
  Upload,
} from "lucide-react"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { toast } from "react-toastify"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

interface File {
  name: string;
  path: string;
  isAdmin: boolean;
}

interface ResourceCategory {
  title: string;
  items: File[];
  icon?: string;
  description?: string;
}

interface UserType {
  _id: string;
  name: string;
  email: string;
  role: string;
  isAdmin?: boolean;
  isSupervisor?: boolean;
}

interface Resources {
  [key: string]: File[];
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resources>({})
  const [loading, setLoading] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [hoverCategory, setHoverCategory] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const { data: session } = useSession()

  const allCategories: ResourceCategory[] = [
    { title: "General Information", items: [], icon: "info", description: "General information about the Ph.D. program" },
    { title: "Doctoral Committee Meetings", items: [], icon: "group", description: "Documents related to doctoral committee meetings" },
    { title: "Ph.D. Proposal Defense", items: [], icon: "description", description: "Guidelines and templates for proposal defense" },
    { title: "Ph.D. Comprehensive Exam", items: [], icon: "assignment", description: "Information about comprehensive examinations" },
    { title: "Ph.D. Synopsis Submission", items: [], icon: "book", description: "Guidelines for synopsis submission" },
    { title: "Ph.D. Thesis Format", items: [], icon: "format_align_center", description: "Thesis format guidelines and templates" },
    { title: "Course Work Syllabus", items: [], icon: "school", description: "Course work related documents and syllabi" }
  ]

  const displayCategory = activeCategory || hoverCategory

  const fetchFiles = async () => {
    if (!displayCategory) return
    try {
      setLoading(true)
      const response = await fetch('/api/resources/list?category=' + encodeURIComponent(displayCategory))
      if (!response.ok) {
        throw new Error('Failed to fetch files')
      }
      const data = await response.json()
      if (data.files) {
        setResources(prev => ({
          ...prev,
          [displayCategory]: data.files.map((file: any) => ({
            name: file.name.replace(/\.[^/.]+$/, ""),
            path: `/api/resources/download?path=${encodeURIComponent(file.path)}`,
            isAdmin: data.isAdmin
          }))
        }))
      }
    } catch (error) {
      console.error('Error fetching files:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (displayCategory) {
      fetchFiles()
    }
  }, [displayCategory])

  const handleFileClick = (file: File) => {
    setSelectedFile(file)
  }

  const handleFileDelete = async (file: File) => {
    if (!session?.user?.isAdmin) return
    try {
      const response = await fetch('/api/resources/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path: file.path }),
      })
      if (!response.ok) throw new Error('Failed to delete file')
      await fetchFiles()
    } catch (error) {
      console.error('Error deleting file:', error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Category Tree */}
        <div className="md:col-span-1">
          <h2 className="text-xl font-semibold mb-4">Categories</h2>
          <div className="space-y-2">
            {allCategories.map((category) => (
              <div
                key={category.title}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  displayCategory === category.title
                    ? 'bg-blue-100 text-blue-700'
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => setActiveCategory(category.title)}
                onMouseEnter={() => setHoverCategory(category.title)}
                onMouseLeave={() => setHoverCategory(null)}
              >
                <div className="flex items-center">
                  {category.icon && (
                    <span className="material-icons mr-2">{category.icon}</span>
                  )}
                  <span>{category.title}</span>
                </div>
                {category.description && (
                  <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* File List */}
        <div className="md:col-span-3">
          <h2 className="text-xl font-semibold mb-4">
            {displayCategory ? `${displayCategory} Files` : 'Select a Category'}
          </h2>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {displayCategory && resources[displayCategory]?.map((file) => (
                <div
                  key={file.path}
                  className="flex items-center justify-between p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-4">
                    <span className="material-icons text-gray-600">description</span>
                    <a
                      href={file.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => handleFileClick(file)}
                    >
                      {file.name}
                    </a>
                  </div>
                  {session?.user?.isAdmin && file.isAdmin && (
                    <button
                      onClick={() => handleFileDelete(file)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <span className="material-icons">delete</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

