"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ChevronLeft, MessageSquare, Send, Loader2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"

// Types
interface Reply {
  _id: string
  content: string
  author: {
    _id: string
    firstName: string
  }
  createdAt: string
}

interface Discussion {
  _id: string
  title: string
  content: string
  author: {
    _id: string
    firstName: string
  }
  replies: Reply[]
  createdAt: string
  updatedAt: string
}

const replySchema = z.object({
  content: z
    .string()
    .min(3, {
      message: "Reply must be at least 3 characters.",
    })
    .max(1000, {
      message: "Reply must not exceed 1000 characters.",
    }),
})

export default function DiscussionDetailPage({ params }: { params: { id: string } }) {
  const [discussion, setDiscussion] = useState<Discussion | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  const form = useForm<z.infer<typeof replySchema>>({
    resolver: zodResolver(replySchema),
    defaultValues: {
      content: "",
    },
  })

  // Fetch user session
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/session")
        if (!response.ok) {
          throw new Error("Failed to fetch user session")
        }
        const data = await response.json()

        if (!data.user) {
          router.push("/login?callbackUrl=/collaborations")
          return
        }

        setUser(data.user)
      } catch (error) {
        console.error("Error fetching user:", error)
        router.push("/login?callbackUrl=/collaborations")
      }
    }

    fetchUser()
  }, [router])

  // Fetch discussion details
  useEffect(() => {
    const fetchDiscussion = async () => {
      try {
        const response = await fetch(`/api/collaborations/discussions/${params.id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch discussion")
        }
        const data = await response.json()
        setDiscussion(data)
      } catch (error) {
        console.error("Error fetching discussion:", error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchDiscussion()
    }
  }, [params.id])

  const onSubmitReply = async (values: z.infer<typeof replySchema>) => {
    if (!user || !discussion) return

    setSubmitting(true)
    try {
      const response = await fetch(`/api/collaborations/discussions/${discussion._id}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: values.content,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit reply")
      }

      const updatedDiscussion = await response.json()
      setDiscussion(updatedDiscussion)
      form.reset()
    } catch (error) {
      console.error("Error submitting reply:", error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#4C1D95]" />
        <span className="ml-2 text-lg">Loading discussion...</span>
      </div>
    )
  }

  if (!discussion) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Discussion not found</h1>
        <Button asChild variant="outline">
          <Link href="/collaborations">
            <ChevronLeft className="mr-2 h-5 w-5" />
            Back to Collaborations
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <header className="bg-gradient-to-r from-[#1B3668] to-[#0A2240] shadow-md relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center space-x-3">
            <MessageSquare className="h-8 w-8 text-[#F59E0B]" />
            <h1 className="text-3xl font-bold text-white">Discussion Details</h1>
          </div>
          <p className="text-blue-100 mt-2 max-w-2xl">Engage with your colleagues and share your thoughts</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button
            asChild
            variant="outline"
            className="group rounded-full px-4 border-[#1B3668] text-[#1B3668] hover:bg-[#1B3668] hover:text-white transition-all duration-200"
          >
            <Link href="/collaborations">
              <ChevronLeft className="mr-2 h-5 w-5 transition-transform duration-200 group-hover:-translate-x-1" />
              Back to Collaborations
            </Link>
          </Button>
        </div>

        <Card className="border-[#E5E7EB] bg-white shadow-sm mb-8">
          <CardHeader className="border-b bg-gradient-to-r from-[#F9FAFB] to-[#F3F4F6] p-6">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-[#1B3668]/10 p-3 border border-[#1B3668]/20">
                <MessageSquare className="h-8 w-8 text-[#1B3668]" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-[#1F2937]">{discussion.title}</CardTitle>
                <CardDescription className="text-base mt-1 text-[#6B7280] flex items-center">
                  Started by {discussion.author.firstName}
                  <span className="inline-block mx-2 w-1.5 h-1.5 rounded-full bg-[#F59E0B]"></span>
                  {formatDistanceToNow(new Date(discussion.createdAt))} ago
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Avatar className="h-10 w-10 border">
                <AvatarFallback className="bg-[#4C1D95]/10 text-[#4C1D95]">
                  {discussion.author.firstName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <h3 className="font-medium text-[#1F2937]">{discussion.author.firstName}</h3>
                  <span className="mx-2 text-gray-400">•</span>
                  <span className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(discussion.createdAt))} ago
                  </span>
                </div>
                <div className="prose max-w-none text-[#1F2937]">
                  <p className="whitespace-pre-line">{discussion.content}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-[#1F2937] mb-4 flex items-center">
            <MessageSquare className="h-5 w-5 mr-2 text-[#F59E0B]" />
            Replies ({discussion.replies.length})
          </h2>

          {discussion.replies.length > 0 ? (
            <div className="space-y-4">
              {discussion.replies.map((reply) => (
                <Card
                  key={reply._id}
                  className="border-[#E5E7EB] bg-white hover:border-[#1B3668]/30 transition-all duration-200"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-8 w-8 border border-[#E5E7EB]">
                        <AvatarFallback className="bg-[#1B3668]/10 text-[#1B3668]">
                          {reply.author.firstName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <h3 className="font-medium text-[#1F2937]">{reply.author.firstName}</h3>
                          <span className="mx-2 inline-block w-1.5 h-1.5 rounded-full bg-[#F59E0B]"></span>
                          <span className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(reply.createdAt))} ago
                          </span>
                        </div>
                        <p className="text-sm text-[#1F2937] whitespace-pre-line">{reply.content}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-[#E5E7EB] bg-white">
              <CardContent className="p-6 text-center text-gray-500">
                No replies yet. Be the first to reply!
              </CardContent>
            </Card>
          )}
        </div>

        <Card className="border-[#E5E7EB] bg-white shadow-sm">
          <CardHeader className="border-b p-4">
            <CardTitle className="text-lg font-semibold text-[#1F2937]">Add a Reply</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitReply)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Write your reply here..."
                          className="min-h-[120px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="bg-[#1B3668] hover:bg-[#0A2240] transition-colors duration-200"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Post Reply
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

