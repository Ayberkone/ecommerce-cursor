'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldPlus, Eye, EyeOff, Glasses } from 'lucide-react'
import styles from './RegisterPage.module.scss'
import { toast } from 'sonner'
import MembershipContract from '@/content/contracts/MembershipContract'
import { api } from "@/utils/api"
import { passwordSchema } from "./RegularRegisterForm"


const TITLE_OPTIONS = [
  'Prof. Dr. Dt.',
  'Doç. Dr. Dt.',
  'Dr. Dt.',
  'Ass. Dr. Dt. (Araştırma Görevlisi)',
  'Dt.',
  'Eczacı',
  'Öğrenci',
  'Diğer'
]

const schema = Yup.object().shape({
  firstName: Yup.string().required('Ad gerekli'),
  lastName: Yup.string().required('Soyad gerekli'),
  title: Yup.string().oneOf(TITLE_OPTIONS, 'Geçersiz ünvan').required('Ünvan gerekli'),
  titleOther: Yup.string().when('title', {
    is: (val: string) => val === 'Diğer',
    then: (schema) => schema.required('Lütfen unvan giriniz'),
    otherwise: (schema) => schema.notRequired(),
  }),
  email: Yup.string().email('Geçersiz e-posta').required('E-posta gerekli'),
  password: passwordSchema,
  password2: Yup.string()
    .oneOf([Yup.ref('password')], 'Şifreler eşleşmiyor')
    .required('Şifreyi tekrar girin'),
  phone: Yup.string()
    .matches(/^5\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$/, 'Geçerli bir telefon girin (5xx xxx xx xx)')
    .required('Telefon gerekli'),
  workplace: Yup.string().required('İşyeri adı gerekli'),
  workplaceAddress: Yup.string().required('İşyeri adresi gerekli'),
  acceptContract: Yup.boolean().oneOf([true], 'Sözleşmeyi kabul etmelisiniz.'),
  allowEmails: Yup.boolean(),
})

type ProRegisterForm = {
  firstName: string
  lastName: string
  title: string
  titleOther?: string | undefined
  email: string
  password: string
  password2: string
  phone: string
  workplace: string
  workplaceAddress: string
  acceptContract: boolean
  allowEmails?: boolean
}

export default function ProRegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showPassword2, setShowPassword2] = useState(false)
  const [showContract, setShowContract] = useState(false)
  const [success, setSuccess] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm<ProRegisterForm>({
    resolver: yupResolver(schema) as any,
    mode: 'onChange',
  })

  const watchTitle = watch('title')

  const onSubmit = async (data: ProRegisterForm) => {
    try {
      const res = await api("/api/auth/register-pro", {
        method: "POST",
        body: JSON.stringify(data),
        showLoader: true
      })
      const successToastId = toast.success(res.message, {
        duration: Infinity,
        position: 'top-center',
        icon: <Glasses size={24} />,
        description: 'Kayıt işlemi başarıyla tamamlandı ve hesabınız onay sürecinde. Hesabınız onaylandığında sizlere mail gönderilecek.',
        action: {
          label: 'Anladım',
          onClick: () => {
            toast.dismiss(successToastId)
          }
        }
      })
    } catch (err: any) {
      toast.error(err.message || "Bir hata oluştu")
    }
  }

  const renderIconShowPsw = <Eye size={22} />
  const renderIconHidePsw = <EyeOff size={22} />

  return (
    <div className={styles.formContainer}>
      <div className={styles.formHeader}>
        <div className={styles.icon}><ShieldPlus className={styles.iconPdf} size={36} /></div>
        <div>
          <b>Uzman / Eczacı Kaydı</b>
          <div style={{ fontSize: 13, marginTop: 2, color: '#64748b' }}>Yetkili kaydı</div>
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
          <select {...register('title')} className={styles.input}>
            <option value="">Ünvan*</option>
            {TITLE_OPTIONS.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          {errors.title && <span className={styles.error}>{errors.title.message}</span>}
        </div>
        {watchTitle === 'Diğer' && (
          <div className={styles.formGroup}>
            <input
              {...register('titleOther')}
              className={styles.input}
              placeholder="Ünvan (Diğer)"
              type="text"
            />
          </div>
        )}
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
        <div className={styles.formGroup} style={{ position: 'relative' }}>
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
            onClick={() => setShowPassword(p => !p)}
            className={styles.pwToggle}
            aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
          >
            {showPassword ? renderIconHidePsw : renderIconShowPsw}
          </button>
          {errors.password && <span className={styles.error}>{errors.password.message}</span>}
        </div>
        <div className={styles.formGroup} style={{ position: 'relative' }}>
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
            onClick={() => setShowPassword2(p => !p)}
            className={styles.pwToggle}
            aria-label={showPassword2 ? 'Şifreyi gizle' : 'Şifreyi göster'}
          >
            {showPassword2 ? renderIconHidePsw : renderIconShowPsw}
          </button>
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
        <div className={styles.formGroup}>
          <input
            {...register('workplace')}
            className={styles.input}
            placeholder="İşyeri Adı*"
            type="text"
          />
          {errors.workplace && <span className={styles.error}>{errors.workplace.message}</span>}
        </div>
        <div className={styles.formGroup}>
          <input
            {...register('workplaceAddress')}
            className={styles.input}
            placeholder="İşyeri Adresi*"
            type="text"
          />
          {errors.workplaceAddress && <span className={styles.error}>{errors.workplaceAddress.message}</span>}
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
                onClick={e => {
                  e.preventDefault()
                  setShowContract((p) => !p)
                }}
                onMouseDown={e => e.stopPropagation()}
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
          disabled={!!errors.acceptContract || isSubmitting}
        >
          {isSubmitting ? 'Kaydediliyor...' : 'Kayıt Ol'}
        </button>
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
  )
}
