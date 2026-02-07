import Image from "next/image";

export default function Hero() {
  return (
    <section
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1563953715689-335fe4271a1e?q=80&w=1170&auto=format&fit=crop)",
      }}
      className="flex flex-col items-center min-h-screen pb-48 text-center text-sm text-white max-md:px-2 bg-cover bg-center"
    >
      {/* Community badge */}
      <div className="flex flex-wrap items-center justify-center p-1.5 mt-44 rounded-full border border-slate-400 text-xs backdrop-blur">
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
        <p className="-translate-x-2">Join community of 1m+ founders</p>
      </div>

      {/* Heading */}
      <h1 className="mt-6 font-berkshire text-[45px]/[52px] md:text-6xl/[65px]  max-w-4xl">
        Train Smarter. Track Everything.
      </h1>

      {/* Subtitle */}
      <p className="text-base mt-2 max-w-xl text-slate-200">
        Personalized training, weekly check-ins, and progress tracking — all in one private dashboard.
      </p>

      {/* Email form */}
      <form className="flex items-center mt-8 max-w-lg h-16 w-full rounded-full border border-slate-200 backdrop-blur">
        <input
          type="email"
          placeholder="Enter email address"
          className="w-full h-full outline-none bg-transparent pl-6 pr-2 text-white placeholder:text-slate-300 rounded-full"
        />
        <button
          type="submit"
          className="bg-white text-slate-800 hover:bg-gray-300 px-8 md:px-10 h-12 mr-2 rounded-full font-medium transition"
        >
          Early access
        </button>
      </form>
    </section>
  );
}
