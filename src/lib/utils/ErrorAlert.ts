import React from 'react'

/**
 * Use in client components when submitting data to supabase
 * @param error - supabase error
 * @param data - supabase data
 * @param callback - Callback is for certain condtion checkings
 * @param text - String for the console to make reading the error easier
 * @returns 
 */
export default function(error: any, data: any, text: string, callback?: () => boolean) {
  if (error || !data) {
    alert('There was an error, please try agin')
    console.log(`${text}: \n\n`)
    console.log(error)
    return true
  }
}
