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

interface ResourceItem {
  href: string;
  text: string;
  isAdmin?: boolean;
}

interface ResourceCategory {
  title: string;
  icon: any;
  description: string;
  dir: string;
  items: ResourceItem[];
}

interface UserType {
  _id: string;
  name: string;
  email: string;
  role: string;
  isAdmin?: boolean;
  isSupervisor?: boolean;
}

// Define the category structure
const categoryStructure: Omit<ResourceCategory, 'items'>[] = [
  {
    title: "General Information",
    icon: FileText,
    description: "Essential documents and guidelines for PhD scholars",
    dir: "General_Information"
  },
  {
    title: "Doctoral Committee Meetings",
    icon: Users,
    description: "Information about DC meetings and progress reports",
    dir: "dcM"
  },
  {
    title: "Ph.D. Proposal Defense",
    icon: GraduationCap,
    description: "Guidance for preparing and presenting your research proposal",
    dir: "PhD_Proposal_Defense"
  },
  {
    title: "Ph.D. Comprehensive Exam",
    icon: BookOpen,
    description: "Details about the comprehensive exam process",
    dir: "Ph.D._Comprehensive_Exam"
  },
  {
    title: "Ph.D. Synopsis Submission",
    icon: FileCheck,
    description: "Instructions for submitting your Ph.D. synopsis",
    dir: "Ph.D._Synopsis_Submission"
  },
  {
    title: "Ph.D. Thesis Format",
    icon: ScrollText,
    description: "Formatting guidelines for your Ph.D. thesis",
    dir: "Ph.D._Thesis_Format"
  },
  {
    title: "Course Work Syllabus",
    icon: BookOpen,
    description: "Detailed syllabus for various engineering disciplines",
    dir: "courseWork"
  }
]

export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [hoverCategory, setHoverCategory] = useState<string | null>(null)
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [fileTitle, setFileTitle] = useState("")
  const [resources, setResources] = useState<ResourceCategory[]>(
    categoryStructure.map(cat => ({ ...cat, items: [] }))
  )
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<UserType | null>(null)

  // Combine all categories for the tree view
  const allCategories = resources

  // The category to display items for (either clicked or hovered)
  const displayCategory = activeCategory || hoverCategory

  // Fetch files for each category
  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/resources/list?category=' + encodeURIComponent(displayCategory || ''))
        if (!response.ok) throw new Error('Failed to fetch files')
        const data = await response.json()
        
        // Update resources with fetched files
        setResources(prevResources => 
          prevResources.map(category => ({
            ...category,
            items: category.title === data.category ? 
              data.files.map((file: any) => ({
                href: `/api/events/download?path=${encodeURIComponent(file.path)}`,
                text: file.name.replace(/\.[^/.]+$/, ''), // Remove file extension
                isAdmin: file.isAdmin
              })) : 
              category.items
          }))
        )
      } catch (error) {
        console.error('Error fetching files:', error)
        toast.error('Failed to load resources')
      } finally {
        setLoading(false)
      }
    }

    if (displayCategory) {
      fetchFiles()
    }
  }, [displayCategory])

  // Find the category object that matches the current display category
  const currentCategory = allCategories.find((cat) => cat.title === displayCategory)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedFile || !selectedCategory || !fileTitle) {
      toast.error("Please fill in all fields")
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append("file", selectedFile)
    formData.append("category", selectedCategory)
    formData.append("title", fileTitle)

    try {
      const response = await fetch("/api/resources/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()
      
      // Update the resources state with the new file
      setResources(prevResources => {
        return prevResources.map(category => {
          if (category.title === selectedCategory) {
            return {
              ...category,
              items: [
                ...category.items,
                {
                  href: `/api/events/download?path=${encodeURIComponent(data.filePath)}`,
                  text: fileTitle,
                  isAdmin: data.isAdmin
                }
              ]
            }
          }
          return category
        })
      })

      toast.success("File uploaded successfully")
      setIsUploadDialogOpen(false)
      setSelectedFile(null)
      setFileTitle("")
      setSelectedCategory(null)
    } catch (error) {
      toast.error("Failed to upload file")
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (filePath: string) => {
    if (!window.confirm("Are you sure you want to delete this file?")) {
      return
    }

    try {
      const response = await fetch("/api/resources/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filePath }),
      })

      if (!response.ok) {
        throw new Error("Delete failed")
      }

      // Update the resources state by removing the deleted file
      setResources(prevResources => {
        return prevResources.map(category => {
          return {
            ...category,
            items: category.items.filter(item => item.href !== filePath)
          }
        })
      })

      toast.success("File deleted successfully")
    } catch (error) {
      toast.error("Failed to delete file")
    }
  }

  const handleCategoryClick = (category: string) => {
    setActiveCategory(activeCategory === category ? null : category)
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <header className="bg-gradient-to-r from-[#1B3668] to-[#0A2240] shadow">
        <div className="max-w-7xl mx-auto py-8 px-2 sm:py-10 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Resources & Information</h1>
            {session?.user?.isAdmin && (
              <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#1B3668] text-white hover:bg-[#0F2341] transition-colors duration-200">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Resource
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload New Resource</DialogTitle>
                    <DialogDescription>
                      Add a new resource to the selected category
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleUpload} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={selectedCategory || ""}
                        onValueChange={setSelectedCategory}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {allCategories.map((category) => (
                            <SelectItem key={category.title} value={category.title}>
                              {category.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={fileTitle}
                        onChange={(e) => setFileTitle(e.target.value)}
                        placeholder="Enter resource title"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="file">File</Label>
                      <Input
                        id="file"
                        type="file"
                        accept=".pdf,.zip"
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                        required
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsUploadDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-[#1B3668] text-white hover:bg-[#0F2341]"
                        disabled={uploading}
                      >
                        {uploading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          "Upload"
                        )}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
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
                        onClick={() => handleCategoryClick(category.title)}
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
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-full p-6">
                    <Loader2 className="h-10 w-10 text-[#4C1D95] mb-4 animate-spin" />
                    <h3 className="text-base sm:text-lg font-semibold text-[#1F2937] mb-2 text-center">Loading resources...</h3>
                  </div>
                ) : currentCategory ? (
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
                    
                    <ul className="grid grid-cols-1 gap-2 sm:gap-3 p-4">
                      {currentCategory.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-center justify-between p-2 sm:p-3 rounded-lg text-[#1F2937] bg-[#F9FAFB] hover:bg-[#4C1D95]/10 hover:text-[#4C1D95] transition-all duration-200 group/item">
                          <Link
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center flex-1"
                          >
                            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 flex-shrink-0 transition-transform duration-200 group-hover/item:translate-x-1" />
                            <span className="font-medium text-sm sm:text-base">{item.text}</span>
                            <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5 ml-auto text-[#4C1D95]" />
                          </Link>
                          {item.isAdmin && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="ml-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDelete(item.href)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </li>
                      ))}
                    </ul>
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

        <div className="mt-8 flex justify-center">
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

