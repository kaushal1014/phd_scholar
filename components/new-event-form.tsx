"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Upload, Loader2, FileText, X, Image as ImageIcon } from "lucide-react"
import { format } from "date-fns"
import { toast } from "react-toastify"
import type {Meeting, Event } from "@/app/events/page"
import Image from "next/image"

interface NewEventFormProps {
  onSubmit: (data: any) => void
  type?: "event" | "meeting"
  initialData?: Meeting | Event | null
}

interface UploadedFile {
  fileUrl: string
  fileName: string
  mimeType: string
}

export default function NewEventForm({ onSubmit, type = "event", initialData }: NewEventFormProps) {
  const [title, setTitle] = useState(initialData?.title || "")
  const [description, setDescription] = useState(initialData?.description || "")
  const [date, setDate] = useState<Date | undefined>(initialData?.date ? new Date(initialData.date) : undefined)
  const [time, setTime] = useState(initialData?.time || "")
  const [location, setLocation] = useState(initialData?.location || "")
  const [documentType, setDocumentType] = useState<"none" | "pdf" | "image" | "pptx">(initialData?.documentType || "none")
  const initialFiles: UploadedFile[] = []
  if (initialData?.documentUrl) {
    const urls = initialData.documentUrl.split(',').filter(Boolean)
    for (const url of urls) {
      const ext = url.split('.').pop()?.toLowerCase() || ''
      let mimeType = ''
      if (["jpg","jpeg","png","gif","webp"].includes(ext)) mimeType = "image"
      else if (ext === "pdf") mimeType = "pdf"
      else if (ext === "pptx") mimeType = "pptx"
      initialFiles.push({ fileUrl: url, fileName: url.split('/').pop() || '', mimeType })
    }
  }
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(initialFiles)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)

    try {
      const formData = new FormData()
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i])
      }
      formData.append("type", documentType)

      const response = await fetch("/api/events/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload files")
      }

      const data = await response.json()
      setUploadedFiles(prev => [...prev, ...data.files])
      toast.success("Files uploaded successfully")
    } catch (error) {
      console.error("Error uploading files:", error)
      toast.error("Failed to upload files")
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
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
        documentType,
        documentUrl: uploadedFiles.map(file => file.fileUrl).join(','),
      }

      await onSubmit(formData)
    } catch (error) {
      console.error("Error submitting form:", error)
      toast.error("Failed to submit form")
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
        <Label htmlFor="documentType">Document Type</Label>
        <select
          id="documentType"
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value as "none" | "pdf" | "image" | "pptx")}
          className="w-full p-2 border rounded"
        >
          <option value="none">None</option>
          <option value="pdf">PDF</option>
          <option value="image">Image</option>
          <option value="pptx">PowerPoint</option>
        </select>
      </div>

      {documentType !== "none" && (
        <div className="space-y-2">
          <Label>Upload Files</Label>
          <div className="flex items-center space-x-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              multiple
              accept={
                documentType === "pdf" ? "application/pdf" :
                documentType === "pptx" ? ".pptx" :
                documentType === "image" ? "image/*" : ""
              }
              className="hidden"
            />
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center space-x-2"
            >
              {isUploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              <span>Upload Files</span>
            </Button>
          </div>
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <Label>Uploaded Files</Label>
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded bg-gray-50">
                <div className="flex items-center space-x-2">
                  {file.mimeType === "image" ? (
                    <div className="w-10 h-10 relative rounded overflow-hidden border bg-white">
                      <Image src={file.fileUrl.startsWith("/uploads") ? `/api/events/download?path=${encodeURIComponent(file.fileUrl)}` : file.fileUrl} alt={file.fileName} fill className="object-cover" />
                    </div>
                  ) : file.mimeType === "pdf" ? (
                    <FileText className="w-6 h-6 text-red-600" />
                  ) : file.mimeType === "pptx" ? (
                    <FileText className="w-6 h-6 text-blue-600" />
                  ) : (
                    <FileText className="w-6 h-6 text-gray-400" />
                  )}
                  <span className="text-sm max-w-[120px] truncate">{file.fileName}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveFile(index)}
                  className="hover:bg-red-100"
                  title="Remove file"
                >
                  <X className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="sticky bottom-0 bg-white pt-4 border-t">
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Submit"
          )}
        </Button>
      </div>
    </form>
  )
}
