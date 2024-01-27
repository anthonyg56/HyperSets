import React from 'react'

/**
 * Used in development to track errors
 * 
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
