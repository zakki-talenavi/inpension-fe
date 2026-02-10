import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  // Mock logout - in a real app, this would invalidate the token
  // For testing, we just return success
  return {
    success: true,
    message: 'Logged out successfully',
  }
})
