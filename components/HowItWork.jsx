import Image from "next/image";



const HowItWork = () => {
  return (
    <div>
      <section className="flex flex-col  px-6 md:px-16 lg:px-24 text-sm max-w-6xl mx-auto mt-20" id="how-it-works">
        <div className="flex items-center mr-auto gap-2 text-indigo-600 bg-indigo-50 rounded-full px-3 py-1">
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
</svg>

          <span>How it work</span>
        </div>
        <h1 className="text-3xl font-medium bg-linear-to-r from-slate-800 to-slate-500 text-transparent bg-clip-text mt-4 ">
          <span className="text-5xl text_bad_script leading-[1.6]">Simple</span> as 1,2,3
        </h1>
        <p className="text-slate-500 mt-4 max-w-2xl">
          A simple, structured coaching process designed to keep you consistent
          and focused on real progress.
        </p>

        {/* //here to add how it work section  */}
        <div className="flex flex-wrap items-center justify-center gap-8 pt-12">
          <div className="max-w-72 w-full hover:-translate-y-0.5 transition duration-300">
            <Image
              className="rounded-xl"
              src="/images/book_call.svg"
              alt=""
              width={200}
              height={200}

            />
            <h3 className="text-base text-slate-900 font-medium mt-3">
              We discuss your goals, experience, and expectations.
            </h3>
            <p className="text-xs text-indigo-600 font-medium mt-1">
              Apply or Book a Call
            </p>
          </div>
          <div className="max-w-72 w-full hover:-translate-y-0.5 transition duration-300">
            <Image
              className="rounded-xl"
              src="/images/plan.svg"
              alt=""
              width={200}
              height={200}
            />
            <h3 className="text-base text-slate-900 font-medium mt-3">
 Your training and guidance are built specifically for you.            </h3>
            <p className="text-xs text-indigo-600 font-medium mt-1">
              Get a Personalized Plan
            </p>
          </div>
          <div className="max-w-72 w-full hover:-translate-y-0.5 transition duration-300">
            <Image
              className="rounded-xl"
              src="/images/track.svg"
              alt=""
              width={200}
              height={200}
            />
            <h3 className="text-base text-slate-900 font-medium mt-3">
                   Log your progress and receive ongoing feedback through your dashboard.
            </h3>
            <p className="text-xs text-indigo-600 font-medium mt-1">
              Track Progress & Stay Accountable
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWork;
