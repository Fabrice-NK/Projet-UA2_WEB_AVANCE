import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { fetchLaboratoryById, deleteLaboratory, updateLaboratoryImage } from '../../features/laboratories/laboratoriesSlice'
import { selectIsProf } from '../../features/auth/authSlice'
import api from '../../services/api'
import { useState } from 'react'

export default function LaboratoryDetail() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { selectedLaboratory: lab, loading, error, success } = useSelector((s) => s.laboratories)
  const isProf = useSelector(selectIsProf)
  const imageRef = useRef()
  const [equipments, setEquipments] = useState([])
  const [subjects, setSubjects] = useState([])

  useEffect(() => {
    dispatch(fetchLaboratoryById(id))
    api.get(`/laboratories/${id}/equipment`).then((r) => setEquipments(r.data.data || []))
    api.get(`/laboratories/${id}/subjects`).then((r) => setSubjects(r.data.data || []))
  }, [dispatch, id])

  const handleDelete = () => {
    if (window.confirm('Supprimer ce laboratoire ?')) {
      dispatch(deleteLaboratory(id)).then(() => navigate('/laboratories'))
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const formData = new FormData()
    formData.append('image', file)
    dispatch(updateLaboratoryImage({ id, formData })).then(() => dispatch(fetchLaboratoryById(id)))
  }

  if (loading && !lab) return <div className="p-4 text-center"><div className="spinner-border text-primary" /></div>
  if (!lab) return <div className="p-4 text-muted">Laboratoire introuvable</div>

  return (
    <div className="p-4">
      <div className="d-flex align-items-center gap-2 mb-4">
        <Link to="/laboratories" className="btn btn-sm btn-outline-secondary"><i className="bi bi-arrow-left" /></Link>
        <h2 className="fw-bold mb-0">{lab.nom}</h2>
        {lab.salle && <span className="badge bg-secondary"><i className="bi bi-geo-alt me-1" />{lab.salle}</span>}
        {isProf && (
          <div className="ms-auto d-flex gap-2">
            <Link to={`/laboratories/${id}/edit`} className="btn btn-sm btn-outline-secondary">
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
              {lab.image ? (
                <img
                  src={lab.image}
                  alt={lab.nom}
                  className="card-img-top"
                  style={{ height: 200, objectFit: 'cover' }}
                  onError={(e) => { e.target.style.display = 'none' }}
                />
              ) : (
                <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: 200 }}>
                  <i className="bi bi-eyedropper fs-1 text-muted" />
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
            <div className="card-body">
              {lab.Department && (
                <p className="mb-1">
                  <i className="bi bi-building me-1 text-muted" />
                  <Link to={`/departments/${lab.Department.id}`}>{lab.Department.nom}</Link>
                </p>
              )}
              <p className="text-muted mb-0 small">{lab.information || 'Aucune information.'}</p>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          {/* Equipments */}
          <div className="card mb-3">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <span className="fw-semibold"><i className="bi bi-tools me-2" />Équipements ({equipments.length})</span>
              {isProf && (
                <Link to="/equipment/new" className="btn btn-sm btn-outline-primary">
                  <i className="bi bi-plus me-1" />Ajouter
                </Link>
              )}
            </div>
            <div className="card-body">
              {equipments.length === 0 ? (
                <p className="text-muted mb-0">Aucun équipement</p>
              ) : (
                <div className="row g-2">
                  {equipments.map((eq) => (
                    <div className="col-auto" key={eq.id}>
                      <Link to={`/equipment/${eq.id}`} className="badge bg-light text-dark text-decoration-none fs-6 border">
                        <i className="bi bi-wrench me-1" />{eq.nom}
                        <span className={`ms-1 badge ${eq.modele === 'nouveau' ? 'bg-success' : eq.modele === 'refait' ? 'bg-info' : 'bg-warning text-dark'}`} style={{ fontSize: '0.65rem' }}>
                          {eq.modele}
                        </span>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Subjects */}
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
        </div>
      </div>
    </div>
  )
}
