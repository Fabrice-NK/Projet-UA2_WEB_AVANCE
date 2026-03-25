import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchEquipment, deleteEquipment, clearMessages } from '../../features/equipment/equipmentSlice'
import { selectIsProf } from '../../features/auth/authSlice'
import Pagination from '../../components/Pagination'

export default function EquipmentList() {
  const dispatch = useDispatch()
  const { list, totalPages, currentPage, total, loading, error, success } = useSelector((s) => s.equipment)
  const isProf = useSelector(selectIsProf)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    dispatch(fetchEquipment({ page, size: 12, search }))
  }, [dispatch, page, search])

  useEffect(() => {
    if (success || error) {
      const t = setTimeout(() => dispatch(clearMessages()), 3000)
      return () => clearTimeout(t)
    }
  }, [success, error, dispatch])

  const handleDelete = (id) => {
    if (window.confirm('Supprimer cet équipement ?')) dispatch(deleteEquipment(id))
  }

  const modeleBadge = (m) => {
    const map = { nouveau: 'bg-success', refait: 'bg-info', ancien: 'bg-warning text-dark' }
    return map[m] || 'bg-secondary'
  }

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0">Équipements</h2>
          <small className="text-muted">{total} équipement(s)</small>
        </div>
        {isProf && (
          <Link to="/equipment/new" className="btn btn-sm text-white" style={{ background: '#1a936f' }}>
            <i className="bi bi-tools me-1" />Ajouter
          </Link>
        )}
      </div>

      {success && <div className="alert alert-success py-2">{success}</div>}
      {error && <div className="alert alert-danger py-2">{error}</div>}

      <div className="card">
        <div className="card-header bg-white">
          <input
            type="search"
            className="form-control form-control-sm"
            placeholder="Rechercher..."
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
                    <th>Modèle</th>
                    <th>Laboratoire</th>
                    <th>Description</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {list.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-4 text-muted">Aucun équipement trouvé</td></tr>
                  ) : list.map((eq) => (
                    <tr key={eq.id}>
                      <td>
                        {eq.image ? (
                          <img
                            src={eq.image}
                            alt={eq.nom}
                            className="rounded"
                            style={{ width: 50, height: 40, objectFit: 'cover' }}
                            onError={(e) => { e.target.style.display = 'none' }}
                          />
                        ) : (
                          <div className="rounded bg-light d-flex align-items-center justify-content-center" style={{ width: 50, height: 40 }}>
                            <i className="bi bi-tools text-muted" />
                          </div>
                        )}
                      </td>
                      <td className="fw-semibold">{eq.nom}</td>
                      <td><span className={`badge ${modeleBadge(eq.modele)}`}>{eq.modele}</span></td>
                      <td>
                        {eq.Laboratory ? (
                          <Link to={`/laboratories/${eq.Laboratory.id}`} className="text-decoration-none">
                            {eq.Laboratory.nom}
                          </Link>
                        ) : '—'}
                      </td>
                      <td className="text-muted" style={{ maxWidth: 180 }}>
                        <span className="text-truncate d-block">{eq.description || '—'}</span>
                      </td>
                      <td className="text-end">
                        <Link to={`/equipment/${eq.id}`} className="btn btn-sm btn-outline-primary me-1">
                          <i className="bi bi-eye" />
                        </Link>
                        {isProf && (
                          <>
                            <Link to={`/equipment/${eq.id}/edit`} className="btn btn-sm btn-outline-secondary me-1">
                              <i className="bi bi-pencil" />
                            </Link>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(eq.id)}>
                              <i className="bi bi-trash" />
                            </button>
                          </>
                        )}
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
