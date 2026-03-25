import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const fetchLaboratories = createAsyncThunk('laboratories/fetchAll', async (params = {}, { rejectWithValue }) => {
  try {
    const res = await api.get('/laboratories', { params })
    return res.data.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Erreur')
  }
})

export const fetchLaboratoryById = createAsyncThunk('laboratories/fetchById', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/laboratories/${id}`)
    return res.data.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Erreur')
  }
})

export const createLaboratory = createAsyncThunk('laboratories/create', async (formData, { rejectWithValue }) => {
  try {
    const res = await api.post('/laboratories', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Erreur')
  }
})

export const updateLaboratory = createAsyncThunk('laboratories/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/laboratories/${id}`, data)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Erreur')
  }
})

export const updateLaboratoryImage = createAsyncThunk('laboratories/updateImage', async ({ id, formData }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/laboratories/${id}/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Erreur')
  }
})

export const deleteLaboratory = createAsyncThunk('laboratories/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/laboratories/${id}`)
    return id
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Erreur')
  }
})

const laboratoriesSlice = createSlice({
  name: 'laboratories',
  initialState: {
    list: [],
    total: 0,
    totalPages: 1,
    currentPage: 1,
    selectedLaboratory: null,
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearMessages(state) { state.error = null; state.success = null },
    clearSelected(state) { state.selectedLaboratory = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLaboratories.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchLaboratories.fulfilled, (state, action) => {
        state.loading = false
        state.list = action.payload.laboratories || action.payload.data || []
        state.total = action.payload.total || 0
        state.totalPages = action.payload.totalPages || 1
        state.currentPage = action.payload.currentPage || 1
      })
      .addCase(fetchLaboratories.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      .addCase(fetchLaboratoryById.pending, (state) => { state.loading = true })
      .addCase(fetchLaboratoryById.fulfilled, (state, action) => { state.loading = false; state.selectedLaboratory = action.payload })
      .addCase(fetchLaboratoryById.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      .addCase(createLaboratory.pending, (state) => { state.loading = true; state.error = null; state.success = null })
      .addCase(createLaboratory.fulfilled, (state) => { state.loading = false; state.success = 'Laboratoire créé avec succès' })
      .addCase(createLaboratory.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      .addCase(updateLaboratory.pending, (state) => { state.loading = true; state.error = null; state.success = null })
      .addCase(updateLaboratory.fulfilled, (state) => { state.loading = false; state.success = 'Laboratoire mis à jour' })
      .addCase(updateLaboratory.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      .addCase(updateLaboratoryImage.fulfilled, (state) => { state.success = 'Image mise à jour' })

      .addCase(deleteLaboratory.fulfilled, (state, action) => {
        state.list = state.list.filter((l) => l.id !== action.payload)
        state.success = 'Laboratoire supprimé'
      })
      .addCase(deleteLaboratory.rejected, (state, action) => { state.error = action.payload })
  },
})

export const { clearMessages, clearSelected } = laboratoriesSlice.actions
export default laboratoriesSlice.reducer
