'use client'

import { useAuth } from '@/context/AuthContext/AuthContext'
import { useEffect, useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import styles from './ProfilePage.module.scss'
import { api } from "@/utils/api"
import { toast } from "sonner"
import { isPhoneValid } from "@/utils/functions"
import Modal from "@/components/Modal/Modal"
import DeleteAccountSection from "@/components/DeleteAccount/DeleteAccount"

type ProfileForm = {
  firstName: string
  lastName: string
  email: string
  phone?: string
}

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('Ad gerekli'),
  lastName: Yup.string().required('Soyad gerekli'),
  email: Yup.string().email('Geçerli bir e-posta girin').required('E-posta gerekli'),
  phone: Yup.string()
    .test('phone-valid', 'Geçerli bir telefon girin (ör: 5xxxxxxxxx)', value =>
      !value || isPhoneValid(value)
    )
})

export default function ProfilePage() {
  const { user, refreshUser } = useAuth() as { user: ProfileForm | null; refreshUser?: () => void }
  const [initialValues, setInitialValues] = useState<ProfileForm | null>(null)
  const [saved, setSaved] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    if (user) {
      setInitialValues({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || ''
      })
    }
  }, [user])

  if (!user || !initialValues)
    return <div>Lütfen giriş yapın.</div>

  return (
    <div>
      <h1 className={styles.title}>Hesap Bilgileri</h1>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            await api('/api/profile', {
              method: 'PUT',
              body: JSON.stringify(values),
              showLoader: true
            })
            toast.success('Güncelleme başarılı!')
            setSaved(true)
            refreshUser?.()
            setInitialValues(values) // update base values
            resetForm({ values })
          } catch (e: any) {
            toast.error(e.message || 'Hata oluştu!')
          } finally {
            setSubmitting(false)
          }
        }}
      >
        {({ values, errors, touched, isSubmitting, isValid, dirty, initialValues }) => {
          // Compare all fields to prevent submit unless there is a real change
          const hasChanged =
            values.firstName !== initialValues.firstName ||
            values.lastName !== initialValues.lastName ||
            values.email !== initialValues.email ||
            (values.phone || '') !== (initialValues.phone || '')
          return (
            <Form className={styles.form}>
              <div className={styles.formGroup}>
                <label>Ad*</label>
                <Field name="firstName" className={styles.input} />
                <ErrorMessage name="firstName" component="span" className={styles.err} />
              </div>
              <div className={styles.formGroup}>
                <label>Soyad*</label>
                <Field name="lastName" className={styles.input} />
                <ErrorMessage name="lastName" component="span" className={styles.err} />
              </div>
              <div className={styles.formGroup}>
                <label>E-Posta*</label>
                <Field name="email" className={styles.input} disabled readOnly />
                <ErrorMessage name="email" component="span" className={styles.err} />
              </div>
              <div className={styles.formGroup}>
                <label>Gsm</label>
                <Field
                  name="phone"
                  className={styles.input}
                  maxLength={10}
                  placeholder="5xxxxxxxxx"
                  inputMode="numeric"
                />
                <ErrorMessage name="phone" component="span" className={styles.err} />
              </div>
              <div className={styles.formGroup}>
                <button
                  type="submit"
                  className={styles.saveBtn}
                  disabled={isSubmitting || !hasChanged || !isValid}
                >
                  Güncelle
                </button>
              </div>
              {saved && <div className={styles.saved}>Güncelleme Başarılı!</div>}
            </Form>
          )
        }}
      </Formik>
      <div className={styles.form}>
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => setShowDeleteModal(true)}
        >
          Hesabı Sil
        </button>
      </div>
      <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <DeleteAccountSection />
      </Modal>
    </div>
  )
}