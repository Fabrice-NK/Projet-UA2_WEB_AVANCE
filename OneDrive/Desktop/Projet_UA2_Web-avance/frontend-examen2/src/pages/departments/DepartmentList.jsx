import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchDepartments, deleteDepartment, clearMessages } from '../../features/departments/departmentsSlice'
import Pagination from '../../components/Pagination'

export default function DepartmentList() {
  const dispatch = useDispatch()
  const { list, totalPages, currentPage, total, loading, error, success } = useSelector((s) => s.departments)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    dispatch(fetchDepartments({ page, size: 10, search }))
  }, [dispatch, page, search])

  useEffect(() => {
    if (success || error) {
      const t = setTimeout(() => dispatch(clearMessages()), 3000)
      return () => clearTimeout(t)
    }
  }, [success, error, dispatch])

  const handleDelete = (id) => {
    if (window.confirm('Supprimer ce département ?')) dispatch(deleteDepartment(id))
  }

  const domaineBadge = (d) => {
    const map = { sciences: 'bg-success', literature: 'bg-info', autre: 'bg-secondary' }
    return map[d] || 'bg-secondary'
  }

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0">Départements</h2>
          <small className="text-muted">{total} département(s)</small>
        </div>
        <Link to="/departments/new" className="btn btn-sm text-white" style={{ background: '#0f3460' }}>
          <i className="bi bi-building-add me-1" />Ajouter
        </Link>
      </div>

      {success && <div className="alert alert-success py-2">{success}</div>}
      {error && <div className="alert alert-danger py-2">{error}</div>}

      <div className="card">
        <div className="card-header bg-white">
          <input
            type="search"
            className="form-control form-control-sm"
            placeholder="Rechercher par nom..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            style={{ maxWidth: 280 }}
          />
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Image</th>
                    <th>Nom</th>
                    <th>Domaine</th>
                    <th>Histoire</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {list.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-4 text-muted">Aucun département trouvé</td></tr>
                  ) : list.map((d) => (
                    <tr key={d.id}>
                      <td>
                        {d.image ? (
                          <img
                            src={d.image}
                            alt={d.nom}
                            className="rounded"
                            style={{ width: 50, height: 40, objectFit: 'cover' }}
                            onError={(e) => { e.target.style.display = 'none' }}
                          />
                        ) : (
                          <div className="rounded bg-light d-flex align-items-center justify-content-center" style={{ width: 50, height: 40 }}>
                            <i className="bi bi-building text-muted" />
                          </div>
                        )}
                      </td>
                      <td className="fw-semibold">{d.nom}</td>
                      <td><span className={`badge ${domaineBadge(d.domaine)}`}>{d.domaine}</span></td>
                      <td className="text-muted" style={{ maxWidth: 200 }}>
                        <span className="text-truncate d-block">{d.histoire || '—'}</span>
                      </td>
                      <td className="text-end">
                        <Link to={`/departments/${d.id}`} className="btn btn-sm btn-outline-primary me-1">
                          <i className="bi bi-eye" />
                        </Link>
                        <Link to={`/departments/${d.id}/edit`} className="btn btn-sm btn-outline-secondary me-1">
                          <i className="bi bi-pencil" />
                        </Link>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(d.id)}>
                          <i className="bi bi-trash" />
                        </button>
                      </td>
                    </tr>
                  ))}
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
