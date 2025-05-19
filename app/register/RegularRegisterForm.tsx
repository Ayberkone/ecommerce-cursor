// app/register/RegisterPage.tsx

'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import styles from './RegisterPage.module.scss'
import { User } from 'lucide-react'
import MembershipContract from '@/content/contracts/MembershipContract'

const passwordRules =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>/?]).{8,}$/

const schema = Yup.object().shape({
  firstName: Yup.string().required('Ad gerekli'),
  lastName: Yup.string().required('Soyad gerekli'),
  email: Yup.string().email('Geçersiz e-posta').required('E-posta gerekli'),
  password: Yup.string()
    .min(8, 'Şifre en az 8 karakter olmalı')
    .matches(/[A-Z]/, 'Şifre büyük harf içermeli')
    .matches(/[a-z]/, 'Şifre küçük harf içermeli')
    .matches(/\d/, 'Şifre rakam içermeli')
    .matches(/[@$!%*?&]/, 'Şifre özel karakter içermeli')
    .required('Şifre gerekli'),
  password2: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Şifreler eşleşmiyor')
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

export default function RegularRegisterForm() {
  const [showContract, setShowContract] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showPassword2, setShowPassword2] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterFormValues>({
    resolver: yupResolver(schema),
    mode: 'onChange', // show errors on every change
    reValidateMode: 'onChange',
  })

  const onSubmit = async (data: RegisterFormValues) => {
    setSuccess(false)
    // Simulate API
    await new Promise((r) => setTimeout(r, 900))
    setSuccess(true)
    reset()
  }

  return (
    <div className={styles.registerWrapper}>
      <div className={styles.formContainer}>
        <div className={styles.formHeader}>
          <div className={styles.icon}><User className={styles.iconPdf} size={22} /></div>
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
                {showPassword ? '🙈' : '👁️'}
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
                {showPassword2 ? '🙈' : '👁️'}
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
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Kaydediliyor...' : 'Kayıt Ol'}
          </button>
          <div className={styles.loginLink}>
            <Link href="/login" className={styles.link}>Zaten Hesabım Var</Link>
          </div>
          <AnimatePresence>
            {success && (
              <motion.div
                className={styles.successMsg}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, type: 'spring' }}
              >
                Kayıt başarılı! Giriş yapabilirsiniz.
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </div>
  )
}
