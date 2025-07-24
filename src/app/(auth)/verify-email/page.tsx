"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, CheckCircle, ArrowLeft } from "lucide-react"
import { sendEmailVerification } from "firebase/auth"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"

export default function VerifyEmailPage() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const { user } = useAuth()

  const handleResendEmail = async () => {
    if (!user) return

    setLoading(true)
    try {
      await sendEmailVerification(user)
      setSent(true)
      toast.success("Verification email sent!")
    } catch (error: any) {
      toast.error("Failed to send verification email")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Check if email is already verified
    if (user?.emailVerified) {
      // Redirect to dashboard or show success message
    }
  }, [user])

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center mb-4">
          <img src="/logo.png" alt="AeroWorx" className="h-12 w-auto" />
        </div>
        <CardTitle className="text-2xl text-center">Verify your email</CardTitle>
        <CardDescription className="text-center">We've sent a verification link to your email address</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {user?.emailVerified ? (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>Your email has been verified! You can now access your account.</AlertDescription>
          </Alert>
        ) : (
          <Alert>
            <Mail className="h-4 w-4" />
            <AlertDescription>
              Please check your email and click the verification link to activate your account. If you don't see it,
              check your spam folder.
            </AlertDescription>
          </Alert>
        )}

        {sent && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>Verification email sent successfully!</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        {!user?.emailVerified && (
          <Button
            onClick={handleResendEmail}
            className="w-full bg-transparent"
            disabled={loading || sent}
            variant="outline"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Resend Verification Email
          </Button>
        )}

        {user?.emailVerified ? (
          <Link href="/dashboard" className="w-full">
            <Button className="w-full">Continue to Dashboard</Button>
          </Link>
        ) : (
          <Link href="/login" className="w-full">
            <Button variant="outline" className="w-full bg-transparent">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sign In
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  )
}
