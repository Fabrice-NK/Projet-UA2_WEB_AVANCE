import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const fetchEquipment = createAsyncThunk('equipment/fetchAll', async (params = {}, { rejectWithValue }) => {
  try {
    const res = await api.get('/equipment', { params })
    return res.data.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Erreur')
  }
})

export const fetchEquipmentById = createAsyncThunk('equipment/fetchById', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/equipment/${id}`)
    return res.data.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Erreur')
  }
})

export const createEquipment = createAsyncThunk('equipment/create', async (formData, { rejectWithValue }) => {
  try {
    const res = await api.post('/equipment', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Erreur')
  }
})

export const updateEquipment = createAsyncThunk('equipment/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/equipment/${id}`, data)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Erreur')
  }
})

export const updateEquipmentImage = createAsyncThunk('equipment/updateImage', async ({ id, formData }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/equipment/${id}/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Erreur')
  }
})

export const deleteEquipment = createAsyncThunk('equipment/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/equipment/${id}`)
    return id
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Erreur')
  }
})

const equipmentSlice = createSlice({
  name: 'equipment',
  initialState: {
    list: [],
    total: 0,
    totalPages: 1,
    currentPage: 1,
    selectedEquipment: null,
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearMessages(state) { state.error = null; state.success = null },
    clearSelected(state) { state.selectedEquipment = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEquipment.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchEquipment.fulfilled, (state, action) => {
        state.loading = false
        state.list = action.payload.equipment || action.payload.equipments || action.payload.data || []
        state.total = action.payload.total || 0
        state.totalPages = action.payload.totalPages || 1
        state.currentPage = action.payload.currentPage || 1
      })
      .addCase(fetchEquipment.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      .addCase(fetchEquipmentById.pending, (state) => { state.loading = true })
      .addCase(fetchEquipmentById.fulfilled, (state, action) => { state.loading = false; state.selectedEquipment = action.payload })
      .addCase(fetchEquipmentById.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      .addCase(createEquipment.pending, (state) => { state.loading = true; state.error = null; state.success = null })
      .addCase(createEquipment.fulfilled, (state) => { state.loading = false; state.success = 'Équipement créé avec succès' })
      .addCase(createEquipment.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      .addCase(updateEquipment.pending, (state) => { state.loading = true; state.error = null; state.success = null })
      .addCase(updateEquipment.fulfilled, (state) => { state.loading = false; state.success = 'Équipement mis à jour' })
      .addCase(updateEquipment.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      .addCase(updateEquipmentImage.fulfilled, (state) => { state.success = 'Image mise à jour' })

      .addCase(deleteEquipment.fulfilled, (state, action) => {
        state.list = state.list.filter((e) => e.id !== action.payload)
        state.success = 'Équipement supprimé'
      })
      .addCase(deleteEquipment.rejected, (state, action) => { state.error = action.payload })
  },
})

export const { clearMessages, clearSelected } = equipmentSlice.actions
export default equipmentSlice.reducer
