import { Routes, Route, Navigate } from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute'
import RoleRoute from './components/RoleRoute'
import Layout from './components/Layout'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

import UserList from './pages/users/UserList'
import UserForm from './pages/users/UserForm'
import UserDetail from './pages/users/UserDetail'

import DepartmentList from './pages/departments/DepartmentList'
import DepartmentForm from './pages/departments/DepartmentForm'
import DepartmentDetail from './pages/departments/DepartmentDetail'

import RoleList from './pages/roles/RoleList'
import RoleForm from './pages/roles/RoleForm'

import SubjectList from './pages/subjects/SubjectList'
import SubjectForm from './pages/subjects/SubjectForm'
import SubjectDetail from './pages/subjects/SubjectDetail'

import LaboratoryList from './pages/laboratories/LaboratoryList'
import LaboratoryForm from './pages/laboratories/LaboratoryForm'
import LaboratoryDetail from './pages/laboratories/LaboratoryDetail'

import EquipmentList from './pages/equipment/EquipmentList'
import EquipmentForm from './pages/equipment/EquipmentForm'
import EquipmentDetail from './pages/equipment/EquipmentDetail'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<PrivateRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />

          {/* Users */}
          <Route path="/users" element={<UserList />} />
          <Route path="/users/new" element={<UserForm />} />
          <Route path="/users/:id" element={<UserDetail />} />
          <Route path="/users/:id/edit" element={<UserForm />} />

          {/* Departments */}
          <Route path="/departments" element={<DepartmentList />} />
          <Route path="/departments/new" element={<DepartmentForm />} />
          <Route path="/departments/:id" element={<DepartmentDetail />} />
          <Route path="/departments/:id/edit" element={<DepartmentForm />} />

          {/* Subjects */}
          <Route path="/subjects" element={<SubjectList />} />
          <Route path="/subjects/new" element={<SubjectForm />} />
          <Route path="/subjects/:id" element={<SubjectDetail />} />
          <Route path="/subjects/:id/edit" element={<SubjectForm />} />

          {/* Laboratories */}
          <Route path="/laboratories" element={<LaboratoryList />} />
          <Route path="/laboratories/new" element={<LaboratoryForm />} />
          <Route path="/laboratories/:id" element={<LaboratoryDetail />} />
          <Route path="/laboratories/:id/edit" element={<LaboratoryForm />} />

          {/* Equipment */}
          <Route path="/equipment" element={<EquipmentList />} />
          <Route path="/equipment/new" element={<EquipmentForm />} />
          <Route path="/equipment/:id" element={<EquipmentDetail />} />
          <Route path="/equipment/:id/edit" element={<EquipmentForm />} />

          {/* Roles — admin only */}
          <Route element={<RoleRoute roles={['admin']} />}>
            <Route path="/roles" element={<RoleList />} />
            <Route path="/roles/new" element={<RoleForm />} />
            <Route path="/roles/:id/edit" element={<RoleForm />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
