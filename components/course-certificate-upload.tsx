"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Upload, FileText, CheckCircle, AlertCircle } from "lucide-react"
import type mongoose from "mongoose"

interface CourseCertificateUploadProps {
  phdId: string | mongoose.Types.ObjectId
  courseNumber: string
  onUploadSuccess: () => void
}

export function CourseCertificateUpload({ phdId, courseNumber, onUploadSuccess }: CourseCertificateUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")
  const formRef = useRef<HTMLFormElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    setFile(selectedFile)
    setUploadStatus("idle")
  }

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!file) {
      // toast({
      //   title: "No file selected",
      //   description: "Please select a file to upload",
      //   variant: "destructive",
      // })
      return
    }

    setUploading(true)
    setUploadStatus("idle")

    try {
      // Create form data for file upload
      const formData = new FormData(e.currentTarget)
      formData.append("phdId", phdId.toString())
      formData.append("courseNumber", courseNumber)

      // Send the file to the server
      const response = await fetch("/api/user/phd-scholar/course-certificate", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload certificate")
      }

      setUploadStatus("success")
      // toast({
      //   title: "Certificate uploaded",
      //   description: "Your course completion certificate has been uploaded successfully",
      // })
      onUploadSuccess()

      // Reset the form
      if (formRef.current) {
        formRef.current.reset()
      }
      setFile(null)
    } catch (error) {
      console.error("Error uploading certificate:", error)
      setUploadStatus("error")
      // toast({
      //   title: "Upload failed",
      //   description: "There was an error uploading your certificate. Please try again.",
      //   variant: "destructive",
      // })
    } finally {
      setUploading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Upload Course Certificate</CardTitle>
        <CardDescription>Upload your course completion certificate for verification</CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} onSubmit={handleUpload} encType="multipart/form-data">
          <div className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="certificate">Certificate File (PDF only)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="certificate"
                  name="file"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="flex-1"
                  disabled={uploading}
                />
              </div>
              {file && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <FileText className="h-4 w-4" />
                  <span className="truncate">{file.name}</span>
                  <span className="text-xs">({(file.size / 1024).toFixed(2)} KB)</span>
                </div>
              )}
            </div>

            <input type="hidden" name="phdId" value={phdId.toString()} />
            <input type="hidden" name="courseNumber" value={courseNumber} />

            <div className="flex justify-between">
              <div className="flex items-center">
                {uploadStatus === "success" && (
                  <div className="flex items-center text-green-600 text-sm">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span>Upload successful</span>
                  </div>
                )}
                {uploadStatus === "error" && (
                  <div className="flex items-center text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    <span>Upload failed</span>
                  </div>
                )}
              </div>
              <Button type="submit" disabled={!file || uploading} className="bg-[#1B3668] hover:bg-[#1B3668]/90">
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Certificate
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

