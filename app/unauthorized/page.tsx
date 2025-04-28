"use client"
import { useRouter } from "next/navigation"
import { AlertTriangle } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Unauthorized() {
  const router = useRouter()

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-2 sm:p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center p-4 sm:p-6">
          <div className="flex justify-center mb-3 sm:mb-4">
            <AlertTriangle className="h-10 w-10 sm:h-12 sm:w-12 text-red-500" />
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold text-red-500">Unauthorized</CardTitle>
          <CardDescription className="text-muted-foreground mt-2 text-sm sm:text-base">
            You do not have permission to access this page.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <p className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Please sign in with an account that has the necessary permissions or contact your administrator.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center p-4 sm:p-6">
          <Button 
            onClick={() => router.push("/")} 
            className="w-full sm:w-auto px-4 sm:px-6 h-10 sm:h-11"
          >
            Go to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

