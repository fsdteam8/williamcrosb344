"use client"

import { useState } from "react"
import { ArrowLeft, Send } from "lucide-react"
import toast from 'react-hot-toast';
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [emailSent, setEmailSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("https://ben10.scaleupdevagency.com/api/password/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to send password reset email")
      }

      setEmailSent(true)
      toast.success("Password reset instructions have been sent to your email.")
    } catch (error) {
      console.error("Forgot password error:", error)
      toast.error(
        error instanceof Error ? error.message : "Please check your email and try again."
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Forgot Password</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {emailSent
              ? "Check your email for a reset link"
              : "Enter your email and we'll send you a link to reset your password"}
          </p>
        </div>

        {!emailSent ? (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-75 dark:bg-blue-700 dark:hover:bg-blue-800"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="mr-2 h-4 w-4 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Send className="mr-2 h-4 w-4" />
                    Send Reset Link
                  </span>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-6 text-center">
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              If you don't receive an email within a few minutes, check your spam folder or try again.
            </p>
            <button 
              onClick={() => setEmailSent(false)} 
              className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Try again
            </button>
          </div>
        )}

        <div className="mt-4 text-center">
          <Link
            to="/login"
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to login
          </Link>
        </div>
      </div>
    </div>
  )
}