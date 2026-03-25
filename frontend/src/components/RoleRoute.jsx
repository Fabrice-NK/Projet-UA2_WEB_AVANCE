import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated, selectIsAdmin, selectIsProf } from '../features/auth/authSlice'

export default function RoleRoute({ roles = [] }) {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const isAdmin = useSelector(selectIsAdmin)
  const isProf = useSelector(selectIsProf)

  if (!isAuthenticated) return <Navigate to="/login" replace />

  const hasRole =
    roles.includes('admin') ? isAdmin :
    roles.includes('prof') ? isProf :
    true

  return hasRole ? <Outlet /> : <Navigate to="/" replace />
}
