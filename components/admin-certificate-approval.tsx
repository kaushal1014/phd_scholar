"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Eye, Loader2, AlertCircle, CheckCircle, XCircle, Clock, ThumbsUp, ThumbsDown } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { useSession } from "next-auth/react"
import { toast } from 'react-toastify';

interface Certificate {
  _id: string
  fileName: string
  fileUrl: string
  uploadDate: string
  approvalStatus: "pending" | "approved" | "rejected"
  phdScholar: string
  courseNumber: string
  rejectionReason?: string
}

interface AdminCertificateApprovalProps {
  phdId?: string
  showAll?: boolean
}

export function AdminCertificateApproval({ phdId, showAll = false }: AdminCertificateApprovalProps) {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewingCertificate, setViewingCertificate] = useState<Certificate | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [showRejectionDialog, setShowRejectionDialog] = useState(false)
  const [processingAction, setProcessingAction] = useState(false)
  const notifySucc = (msg: string) => toast.success(msg);
  const notifyErr = (msg: string) => toast.error(msg);
  const notifyInfo = (msg: string) => toast.info(msg);
  const { data: session } = useSession()

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setLoading(true)
        let url = "/api/admin/certificates"
        if (phdId && !showAll) {
          url += `?phdId=${phdId}`
        }

        const response = await fetch(url)

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

    if (session?.user?.isAdmin) {
      fetchCertificates()
    }
  }, [phdId, showAll, session])

  const handleApprove = async (certificateId: string) => {
    try {
      setProcessingAction(true)
      const response = await fetch("/api/user/phd-scholar/course-certificate/approve", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          certificateId,
          action: "approve",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to approve certificate")
      }

      // Update the local state
      setCertificates((prev) =>
        prev.map((cert) => (cert._id === certificateId ? { ...cert, approvalStatus: "approved" } : cert)),
      )
      notifySucc("Certificate approved")

    } catch (error) {
      console.error("Error approving certificate:", error)
      notifyErr("There was an error approving the certificate")

    } finally {
      setProcessingAction(false)
    }
  }

  const handleReject = async (certificateId: string) => {
    if (!rejectionReason.trim()) {
      notifyErr("Rejection reason required")
      return
    }

    try {
      setProcessingAction(true)
      const response = await fetch("/api/user/phd-scholar/course-certificate/approve", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          certificateId,
          action: "reject",
          rejectionReason,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to reject certificate")
      }

      // Update the local state
      setCertificates((prev) =>
        prev.map((cert) =>
          cert._id === certificateId ? { ...cert, approvalStatus: "rejected", rejectionReason } : cert,
        ),
      )
      notifyInfo("rejected")

      // Reset and close dialog
      setRejectionReason("")
      setShowRejectionDialog(false)
    } catch (error) {
      console.error("Error rejecting certificate:", error)
      notifyErr("Rejection failed")
    } finally {
      setProcessingAction(false)
    }
  }

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

  if (!session?.user?.isAdmin) {
    return (
      <div className="flex justify-center items-center p-6 text-red-600">
        <AlertCircle className="h-5 w-5 mr-2" />
        <span>You don't have permission to access this page</span>
      </div>
    )
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
        <p>No certificates pending approval</p>
      </div>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Certificate Approval</CardTitle>
        </CardHeader>
        <CardContent>
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
                        <p className="text-xs text-muted-foreground mt-1">Course: {certificate.courseNumber}</p>
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

                      {certificate.approvalStatus === "pending" && (
                        <>
                          <Button
                            size="sm"
                            variant="default"
                            className="bg-green-600 hover:bg-green-700 flex items-center"
                            onClick={() => handleApprove(certificate._id)}
                            disabled={processingAction}
                          >
                            {processingAction ? (
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            ) : (
                              <ThumbsUp className="h-4 w-4 mr-1" />
                            )}
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="flex items-center"
                            onClick={() => {
                              setViewingCertificate(certificate)
                              setShowRejectionDialog(true)
                            }}
                            disabled={processingAction}
                          >
                            <ThumbsDown className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Certificate Viewer Dialog */}
      <Dialog
        open={!!viewingCertificate && !showRejectionDialog}
        onOpenChange={(open) => {
          if (!open) {
            setViewingCertificate(null)
          }
        }}
      >
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

      {/* Rejection Dialog */}
      <Dialog
        open={showRejectionDialog}
        onOpenChange={(open) => {
          if (!open) {
            setShowRejectionDialog(false)
            if (!viewingCertificate) {
              setViewingCertificate(null)
            }
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Certificate</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-4 text-sm text-muted-foreground">
              Please provide a reason for rejecting this certificate. This will be visible to the student.
            </p>
            <Textarea
              placeholder="Rejection reason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectionDialog(false)
              }}
              disabled={processingAction}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => viewingCertificate && handleReject(viewingCertificate._id)}
              disabled={!rejectionReason.trim() || processingAction}
            >
              {processingAction ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <ThumbsDown className="h-4 w-4 mr-1" />
              )}
              Reject Certificate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

