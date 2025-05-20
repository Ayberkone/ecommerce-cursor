// components/Footer/Footer.tsx

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin, ShieldPlus } from 'lucide-react'
import styles from './Footer.module.scss'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          <div className={styles.col}>
            <Link href="/" className={styles.logo}>
              <Image
                src="/img/web-logo.svg"
                alt="Farmalink"
                width={170}
                height={60}
                priority
              />
            </Link>
            <a href="tel:02166680062" className={styles.info}>
              <Phone size={18} className={styles.infoIcon} /> <b>0 216 668 00 62</b>
            </a>
            <a href="mailto:info@farmalink.com.tr" className={styles.info}>
              <Mail size={18} className={styles.infoIcon} /> info@farmalink.com.tr
            </a>
            <span className={styles.info}>
              <MapPin size={18} className={styles.infoIcon} />
              İçerenköy Mah. Üsküdar İçerenköy Yolu Cad. Ofis Ataşehir No:21 A Blok Dk:1<br />34752 Ataşehir-İstanbul
            </span>
            <div className={styles.socials}>
              <a
                href="https://www.facebook.com/GengigelTr/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <Image
                  src="/img/social/facebook.svg"
                  alt="Facebook"
                  width={24}
                  height={24}
                  priority={false}
                />
              </a>
              <a
                href="https://www.instagram.com/gengigeltr/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Image
                  src="/img/social/instagram.svg"
                  alt="Instagram"
                  width={24}
                  height={24}
                  priority={false}
                />
              </a>
              <a
                href="https://www.youtube.com/@FarmalinktenGengigel"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
              >
                <Image
                  src="/img/social/youtube.svg"
                  alt="YouTube"
                  width={24}
                  height={24}
                  priority={false}
                />
              </a>
            </div>
          </div>
          <div className={styles.colWide}>
            <div className={styles.colBlock}>
              <h4>Farmalink</h4>
              <Link href="/about-us" className={styles.link}>Hakkımızda</Link>
              <Link href="/products?brand=gengigel" className={styles.link}>Gengigel</Link>
              <Link href="/products?brand=ricerfarma" className={styles.link}>Ricerfarma</Link>
              <Link href="/sss" className={styles.link}>S.S.S.</Link>
              <Link href="/videolar" className={styles.link}>Videolar</Link>
              <Link href="/blog" className={styles.link}>Blog</Link>
              <Link href="/iletisim" className={styles.link}>İletişim</Link>
            </div>
            <div className={styles.colBlock}>
              <h4>Ürünler</h4>
              <Link href="/products?cat=gundelik-kullanim" className={styles.link}>Günlük ağız bakımı</Link>
              <Link href="/products?cat=bebeklikten-itibaren" className={styles.link}>Diş çıkarmadan, ergenliğe sağlıklı dişler</Link>
              <Link href="/products?cat=acil-durumlar-ve-cerrahi-prosedurler" className={styles.link}>Acil durumlar, diş eti operasyonları</Link>
              <Link href="/products?cat=klinikte-kullanim" className={styles.link}>Klinikte kullanım</Link>
            </div>
            <div className={styles.colBlock}>
              <h4>Kurallar</h4>
              <Link href="/contracts/mesafeli-satis-sozlesmesi" className={styles.link}>Mesafeli Satış Sözleşmesi</Link>
              <Link href="/contracts/alisveris-aydinlatma-metni" className={styles.link}>Alışveriş Aydınlatma Metni</Link>
              <Link href="/contracts/cerez-aydinlatma-metni" className={styles.link}>Çerez Aydınlatma Metni</Link>
              <Link href="/contracts/iptal-iade-ve-teslimat-kosullari" className={styles.link}>İptal/iade Ve Teslimat Koşulları</Link>
              <Link href="/contracts/kullanim-kosullari" className={styles.link}>Kullanım Koşulları</Link>
              <Link href="/contracts/uyelik-aydinlatma-metni" className={styles.link}>Üyelik Aydınlatma Metni</Link>
              <Link href="/contracts/uyelik-sozlesmesi" className={styles.link}>Üyelik Sözleşmesi</Link>
              <Link href="/contracts/veri-sorumlusuna-basvuru-formu" className={styles.link}>Veri Sorumlusuna Başvuru Formu</Link>
              <Link href="/contracts/kisisel-verilerin-islenmesine-iliskin" className={styles.link}>Kişisel Verilerin İşlenmesine İlişkin</Link>
            </div>
          </div>
          <div className={styles.col}>
            <Link href="/register?type=pro" className={styles.professionalApply}>
              <div className={styles.professionalTitle}>
                <ShieldPlus size={32} />
                <span>Sağlık Profesyonelleri</span>
              </div>
              <div className={styles.professionalText}>
                Kliniğinize tanıtıcı bilgi, broşür, testler, reçetelik göndermemizi isterseniz tıklayın.
              </div>
              <div className={styles.professionalAction}>Hemen başvur</div>
            </Link>
          </div>
        </div>
        <div className={styles.middle}>
          <div className={styles.logos}>
            <div className={styles.left}>
              <Image src="/img/ricerfarma.png" alt="Ricerfarma" width={140} height={30} />
              <Image src="/img/gengigel.png" alt="Gengigel" width={140} height={30} />
            </div>
            <div className={styles.right}>
              {/* <Image src="https://farmalink.com.tr/app/Themes/default/assets/img/visamaster.svg" alt="Visa Master" width={84} height={30} /> */}
            </div>
          </div>
          <div className={styles.notice}>
            GENGIGEL®, Ricerfarma s.r.l.&apos;ye ait tescilli bir ticari markadır. Farmalik Sağlık Ürünleri San. ve Tic. Ltd. Şti, Gengigel&apos;in Türkiye&apos;deki tek yetkili dağıtımcısıdır.
            <br /><br />
            Bu sitedeki bilgiler hekim ya da eczacıya danışmanın yerine geçemez. Bu sitedeki bilgilerin ve ve sitenin kullanımına bağlı olarak oluşacak herhangi bir durumda Farmalink® hukuki sorumluluğu üstlenmez. Sitedeki bilgiler sadece hedef kullanıcılara yönelik olup, bu bilgiler başkaları tarafından 3. şahıslara / gruplara dağıtılamaz, kopyalanamaz, iletilemez.
          </div>
        </div>
        <div className={styles.bottom}>
          <div className={styles.copy}>
            {`Farmalink® Sağlık Ürünleri San. Ve Tic. Ltd. Şti. © ${new Date().getFullYear()} Tüm hakları saklıdır.`}
          </div>
        </div>
      </div>
    </footer>
  )
}