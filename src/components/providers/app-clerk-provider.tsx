"use client"

import { ClerkProvider } from "@clerk/nextjs"
import type { PropsWithChildren } from "react"

export function AppClerkProvider({ children }: PropsWithChildren) {
  return <ClerkProvider>{children}</ClerkProvider>
}