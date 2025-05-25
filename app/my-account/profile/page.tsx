'use client'

import { useAuth } from '@/components/AuthContext/AuthContext'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import styles from './ProfilePage.module.scss'
import { api } from "@/utils/api"
import { toast } from "sonner"

type ProfileForm = {
  firstName: string
  lastName: string
  email: string
  phone?: string
}

export default function ProfilePage() {
  const { user, refreshUser } = useAuth() as { user: ProfileForm | null; refreshUser?: () => void }
  const { register, handleSubmit, reset, formState: { errors, isSubmitting, isSubmitSuccessful } } = useForm<ProfileForm>()
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || ''
      })
    }
  }, [user, reset])

  if (!user) return <div>Lütfen giriş yapın.</div>

  const onSubmit = async (data: ProfileForm) => {
    try {
      await api('/api/profile', {
        method: 'PUT',
        body: JSON.stringify(data)
      })
      toast.success('Güncelleme Basarili!')
      refreshUser?.()
    } catch (e: any) {
      toast.error(e.message || 'Hata oluştu!')
    } finally {
      setTimeout(() => toast.error('Hata oluştu!'), 1500)
    }
  }


  return (
    <div>
      <h1 className={styles.title}>Hesap Bilgileri</h1>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formGroup}>
          <label>Ad*</label>
          <input {...register("firstName", { required: "Ad gerekli" })} className={styles.input} />
          {errors.firstName && <span className={styles.err}>{errors.firstName.message}</span>}
        </div>
        <div className={styles.formGroup}>
          <label>Soyad*</label>
          <input {...register("lastName", { required: "Soyad gerekli" })} className={styles.input} />
          {errors.lastName && <span className={styles.err}>{errors.lastName.message}</span>}
        </div>
        <div className={styles.formGroup}>
          <label>E-Posta*</label>
          <input {...register("email", { required: "E-posta gerekli" })} className={styles.input} disabled readOnly />
        </div>
        <div className={styles.formGroup}>
          <label>Gsm</label>
          <input {...register("phone")} className={styles.input} maxLength={13} placeholder="5xx xxx xx xx" />
        </div>
        <div className={styles.formGroup}>
          <button type="submit" className={styles.saveBtn} disabled={isSubmitting}>Güncelle</button>
        </div>
        {saved && <div className={styles.saved}>Güncellendi!</div>}
      </form>
    </div>
  )
}