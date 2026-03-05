import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import Features from "../components/Features"
import Testimonials from "../components/Testimonials"
import HowItWork from "../components/HowItWork"
import Faq from "../components/Faq"
import CTA from "../components/CTA"
import Footer from "../components/Footer"



const page = () => {
  return (
    <div className="bg-white min-h-screen mx-auto">
      <Navbar/>
      <Hero/>
      <Features/>
      <HowItWork/>
      <Testimonials/>
      <Faq/>
      <CTA/>
      <Footer/>
    </div>
  )
}

export default page