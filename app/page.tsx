import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import Testimonials from "../components/Testimonials"
import HowItWork from "../components/HowItWork"
import Faq from "../components/Faq"
import Footer from "../components/Footer"



const page = () => {
  return (
    <div className="bg-white min-h-screen  mx-auto  ">
      <Navbar/>
      <Hero/>
      <Testimonials/>
      <HowItWork/>
      <Faq/>
      <Footer/>
    </div>
  )
}

export default page