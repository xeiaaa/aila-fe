import axios from "axios"
import { API_URL } from "../config"
import { TOKEN_KEY } from "../constants"

const authAxios = axios.create()

/*
 * Request Interceptor
 * Add Bearer token
 */
authAxios.interceptors.request.use(function (config) {
  try {
    const tokensString = localStorage.getItem(TOKEN_KEY)
    const tokens = JSON.parse(tokensString)

    config.headers.Authorization = tokens.access.token
      ? `Bearer ${tokens.access.token}`
      : ""
  } catch (err) {
    console.log("Auth Axios", err)
  }
  return config
})

/*
 * Response Interceptor
 * In case of 401 -> use refresh token, if invalid logout the user
 * If 403 -> logout the user
 */
authAxios.interceptors.response.use(
  (response) => {
    return response
  },
  async function (error) {
    const originalRequest = error.config
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const tokensString = localStorage.getItem(TOKEN_KEY)
      const tokens = JSON.parse(tokensString)

      const { data } = await axios.post(`${API_URL}/auth/refresh-tokens`, {
        refreshToken: tokens.refresh.token,
      })

      localStorage.setItem(TOKEN_KEY, JSON.stringify(data))

      return authAxios(originalRequest)
    }

    if (error.response.status === 401 && originalRequest._retry) {
      // logout
      localStorage.deleteItem(TOKEN_KEY)
      window.location.href = "/"
    }
    return Promise.reject(error)
  }
)

export default authAxios
