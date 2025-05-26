// File: app/about-us/page.tsx

'use client'

import React from 'react'
import styles from './AboutUs.module.scss'

export default function AboutUsPage() {
  return (
    <main className={styles.aboutUs}>
      <div className={styles.container}>
        <h1>Hakkımızda</h1>
        <p>
          Farmalink Sağlık Ürünleri, 2002 yılından beri sağlık alanında hizmet vermektedir. Türkiye ve Orta Doğu’da ilaç sektöründe, satış fonksiyonlarının tüm kademelerinde uzun yıllar deneyimi olan ortaklarının girişimi ile kurulduğundan bugüne, çok uluslu iş ortakları ile ilaç, ara ürün, tıbbi cihaz, kozmetik ve dermakozmetik alanında birçok markayı tüketicilere ulaştırmaktadır.
        </p>
        <p>
          Ürünlerimiz, ilaç depoları kanalı ile eczanelerde bulunmaktadır. İş ortaklarımız, Türkiye’nin önde gelen sağlık profesyonelleri, eczaneler, özel hastaneler ve hekimlerdir. Ayrıca Türkiye’nin önde gelen pazar yerlerinde ve firmamızın internet sitesi ve sosyal medya kanalları ile de ürünlerimizin satış faaliyetleri gerçekleşmektedir.
        </p>
        <p>
          Portföyümüzde yer alan ürünlerimiz, kendi bulunduğu pazarlarda çok önemli ihtiyaçları karşılayan, birbirini tamamlayıcı ürünlerden oluşmaktadır.
        </p>
        <p>
          Farmalink’in ürün yelpazesi, uzun, mutlu ve sağlıklı bir ömür için insan sağlığını, fiziksel, duygusal ve ruhsal bir bütün olarak iyi durumda olmasına hizmet etmektedir.
        </p>

        <h2>İş Ortaklıklarımız ve Ürünlerimiz</h2>
        <p>
          İtalyan Ar-Ge Firması Ricerfarma® (www.ricerfarma.com), yıllardır başta dermatoloji ve eklem sağlığı olmak üzere tıbbın birçok alanında güvenle kullanılan hyaluronik asidi, diş hekimliği alanında uygulamayı düşünen ilk firmadır. Ricerfarma’nın bu alandaki patentli ürünü Gengigel® sektörde “Dişeti dokusunu iyileştirmeyi hızlandıran” ilk üründür. Avrupa’nın başlıca ülkelerinin tümünde ve Dünya’da 70’i aşkın ülkede pazarlanmaktadır. Amerika FDA (Food & Drug Administration) tarafından onaylıdır.
        </p>
        <p>
          Normal dişeti dokusunun herhangi bir uygulama (implant, vs) ya da hastalık ardından kendi kendini yenileme süresini ciddi anlamda kısaltıp, hastaya eşlik eden ağrı, inflamasyon, şişlik, kızarıklık gibi belirtileri hızla ortadan kaldırdığı uluslararası saygın dergiler (Journal of Periodontology vs) tarafından yayınlanmış yayınlarla kanıtlanmıştır. Bu durum diş etine yapılacak herhangi bir uygulamanın (protez, implant vs), toplam tedavi süresini oldukça kısaltmakta ve hastalar için konforlu yaşama hızla ulaşma imkanı sağlamaktadır.
        </p>
        <p>
          Gengigel®&apos;in yeni formu “Gengigel Teething®” isimli ürünü ise, bebeklerde diş çıkarımı esnasında oluşan rahatsızlık ve ağrının giderilmesi konusunda FDA tarafından yasaklanmış maddeler içermeyen, etkinliği klinik çalışmalarla onaylanmış, ilaç olmayan bir üründür. Bu sayede, bebeklerin diş çıkarma esnasında oluşan rahatsızlıkları, güvenle ve etkili bir şekilde giderilecektir.
        </p>

        <h2>İletişim</h2>
        <p>
          İçerenköy Mah. Üsküdar İçerenköy Yolu Cad. Ofis Ataşehir No:21 A Blok Dk:1 34752 Ataşehir-İstanbul
        </p>
        <p>
          Tel: 0 216 668 00 62
        </p>
        <p>
          E-posta: info@farmalink.com.tr
        </p>
      </div>
    </main>
  )
}