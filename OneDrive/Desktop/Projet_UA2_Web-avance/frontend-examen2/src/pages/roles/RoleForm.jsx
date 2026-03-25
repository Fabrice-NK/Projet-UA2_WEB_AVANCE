import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { createRole, fetchRoleById, clearMessages } from '../../features/roles/rolesSlice'

const schema = yup.object({
  titre: yup.string().min(2, 'Au moins 2 caractères').required('Titre requis'),
  description: yup.string().nullable().optional(),
})

export default function RoleForm() {
  const { id } = useParams()
  const isNew = !id
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { selectedRole, loading, error, success } = useSelector((s) => s.roles)

  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: yupResolver(schema) })

  useEffect(() => {
    if (!isNew) dispatch(fetchRoleById(id))
  }, [dispatch, id, isNew])

  useEffect(() => {
    if (!isNew && selectedRole) {
      reset({ titre: selectedRole.titre || '', description: selectedRole.description || '' })
    }
  }, [selectedRole, reset, isNew])

  useEffect(() => {
    if (success) setTimeout(() => navigate('/roles'), 1500)
  }, [success, navigate])

  const onSubmit = (data) => {
    dispatch(createRole(data))
  }

  return (
    <div className="p-4" style={{ maxWidth: 500 }}>
      <div className="d-flex align-items-center gap-2 mb-4">
        <Link to="/roles" className="btn btn-sm btn-outline-secondary"><i className="bi bi-arrow-left" /></Link>
        <h2 className="fw-bold mb-0">{isNew ? 'Nouveau rôle' : 'Modifier le rôle'}</h2>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="mb-3">
              <label className="form-label fw-semibold">Titre *</label>
              <input type="text" className={`form-control ${errors.titre ? 'is-invalid' : ''}`} {...register('titre')} />
              {errors.titre && <div className="invalid-feedback">{errors.titre.message}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Description</label>
              <textarea className="form-control" rows={3} {...register('description')} />
            </div>
            <div className="d-flex gap-2 justify-content-end border-top pt-3">
              <Link to="/roles" className="btn btn-outline-secondary">Annuler</Link>
              <button type="submit" className="btn text-white" style={{ background: '#1a1a2e' }} disabled={loading}>
                {loading ? <><span className="spinner-border spinner-border-sm me-2" />Enregistrement...</> : 'Créer le rôle'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
