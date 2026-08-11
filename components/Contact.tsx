import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useForm, ValidationError } from '@formspree/react';

interface ContactProps {
  isDarkMode: boolean;
}

const Contact: React.FC<ContactProps> = ({ isDarkMode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [state, handleSubmit] = useForm('xrpzqlbe'); // Your Formspree ID
  
  // Keep local state for display purposes (optional, you can remove if not needed)
  const [formState, setFormState] = useState({
    identity: '',
    frequency: '',
    transmission: ''
  });

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from('.contact-title', { 
      y: 60, 
      opacity: 0, 
      duration: 1.2,
      stagger: 0.1
    })
    .from('.contact-line', {
      scaleX: 0,
      transformOrigin: 'left',
      duration: 1.5,
      ease: 'expo.out'
    }, '-=0.8')
    .from('.contact-info-item', { 
      y: 20, 
      opacity: 0, 
      duration: 0.8, 
      stagger: 0.1 
    }, '-=1')
    .from('.contact-input-group', { 
      x: 20, 
      opacity: 0, 
      duration: 1, 
      stagger: 0.1 
    }, '-=0.8');

  }, { scope: containerRef });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
  };

  const borderClass = isDarkMode ? 'border-white/20' : 'border-black/20';

  return (
    <div ref={containerRef} className="w-full max-w-[1200px] mx-auto py-12 md:py-24 relative min-h-[80vh] flex flex-col justify-center">
      
      {/* Background Grid Elements */}
      <div className="absolute top-0 right-0 p-4 opacity-20 hidden md:block">
        <div className="grid grid-cols-3 gap-1">
           {[...Array(9)].map((_, i) => (
             <div key={i} className="w-1 h-1 bg-current" />
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
        
        {/* Left Column: Context & Info */}
        <div className="lg:col-span-5 flex flex-col justify-between h-full">
          <div className="mb-16 lg:mb-0">
             <span className="contact-title block text-[7px] tracking-[0.4em] font-mono opacity-40 mb-4 uppercase">
               SUBMISSION // V1.0.4
             </span>
             <h1 className="contact-title text-[clamp(3rem,8vw,6rem)] leading-[0.9] font-[100] tracking-tight uppercase mb-8">
               CONTACT
             </h1>
             <div className="contact-line w-24 h-px bg-current mb-8 opacity-30" />
             <p className="contact-title text-[9px] md:text-[10px] leading-[2] tracking-[0.15em] font-light uppercase opacity-60 max-w-sm">
               For inquiries regarding commissions, collaborative research, or archival access.
             </p>
          </div>
        </div>

        {/* Right Column: Transmission Form */}
        <div className="lg:col-span-7 w-full pt-4">
          <form onSubmit={handleSubmit} className="space-y-12">
            
            {/* Name Field */}
            <div className="contact-input-group relative group">
              <label className="block text-[7px] tracking-[0.3em] font-bold opacity-30 mb-3 uppercase group-focus-within:opacity-100 transition-opacity">
                NAME
              </label>
              <input 
                type="text" 
                name="identity"
                required
                value={formState.identity}
                onChange={handleInputChange}
                className={`w-full bg-transparent border-b ${borderClass} py-3 text-[11px] tracking-[0.15em] font-light uppercase outline-none focus:border-current transition-colors placeholder:opacity-10`}
                placeholder="ENTER_NAME..."
                disabled={state.submitting || state.succeeded}
              />
              <ValidationError 
                prefix="Name" 
                field="identity"
                errors={state.errors}
                className="text-[7px] text-red-500 mt-1 uppercase"
              />
            </div>

            {/* Email Field */}
            <div className="contact-input-group relative group">
              <label className="block text-[7px] tracking-[0.3em] font-bold opacity-30 mb-3 uppercase group-focus-within:opacity-100 transition-opacity">
                EMAIL
              </label>
              <input 
                type="email" 
                name="frequency"
                required
                value={formState.frequency}
                onChange={handleInputChange}
                className={`w-full bg-transparent border-b ${borderClass} py-3 text-[11px] tracking-[0.15em] font-light uppercase outline-none focus:border-current transition-colors placeholder:opacity-10`}
                placeholder="ENTER_EMAIL"
                disabled={state.submitting || state.succeeded}
              />
              <ValidationError 
                prefix="Email" 
                field="frequency"
                errors={state.errors}
                className="text-[7px] text-red-500 mt-1 uppercase"
              />
            </div>

            {/* Message Field */}
            <div className="contact-input-group relative group">
              <label className="block text-[7px] tracking-[0.3em] font-bold opacity-30 mb-3 uppercase group-focus-within:opacity-100 transition-opacity">
                MESSAGE
              </label>
              <textarea 
                name="transmission"
                rows={4}
                required
                value={formState.transmission}
                onChange={handleInputChange}
                className={`w-full bg-transparent border-b ${borderClass} py-3 text-[11px] leading-relaxed tracking-[0.15em] font-light uppercase outline-none focus:border-current transition-colors resize-none placeholder:opacity-10`}
                placeholder="INPUT_MESSAGE"
                disabled={state.submitting || state.succeeded}
              />
              <ValidationError 
                prefix="Message" 
                field="transmission"
                errors={state.errors}
                className="text-[7px] text-red-500 mt-1 uppercase"
              />
            </div>

            {/* Status Indicator */}
            <div className="contact-input-group pt-4 flex items-center justify-between">
              {state.succeeded ? (
                <div className="flex items-center gap-2 opacity-100">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[7px] tracking-[0.2em] font-mono text-emerald-500">
                    INQUIRY_SUBMITTED
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 opacity-30">
                  <div className={`w-1.5 h-1.5 rounded-full ${state.submitting ? 'bg-amber-500 animate-pulse' : 'bg-current'}`} />
                  <span className="text-[7px] tracking-[0.2em] font-mono">
                    {state.submitting ? 'UPLOADING...' : 'ACCEPTING_QUERIES'}
                  </span>
                </div>
              )}

              {/* Submit Button */}
              {!state.succeeded && (
                <button 
                  type="submit" 
                  disabled={state.submitting}
                  className={`group relative px-8 py-3 border ${borderClass} overflow-hidden transition-all duration-500 hover:border-current disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <div className={`absolute inset-0 w-full h-full bg-current origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-expo-out`} />
                  <div className="relative z-10 flex items-center gap-4 mix-blend-difference text-current">
                     <span className={`text-[8px] tracking-[0.35em] font-bold uppercase ${isDarkMode ? 'text-white' : 'text-black group-hover:text-white'}`}>
                       SUBMIT
                     </span>
                  </div>
                </button>
              )}
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;