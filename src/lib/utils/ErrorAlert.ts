import React from 'react'

/**
 * Use in client components when submitting data to supabase
 * @param error - supabase error
 * @param data - supabase data
 * @param callback - Callback is for certain condtion checkings
 * @returns 
 */
export default function(error: any, data: any, callback?: () => boolean) {
  if (error || !data) {
    alert('There was an error, please try agin')
    console.log(`Resetting password for a user who forgot error: \n\n ${error}`)
    return true
  }
}
