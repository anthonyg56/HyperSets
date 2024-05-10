"use client"

import { useRouter } from "next/navigation"
import { Button } from "../../button"

type Props = {
  username: string,
}

/**
 * Toast action component for a user to view their profile after a successful update
 * 
 * @param props.username - username needed for routing
 * 
 * @returns 
 */
export default function ViewProfile({ username }: Props) {
  const router = useRouter()

  function handleClick(e: any) {
    e.preventDefault()

    router.push(`/profile/${username}`)
  }

  /**
   * Pre fetches route upon hover
   * 
   * @param e - event button
   */
  function handleHover(e: any) {
    e.preventDefault()

    router.prefetch(`/profile/${username}`)
  }

  return (
    <Button onClick={handleClick} onMouseEnter={handleHover} type="button" variant="secondary">
      View Profile
    </Button>
  )
}