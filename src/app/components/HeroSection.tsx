import { useNavigate } from 'react-router';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="w-full bg-gray-100 pt-24 pb-8 px-4">
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-8">
        {/* Heading */}
        <div className="text-center">
          <h1 className="font-bold leading-tight tracking-tight text-4xl sm:text-5xl lg:text-7xl">
            <span className="text-[#101828]">PRESERVE Your Health with </span>
            <span className="text-[#6D28D9]">Smart Interventions</span>
          </h1>
        </div>

        {/* Description */}
        <p className="text-[#4A5565] text-center text-lg sm:text-xl lg:text-2xl leading-relaxed max-w-3xl">
          Understand your sleep patterns, activity levels, and overall lifestyle
          through health data to make informed decisions that support brain
          health, heart health and well-being.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
          <button 
            onClick={() => navigate('/register')}
            className="w-44 py-4 px-8 rounded-[14px] bg-[#6D28D9] text-white font-semibold text-lg leading-7 shadow-lg hover:bg-[#5B21B6] transition-colors"
          >
            Sign Up
          </button>
          <button 
            onClick={() => navigate('/signin')}
            className="w-44 py-4 px-8 rounded-[14px] border-2 border-[#6D28D9] text-[#6D28D9] font-semibold text-lg leading-7 hover:bg-[#6D28D9] hover:text-white transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    </section>
  );
}
