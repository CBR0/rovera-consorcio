 import Image from "next/image";
import Link from "next/link";
import LoginButton from "./LoginButton";

export default function Hero() {
    return (
        <section className="relative min-h-screen w-full bg-[#000000] overflow-hidden lg:flex lg:flex-col lg:items-center justify-center pt-35 sm:pt-20">

            {/* CIRCULOS */}
            <div id="circulo-maior" className="absolute w-[100%] h-[75%] md:w-[800px] md:h-[800px] border border-dashed border-white rounded-full z-40 opacity-26 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2" />
            <div id="circulo-menor" className="absolute h-[150px] w-[330px] h-[330px] border border-dashed border-white/50 rounded-full opacity-39 z-10 left-1/2 -translate-x-1/2 top-[calc(50%-175px)] md:top-[calc(50%-400px)] hidden md:block" />


            <div className="z-10 text-center space-y-4 md:space-y-0 relative top-0 xl:top-10 ">

                <h2 className="font-display text-[60px] sm:text-[80px] md:text-[80px] lg:text-[100px] xl:text-[146px] leading-none font-bold uppercase select-none bg-gradient-to-b from-[#ffffff] to-[#525252] bg-clip-text via-[#525252] from-40% via-80% text-transparent  tracking-tight">O SEU</h2>

                <h2 className="mb-5 font-display text-[30px] sm:text-[45px] md:text-[60px] lg:text-[70px] xl:text-[75px] leading-none text-white tracking-widest font-bold uppercase select-none bg-gradient-to-b from-gray-200 to-gray-800 bg-clip-text text-transparent opacity-90 flex justify-center gap-3 lg:gap-[300px] xl:gap-[400px]">
                    <span className="tracking-tight relative left-0 xl:left-30 bg-gradient-to-r from-[#ffffff] to-[#525252] bg-clip-text text-transparent">FUTURO</span><span className="bg-gradient-to-l from-[#ffffff] to-[#525252] bg-clip-text text-transparent tracking-tight relative">CHEGOU</span>
                </h2>

                <div className="absolute w-full h-[1px] bg-white opacity-33" />
            </div>

            <div className="relative z-30 -mt-20 md:-mt-40 w-full max-w-[1200px] flex justify-center">
                <div className="absolute top-[0] left-[-10%] rotate-[-45deg] md:rotate-[33.5deg] -translate-x-[5vw] -translate-y-1/2 w-[100%] h-[10%] md:w-[80%] md:h-[140px] blur-[120px] bg-[#fff]/45" />
                {/* EFEITO DE LUZ */}

                <Image
                    src="/assets/carro.png"
                    alt="Rovera X1"
                    width={730}
                    height={600}
                    priority
                    className="sm:mt-0 md:mt-10 lg:mt-0"
                />

            </div>

            <div className="z-50 relative flex flex-col items-center -mt-10 md:-mt-30 space-y-6 pb-12">
                <div className="text-center">
                    <h3 className="text-xl font-bold text-white tracking-wide">Rovera X1</h3>
                    <p className="text-xl">100% elétrico, 0% juros.</p>
                </div>
                <LoginButton/>
            </div>

        </section>
    );
}