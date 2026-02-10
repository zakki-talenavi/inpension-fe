export function calculateAverageRating(ratings: number[]): number {
  if (ratings.length === 0) return 0
  const sum = ratings.reduce((acc, rating) => acc + rating, 0)
  return Math.round((sum / ratings.length) * 10) / 10
}

export function calculateRatingDistribution(ratings: number[]): Record<number, number> {
  const distribution: Record<number, number> = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  }

  ratings.forEach((rating) => {
    const key = Math.round(rating) as keyof typeof distribution
    if (distribution[key] !== undefined) {
      distribution[key]++
    }
  })

  return distribution
}

export function calculatePercentage(count: number, total: number): number {
  if (total === 0) return 0
  return Math.round((count / total) * 100)
}
