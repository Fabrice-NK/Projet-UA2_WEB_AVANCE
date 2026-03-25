import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchLaboratories, deleteLaboratory, clearMessages } from '../../features/laboratories/laboratoriesSlice'
import { selectIsProf } from '../../features/auth/authSlice'
import Pagination from '../../components/Pagination'

export default function LaboratoryList() {
  const dispatch = useDispatch()
  const { list, totalPages, currentPage, total, loading, error, success } = useSelector((s) => s.laboratories)
  const isProf = useSelector(selectIsProf)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    dispatch(fetchLaboratories({ page, size: 12, search }))
  }, [dispatch, page, search])

  useEffect(() => {
    if (success || error) {
      const t = setTimeout(() => dispatch(clearMessages()), 3000)
      return () => clearTimeout(t)
    }
  }, [success, error, dispatch])

  const handleDelete = (id) => {
    if (window.confirm('Supprimer ce laboratoire ?')) dispatch(deleteLaboratory(id))
  }

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0">Laboratoires</h2>
          <small className="text-muted">{total} laboratoire(s)</small>
        </div>
        {isProf && (
          <Link to="/laboratories/new" className="btn btn-sm text-white" style={{ background: '#533483' }}>
            <i className="bi bi-plus-circle me-1" />Ajouter
          </Link>
        )}
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
              <div className="col-12 text-center text-muted py-4">Aucun laboratoire trouvé</div>
            ) : list.map((lab) => (
              <div className="col-md-4 col-lg-3" key={lab.id}>
                <div className="card h-100">
                  {lab.image ? (
                    <img
                      src={lab.image}
                      alt={lab.nom}
                      className="card-img-top"
                      style={{ height: 150, objectFit: 'cover' }}
                      onError={(e) => { e.target.style.display = 'none' }}
                    />
                  ) : (
                    <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: 150 }}>
                      <i className="bi bi-eyedropper fs-1 text-muted" />
                    </div>
                  )}
                  <div className="card-body">
                    <h6 className="fw-bold mb-1">{lab.nom}</h6>
                    {lab.salle && <small className="text-muted"><i className="bi bi-geo-alt me-1" />{lab.salle}</small>}
                  </div>
                  <div className="card-footer bg-white d-flex justify-content-end gap-1">
                    <Link to={`/laboratories/${lab.id}`} className="btn btn-sm btn-outline-primary">
                      <i className="bi bi-eye" />
                    </Link>
                    {isProf && (
                      <>
                        <Link to={`/laboratories/${lab.id}/edit`} className="btn btn-sm btn-outline-secondary">
                          <i className="bi bi-pencil" />
                        </Link>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(lab.id)}>
                          <i className="bi bi-trash" />
                        </button>
                      </>
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
