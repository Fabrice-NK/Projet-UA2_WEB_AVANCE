import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { createEquipment, updateEquipment, fetchEquipmentById } from '../../features/equipment/equipmentSlice'
import { fetchLaboratories } from '../../features/laboratories/laboratoriesSlice'

const schema = yup.object({
  nom: yup.string().min(2, 'Au moins 2 caractères').required('Nom requis'),
  modele: yup.string().oneOf(['nouveau', 'ancien', 'refait'], 'Valeur invalide').required('Modèle requis'),
  description: yup.string().nullable().optional(),
  LaboratoryId: yup.number().nullable().optional().transform((v) => (isNaN(v) ? null : v)),
})

export default function EquipmentForm() {
  const { id } = useParams()
  const isNew = !id
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { selectedEquipment, loading, error, success } = useSelector((s) => s.equipment)
  const laboratories = useSelector((s) => s.laboratories.list)
  const [imageFile, setImageFile] = useState(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: yupResolver(schema) })

  useEffect(() => {
    dispatch(fetchLaboratories({ size: 100 }))
    if (!isNew) dispatch(fetchEquipmentById(id))
  }, [dispatch, id, isNew])

  useEffect(() => {
    if (!isNew && selectedEquipment) {
      reset({
        nom: selectedEquipment.nom || '',
        modele: selectedEquipment.modele || '',
        description: selectedEquipment.description || '',
        LaboratoryId: selectedEquipment.LaboratoryId || '',
      })
    }
  }, [selectedEquipment, reset, isNew])

  useEffect(() => {
    if (success) setTimeout(() => navigate('/equipment'), 1500)
  }, [success, navigate])

  const onSubmit = (data) => {
    if (isNew) {
      const formData = new FormData()
      Object.entries(data).forEach(([k, v]) => { if (v !== null && v !== '' && v !== undefined) formData.append(k, v) })
      if (imageFile) formData.append('image', imageFile)
      dispatch(createEquipment(formData))
    } else {
      const clean = Object.fromEntries(Object.entries(data).filter(([, v]) => v !== '' && v !== null && v !== undefined))
      dispatch(updateEquipment({ id, data: clean }))
    }
  }

  return (
    <div className="p-4" style={{ maxWidth: 600 }}>
      <div className="d-flex align-items-center gap-2 mb-4">
        <Link to="/equipment" className="btn btn-sm btn-outline-secondary"><i className="bi bi-arrow-left" /></Link>
        <h2 className="fw-bold mb-0">{isNew ? 'Nouvel équipement' : "Modifier l'équipement"}</h2>
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
                <label className="form-label fw-semibold">Modèle *</label>
                <select className={`form-select ${errors.modele ? 'is-invalid' : ''}`} {...register('modele')}>
                  <option value="">-- Choisir --</option>
                  <option value="nouveau">Nouveau</option>
                  <option value="refait">Refait</option>
                  <option value="ancien">Ancien</option>
                </select>
                {errors.modele && <div className="invalid-feedback">{errors.modele.message}</div>}
              </div>
              <div className="col-12">
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
                <div className="col-12">
                  <label className="form-label fw-semibold">Image</label>
                  <input type="file" className="form-control" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
                </div>
              )}
              <div className="col-12 d-flex gap-2 justify-content-end border-top pt-3">
                <Link to="/equipment" className="btn btn-outline-secondary">Annuler</Link>
                <button type="submit" className="btn text-white" style={{ background: '#1a936f' }} disabled={loading}>
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
