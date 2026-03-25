import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const fetchDepartments = createAsyncThunk('departments/fetchAll', async (params = {}, { rejectWithValue }) => {
  try {
    const res = await api.get('/departments', { params })
    return res.data.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Erreur')
  }
})

export const fetchDepartmentById = createAsyncThunk('departments/fetchById', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/departments/${id}`)
    return res.data.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Erreur')
  }
})

export const createDepartment = createAsyncThunk('departments/create', async (formData, { rejectWithValue }) => {
  try {
    const res = await api.post('/departments', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Erreur')
  }
})

export const updateDepartment = createAsyncThunk('departments/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/departments/${id}`, data)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Erreur')
  }
})

export const updateDepartmentImage = createAsyncThunk('departments/updateImage', async ({ id, formData }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/departments/${id}/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Erreur')
  }
})

export const deleteDepartment = createAsyncThunk('departments/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/departments/${id}`)
    return id
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Erreur')
  }
})

const departmentsSlice = createSlice({
  name: 'departments',
  initialState: {
    list: [],
    total: 0,
    totalPages: 1,
    currentPage: 1,
    selectedDepartment: null,
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearMessages(state) { state.error = null; state.success = null },
    clearSelected(state) { state.selectedDepartment = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartments.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.loading = false
        state.list = action.payload.departments || []
        state.total = action.payload.total || 0
        state.totalPages = action.payload.totalPages || 1
        state.currentPage = action.payload.currentPage || 1
      })
      .addCase(fetchDepartments.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      .addCase(fetchDepartmentById.pending, (state) => { state.loading = true })
      .addCase(fetchDepartmentById.fulfilled, (state, action) => { state.loading = false; state.selectedDepartment = action.payload })
      .addCase(fetchDepartmentById.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      .addCase(createDepartment.pending, (state) => { state.loading = true; state.error = null; state.success = null })
      .addCase(createDepartment.fulfilled, (state) => { state.loading = false; state.success = 'Département créé avec succès' })
      .addCase(createDepartment.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      .addCase(updateDepartment.pending, (state) => { state.loading = true; state.error = null; state.success = null })
      .addCase(updateDepartment.fulfilled, (state) => { state.loading = false; state.success = 'Département mis à jour' })
      .addCase(updateDepartment.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      .addCase(updateDepartmentImage.fulfilled, (state) => { state.success = 'Image mise à jour' })
      .addCase(updateDepartmentImage.rejected, (state, action) => { state.error = action.payload })

      .addCase(deleteDepartment.fulfilled, (state, action) => {
        state.list = state.list.filter((d) => d.id !== action.payload)
        state.success = 'Département supprimé'
      })
      .addCase(deleteDepartment.rejected, (state, action) => { state.error = action.payload })
  },
})

export const { clearMessages, clearSelected } = departmentsSlice.actions
export default departmentsSlice.reducer
