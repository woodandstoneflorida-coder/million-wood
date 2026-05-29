"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "es";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => any;
}

const translations = {
  en: {
    nav: {
      services: "Services",
      process: "Process",
      portfolio: "Portfolio",
      whyUs: "Why Us",
    },
    hero: {
      sub: "Precision • Quality • Mastery | South Florida Custom Millwork",
      title1: "Elevating Spaces with",
      title2: "Master Carpentry",
      description: "High-end carpentry, custom closets, premium kitchen cabinets, and advanced CNC fabrication services in Miami, Hollywood, and Fort Lauderdale.",
      ctaPrimary: "Start a Project",
      ctaSecondary: "Explore Services",
      scroll: "Scroll",
    },
    services: {
      title1: "High-Precision",
      title2: "Woodworking",
      description: "Every custom closet, cabinet, and panel combines the artistry of master carpentry with the flawless accuracy of advanced CNC routing technology.",
      clickGallery: "Click to View Gallery →",
      kitchens: {
        title: "Custom Kitchen Cabinets",
        desc: "Bespoke high-end kitchen cabinetry and custom carpentry, combining flawless aesthetics with intelligent storage solutions.",
      },
      closets: {
        title: "Custom Closets Miami",
        desc: "Luxurious, tailor-made walk-in closets and modern storage systems engineered for perfect organization and premium finish.",
      },
      cnc: {
        title: "CNC Services & Routing",
        desc: "High-precision CNC cutting, custom routing, and drilling for architectural wood projects using state-of-the-art industrial machinery.",
      },
      panels: {
        title: "Architectural Wall Panels",
        desc: "Custom architectural wall panels, geometric accent walls, and elegant decorative wood paneling with seamless finishes.",
      },
    },
    process: {
      title1: "Our Tech-Driven",
      title2: "Process",
      description: "What sets us apart is our seamless integration of advanced software and heavy industrial machinery, ensuring unparalleled precision.",
      steps: [
        {
          num: "01",
          title: "3D Parametric Design",
          desc: "We utilize Mozaik software for precise cabinet engineering, ensuring perfect fit and functionality before a single board is cut.",
          tech: "Mozaik 3D"
        },
        {
          num: "02",
          title: "Complex Geometry",
          desc: "For custom organic shapes and intricate panels, we model using Rhino and Grasshopper, pushing the boundaries of traditional woodwork.",
          tech: "Rhino / Grasshopper"
        },
        {
          num: "03",
          title: "Industrial CNC Machining",
          desc: "Our high-end industrial CNC routers execute the digital models with fraction-of-a-millimeter accuracy, minimizing waste and maximizing quality.",
          tech: "Precision CNC"
        },
        {
          num: "04",
          title: "Masterful Installation",
          desc: "The final pieces are assembled and installed by master carpenters, bringing the virtual perfection into the physical world.",
          tech: "Expert Craftsmanship"
        }
      ]
    },
    portfolio: {
      title1: "Our",
      title2: "Portfolio",
      description: "A selection of our finest completed projects, showcasing the intersection of master carpentry and modern design.",
      cta: "Start Your Own Project",
      items: {
        closet1: "Luxury Walk-In Closet",
        kitchen: "Modern Custom Kitchen",
        cabinets: "Luxury Wood Cabinetry",
        wallPanel3: "Elegant Custom Wall Panel",
        closet2: "Bespoke Modern Wardrobe",
        wallPanel1: "Geometric Architectural Panel",
        carpentry: "Custom Carpentry"
      }
    },
    testimonials: {
      philosophyTitle: "Our Philosophy",
      philosophyH3_1: "Mastery Meets",
      philosophyH3_2: "Technology",
      philosophyP1: "At Million Wood, we believe that true luxury lies in absolute precision. We are not just carpenters; we are digital craftsmen.",
      philosophyP2: "By blending generations of traditional woodworking mastery with the world's most advanced CNC technology and parametric design software, we create architectural elements that were previously thought impossible.",
      experience: "Years Experience",
      customBuilt: "Custom Built",
      googleReviews: "Google Reviews",
      leaveReview: "Leave a Review",
      scrollHint: "Scroll to read more"
    },
    contact: {
      title1: "Let's Build",
      title2: "Something Extraordinary",
      description: "Whether you're an architect, interior designer, or homeowner looking for premium custom fabrication, we're ready to bring your vision to life.",
      fields: {
        name: "Full Name",
        email: "Email Address",
        phone: "Phone Number",
        interest: "Area of Interest",
        selectInterest: "Select standard or custom service...",
        kitchens: "Kitchen Cabinets",
        closets: "Custom Closets",
        cnc: "CNC Services",
        panels: "Wall Panels",
        custom: "Other Custom Carpentry",
        message: "Project Description & Specs",
        messagePlaceholder: "Describe your space, material preferences, dimensions, or design ideas...",
        submit: "Initiate Consultation",
        submitting: "Submitting...",
      },
      alerts: {
        successTitle: "CONSULTATION REQUEST RECEIVED",
        successDesc: "Thank you. Our master estimator will review your specifications and contact you within 24 hours to schedule an initial consultation.",
        errorTitle: "SUBMISSION FAILED",
        errorDesc: "An error occurred. Please try again or reach out directly via WhatsApp.",
      }
    },
    socialProof: {
      actions: [
        "just requested a custom quote",
        "reserved a 3D design consultation",
        "unlocked a Golden Ticket",
        "started their closet design",
        "quoted a CNC machining project"
      ],
      timeAgo: "{time} mins ago"
    },
    scratchCard: {
      title1: "Exclusive",
      title2: "Privilege",
      goldenTicketDesc: "You found 1 of the 10 Golden Tickets available today! Unlock an additional 10% discount on your custom woodwork quote.",
      previousExpiredDesc: "We noticed you let your previous code expire. As a final courtesy, here is a 5% discount valid for 4 hours.",
      scratchHere: "SCRATCH TO REVEAL",
      uniqueCode: "Your Unique Code",
      hoursText2: "Contact us within 2 hours to freeze this code. Once frozen, it remains valid for 7 days.",
      hoursText4: "Contact us within 4 hours to freeze this code. Once frozen, it remains valid for 7 days.",
      whatsappBtn: "Freeze via WhatsApp",
      emailBtn: "Freeze via Email Form"
    },
    urgency: {
      codeActivated: "Code {code} Activated",
      timeLeft: "Time left to freeze code:",
      freezeBtn: "Freeze Now"
    },
    footer: {
      rights: "Million Wood. All rights reserved."
    }
  },
  es: {
    nav: {
      services: "Servicios",
      process: "Proceso",
      portfolio: "Portafolio",
      whyUs: "Nosotros",
    },
    hero: {
      sub: "Precisión • Calidad • Maestría | Carpintería a Medida en Miami",
      title1: "Elevando Espacios con",
      title2: "Carpintería de Autor",
      description: "Carpintería de alta gama, fábrica de clósets a la medida, gabinetes de cocina de lujo y servicios de mecanizado CNC de precisión en el sur de la Florida.",
      ctaPrimary: "Iniciar Proyecto",
      ctaSecondary: "Explorar Servicios",
      scroll: "Deslizar",
    },
    services: {
      title1: "Carpintería de",
      title2: "Alta Precisión",
      description: "Cada clóset, gabinete y panel decorativo combina la maestría de la carpintería fina con la precisión de la ingeniería y tecnología CNC avanzada.",
      clickGallery: "Clic para Ver Galería →",
      kitchens: {
        title: "Gabinetes & Instalación de Cocinas",
        desc: "Diseño e instalación de gabinetes de cocina a la medida que combinan estética impecable con soluciones de almacenamiento inteligentes.",
      },
      closets: {
        title: "Fábrica de Clósets a la Medida",
        desc: "Clósets lujosos, vestidores y walk-in closets diseñados a medida, construidos para organización perfecta y acabados de lujo.",
      },
      cnc: {
        title: "Mecanizado & Ruteado CNC",
        desc: "Servicios de corte, perforación y ruteado CNC de alta precisión en madera y MDF utilizando maquinaria industrial de última generación.",
      },
      panels: {
        title: "Paneles de Pared Decorativos",
        desc: "Paneles arquitectónicos de madera para pared, revestimientos decorativos con patrones geométricos o acabados elegantes.",
      },
    },
    process: {
      title1: "Nuestro Proceso",
      title2: "Tecnológico",
      description: "Lo que nos diferencia es nuestra perfecta integración de software avanzado y maquinaria industrial pesada, lo que garantiza una precisión inigualable.",
      steps: [
        {
          num: "01",
          title: "Diseño Paramétrico 3D",
          desc: "Utilizamos el software Mozaik para una ingeniería de gabinetes precisa, asegurando un ajuste y funcionalidad perfectos antes de cortar una sola tabla.",
          tech: "Mozaik 3D"
        },
        {
          num: "02",
          title: "Geometría Compleja",
          desc: "Para formas orgánicas personalizadas y paneles complejos, modelamos usando Rhino y Grasshopper, superando los límites de la carpintería tradicional.",
          tech: "Rhino / Grasshopper"
        },
        {
          num: "03",
          title: "Mecanizado CNC Industrial",
          desc: "Nuestros routers CNC industriales de alta gama ejecutan los modelos digitales con precisión de fracción de milímetro, minimizando el desperdicio y maximizando la calidad.",
          tech: "CNC de Precisión"
        },
        {
          num: "04",
          title: "Instalación Magistral",
          desc: "Las piezas finales son ensambladas e instaladas por maestros carpinteros, llevando la perfección virtual al mundo físico.",
          tech: "Artesanía Experta"
        }
      ]
    },
    portfolio: {
      title1: "Nuestro",
      title2: "Portafolio",
      description: "Una selección de nuestros mejores proyectos completados, que muestran la intersección entre la carpintería de autor y el diseño moderno.",
      cta: "Comienza Tu Propio Proyecto",
      items: {
        closet1: "Vestidor de Lujo a la Medida",
        kitchen: "Cocina Moderna a la Medida",
        cabinets: "Gabinetes de Madera de Lujo",
        wallPanel3: "Panel de Pared Elegante y Personalizado",
        closet2: "Clóset Moderno de Autor",
        wallPanel1: "Panel Arquitectónico Geométrico",
        carpentry: "Carpintería Fina Personalizada"
      }
    },
    testimonials: {
      philosophyTitle: "Nuestra Filosofía",
      philosophyH3_1: "Maestría y",
      philosophyH3_2: "Tecnología",
      philosophyP1: "En Million Wood, creemos que el verdadero lujo reside en la precisión absoluta. No somos solo carpinteros; somos artesanos digitales.",
      philosophyP2: "Al combinar generaciones de experiencia en carpintería tradicional con la tecnología CNC y el software de diseño paramétrico más avanzados del mundo, creamos elementos arquitectónicos que antes se consideraban imposibles.",
      experience: "Años de Experiencia",
      customBuilt: "Hecho a la Medida",
      googleReviews: "Reseñas de Google",
      leaveReview: "Dejar una Reseña",
      scrollHint: "Desliza para leer más"
    },
    contact: {
      title1: "Construyamos",
      title2: "Algo Extraordinario",
      description: "Ya sea que seas un arquitecto, diseñador de interiores o propietario que busca fabricación personalizada premium, estamos listos para dar vida a tu visión.",
      fields: {
        name: "Nombre Completo",
        email: "Correo Electrónico",
        phone: "Número de Teléfono",
        interest: "Área de Interés",
        selectInterest: "Seleccione un servicio estándar o personalizado...",
        kitchens: "Gabinetes de Cocina",
        closets: "Clósets a la Medida",
        cnc: "Servicios de CNC",
        panels: "Paneles de Pared",
        custom: "Otra Carpintería Personalizada",
        message: "Descripción y Especificaciones del Proyecto",
        messagePlaceholder: "Describe tu espacio, preferencias de materiales, dimensiones o ideas de diseño...",
        submit: "Iniciar Consulta",
        submitting: "Enviando...",
      },
      alerts: {
        successTitle: "SOLICITUD DE CONSULTA RECIBIDA",
        successDesc: "Gracias. Nuestro estimador principal revisará sus especificaciones y se comunicará con usted dentro de las próximas 24 horas para programar una consulta inicial.",
        errorTitle: "ERROR AL ENVIAR",
        errorDesc: "Ocurrió un error al enviar el formulario. Por favor, intente nuevamente o contáctenos directamente por WhatsApp.",
      }
    },
    socialProof: {
      actions: [
        "acaba de solicitar una cotización",
        "reservó una asesoría de diseño 3D",
        "desbloqueó un Golden Ticket",
        "inició el diseño de su clóset",
        "cotizó un proyecto de mecanizado CNC"
      ],
      timeAgo: "Hace {time} min"
    },
    scratchCard: {
      title1: "Privilegio",
      title2: "Exclusivo",
      goldenTicketDesc: "¡Encontraste 1 de los 10 Golden Tickets disponibles hoy! Desbloquea un 10% de descuento adicional en tu cotización de carpintería a medida.",
      previousExpiredDesc: "Notamos que dejaste expirar tu código anterior. Como cortesía final, aquí tienes un 5% de descuento válido por 4 horas.",
      scratchHere: "RASPA PARA REVELAR",
      uniqueCode: "Tu Código Único",
      hoursText2: "Contáctanos dentro de las próximas 2 horas para congelar este código. Una vez congelado, es válido por 7 días.",
      hoursText4: "Contáctanos dentro de las próximas 4 horas para congelar este código. Una vez congelado, es válido por 7 días.",
      whatsappBtn: "Congelar por WhatsApp",
      emailBtn: "Congelar por Formulario"
    },
    urgency: {
      codeActivated: "Código {code} Activado",
      timeLeft: "Tiempo restante para congelar código:",
      freezeBtn: "Congelar Ahora"
    },
    footer: {
      rights: "Million Wood. Todos los derechos reservados."
    }
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("mw_lang") as Language;
    if (savedLang === "en" || savedLang === "es") {
      setLanguageState(savedLang);
    } else {
      // Auto-detect browser language
      if (typeof window !== "undefined" && window.navigator) {
        const browserLang = window.navigator.language.split("-")[0];
        if (browserLang === "es") {
          setLanguageState("es");
        }
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("mw_lang", lang);
  };

  const t = (key: string) => {
    const keys = key.split(".");
    let current: any = translations[language];
    for (const k of keys) {
      if (current && current[k] !== undefined) {
        current = current[k];
      } else {
        return key;
      }
    }
    return current;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
