import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const fetchRoles = createAsyncThunk('roles/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/roles')
    return res.data.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Erreur')
  }
})

export const fetchRoleById = createAsyncThunk('roles/fetchById', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/roles/${id}`)
    return res.data.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Erreur')
  }
})

export const createRole = createAsyncThunk('roles/create', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/roles', data)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Erreur')
  }
})

export const deleteRole = createAsyncThunk('roles/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/roles/${id}`)
    return id
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Erreur')
  }
})

const rolesSlice = createSlice({
  name: 'roles',
  initialState: {
    list: [],
    selectedRole: null,
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearMessages(state) { state.error = null; state.success = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false
        state.list = Array.isArray(action.payload) ? action.payload : (action.payload?.roles || [])
      })
      .addCase(fetchRoles.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      .addCase(fetchRoleById.fulfilled, (state, action) => { state.selectedRole = action.payload })

      .addCase(createRole.pending, (state) => { state.loading = true; state.error = null; state.success = null })
      .addCase(createRole.fulfilled, (state) => { state.loading = false; state.success = 'Rôle créé avec succès' })
      .addCase(createRole.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      .addCase(deleteRole.fulfilled, (state, action) => {
        state.list = state.list.filter((r) => r.id !== action.payload)
        state.success = 'Rôle supprimé'
      })
      .addCase(deleteRole.rejected, (state, action) => { state.error = action.payload })
  },
})

export const { clearMessages } = rolesSlice.actions
export default rolesSlice.reducer
