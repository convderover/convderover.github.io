/* Editorial layer. Long technical records stay available in the original data store. */
(() => {
  const { ui, projects } = window.PORTFOLIO_DATA;
  const copy = {
    es: {
      hero: {
        specialty: "De la señal al sistema.",
        lead: "Construyo sistemas de inteligencia artificial para entender imágenes, interpretar señales y llevar la investigación a herramientas que se pueden usar.",
        badges: ["IA biomédica", "Visión por computador", "Cloud MLOps"],
        pillars: [],
        ctaPrimary: "Explorar proyectos",
        ctaCv: "Mi CV",
        portraitMeta: "Investigación e ingeniería · Valladolid",
      },
      projectsSection: {
        eyebrow: "01 / Del problema al producto",
        title: "Ideas que funcionan.",
        subtitle:
          "Tres sistemas para explorar. El resto del trabajo, a un clic.",
        tier1Eyebrow: "TRABAJO SELECCIONADO",
        tier1Title: "Explora, toca, descubre.",
        tier2Eyebrow: "ARCHIVO / 08 PROYECTOS",
        tier2Title: "Más formas de resolver problemas.",
        zoomLabel: "Ampliar",
        detailsBtn: "Caso completo",
      },
      researchSection: {
        eyebrow: "02 / Ciencia abierta",
        title: "Preguntar. Medir. Compartir.",
        subtitle:
          "Métodos reproducibles y colaboración en investigación cardiovascular.",
        preprintTag: "BIOMECÁNICA · PREPRINT · 2026",
        trialsTitle: "Investigación clínica",
        trialsTag: "ICICOR · HCUV",
        trialsIntro:
          "Soporte de ingeniería e imagen en ensayos cardiovasculares.",
      },
      experienceSection: {
        eyebrow: "03 / El recorrido",
        title: "Entre el hospital y el código.",
        subtitle:
          "Cada entorno, una forma distinta de aprender. Abre una etapa para conocerla.",
      },
      stackSection: {
        eyebrow: "04 / La caja de herramientas",
        title: "Tecnología con propósito.",
        subtitle:
          "Explora cada área. Las herramientas cambian; el problema manda.",
      },
      credentialsSection: {
        eyebrow: "05 / Aprender, siempre",
        title: "Una base. Muchas conexiones.",
        subtitle: "Formación, especialización y credenciales verificables.",
        certsFeaturedTitle: "Credenciales seleccionadas",
        certsAdditionalTitle: "Aprendizaje continuo",
      },
      contactSection: {
        eyebrow: "06 / La próxima conversación",
        title: "¿Qué construimos ahora?",
        desc: "IA sanitaria, visión por computador e ingeniería de software. Hablemos de tu próximo reto.",
        primaryEmailBtn: "Hablemos por correo",
        cvGroupLabel: "Conoce mi recorrido",
        copyEmailBtn: "Copiar correo",
      },
      footer: { right: "Diseñado para explorar · Sin rastreadores" },
    },
    en: {
      hero: {
        specialty: "From signal to system.",
        lead: "I build AI systems to understand images, interpret signals and turn research into tools people can use.",
        badges: ["Biomedical AI", "Computer vision", "Cloud MLOps"],
        pillars: [],
        ctaPrimary: "Explore the work",
        ctaCv: "My résumé",
        portraitMeta: "Research & engineering · Valladolid",
      },
      projectsSection: {
        eyebrow: "01 / From problem to product",
        title: "Ideas that work.",
        subtitle: "Three systems to explore. More work, one click away.",
        tier1Eyebrow: "SELECTED WORK",
        tier1Title: "Explore, interact, discover.",
        tier2Eyebrow: "ARCHIVE / 08 PROJECTS",
        tier2Title: "More ways to solve a problem.",
        zoomLabel: "Enlarge",
        detailsBtn: "Full case study",
      },
      researchSection: {
        eyebrow: "02 / Open science",
        title: "Ask. Measure. Share.",
        subtitle:
          "Reproducible methods and collaboration in cardiovascular research.",
        preprintTag: "BIOMECHANICS · PREPRINT · 2026",
        trialsTitle: "Clinical research",
        trialsTag: "ICICOR · HCUV",
        trialsIntro:
          "Engineering and imaging support in cardiovascular trials.",
      },
      experienceSection: {
        eyebrow: "03 / The journey",
        title: "Between the hospital and the code.",
        subtitle:
          "Different environments. New perspectives. Open a chapter to explore it.",
      },
      stackSection: {
        eyebrow: "04 / The toolbox",
        title: "Technology with purpose.",
        subtitle: "Explore each domain. Tools evolve; the problem leads.",
      },
      credentialsSection: {
        eyebrow: "05 / Always learning",
        title: "One foundation. Many connections.",
        subtitle: "Education, specialisation and verifiable credentials.",
        certsFeaturedTitle: "Selected credentials",
        certsAdditionalTitle: "Continuous learning",
      },
      contactSection: {
        eyebrow: "06 / The next conversation",
        title: "What shall we build next?",
        desc: "Healthcare AI, computer vision and software engineering. Let’s talk about your next challenge.",
        primaryEmailBtn: "Let’s talk",
        cvGroupLabel: "Explore my background",
        copyEmailBtn: "Copy email",
      },
      footer: { right: "Built to explore · No trackers" },
    },
  };
  for (const lang of ["es", "en"])
    for (const [section, values] of Object.entries(copy[lang]))
      Object.assign(ui[lang][section], values);
  const metricLabels = {
    es: [
      "Macro AUROC · test PTB-XL (n=2.158)",
      "Proyectos de investigación e ingeniería",
      "Preprint y código abiertos",
      "TFM · Ingeniería Biomédica, UVa",
    ],
    en: [
      "Macro AUROC · PTB-XL test (n=2,158)",
      "Research & engineering projects",
      "Open preprint and code",
      "MSc thesis · Biomedical Engineering, UVa",
    ],
  };
  for (const lang of ["es", "en"])
    ui[lang].metrics.forEach(
      (metric, i) => (metric.label = metricLabels[lang][i]),
    );
  const briefs = {
    cardiocloud: [
      "Del modelo ECG a una plataforma AWS con inferencia, validación y revisión humana trazable.",
      "From an ECG model to an AWS platform with inference, validation and traceable human review.",
    ],
    ecocardia: [
      "Una plataforma local que conecta imagen ecocardiográfica, modelos de IA y apoyo a la interpretación.",
      "A local platform connecting echocardiographic imaging, AI models and interpretation support.",
    ],
    convity: [
      "Entender qué cambia en el código, siguiendo su flujo en lugar de perderse entre líneas.",
      "Understand what changes in code by following its flow, rather than getting lost between lines.",
    ],
    "kick-biomechanics": [
      "Medir los límites del análisis biomecánico desde una sola cámara de televisión.",
      "Measuring the limits of biomechanics from a single broadcast camera.",
    ],
    anonimicicor: [
      "Anonimización offline de informes PDF con auditoría y conservación de la maquetación.",
      "Offline PDF report anonymisation with auditing and layout preservation.",
    ],
    echoextract: [
      "De informes narrativos a variables estructuradas, con LLMs ejecutados en GPU local.",
      "From narrative reports to structured variables, using LLMs on a local GPU.",
    ],
    echoforward: [
      "Explorar la síntesis de vídeo ecocardiográfico condicionada por una FEVI objetivo.",
      "Exploring echocardiographic video synthesis conditioned on a target LVEF.",
    ],
    aortademo: [
      "De angio-TC a geometría, mallado y simulación hemodinámica transitoria.",
      "From CT angiography to geometry, meshing and transient haemodynamic simulation.",
    ],
    convalv: [
      "Transformar sonidos cardíacos en espectrogramas para su clasificación mediante CNN.",
      "Turning heart sounds into spectrograms for CNN classification.",
    ],
    "biomonai-tfm": [
      "Tinción virtual microscópica y conexión entre los ecosistemas Keras y MONAI.",
      "Virtual microscopy staining and a bridge between Keras and MONAI.",
    ],
    emboendo: [
      "Colaboración en IA para endocarditis e imagen cardiovascular.",
      "Collaboration in AI for endocarditis and cardiovascular imaging.",
    ],
  };
  projects.forEach((p) => {
    if (briefs[p.id]) [p.briefEs, p.briefEn] = briefs[p.id];
  });
})();
