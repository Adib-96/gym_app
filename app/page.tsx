import Navbar from "../components/Navbar"
import Hero from "@/app/_components/Hero"
import Testimonials from "@/app/_components/Testimonials"
import HowItWork from "@/app/_components/HowItWork"



const page = () => {
  return (
    <div className="bg-white min-h-screen  mx-auto  ">
      <Navbar/>
      <Hero/>
      <Testimonials/>
      <HowItWork/>
    </div>
  )
}

export default page