import Image from "next/image";



const HowItWork = () => {
  return (
    <div>
      <section className="w-full bg-gradient-to-b from-white to-slate-50 py-16 sm:py-20 md:py-28 px-3 sm:px-6 md:px-8" id="how-it-works">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <div className="flex items-center justify-center gap-2 text-indigo-600 bg-indigo-50 rounded-full px-3 sm:px-4 py-2 w-fit mx-auto mb-4 sm:mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 sm:size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
              </svg>
              <span className="text-xs sm:text-sm font-semibold">How It Works</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mt-4 sm:mt-5 mb-3 sm:mb-4 leading-tight">
              Three Simple Steps to <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">Transform</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
              Get started on your fitness journey with our simple, proven process
            </p>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 md:gap-8 mb-12 sm:mb-16">
            {/* Step 1 */}
            <div className="group relative">
              <div className="bg-white hover:bg-indigo-50 border-2 border-slate-200 hover:border-indigo-300 rounded-2xl sm:rounded-3xl p-6 sm:p-7 md:p-8 transition-all duration-300 hover:shadow-xl h-full flex flex-col">
                {/* Step Badge */}
                <div className="flex items-center gap-3 mb-5 sm:mb-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-full flex items-center justify-center text-white font-black text-lg sm:text-xl group-hover:scale-110 transition-transform">1</div>
                  <p className="text-lg sm:text-xl font-bold text-indigo-600">Step One</p>
                </div>

                {/* Icon */}
                <div className="text-4xl sm:text-5xl md:text-6xl mb-5 sm:mb-6">📋</div>

                {/* Content */}
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 mb-3">
                  Book Your Consultation
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed flex-grow">
                  Discuss your goals, fitness experience, and expectations with our expert coaches to create your personalized plan.
                </p>

                {/* Action */}
                <div className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-slate-200">
                  <p className="text-xs sm:text-sm font-semibold text-indigo-600">Apply or Book a Call</p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="group relative">
              <div className="bg-white hover:bg-purple-50 border-2 border-slate-200 hover:border-purple-300 rounded-2xl sm:rounded-3xl p-6 sm:p-7 md:p-8 transition-all duration-300 hover:shadow-xl h-full flex flex-col">
                {/* Step Badge */}
                <div className="flex items-center gap-3 mb-5 sm:mb-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center text-white font-black text-lg sm:text-xl group-hover:scale-110 transition-transform">2</div>
                  <p className="text-lg sm:text-xl font-bold text-purple-600">Step Two</p>
                </div>

                {/* Icon */}
                <div className="text-4xl sm:text-5xl md:text-6xl mb-5 sm:mb-6">💪</div>

                {/* Content */}
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 mb-3">
                  Get Your Plan
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed flex-grow">
                  Receive a fully customized workout and nutrition plan specifically designed for your goals and lifestyle.
                </p>

                {/* Action */}
                <div className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-slate-200">
                  <p className="text-xs sm:text-sm font-semibold text-purple-600">Personalized Training Plan</p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="group relative sm:col-span-2 lg:col-span-1">
              <div className="bg-white hover:bg-pink-50 border-2 border-slate-200 hover:border-pink-300 rounded-2xl sm:rounded-3xl p-6 sm:p-7 md:p-8 transition-all duration-300 hover:shadow-xl h-full flex flex-col">
                {/* Step Badge */}
                <div className="flex items-center gap-3 mb-5 sm:mb-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-pink-600 to-pink-700 rounded-full flex items-center justify-center text-white font-black text-lg sm:text-xl group-hover:scale-110 transition-transform">3</div>
                  <p className="text-lg sm:text-xl font-bold text-pink-600">Step Three</p>
                </div>

                {/* Icon */}
                <div className="text-4xl sm:text-5xl md:text-6xl mb-5 sm:mb-6">📊</div>

                {/* Content */}
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 mb-3">
                  Track & Succeed
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed flex-grow">
                  Log your workouts, track progress, and stay accountable with real-time feedback through your personal dashboard.
                </p>

                {/* Action */}
                <div className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-slate-200">
                  <p className="text-xs sm:text-sm font-semibold text-pink-600">Track Progress & Accountability</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl sm:rounded-3xl p-8 sm:p-10 md:p-12 text-center text-white">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3">
              Ready to Start Your Transformation?
            </h3>
            <p className="text-sm sm:text-base text-indigo-100 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Join thousands of people who have already transformed their bodies and minds
            </p>
            <button className="bg-white text-indigo-600 hover:bg-gray-100 px-8 sm:px-10 md:px-12 py-3 sm:py-3.5 md:py-4 rounded-full font-bold text-sm sm:text-base transition-all duration-300 hover:scale-105 hover:shadow-xl">
              Start Your Free Trial Today
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWork;
