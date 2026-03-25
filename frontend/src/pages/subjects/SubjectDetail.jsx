import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { fetchSubjectById, deleteSubject, updateSubjectImage } from '../../features/subjects/subjectsSlice'
import { selectIsAdmin } from '../../features/auth/authSlice'

export default function SubjectDetail() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { selectedSubject: subject, loading, error, success } = useSelector((s) => s.subjects)
  const isAdmin = useSelector(selectIsAdmin)
  const imageRef = useRef()

  useEffect(() => {
    dispatch(fetchSubjectById(id))
  }, [dispatch, id])

  const handleDelete = () => {
    if (window.confirm('Supprimer cette matière ?')) {
      dispatch(deleteSubject(id)).then(() => navigate('/subjects'))
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const formData = new FormData()
    formData.append('image', file)
    dispatch(updateSubjectImage({ id, formData })).then(() => dispatch(fetchSubjectById(id)))
  }

  if (loading && !subject) return <div className="p-4 text-center"><div className="spinner-border text-primary" /></div>
  if (!subject) return <div className="p-4 text-muted">Matière introuvable</div>

  return (
    <div className="p-4">
      <div className="d-flex align-items-center gap-2 mb-4">
        <Link to="/subjects" className="btn btn-sm btn-outline-secondary"><i className="bi bi-arrow-left" /></Link>
        <h2 className="fw-bold mb-0">{subject.nom}</h2>
        <span className="badge bg-secondary ms-1">{subject.code}</span>
        {subject.statut && (
          <span className={`badge ${subject.statut === 'requis' ? 'bg-danger' : 'bg-secondary'}`}>
            {subject.statut}
          </span>
        )}
        <div className="ms-auto d-flex gap-2">
          <Link to={`/subjects/${id}/edit`} className="btn btn-sm btn-outline-secondary">
            <i className="bi bi-pencil me-1" />Modifier
          </Link>
          {isAdmin && (
            <button className="btn btn-sm btn-outline-danger" onClick={handleDelete}>
              <i className="bi bi-trash me-1" />Supprimer
            </button>
          )}
        </div>
      </div>

      {success && <div className="alert alert-success py-2">{success}</div>}
      {error && <div className="alert alert-danger py-2">{error}</div>}

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card">
            <div className="position-relative">
              {subject.image ? (
                <img
                  src={subject.image}
                  alt={subject.nom}
                  className="card-img-top"
                  style={{ height: 200, objectFit: 'cover' }}
                  onError={(e) => { e.target.style.display = 'none' }}
                />
              ) : (
                <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: 200 }}>
                  <i className="bi bi-journal-text fs-1 text-muted" />
                </div>
              )}
              <button
                className="btn btn-sm btn-light position-absolute bottom-0 end-0 m-2 rounded-circle"
                onClick={() => imageRef.current.click()}
                title="Changer l'image"
              >
                <i className="bi bi-camera" />
              </button>
              <input type="file" ref={imageRef} className="d-none" accept="image/*" onChange={handleImageChange} />
            </div>
            <div className="card-body">
              <p className="text-muted mb-0">{subject.description || 'Aucune description.'}</p>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card mb-3">
            <div className="card-header bg-white fw-semibold">Informations</div>
            <div className="card-body">
              <dl className="row mb-0">
                <dt className="col-sm-4 text-muted">Département</dt>
                <dd className="col-sm-8">
                  {subject.Department ? (
                    <Link to={`/departments/${subject.Department.id}`}>{subject.Department.nom}</Link>
                  ) : '—'}
                </dd>
                <dt className="col-sm-4 text-muted">Laboratoire</dt>
                <dd className="col-sm-8">
                  {subject.Laboratory ? (
                    <Link to={`/laboratories/${subject.Laboratory.id}`}>{subject.Laboratory.nom}</Link>
                  ) : '—'}
                </dd>
              </dl>
            </div>
          </div>

          <div className="card">
            <div className="card-header bg-white fw-semibold">
              <i className="bi bi-people me-2" />Étudiants inscrits
            </div>
            <div className="card-body">
              {subject.Users && subject.Users.length > 0 ? (
                <div className="d-flex flex-wrap gap-2">
                  {subject.Users.map((u) => (
                    <Link key={u.id} to={`/users/${u.id}`} className="badge bg-primary text-decoration-none fs-6">
                      {u.prenom} {u.nom}
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-muted mb-0">Aucun étudiant inscrit</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
