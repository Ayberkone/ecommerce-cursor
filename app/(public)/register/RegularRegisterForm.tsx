// app/register/RegisterPage.tsx

'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import styles from './RegisterPage.module.scss'
import { User, Eye, EyeOff, Glasses } from 'lucide-react'
import { toast } from 'sonner'
import MembershipContract from '@/content/contracts/MembershipContract'
import { api } from "@/utils/api"

export const passwordSchema = Yup.string()
  .min(8, 'Şifre en az 8 karakter olmalı')
  .matches(/[A-Z]/, 'Şifre büyük harf içermeli')
  .matches(/[a-z]/, 'Şifre küçük harf içermeli')
  .matches(/\d/, 'Şifre rakam içermeli')
  .matches(/[@$!%*?&]/, 'Şifre özel karakter içermeli')
  .required('Şifre gerekli')

const schema = Yup.object().shape({
  firstName: Yup.string().required('Ad gerekli'),
  lastName: Yup.string().required('Soyad gerekli'),
  email: Yup.string().email('Geçersiz e-posta').required('E-posta gerekli'),
  password: passwordSchema,
  password2: Yup.string()
    .oneOf([Yup.ref('password')], 'Şifreler eşleşmiyor')
    .required('Şifreyi tekrar girin'),
  phone: Yup.string()
    .matches(/^5\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$/, 'Geçerli bir telefon girin (5xx xxx xx xx)')
    .required('Telefon gerekli'),
  acceptContract: Yup.boolean().oneOf([true], 'Sözleşmeyi kabul etmelisiniz.'),
  allowEmails: Yup.boolean()
})

type RegisterFormValues = {
  firstName: string
  lastName: string
  email: string
  password: string
  password2: string
  phone: string
  acceptContract: boolean
  allowEmails?: boolean
}

export const RenderIconShowPsw = <Eye size={22} />
export const RenderIconHidePsw = <EyeOff size={22} />

export default function RegularRegisterForm() {
  const [showContract, setShowContract] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showPassword2, setShowPassword2] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterFormValues>({
    resolver: yupResolver(schema) as any,
    mode: 'onChange',
    reValidateMode: 'onChange',
  })

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const res = await api("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          type: 'regular'
        }),
        showLoader: true
      })
      const successToastId = toast.success(res.message, {
        duration: Infinity,
        position: 'top-center',
        icon: <Glasses size={24} />,
        description: 'Aktivasyon e-postası gönderildi. Lütfen e-postanızı kontrol edin.',
        action: {
          label: 'Anladım',
          onClick: () => {
            toast.dismiss(successToastId)
          }
        }
      })
      reset()
    } catch (err: any) {
      toast.error(err.message || "Bir hata oluştu")
    } finally {
      setShowContract(false)
      setShowPassword(false)
      setShowPassword2(false)
    }
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    // Reset form and scroll to top after submission
  }

  return (
    <div className={styles.formContainer}>
      <div className={styles.formHeader}>
        <div className={styles.icon}><User className={styles.iconPdf} size={36} /></div>
        <div>
          <b>Üyelik Kaydı</b>
          <div className="text-muted" style={{ fontSize: 13, marginTop: 2 }}>Farmalink’e katıl!</div>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <div className={styles.formGroup}>
          <input
            {...register('firstName')}
            className={styles.input}
            placeholder="Ad*"
            autoComplete="given-name"
            type="text"
          />
          {errors.firstName && <span className={styles.error}>{errors.firstName.message}</span>}
        </div>
        <div className={styles.formGroup}>
          <input
            {...register('lastName')}
            className={styles.input}
            placeholder="Soyad*"
            autoComplete="family-name"
            type="text"
          />
          {errors.lastName && <span className={styles.error}>{errors.lastName.message}</span>}
        </div>
        <div className={styles.formGroup}>
          <input
            {...register('email')}
            className={styles.input}
            placeholder="E-Posta*"
            type="email"
            autoComplete="email"
          />
          {errors.email && <span className={styles.error}>{errors.email.message}</span>}
        </div>
        <div className={styles.formGroup}>
          <div className={styles.passwordWrapper}>
            <input
              {...register('password')}
              className={styles.input}
              placeholder="Şifre*"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
            />
            <button
              type="button"
              tabIndex={-1}
              className={styles.pwToggle}
              onClick={() => setShowPassword(v => !v)}
              aria-label={showPassword ? "Şifreyi Gizle" : "Şifreyi Göster"}
            >
              {showPassword ? RenderIconHidePsw : RenderIconShowPsw}
            </button>
          </div>
          <div className={styles.passwordHint}>
            Şifre en az 8 karakter, büyük harf, küçük harf, rakam ve özel karakter içermelidir.
          </div>
          {errors.password && <span className={styles.error}>{errors.password.message}</span>}
        </div>
        <div className={styles.formGroup}>
          <div className={styles.passwordWrapper}>
            <input
              {...register('password2')}
              className={styles.input}
              placeholder="Şifre Tekrar*"
              type={showPassword2 ? 'text' : 'password'}
              autoComplete="new-password"
            />
            <button
              type="button"
              tabIndex={-1}
              className={styles.pwToggle}
              onClick={() => setShowPassword2(v => !v)}
              aria-label={showPassword2 ? "Şifreyi Gizle" : "Şifreyi Göster"}
            >
              {showPassword2 ? RenderIconHidePsw : RenderIconShowPsw}
            </button>
          </div>
          {errors.password2 && <span className={styles.error}>{errors.password2.message}</span>}
        </div>
        <div className={styles.formGroup}>
          <input
            {...register('phone')}
            className={styles.input}
            placeholder="5xx xxx xx xx"
            maxLength={13}
            type="tel"
            autoComplete="tel"
          />
          {errors.phone && <span className={styles.error}>{errors.phone.message}</span>}
        </div>
        <div className={styles.formCheck}>
          <input
            type="checkbox"
            {...register('allowEmails')}
            className={styles.checkbox}
            id="allowEmails"
          />
          <label htmlFor="allowEmails">
            Pazarlama ve tanıtım amaçlı elektronik ileti gönderilmesine izin veriyorum.
          </label>
        </div>
        <div className={styles.formCheck}>
          <input
            type="checkbox"
            {...register('acceptContract', { required: true })}
            className={styles.checkbox}
            id="acceptContract"
          />
          <label htmlFor="acceptContract">
            <span>
              Hesap oluşturarak{' '}
              <span
                className={styles.underline}
                tabIndex={0}
                onClick={(e) => {
                  e.preventDefault()
                  setShowContract((p) => !p)
                }}
                onMouseDown={e => e.stopPropagation()} // Prevent focus loss
                onMouseUp={e => e.stopPropagation()}
                role="button"
                aria-label="Üyelik Sözleşmesini Görüntüle"
              >
                üyelik sözleşmesini ve gizlilik politikasını
              </span>{' '}
              okuduğumu ve kabul ettiğimi onaylıyorum.
            </span>
          </label>
        </div>
        <AnimatePresence>
          {showContract && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.33, type: 'spring' }}
              className={styles.contractBox}
            >
              <MembershipContract />
            </motion.div>
          )}
        </AnimatePresence>
        {errors.acceptContract && <span className={styles.error}>{errors.acceptContract.message}</span>}
        <button
          type="submit"
          className={styles.submitBtn}
          disabled={Boolean(errors.acceptContract) || isSubmitting}
        >
          {isSubmitting ? 'Kaydediliyor...' : 'Kayıt Ol'}
        </button>
        <div className={styles.loginLink}>
          <Link href="/login" className={styles.link}>Zaten Hesabım Var</Link>
        </div>
      </form>
    </div>
  )
}
