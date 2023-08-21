"use client"

import { useEffect } from "react"
import LogMessage from "@/test/msg"
import { Analytics as VercelAnalytics } from "@vercel/analytics/react"

export function Analytics() {
  useEffect(() => {
    console.info(LogMessage)
  }, [])

  return <VercelAnalytics />
}
