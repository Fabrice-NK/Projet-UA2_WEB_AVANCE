import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import usersReducer from '../features/users/usersSlice'
import departmentsReducer from '../features/departments/departmentsSlice'
import rolesReducer from '../features/roles/rolesSlice'
import subjectsReducer from '../features/subjects/subjectsSlice'
import laboratoriesReducer from '../features/laboratories/laboratoriesSlice'
import equipmentReducer from '../features/equipment/equipmentSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    departments: departmentsReducer,
    roles: rolesReducer,
    subjects: subjectsReducer,
    laboratories: laboratoriesReducer,
    equipment: equipmentReducer,
  },
})
