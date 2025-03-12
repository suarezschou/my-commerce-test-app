"use client"

import { useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import Cookies from "js-cookie"

export function AnonymousIdHandler() {
  useEffect(() => {
    let anonymousId = Cookies.get("anonymousId")
    if (!anonymousId) {
      anonymousId = uuidv4()
      Cookies.set("anonymousId", anonymousId)
    }
  }, [])

  return null // This component doesn't render anything
}

