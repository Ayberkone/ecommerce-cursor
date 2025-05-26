'use client'

import { useAuth } from '@/context/AuthContext/AuthContext'
import styles from './PasswordPage.module.scss'
import { api } from '@/utils/api'
import { toast } from 'sonner'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { passwordSchema, RenderIconHidePsw, RenderIconShowPsw } from "@/app/register/RegularRegisterForm"

const validationSchema = Yup.object({
  currentPassword: Yup.string().required('Mevcut parola gerekli'),
  newPassword: passwordSchema,
  newPasswordRepeat: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Şifreler eşleşmiyor')
    .required('Yeni parolayı tekrar girin')
})

export default function PasswordPage() {
  const { user } = useAuth()
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  // Her input için ayrı state
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showNewRepeat, setShowNewRepeat] = useState(false)

  if (!user) return <div>Lütfen giriş yapın.</div>

  return (
    <div>
      <h1 className={styles.title}>Parola Ayarları</h1>
      <Formik
        initialValues={{
          currentPassword: '',
          newPassword: '',
          newPasswordRepeat: ''
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm, setFieldError }) => {
          setSuccess(false)
          setLoading(true)
          try {
            await api('/api/auth/change-password', {
              method: 'POST',
              body: JSON.stringify({
                currentPassword: values.currentPassword,
                newPassword: values.newPassword,
              }),
            })
            setSuccess(true)
            resetForm()
            toast.success('Parola başarıyla değiştirildi.')
          } catch (err) {
            setFieldError(
              'currentPassword',
              (err && typeof err === 'object' && 'message' in err && typeof (err as any).message === 'string')
                ? (err as any).message
                : 'Hata oluştu!'
            )
          } finally {
            setLoading(false)
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className={styles.form}>
            <label className={styles.label} style={{ position: "relative" }}>
              Mevcut Parola
              <div className={styles.passwordWrapper}>
                <Field
                  className={styles.input}
                  type={showCurrent ? "text" : "password"}
                  name="currentPassword"
                  autoComplete="current-password"
                  disabled={loading || isSubmitting}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className={styles.pwToggle}
                  onClick={() => setShowCurrent(v => !v)}
                  aria-label={showCurrent ? "Şifreyi Gizle" : "Şifreyi Göster"}
                >
                  {showCurrent ? RenderIconHidePsw : RenderIconShowPsw}
                </button>
              </div>
              <ErrorMessage name="currentPassword" component="div" className={styles.error} />
            </label>

            <label className={styles.label} style={{ position: "relative" }}>
              Yeni Parola
              <div className={styles.passwordWrapper}>
                <Field
                  className={styles.input}
                  type={showNew ? "text" : "password"}
                  name="newPassword"
                  autoComplete="new-password"
                  disabled={loading || isSubmitting}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className={styles.pwToggle}
                  onClick={() => setShowNew(v => !v)}
                  aria-label={showNew ? "Şifreyi Gizle" : "Şifreyi Göster"}
                >
                  {showNew ? RenderIconHidePsw : RenderIconShowPsw}
                </button>
              </div>
              <ErrorMessage name="newPassword" component="div" className={styles.error} />
            </label>

            <label className={styles.label} style={{ position: "relative" }}>
              Yeni Parola (Tekrar)
              <div className={styles.passwordWrapper}>
                <Field
                  className={styles.input}
                  type={showNewRepeat ? "text" : "password"}
                  name="newPasswordRepeat"
                  autoComplete="new-password"
                  disabled={loading || isSubmitting}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className={styles.pwToggle}
                  onClick={() => setShowNewRepeat(v => !v)}
                  aria-label={showNewRepeat ? "Şifreyi Gizle" : "Şifreyi Göster"}
                >
                  {showNewRepeat ? RenderIconHidePsw : RenderIconShowPsw}
                </button>
              </div>
              <ErrorMessage name="newPasswordRepeat" component="div" className={styles.error} />
            </label>

            <button
              className={styles.saveBtn}
              type="submit"
              disabled={loading || isSubmitting}
            >
              Parolayı Değiştir
            </button>
            {success && <div className={styles.success}>Parola başarıyla değiştirildi.</div>}
          </Form>
        )}
      </Formik>
    </div>
  )
}