import { BASEURL } from '../assets/constants'

// Function to refresh the access token
export async function refreshToken() {
  try {
    let currentRefreshToken = localStorage.getItem('refreshToken')

    if (!currentRefreshToken) {
      throw 'No Access token and no Refresh token'
    }

    const response = await fetch(BASEURL + 'auth/refresh-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        // any other necessary headers?
      },
      body: JSON.stringify({
        refreshToken: currentRefreshToken
      })
    })
    if (response.ok) {
      const data = await response.json()
      const newAccessToken = data.accessToken
      const newRefreshToken = data.accessToken
      // saving the new access token in lclstorage
      localStorage.setItem('accessToken', newAccessToken)
      localStorage.setItem('refreshToken', newRefreshToken)

      return newAccessToken
    } else {
      throw new Error('Token refresh failed')
    }
  } catch (error) {
    console.error('Token refresh failed:', error)
    window.location.href = '/login'
    // router.push('/login')
    throw error
  }
}

// function to make HTTP requests with token refresh logic
export async function fetchWithTokenRefresh(url, options) {
  let response
  let fullUrl = BASEURL + url

  try {
    response = await fetch(fullUrl, options)

    if (response.status === 401 && !options._retry) {
      options._retry = true
      const newAccessToken = await refreshToken()
      if (newAccessToken) {
        options.headers['Authorization'] = `Bearer ${newAccessToken}`
        return fetchWithTokenRefresh(fullUrl, options)
      }
    }
    return response
  } catch (error) {
    throw error
  }
}