export default function Hero() {
    return (
        <>
            {/* <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Berkshire+Swash&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
            
                * {
                    font-family: 'Poppins', sans-serif;
                }
            
                .font-berkshire {
                    font-family: 'Berkshire Swash', cursive;
                }
            `}</style> */}
            <section className="flex flex-col items-center pb-48 text-center text-sm text-white max-md:px-2 bg-[url('https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/bg-image-grain.png')] bg-cover bg-center">

                <div className="flex flex-wrap items-center justify-center p-1.5 mt-24 md:mt-28 rounded-full border border-slate-400 text-xs">
                    <div className="flex items-center">
                        <img className="size-7 rounded-full border-3 border-white"
                            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=50" alt="userImage1" />
                        <img className="size-7 rounded-full border-3 border-white -translate-x-2"
                            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=50" alt="userImage2" />
                        <img className="size-7 rounded-full border-3 border-white -translate-x-4"
                            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=50&h=50&auto=format&fit=crop"
                            alt="userImage3" />
                    </div>
                    <p className="-translate-x-2">Join community of 1m+ founders </p>
                </div>
                <h1 className="font-berkshire text-[45px]/[52px] md:text-6xl/[65px] mt-6 max-w-4xl">
                    Train Smarter. Track Everything.
                </h1>
                <p className="text-base mt-2 max-w-xl">Personalized training, weekly check-ins, and progress tracking — all in one private dashboard.</p>
  
            
                <form className="flex items-center mt-8 max-w-lg h-16 w-full rounded-full border border-slate-50">
                    <input type="email" placeholder="Enter email address" className="w-full h-full outline-none bg-transparent pl-6 pr-2 text-white placeholder:text-slate-300 rounded-full" />
                    <button className="bg-white text-slate-800 hover:bg-gray-300 text-nowrap px-8 md:px-10 h-12 mr-2 rounded-full font-medium transition">
                        Early access
                    </button>
                </form>
            </section>
        </>
    );
};