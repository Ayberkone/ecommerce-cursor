import BrandGallery from "@/components/BrandGallery/BrandGallery"
import HomeSlider from "@/components/HomeSlider/HomeSlider"
import LoginRegisterComponent from "@/components/LoginRegisterComponent/LoginRegisterComponent"
import ProductCard from '@/components/ProductCard/ProductCard'
import Section from "@/components/Section/Section"
import VideosSection from "@/components/VideosSection/VideosSection"

const HomePage = () => {
  return (
    <>
      <HomeSlider />
      <main className="home-page">
        <Section id="brand-gallery">
          <BrandGallery />
        </Section>
        <Section id="login-register">
          <LoginRegisterComponent />
        </Section>
        <Section id="videolar">
          <VideosSection />
        </Section>
      </main>
    </>
  )
}

export default HomePage
