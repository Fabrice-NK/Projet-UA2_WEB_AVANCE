import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { fetchEquipmentById, deleteEquipment, updateEquipmentImage } from '../../features/equipment/equipmentSlice'
import { selectIsProf } from '../../features/auth/authSlice'

export default function EquipmentDetail() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { selectedEquipment: eq, loading, error, success } = useSelector((s) => s.equipment)
  const isProf = useSelector(selectIsProf)
  const imageRef = useRef()

  useEffect(() => {
    dispatch(fetchEquipmentById(id))
  }, [dispatch, id])

  const handleDelete = () => {
    if (window.confirm('Supprimer cet équipement ?')) {
      dispatch(deleteEquipment(id)).then(() => navigate('/equipment'))
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const formData = new FormData()
    formData.append('image', file)
    dispatch(updateEquipmentImage({ id, formData })).then(() => dispatch(fetchEquipmentById(id)))
  }

  if (loading && !eq) return <div className="p-4 text-center"><div className="spinner-border text-primary" /></div>
  if (!eq) return <div className="p-4 text-muted">Équipement introuvable</div>

  const modeleBadge = (m) => {
    const map = { nouveau: 'bg-success', refait: 'bg-info', ancien: 'bg-warning text-dark' }
    return map[m] || 'bg-secondary'
  }

  return (
    <div className="p-4">
      <div className="d-flex align-items-center gap-2 mb-4">
        <Link to="/equipment" className="btn btn-sm btn-outline-secondary"><i className="bi bi-arrow-left" /></Link>
        <h2 className="fw-bold mb-0">{eq.nom}</h2>
        {eq.modele && <span className={`badge ${modeleBadge(eq.modele)}`}>{eq.modele}</span>}
        {isProf && (
          <div className="ms-auto d-flex gap-2">
            <Link to={`/equipment/${id}/edit`} className="btn btn-sm btn-outline-secondary">
              <i className="bi bi-pencil me-1" />Modifier
            </Link>
            <button className="btn btn-sm btn-outline-danger" onClick={handleDelete}>
              <i className="bi bi-trash me-1" />Supprimer
            </button>
          </div>
        )}
      </div>

      {success && <div className="alert alert-success py-2">{success}</div>}
      {error && <div className="alert alert-danger py-2">{error}</div>}

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card">
            <div className="position-relative">
              {eq.image ? (
                <img
                  src={eq.image}
                  alt={eq.nom}
                  className="card-img-top"
                  style={{ height: 220, objectFit: 'cover' }}
                  onError={(e) => { e.target.style.display = 'none' }}
                />
              ) : (
                <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: 220 }}>
                  <i className="bi bi-tools fs-1 text-muted" />
                </div>
              )}
              {isProf && (
                <button
                  className="btn btn-sm btn-light position-absolute bottom-0 end-0 m-2 rounded-circle"
                  onClick={() => imageRef.current.click()}
                >
                  <i className="bi bi-camera" />
                </button>
              )}
              <input type="file" ref={imageRef} className="d-none" accept="image/*" onChange={handleImageChange} />
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card">
            <div className="card-header bg-white fw-semibold">Informations</div>
            <div className="card-body">
              <dl className="row mb-0">
                <dt className="col-sm-4 text-muted">Modèle</dt>
                <dd className="col-sm-8">
                  <span className={`badge ${modeleBadge(eq.modele)}`}>{eq.modele}</span>
                </dd>
                <dt className="col-sm-4 text-muted">Laboratoire</dt>
                <dd className="col-sm-8">
                  {eq.Laboratory ? (
                    <Link to={`/laboratories/${eq.Laboratory.id}`}>{eq.Laboratory.nom}</Link>
                  ) : '—'}
                </dd>
                <dt className="col-sm-4 text-muted">Description</dt>
                <dd className="col-sm-8">{eq.description || '—'}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
