import Image from "next/image";

export default function Hero() {
  return (
    <section
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1563953715689-335fe4271a1e?q=80&w=1170&auto=format&fit=crop)",
        backgroundAttachment: "fixed",
      }}
      className="flex flex-col items-center justify-center min-h-screen w-full text-center text-white px-4 sm:px-6 md:px-8 bg-cover bg-center relative"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 z-0"></div>

      {/* Content wrapper */}
      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center mx-auto px-4 sm:px-6 md:px-8">
        {/* Community badge */}
        <div className="flex flex-wrap items-center justify-center p-2 sm:p-3 mt-4 sm:mt-6 rounded-full border border-white/30 text-xs sm:text-sm backdrop-blur-md bg-white/10 gap-2 w-fit">
          <div className="flex items-center gap-1.5">
            <Image
              className="rounded-full border-2 border-white"
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=50&h=50&fit=crop"
              alt="user avatar 1"
              width={18}
              height={18}
            />
            <Image
              className="rounded-full border-2 border-white -translate-x-2"
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=50&h=50&fit=crop"
              alt="user avatar 2"
              width={18}
              height={18}
            />
            <Image
              className="rounded-full border-2 border-white -translate-x-4"
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=50&h=50&fit=crop"
              alt="user avatar 3"
              width={18}
              height={18}
            />
          </div>
          <p className="text-xs sm:text-sm font-medium">Join 1M+ members achieving goals</p>
        </div>

        {/* Main Heading */}
        <div className="mt-6 sm:mt-8 md:mt-12">
          <h1 className="font-black text-3xl sm:text-4xl md:text-6xl lg:text-7xl leading-tight text-white drop-shadow-2xl">
            Transform Your <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">Fitness Journey</span>
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-sm sm:text-base md:text-xl mt-4 sm:mt-6 max-w-3xl text-white/90 drop-shadow-lg font-light">
          Get personalized workouts, track your progress like never before, and achieve your goals with expert coaching and community support.
        </p>

        {/* CTA Section - Mobile Optimized */}
        <div className="mt-8 sm:mt-10 md:mt-12 flex flex-col gap-4 sm:gap-5 md:gap-6 w-full max-w-2xl">
          {/* Main CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button className="flex-1 sm:flex-none bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 sm:px-10 py-4 sm:py-3.5 md:py-4 rounded-xl sm:rounded-full font-bold text-base sm:text-lg transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl flex items-center justify-center gap-2">
              <span>🚀</span>
              <span>Start Free Trial</span>
            </button>
            <button className="flex-1 sm:flex-none border-2 border-white/40 hover:border-white text-white px-6 sm:px-10 py-4 sm:py-3.5 md:py-4 rounded-xl sm:rounded-full font-bold text-base sm:text-lg transition-all duration-300 hover:bg-white/10 backdrop-blur-sm flex items-center justify-center gap-2">
              <span>📞</span>
              <span>Book a Call</span>
            </button>
          </div>

          {/* Social Proof */}
          <div className="flex flex-col gap-3 sm:gap-4 items-center">
            <p className="text-white/80 text-xs sm:text-sm font-medium">Trusted by over 10,000 members</p>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <div className="flex">
                {[1, 2, 3].map((i) => (
                  <Image
                    key={i}
                    className="rounded-full border-2 border-white -translate-x-2"
                    src={i === 1 ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=32&h=32&fit=crop" : i === 2 ? "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=32&h=32&fit=crop" : "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=32&h=32&fit=crop"}
                    alt="user"
                    width={24}
                    height={24}
                  />
                ))}
              </div>
              <div className="flex gap-1 text-yellow-300 text-xs sm:text-sm">
                <span>⭐⭐⭐⭐⭐</span>
                <span className="ml-1 text-white/80">(4.9 avg)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap items-center justify-center mt-6 sm:mt-8 md:mt-10 text-xs sm:text-sm text-white/80">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>14-Day Free Trial</span>
          </div>
          <div className="hidden sm:block w-1 h-1 bg-white/40 rounded-full"></div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>No Credit Card Required</span>
          </div>
          <div className="hidden sm:block w-1 h-1 bg-white/40 rounded-full"></div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Cancel Anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
}
