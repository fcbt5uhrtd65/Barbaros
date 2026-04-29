import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, AnimatePresence } from 'motion/react';
import {
  Scissors, Star, Instagram, Menu, X,
  ArrowRight, Award, Crown, Shield, Sparkles, ChevronDown, FileDown,
  BadgeCheck, Gem, Wand2, Trophy
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

const PROMOS = [
  {
    day: "Lunes",
    title: "Power Monday",
    subtitle: "Corte + Barba con precisión de estudio.",
    price: "$45k",
    original: "$60k",
    theme: "bg-[#0B0B0B] text-white border border-[#D4AF37]/20",
    position: "left-0 top-1/2 -translate-y-1/2 z-30",
    width: 400,
    rotate: -1,
    float: -6,
    duration: 6,
    featured: true,
  },
  {
    day: "Martes",
    title: "Navaja Ritual",
    subtitle: "Afeitado clásico con toalla caliente.",
    price: "$28k",
    original: "$40k",
    theme: "bg-[#111] text-white",
    position: "top-[20px] left-[300px] z-20",
    width: 270,
    rotate: -4,
    float: -10,
    duration: 7,
    featured: false,
  },
  {
    day: "Miércoles",
    title: "Fade Precision",
    subtitle: "Degradados de competencia.",
    price: "$32k",
    original: "$40k",
    theme: "bg-[#151515] text-white",
    position: "bottom-[20px] left-[260px] z-10",
    width: 250,
    rotate: 6,
    float: 8,
    duration: 8,
    featured: false,
  },
  {
    day: "Jueves",
    title: "Combo Pro",
    subtitle: "Corte + diseño de cejas.",
    price: "$38k",
    original: "$50k",
    theme: "bg-[#1A1A1A] text-white",
    position: "top-[80px] left-[100px] z-0",
    width: 220,
    rotate: 8,
    float: -12,
    duration: 9,
    featured: false,
  },
  {
    day: "Viernes",
    title: "Friday Sharp",
    subtitle: "Listo para el fin de semana.",
    price: "$42k",
    original: "$55k",
    theme: "bg-[#0F0F0F] text-white",
    position: "bottom-[80px] left-[80px] z-0",
    width: 210,
    rotate: -6,
    float: -8,
    duration: 10,
    featured: false,
  },
];
const TEAM_SHOWCASE = [
  {
    src: 'https://images.pexels.com/photos/2061820/pexels-photo-2061820.jpeg?auto=compress&cs=tinysrgb&w=1600',
    title: 'Corte de Autor',
    caption: 'Dominio técnico y estilo personalizado.',
  },
  {
    src: 'https://images.pexels.com/photos/7697329/pexels-photo-7697329.jpeg?auto=compress&cs=tinysrgb&w=1600',
    title: 'Equipo en Sala',
    caption: 'Flujo profesional en cada estación.',
  },
  {
    src: 'https://images.pexels.com/photos/7697434/pexels-photo-7697434.jpeg?auto=compress&cs=tinysrgb&w=1600',
    title: 'Preparación Premium',
    caption: 'Precisión desde el primer gesto.',
  },
  {
    src: 'https://images.pexels.com/photos/8867540/pexels-photo-8867540.jpeg?auto=compress&cs=tinysrgb&w=1600',
    title: 'Ritual de Detalle',
    caption: 'Acabados finos para una imagen impecable.',
  },
];

// ─── BARBEROS DESTACADOS ───
// 💡 Cuando tengas PNGs propios con fondo transparente, solo reemplaza los `src`.
// El diseño está optimizado para PNG transparente, pero también funciona con fotos normales.
const BARBEROS = [
  {
    name: 'Carlos',
    lastName: 'Martínez',
    role: 'Master Barber',
    signature: 'C. Martínez',
    years: 15,
    cuts: '12K+',
    rating: '4.9',
    specialty: 'Fade Arquitectónico',
    tags: ['Fade', 'Skin', 'Líneas'],
    src: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=900&q=80',
    accent: '#D4AF37',
    bio: 'Master de fades arquitectónicos con 15 años de experiencia. Cada corte es una obra de precisión y arte.',
  },
  {
    name: 'Diego',
    lastName: 'Ramírez',
    role: 'Senior Stylist',
    signature: 'D. Ramírez',
    years: 12,
    cuts: '9K+',
    rating: '4.9',
    specialty: 'Navaja Clásica',
    tags: ['Navaja', 'Barba', 'Ritual'],
    src: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=900&q=80',
    accent: '#C9A84C',
    bio: 'Especialista en rituales de navaja clásica con 12 años de trayectoria. Experto en técnicas tradicionales.',
  },
  {
    name: 'Andrés',
    lastName: 'Vega',
    role: 'Detail Specialist',
    signature: 'A. Vega',
    years: 8,
    cuts: '6K+',
    rating: '5.0',
    specialty: 'Perfilado Quirúrgico',
    tags: ['Perfilado', 'Diseño', 'Líneas'],
    src: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&w=900&q=80',
    accent: '#B9922E',
    bio: 'Especialista en perfilado quirúrgico con 8 años de experiencia. Líneas perfectas y ángulos exactos.',
  },
  {
    name: 'Mateo',
    lastName: 'Silva',
    role: 'Style Director',
    signature: 'M. Silva',
    years: 18,
    cuts: '15K+',
    rating: '4.9',
    specialty: 'Tijera Japonesa',
    tags: ['Tijera', 'Texturas', 'Autor'],
    src: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=900&q=80',
    accent: '#D4AF37',
    bio: 'Director de estilo con 18 años dominando la técnica de tijera japonesa. Maestro reconocido.',
  },
];

const BARBERO_ROTATION_MS = 5000;
const PROFESSIONAL_TICKER = [
  { icon: BadgeCheck, label: 'Wahl', meta: 'Cordless Legend' },
  { icon: Crown, label: 'Andis', meta: 'Fade Precision' },
  { icon: Scissors, label: 'BabylissPRO', meta: 'Detail Work' },
  { icon: Gem, label: 'Reuzel', meta: 'Classic Grooming' },
  { icon: Shield, label: 'Barbicide', meta: 'Sanitation' },
  { icon: Wand2, label: 'Suavecito', meta: 'Final Touch' },
  { icon: Trophy, label: 'Master Class', meta: 'Technique' },
];

const PROFESSIONAL_SYSTEMS = [
  { icon: Scissors, label: 'Clipper Over Comb', meta: 'Control' },
  { icon: Sparkles, label: 'Hot Towel', meta: 'Ritual' },
  { icon: Shield, label: 'Straight Razor', meta: 'Precision' },
  { icon: Award, label: 'Skin Fade', meta: 'Blend' },
  { icon: Crown, label: 'Beard Sculpt', meta: 'Shape' },
  { icon: BadgeCheck, label: 'Consultation', meta: 'Fit' },
];

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

const KIDS_SERVICES = [
  {
    name: 'Primer Corte',
    ageRange: '2 – 5 años',
    desc: 'Un hito especial, manejado con toda la delicadeza que merece. Tijeras suaves, ritmo tranquilo y un diploma de valiente al final.',
    price: '$15k',
    time: '30 min',
    tag: 'Iniciación',
  },
  {
    name: 'Corte Joven',
    ageRange: '6 – 10 años',
    desc: 'Degradados moderados y líneas limpias adaptadas al rostro de cada niño. Técnica profesional en formato amigable.',
    price: '$20k',
    time: '35 min',
    tag: 'Popular',
  },
  {
    name: 'Fade Junior',
    ageRange: '11 – 14 años',
    desc: 'El mismo fade de precisión de nuestro catálogo adulto, calibrado para el estilo y la energía de los más jóvenes.',
    price: '$25k',
    time: '40 min',
    tag: 'Tendencia',
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
  const [activeTeamCardSlide, setActiveTeamCardSlide] = useState(0);
  const [teamCardProgress, setTeamCardProgress] = useState(0);
  const [isTeamCardPaused, setIsTeamCardPaused] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();

  const heroScale = useTransform(scrollYProgress, [0, 0.25], [1, 1.1]);

  // ── REDUCED MOTION ──
  const reduceMotion = useReducedMotion();

  // ── BARBEROS LINEUP STATE ──
  const [activeBarbero, setActiveBarbero] = useState(0);
  const [barberoPaused, setBarberoPaused] = useState(false);
  const [barberoProgress, setBarberoProgress] = useState(0);
  const barberoRafRef = useRef<number | null>(null);
  const barberoStartRef = useRef<number>(0);

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

  useEffect(() => {
    if (isTeamCardPaused) return;
    const intervalMs = 4200;
    const tickMs = 60;
    const progressStep = 100 / (intervalMs / tickMs);
    const intervalId = window.setInterval(() => {
      setTeamCardProgress((prev) => {
        const next = prev + progressStep;
        if (next >= 100) {
          setActiveTeamCardSlide((curr) => (curr + 1) % TEAM_SHOWCASE.length);
          return 0;
        }
        return next;
      });
    }, tickMs);
    return () => window.clearInterval(intervalId);
  }, [isTeamCardPaused]);

  // ── BARBEROS: rotación automática ──
  useEffect(() => {
    if (barberoPaused || reduceMotion) return;
    barberoStartRef.current = performance.now();

    const tick = (now: number) => {
      const elapsed = now - barberoStartRef.current;
      const pct = Math.min(elapsed / BARBERO_ROTATION_MS, 1);
      setBarberoProgress(pct);
      if (pct >= 1) {
        setActiveBarbero((a) => (a + 1) % BARBEROS.length);
        barberoStartRef.current = now;
        setBarberoProgress(0);
      }
      barberoRafRef.current = requestAnimationFrame(tick);
    };

    barberoRafRef.current = requestAnimationFrame(tick);
    return () => {
      if (barberoRafRef.current) cancelAnimationFrame(barberoRafRef.current);
    };
  }, [barberoPaused, reduceMotion, activeBarbero]);

  const goToBarbero = (i: number) => {
    setActiveBarbero(i);
    setBarberoProgress(0);
    barberoStartRef.current = performance.now();
  };

  const imageToDataUrl = (src: string) =>
    new Promise<string>((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) { reject(new Error('No se pudo crear contexto de canvas')); return; }
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', 0.86));
      };
      img.onerror = () => reject(new Error('No se pudo cargar la imagen del catálogo'));
      img.src = src;
    });

  const downloadCatalogPdf = async () => {
    const { jsPDF } = await import('jspdf');
    const pdf = new jsPDF({ unit: 'mm', format: 'a4' });

    pdf.setFillColor(11, 11, 11);
    pdf.rect(0, 0, 210, 297, 'F');
    pdf.setDrawColor(212, 175, 55);
    pdf.setLineWidth(0.5);
    pdf.line(16, 60, 194, 60);
    pdf.setTextColor(212, 175, 55);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(28);
    pdf.text('BARBAROS', 105, 85, { align: 'center' });
    pdf.setFontSize(11);
    pdf.setTextColor(255, 255, 255);
    pdf.text('CATÁLOGO DE SERVICIOS PREMIUM', 105, 100, { align: 'center' });
    pdf.text('Desde 1888 | Excelencia en Barbería', 105, 108, { align: 'center' });
    pdf.setDrawColor(212, 175, 55);
    pdf.line(16, 120, 194, 120);
    pdf.setFontSize(10);
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'normal');
    const coverText = pdf.splitTextToSize(
      'Cada servicio es una experiencia única donde la pasión por la barbería se une con la precisión artesanal.',
      160
    );
    pdf.text(coverText, 105, 145, { align: 'center' });

    for (let i = 0; i < SERVICES_CATALOG.length; i += 1) {
      const service = SERVICES_CATALOG[i];
      pdf.addPage();
      pdf.setFillColor(11, 11, 11);
      pdf.rect(0, 0, 210, 297, 'F');
      pdf.setTextColor(212, 175, 55);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9);
      pdf.text(`SERVICIO ${i + 1} / ${SERVICES_CATALOG.length}`, 16, 12);
      pdf.setDrawColor(212, 175, 55);
      pdf.setLineWidth(0.3);
      pdf.line(16, 15, 194, 15);
      const imgData = await imageToDataUrl(service.image);
      pdf.addImage(imgData, 'JPEG', 35, 25, 140, 90, undefined, 'FAST');
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(20);
      pdf.text(service.name, 105, 130, { align: 'center' });
      pdf.setDrawColor(212, 175, 55);
      pdf.setLineWidth(0.2);
      pdf.line(40, 135, 170, 135);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.setTextColor(200, 200, 200);
      const description = pdf.splitTextToSize(service.desc, 160);
      pdf.text(description, 105, 145, { align: 'center', maxWidth: 160 });
      const detailsY = 195;
      pdf.setDrawColor(212, 175, 55);
      pdf.line(16, detailsY - 5, 194, detailsY - 5);
      pdf.setTextColor(212, 175, 55);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('PRECIO', 35, detailsY);
      pdf.setFontSize(16);
      pdf.text(service.price, 35, detailsY + 8);
      pdf.setFontSize(12);
      pdf.text('DURACIÓN', 105, detailsY);
      pdf.setFontSize(16);
      pdf.text(service.time, 105, detailsY + 8);
      if (service.featured || service.bestseller) {
        pdf.setFillColor(212, 175, 55);
        pdf.rect(145, detailsY - 2, 50, 18, 'F');
        pdf.setTextColor(11, 11, 11);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(10);
        pdf.text(
          service.featured ? 'DESTACADO' : 'BESTSELLER',
          170, detailsY + 5, { align: 'center' }
        );
      }
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

      {/* ─── NAVBAR ─── */}
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-700 ${
        scrolled
          ? 'bg-[#0B0B0B]/90 backdrop-blur-xl border-b border-white/5'
          : 'bg-transparent'
      }`}>
        <div className="max-w-[1360px] mx-auto px-3 lg:px-6">
          <div className="flex items-center justify-between h-16">
            <motion.a
              href="#inicio"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center z-50"
            >
              <h1 className="font-['Unbounded'] font-bold text-lg lg:text-xl text-white tracking-tight uppercase">
                {APP_BRAND.name}
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="h-[1px] w-4 bg-[#D4AF37]" />
                <span className="text-[#D4AF37] text-[7px] tracking-[0.4em] font-['Manrope'] uppercase">
                  {APP_BRAND.foundationLabel}
                </span>
                <div className="h-[1px] w-4 bg-[#D4AF37]" />
              </div>
            </motion.a>

            <div className="hidden lg:flex items-center gap-5">
              {desktopLeftNav.map((item, idx) => (
                <motion.a
                  key={item}
                  href={`#${getSectionId(item)}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className="text-white/70 hover:text-[#D4AF37] transition-colors text-[9px] tracking-[0.2em] font-['Manrope'] uppercase font-medium"
                >
                  {item}
                </motion.a>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-5">
              {desktopRightNav.map((item, idx) => (
                <motion.a
                  key={item}
                  href={`#${getSectionId(item)}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (idx + 2) * 0.08 }}
                  className="text-white/70 hover:text-[#D4AF37] transition-colors text-[9px] tracking-[0.2em] font-['Manrope'] uppercase font-medium"
                >
                  {item}
                </motion.a>
              ))}
              <motion.a
                href="#ubicación"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-[#D4AF37] text-[#0B0B0B] px-6 py-2 font-bold text-[9px] tracking-[0.2em] uppercase hover:bg-[#C9A84C] transition-colors"
              >
                Reservar
              </motion.a>
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-white p-2 z-50"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

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

      {/* ─── HERO ─── */}
      <section
        ref={heroRef}
        id="inicio"
        className="relative min-h-screen flex items-center overflow-hidden bg-[#0B0B0B]"
      >
        <motion.div style={{ scale: heroScale }} className="absolute inset-0">
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

        <div className="relative z-10 min-h-screen w-full px-4 lg:px-6 flex items-center justify-center">
          <div className="w-full max-w-3xl text-center pt-12 lg:pt-16">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="mb-3"
            >
              <span className="text-white/85 text-[10px] tracking-[0.42em] font-['Manrope'] uppercase font-semibold">
                Stay Sharp, Look Good
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.95, delay: 0.35 }}
              className="font-['Unbounded'] font-bold text-2xl sm:text-3xl lg:text-5xl text-white uppercase leading-[1] tracking-tight mb-4"
            >
              NYC'S Favourite
              <span className="block">Barber Shop.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.65 }}
              className="text-white/80 text-[9px] sm:text-[10px] tracking-[0.24em] uppercase mb-4 font-['Manrope']"
            >
              Broadway St, NYC. Appointment | 855 100 4444
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.75 }}
              className="flex flex-wrap items-center justify-center gap-4 mb-6 text-white/70 text-[8px] tracking-wider"
            >
              <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-[#D4AF37]"/>
                <span>Desde 1888</span>
              </div>
              <div className="w-[1px] h-3 bg-white/20"/>
              <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-[#D4AF37]"/>
                <span>+10K satisfechos</span>
              </div>
              <div className="w-[1px] h-3 bg-white/20"/>
              <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-[#D4AF37]"/>
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
                className="bg-white text-[#0B0B0B] px-6 py-2.5 font-['Manrope'] font-bold text-[10px] tracking-[0.16em] uppercase inline-flex items-center justify-center hover:bg-[#F3F3F3] transition-colors duration-300 shadow-[0_12px_35px_rgba(0,0,0,0.28)]"
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

      {/* WAVE hero → filosofía */}
      <div className="relative h-16 -mt-16 z-10 pointer-events-none">
        <svg viewBox="0 0 1440 200" preserveAspectRatio="none" className="w-full h-full">
          <defs>
            <filter id="abstract-paint-1" x="-50%" y="-50%" width="200%" height="200%">
              <feTurbulence type="fractalNoise" baseFrequency="0.02 0.01" numOctaves="3" seed="15" />
              <feDisplacementMap in="SourceGraphic" scale="40" />
            </filter>
          </defs>
          <path d="M0,120 L200,160 L350,130 L520,155 L680,125 L850,145 L1020,130 L1180,150 L1320,135 L1440,155 L1440,200 L0,200 Z" fill="white" filter="url(#abstract-paint-1)" opacity="0.95" />
          <path d="M0,140 L180,110 L380,135 L600,115 L820,130 L1050,120 L1260,135 L1440,125 L1440,200 L0,200 Z" fill="white" opacity="0.7" />
          <path d="M0,155 L240,145 L480,160 L720,150 L960,165 L1200,155 L1440,170 L1440,200 L0,200 Z" fill="white" opacity="0.5" />
        </svg>
      </div>
{/* ─── FILOSOFÍA + MASTER ATELIER (BARBEROS) ─── */}
{/* ─── MASTER ATELIER — GALERÍA EDITORIAL ─── */}
<section
  id="filosofía"
  className="relative bg-[#F7F4ED] py-16 lg:py-24 px-4 lg:px-8 overflow-hidden"
  onMouseEnter={() => setBarberoPaused(true)}
  onMouseLeave={() => setBarberoPaused(false)}
>
  <div className="max-w-[1240px] mx-auto relative">

    {/* Header minimal */}
    <div className="flex items-center justify-between mb-12 lg:mb-16">
      <div className="flex items-center gap-3">
        <div className="w-8 h-px bg-[#0B0B0B]" />
        <span className="text-[#0B0B0B] text-[10px] tracking-[0.55em] uppercase font-semibold">
          Master Atelier
        </span>
      </div>
      <span className="text-[#0B0B0B]/40 text-[10px] tracking-[0.4em] uppercase font-['Manrope']">
        Vol.&nbsp;{String(activeBarbero + 1).padStart(2, '0')}
      </span>
    </div>

    {/* Layout principal: 6 / 6 */}
    <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">

      {/* IZQ — Foto retrato grande */}
      <div className="lg:col-span-6 relative">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#0B0B0B]/5">
          <AnimatePresence mode="wait">
            <motion.img
              key={BARBEROS[activeBarbero].src}
              src={BARBEROS[activeBarbero].src}
              alt={`${BARBEROS[activeBarbero].name} ${BARBEROS[activeBarbero].lastName}`}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>

          {/* Marca de agua del número */}
          <div className="absolute top-3 left-4 text-white/85 text-[9px] tracking-[0.5em] uppercase font-semibold">
            {String(activeBarbero + 1).padStart(2, '0')} — {String(BARBEROS.length).padStart(2, '0')}
          </div>

          {/* Etiqueta inferior con role */}
          <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-5 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
            <p
              className="text-[9px] tracking-[0.5em] uppercase font-semibold mb-0.5"
              style={{ color: BARBEROS[activeBarbero].accent }}
            >
              {BARBEROS[activeBarbero].role}
            </p>
            <p className="text-white text-[12px] tracking-[0.25em] uppercase">
              {BARBEROS[activeBarbero].specialty}
            </p>
          </div>
        </div>
      </div>

      {/* DER — Información editorial */}
      <div className="lg:col-span-6 lg:pt-4 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={`info-${activeBarbero}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5 }}
          >
            {/* Nombre como protagonista */}
            <h2 className="font-['Unbounded'] uppercase leading-[0.86] tracking-[-0.045em] text-[#0B0B0B]">
              <span className="block text-2xl sm:text-3xl lg:text-4xl">
                {BARBEROS[activeBarbero].name}
              </span>
              <span className="block text-[#0B0B0B]/35 text-2xl sm:text-3xl lg:text-4xl">
                {BARBEROS[activeBarbero].lastName}
              </span>
            </h2>

            {/* Línea editorial */}
            <div className="mt-6 lg:mt-8 h-px w-12 bg-[#0B0B0B]" />

            {/* Descripción única, calmada */}
            <p className="mt-5 text-[#0B0B0B]/65 text-sm leading-[1.8] max-w-[460px]">
              {BARBEROS[activeBarbero].bio ||
                `Más de ${BARBEROS[activeBarbero].years} años perfeccionando la técnica del ${BARBEROS[activeBarbero].specialty.toLowerCase()}. Cada cita es un diagnóstico personalizado, no una rutina.`}
            </p>

            {/* Stats inline editorial — 3 cifras */}
            <div className="mt-8 lg:mt-10 grid grid-cols-3 gap-4 lg:gap-8 max-w-[460px]">
              <div>
                <p className="text-[#0B0B0B]/35 text-[8px] tracking-[0.4em] uppercase mb-1.5">
                  Trayectoria
                </p>
                <p className="font-['Unbounded'] text-[#0B0B0B] text-xl font-bold leading-none">
                  {BARBEROS[activeBarbero].years}
                  <span className="text-[#0B0B0B]/30 text-xs ml-1">años</span>
                </p>
              </div>
              <div className="border-l border-[#0B0B0B]/12 pl-4 lg:pl-8">
                <p className="text-[#0B0B0B]/35 text-[8px] tracking-[0.4em] uppercase mb-1.5">
                  Cortes
                </p>
                <p className="font-['Unbounded'] text-[#0B0B0B] text-xl font-bold leading-none">
                  {BARBEROS[activeBarbero].cuts}
                </p>
              </div>
              <div className="border-l border-[#0B0B0B]/12 pl-4 lg:pl-8">
                <p className="text-[#0B0B0B]/35 text-[8px] tracking-[0.4em] uppercase mb-1.5">
                  Rating
                </p>
                <p className="font-['Unbounded'] text-[#0B0B0B] text-xl font-bold leading-none">
                  {BARBEROS[activeBarbero].rating}
                  <span className="text-[#C6A85B] text-xs ml-1">★</span>
                </p>
              </div>
            </div>

            {/* CTA discreto */}
            <motion.a
              href="https://wa.me/573001234567"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ x: 4 }}
              className="mt-8 inline-flex items-center gap-2 text-[10px] tracking-[0.34em] uppercase font-bold text-[#0B0B0B] border-b border-[#0B0B0B] pb-1"
            >
              Reservar con {BARBEROS[activeBarbero].name}
              <ArrowRight className="w-4 h-4" />
            </motion.a>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>

    {/* Tabla de contenidos — navegación editorial */}
    <div className="mt-14 lg:mt-20 border-t border-[#0B0B0B]/12">
      <div className="grid grid-cols-2 lg:grid-cols-4">
        {BARBEROS.map((b, i) => {
          const active = i === activeBarbero;
          return (
            <button
              key={b.name}
              onClick={() => goToBarbero(i)}
              className="group relative text-left py-5 px-3 lg:px-6 border-b lg:border-b-0 lg:border-r border-[#0B0B0B]/12 last:border-r-0 transition-colors hover:bg-white/60"
            >
              {/* Barra de progreso del activo */}
              {active && !reduceMotion && (
                <div
                  className="absolute top-0 left-0 h-px bg-[#0B0B0B]"
                  style={{ width: `${barberoProgress * 100}%` }}
                />
              )}
              {/* Línea inferior estática para activo */}
              {active && (
                <div className="absolute -top-px left-0 right-0 h-px bg-[#0B0B0B]" />
              )}

              <div className="flex items-baseline gap-3">
                <span
                  className={`font-['Unbounded'] text-[10px] tracking-[0.4em] transition-colors ${
                    active ? 'text-[#0B0B0B]' : 'text-[#0B0B0B]/30'
                  }`}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0 flex-1">
                  <p
                    className={`font-['Unbounded'] uppercase text-sm lg:text-base tracking-tight font-semibold leading-tight transition-colors ${
                      active ? 'text-[#0B0B0B]' : 'text-[#0B0B0B]/50 group-hover:text-[#0B0B0B]'
                    }`}
                  >
                    {b.name}
                  </p>
                  <p
                    className={`text-[9px] tracking-[0.32em] uppercase mt-0.5 transition-colors ${
                      active ? 'text-[#C6A85B]' : 'text-[#0B0B0B]/35'
                    }`}
                  >
                    {b.role}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  </div>
</section>


      {/* ─── SERVICIOS ─── */}
      <section id="servicios" className="relative bg-[#0B0B0B] py-10 lg:py-14 px-4 lg:px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-center gap-2 mb-3"
            >
              <div className="h-[1px] w-6 bg-[#D4AF37]" />
              <span className="text-[#D4AF37] text-[8px] tracking-[0.5em] font-['DM_Sans'] uppercase">Servicios</span>
              <div className="h-[1px] w-6 bg-[#D4AF37]" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-['Unbounded'] font-semibold text-3xl lg:text-4xl text-white mb-3 uppercase tracking-tight"
            >
              El Arsenal Bárbaro
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-white/50 text-sm max-w-2xl mx-auto"
            >
              Técnicas ancestrales perfeccionadas durante 135 años
            </motion.p>

            <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
              <motion.button
                onClick={downloadCatalogPdf}
                whileHover={{ y: -2 }}
                className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/70 px-4 py-2 text-[10px] font-bold tracking-[0.14em] uppercase text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors"
              >
                <FileDown className="w-3.5 h-3.5" />
                Catálogo PDF
              </motion.button>
              <motion.a
                href="https://wa.me/573001234567"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-2 rounded-full bg-[#D4AF37] px-5 py-2 text-[10px] font-bold tracking-[0.14em] uppercase text-[#0B0B0B] hover:bg-[#C9A84C] transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.411-2.391-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.946 1.23l-.355.192-.368-.06c-1.286-.113-2.430-.511-3.428-1.218l-.744-.524-.816.823c-.248.25-.637.675-.637 1.694 0 1.289.465 2.575 1.282 3.603l.42.485-.5.328c-.961.624-1.657 1.462-2.081 2.48l-.27.692.691.423c2.669 1.635 5.812 2.586 9.012 2.586 4.677 0 9.012-1.901 12.117-5.354.31-.324.607-.67.886-1.032.138-.181.27-.365.39-.551l.386-.617-.557-.363c-.368-.237-.888-.601-1.436-1.093-.48-.433-.99-.91-1.524-1.425-.534-.515-1.037-.948-1.513-1.3l-.493-.377z"/>
                </svg>
                Agendar Cita
              </motion.a>
            </div>
          </div>

          <div className="space-y-4">
            {SERVICES_CATALOG.map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className={`group relative border-t border-white/10 pt-4 hover:border-[#D4AF37]/30 transition-all duration-500 ${
                  service.featured ? 'bg-[#D4AF37]/5 -mx-3 lg:-mx-4 px-3 lg:px-4 py-4' : ''
                }`}
              >
                <div className="grid lg:grid-cols-12 gap-4 items-center">
                  <div className="lg:col-span-7">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <h3 className="font-['Unbounded'] font-semibold text-lg lg:text-xl text-white uppercase tracking-tight">
                        {service.name}
                      </h3>
                      {service.featured && (
                        <span className="bg-[#D4AF37] text-[#0B0B0B] px-2.5 py-0.5 text-[7px] tracking-wider uppercase font-bold">
                          Recomendado
                        </span>
                      )}
                      {service.bestseller && (
                        <span className="bg-[#D4AF37] text-[#0B0B0B] px-2.5 py-0.5 text-[7px] tracking-wider uppercase font-bold">
                          Top Ventas
                        </span>
                      )}
                    </div>
                    <p className="text-white/50 text-xs leading-relaxed">{service.desc}</p>
                  </div>

                  <div className="lg:col-span-4 flex lg:justify-end gap-6 items-center">
                    <div>
                      <div className="text-white/30 text-[8px] tracking-wider uppercase mb-0.5">Precio</div>
                      <div className="font-['Unbounded'] text-xl text-white font-bold tracking-tight">{service.price}</div>
                    </div>
                    <div>
                      <div className="text-white/30 text-[8px] tracking-wider uppercase mb-0.5">Tiempo</div>
                      <div className="text-white/60 text-base">{service.time}</div>
                    </div>
                  </div>

                  <div className="lg:col-span-1 hidden lg:flex lg:justify-end">
                    <motion.a
                      href="https://wa.me/573001234567"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      className="text-[9px] font-bold tracking-wider uppercase px-3 py-1.5 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded transition-colors"
                    >
                      Agendar
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none">
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-full">
            <defs>
              <filter id="abstract-paint-servicios" x="-50%" y="-50%" width="200%" height="200%">
                <feTurbulence type="fractalNoise" baseFrequency="0.02 0.01" numOctaves="3" seed="25" />
                <feDisplacementMap in="SourceGraphic" scale="30" />
              </filter>
            </defs>
            <path d="M0,55 L200,70 L350,60 L520,75 L680,65 L850,70 L1020,60 L1180,75 L1320,65 L1440,70 L1440,100 L0,100 Z" fill="white" filter="url(#abstract-paint-servicios)" opacity="0.08" />
            <path d="M0,65 L180,50 L380,60 L600,45 L820,55 L1050,50 L1260,60 L1440,55 L1440,100 L0,100 Z" fill="white" opacity="0.05" />
          </svg>
        </div>
      </section>

      {/* ─── SECCIÓN INFANTIL — REDISEÑADA ─── */}
      <section
      
        id="infantil"
        className="relative bg-[#F8F6F1] py-14 lg:py-20 px-4 lg:px-6 overflow-hidden"
      >
        {/* Subtle background texture */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
          <div className="absolute -top-40 right-0 w-[600px] h-[600px] rounded-full bg-[#D4AF37]/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#0B0B0B]/3 blur-3xl" />
        </div>

        <div className="max-w-[1200px] mx-auto relative z-10">

          {/* ── Header ── */}
          <div className="mb-12 lg:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 mb-4"
            >
              <div className="h-px w-6 bg-[#D4AF37]" />
              <span className="text-[#D4AF37] text-[8px] tracking-[0.5em] uppercase font-semibold">
                Experiencia Infantil
              </span>
            </motion.div>

            <div className="grid lg:grid-cols-[1fr_auto] gap-6 items-end">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <h2 className="font-['Unbounded'] font-bold text-3xl sm:text-4xl lg:text-4xl text-[#0B0B0B] uppercase leading-[0.92] tracking-[-0.03em]">
                  Pequeños
                  <br />
                  <span className="text-[#D4AF37]">Bárbaros</span>
                </h2>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 }}
                className="text-[#0B0B0B]/50 text-xs max-w-xs leading-relaxed lg:pb-1.5"
              >
                La misma precisión y cuidado de siempre, adaptada al ritmo y la energía de los más jóvenes. Un espacio seguro, amigable y sin estrés.
              </motion.p>
            </div>
          </div>

          {/* ── Servicios infantiles — tabla minimalista ── */}
          <div className="mb-12">
            {KIDS_SERVICES.map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="group grid lg:grid-cols-[2fr_1fr_1fr_auto] gap-3 lg:gap-6 items-center border-t border-[#0B0B0B]/10 py-5 hover:border-[#D4AF37]/40 transition-colors duration-400"
              >
                {/* Info */}
                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <h3 className="font-['Unbounded'] font-semibold text-base lg:text-lg text-[#0B0B0B] uppercase tracking-tight">
                      {service.name}
                    </h3>
                    <span className="border border-[#D4AF37]/60 text-[#8A6E1E] px-2 py-0.5 text-[7px] tracking-widest uppercase font-bold rounded-sm">
                      {service.tag}
                    </span>
                  </div>
                  <p className="text-[#0B0B0B]/45 text-xs leading-relaxed max-w-lg">{service.desc}</p>
                </div>

                {/* Edad */}
                <div className="hidden lg:block">
                  <div className="text-[#0B0B0B]/30 text-[8px] tracking-wider uppercase mb-0.5">Edad</div>
                  <div className="text-[#0B0B0B]/70 font-semibold text-xs">{service.ageRange}</div>
                </div>

                {/* Precio + tiempo */}
                <div className="flex lg:block gap-4">
                  <div className="mb-0 lg:mb-2">
                    <div className="text-[#0B0B0B]/30 text-[8px] tracking-wider uppercase mb-0.5">Precio</div>
                    <div className="font-['Unbounded'] text-lg text-[#0B0B0B] font-bold tracking-tight">{service.price}</div>
                  </div>
                  <div>
                    <div className="text-[#0B0B0B]/30 text-[8px] tracking-wider uppercase mb-0.5">Tiempo</div>
                    <div className="text-[#0B0B0B]/55 text-xs">{service.time}</div>
                  </div>
                </div>

                {/* CTA */}
                <motion.a
                  href="https://wa.me/573001234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ x: 4 }}
                  className="inline-flex items-center gap-1.5 text-[9px] font-bold tracking-widest uppercase text-[#0B0B0B] border-b border-[#0B0B0B]/30 pb-0.5 hover:border-[#D4AF37] hover:text-[#8A6E1E] transition-colors whitespace-nowrap"
                >
                  Reservar
                  <ArrowRight className="w-3 h-3" />
                </motion.a>
              </motion.div>
            ))}
            {/* Bottom border */}
            <div className="border-t border-[#0B0B0B]/10" />
          </div>

          {/* ── Propuesta de valor — 3 pilares ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#0B0B0B]/8 rounded-2xl overflow-hidden">
            {[
              {
                number: '01',
                title: 'Sin Presión',
                body: 'Ambiente diseñado para que los niños se sientan cómodos. Ritmo tranquilo, sin prisa y con paciencia infinita.',
              },
              {
                number: '02',
                title: 'Técnica Profesional',
                body: 'Barberos certificados con experiencia en cortes infantiles. El mismo estándar de nuestro catálogo adulto.',
              },
              {
                number: '03',
                title: 'Recuerdo Especial',
                body: 'El primer corte merece un diploma. Fotografía cortesía de la casa para los padres que quieran ese momento.',
              },
            ].map((pillar, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white px-6 py-8 group hover:bg-[#0B0B0B] transition-colors duration-500"
              >
                <span className="block font-['Unbounded'] text-[#D4AF37] text-[9px] tracking-[0.4em] mb-4 group-hover:text-[#D4AF37]">
                  {pillar.number}
                </span>
                <h4 className="font-['Unbounded'] font-semibold text-sm text-[#0B0B0B] uppercase tracking-tight mb-2 group-hover:text-white transition-colors duration-500">
                  {pillar.title}
                </h4>
                <p className="text-[#0B0B0B]/50 text-xs leading-relaxed group-hover:text-white/55 transition-colors duration-500">
                  {pillar.body}
                </p>
              </motion.div>
            ))}
          </div>

          {/* ── CTA Final ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-10 flex flex-col sm:flex-row items-center gap-3"
          >
            <motion.a
              href="https://wa.me/573001234567"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 bg-[#0B0B0B] text-white px-6 py-3 font-['Manrope'] font-bold text-[10px] tracking-[0.18em] uppercase hover:bg-[#1a1a1a] transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.411-2.391-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.946 1.23l-.355.192-.368-.06c-1.286-.113-2.430-.511-3.428-1.218l-.744-.524-.816.823c-.248.25-.637.675-.637 1.694 0 1.289.465 2.575 1.282 3.603l.42.485-.5.328c-.961.624-1.657 1.462-2.081 2.48l-.27.692.691.423c2.669 1.635 5.812 2.586 9.012 2.586 4.677 0 9.012-1.901 12.117-5.354.31-.324.607-.67.886-1.032.138-.181.27-.365.39-.551l.386-.617-.557-.363c-.368-.237-.888-.601-1.436-1.093-.48-.433-.99-.91-1.524-1.425-.534-.515-1.037-.948-1.513-1.3l-.493-.377z"/>
              </svg>
              Reservar Cita Infantil
            </motion.a>
            <span className="text-[#0B0B0B]/35 text-[9px] tracking-[0.3em] uppercase">
              Disponible lunes a sábado
            </span>
          </motion.div>
        </div>
      </section>

      {/* WAVE infantil → membresías */}
      <div className="relative h-12 bg-white">
        <svg viewBox="0 0 1440 150" preserveAspectRatio="none" className="w-full h-full">
          <defs>
            <filter id="abstract-paint-kids" x="-50%" y="-50%" width="200%" height="200%">
              <feTurbulence type="fractalNoise" baseFrequency="0.022 0.015" numOctaves="3" seed="44" />
              <feDisplacementMap in="SourceGraphic" scale="32" />
            </filter>
          </defs>
          <path d="M0,95 L180,70 L360,90 L540,65 L720,85 L900,70 L1080,85 L1260,68 L1440,80 L1440,150 L0,150 Z" fill="#ffffff" filter="url(#abstract-paint-kids)" opacity="1" />
        </svg>
      </div>

  {/* ─── PROMOCIONES EDITORIALES ─── */}
<section
  id="membresías"
  className="relative bg-white py-16 lg:py-28 overflow-hidden"
  aria-label="Promociones semanales"
>
  {/* ATMÓSFERA */}
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute top-[-240px] right-[-240px] w-[540px] h-[540px] bg-[#D4AF37]/10 blur-[140px]" />
    <div className="absolute bottom-[-240px] left-[-240px] w-[500px] h-[500px] bg-black/5 blur-[160px]" />
    {/* grano sutil */}
    <div
      className="absolute inset-0 opacity-[0.035] mix-blend-multiply"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }}
    />
  </div>

  {/* NUMERAL EDITORIAL DE FONDO */}
  <div className="hidden lg:block absolute left-[5%] top-1/2 -translate-y-1/2 pointer-events-none select-none">
    <span className="font-['Unbounded'] text-[22rem] leading-none text-black/[0.03] tracking-tighter">
      05
    </span>
  </div>

  <div className="relative max-w-[1320px] mx-auto px-5">
    {/* CABECERA EDITORIAL */}
    <div className="flex items-end justify-between mb-12 lg:mb-16">
      <div className="flex items-center gap-3">
        <div className="w-10 h-px bg-[#D4AF37]" />
        <p className="text-[#D4AF37] text-[9px] tracking-[0.5em] uppercase">
          Edición Semanal · 2026
        </p>
      </div>
      <p className="hidden md:block text-black/40 text-[9px] tracking-[0.3em] uppercase">
        Lun — Vie
      </p>
    </div>

    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
      {/* ─── COLLAGE (lg+) ─── */}
      <div className="relative h-[500px] hidden lg:block">
        {PROMOS.map((p, i) => (
          <motion.article
            key={p.day}
            initial={{ opacity: 0, y: 40, rotate: p.rotate }}
            whileInView={{ opacity: 1, y: 0, rotate: p.rotate }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
              duration: 0.9,
              delay: i * 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{ scale: 1.03, rotate: 0, zIndex: 50 }}
            className={`absolute group cursor-pointer ${p.position} ${p.theme} shadow-[0_30px_80px_-20px_rgba(0,0,0,0.35)] transition-shadow duration-500 hover:shadow-[0_40px_100px_-10px_rgba(212,175,55,0.35)]`}
            style={{ width: p.width }}
          >
            <motion.div
              animate={{ y: [0, p.float, 0] }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="p-6 lg:p-8"
            >
              {p.featured && (
                <span className="inline-block mb-3 px-2 py-0.5 border border-[#D4AF37]/40 text-[#D4AF37] text-[8px] tracking-[0.4em] uppercase">
                  Destacado
                </span>
              )}

              <p className="text-[#D4AF37] text-[9px] tracking-[0.5em] uppercase mb-2">
                {p.day}
              </p>

              <h3
                className={`font-['Unbounded'] uppercase mb-3 leading-tight ${
                  p.featured ? "text-2xl" : "text-base"
                }`}
              >
                {p.title}
              </h3>

              {p.subtitle && (
                <p className="text-white/50 text-xs mb-4 leading-relaxed">
                  {p.subtitle}
                </p>
              )}

              <div className="flex items-end gap-2">
                <span
                  className={`font-bold ${
                    p.featured ? "text-4xl" : "text-xl"
                  }`}
                >
                  {p.price}
                </span>
                <span className="text-white/30 line-through text-xs pb-0.5">
                  {p.original}
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-[9px] tracking-[0.3em] uppercase text-white/40">
                  0{i + 1} / 05
                </span>
                <span className="text-[#D4AF37] text-[10px] tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                  Reservar →
                </span>
              </div>
            </motion.div>
          </motion.article>
        ))}
      </div>

      {/* ─── COLLAGE FALLBACK (mobile/tablet) ─── */}
      <div className="lg:hidden grid sm:grid-cols-2 gap-3">
        {PROMOS.map((p) => (
          <article
            key={p.day}
            className={`${p.theme} p-5 ${
              p.featured ? "sm:col-span-2" : ""
            }`}
          >
            <p className="text-[#D4AF37] text-[9px] tracking-[0.5em] uppercase mb-2">
              {p.day}
            </p>
            <h3 className="font-['Unbounded'] text-lg uppercase mb-2">
              {p.title}
            </h3>
            {p.subtitle && (
              <p className="text-white/50 text-xs mb-3">{p.subtitle}</p>
            )}
            <div className="flex items-end gap-2">
              <span className="text-xl font-bold">{p.price}</span>
              <span className="text-white/30 line-through text-xs pb-0.5">
                {p.original}
              </span>
            </div>
          </article>
        ))}
      </div>

      {/* ─── DERECHA: TEXTO + CTA ─── */}
      <div className="relative flex lg:justify-end">
        <div className="text-left lg:text-right max-w-md">
          <div className="flex lg:justify-end items-center gap-3 mb-6">
            <p className="text-[#D4AF37] text-[10px] tracking-[0.5em] uppercase">
              Ofertas Semanales
            </p>
            <div className="w-8 h-px bg-[#D4AF37]" />
          </div>

          <h2 className="font-['Unbounded'] text-4xl sm:text-5xl lg:text-6xl uppercase leading-[0.95]">
            Cada Día<br />
            <span className="text-[#D4AF37] italic font-light">Una</span>{" "}
            Experiencia
          </h2>

          <p className="text-black/50 mt-8 leading-relaxed">
            No son descuentos. Son rituales diseñados con intención, precisión
            y carácter — uno distinto para cada día de la semana.
          </p>

          <div className="mt-12 flex flex-col lg:items-end gap-4">
            <button className="group relative inline-flex items-center gap-3 bg-[#0B0B0B] text-white px-8 py-4 overflow-hidden transition-all hover:bg-[#D4AF37] hover:text-black">
              <span className="text-xs tracking-[0.4em] uppercase">
                Reservar Esta Semana
              </span>
              <span className="text-lg transition-transform group-hover:translate-x-1">
                →
              </span>
            </button>
            <p className="text-black/40 text-[11px] tracking-[0.2em] uppercase">
              Cupos limitados · Confirmación inmediata
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none">
  <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="w-full h-full">
    <defs>
      <filter id="ink-bleed" x="-50%" y="-50%" width="200%" height="200%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.015 0.03"
          numOctaves="4"
          seed="9"
        />
        <feDisplacementMap in="SourceGraphic" scale="45" />
        <feGaussianBlur stdDeviation="0.8" />
      </filter>
    </defs>

    {/* BASE NEGRA (firme, inferior) */}
    <path
      d="M0,70
         C120,60 220,90 340,75
         C460,60 560,95 700,78
         C840,62 960,88 1100,74
         C1240,60 1340,85 1440,72
         L1440,120 L0,120 Z"
      fill="#cecece"
    />

    {/* TINTA ORGÁNICA (más fluida, irregular) */}
    <path
      d="M0,55
         C140,80 260,40 380,70
         C520,100 640,35 780,65
         C920,95 1040,45 1180,75
         C1300,95 1380,60 1440,80
         L1440,120 L0,120 Z"
      fill="#000000"
      filter="url(#ink-bleed)"
    />
  </svg>
</div>
</section>
     

      {/* ─── GALERÍA ─── */}
      <section id="galería" className="relative bg-[#0B0B0B] py-10 lg:py-12 px-4 lg:px-6">
        
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-center gap-2 mb-3"
            >
              <div className="h-[1px] w-6 bg-[#D4AF37]" />
              <span className="text-[#D4AF37] text-[8px] tracking-[0.5em] font-['DM_Sans'] uppercase">Portfolio</span>
              <div className="h-[1px] w-6 bg-[#D4AF37]" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-['Unbounded'] font-semibold text-3xl lg:text-4xl text-white mb-3 uppercase tracking-tight"
            >
              Trabajos Destacados
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-white/50 text-sm"
            >
              135 años de maestría en cada corte
            </motion.p>
          </div>

          <div className="-mx-5 lg:-mx-6 mb-5">
            <Slider
              dots={false} infinite={true} speed={4000} slidesToShow={4.2} slidesToScroll={1}
              autoplay={true} autoplaySpeed={0} cssEase="linear" pauseOnHover={true} arrows={false}
              responsive={[
                { breakpoint: 1024, settings: { slidesToShow: 3 } },
                { breakpoint: 640, settings: { slidesToShow: 1.6 } },
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
                    <img src={item.img} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-75" alt={item.label} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B]/90 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <div className="h-[1px] w-12 bg-[#D4AF37] mb-3" />
                      <h3 className="font-['Unbounded'] font-semibold text-lg text-white uppercase tracking-tight">{item.label}</h3>
                    </div>
                    <div className="absolute inset-0 border-2 border-[#D4AF37]/0 group-hover:border-[#D4AF37]/30 transition-colors duration-500" />
                  </motion.div>
                </div>
              ))}
            </Slider>
          </div>

          <div className="-mx-5 lg:-mx-6">
            <Slider
              dots={false} infinite={true} speed={3500} slidesToShow={4.2} slidesToScroll={1}
              autoplay={true} autoplaySpeed={0} cssEase="linear" pauseOnHover={true} arrows={false} rtl={true}
              responsive={[
                { breakpoint: 1024, settings: { slidesToShow: 3 } },
                { breakpoint: 640, settings: { slidesToShow: 1.6 } },
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
                    <img src={item.img} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-75" alt={item.label} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B]/90 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <div className="h-[1px] w-12 bg-[#D4AF37] mb-3" />
                      <h3 className="font-['Unbounded'] font-semibold text-lg text-white uppercase tracking-tight">{item.label}</h3>
                    </div>
                    <div className="absolute inset-0 border-2 border-[#D4AF37]/0 group-hover:border-[#D4AF37]/30 transition-colors duration-500" />
                  </motion.div>
                </div>
              ))}
            </Slider>
          </div>

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
      

 {/* CONTACT SECTION — ICONIC STYLE */}
<section className="relative w-full h-[75vh] min-h-[550px] overflow-hidden">

  {/* BACKGROUND IMAGE */}
  <div className="absolute inset-0">
    <img
      src={contactImage}
      alt="Barbaros Contacto"
      className="w-full h-full object-cover scale-105"
    />
    <div className="absolute inset-0 bg-black/60" />
  </div>

  {/* CONTENT */}
  <div className="relative z-10 h-full flex items-center">
    <div className="max-w-[1200px] mx-auto px-4 lg:px-8 w-full">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-md"
      >

        {/* LABEL */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-[1px] bg-[#D4AF37]" />
          <span className="text-[#D4AF37] text-[9px] tracking-[0.4em] uppercase">
            Contacto
          </span>
        </div>

        {/* TITLE */}
        <h2 className="font-['Unbounded'] text-3xl lg:text-4xl leading-[1.1] text-white uppercase tracking-tight mb-4">
          Agenda Tu
          <br />
          Próximo Corte
        </h2>

        {/* TEXT */}
        <p className="text-white/70 text-base leading-relaxed mb-6">
          Más que una cita, una experiencia. Reserva en segundos y vive la tradición de Bárbaros con el nivel que mereces.
        </p>

        {/* CTA */}
        <motion.a
          href="https://wa.me/573001234567"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="group inline-flex items-center gap-3 bg-[#D4AF37] text-black px-8 py-3 text-[10px] tracking-[0.2em] uppercase font-bold transition-all duration-300"
        >
          Reservar por WhatsApp

          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </motion.a>

      </motion.div>
    </div>
  </div>

  {/* DECORATIVE ELEMENT (SUBTLE BRAND LINE) */}
  <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/10" />
</section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-[#0B0B0B] text-white py-12 px-4 lg:px-8">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid lg:grid-cols-4 gap-8 mb-8">
            <div className="lg:col-span-2">
              <div className="mb-3">
                <h3 className="font-['Unbounded'] font-semibold text-lg mb-0.5 uppercase tracking-tight">
                  {APP_BRAND.name}
                </h3>
                <div className="flex items-center gap-1.5">
                  <div className="h-[1px] w-6 bg-[#D4AF37]" />
                  <span className="text-[#D4AF37] text-[7px] tracking-[0.3em]">{APP_BRAND.foundationLabel}</span>
                </div>
              </div>
              <p className="text-white/50 text-xs mb-4 max-w-sm">
                Barbería clásica en Puerto Colombia. 135 años de tradición.
              </p>
              <a
                href="https://instagram.com/barbarosclub.1888"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-white/60 hover:text-[#D4AF37] transition-colors text-xs"
              >
                <Instagram className="w-3 h-3" />
                @barbarosclub.1888
              </a>
            </div>

            <div>
              <h4 className="font-bold text-xs mb-3 tracking-wider uppercase">Enlaces</h4>
              <ul className="space-y-1.5 text-xs">
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
              <h4 className="font-bold text-xs mb-3 tracking-wider uppercase">Contacto</h4>
              <ul className="space-y-1.5 text-xs text-white/50">
                <li>Puerto Colombia</li>
                <li>+57 300 123 4567</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 text-center">
            <p className="text-white/30 text-[9px]">
              &copy; 2026 {APP_BRAND.name} 1888. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}