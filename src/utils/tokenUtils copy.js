import { useAuthenticationStore } from '../stores/authentication'

// Function to refresh the access token
export async function refreshToken() {
  try {
    let currentRefreshToken = localStorage.getItem('refreshToken')

    if (!currentRefreshToken) {
      throw new Error('No Refresh token available')
    }

    const response = await fetch(import.meta.env.VITE_API_BASE_URL + 'auth/refreshtoken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken: currentRefreshToken }),
    })

    if (response.ok) {
      const data = await response.json()
      const newAccessToken = data.accessToken
      const newRefreshToken = data.refreshToken
      localStorage.setItem('accessToken', newAccessToken)
      localStorage.setItem('refreshToken', newRefreshToken)
      return newAccessToken // returns the new access token
    } else {
      throw new Error('Could not refresh the token')
    }
  } catch (error) {
    useAuthenticationStore().logout()
    throw error
  }
}

// function to make HTTP requests with token refresh logic
export async function fetchWithTokenRefresh(url, options = {}) {
  let fullUrl = import.meta.env.VITE_API_BASE_URL + url
  let accessToken = localStorage.getItem('accessToken')

  // merges headers instead of overwriting
  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${accessToken}`,
  }

  if (options.method === 'POST' && options.body && !(options.body instanceof FormData)) {
    options.body = JSON.stringify(options.body)
    options.headers['Content-Type'] = 'application/json'
  }
  // console.log(options.body)

  try {
    let response = await fetch(fullUrl, options)

    if (response.status === 401 && !options._retry) {
      options._retry = true
      try {
        const newAccessToken = await refreshToken()
        options.headers['Authorization'] = `Bearer ${newAccessToken}`
        return fetchWithTokenRefresh(url, options) // Note: using url, not fullUrl
      } catch (refreshError) {
        // if refresh fails, logout and throw the error
        useAuthenticationStore().logout()
        throw refreshError
      }
    }
    return response
  } catch (error) {
    throw error
  }
}
