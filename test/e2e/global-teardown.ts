import { FullConfig } from '@playwright/test'

async function globalTeardown(_config: FullConfig) {
  console.log('All tests completed!')
}

export default globalTeardown
