import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchSubjects, deleteSubject, clearMessages } from '../../features/subjects/subjectsSlice'
import { selectIsAdmin } from '../../features/auth/authSlice'
import Pagination from '../../components/Pagination'

export default function SubjectList() {
  const dispatch = useDispatch()
  const { list, totalPages, currentPage, total, loading, error, success } = useSelector((s) => s.subjects)
  const isAdmin = useSelector(selectIsAdmin)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    dispatch(fetchSubjects({ page, size: 12, search }))
  }, [dispatch, page, search])

  useEffect(() => {
    if (success || error) {
      const t = setTimeout(() => dispatch(clearMessages()), 3000)
      return () => clearTimeout(t)
    }
  }, [success, error, dispatch])

  const handleDelete = (id) => {
    if (window.confirm('Supprimer cette matière ?')) dispatch(deleteSubject(id))
  }

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0">Matières</h2>
          <small className="text-muted">{total} matière(s)</small>
        </div>
        <Link to="/subjects/new" className="btn btn-sm text-white" style={{ background: '#16213e' }}>
          <i className="bi bi-journal-plus me-1" />Ajouter
        </Link>
      </div>

      {success && <div className="alert alert-success py-2">{success}</div>}
      {error && <div className="alert alert-danger py-2">{error}</div>}

      <div className="mb-3">
        <input
          type="search"
          className="form-control form-control-sm"
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          style={{ maxWidth: 280 }}
        />
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : (
        <>
          <div className="row g-3">
            {list.length === 0 ? (
              <div className="col-12 text-center text-muted py-4">Aucune matière trouvée</div>
            ) : list.map((s) => (
              <div className="col-md-4 col-lg-3" key={s.id}>
                <div className="card h-100">
                  {s.image && (
                    <img
                      src={s.image}
                      alt={s.nom}
                      className="card-img-top"
                      style={{ height: 140, objectFit: 'cover' }}
                      onError={(e) => { e.target.style.display = 'none' }}
                    />
                  )}
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <h6 className="fw-bold mb-0">{s.nom}</h6>
                      <span className={`badge ms-1 ${s.statut === 'requis' ? 'bg-danger' : 'bg-secondary'}`}>
                        {s.statut}
                      </span>
                    </div>
                    <small className="text-muted">{s.code}</small>
                    <p className="text-muted small mt-1 mb-0 text-truncate">{s.description || '—'}</p>
                  </div>
                  <div className="card-footer bg-white d-flex justify-content-end gap-1">
                    <Link to={`/subjects/${s.id}`} className="btn btn-sm btn-outline-primary">
                      <i className="bi bi-eye" />
                    </Link>
                    <Link to={`/subjects/${s.id}/edit`} className="btn btn-sm btn-outline-secondary">
                      <i className="bi bi-pencil" />
                    </Link>
                    {isAdmin && (
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(s.id)}>
                        <i className="bi bi-trash" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="mt-3">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
            </div>
          )}
        </>
      )}
    </div>
  )
}
