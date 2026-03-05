import Image from "next/image";

export default function Hero() {
  return (
    <section
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1563953715689-335fe4271a1e?q=80&w=1170&auto=format&fit=crop)",
      }}
      className="flex flex-col items-center min-h-screen pb-32 text-center text-sm text-white max-md:px-2 bg-cover bg-center relative"
    >
      {/* Spacer for navbar */}
      <div className="h-24"></div>

      {/* Community badge */}
      <div className="flex flex-wrap items-center justify-center p-1.5 mt-16 rounded-full border border-slate-400 text-xs backdrop-blur">
        <div className="flex items-center">
          <Image
            className="rounded-full border-2 border-white"
            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=50&h=50&fit=crop"
            alt="userImage1"
            width={25}
            height={25}
          />
          <Image
            className="rounded-full border-2 border-white -translate-x-2"
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=50&h=50&fit=crop"
            alt="userImage2"
            width={25}
            height={25}
          />
          <Image
            className=" rounded-full border-2 border-white -translate-x-4"
            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=50&h=50&fit=crop"
            alt="userImage3"
            width={25}
            height={25}
          />
        </div>
        <p className="-translate-x-2">Join community of 1m+ fitness enthusiasts</p>
      </div>

      {/* Heading */}
      <h1 className="mt-6 font-bold text-4xl md:text-6xl lg:text-7xl max-w-4xl leading-tight text-white drop-shadow-lg">
        Train Smarter.<br />Track Everything.
      </h1>

      {/* Subtitle */}
      <p className="text-lg md:text-xl mt-4 max-w-2xl text-white drop-shadow-md font-medium">
        Personalized training, weekly check-ins, and progress tracking — all in one private dashboard.
      </p>

      {/* Email form */}
      <form className="flex flex-col sm:flex-row items-center mt-8 max-w-lg w-full rounded-full border border-slate-200 backdrop-blur bg-white/10">
        <input
          type="email"
          placeholder="Enter email address"
          className="w-full h-16 outline-none bg-transparent pl-6 pr-2 text-white placeholder:text-slate-300 rounded-full sm:rounded-r-none"
        />
        <button
          type="submit"
          className="bg-white text-slate-800 hover:bg-gray-100 px-8 md:px-10 h-12 sm:h-16 rounded-full sm:rounded-l-none font-medium transition-all duration-300 hover:scale-105"
        >
          Get Started
        </button>
      </form>

      {/* Trust indicators */}
      <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm text-slate-300">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          No credit card required
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          14-day free trial
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Cancel anytime
        </div>
      </div>
    </section>
  );
}
