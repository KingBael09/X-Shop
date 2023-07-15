"use client"

import { useEffect } from "react"
import { useClerk } from "@clerk/nextjs"

import { type SSOCallbackPageProps } from "@/app/(auth)/(new-user)/sso-callback/page"

import { Icons } from "../util/icons"

export default function SSOCallback({ searchParams }: SSOCallbackPageProps) {
  const { handleRedirectCallback } = useClerk()

  useEffect(() => {
    void handleRedirectCallback(searchParams)
  }, [searchParams, handleRedirectCallback])

  return (
    <div
      role="status"
      aria-label="Loading"
      aria-describedby="loading-description"
      className="flex items-center justify-center"
    >
      <Icons.spinner className="h-16 w-16 animate-spin" aria-hidden="true" />
    </div>
  )
}