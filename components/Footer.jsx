import Image from "next/image";
import Link from "next/link";


export default function Footer() {
    return (
        <footer className="w-full bg-linear-to-b from-[#1B004D] to-[#2E0A6F] text-white mt-20">
            <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col items-center">
                <div className="flex items-center space-x-3 mb-6">
                    <Image alt="" className="h-11" width={1000} height={1000}
                        src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/dummyLogo/prebuiltuiLogoSquareShape.svg" />
                </div>
                <p className="text-center max-w-xl text-sm font-normal leading-relaxed">
                    Empowering creators worldwide with the most advanced AI content creation tools. Transform your ideas
                    into reality.
                </p>
            </div>
            <div className="border-t border-[#3B1A7A]">
                <div className="max-w-7xl mx-auto px-6 py-6 text-center text-sm font-normal">
                    <Link href="https://prebuiltui.com">prebuiltui</Link> ©2025. All rights reserved.
                </div>
            </div>
        </footer>
    );
};