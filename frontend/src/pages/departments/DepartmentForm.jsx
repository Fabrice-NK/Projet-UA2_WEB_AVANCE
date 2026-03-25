import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { createDepartment, updateDepartment, fetchDepartmentById } from '../../features/departments/departmentsSlice'

const schema = yup.object({
  nom: yup.string().min(2, 'Au moins 2 lettres').required('Nom requis'),
  histoire: yup.string().nullable().optional().test('min', 'Au moins 20 caractères', (v) => !v || v.length >= 20),
  domaine: yup.string().oneOf(['sciences', 'literature', 'autre'], 'Valeur invalide').required('Domaine requis'),
})

export default function DepartmentForm() {
  const { id } = useParams()
  const isNew = !id
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { selectedDepartment, loading, error, success } = useSelector((s) => s.departments)
  const [imageFile, setImageFile] = useState(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: yupResolver(schema) })

  useEffect(() => {
    if (!isNew) dispatch(fetchDepartmentById(id))
  }, [dispatch, id, isNew])

  useEffect(() => {
    if (!isNew && selectedDepartment) {
      reset({
        nom: selectedDepartment.nom || '',
        histoire: selectedDepartment.histoire || '',
        domaine: selectedDepartment.domaine || '',
      })
    }
  }, [selectedDepartment, reset, isNew])

  useEffect(() => {
    if (success) setTimeout(() => navigate('/departments'), 1500)
  }, [success, navigate])

  const onSubmit = (data) => {
    if (isNew) {
      const formData = new FormData()
      Object.entries(data).forEach(([k, v]) => { if (v !== null && v !== '') formData.append(k, v) })
      if (imageFile) formData.append('image', imageFile)
      dispatch(createDepartment(formData))
    } else {
      const clean = Object.fromEntries(Object.entries(data).filter(([, v]) => v !== '' && v !== null))
      dispatch(updateDepartment({ id, data: clean }))
    }
  }

  return (
    <div className="p-4" style={{ maxWidth: 600 }}>
      <div className="d-flex align-items-center gap-2 mb-4">
        <Link to="/departments" className="btn btn-sm btn-outline-secondary"><i className="bi bi-arrow-left" /></Link>
        <h2 className="fw-bold mb-0">{isNew ? 'Nouveau département' : 'Modifier le département'}</h2>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="mb-3">
              <label className="form-label fw-semibold">Nom *</label>
              <input type="text" className={`form-control ${errors.nom ? 'is-invalid' : ''}`} {...register('nom')} />
              {errors.nom && <div className="invalid-feedback">{errors.nom.message}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Domaine *</label>
              <select className={`form-select ${errors.domaine ? 'is-invalid' : ''}`} {...register('domaine')}>
                <option value="">-- Choisir --</option>
                <option value="sciences">Sciences</option>
                <option value="literature">Littérature</option>
                <option value="autre">Autre</option>
              </select>
              {errors.domaine && <div className="invalid-feedback">{errors.domaine.message}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Histoire</label>
              <textarea
                className={`form-control ${errors.histoire ? 'is-invalid' : ''}`}
                rows={4}
                {...register('histoire')}
                placeholder="Minimum 20 caractères..."
              />
              {errors.histoire && <div className="invalid-feedback">{errors.histoire.message}</div>}
            </div>

            {isNew && (
              <div className="mb-3">
                <label className="form-label fw-semibold">Image</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/jpeg,image/jpg,image/png,image/gif"
                  onChange={(e) => setImageFile(e.target.files[0])}
                />
              </div>
            )}

            <div className="d-flex gap-2 justify-content-end border-top pt-3">
              <Link to="/departments" className="btn btn-outline-secondary">Annuler</Link>
              <button type="submit" className="btn text-white" style={{ background: '#0f3460' }} disabled={loading}>
                {loading ? <><span className="spinner-border spinner-border-sm me-2" />Enregistrement...</> : (isNew ? 'Créer' : 'Mettre à jour')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
