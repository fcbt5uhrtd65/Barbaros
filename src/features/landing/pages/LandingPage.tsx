import image_1e4fc8c63620d97226934be919f5f40a4bfc65db from 'figma:asset/1e4fc8c63620d97226934be919f5f40a4bfc65db.png'
import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import {
  Scissors, Star, Instagram, MapPin, Phone, Clock, Menu, X,
  ArrowRight, Award, Crown, Shield, Sparkles, Calendar, Check, Zap, ChevronDown, FileDown
} from 'lucide-react';
import heroSlideOne from '@/assets/1.jpg';
import heroSlideTwo from '@/assets/2.jpg';
import heroSlideThree from '@/assets/3.jpg';
import contactImage from '@/assets/2.jpg';
import Slider from 'react-slick';
import {
  desktopLeftNav,
  desktopRightNav,
  footerNav,
  getSectionId,
  mobileNav,
} from '@/features/landing/config/navigation';
import { APP_BRAND } from '@/shared/config/app.constants';

const HERO_SLIDES = [heroSlideOne, heroSlideTwo, heroSlideThree];

const SERVICES_CATALOG = [
  {
    name: 'El Ritual Bárbaro',
    desc: 'Corte arquitectónico + Afeitado con navaja + Perfilado + Masaje + Productos premium.',
    price: '$120k',
    time: '120 min',
    icon: Sparkles,
    image: heroSlideOne,
    featured: true,
  },
  {
    name: 'Fade Milimétrico',
    desc: 'Degradado de precisión arquitectónica con técnicas de competencia mundial.',
    price: '$40k',
    time: '60 min',
    icon: Award,
    image: heroSlideTwo,
  },
  {
    name: 'Navaja Artesanal',
    desc: 'Afeitado tradicional con navaja de acero, toallas japonesas y aceites importados.',
    price: '$30k',
    time: '40 min',
    icon: Crown,
    image: heroSlideThree,
  },
  {
    name: 'Corte de Tijera',
    desc: 'Técnica japonesa sin máquina. Cada cabello cortado de forma individual.',
    price: '$35k',
    time: '45 min',
    icon: Scissors,
    image: heroSlideOne,
  },
  {
    name: 'Perfilado Quirúrgico',
    desc: 'Líneas perfectas y ángulos exactos con precisión de relojero suizo.',
    price: '$20k',
    time: '30 min',
    icon: Shield,
    image: heroSlideTwo,
  },
  {
    name: 'Combo Bárbaro',
    desc: 'Corte de tijera + afeitado con navaja para una experiencia completa.',
    price: '$60k',
    time: '90 min',
    icon: Star,
    image: heroSlideThree,
    bestseller: true,
  },
];

const PROMO_VALIDITY_BY_DAY: Record<string, string> = {
  LUNES: 'Válido solo lunes · 9AM a 8PM',
  MARTES: 'Válido solo martes · 9AM a 8PM',
  'MIÉRCOLES': 'Válido solo miércoles · 9AM a 8PM',
  JUEVES: 'Válido solo jueves · 9AM a 8PM',
  VIERNES: 'Válido solo viernes · 9AM a 8PM',
  ESPECIAL: 'Válido toda la semana · Cupos limitados',
};

function getVoucherSerial(day: string, idx: number) {
  const prefix = day.replace('É', 'E').slice(0, 3);
  return `${prefix}-${String(1888 + idx * 23).padStart(4, '0')}-${String((idx + 1) * 19).padStart(3, '0')}`;
}

function getVoucherQrUrl(serial: string) {
  const data = encodeURIComponent(`https://wa.me/573001234567?text=Quiero canjear el voucher ${serial}`);
  return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${data}`;
}

export function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();

  const heroScale = useTransform(scrollYProgress, [0, 0.25], [1, 1.1]);

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

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveHeroSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, []);

  const imageToDataUrl = (src: string) =>
    new Promise<string>((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('No se pudo crear contexto de canvas'));
          return;
        }

        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', 0.86));
      };
      img.onerror = () => reject(new Error('No se pudo cargar la imagen del catálogo'));
      img.src = src;
    });

  const downloadCatalogPdf = async () => {
    const { jsPDF } = await import('jspdf');
    const pdf = new jsPDF({ unit: 'mm', format: 'a4' });

    // Portada
    pdf.setFillColor(11, 11, 11);
    pdf.rect(0, 0, 210, 297, 'F');
    
    // Línea decorativa
    pdf.setDrawColor(212, 175, 55);
    pdf.setLineWidth(0.5);
    pdf.line(16, 60, 194, 60);
    
    // Título principal
    pdf.setTextColor(212, 175, 55);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(28);
    pdf.text('BARBAROS', 105, 85, { align: 'center' });
    
    // Subtítulo
    pdf.setFontSize(11);
    pdf.setTextColor(255, 255, 255);
    pdf.text('CATÁLOGO DE SERVICIOS PREMIUM', 105, 100, { align: 'center' });
    pdf.text('Desde 1888 | Excelencia en Barbería', 105, 108, { align: 'center' });
    
    // Línea decorativa inferior
    pdf.setDrawColor(212, 175, 55);
    pdf.line(16, 120, 194, 120);
    
    // Descripción
    pdf.setFontSize(10);
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'normal');
    const coverText = pdf.splitTextToSize(
      'Cada servicio es una experiencia única donde la pasión por la barbería se une con la precisión artesanal. Nuestros barberos son maestros en el arte ancestral de la navaja y el corte milimétrico.',
      160
    );
    pdf.text(coverText, 105, 145, { align: 'center' });

    // Servicios
    for (let i = 0; i < SERVICES_CATALOG.length; i += 1) {
      const service = SERVICES_CATALOG[i];
      pdf.addPage();
      pdf.setFillColor(11, 11, 11);
      pdf.rect(0, 0, 210, 297, 'F');
      
      // Número de página y servicio
      pdf.setTextColor(212, 175, 55);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9);
      pdf.text(`SERVICIO ${i + 1} / ${SERVICES_CATALOG.length}`, 16, 12);
      
      // Línea decorativa
      pdf.setDrawColor(212, 175, 55);
      pdf.setLineWidth(0.3);
      pdf.line(16, 15, 194, 15);
      
      // Imagen
      const imgData = await imageToDataUrl(service.image);
      pdf.addImage(imgData, 'JPEG', 35, 25, 140, 90, undefined, 'FAST');
      
      // Nombre del servicio
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(20);
      pdf.text(service.name, 105, 130, { align: 'center' });
      
      // Separador
      pdf.setDrawColor(212, 175, 55);
      pdf.setLineWidth(0.2);
      pdf.line(40, 135, 170, 135);
      
      // Descripción
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.setTextColor(200, 200, 200);
      const description = pdf.splitTextToSize(service.desc, 160);
      pdf.text(description, 105, 145, { align: 'center', maxWidth: 160 });
      
      // Sección de detalles
      const detailsY = 195;
      pdf.setDrawColor(212, 175, 55);
      pdf.line(16, detailsY - 5, 194, detailsY - 5);
      
      // Precio
      pdf.setTextColor(212, 175, 55);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('PRECIO', 35, detailsY);
      pdf.setFontSize(16);
      pdf.text(service.price, 35, detailsY + 8);
      
      // Duración
      pdf.setTextColor(212, 175, 55);
      pdf.setFontSize(12);
      pdf.text('DURACIÓN', 105, detailsY);
      pdf.setFontSize(16);
      pdf.text(service.time, 105, detailsY + 8);
      
      // Insignia de destacado
      if (service.featured || service.bestseller) {
        pdf.setFillColor(212, 175, 55);
        pdf.rect(145, detailsY - 2, 50, 18, 'F');
        pdf.setTextColor(11, 11, 11);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(10);
        pdf.text(
          service.featured ? 'DESTACADO' : 'BESTSELLER',
          170,
          detailsY + 5,
          { align: 'center' }
        );
      }
      
      // Footer
      pdf.setTextColor(212, 175, 55);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.text('BARBAROS | Excelencia Barbería desde 1888', 105, 285, { align: 'center' });
    }

    pdf.save('catalogo-servicios-barbaros.pdf');
  };

  return (
    <div className="landing-minimal min-h-screen bg-white text-[#0B0B0B] overflow-x-hidden font-['Manrope']">
      {/* BOTÓN WHATSAPP FLOTANTE */}
      <motion.a
        href="https://wa.me/573001234567"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        whileHover={{ scale: 1.1 }}
        className="fixed bottom-8 right-8 z-30 bg-[#25D366] text-white p-4 rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
        style={{ backdropFilter: 'blur(10px)' }}
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.411-2.391-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.946 1.23l-.355.192-.368-.06c-1.286-.113-2.430-.511-3.428-1.218l-.744-.524-.816.823c-.248.25-.637.675-.637 1.694 0 1.289.465 2.575 1.282 3.603l.42.485-.5.328c-.961.624-1.657 1.462-2.081 2.48l-.27.692.691.423c2.669 1.635 5.812 2.586 9.012 2.586 4.677 0 9.012-1.901 12.117-5.354.31-.324.607-.67.886-1.032.138-.181.27-.365.39-.551l.386-.617-.557-.363c-.368-.237-.888-.601-1.436-1.093-.48-.433-.99-.91-1.524-1.425-.534-.515-1.037-.948-1.513-1.3l-.493-.377z"/>
        </svg>
      </motion.a>

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
        <div className="max-w-[1360px] mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo Centrado */}
            <motion.a
              href="#inicio"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center z-50"
            >
              <h1 className="font-['Unbounded'] font-bold text-xl lg:text-2xl text-white tracking-tight uppercase">
                {APP_BRAND.name}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-[1px] w-6 bg-[#D4AF37]" />
                <span className="text-[#D4AF37] text-[8px] tracking-[0.4em] font-['Manrope'] uppercase">
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
                  className="text-white/70 hover:text-[#D4AF37] transition-colors text-[10px] tracking-[0.2em] font-['Manrope'] uppercase font-medium"
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
                  className="text-white/70 hover:text-[#D4AF37] transition-colors text-[10px] tracking-[0.2em] font-['Manrope'] uppercase font-medium"
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
          {HERO_SLIDES.map((slide, index) => (
            <motion.img
              key={`${slide}-${index}`}
              src={slide}
              alt="Barber hero background"
              className="absolute inset-0 w-full h-full object-cover"
              initial={false}
              animate={{
                opacity: index === activeHeroSlide ? 1 : 0,
                scale: index === activeHeroSlide ? 1.02 : 1.1,
              }}
              transition={{
                opacity: { duration: 1.1, ease: 'easeInOut' },
                scale: { duration: 5.5, ease: 'linear' },
              }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/55 to-black/70" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_55%)]" />
        </motion.div>

        <div className="relative z-10 min-h-screen w-full px-4 lg:px-8 flex items-center justify-center">
          <div className="w-full max-w-3xl text-center pt-20 lg:pt-24">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="mb-5"
            >
              <span className="text-white/85 text-[11px] tracking-[0.42em] font-['Manrope'] uppercase font-semibold">
                Stay Sharp, Look Good
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.95, delay: 0.35 }}
              className="font-['Unbounded'] font-bold text-3xl sm:text-4xl lg:text-6xl text-white uppercase leading-[1] tracking-tight mb-6"
            >
              NYC'S Favourite
              <span className="block">Barber Shop.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.65 }}
              className="text-white/80 text-[10px] sm:text-xs tracking-[0.24em] uppercase mb-6 font-['Manrope']"
            >
              Broadway St, NYC. Appointment | 855 100 4444
            </motion.p>

            {/* Stats de Credibilidad */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.75 }}
              className="flex items-center justify-center gap-8 mb-8 text-white/70 text-[9px] tracking-wider"
            >
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"/>
                <span>Desde 1888</span>
              </div>
              <div className="w-[1px] h-4 bg-white/20"/>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"/>
                <span>+10K satisfechos</span>
              </div>
              <div className="w-[1px] h-4 bg-white/20"/>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"/>
                <span>Garantía 100%</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.85 }}
              className="flex justify-center"
            >
              <motion.a
                href="#ubicación"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white text-[#0B0B0B] px-8 py-3.5 font-['Manrope'] font-bold text-[11px] tracking-[0.16em] uppercase inline-flex items-center justify-center hover:bg-[#F3F3F3] transition-colors duration-300 shadow-[0_12px_35px_rgba(0,0,0,0.28)]"
              >
                Book Appointment
              </motion.a>
            </motion.div>
          </div>
        </div>

        <motion.a
          href="#servicios"
          aria-label="Ir a servicios"
          className="absolute left-1/2 -translate-x-1/2 bottom-10 z-20 w-11 h-11 rounded-full border border-white/45 text-white flex items-center justify-center backdrop-blur-sm bg-black/20"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.a>

        <div className="absolute left-1/2 -translate-x-1/2 bottom-4 z-20 flex items-center gap-2">
          {HERO_SLIDES.map((_, index) => (
            <span
              key={index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === activeHeroSlide ? 'w-8 bg-white' : 'w-3 bg-white/45'
              }`}
            />
          ))}
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

      {/* FILOSOFÍA MINIMALISTA CREATIVA */}
      <section id="filosofía" className="relative bg-white px-4 lg:px-12 py-20 lg:py-28 overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8 lg:gap-20 items-center">
            {/* Contenido Izquierdo - Minimalista */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              className="space-y-6 lg:space-y-8"
            >
              {/* Pequeña etiqueta */}
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="inline-block text-[#D4AF37] text-[9px] tracking-[0.6em] font-['Manrope'] font-bold uppercase"
              >
                1888
              </motion.span>

              {/* Título Ultra Bold */}
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="font-['Unbounded'] font-black text-5xl sm:text-6xl lg:text-8xl leading-[0.9] text-[#0B0B0B] uppercase tracking-tighter"
              >
                Barberos<br />
                <motion.span
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.4 }}
                  className="text-[#D4AF37]"
                >
                  No<br />Peluqueros
                </motion.span>
              </motion.h2>

              {/* Descripción Minimalista */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="text-base lg:text-lg text-[#0B0B0B]/60 leading-relaxed font-['Manrope'] max-w-md"
              >
                Dominamos el arte ancestral de la navaja, el corte milimétrico y la precisión artesanal. Cada barba es un masterpiece.
              </motion.p>

              {/* CTA Simple */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.6 }}
              >
                <motion.a
                  href="#servicios"
                  whileHover={{ x: 8 }}
                  className="inline-flex items-center gap-3 text-sm tracking-wider uppercase font-bold text-[#0B0B0B] group"
                >
                  Ver Catálogo Completo
                  <motion.div
                    initial={{ x: 0 }}
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </motion.a>
              </motion.div>
            </motion.div>

            {/* Imagen PNG - Limpia sin fondos */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.3 }}
              className="relative flex items-center justify-center"
            >
              {/* Decoración minimalista detrás */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-[#D4AF37]/8 blur-3xl"
              />
              
              {/* Imagen limpia */}
              <motion.img
                src={image_1e4fc8c63620d97226934be919f5f40a4bfc65db}
                alt="Navaja Artesanal"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.3 }}
                className="relative z-10 w-full max-w-md h-auto drop-shadow-[0_40px_80px_rgba(0,0,0,0.15)]"
              />
              
              {/* Línea decorativa lateral */}
              <motion.div
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="absolute -left-12 top-1/2 -translate-y-1/2 w-1 h-40 bg-gradient-to-b from-transparent via-[#D4AF37] to-transparent origin-center"
              />
            </motion.div>
          </div>

          {/* Línea decorativa inferior */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-16 lg:mt-20 h-[1px] w-32 bg-gradient-to-r from-[#D4AF37] to-transparent origin-left"
          />
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

      {/* SECCIÓN DIFERENCIADORA */}
      <section className="relative bg-[#0B0B0B] py-12 lg:py-16 px-4 lg:px-8">
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid lg:grid-cols-3 gap-8"
          >
            {/* Por Qué Nosotros */}
            <div className="border border-[#D4AF37]/30 rounded-lg p-8 hover:border-[#D4AF37]/70 transition-colors">
              <h3 className="font-['Unbounded'] font-bold text-xl text-[#D4AF37] mb-3 uppercase tracking-tight">Experiencia</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                135 años de dominio en el arte ancestral de la barbería. Maestría en cada corte.
              </p>
            </div>
            <div className="border border-[#D4AF37]/30 rounded-lg p-8 hover:border-[#D4AF37]/70 transition-colors">
              <h3 className="font-['Unbounded'] font-bold text-xl text-[#D4AF37] mb-3 uppercase tracking-tight">Calidad Premium</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Productos importados y técnicas de competencia mundial. Precisión milimétrica garantizada.
              </p>
            </div>
            <div className="border border-[#D4AF37]/30 rounded-lg p-8 hover:border-[#D4AF37]/70 transition-colors">
              <h3 className="font-['Unbounded'] font-bold text-xl text-[#D4AF37] mb-3 uppercase tracking-tight">Satisfacción 100%</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Si no quedas satisfecho, lo remediamos sin costo. Tu confianza es nuestro compromiso.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SERVICIOS - DISEÑO MINIMALISTA RESTRUCTURADO */}
      <section id="servicios" className="relative bg-[#0B0B0B] py-14 lg:py-20 px-4 lg:px-8">
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
              className="font-['Unbounded'] font-semibold text-4xl lg:text-5xl text-white mb-4 uppercase tracking-tight"
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

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                onClick={downloadCatalogPdf}
                whileHover={{ y: -2 }}
                className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/70 px-5 py-2.5 text-[11px] font-bold tracking-[0.14em] uppercase text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors"
              >
                <FileDown className="w-4 h-4" />
                Catálogo PDF
              </motion.button>
              <motion.a
                href="https://wa.me/573001234567"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-2 rounded-full bg-[#D4AF37] px-6 py-2.5 text-[11px] font-bold tracking-[0.14em] uppercase text-[#0B0B0B] hover:bg-[#C9A84C] transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.411-2.391-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.946 1.23l-.355.192-.368-.06c-1.286-.113-2.430-.511-3.428-1.218l-.744-.524-.816.823c-.248.25-.637.675-.637 1.694 0 1.289.465 2.575 1.282 3.603l.42.485-.5.328c-.961.624-1.657 1.462-2.081 2.48l-.27.692.691.423c2.669 1.635 5.812 2.586 9.012 2.586 4.677 0 9.012-1.901 12.117-5.354.31-.324.607-.67.886-1.032.138-.181.27-.365.39-.551l.386-.617-.557-.363c-.368-.237-.888-.601-1.436-1.093-.48-.433-.99-.91-1.524-1.425-.534-.515-1.037-.948-1.513-1.3l-.493-.377z"/>
                </svg>
                Agendar Cita
              </motion.a>
            </div>
          </div>

          {/* Lista de Servicios - Minimalista */}
          <div className="space-y-6">
            {SERVICES_CATALOG.map((service, idx) => {
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className={`group relative border-t border-white/10 pt-6 hover:border-[#D4AF37]/30 transition-all duration-500 ${
                    service.featured ? 'bg-[#D4AF37]/5 -mx-4 lg:-mx-5 px-4 lg:px-5 py-6' : ''
                  }`}
                >
                  <div className="grid lg:grid-cols-12 gap-6 items-center">
                    {/* Info */}
                    <div className="lg:col-span-7">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="font-['Unbounded'] font-semibold text-xl lg:text-2xl text-white uppercase tracking-tight">
                          {service.name}
                        </h3>
                        {service.featured && (
                          <span className="bg-[#D4AF37] text-[#0B0B0B] px-3 py-1 text-[8px] tracking-wider uppercase font-bold">
                            ⭐ Recomendado
                          </span>
                        )}
                        {service.bestseller && (
                          <span className="bg-[#D4AF37] text-[#0B0B0B] px-3 py-1 text-[8px] tracking-wider uppercase font-bold">
                            🏆 Top Ventas
                          </span>
                        )}
                      </div>
                      <p className="text-white/50 text-sm leading-relaxed">
                        {service.desc}
                      </p>
                    </div>

                    {/* Precio y Tiempo */}
                    <div className="lg:col-span-4 flex lg:justify-end gap-8 items-center">
                      <div>
                        <div className="text-white/30 text-[9px] tracking-wider uppercase mb-1">Precio</div>
                        <div className="font-['Unbounded'] text-2xl text-white font-bold tracking-tight">
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

                    {/* CTA Button */}
                    <div className="lg:col-span-1 hidden lg:flex lg:justify-end">
                      <motion.a
                        href="https://wa.me/573001234567"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        className="text-[10px] font-bold tracking-wider uppercase px-4 py-2 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded transition-colors"
                      >
                        Agendar
                      </motion.a>
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
      <section id="membresías" className="relative bg-white py-14 lg:py-20 px-4 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-10 w-80 h-80 rounded-full bg-[#D4AF37]/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-10 w-72 h-72 rounded-full bg-[#0B0B0B]/6 blur-3xl" />
        </div>
        <div className="max-w-[1280px] mx-auto">
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
              className="font-['Unbounded'] font-semibold text-4xl lg:text-5xl text-[#0B0B0B] mb-4 uppercase tracking-tight"
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
          <div className="-mx-2 lg:mx-0 px-0 py-2 bg-transparent">
            <Slider
              dots={true}
              infinite={true}
              speed={800}
              slidesToShow={2}
              slidesToScroll={1}
              autoplay={true}
              autoplaySpeed={5000}
              pauseOnHover={true}
              arrows={false}
              responsive={[
                {
                  breakpoint: 1280,
                  settings: {
                    slidesToShow: 1.5,
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
                const voucherSerial = getVoucherSerial(promo.day, idx);
                const voucherValidity = PROMO_VALIDITY_BY_DAY[promo.day] ?? 'Válido por tiempo limitado';
                const qrUrl = getVoucherQrUrl(voucherSerial);

                return (
                  <div key={idx} className="px-2">
                    <motion.div
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: idx * 0.1,
                        duration: 0.6,
                        ease: "easeOut"
                      }}
                      whileHover={{ y: -4, transition: { duration: 0.25 } }}
                      className="coupon-card relative overflow-hidden h-[335px] lg:h-[355px] group cursor-pointer rounded-[24px]"
                      style={{ backgroundColor: promo.bgColor }}
                    >
                      <div className="coupon-card__grain" />
                      <div className="coupon-card__notch coupon-card__notch--left" />
                      <div className="coupon-card__notch coupon-card__notch--right" />
                      <div className="coupon-card__dash coupon-card__dash--top" />
                      <div className="coupon-card__dash coupon-card__dash--bottom" />

                      <motion.div
                        className="absolute top-0 left-[-35%] h-full w-[30%] blur-2xl opacity-20"
                        style={{ background: `linear-gradient(90deg, transparent, ${promo.accentColor}, transparent)` }}
                        animate={{ x: ['0%', '480%'] }}
                        transition={{ duration: 5.6 + idx * 0.35, repeat: Infinity, ease: "linear" }}
                      />

                      <div className="relative z-10 h-full grid grid-rows-[1fr_78px]">
                        <div className="grid grid-cols-[74px_1fr] min-h-0">
                          <div className="coupon-card__stub flex items-center justify-center" style={{ borderColor: `${promo.accentColor}70` }}>
                            <p
                              className="font-['Manrope'] text-[10px] tracking-[0.24em] uppercase font-bold"
                              style={{ color: promo.accentColor, writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                            >
                              Discount Coupon
                            </p>
                          </div>

                          <div className="relative p-4 lg:p-5">
                            <div className="flex items-start justify-between gap-2 mb-3">
                              <div>
                                <p className="font-['Manrope'] text-[9px] tracking-[0.35em] uppercase font-bold mb-1" style={{ color: promo.accentColor }}>
                                  {promo.day}
                                </p>
                                <h3 className="font-['Unbounded'] font-semibold text-[20px] lg:text-[23px] leading-[1] uppercase tracking-tight" style={{ color: promo.textColor }}>
                                  {promo.title}
                                </h3>
                              </div>
                              <div className="px-3 py-1 text-[10px] font-bold tracking-[0.15em] uppercase border" style={{ borderColor: `${promo.accentColor}90`, color: promo.accentColor }}>
                                -{promo.discount}
                              </div>
                            </div>

                            <div className="border border-dashed p-3.5" style={{ borderColor: `${promo.accentColor}70` }}>
                              <div className="grid grid-cols-[1fr_96px] gap-3 items-end">
                                <div>
                                  <p className="font-['Unbounded'] text-lg lg:text-xl font-semibold leading-tight mb-1 uppercase tracking-tight" style={{ color: promo.textColor }}>
                                    {promo.service}
                                  </p>

                                  <div className="flex items-baseline gap-2 mb-2">
                                    <span className="font-['Unbounded'] text-[30px] lg:text-[34px] leading-none font-bold tracking-tight" style={{ color: promo.textColor }}>
                                      {promo.price}
                                    </span>
                                    <span className="text-base lg:text-lg line-through" style={{ color: `${promo.textColor}80` }}>
                                      {promo.originalPrice}
                                    </span>
                                  </div>

                                  <div className="flex items-center justify-between gap-2 mb-3">
                                    <p className="font-['Manrope'] text-[10px] tracking-[0.14em] uppercase" style={{ color: `${promo.textColor}D0` }}>
                                      {voucherValidity}
                                    </p>
                                    <p className="font-['Manrope'] text-[9px] tracking-[0.18em] uppercase" style={{ color: promo.accentColor }}>
                                      {voucherSerial}
                                    </p>
                                  </div>

                                  <motion.button
                                    whileHover={{ x: 4 }}
                                    className="relative w-full py-2.5 font-bold text-[10px] tracking-[0.18em] uppercase flex items-center justify-between px-4 border-2 transition-all duration-300 overflow-hidden"
                                    style={{
                                      borderColor: promo.accentColor,
                                      color: promo.textColor,
                                      backgroundColor: `${promo.bgColor}B3`
                                    }}
                                  >
                                    <span>Canjear Voucher</span>
                                    <ArrowRight className="w-4 h-4" style={{ color: promo.accentColor }} />
                                  </motion.button>
                                </div>

                                <div className="w-[96px] h-[96px] rounded-lg p-2 bg-[#F5ECD0] shadow-[0_10px_22px_rgba(0,0,0,0.25)]">
                                  <img src={qrUrl} alt={`QR ${voucherSerial}`} className="w-full h-full object-cover rounded-sm" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="coupon-card__footer flex items-center justify-center px-4 lg:px-5" style={{ borderColor: `${promo.accentColor}50` }}>
                          <p className="font-['Manrope'] text-[10px] tracking-[0.18em] uppercase" style={{ color: `${promo.accentColor}D4` }}>
                            Escanea el QR para canjear en línea
                          </p>
                        </div>
                      </div>
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
      <section id="galería" className="relative bg-[#0B0B0B] py-12 lg:py-16 px-4 lg:px-8">
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
              className="font-['Unbounded'] font-semibold text-4xl lg:text-5xl text-white mb-4 uppercase tracking-tight"
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
              slidesToShow={4.2}
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
                    slidesToShow: 3,
                  }
                },
                {
                  breakpoint: 640,
                  settings: {
                    slidesToShow: 1.6,
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
                    className="group relative overflow-hidden h-[250px] lg:h-[320px]"
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
                      <h3 className="font-['Unbounded'] font-semibold text-lg text-white uppercase tracking-tight">
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
              slidesToShow={4.2}
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
                    slidesToShow: 3,
                  }
                },
                {
                  breakpoint: 640,
                  settings: {
                    slidesToShow: 1.6,
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
                    className="group relative overflow-hidden h-[250px] lg:h-[320px]"
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
                      <h3 className="font-['Unbounded'] font-semibold text-lg text-white uppercase tracking-tight">
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

      {/* SECCIÓN DE CONTACTO CON IMAGEN */}
      <section className="relative w-full bg-white py-0 px-0">
        <div className="w-full h-[720px]">
          <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-0 items-stretch h-full">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col justify-center bg-white p-8 lg:pl-16 lg:pr-8 lg:py-16"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-[1px] bg-[#D4AF37]" />
                <span className="text-[#D4AF37] text-[9px] tracking-[0.4em] font-['DM_Sans'] uppercase">
                  Contacto
                </span>
              </div>
              <h2 className="font-['Unbounded'] font-semibold text-3xl lg:text-4xl text-[#0B0B0B] mb-6 uppercase tracking-tight">
                Conéctate Con Nosotros
              </h2>
              <p className="text-[#0B0B0B]/70 text-lg mb-8">
                Estamos aquí para ayudarte con cualquier duda o para agendar tu próxima cita en BÁRBAROS.
              </p>
              <motion.a
                href="https://wa.me/573001234567"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ x: 5 }}
                className="inline-flex items-center gap-3 bg-[#D4AF37] text-[#0B0B0B] px-8 py-3 font-bold text-xs tracking-wider uppercase w-fit"
              >
                WhatsApp
                <ArrowRight className="w-4 h-4" />
              </motion.a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative w-full h-full overflow-visible flex items-center justify-center lg:-ml-12"
            >
              <img
                src={contactImage}
                alt="Contacto"
                className="w-[108%] h-[108%] max-w-none object-contain"
              />
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
                <h3 className="font-['Unbounded'] font-semibold text-xl mb-1 uppercase tracking-tight">
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