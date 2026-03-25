import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchUsers, deleteUser, clearMessages } from '../../features/users/usersSlice'
import Pagination from '../../components/Pagination'

export default function UserList() {
  const dispatch = useDispatch()
  const { list, totalPages, currentPage, total, loading, error, success } = useSelector((s) => s.users)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    dispatch(fetchUsers({ page, size: 10, search }))
  }, [dispatch, page, search])

  useEffect(() => {
    if (success || error) {
      const t = setTimeout(() => dispatch(clearMessages()), 3000)
      return () => clearTimeout(t)
    }
  }, [success, error, dispatch])

  const handleDelete = (id) => {
    if (window.confirm('Supprimer cet utilisateur ?')) {
      dispatch(deleteUser(id))
    }
  }

  const handleSearch = (e) => {
    setSearch(e.target.value)
    setPage(1)
  }

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0">Utilisateurs</h2>
          <small className="text-muted">{total} utilisateur(s) au total</small>
        </div>
        <Link to="/users/new" className="btn btn-sm text-white" style={{ background: '#e94560' }}>
          <i className="bi bi-person-plus me-1" />
          Ajouter
        </Link>
      </div>

      {success && <div className="alert alert-success py-2">{success}</div>}
      {error && <div className="alert alert-danger py-2">{error}</div>}

      <div className="card">
        <div className="card-header bg-white d-flex gap-2">
          <input
            type="search"
            className="form-control form-control-sm"
            placeholder="Rechercher par nom..."
            value={search}
            onChange={handleSearch}
            style={{ maxWidth: 280 }}
          />
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" />
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Photo</th>
                    <th>Nom complet</th>
                    <th>Email</th>
                    <th>Département</th>
                    <th>Conduite</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {list.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-4 text-muted">
                        Aucun utilisateur trouvé
                      </td>
                    </tr>
                  ) : (
                    list.map((u) => (
                      <tr key={u.id}>
                        <td>
                          {u.photo ? (
                            <img
                              src={u.photo}
                              alt={u.nom}
                              className="rounded-circle"
                              style={{ width: 36, height: 36, objectFit: 'cover' }}
                              onError={(e) => { e.target.style.display = 'none' }}
                            />
                          ) : (
                            <div
                              className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                              style={{ width: 36, height: 36, background: '#e94560', fontSize: 13 }}
                            >
                              {u.prenom?.[0]?.toUpperCase()}
                            </div>
                          )}
                        </td>
                        <td>
                          <div className="fw-semibold">{u.prenom} {u.nom}</div>
                        </td>
                        <td className="text-muted">{u.email}</td>
                        <td>
                          {u.Department ? (
                            <span className="badge bg-secondary">{u.Department.nom}</span>
                          ) : '—'}
                        </td>
                        <td>
                          {u.conduite && (
                            <span className={`badge ${
                              u.conduite === 'excellente' ? 'bg-success' :
                              u.conduite === 'bonne' ? 'bg-info' : 'bg-warning text-dark'
                            }`}>
                              {u.conduite}
                            </span>
                          )}
                        </td>
                        <td className="text-end">
                          <Link to={`/users/${u.id}`} className="btn btn-sm btn-outline-primary me-1">
                            <i className="bi bi-eye" />
                          </Link>
                          <Link to={`/users/${u.id}/edit`} className="btn btn-sm btn-outline-secondary me-1">
                            <i className="bi bi-pencil" />
                          </Link>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(u.id)}
                          >
                            <i className="bi bi-trash" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {totalPages > 1 && (
          <div className="card-footer bg-white">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>
    </div>
  )
}
