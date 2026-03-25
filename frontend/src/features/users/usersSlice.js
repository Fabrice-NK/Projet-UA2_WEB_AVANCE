import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const fetchUsers = createAsyncThunk('users/fetchAll', async (params = {}, { rejectWithValue }) => {
  try {
    const res = await api.get('/users', { params })
    return res.data.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Erreur')
  }
})

export const fetchUserById = createAsyncThunk('users/fetchById', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/users/${id}`)
    return res.data.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Erreur')
  }
})

export const createUser = createAsyncThunk('users/create', async (formData, { rejectWithValue }) => {
  try {
    const res = await api.post('/users', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Erreur')
  }
})

export const updateUser = createAsyncThunk('users/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/users/${id}`, data)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Erreur')
  }
})

export const updateUserPhoto = createAsyncThunk('users/updatePhoto', async ({ id, formData }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/users/${id}/photo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Erreur')
  }
})

export const deleteUser = createAsyncThunk('users/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/users/${id}`)
    return id
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Erreur')
  }
})

export const assignUserRoles = createAsyncThunk('users/assignRoles', async ({ id, ids }, { rejectWithValue }) => {
  try {
    const res = await api.post(`/users/${id}/roles`, { ids })
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Erreur')
  }
})

export const assignUserSubjects = createAsyncThunk('users/assignSubjects', async ({ id, ids }, { rejectWithValue }) => {
  try {
    const res = await api.post(`/users/${id}/subjects`, { ids })
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Erreur')
  }
})

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    list: [],
    total: 0,
    totalPages: 1,
    currentPage: 1,
    selectedUser: null,
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearMessages(state) {
      state.error = null
      state.success = null
    },
    clearSelectedUser(state) {
      state.selectedUser = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.list = action.payload.users || []
        state.total = action.payload.total || 0
        state.totalPages = action.payload.totalPages || 1
        state.currentPage = action.payload.currentPage || 1
      })
      .addCase(fetchUsers.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      .addCase(fetchUserById.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchUserById.fulfilled, (state, action) => { state.loading = false; state.selectedUser = action.payload })
      .addCase(fetchUserById.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      .addCase(createUser.pending, (state) => { state.loading = true; state.error = null; state.success = null })
      .addCase(createUser.fulfilled, (state) => { state.loading = false; state.success = 'Utilisateur créé avec succès' })
      .addCase(createUser.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      .addCase(updateUser.pending, (state) => { state.loading = true; state.error = null; state.success = null })
      .addCase(updateUser.fulfilled, (state) => { state.loading = false; state.success = 'Utilisateur mis à jour' })
      .addCase(updateUser.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      .addCase(updateUserPhoto.fulfilled, (state) => { state.success = 'Photo mise à jour' })

      .addCase(deleteUser.fulfilled, (state, action) => {
        state.list = state.list.filter((u) => u.id !== action.payload)
        state.success = 'Utilisateur supprimé'
      })
      .addCase(deleteUser.rejected, (state, action) => { state.error = action.payload })

      .addCase(assignUserRoles.fulfilled, (state) => { state.success = 'Rôles assignés' })
      .addCase(assignUserRoles.rejected, (state, action) => { state.error = action.payload })

      .addCase(assignUserSubjects.fulfilled, (state) => { state.success = 'Matières assignées' })
      .addCase(assignUserSubjects.rejected, (state, action) => { state.error = action.payload })
  },
})

export const { clearMessages, clearSelectedUser } = usersSlice.actions
export default usersSlice.reducer
