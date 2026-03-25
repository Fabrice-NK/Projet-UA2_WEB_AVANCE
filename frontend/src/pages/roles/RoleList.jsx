import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchRoles, deleteRole, clearMessages } from '../../features/roles/rolesSlice'

export default function RoleList() {
  const dispatch = useDispatch()
  const { list, loading, error, success } = useSelector((s) => s.roles)

  useEffect(() => {
    dispatch(fetchRoles())
  }, [dispatch])

  useEffect(() => {
    if (success || error) {
      const t = setTimeout(() => dispatch(clearMessages()), 3000)
      return () => clearTimeout(t)
    }
  }, [success, error, dispatch])

  const handleDelete = (id) => {
    if (window.confirm('Supprimer ce rôle ?')) dispatch(deleteRole(id))
  }

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Rôles</h2>
        <Link to="/roles/new" className="btn btn-sm text-white" style={{ background: '#1a1a2e' }}>
          <i className="bi bi-shield-plus me-1" />Ajouter
        </Link>
      </div>

      {success && <div className="alert alert-success py-2">{success}</div>}
      {error && <div className="alert alert-danger py-2">{error}</div>}

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : (
        <div className="row g-3">
          {list.length === 0 ? (
            <div className="col-12 text-center text-muted py-4">Aucun rôle trouvé</div>
          ) : list.map((r) => (
            <div className="col-md-4 col-lg-3" key={r.id}>
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <div className="rounded-circle d-flex align-items-center justify-content-center text-white"
                      style={{ width: 40, height: 40, background: '#1a1a2e', flexShrink: 0 }}>
                      <i className="bi bi-shield-check" />
                    </div>
                    <h5 className="fw-bold mb-0 text-capitalize">{r.titre}</h5>
                  </div>
                  <p className="text-muted small mb-0">{r.description || 'Aucune description'}</p>
                </div>
                <div className="card-footer bg-white d-flex justify-content-end gap-1">
                  <Link to={`/roles/${r.id}/edit`} className="btn btn-sm btn-outline-secondary">
                    <i className="bi bi-pencil" />
                  </Link>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(r.id)}>
                    <i className="bi bi-trash" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
