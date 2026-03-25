import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { fetchDepartmentById, deleteDepartment, updateDepartmentImage } from '../../features/departments/departmentsSlice'
import { selectIsAdmin } from '../../features/auth/authSlice'
import api from '../../services/api'
import { useState } from 'react'

export default function DepartmentDetail() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { selectedDepartment: dept, loading, error, success } = useSelector((s) => s.departments)
  const isAdmin = useSelector(selectIsAdmin)
  const imageRef = useRef()
  const [users, setUsers] = useState([])
  const [subjects, setSubjects] = useState([])

  useEffect(() => {
    dispatch(fetchDepartmentById(id))
    if (isAdmin) {
      api.get(`/departments/${id}/users`).then((r) => setUsers(r.data.data || []))
      api.get(`/departments/${id}/subjects`).then((r) => setSubjects(r.data.data || []))
    }
  }, [dispatch, id, isAdmin])

  const handleDelete = () => {
    if (window.confirm('Supprimer ce département ?')) {
      dispatch(deleteDepartment(id)).then(() => navigate('/departments'))
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const formData = new FormData()
    formData.append('image', file)
    dispatch(updateDepartmentImage({ id, formData })).then(() => dispatch(fetchDepartmentById(id)))
  }

  if (loading && !dept) return <div className="p-4 text-center"><div className="spinner-border text-primary" /></div>
  if (!dept) return <div className="p-4 text-muted">Département introuvable</div>

  return (
    <div className="p-4">
      <div className="d-flex align-items-center gap-2 mb-4">
        <Link to="/departments" className="btn btn-sm btn-outline-secondary"><i className="bi bi-arrow-left" /></Link>
        <h2 className="fw-bold mb-0">{dept.nom}</h2>
        <span className={`badge ms-2 ${dept.domaine === 'sciences' ? 'bg-success' : dept.domaine === 'literature' ? 'bg-info' : 'bg-secondary'}`}>
          {dept.domaine}
        </span>
        <div className="ms-auto d-flex gap-2">
          <Link to={`/departments/${id}/edit`} className="btn btn-sm btn-outline-secondary">
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
        <div className="col-md-4">
          <div className="card">
            <div className="position-relative">
              {dept.image ? (
                <img
                  src={dept.image}
                  alt={dept.nom}
                  className="card-img-top"
                  style={{ height: 200, objectFit: 'cover' }}
                  onError={(e) => { e.target.style.display = 'none' }}
                />
              ) : (
                <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: 200 }}>
                  <i className="bi bi-building fs-1 text-muted" />
                </div>
              )}
              {isAdmin && (
                <button
                  className="btn btn-sm btn-light position-absolute bottom-0 end-0 m-2 rounded-circle"
                  onClick={() => imageRef.current.click()}
                  title="Changer l'image"
                >
                  <i className="bi bi-camera" />
                </button>
              )}
              <input type="file" ref={imageRef} className="d-none" accept="image/*" onChange={handleImageChange} />
            </div>
            <div className="card-body">
              <p className="text-muted mb-0">{dept.histoire || 'Aucune histoire renseignée.'}</p>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          {isAdmin && (
            <>
              <div className="card mb-3">
                <div className="card-header bg-white fw-semibold">
                  <i className="bi bi-people me-2" />Utilisateurs ({users.length})
                </div>
                <ul className="list-group list-group-flush">
                  {users.length === 0 ? (
                    <li className="list-group-item text-muted">Aucun utilisateur</li>
                  ) : users.slice(0, 5).map((u) => (
                    <li key={u.id} className="list-group-item d-flex align-items-center gap-2">
                      <div className="rounded-circle d-flex align-items-center justify-content-center text-white"
                        style={{ width: 30, height: 30, background: '#e94560', fontSize: 12, flexShrink: 0 }}>
                        {u.prenom?.[0]?.toUpperCase()}
                      </div>
                      <Link to={`/users/${u.id}`}>{u.prenom} {u.nom}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card">
                <div className="card-header bg-white fw-semibold">
                  <i className="bi bi-journal-text me-2" />Matières ({subjects.length})
                </div>
                <div className="card-body">
                  {subjects.length === 0 ? (
                    <p className="text-muted mb-0">Aucune matière</p>
                  ) : (
                    <div className="d-flex flex-wrap gap-2">
                      {subjects.map((s) => (
                        <Link key={s.id} to={`/subjects/${s.id}`} className="badge bg-primary text-decoration-none fs-6">
                          {s.nom}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
