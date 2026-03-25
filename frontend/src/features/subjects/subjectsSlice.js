import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const fetchSubjects = createAsyncThunk('subjects/fetchAll', async (params = {}, { rejectWithValue }) => {
  try {
    const res = await api.get('/subjects', { params })
    return res.data.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Erreur')
  }
})

export const fetchSubjectById = createAsyncThunk('subjects/fetchById', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/subjects/${id}`)
    return res.data.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Erreur')
  }
})

export const createSubject = createAsyncThunk('subjects/create', async (formData, { rejectWithValue }) => {
  try {
    const res = await api.post('/subjects', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Erreur')
  }
})

export const updateSubject = createAsyncThunk('subjects/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/subjects/${id}`, data)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Erreur')
  }
})

export const updateSubjectImage = createAsyncThunk('subjects/updateImage', async ({ id, formData }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/subjects/${id}/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Erreur')
  }
})

export const deleteSubject = createAsyncThunk('subjects/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/subjects/${id}`)
    return id
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Erreur')
  }
})

export const assignSubjectUsers = createAsyncThunk('subjects/assignUsers', async ({ id, ids }, { rejectWithValue }) => {
  try {
    const res = await api.post(`/subjects/${id}/users`, { ids })
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Erreur')
  }
})

const subjectsSlice = createSlice({
  name: 'subjects',
  initialState: {
    list: [],
    total: 0,
    totalPages: 1,
    currentPage: 1,
    selectedSubject: null,
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearMessages(state) { state.error = null; state.success = null },
    clearSelected(state) { state.selectedSubject = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubjects.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.loading = false
        state.list = action.payload.subjects || action.payload.data || []
        state.total = action.payload.total || 0
        state.totalPages = action.payload.totalPages || 1
        state.currentPage = action.payload.currentPage || 1
      })
      .addCase(fetchSubjects.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      .addCase(fetchSubjectById.pending, (state) => { state.loading = true })
      .addCase(fetchSubjectById.fulfilled, (state, action) => { state.loading = false; state.selectedSubject = action.payload })
      .addCase(fetchSubjectById.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      .addCase(createSubject.pending, (state) => { state.loading = true; state.error = null; state.success = null })
      .addCase(createSubject.fulfilled, (state) => { state.loading = false; state.success = 'Matière créée avec succès' })
      .addCase(createSubject.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      .addCase(updateSubject.pending, (state) => { state.loading = true; state.error = null; state.success = null })
      .addCase(updateSubject.fulfilled, (state) => { state.loading = false; state.success = 'Matière mise à jour' })
      .addCase(updateSubject.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      .addCase(updateSubjectImage.fulfilled, (state) => { state.success = 'Image mise à jour' })

      .addCase(deleteSubject.fulfilled, (state, action) => {
        state.list = state.list.filter((s) => s.id !== action.payload)
        state.success = 'Matière supprimée'
      })
      .addCase(deleteSubject.rejected, (state, action) => { state.error = action.payload })

      .addCase(assignSubjectUsers.fulfilled, (state) => { state.success = 'Utilisateurs assignés' })
  },
})

export const { clearMessages, clearSelected } = subjectsSlice.actions
export default subjectsSlice.reducer
