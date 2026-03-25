import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { login, clearError, selectIsAuthenticated } from '../features/auth/authSlice'

const schema = yup.object({
  email: yup.string().email('Email invalide').required('Email requis'),
  mot_de_passe: yup.string().min(1, 'Mot de passe requis').required('Mot de passe requis'),
})

export default function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, isAuthenticated } = useSelector((s) => s.auth)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) })

  useEffect(() => {
    if (isAuthenticated) navigate('/')
    return () => dispatch(clearError())
  }, [isAuthenticated, navigate, dispatch])

  const onSubmit = (data) => dispatch(login(data))

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}
    >
      <div className="card shadow-lg" style={{ width: '100%', maxWidth: 420, borderRadius: 16 }}>
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <div className="mb-3">
              <i className="bi bi-flask fs-1" style={{ color: '#e94560' }} />
            </div>
            <h2 className="fw-bold mb-1">GestiLab</h2>
            <p className="text-muted mb-0">Connectez-vous pour continuer</p>
          </div>

          {error && (
            <div className="alert alert-danger d-flex align-items-center" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="mb-3">
              <label className="form-label fw-semibold">Adresse email</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-envelope" />
                </span>
                <input
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="exemple@email.com"
                  {...register('email')}
                />
                {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">Mot de passe</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-lock" />
                </span>
                <input
                  type="password"
                  className={`form-control ${errors.mot_de_passe ? 'is-invalid' : ''}`}
                  placeholder="••••••••"
                  {...register('mot_de_passe')}
                />
                {errors.mot_de_passe && (
                  <div className="invalid-feedback">{errors.mot_de_passe.message}</div>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="btn w-100 text-white fw-semibold py-2"
              style={{ background: '#e94560', border: 'none', borderRadius: 8 }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Connexion...
                </>
              ) : (
                <>
                  <i className="bi bi-box-arrow-in-right me-2" />
                  Se connecter
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
