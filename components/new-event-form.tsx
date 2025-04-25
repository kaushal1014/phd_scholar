"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Upload, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { toast } from "react-toastify"
import type {Meeting, Event } from "@/app/events/page"

interface NewEventFormProps {
  onSubmit: (data: any) => void
  type?: "event" | "meeting"
  initialData?: Meeting | Event | null
}

export default function NewEventForm({ onSubmit, type = "event", initialData }: NewEventFormProps) {
  const [title, setTitle] = useState(initialData?.title || "")
  const [description, setDescription] = useState(initialData?.description || "")
  const [date, setDate] = useState<Date | undefined>(initialData?.date ? new Date(initialData.date) : undefined)
  const [time, setTime] = useState(initialData?.time || "")
  const [location, setLocation] = useState(initialData?.location || "")
  const [documentType, setDocumentType] = useState<"none" | "pdf" | "image" | "pptx">(initialData?.documentType || "none")
  const [documentUrl, setDocumentUrl] = useState(initialData?.documentUrl || "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (documentType === "pdf" && file.type !== "application/pdf") {
      toast.error("Please select a PDF file")
      return
    }

    if (documentType === "pptx" && !file.name.endsWith('.pptx')) {
      toast.error("Please select a PPTX file")
      return
    }

    if (documentType === "image" && !file.type.startsWith("image/")) {
      toast.error("Please select an image file")
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("type", documentType)

      const response = await fetch("/api/events/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload file")
      }

      const data = await response.json()
      setDocumentUrl(data.fileUrl)
      toast.success("File uploaded successfully")
    } catch (error) {
      console.error("Error uploading file:", error)
      toast.error("Failed to upload file")
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !date || !time || !location) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)

    try {
      const formattedDate = date ? format(date, "yyyy-MM-dd") : ""

      const formData = {
        title,
        description,
        date: formattedDate,
        time,
        location,
      }

      // Add document data if available
      if (documentType !== "none" && documentUrl) {
        Object.assign(formData, {
          documentUrl,
          documentType,
        })
      }

      onSubmit(formData)

      // Reset form
      setTitle("")
      setDescription("")
      setDate(undefined)
      setTime("")
      setLocation("")
      setDocumentType("none")
      setDocumentUrl("")
    } catch (error) {
      console.error("Error submitting form:", error)
      toast.error(`Failed to create ${type}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto pr-4 pb-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={date ? format(date, "yyyy-MM-dd") : ""}
            onChange={(e) => setDate(e.target.value ? new Date(e.target.value) : undefined)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="time">Time</Label>
          <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Document</Label>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="doc-none"
              name="documentType"
              value="none"
              checked={documentType === "none"}
              onChange={() => {
                setDocumentType("none")
                setDocumentUrl("")
              }}
              className="h-4 w-4 text-[#1B3668] focus:ring-[#1B3668]"
            />
            <Label htmlFor="doc-none" className="text-sm font-normal">
              No document
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="doc-pdf"
              name="documentType"
              value="pdf"
              checked={documentType === "pdf"}
              onChange={() => {
                setDocumentType("pdf")
                setDocumentUrl("")
              }}
              className="h-4 w-4 text-[#1B3668] focus:ring-[#1B3668]"
            />
            <Label htmlFor="doc-pdf" className="text-sm font-normal">
              PDF Document
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="doc-pptx"
              name="documentType"
              value="pptx"
              checked={documentType === "pptx"}
              onChange={() => {
                setDocumentType("pptx")
                setDocumentUrl("")
              }}
              className="h-4 w-4 text-[#1B3668] focus:ring-[#1B3668]"
            />
            <Label htmlFor="doc-pptx" className="text-sm font-normal">
              PowerPoint (PPTX)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="doc-image"
              name="documentType"
              value="image"
              checked={documentType === "image"}
              onChange={() => {
                setDocumentType("image")
                setDocumentUrl("")
              }}
              className="h-4 w-4 text-[#1B3668] focus:ring-[#1B3668]"
            />
            <Label htmlFor="doc-image" className="text-sm font-normal">
              Image
            </Label>
          </div>
        </div>
      </div>

      {documentType !== "none" && (
        <div className="space-y-2">
          <Label>Upload Document</Label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept={documentType === "pdf" ? ".pdf" : documentType === "pptx" ? ".pptx" : "image/*"}
            className="hidden"
          />
          <div className="flex gap-2">
            <div className="flex-1 border rounded-md p-2 text-sm truncate">
              {documentUrl ? (
                <span className="text-green-600">
                  File uploaded successfully <span className="text-gray-500">({documentUrl.split("/").pop()})</span>
                </span>
              ) : (
                <span className="text-gray-500">No file selected</span>
              )}
            </div>
            <Button
              type="button"
              variant="outline"
              className="flex-shrink-0"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            {documentType === "pdf"
              ? `Add a PDF document for ${type} details (max 5MB)`
              : documentType === "pptx"
              ? `Add a PowerPoint (PPTX) document for ${type} details (max 5MB)`
              : `Add an image for ${type} announcement (max 2MB)`}
          </p>
        </div>
      )}

      <div className="sticky bottom-0 bg-white pt-4 border-t">
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {type === "event" ? "Creating Event..." : "Creating Meeting..."}
            </>
          ) : (
            type === "event" ? "Create Event" : "Create Meeting"
          )}
        </Button>
      </div>
    </form>
  )
}
