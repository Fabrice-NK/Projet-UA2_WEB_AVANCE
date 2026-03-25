import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchUsers } from '../features/users/usersSlice'
import { fetchDepartments } from '../features/departments/departmentsSlice'
import { fetchSubjects } from '../features/subjects/subjectsSlice'
import { fetchLaboratories } from '../features/laboratories/laboratoriesSlice'
import { fetchEquipment } from '../features/equipment/equipmentSlice'
import { selectCurrentUser } from '../features/auth/authSlice'

export default function Dashboard() {
  const dispatch = useDispatch()
  const user = useSelector(selectCurrentUser)
  const users = useSelector((s) => s.users)
  const departments = useSelector((s) => s.departments)
  const subjects = useSelector((s) => s.subjects)
  const laboratories = useSelector((s) => s.laboratories)
  const equipment = useSelector((s) => s.equipment)

  useEffect(() => {
    dispatch(fetchUsers({ size: 1 }))
    dispatch(fetchDepartments({ size: 1 }))
    dispatch(fetchSubjects({ size: 1 }))
    dispatch(fetchLaboratories({ size: 1 }))
    dispatch(fetchEquipment({ size: 1 }))
  }, [dispatch])

  const stats = [
    { label: 'Utilisateurs', value: users.total, icon: 'bi-people-fill', color: '#e94560', link: '/users' },
    { label: 'Départements', value: departments.total, icon: 'bi-building', color: '#0f3460', link: '/departments' },
    { label: 'Matières', value: subjects.total, icon: 'bi-journal-text', color: '#16213e', link: '/subjects' },
    { label: 'Laboratoires', value: laboratories.total, icon: 'bi-eyedropper', color: '#533483', link: '/laboratories' },
    { label: 'Équipements', value: equipment.total, icon: 'bi-tools', color: '#1a936f', link: '/equipment' },
  ]

  return (
    <div className="p-4">
      {/* Header */}
      <div className="mb-4">
        <h1 className="fw-bold mb-1">Tableau de bord</h1>
        <p className="text-muted">
          Bonjour, <strong>{user?.prenom} {user?.nom}</strong> 👋
        </p>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        {stats.map((stat) => (
          <div className="col-6 col-md-4 col-xl-2" key={stat.label}>
            <Link to={stat.link} className="text-decoration-none">
              <div className="card h-100 text-center p-3" style={{ borderTop: `3px solid ${stat.color}` }}>
                <i className={`bi ${stat.icon} fs-1 mb-2`} style={{ color: stat.color }} />
                <h3 className="fw-bold mb-0">{stat.value || 0}</h3>
                <small className="text-muted">{stat.label}</small>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="card">
        <div className="card-header bg-white fw-semibold">
          <i className="bi bi-lightning-fill text-warning me-2" />
          Actions rapides
        </div>
        <div className="card-body">
          <div className="row g-2">
            {[
              { label: 'Nouvel utilisateur', link: '/users/new', icon: 'bi-person-plus', color: 'primary' },
              { label: 'Nouveau département', link: '/departments/new', icon: 'bi-building-add', color: 'success' },
              { label: 'Nouvelle matière', link: '/subjects/new', icon: 'bi-journal-plus', color: 'info' },
              { label: 'Nouveau laboratoire', link: '/laboratories/new', icon: 'bi-plus-circle', color: 'warning' },
              { label: 'Nouvel équipement', link: '/equipment/new', icon: 'bi-tools', color: 'secondary' },
            ].map((a) => (
              <div className="col-auto" key={a.label}>
                <Link to={a.link} className={`btn btn-outline-${a.color} btn-sm`}>
                  <i className={`bi ${a.icon} me-1`} />
                  {a.label}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
