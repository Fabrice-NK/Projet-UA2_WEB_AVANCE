import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { fetchUserById, deleteUser, updateUserPhoto, assignUserRoles, assignUserSubjects, clearMessages } from '../../features/users/usersSlice'
import { fetchRoles } from '../../features/roles/rolesSlice'
import { fetchSubjects } from '../../features/subjects/subjectsSlice'
import { selectIsAdmin } from '../../features/auth/authSlice'

export default function UserDetail() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { selectedUser: user, loading, error, success } = useSelector((s) => s.users)
  const roles = useSelector((s) => s.roles.list)
  const subjects = useSelector((s) => s.subjects.list)
  const isAdmin = useSelector(selectIsAdmin)
  const photoRef = useRef()
  const [selectedRoles, setSelectedRoles] = useState([])
  const [selectedSubjects, setSelectedSubjects] = useState([])

  useEffect(() => {
    dispatch(fetchUserById(id))
    dispatch(fetchRoles())
    dispatch(fetchSubjects({ size: 100 }))
  }, [dispatch, id])

  useEffect(() => {
    if (user) {
      setSelectedRoles(user.Roles?.map((r) => r.id) || [])
      setSelectedSubjects(user.Subjects?.map((s) => s.id) || [])
    }
  }, [user])

  useEffect(() => {
    if (success) {
      const t = setTimeout(() => dispatch(clearMessages()), 3000)
      return () => clearTimeout(t)
    }
  }, [success, dispatch])

  const handleDelete = () => {
    if (window.confirm('Supprimer cet utilisateur ?')) {
      dispatch(deleteUser(id)).then(() => navigate('/users'))
    }
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const formData = new FormData()
    formData.append('photo', file)
    dispatch(updateUserPhoto({ id, formData })).then(() => dispatch(fetchUserById(id)))
  }

  const handleRoleToggle = (roleId) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId) ? prev.filter((r) => r !== roleId) : [...prev, roleId]
    )
  }

  const handleSubjectToggle = (subjectId) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjectId) ? prev.filter((s) => s !== subjectId) : [...prev, subjectId]
    )
  }

  const saveRoles = () => dispatch(assignUserRoles({ id, ids: selectedRoles }))
  const saveSubjects = () => dispatch(assignUserSubjects({ id, ids: selectedSubjects }))

  if (loading) return <div className="p-4 text-center"><div className="spinner-border text-primary" /></div>
  if (!user) return <div className="p-4 text-muted">Utilisateur introuvable</div>

  return (
    <div className="p-4">
      <div className="d-flex align-items-center gap-2 mb-4">
        <Link to="/users" className="btn btn-sm btn-outline-secondary">
          <i className="bi bi-arrow-left" />
        </Link>
        <h2 className="fw-bold mb-0">Profil utilisateur</h2>
        <div className="ms-auto d-flex gap-2">
          <Link to={`/users/${id}/edit`} className="btn btn-sm btn-outline-secondary">
            <i className="bi bi-pencil me-1" />Modifier
          </Link>
          <button className="btn btn-sm btn-outline-danger" onClick={handleDelete}>
            <i className="bi bi-trash me-1" />Supprimer
          </button>
        </div>
      </div>

      {success && <div className="alert alert-success py-2">{success}</div>}
      {error && <div className="alert alert-danger py-2">{error}</div>}

      <div className="row g-4">
        {/* Profile card */}
        <div className="col-md-4">
          <div className="card text-center p-4">
            <div className="position-relative d-inline-block mx-auto mb-3">
              {user.photo ? (
                <img
                  src={user.photo}
                  alt={user.nom}
                  className="rounded-circle"
                  style={{ width: 120, height: 120, objectFit: 'cover', border: '4px solid #e94560' }}
                  onError={(e) => { e.target.style.display = 'none' }}
                />
              ) : (
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold mx-auto"
                  style={{ width: 120, height: 120, background: '#e94560', fontSize: 40 }}
                >
                  {user.prenom?.[0]?.toUpperCase()}
                </div>
              )}
              <button
                className="btn btn-sm btn-light position-absolute bottom-0 end-0 rounded-circle p-1"
                title="Changer la photo"
                onClick={() => photoRef.current.click()}
              >
                <i className="bi bi-camera" />
              </button>
              <input type="file" ref={photoRef} className="d-none" accept="image/*" onChange={handlePhotoChange} />
            </div>
            <h5 className="fw-bold mb-0">{user.prenom} {user.nom}</h5>
            <p className="text-muted mb-2">{user.email}</p>
            {user.Roles?.map((r) => (
              <span key={r.id} className="badge bg-primary me-1">{r.titre}</span>
            ))}
            {user.conduite && (
              <div className="mt-2">
                <span className={`badge ${
                  user.conduite === 'excellente' ? 'bg-success' :
                  user.conduite === 'bonne' ? 'bg-info' : 'bg-warning text-dark'
                }`}>
                  Conduite: {user.conduite}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="col-md-8">
          <div className="card mb-3">
            <div className="card-header bg-white fw-semibold">Informations</div>
            <div className="card-body">
              <dl className="row mb-0">
                <dt className="col-sm-4 text-muted">Naissance</dt>
                <dd className="col-sm-8">{user.naissance || '—'}</dd>
                <dt className="col-sm-4 text-muted">Département</dt>
                <dd className="col-sm-8">
                  {user.Department ? (
                    <Link to={`/departments/${user.Department.id}`}>{user.Department.nom}</Link>
                  ) : '—'}
                </dd>
                <dt className="col-sm-4 text-muted">Biographie</dt>
                <dd className="col-sm-8">{user.biographie || '—'}</dd>
              </dl>
            </div>
          </div>

          {/* Matières */}
          <div className="card mb-3">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <span className="fw-semibold">Matières inscrites</span>
              <button className="btn btn-sm btn-outline-primary" onClick={saveSubjects}>
                <i className="bi bi-check2 me-1" />Enregistrer
              </button>
            </div>
            <div className="card-body">
              <div className="row g-1">
                {subjects.map((s) => (
                  <div className="col-auto" key={s.id}>
                    <div
                      className={`badge fs-6 p-2 cursor-pointer ${selectedSubjects.includes(s.id) ? 'bg-primary' : 'bg-light text-dark'}`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleSubjectToggle(s.id)}
                    >
                      {selectedSubjects.includes(s.id) ? (
                        <i className="bi bi-check-circle me-1" />
                      ) : (
                        <i className="bi bi-circle me-1" />
                      )}
                      {s.nom}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Rôles — admin only */}
          {isAdmin && (
            <div className="card">
              <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <span className="fw-semibold">Rôles</span>
                <button className="btn btn-sm btn-outline-primary" onClick={saveRoles}>
                  <i className="bi bi-check2 me-1" />Enregistrer
                </button>
              </div>
              <div className="card-body">
                <div className="d-flex gap-2 flex-wrap">
                  {roles.map((r) => (
                    <div
                      key={r.id}
                      className={`badge fs-6 p-2 ${selectedRoles.includes(r.id) ? 'bg-success' : 'bg-light text-dark'}`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleRoleToggle(r.id)}
                    >
                      {selectedRoles.includes(r.id) ? (
                        <i className="bi bi-shield-check me-1" />
                      ) : (
                        <i className="bi bi-shield me-1" />
                      )}
                      {r.titre}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
