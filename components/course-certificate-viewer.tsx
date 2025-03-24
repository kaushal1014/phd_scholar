"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Download, Eye, Loader2, AlertCircle, CheckCircle, XCircle, Clock } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import type mongoose from "mongoose"
import { useSession } from "next-auth/react"

interface CourseCertificateViewerProps {
  phdId: string | mongoose.Types.ObjectId
  courseNumber: string
}

interface Certificate {
  _id: string
  fileName: string
  fileUrl: string
  uploadDate: string
  approvalStatus: "pending" | "approved" | "rejected"
  rejectionReason?: string
}

export function CourseCertificateViewer({ phdId, courseNumber }: CourseCertificateViewerProps) {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewingCertificate, setViewingCertificate] = useState<Certificate | null>(null)
  const { data: session } = useSession()

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `/api/user/phd-scholar/course-certificate?phdId=${phdId.toString()}&courseNumber=${courseNumber}`,
        )

        if (!response.ok) {
          throw new Error("Failed to fetch certificates")
        }

        const data = await response.json()
        setCertificates(data.certificates || [])
        setError(null)
      } catch (error) {
        console.error("Error fetching certificates:", error)
        setError("Failed to load certificates")
      } finally {
        setLoading(false)
      }
    }

    fetchCertificates()
  }, [phdId, courseNumber])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-500 hover:bg-red-600">Rejected</Badge>
      default:
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-6">
        <Loader2 className="h-6 w-6 animate-spin text-[#1B3668]" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-6 text-red-600">
        <AlertCircle className="h-5 w-5 mr-2" />
        <span>{error}</span>
      </div>
    )
  }

  if (certificates.length === 0) {
    return (
      <div className="text-center p-6 text-muted-foreground">
        <FileText className="h-10 w-10 mx-auto mb-2 opacity-50" />
        <p>No certificates uploaded yet</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {certificates.map((certificate) => (
          <Card key={certificate._id} className="bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-3 text-[#1B3668]" />
                  <div>
                    <p className="font-medium">{certificate.fileName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-muted-foreground">
                        Uploaded on {new Date(certificate.uploadDate).toLocaleDateString()}
                      </p>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(certificate.approvalStatus)}
                        {getStatusBadge(certificate.approvalStatus)}
                      </div>
                    </div>
                    {certificate.approvalStatus === "rejected" && certificate.rejectionReason && (
                      <p className="text-xs text-red-500 mt-1">Reason: {certificate.rejectionReason}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setViewingCertificate(certificate)}
                    className="flex items-center"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(certificate.fileUrl, "_blank")}
                    className="flex items-center"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!viewingCertificate} onOpenChange={(open) => !open && setViewingCertificate(null)}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{viewingCertificate?.fileName}</span>
              {viewingCertificate && getStatusBadge(viewingCertificate.approvalStatus)}
            </DialogTitle>
          </DialogHeader>
          {viewingCertificate && (
            <div className="h-full w-full overflow-auto">
              <iframe
                src={`${viewingCertificate.fileUrl}#toolbar=0`}
                className="w-full h-full"
                title="Certificate Preview"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

