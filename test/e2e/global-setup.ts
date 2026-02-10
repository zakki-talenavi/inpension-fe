import { FullConfig } from '@playwright/test'

async function globalSetup(config: FullConfig) {
  const baseURL = config.webServer?.url || 'https://api-inpension.codeline.id/api'
  
  async function checkServer() {
    try {
      const response = await fetch(baseURL)
      return response.ok
    } catch {
      return false
    }
  }

  console.log('Waiting for server to be ready...')
  let retries = 10
  while (retries > 0) {
    if (await checkServer()) {
      console.log('Server is ready!')
      return
    }
    retries--
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  
  throw new Error('Server failed to start after 5 seconds')
}

export default globalSetup
