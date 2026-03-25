import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout, selectCurrentUser, selectIsAdmin, selectIsProf } from '../features/auth/authSlice'

export default function Layout() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(selectCurrentUser)
  const isAdmin = useSelector(selectIsAdmin)
  const isProf = useSelector(selectIsProf)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <nav
        className="d-flex flex-column flex-shrink-0 p-3 text-white"
        style={{ width: '260px', background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', minHeight: '100vh' }}
      >
        <a className="d-flex align-items-center mb-3 text-white text-decoration-none" href="/">
          <i className="bi bi-flask me-2 fs-4" style={{ color: '#e94560' }} />
          <span className="fw-bold fs-5">GestiLab</span>
        </a>
        <hr className="text-white-50" />

        <ul className="nav nav-pills flex-column mb-auto">
          <li>
            <NavLink to="/" end className={({ isActive }) => `nav-link text-white ${isActive ? 'active' : ''}`}>
              <i className="bi bi-speedometer2 me-2" />
              Tableau de bord
            </NavLink>
          </li>

          <li className="mt-2">
            <small className="text-white-50 text-uppercase px-3" style={{ fontSize: '0.7rem', letterSpacing: '0.1em' }}>
              Gestion
            </small>
          </li>

          <li>
            <NavLink to="/users" className={({ isActive }) => `nav-link text-white ${isActive ? 'active' : ''}`}>
              <i className="bi bi-people me-2" />
              Utilisateurs
            </NavLink>
          </li>
          <li>
            <NavLink to="/departments" className={({ isActive }) => `nav-link text-white ${isActive ? 'active' : ''}`}>
              <i className="bi bi-building me-2" />
              Départements
            </NavLink>
          </li>
          <li>
            <NavLink to="/subjects" className={({ isActive }) => `nav-link text-white ${isActive ? 'active' : ''}`}>
              <i className="bi bi-journal-text me-2" />
              Matières
            </NavLink>
          </li>

          <li className="mt-2">
            <small className="text-white-50 text-uppercase px-3" style={{ fontSize: '0.7rem', letterSpacing: '0.1em' }}>
              Laboratoires
            </small>
          </li>

          <li>
            <NavLink to="/laboratories" className={({ isActive }) => `nav-link text-white ${isActive ? 'active' : ''}`}>
              <i className="bi bi-eyedropper me-2" />
              Laboratoires
            </NavLink>
          </li>
          <li>
            <NavLink to="/equipment" className={({ isActive }) => `nav-link text-white ${isActive ? 'active' : ''}`}>
              <i className="bi bi-tools me-2" />
              Équipements
            </NavLink>
          </li>

          {isAdmin && (
            <>
              <li className="mt-2">
                <small className="text-white-50 text-uppercase px-3" style={{ fontSize: '0.7rem', letterSpacing: '0.1em' }}>
                  Administration
                </small>
              </li>
              <li>
                <NavLink to="/roles" className={({ isActive }) => `nav-link text-white ${isActive ? 'active' : ''}`}>
                  <i className="bi bi-shield-check me-2" />
                  Rôles
                </NavLink>
              </li>
            </>
          )}
        </ul>

        <hr className="text-white-50" />
        <div className="dropdown">
          <a
            href="#"
            className="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
            data-bs-toggle="dropdown"
          >
            <div
              className="rounded-circle me-2 d-flex align-items-center justify-content-center text-white fw-bold"
              style={{ width: 36, height: 36, background: '#e94560', fontSize: 14, flexShrink: 0 }}
            >
              {user?.prenom?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="text-truncate" style={{ maxWidth: 140 }}>
              <small className="d-block fw-semibold">{user?.prenom} {user?.nom}</small>
              <small className="text-white-50" style={{ fontSize: '0.7rem' }}>
                {user?.Roles?.[0]?.titre || 'Utilisateur'}
              </small>
            </div>
          </a>
          <ul className="dropdown-menu dropdown-menu-dark text-small shadow">
            <li>
              <NavLink className="dropdown-item" to={`/users/${user?.id}`}>
                <i className="bi bi-person me-2" />Mon profil
              </NavLink>
            </li>
            <li><hr className="dropdown-divider" /></li>
            <li>
              <button className="dropdown-item text-danger" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-2" />
                Déconnexion
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main content */}
      <div className="flex-grow-1 bg-light">
        <Outlet />
      </div>
    </div>
  )
}
