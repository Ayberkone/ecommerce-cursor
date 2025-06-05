import BrandGallery from "@/components/BrandGallery/BrandGallery"
import HomeSlider from "@/components/HomeSlider/HomeSlider"
import ProductCard from '@/components/ProductCard/ProductCard'
import Section from "@/components/Section/Section"
import VideosSection from "@/components/VideosSection/VideosSection"

const HomePage = () => {
  return (
    <>
      <HomeSlider />
      <main>
        <Section id="brand-gallery">
          <BrandGallery />
        </Section>
        <Section id="videolar">
          <VideosSection />
        </Section>
      </main>
    </>
  )
}

export default HomePage
