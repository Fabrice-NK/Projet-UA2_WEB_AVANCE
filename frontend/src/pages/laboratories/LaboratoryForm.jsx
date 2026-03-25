import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { createLaboratory, updateLaboratory, fetchLaboratoryById } from '../../features/laboratories/laboratoriesSlice'
import { fetchDepartments } from '../../features/departments/departmentsSlice'

const schema = yup.object({
  nom: yup.string().min(2, 'Au moins 2 caractères').required('Nom requis'),
  salle: yup.string().nullable().optional(),
  information: yup.string().nullable().optional(),
  DepartmentId: yup.number().nullable().optional().transform((v) => (isNaN(v) ? null : v)),
})

export default function LaboratoryForm() {
  const { id } = useParams()
  const isNew = !id
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { selectedLaboratory, loading, error, success } = useSelector((s) => s.laboratories)
  const departments = useSelector((s) => s.departments.list)
  const [imageFile, setImageFile] = useState(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: yupResolver(schema) })

  useEffect(() => {
    dispatch(fetchDepartments({ size: 100 }))
    if (!isNew) dispatch(fetchLaboratoryById(id))
  }, [dispatch, id, isNew])

  useEffect(() => {
    if (!isNew && selectedLaboratory) {
      reset({
        nom: selectedLaboratory.nom || '',
        salle: selectedLaboratory.salle || '',
        information: selectedLaboratory.information || '',
        DepartmentId: selectedLaboratory.DepartmentId || '',
      })
    }
  }, [selectedLaboratory, reset, isNew])

  useEffect(() => {
    if (success) setTimeout(() => navigate('/laboratories'), 1500)
  }, [success, navigate])

  const onSubmit = (data) => {
    if (isNew) {
      const formData = new FormData()
      Object.entries(data).forEach(([k, v]) => { if (v !== null && v !== '' && v !== undefined) formData.append(k, v) })
      if (imageFile) formData.append('image', imageFile)
      dispatch(createLaboratory(formData))
    } else {
      const clean = Object.fromEntries(Object.entries(data).filter(([, v]) => v !== '' && v !== null && v !== undefined))
      dispatch(updateLaboratory({ id, data: clean }))
    }
  }

  return (
    <div className="p-4" style={{ maxWidth: 600 }}>
      <div className="d-flex align-items-center gap-2 mb-4">
        <Link to="/laboratories" className="btn btn-sm btn-outline-secondary"><i className="bi bi-arrow-left" /></Link>
        <h2 className="fw-bold mb-0">{isNew ? 'Nouveau laboratoire' : 'Modifier le laboratoire'}</h2>
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
                <label className="form-label fw-semibold">Salle</label>
                <input type="text" className="form-control" {...register('salle')} placeholder="ex: A101" />
              </div>
              <div className="col-12">
                <label className="form-label fw-semibold">Département</label>
                <select className="form-select" {...register('DepartmentId')}>
                  <option value="">-- Aucun --</option>
                  {departments.map((d) => <option key={d.id} value={d.id}>{d.nom}</option>)}
                </select>
              </div>
              <div className="col-12">
                <label className="form-label fw-semibold">Informations</label>
                <textarea className="form-control" rows={4} {...register('information')} />
              </div>
              {isNew && (
                <div className="col-12">
                  <label className="form-label fw-semibold">Image</label>
                  <input type="file" className="form-control" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
                </div>
              )}
              <div className="col-12 d-flex gap-2 justify-content-end border-top pt-3">
                <Link to="/laboratories" className="btn btn-outline-secondary">Annuler</Link>
                <button type="submit" className="btn text-white" style={{ background: '#533483' }} disabled={loading}>
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
