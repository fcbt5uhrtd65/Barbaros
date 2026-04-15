import image_1e4fc8c63620d97226934be919f5f40a4bfc65db from 'figma:asset/1e4fc8c63620d97226934be919f5f40a4bfc65db.png'
import image_6918a5336ec9c5c42895b9476a0d7fd87979c072 from 'figma:asset/6918a5336ec9c5c42895b9476a0d7fd87979c072.png'
import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import {
  Scissors, Star, Instagram, MapPin, Phone, Clock, Menu, X,
  ArrowRight, Award, Crown, Shield, Sparkles, Calendar, Check, Zap
} from 'lucide-react';
import razorImage from 'figma:asset/f0009898262226b4306dfd8c2828908156b736ba.png';
import heroImage from '@/imports/ChatGPT_Image_12_abr_2026,_10_38_43_p.m..png';
import Slider from 'react-slick';
import {
  desktopLeftNav,
  desktopRightNav,
  footerNav,
  getSectionId,
  mobileNav,
} from '@/features/landing/config/navigation';
import { APP_BRAND } from '@/shared/config/app.constants';

export function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollProgress(scrolled);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#0B0B0B] overflow-x-hidden">
      {/* SCROLL PROGRESS */}
      <div className="fixed left-0 top-0 bottom-0 w-1 bg-white/5 z-50 hidden lg:block">
        <motion.div
          className="w-full bg-gradient-to-b from-[#D4AF37] to-[#C9A84C]"
          style={{ height: `${scrollProgress}%` }}
        />
      </div>

      {/* NAVBAR MINIMALISTA */}
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-700 ${
        scrolled
          ? 'bg-[#0B0B0B]/90 backdrop-blur-xl border-b border-white/5'
          : 'bg-transparent'
      }`}>
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-24">
            {/* Logo Centrado */}
            <motion.a
              href="#inicio"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center z-50"
            >
              <h1 className="font-['Playfair_Display'] font-bold text-2xl lg:text-3xl text-white tracking-tight">
                {APP_BRAND.name}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-[1px] w-6 bg-[#D4AF37]" />
                <span className="text-[#D4AF37] text-[8px] tracking-[0.4em] font-['DM_Sans'] uppercase">
                  {APP_BRAND.foundationLabel}
                </span>
                <div className="h-[1px] w-6 bg-[#D4AF37]" />
              </div>
            </motion.a>

            {/* Menu Izquierda */}
            <div className="hidden lg:flex items-center gap-8">
              {desktopLeftNav.map((item, idx) => (
                <motion.a
                  key={item}
                  href={`#${getSectionId(item)}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className="text-white/70 hover:text-[#D4AF37] transition-colors text-[10px] tracking-[0.25em] font-['DM_Sans'] uppercase font-medium"
                >
                  {item}
                </motion.a>
              ))}
            </div>

            {/* Menu Derecha */}
            <div className="hidden lg:flex items-center gap-8">
              {desktopRightNav.map((item, idx) => (
                <motion.a
                  key={item}
                  href={`#${getSectionId(item)}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (idx + 2) * 0.08 }}
                  className="text-white/70 hover:text-[#D4AF37] transition-colors text-[10px] tracking-[0.25em] font-['DM_Sans'] uppercase font-medium"
                >
                  {item}
                </motion.a>
              ))}
              <motion.a
                href="#ubicación"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-[#D4AF37] text-[#0B0B0B] px-8 py-3 font-bold text-[10px] tracking-[0.2em] uppercase hover:bg-[#C9A84C] transition-colors"
              >
                Reservar
              </motion.a>
            </div>

            {/* Mobile Menu */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-white p-2 z-50"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#0B0B0B]/95 backdrop-blur-xl border-t border-white/5"
          >
            <div className="px-6 py-6 space-y-4">
              {mobileNav.map((item) => (
                <a
                  key={item}
                  href={`#${getSectionId(item)}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-white/70 hover:text-[#D4AF37] text-sm tracking-wider uppercase transition-colors"
                >
                  {item}
                </a>
              ))}
              <a
                href="#ubicación"
                onClick={() => setIsMenuOpen(false)}
                className="block bg-[#D4AF37] text-[#0B0B0B] px-6 py-3 font-bold text-sm text-center uppercase"
              >
                Reservar
              </a>
            </div>
          </motion.div>
        )}
      </nav>

      {/* HERO MINIMALISTA */}
      <section
        ref={heroRef}
        id="inicio"
        className="relative min-h-screen flex items-center overflow-hidden bg-[#0B0B0B]"
      >
        <motion.div
          style={{ scale: heroScale }}
          className="absolute inset-0"
        >
          <img
            src={heroImage}
            alt="Barbería Premium"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0B]/70 via-[#0B0B0B]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B]/80 via-transparent to-transparent" />
        </motion.div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 py-32 min-h-screen flex items-center">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="h-[1px] w-16 bg-[#D4AF37]" />
              <span className="text-[#D4AF37] text-[10px] tracking-[0.5em] font-['DM_Sans'] uppercase font-bold text-center">
                Est. 1888 · Puerto Colombia
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="font-['Playfair_Display'] font-bold text-6xl lg:text-9xl text-white leading-[0.9] mb-8"
            >
              MÁS QUE
              <span className="block text-5xl lg:text-8xl text-[#D4AF37] mt-4">
                UN CORTE
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-2xl lg:text-4xl text-white font-['Playfair_Display'] italic leading-tight mb-3"
            >
              Una experiencia bárbara
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="text-base lg:text-lg text-white/70 font-light leading-relaxed mb-12 max-w-xl"
            >
              Tradición artesanal · Maestría con navaja · Perfección milimétrica
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.a
                href="#servicios"
                whileHover={{ x: 5 }}
                className="bg-[#D4AF37] text-[#0B0B0B] px-10 py-4 font-bold text-sm tracking-wider uppercase inline-flex items-center gap-3 hover:bg-[#C9A84C] transition-all duration-300"
              >
                Explorar Servicios
                <ArrowRight className="w-4 h-4" />
              </motion.a>

              <motion.a
                href="#ubicación"
                whileHover={{ x: 5 }}
                className="border-2 border-white/40 text-white px-10 py-4 font-bold text-sm tracking-wider uppercase inline-flex items-center gap-3 hover:bg-white/10 hover:border-white/60 transition-all duration-300 backdrop-blur-sm"
              >
                Reservar Ahora
                <ArrowRight className="w-4 h-4" />
              </motion.a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* WAVE */}
      <div className="relative h-24 -mt-24 z-10 pointer-events-none">
        <svg viewBox="0 0 1440 200" preserveAspectRatio="none" className="w-full h-full">
          <defs>
            <filter id="abstract-paint-1" x="-50%" y="-50%" width="200%" height="200%">
              <feTurbulence type="fractalNoise" baseFrequency="0.02 0.01" numOctaves="3" seed="15" />
              <feDisplacementMap in="SourceGraphic" scale="40" />
            </filter>
          </defs>
          <path
            d="M0,120 L200,160 L350,130 L520,155 L680,125 L850,145 L1020,130 L1180,150 L1320,135 L1440,155 L1440,200 L0,200 Z"
            fill="white"
            filter="url(#abstract-paint-1)"
            opacity="0.95"
          />
          <path
            d="M0,140 L180,110 L380,135 L600,115 L820,130 L1050,120 L1260,135 L1440,125 L1440,200 L0,200 Z"
            fill="white"
            opacity="0.7"
          />
          <path
            d="M0,155 L240,145 L480,160 L720,150 L960,165 L1200,155 L1440,170 L1440,200 L0,200 Z"
            fill="white"
            opacity="0.5"
          />
        </svg>
      </div>

      {/* FILOSOFÍA COMPACTA */}
      <section id="filosofía" className="relative bg-white px-[48px] py-[50px]">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-[1px] bg-[#D4AF37]" />
                <span className="text-[#D4AF37] text-[9px] tracking-[0.4em] font-['DM_Sans'] uppercase">
                  Legado
                </span>
              </div>

              <h2 className="font-['Playfair_Display'] font-bold text-4xl lg:text-5xl text-[#0B0B0B] leading-tight mb-5">
                Barberos, no peluqueros
              </h2>

              <p className="text-lg text-[#0B0B0B]/60 leading-relaxed">
                Desde 1888, dominamos el arte ancestral de la navaja, 
                el corte con tijera y el perfilado milimétrico.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex justify-center lg:justify-end"
            >
              <img
                src={image_1e4fc8c63620d97226934be919f5f40a4bfc65db}
                alt="Navaja"
                className="w-64 h-auto"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* WAVE */}
      <div className="relative h-20 bg-white">
        <svg viewBox="0 0 1440 150" preserveAspectRatio="none" className="w-full h-full bg-[#ffffff00]">
          <defs>
            <filter id="abstract-paint-2" x="-50%" y="-50%" width="200%" height="200%">
              <feTurbulence type="fractalNoise" baseFrequency="0.025 0.015" numOctaves="4" seed="28" />
              <feDisplacementMap in="SourceGraphic" scale="35" />
            </filter>
          </defs>
          <path
            d="M0,90 L150,120 L320,95 L480,115 L640,100 L800,120 L960,105 L1120,125 L1280,110 L1440,120 L1440,150 L0,150 Z"
            fill="#0B0B0B"
            filter="url(#abstract-paint-2)"
            opacity="0.9"
          />
          <path
            d="M0,105 L220,85 L440,100 L660,80 L880,95 L1100,85 L1320,100 L1440,90 L1440,150 L0,150 Z"
            fill="white"
            opacity="0.6"
          />
        </svg>
      </div>

      {/* SERVICIOS - DISEÑO MINIMALISTA RESTRUCTURADO */}
      <section id="servicios" className="relative bg-[#0B0B0B] py-20 lg:py-28 px-6 lg:px-12">
        <div className="max-w-[1200px] mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-center gap-2 mb-4"
            >
              <div className="h-[1px] w-8 bg-[#D4AF37]" />
              <span className="text-[#D4AF37] text-[9px] tracking-[0.5em] font-['DM_Sans'] uppercase">
                Servicios
              </span>
              <div className="h-[1px] w-8 bg-[#D4AF37]" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-['Playfair_Display'] font-bold text-5xl lg:text-6xl text-white mb-4"
            >
              El Arsenal Bárbaro
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-white/50 text-base max-w-2xl mx-auto"
            >
              Técnicas ancestrales perfeccionadas durante 135 años
            </motion.p>
          </div>

          {/* Lista de Servicios - Minimalista */}
          <div className="space-y-6">
            {[
              {
                name: 'El Ritual Bárbaro',
                desc: 'Corte arquitectónico + Afeitado con navaja + Perfilado + Masaje + Productos premium',
                price: '$120k',
                time: '120 min',
                icon: Sparkles,
                featured: true
              },
              {
                name: 'Fade Milimétrico',
                desc: 'Degradado de precisión arquitectónica con técnicas de competencia mundial',
                price: '$40k',
                time: '60 min',
                icon: Award
              },
              {
                name: 'Navaja Artesanal',
                desc: 'Afeitado tradicional con navaja de acero · Toallas japonesas · Aceites importados',
                price: '$30k',
                time: '40 min',
                icon: Crown
              },
              {
                name: 'Corte de Tijera',
                desc: 'Técnica japonesa. Sin máquina. Cada cabello cortado individualmente',
                price: '$35k',
                time: '45 min',
                icon: Scissors
              },
              {
                name: 'Perfilado Quirúrgico',
                desc: 'Líneas perfectas. Ángulos exactos. Precisión de relojero suizo',
                price: '$20k',
                time: '30 min',
                icon: Shield
              },
              {
                name: 'Combo Bárbaro',
                desc: 'Corte de tijera + Afeitado con navaja. La experiencia completa',
                price: '$60k',
                time: '90 min',
                icon: Star,
                bestseller: true
              }
            ].map((service, idx) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className={`group relative border-t border-white/10 pt-6 hover:border-[#D4AF37]/30 transition-all duration-500 ${
                    service.featured ? 'bg-[#D4AF37]/5 -mx-6 px-6 py-8' : ''
                  }`}
                >
                  <div className="grid lg:grid-cols-12 gap-6 items-center">
                    {/* Icono */}
                    

                    {/* Info */}
                    <div className="lg:col-span-7">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-['Playfair_Display'] font-bold text-2xl lg:text-3xl text-white">
                          {service.name}
                        </h3>
                        {service.featured && (
                          <span className="bg-[#D4AF37] text-[#0B0B0B] px-3 py-1 text-[8px] tracking-wider uppercase font-bold">
                            Ritual Completo
                          </span>
                        )}
                        {service.bestseller && (
                          <span className="bg-[#D4AF37] text-[#0B0B0B] px-3 py-1 text-[8px] tracking-wider uppercase font-bold">
                            Bestseller
                          </span>
                        )}
                      </div>
                      <p className="text-white/50 text-sm leading-relaxed">
                        {service.desc}
                      </p>
                    </div>

                    {/* Precio y Tiempo */}
                    <div className="lg:col-span-3 flex lg:justify-end gap-8 items-center">
                      <div>
                        <div className="text-white/30 text-[9px] tracking-wider uppercase mb-1">Precio</div>
                        <div className="font-['Playfair_Display'] text-3xl text-white font-bold">
                          {service.price}
                        </div>
                      </div>
                      <div>
                        <div className="text-white/30 text-[9px] tracking-wider uppercase mb-1">Tiempo</div>
                        <div className="text-white/60 text-lg">
                          {service.time}
                        </div>
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="lg:col-span-1 flex lg:justify-end">
                      <ArrowRight className="w-5 h-5 text-[#D4AF37] opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-500" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Path decorativo blanco */}
        <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none">
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-full">
            <defs>
              <filter id="abstract-paint-servicios" x="-50%" y="-50%" width="200%" height="200%">
                <feTurbulence type="fractalNoise" baseFrequency="0.02 0.01" numOctaves="3" seed="25" />
                <feDisplacementMap in="SourceGraphic" scale="30" />
              </filter>
            </defs>
            <path
              d="M0,55 L200,70 L350,60 L520,75 L680,65 L850,70 L1020,60 L1180,75 L1320,65 L1440,70 L1440,100 L0,100 Z"
              fill="white"
              filter="url(#abstract-paint-servicios)"
              opacity="0.08"
            />
            <path
              d="M0,65 L180,50 L380,60 L600,45 L820,55 L1050,50 L1260,60 L1440,55 L1440,100 L0,100 Z"
              fill="white"
              opacity="0.05"
            />
          </svg>
        </div>
      </section>

      {/* WAVE */}
      

      {/* PROMOCIONES POR DÍA */}
      <section id="membresías" className="relative bg-white py-20 lg:py-28 px-6 lg:px-12 overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-center gap-2 mb-4"
            >
              <div className="h-[1px] w-8 bg-[#D4AF37]" />
              <span className="text-[#D4AF37] text-[9px] tracking-[0.5em] font-['DM_Sans'] uppercase">
                Ofertas Semanales
              </span>
              <div className="h-[1px] w-8 bg-[#D4AF37]" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-['Playfair_Display'] font-bold text-5xl lg:text-6xl text-[#0B0B0B] mb-4"
            >
              Cada Día Es Una Oferta
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-[#0B0B0B]/50 text-base"
            >
              Promociones exclusivas de lunes a viernes + oferta especial semanal
            </motion.p>
          </div>

          {/* Carrusel de Promociones Diarias */}
          <div className="-mx-6 lg:-mx-12 px-[0px] py-[10px]">
            <Slider
              dots={true}
              infinite={true}
              speed={800}
              slidesToShow={3}
              slidesToScroll={1}
              autoplay={true}
              autoplaySpeed={5000}
              pauseOnHover={true}
              arrows={false}
              responsive={[
                {
                  breakpoint: 1280,
                  settings: {
                    slidesToShow: 2,
                  }
                },
                {
                  breakpoint: 768,
                  settings: {
                    slidesToShow: 1,
                    dots: true
                  }
                }
              ]}
            >
              {[
                {
                  day: 'LUNES',
                  title: 'Power Monday',
                  discount: '25%',
                  price: '$45k',
                  originalPrice: '$60k',
                  service: 'Corte + Barba',
                  bgColor: '#1A1A1A',
                  accentColor: '#D4AF37',
                  textColor: '#FFFFFF'
                },
                {
                  day: 'MARTES',
                  title: 'Navaja Tuesday',
                  discount: '30%',
                  price: '$21k',
                  originalPrice: '$30k',
                  service: 'Afeitado Tradicional',
                  bgColor: '#7B1E2A',
                  accentColor: '#C9A84C',
                  textColor: '#FFFFFF'
                },
                {
                  day: 'MIÉRCOLES',
                  title: 'Mid-Week Fresh',
                  discount: '20%',
                  price: '$32k',
                  originalPrice: '$40k',
                  service: 'Fade Milimétrico',
                  bgColor: '#D4AF37',
                  accentColor: '#0B0B0B',
                  textColor: '#0B0B0B'
                },
                {
                  day: 'JUEVES',
                  title: 'Juernes Anticipado',
                  discount: '15%',
                  price: '$51k',
                  originalPrice: '$60k',
                  service: 'Combo Premium',
                  bgColor: '#0B0B0B',
                  accentColor: '#D4AF37',
                  textColor: '#FFFFFF'
                },
                {
                  day: 'VIERNES',
                  title: 'Friday Fresh',
                  discount: '18%',
                  price: '$29k',
                  originalPrice: '$35k',
                  service: 'Perfilado + Barba',
                  bgColor: '#2D2D2D',
                  accentColor: '#C9A84C',
                  textColor: '#FFFFFF'
                },
                {
                  day: 'ESPECIAL',
                  title: 'Oferta Semanal',
                  discount: '35%',
                  price: '$78k',
                  originalPrice: '$120k',
                  service: 'El Ritual Bárbaro',
                  bgColor: '#C9A84C',
                  accentColor: '#0B0B0B',
                  textColor: '#0B0B0B'
                },
              ].map((promo, idx) => {
                return (
                  <div key={idx} className="px-3">
                    <motion.div
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: idx * 0.1,
                        duration: 0.6,
                        ease: "easeOut"
                      }}
                      whileHover={{
                        y: -8,
                        transition: { duration: 0.3 }
                      }}
                      className="relative overflow-hidden h-[420px] group cursor-pointer border border-white/10"
                      style={{ backgroundColor: promo.bgColor }}
                    >
                      {/* Gradiente sutil en hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {/* Contenido */}
                      <div className="relative h-full p-8 flex flex-col justify-between">
                        {/* Header: Día */}
                        <div>
                          <div
                            className="text-[9px] tracking-[0.4em] uppercase mb-3 font-bold"
                            style={{ color: promo.accentColor }}
                          >
                            {promo.day}
                          </div>
                          <h3
                            className="font-['Playfair_Display'] font-bold text-4xl lg:text-5xl leading-none mb-6"
                            style={{ color: promo.textColor }}
                          >
                            {promo.title}
                          </h3>

                          {/* Línea decorativa */}
                          <div
                            className="h-[1px] w-16 mb-8"
                            style={{ backgroundColor: promo.accentColor }}
                          />
                        </div>

                        {/* Servicio */}
                        <div className="mb-8">
                          <div
                            className="font-['Playfair_Display'] text-2xl lg:text-3xl font-bold mb-2"
                            style={{ color: promo.textColor }}
                          >
                            {promo.service}
                          </div>

                          {/* Badge de descuento */}
                          <div
                            className="inline-block px-4 py-2 text-xs font-bold tracking-wider uppercase mt-2"
                            style={{
                              backgroundColor: promo.accentColor,
                              color: promo.bgColor
                            }}
                          >
                            -{promo.discount} OFF
                          </div>
                        </div>

                        {/* Precio */}
                        <div>
                          <div className="flex items-baseline gap-3 mb-6">
                            <div
                              className="font-['Playfair_Display'] text-5xl lg:text-6xl font-bold leading-none"
                              style={{ color: promo.textColor }}
                            >
                              {promo.price}
                            </div>
                            <div
                              className="text-xl line-through"
                              style={{ color: `${promo.textColor}30` }}
                            >
                              {promo.originalPrice}
                            </div>
                          </div>

                          {/* CTA Button */}
                          <motion.button
                            whileHover={{ x: 3 }}
                            className="w-full py-4 font-bold text-[10px] tracking-[0.25em] uppercase flex items-center justify-between px-6 border-2 group/btn transition-all duration-300"
                            style={{
                              borderColor: promo.accentColor,
                              color: promo.textColor
                            }}
                          >
                            <span>Reservar Ahora</span>
                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" style={{ color: promo.accentColor }} />
                          </motion.button>
                        </div>
                      </div>

                      {/* Border en hover */}
                      <div
                        className="absolute inset-0 border-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                        style={{ borderColor: promo.accentColor }}
                      />
                    </motion.div>
                  </div>
                );
              })}
            </Slider>
          </div>

          {/* Nota legal */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12 space-y-2"
          >
            <p className="text-[#0B0B0B]/30 text-xs">
              * Promociones válidas el día indicado · No acumulables con otras ofertas · Sujeto a disponibilidad
            </p>
          </motion.div>
        </div>

        {/* Path decorativo blanco */}
        <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none">
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-full">
            <path
              d="M0,60 L180,40 L360,55 L540,35 L720,50 L900,40 L1080,55 L1260,45 L1440,60 L1440,100 L0,100 Z"
              fill="white"
              opacity="0.05"
            />
          </svg>
        </div>
      </section>

      {/* WAVE */}
      <div className="relative h-20 bg-white">
        <svg viewBox="0 0 1440 150" preserveAspectRatio="none" className="w-full h-full">
          <defs>
            <filter id="abstract-paint-promo" x="-50%" y="-50%" width="200%" height="200%">
              <feTurbulence type="fractalNoise" baseFrequency="0.022 0.015" numOctaves="3" seed="67" />
              <feDisplacementMap in="SourceGraphic" scale="38" />
            </filter>
          </defs>
          <path
            d="M0,100 L150,70 L310,90 L470,65 L630,85 L790,70 L950,80 L1110,65 L1270,75 L1440,70 L1440,150 L0,150 Z"
            fill="#0B0B0B"
            filter="url(#abstract-paint-promo)"
            opacity="0.9"
          />
          <path
            d="M0,115 L200,85 L410,100 L620,80 L830,95 L1040,85 L1250,100 L1440,90 L1440,150 L0,150 Z"
            fill="#0B0B0B"
            opacity="0.6"
          />
          <path
            d="M0,125 L240,110 L480,120 L720,110 L960,125 L1200,115 L1440,125 L1440,150 L0,150 Z"
            fill="#0B0B0B"
            opacity="0.4"
          />
        </svg>
      </div>

      {/* GALERÍA MINIMALISTA - GRID MODERNO */}
      <section id="galería" className="relative bg-[#0B0B0B] py-20 lg:py-28 px-6 lg:px-12">
        <div className="max-w-[1200px] mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-center gap-2 mb-4"
            >
              <div className="h-[1px] w-8 bg-[#D4AF37]" />
              <span className="text-[#D4AF37] text-[9px] tracking-[0.5em] font-['DM_Sans'] uppercase">
                Portfolio
              </span>
              <div className="h-[1px] w-8 bg-[#D4AF37]" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-['Playfair_Display'] font-bold text-5xl lg:text-6xl text-white mb-4"
            >
              Trabajos Destacados
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-white/50 text-base"
            >
              135 años de maestría en cada corte
            </motion.p>
          </div>

          {/* Carrusel Superior - Dirección Normal */}
          <div className="-mx-6 lg:-mx-12 mb-6">
            <Slider
              dots={false}
              infinite={true}
              speed={4000}
              slidesToShow={3.5}
              slidesToScroll={1}
              autoplay={true}
              autoplaySpeed={0}
              cssEase="linear"
              pauseOnHover={true}
              arrows={false}
              responsive={[
                {
                  breakpoint: 1024,
                  settings: {
                    slidesToShow: 2.5,
                  }
                },
                {
                  breakpoint: 640,
                  settings: {
                    slidesToShow: 1.2,
                  }
                }
              ]}
            >
              {[
                { img: 'https://images.unsplash.com/photo-1572663459735-75425e957ab9?w=800', label: 'Corte Clásico' },
                { img: 'https://images.unsplash.com/photo-1759134198561-e2041049419c?w=800', label: 'Fade Preciso' },
                { img: 'https://images.unsplash.com/photo-1775680577260-464167e4e435?w=800', label: 'Barba Esculpida' },
                { img: 'https://images.unsplash.com/photo-1772113207667-5cc45ad9ecec?w=800', label: 'Perfilado Elite' },
                { img: 'https://images.unsplash.com/photo-1651923099196-50b2b4d3c20e?w=800', label: 'Maestría' },
                { img: 'https://images.unsplash.com/photo-1528919485108-e5a73ad4c0e0?w=800', label: 'Ritual Completo' },
                { img: 'https://images.unsplash.com/photo-1759134155377-4207d89b39ec?w=800', label: 'Arte Bárbaro' },
              ].map((item, idx) => (
                <div key={idx} className="px-2">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className="group relative overflow-hidden h-[350px] lg:h-[450px]"
                  >
                    <img
                      src={item.img}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-75"
                      alt={item.label}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B]/90 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Contenido en hover */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <div className="h-[1px] w-12 bg-[#D4AF37] mb-3" />
                      <h3 className="font-['Playfair_Display'] font-bold text-xl text-white">
                        {item.label}
                      </h3>
                    </div>

                    {/* Border en hover */}
                    <div className="absolute inset-0 border-2 border-[#D4AF37]/0 group-hover:border-[#D4AF37]/30 transition-colors duration-500" />
                  </motion.div>
                </div>
              ))}
            </Slider>
          </div>

          {/* Carrusel Inferior - Dirección Inversa */}
          <div className="-mx-6 lg:-mx-12">
            <Slider
              dots={false}
              infinite={true}
              speed={3500}
              slidesToShow={3.5}
              slidesToScroll={1}
              autoplay={true}
              autoplaySpeed={0}
              cssEase="linear"
              pauseOnHover={true}
              arrows={false}
              rtl={true}
              responsive={[
                {
                  breakpoint: 1024,
                  settings: {
                    slidesToShow: 2.5,
                  }
                },
                {
                  breakpoint: 640,
                  settings: {
                    slidesToShow: 1.2,
                  }
                }
              ]}
            >
              {[
                { img: 'https://images.unsplash.com/photo-1528919485108-e5a73ad4c0e0?w=800', label: 'Técnica Pura' },
                { img: 'https://images.unsplash.com/photo-1759134155377-4207d89b39ec?w=800', label: 'Estilo Único' },
                { img: 'https://images.unsplash.com/photo-1572663459735-75425e957ab9?w=800', label: 'Tradición' },
                { img: 'https://images.unsplash.com/photo-1775680577260-464167e4e435?w=800', label: 'Precisión' },
                { img: 'https://images.unsplash.com/photo-1772113207667-5cc45ad9ecec?w=800', label: 'Detalle' },
                { img: 'https://images.unsplash.com/photo-1651923099196-50b2b4d3c20e?w=800', label: 'Excelencia' },
                { img: 'https://images.unsplash.com/photo-1759134198561-e2041049419c?w=800', label: 'Perfección' },
              ].map((item, idx) => (
                <div key={idx} className="px-2">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className="group relative overflow-hidden h-[350px] lg:h-[450px]"
                  >
                    <img
                      src={item.img}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-75"
                      alt={item.label}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B]/90 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Contenido en hover */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <div className="h-[1px] w-12 bg-[#D4AF37] mb-3" />
                      <h3 className="font-['Playfair_Display'] font-bold text-xl text-white">
                        {item.label}
                      </h3>
                    </div>

                    {/* Border en hover */}
                    <div className="absolute inset-0 border-2 border-[#D4AF37]/0 group-hover:border-[#D4AF37]/30 transition-colors duration-500" />
                  </motion.div>
                </div>
              ))}
            </Slider>
          </div>

          {/* Instagram CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <a
              href="https://instagram.com/barbarosclub.1888"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-[#D4AF37] text-sm tracking-wider hover:gap-4 transition-all"
            >
              <Instagram className="w-5 h-5" />
              @barbarosclub.1888
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* UBICACIÓN MINIMALISTA */}
      <section id="ubicación" className="relative py-20 lg:py-28 px-6 lg:px-12 bg-[#1A1A1A]">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-[1px] bg-[#D4AF37]" />
                <span className="text-[#D4AF37] text-[9px] tracking-[0.4em] font-['DM_Sans'] uppercase">
                  Visítanos
                </span>
              </div>
              <h2 className="font-['Playfair_Display'] font-bold text-4xl lg:text-5xl text-white mb-6">
                El Sanctuario
              </h2>

              <div className="space-y-6 mb-8">
                {[
                  { icon: MapPin, label: 'Dirección', value: 'Calle Principal #123, Puerto Colombia' },
                  { icon: Phone, label: 'WhatsApp', value: '+57 300 123 4567' },
                  { icon: Clock, label: 'Horario', value: 'Lun - Sáb: 9AM - 8PM' },
                  { icon: Instagram, label: 'Instagram', value: '@barbarosclub.1888' }
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex gap-4"
                    >
                      <div className="w-10 h-10 bg-[#D4AF37] flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-[#0B0B0B]" />
                      </div>
                      <div>
                        <div className="text-[#D4AF37] text-[9px] tracking-wider uppercase mb-1">{item.label}</div>
                        <div className="text-white text-sm">{item.value}</div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <motion.a
                href="#servicios"
                whileHover={{ x: 5 }}
                className="inline-flex items-center gap-3 bg-[#D4AF37] text-[#0B0B0B] px-8 py-3 font-bold text-xs tracking-wider uppercase"
              >
                <Calendar className="w-4 h-4" />
                Reservar Cita
                <ArrowRight className="w-4 h-4" />
              </motion.a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-[400px] overflow-hidden"
            >
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800"
                alt="Ubicación"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[#D4AF37]/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-[#D4AF37] text-[#0B0B0B] px-6 py-4 text-center">
                  <MapPin className="w-8 h-8 mx-auto mb-2" />
                  <p className="font-bold text-sm">BÁRBAROS CLUB</p>
                  <p className="text-xs">Puerto Colombia</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FOOTER MINIMALISTA */}
      <footer className="bg-[#0B0B0B] text-white py-16 px-6 lg:px-12">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid lg:grid-cols-4 gap-12 mb-12">
            <div className="lg:col-span-2">
              <div className="mb-4">
                <h3 className="font-['Playfair_Display'] font-bold text-2xl mb-1">
                  {APP_BRAND.name}
                </h3>
                <div className="flex items-center gap-2">
                  <div className="h-[1px] w-8 bg-[#D4AF37]" />
                  <span className="text-[#D4AF37] text-[8px] tracking-[0.3em]">{APP_BRAND.foundationLabel}</span>
                </div>
              </div>
              <p className="text-white/50 text-sm mb-6 max-w-sm">
                Barbería clásica en Puerto Colombia. 135 años de tradición.
              </p>
              <a
                href="https://instagram.com/barbarosclub.1888"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white/60 hover:text-[#D4AF37] transition-colors text-sm"
              >
                <Instagram className="w-4 h-4" />
                @barbarosclub.1888
              </a>
            </div>

            <div>
              <h4 className="font-bold text-sm mb-4 tracking-wider uppercase">Enlaces</h4>
              <ul className="space-y-2 text-sm">
                {footerNav.map((link) => (
                  <li key={link}>
                    <a
                      href={`#${getSectionId(link)}`}
                      className="text-white/50 hover:text-[#D4AF37] transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-sm mb-4 tracking-wider uppercase">Contacto</h4>
              <ul className="space-y-2 text-sm text-white/50">
                <li>Puerto Colombia</li>
                <li>+57 300 123 4567</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-white/30 text-xs">
              &copy; 2026 {APP_BRAND.name} 1888. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}