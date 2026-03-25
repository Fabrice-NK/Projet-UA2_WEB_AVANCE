import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { createSubject, updateSubject, fetchSubjectById } from '../../features/subjects/subjectsSlice'
import { fetchDepartments } from '../../features/departments/departmentsSlice'
import { fetchLaboratories } from '../../features/laboratories/laboratoriesSlice'

const schema = yup.object({
  nom: yup.string().min(2, 'Au moins 2 caractères').required('Nom requis'),
  code: yup.string().min(2, 'Code requis').required('Code requis'),
  description: yup.string().nullable().optional(),
  statut: yup.string().oneOf(['requis', 'optionnel'], 'Valeur invalide').nullable().optional(),
  DepartmentId: yup.number().nullable().optional().transform((v) => (isNaN(v) ? null : v)),
  LaboratoryId: yup.number().nullable().optional().transform((v) => (isNaN(v) ? null : v)),
})

export default function SubjectForm() {
  const { id } = useParams()
  const isNew = !id
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { selectedSubject, loading, error, success } = useSelector((s) => s.subjects)
  const departments = useSelector((s) => s.departments.list)
  const laboratories = useSelector((s) => s.laboratories.list)
  const [imageFile, setImageFile] = useState(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: yupResolver(schema) })

  useEffect(() => {
    dispatch(fetchDepartments({ size: 100 }))
    dispatch(fetchLaboratories({ size: 100 }))
    if (!isNew) dispatch(fetchSubjectById(id))
  }, [dispatch, id, isNew])

  useEffect(() => {
    if (!isNew && selectedSubject) {
      reset({
        nom: selectedSubject.nom || '',
        code: selectedSubject.code || '',
        description: selectedSubject.description || '',
        statut: selectedSubject.statut || '',
        DepartmentId: selectedSubject.DepartmentId || '',
        LaboratoryId: selectedSubject.LaboratoryId || '',
      })
    }
  }, [selectedSubject, reset, isNew])

  useEffect(() => {
    if (success) setTimeout(() => navigate('/subjects'), 1500)
  }, [success, navigate])

  const onSubmit = (data) => {
    if (isNew) {
      const formData = new FormData()
      Object.entries(data).forEach(([k, v]) => { if (v !== null && v !== '' && v !== undefined) formData.append(k, v) })
      if (imageFile) formData.append('image', imageFile)
      dispatch(createSubject(formData))
    } else {
      const clean = Object.fromEntries(Object.entries(data).filter(([, v]) => v !== '' && v !== null && v !== undefined))
      dispatch(updateSubject({ id, data: clean }))
    }
  }

  return (
    <div className="p-4" style={{ maxWidth: 600 }}>
      <div className="d-flex align-items-center gap-2 mb-4">
        <Link to="/subjects" className="btn btn-sm btn-outline-secondary"><i className="bi bi-arrow-left" /></Link>
        <h2 className="fw-bold mb-0">{isNew ? 'Nouvelle matière' : 'Modifier la matière'}</h2>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="row g-3">
              <div className="col-md-8">
                <label className="form-label fw-semibold">Nom *</label>
                <input type="text" className={`form-control ${errors.nom ? 'is-invalid' : ''}`} {...register('nom')} />
                {errors.nom && <div className="invalid-feedback">{errors.nom.message}</div>}
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold">Code *</label>
                <input type="text" className={`form-control ${errors.code ? 'is-invalid' : ''}`} {...register('code')} />
                {errors.code && <div className="invalid-feedback">{errors.code.message}</div>}
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Statut</label>
                <select className="form-select" {...register('statut')}>
                  <option value="">-- Choisir --</option>
                  <option value="requis">Requis</option>
                  <option value="optionnel">Optionnel</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Département</label>
                <select className="form-select" {...register('DepartmentId')}>
                  <option value="">-- Aucun --</option>
                  {departments.map((d) => <option key={d.id} value={d.id}>{d.nom}</option>)}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Laboratoire</label>
                <select className="form-select" {...register('LaboratoryId')}>
                  <option value="">-- Aucun --</option>
                  {laboratories.map((l) => <option key={l.id} value={l.id}>{l.nom}</option>)}
                </select>
              </div>
              <div className="col-12">
                <label className="form-label fw-semibold">Description</label>
                <textarea className="form-control" rows={3} {...register('description')} />
              </div>
              {isNew && (
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Image</label>
                  <input type="file" className="form-control" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
                </div>
              )}
              <div className="col-12 d-flex gap-2 justify-content-end border-top pt-3">
                <Link to="/subjects" className="btn btn-outline-secondary">Annuler</Link>
                <button type="submit" className="btn text-white" style={{ background: '#16213e' }} disabled={loading}>
                  {loading ? <><span className="spinner-border spinner-border-sm me-2" />Enregistrement...</> : (isNew ? 'Créer' : 'Mettre à jour')}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
