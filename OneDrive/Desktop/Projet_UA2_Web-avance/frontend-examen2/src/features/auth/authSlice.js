import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

// Login
export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const res = await api.post('/login', credentials)
    const { data: user, token } = res.data
    // Fetch full user info with roles
    const userRes = await api.get(`/users/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const fullUser = userRes.data.data
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(fullUser))
    return { user: fullUser, token }
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Identifiants invalides')
  }
})

const storedUser = localStorage.getItem('user')
const storedToken = localStorage.getItem('token')

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: storedUser ? JSON.parse(storedUser) : null,
    token: storedToken || null,
    isAuthenticated: !!storedToken,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { logout, clearError } = authSlice.actions

// Selectors
export const selectCurrentUser = (state) => state.auth.user
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
export const selectIsAdmin = (state) =>
  state.auth.user?.Roles?.some((r) => r.titre?.toLowerCase() === 'admin') || false
export const selectIsProf = (state) =>
  state.auth.user?.Roles?.some(
    (r) => r.titre?.toLowerCase() === 'prof' || r.titre?.toLowerCase() === 'admin'
  ) || false

export default authSlice.reducer
