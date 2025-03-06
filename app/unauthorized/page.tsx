"use client"
import { useRouter } from "next/navigation"
import { AlertTriangle } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Unauthorized() {
  const router = useRouter()

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <AlertTriangle className="h-12 w-12 text-red-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-500">Unauthorized</CardTitle>
          <CardDescription className="text-muted-foreground mt-2">
            You do not have permission to access this page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Please sign in with an account that has the necessary permissions or contact your administrator.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center pb-6">
          <Button onClick={() => router.push("/")} className="px-6">
            Go to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

