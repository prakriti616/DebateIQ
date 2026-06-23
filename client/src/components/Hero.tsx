import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative min-h-[110vh] sm:min-h-[140vh] w-full flex flex-col items-center justify-start overflow-hidden bg-bg-base">
      <div className="absolute top-[15vh] sm:top-[20vh] left-0 w-full h-[95vh] sm:h-[120vh] z-0 pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-100"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260603_132049_036591b8-6e92-4760-b94c-a7ea6eef315c.mp4"
        />
        <div className="absolute top-0 left-0 w-full h-24 sm:h-32 bg-gradient-to-b from-bg-base to-transparent" />
      </div>

      <div className="max-w-7xl w-full mx-auto px-8 md:px-16 lg:px-20 relative z-10 grid grid-cols-12 gap-x-4 md:gap-x-8 pt-[8rem] sm:pt-[9rem]">
        <div className="col-span-12 md:col-span-10 md:col-start-2">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-[2.9rem] md:text-[4rem] lg:text-[5rem] leading-[0.95] font-bold text-[#1a1a1a]"
          >
            <span className="text-[#1a1a1a]">DebateIQ:</span>
            <br />
            <span className="text-[#1a1a1a]"> An AI-based Debate Simulator </span>

          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="mt-10 max-w-xl"
          >
            <p className="text-lg text-zinc-700">Practice debates with real-time feedback, scoring, and AI judge analysis.</p>
            
          </motion.div>
        </div>
      </div>

      <div className="absolute right-8 top-[45vh] hidden lg:block">
        
      </div>

      
    </section>
  );
}
