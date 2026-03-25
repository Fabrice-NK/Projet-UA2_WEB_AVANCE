import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { createUser, updateUser, fetchUserById, clearMessages } from '../../features/users/usersSlice'
import { fetchDepartments } from '../../features/departments/departmentsSlice'

const buildSchema = (isNew) =>
  yup.object({
    nom: yup
      .string()
      .matches(/^[a-zA-ZÀ-ÿ]{4,}$/, 'Le nom doit comporter au moins 4 lettres')
      .required('Nom requis'),
    prenom: yup
      .string()
      .matches(/^[a-zA-ZÀ-ÿ]{4,}$/, 'Le prénom doit comporter au moins 4 lettres')
      .required('Prénom requis'),
    email: yup.string().email('Email invalide').required('Email requis'),
    mot_de_passe: isNew
      ? yup
          .string()
          .min(8, 'Au moins 8 caractères')
          .matches(/[a-z]/, 'Doit contenir une minuscule')
          .matches(/[A-Z]/, 'Doit contenir une majuscule')
          .matches(/\d/, 'Doit contenir un chiffre')
          .matches(/[@$!%*?&#^]/, 'Doit contenir un caractère spécial')
          .required('Mot de passe requis')
      : yup.string().optional(),
    naissance: yup
      .string()
      .optional()
      .nullable()
      .test('no-future', 'La date ne peut pas être dans le futur', (v) => {
        if (!v) return true
        return new Date(v) <= new Date()
      }),
    biographie: yup
      .string()
      .nullable()
      .optional()
      .test('min-length', 'Au moins 20 caractères', (v) => !v || v.length >= 20),
    conduite: yup
      .string()
      .nullable()
      .optional()
      .oneOf(['', 'Excellente', 'Bonne', 'Passable', null], 'Valeur invalide'),
    DepartmentId: yup.number().nullable().optional().transform((v) => (isNaN(v) ? null : v)),
  })

export default function UserForm() {
  const { id } = useParams()
  const isNew = !id
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { selectedUser, loading, error, success } = useSelector((s) => s.users)
  const departments = useSelector((s) => s.departments.list)
  const [photoFile, setPhotoFile] = useState(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(buildSchema(isNew)) })

  useEffect(() => {
    dispatch(fetchDepartments({ size: 100 }))
    if (!isNew) dispatch(fetchUserById(id))
  }, [dispatch, id, isNew])

  useEffect(() => {
    if (!isNew && selectedUser) {
      reset({
        nom: selectedUser.nom || '',
        prenom: selectedUser.prenom || '',
        email: selectedUser.email || '',
        naissance: selectedUser.naissance || '',
        biographie: selectedUser.biographie || '',
        conduite: selectedUser.conduite || '',
        DepartmentId: selectedUser.DepartmentId || '',
      })
    }
  }, [selectedUser, reset, isNew])

  useEffect(() => {
    if (success) {
      setTimeout(() => navigate('/users'), 1500)
    }
  }, [success, navigate])

  const onSubmit = (data) => {
    if (isNew) {
      const formData = new FormData()
      Object.entries(data).forEach(([k, v]) => { if (v !== null && v !== '' && v !== undefined) formData.append(k, v) })
      if (photoFile) formData.append('photo', photoFile)
      dispatch(createUser(formData))
    } else {
      const { mot_de_passe, ...rest } = data
      const clean = Object.fromEntries(Object.entries(rest).filter(([, v]) => v !== '' && v !== null && v !== undefined))
      dispatch(updateUser({ id, data: clean }))
    }
  }

  return (
    <div className="p-4">
      <div className="d-flex align-items-center gap-2 mb-4">
        <Link to="/users" className="btn btn-sm btn-outline-secondary">
          <i className="bi bi-arrow-left" />
        </Link>
        <h2 className="fw-bold mb-0">{isNew ? 'Nouvel utilisateur' : 'Modifier l\'utilisateur'}</h2>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Nom *</label>
                <input type="text" className={`form-control ${errors.nom ? 'is-invalid' : ''}`} {...register('nom')} />
                {errors.nom && <div className="invalid-feedback">{errors.nom.message}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Prénom *</label>
                <input type="text" className={`form-control ${errors.prenom ? 'is-invalid' : ''}`} {...register('prenom')} />
                {errors.prenom && <div className="invalid-feedback">{errors.prenom.message}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Email *</label>
                <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} {...register('email')} />
                {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
              </div>

              {isNew && (
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Mot de passe *</label>
                  <input type="password" className={`form-control ${errors.mot_de_passe ? 'is-invalid' : ''}`} {...register('mot_de_passe')} />
                  {errors.mot_de_passe && <div className="invalid-feedback">{errors.mot_de_passe.message}</div>}
                  <small className="text-muted">Min. 8 car., majuscule, minuscule, chiffre et symbole</small>
                </div>
              )}

              <div className="col-md-6">
                <label className="form-label fw-semibold">Date de naissance</label>
                <input type="date" className={`form-control ${errors.naissance ? 'is-invalid' : ''}`} {...register('naissance')} />
                {errors.naissance && <div className="invalid-feedback">{errors.naissance.message}</div>}
              </div>

              <div className="col-md-3">
                <label className="form-label fw-semibold">Conduite</label>
                <select className={`form-select ${errors.conduite ? 'is-invalid' : ''}`} {...register('conduite')}>
                  <option value="">-- Choisir --</option>
                  <option value="Excellente">Excellente</option>
                  <option value="Bonne">Bonne</option>
                  <option value="Passable">Passable</option>
                </select>
                {errors.conduite && <div className="invalid-feedback">{errors.conduite.message}</div>}
              </div>

              <div className="col-md-3">
                <label className="form-label fw-semibold">Département</label>
                <select className="form-select" {...register('DepartmentId')}>
                  <option value="">-- Aucun --</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>{d.nom}</option>
                  ))}
                </select>
              </div>

              <div className="col-12">
                <label className="form-label fw-semibold">Biographie</label>
                <textarea
                  className={`form-control ${errors.biographie ? 'is-invalid' : ''}`}
                  rows={4}
                  {...register('biographie')}
                  placeholder="Minimum 20 caractères..."
                />
                {errors.biographie && <div className="invalid-feedback">{errors.biographie.message}</div>}
              </div>

              {isNew && (
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Photo</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/jpeg,image/jpg,image/png,image/gif"
                    onChange={(e) => setPhotoFile(e.target.files[0])}
                  />
                </div>
              )}

              <div className="col-12 d-flex gap-2 justify-content-end border-top pt-3">
                <Link to="/users" className="btn btn-outline-secondary">Annuler</Link>
                <button
                  type="submit"
                  className="btn text-white"
                  style={{ background: '#e94560' }}
                  disabled={loading}
                >
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
