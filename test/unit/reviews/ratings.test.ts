import { describe, it, expect } from 'vitest'
import { calculateAverageRating, calculateRatingDistribution, calculatePercentage } from '#layers/reviews/app/utils/ratings'

describe('Rating Utilities', () => {
  describe('calculateAverageRating', () => {
    it('should return 0 for empty array', () => {
      expect(calculateAverageRating([])).toBe(0)
    })

    it('should calculate average correctly', () => {
      expect(calculateAverageRating([5, 4, 3, 2, 1])).toBe(3)
      expect(calculateAverageRating([5, 5, 5])).toBe(5)
      expect(calculateAverageRating([4, 4])).toBe(4)
    })

    it('should round to one decimal place', () => {
      expect(calculateAverageRating([5, 4, 4])).toBe(4.3)
      expect(calculateAverageRating([5, 5, 4])).toBe(4.7)
    })
  })

  describe('calculateRatingDistribution', () => {
    it('should return empty distribution for no ratings', () => {
      const result = calculateRatingDistribution([])
      expect(result).toEqual({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 })
    })

    it('should count ratings correctly', () => {
      const result = calculateRatingDistribution([5, 5, 4, 3, 2, 1])
      expect(result).toEqual({
        5: 2,
        4: 1,
        3: 1,
        2: 1,
        1: 1,
      })
    })

    it('should handle decimal ratings', () => {
      // Math.round(4.5) = 4, Math.round(4.2) = 4, Math.round(3.8) = 4
      const result = calculateRatingDistribution([4.5, 4.2, 3.8])
      expect(result[5]).toBe(1) // 4.5 rounds to 5
      expect(result[4]).toBe(2) // 4.2 and 3.8 round to 4
    })
  })

  describe('calculatePercentage', () => {
    it('should return 0 when total is 0', () => {
      expect(calculatePercentage(5, 0)).toBe(0)
    })

    it('should calculate percentage correctly', () => {
      expect(calculatePercentage(50, 100)).toBe(50)
      expect(calculatePercentage(1, 3)).toBe(33)
      expect(calculatePercentage(2, 3)).toBe(67)
    })

    it('should handle edge cases', () => {
      expect(calculatePercentage(0, 100)).toBe(0)
      expect(calculatePercentage(100, 100)).toBe(100)
    })
  })
})
