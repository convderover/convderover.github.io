/* Bilingual Portfolio Data Store (ES / EN) — Roberto Martín Gutiérrez */

const SVG_SCHEMATICS = {
  ecocardia: `<svg class="schematic-svg schematic-ecocardia" viewBox="0 0 480 236" width="480" height="236" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="ECOCARDIA AI clinical architecture">
    <rect width="480" height="236" rx="12" fill="#08222c"/>
    <g stroke="#16414f" stroke-width="1" opacity="0.75">
      <line x1="0" y1="48" x2="480" y2="48"/><line x1="0" y1="118" x2="480" y2="118"/><line x1="0" y1="188" x2="480" y2="188"/>
      <line x1="120" y1="0" x2="120" y2="236"/><line x1="240" y1="0" x2="240" y2="236"/><line x1="360" y1="0" x2="360" y2="236"/>
    </g>
    <rect class="eco-node eco-node-1" x="20" y="34" width="120" height="74" rx="10" fill="#0d3542" stroke="#2dd4bf" stroke-width="1.5"/>
    <text x="80" y="63" fill="#99f6e4" font-family="monospace" font-size="11" font-weight="700" text-anchor="middle">DICOM / Orthanc</text>
    <text x="80" y="83" fill="#cbe3ea" font-family="sans-serif" font-size="10" text-anchor="middle">Anatomy Gate &amp; Views</text>

    <rect class="eco-node eco-node-2" x="174" y="24" width="134" height="94" rx="10" fill="#104252" stroke="#5eead4" stroke-width="1.8"/>
    <text x="241" y="50" fill="#5eead4" font-family="monospace" font-size="11" font-weight="700" text-anchor="middle">ECOCARDIA AI</text>
    <text x="241" y="69" fill="#e6f6f9" font-family="sans-serif" font-size="10" text-anchor="middle">YOLO · 3D CNN</text>
    <text x="241" y="85" fill="#e6f6f9" font-family="sans-serif" font-size="10" text-anchor="middle">TimeSformer · LVH (mm)</text>
    <text x="241" y="103" fill="#99f6e4" font-family="monospace" font-size="9" text-anchor="middle">MODEL_FROZEN SHA</text>

    <rect class="eco-node eco-node-3" x="342" y="34" width="118" height="74" rx="10" fill="#0d3542" stroke="#2dd4bf" stroke-width="1.5"/>
    <text x="401" y="62" fill="#2dd4bf" font-family="monospace" font-size="11" font-weight="700" text-anchor="middle">CLINICAL HUB</text>
    <text x="401" y="82" fill="#ffffff" font-family="monospace" font-size="9.5" text-anchor="middle">DERIVAR / NO DERIVAR</text>

    <rect class="eco-node eco-node-4" x="88" y="148" width="304" height="60" rx="10" fill="#0c2f3b" stroke="#38bdf8" stroke-width="1.35"/>
    <text x="240" y="173" fill="#bae6fd" font-family="monospace" font-size="10.5" font-weight="700" text-anchor="middle">FastAPI LAN · React Studio · Local GPU RAG</text>
    <text x="240" y="193" fill="#9cb8c4" font-family="sans-serif" font-size="9.5" text-anchor="middle">ICICOR · HCUV · 100% On-Premise Inference · ISCIII DTS25/00100</text>

    <path class="eco-conn eco-conn-1" pathLength="1" d="M140 71H174" stroke="#5eead4" stroke-width="2.2" stroke-linecap="round"/>
    <path class="eco-conn eco-conn-2" pathLength="1" d="M308 71H342" stroke="#5eead4" stroke-width="2.2" stroke-linecap="round"/>
    <path class="eco-conn eco-conn-3" pathLength="1" d="M241 118V148" stroke="#38bdf8" stroke-width="2.2" stroke-linecap="round"/>
  </svg>`,

  anonimicicor: `<svg class="schematic-svg" viewBox="0 0 480 236" width="480" height="236" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="AnonimICICOR redaction architecture">
    <rect width="480" height="236" rx="12" fill="#092029"/>
    <rect x="42" y="30" width="144" height="176" rx="10" fill="#10313e" stroke="#64748b" stroke-width="1.5"/>
    <text x="114" y="56" fill="#cbd5e1" font-family="monospace" font-size="10.5" font-weight="700" text-anchor="middle">CLINICAL PDF / SCAN</text>
    <rect x="60" y="74" width="108" height="10" rx="3" fill="#ef4444" fill-opacity="0.45"/>
    <rect x="60" y="92" width="84" height="10" rx="3" fill="#ef4444" fill-opacity="0.45"/>
    <rect x="60" y="114" width="108" height="8" rx="2" fill="#334e5c"/>
    <rect x="60" y="130" width="96" height="8" rx="2" fill="#334e5c"/>
    <rect x="60" y="146" width="102" height="8" rx="2" fill="#334e5c"/>
    <rect x="60" y="168" width="76" height="10" rx="3" fill="#f59e0b" fill-opacity="0.45"/>
    <circle cx="240" cy="118" r="34" fill="#0d4452" stroke="#2dd4bf" stroke-width="2"/>
    <text x="240" y="115" fill="#5eead4" font-family="monospace" font-size="10" font-weight="700" text-anchor="middle">OCR 5.5</text>
    <text x="240" y="129" fill="#ccfbf1" font-family="monospace" font-size="8.5" text-anchor="middle">Ed25519</text>
    <rect x="294" y="30" width="144" height="176" rx="10" fill="#0d3542" stroke="#2dd4bf" stroke-width="1.6"/>
    <text x="366" y="56" fill="#99f6e4" font-family="monospace" font-size="10.5" font-weight="700" text-anchor="middle">REDACTED PDF</text>
    <rect x="312" y="74" width="108" height="10" rx="3" fill="#06161c"/>
    <rect x="312" y="92" width="84" height="10" rx="3" fill="#06161c"/>
    <rect x="312" y="114" width="108" height="8" rx="2" fill="#4b7282"/>
    <rect x="312" y="130" width="96" height="8" rx="2" fill="#4b7282"/>
    <rect x="312" y="146" width="102" height="8" rx="2" fill="#4b7282"/>
    <rect x="312" y="168" width="76" height="10" rx="3" fill="#06161c"/>
    <text x="366" y="193" fill="#5eead4" font-family="monospace" font-size="8.5" text-anchor="middle">ZERO LEAK VERIFIED ✓</text>
    <path d="M188 118H204M276 118H292" stroke="#2dd4bf" stroke-width="2.2"/>
  </svg>`,

  echoextract: `<svg class="schematic-svg" viewBox="0 0 480 236" width="480" height="236" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="EchoExtract-ETT structured extraction">
    <rect width="480" height="236" rx="12" fill="#08212b"/>
    <rect x="28" y="38" width="165" height="160" rx="10" fill="#0f3240" stroke="#38bdf8" stroke-width="1.4"/>
    <text x="110" y="63" fill="#bae6fd" font-family="monospace" font-size="10.5" font-weight="700" text-anchor="middle">ETT FREE-TEXT REPORT</text>
    <text x="44" y="89" fill="#9cb8c4" font-family="monospace" font-size="9">"VI no dilatado, FEVI</text>
    <text x="44" y="105" fill="#9cb8c4" font-family="monospace" font-size="9">conservada (62%), HVI</text>
    <text x="44" y="121" fill="#9cb8c4" font-family="monospace" font-size="9">concéntrica leve, válvula</text>
    <text x="44" y="137" fill="#9cb8c4" font-family="monospace" font-size="9">aórtica trivalva sin</text>
    <text x="44" y="153" fill="#9cb8c4" font-family="monospace" font-size="9">estenosis significativa..."</text>
    <rect x="210" y="88" width="62" height="60" rx="10" fill="#114656" stroke="#2dd4bf" stroke-width="1.6"/>
    <text x="241" y="115" fill="#5eead4" font-family="monospace" font-size="10" font-weight="700" text-anchor="middle">LLM</text>
    <text x="241" y="130" fill="#ccfbf1" font-family="monospace" font-size="8.5" text-anchor="middle">LoRA/NLP</text>
    <rect x="290" y="38" width="162" height="160" rx="10" fill="#0c3440" stroke="#2dd4bf" stroke-width="1.5"/>
    <text x="371" y="63" fill="#5eead4" font-family="monospace" font-size="10.5" font-weight="700" text-anchor="middle">STRUCTURED JSON</text>
    <text x="304" y="89" fill="#99f6e4" font-family="monospace" font-size="9">{</text>
    <text x="312" y="106" fill="#e2f4f8" font-family="monospace" font-size="9">"lvef_pct": 62,</text>
    <text x="312" y="123" fill="#e2f4f8" font-family="monospace" font-size="9">"lvh": "mild_conc",</text>
    <text x="312" y="140" fill="#e2f4f8" font-family="monospace" font-size="9">"aortic_sten": false,</text>
    <text x="312" y="157" fill="#e2f4f8" font-family="monospace" font-size="9">"valve_morph": "tri"</text>
    <text x="304" y="174" fill="#99f6e4" font-family="monospace" font-size="9">}</text>
  </svg>`,

  echoforward: `<svg class="schematic-svg" viewBox="0 0 480 236" width="480" height="236" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="EchoForward generative architecture">
    <rect width="480" height="236" rx="12" fill="#081f29"/>
    <rect x="28" y="48" width="115" height="140" rx="10" fill="#0e313f" stroke="#38bdf8" stroke-width="1.4"/>
    <text x="85" y="74" fill="#bae6fd" font-family="monospace" font-size="10" font-weight="700" text-anchor="middle">SOURCE A4C</text>
    <circle cx="85" cy="120" r="28" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4 3"/>
    <text x="85" y="170" fill="#9cb8c4" font-family="monospace" font-size="9.5" text-anchor="middle">LVEF = 35%</text>
    <rect x="166" y="60" width="148" height="116" rx="12" fill="#103e4d" stroke="#2dd4bf" stroke-width="1.8"/>
    <text x="240" y="88" fill="#5eead4" font-family="monospace" font-size="10.5" font-weight="700" text-anchor="middle">3D VAE v3 +</text>
    <text x="240" y="105" fill="#5eead4" font-family="monospace" font-size="10.5" font-weight="700" text-anchor="middle">Spatial Transformer</text>
    <text x="240" y="131" fill="#ffffff" font-family="monospace" font-size="10" text-anchor="middle">z' = z + α·Δz(EF)</text>
    <text x="240" y="155" fill="#99f6e4" font-family="monospace" font-size="9" text-anchor="middle">r = 0.998 · MAE 4.5%</text>
    <rect x="337" y="48" width="115" height="140" rx="10" fill="#0e3845" stroke="#2dd4bf" stroke-width="1.6"/>
    <text x="394" y="74" fill="#99f6e4" font-family="monospace" font-size="10" font-weight="700" text-anchor="middle">SYNTHESIZED</text>
    <circle cx="394" cy="120" r="21" fill="#2dd4bf" fill-opacity="0.18" stroke="#2dd4bf" stroke-width="2.4"/>
    <text x="394" y="170" fill="#5eead4" font-family="monospace" font-size="9.5" font-weight="700" text-anchor="middle">Target EF = 60%</text>
  </svg>`,

  aortademo: `<svg class="schematic-svg" viewBox="0 0 480 236" width="480" height="236" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="AortaDemo CFD pipeline">
    <rect width="480" height="236" rx="12" fill="#081e28"/>
    <path d="M135 198 C135 104, 155 50, 225 50 C288 50, 315 100, 315 188" stroke="#1e5568" stroke-width="42" stroke-linecap="round"/>
    <path d="M135 198 C135 104, 155 50, 225 50 C288 50, 315 100, 315 188" stroke="#2dd4bf" stroke-width="3" stroke-dasharray="7 5"/>
    <path d="M148 188 C148 114, 168 65, 225 65 C275 65, 298 106, 298 178" stroke="#38bdf8" stroke-width="2.2" opacity="0.8"/>
    <path d="M122 191 C124 96, 146 38, 225 38 C296 38, 328 90, 328 181" stroke="#f59e0b" stroke-width="1.8" opacity="0.75"/>
    <rect x="24" y="20" width="155" height="52" rx="8" fill="#0c313f" stroke="#2dd4bf" stroke-width="1.2"/>
    <text x="101" y="42" fill="#99f6e4" font-family="monospace" font-size="10" font-weight="700" text-anchor="middle">ANGIO-CT → CFD MESH</text>
    <text x="101" y="59" fill="#cbe3ea" font-family="sans-serif" font-size="9.5" text-anchor="middle">Transient Valve Flow</text>
    <rect x="305" y="164" width="152" height="52" rx="8" fill="#0c313f" stroke="#38bdf8" stroke-width="1.2"/>
    <text x="381" y="186" fill="#bae6fd" font-family="monospace" font-size="9.5" font-weight="700" text-anchor="middle">NIfTI + Mesh Audit</text>
    <text x="381" y="203" fill="#9cb8c4" font-family="monospace" font-size="9" text-anchor="middle">n=76 int · n=24 ext</text>
  </svg>`,

  convalv: `<svg class="schematic-svg" viewBox="0 0 480 236" width="480" height="236" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="CONVALV phonocardiogram pipeline">
    <rect width="480" height="236" rx="12" fill="#08202a"/>
    <path d="M24 122 H75 L84 78 L92 170 L100 62 L108 156 L116 105 L125 122 H195 L204 89 L211 154 L219 82 L227 146 L235 122 H315 L324 74 L332 172 L340 60 L348 152 L356 122 H456" stroke="#2dd4bf" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="32" y="24" width="184" height="44" rx="8" fill="#0e3644" stroke="#5eead4" stroke-width="1.2"/>
    <text x="124" y="44" fill="#99f6e4" font-family="monospace" font-size="10.5" font-weight="700" text-anchor="middle">CONVALV · Mel + CNN</text>
    <text x="124" y="59" fill="#cbe3ea" font-family="sans-serif" font-size="9" text-anchor="middle">Heart Sound Classification API</text>
    <rect x="276" y="172" width="172" height="40" rx="8" fill="#0e3644" stroke="#38bdf8" stroke-width="1.2"/>
    <text x="362" y="196" fill="#bae6fd" font-family="monospace" font-size="9.5" text-anchor="middle">PCG → Mel Spectrogram → REST</text>
  </svg>`,

  biomonai: `<svg class="schematic-svg" viewBox="0 0 480 236" width="480" height="236" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Keras 3 and bioMONAI interoperability">
    <rect width="480" height="236" rx="12" fill="#09212b"/>
    <rect x="34" y="65" width="124" height="106" rx="12" fill="#0f3746" stroke="#2dd4bf" stroke-width="1.5"/>
    <text x="96" y="107" fill="#5eead4" font-family="monospace" font-size="11" font-weight="700" text-anchor="middle">bioMONAI</text>
    <text x="96" y="127" fill="#cbe3ea" font-family="sans-serif" font-size="9.5" text-anchor="middle">MONAI / PyTorch</text>
    <text x="96" y="147" fill="#99f6e4" font-family="monospace" font-size="8.5" text-anchor="middle">DataLoaders &amp; Transforms</text>
    <rect x="188" y="77" width="104" height="82" rx="10" fill="#134859" stroke="#5eead4" stroke-width="1.8"/>
    <text x="240" y="111" fill="#ffffff" font-family="monospace" font-size="10.5" font-weight="700" text-anchor="middle">KERAS 3</text>
    <text x="240" y="129" fill="#99f6e4" font-family="monospace" font-size="9" text-anchor="middle">Interop Bridge</text>
    <rect x="322" y="65" width="124" height="106" rx="12" fill="#0f3746" stroke="#38bdf8" stroke-width="1.5"/>
    <text x="384" y="107" fill="#bae6fd" font-family="monospace" font-size="11" font-weight="700" text-anchor="middle">Virtual Stain</text>
    <text x="384" y="127" fill="#cbe3ea" font-family="sans-serif" font-size="9.5" text-anchor="middle">U-Net / ResNet</text>
    <text x="384" y="147" fill="#5eead4" font-family="monospace" font-size="9.5" font-weight="700" text-anchor="middle">9.4 / 10</text>
    <path d="M158 118H186M292 118H320" stroke="#5eead4" stroke-width="2.2"/>
  </svg>`,

  emboendo: `<svg class="schematic-svg" viewBox="0 0 480 236" width="480" height="236" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="EMBOENDO-DL infective endocarditis AI">
    <rect width="480" height="236" rx="12" fill="#08202a"/>
    <circle cx="136" cy="116" r="62" fill="#0e3341" stroke="#2dd4bf" stroke-width="1.6"/>
    <path d="M98 126 Q136 65 174 126 Q136 158 98 126 Z" fill="#14b8a6" fill-opacity="0.22" stroke="#5eead4" stroke-width="1.8"/>
    <circle cx="144" cy="109" r="9" fill="#f59e0b" fill-opacity="0.85"/>
    <text x="136" y="201" fill="#99f6e4" font-family="monospace" font-size="9.5" text-anchor="middle">TEE Vegetation Imaging</text>
    <rect x="234" y="50" width="214" height="134" rx="12" fill="#0e3543" stroke="#38bdf8" stroke-width="1.5"/>
    <text x="341" y="80" fill="#5eead4" font-family="monospace" font-size="11" font-weight="700" text-anchor="middle">EMBOENDO-DL</text>
    <text x="341" y="102" fill="#e2f4f8" font-family="sans-serif" font-size="10" text-anchor="middle">Embolic Risk Prediction in</text>
    <text x="341" y="118" fill="#e2f4f8" font-family="sans-serif" font-size="10" text-anchor="middle">Infective Endocarditis</text>
    <text x="341" y="144" fill="#bae6fd" font-family="monospace" font-size="9.5" text-anchor="middle">ISCIII PI23/01072</text>
    <text x="341" y="162" fill="#99f6e4" font-family="monospace" font-size="9.5" text-anchor="middle">CaixaImpulse CI24-10743</text>
    <path d="M200 116H232" stroke="#5eead4" stroke-width="2.2"/>
  </svg>`
};

window.PORTFOLIO_DATA = {
  ui: {
    es: {
      pageTitle: "Roberto Martín Gutiérrez — Ingeniero de IA Biomédica, Visión por Computador y Cloud MLOps",
      metaDesc: "Portfolio profesional de Roberto Martín Gutiérrez: Ingeniero Biomédico e Investigador en IA Clínica, Cardiología Computacional (ICICOR · HCUV), Visión por Computador, LLMs y AWS MLOps.",
      skipLink: "Saltar al contenido principal",
      aria: {
        primaryNav: "Navegación principal",
        mobileMenuOpen: "Abrir menú de navegación",
        mobileMenuClose: "Cerrar menú de navegación",
        metrics: "Indicadores verificados de impacto",
        filters: "Filtrar proyectos por área técnica",
        zoomPreview: "Ampliar captura del proyecto",
        closeZoom: "Cerrar vista ampliada"
      },
      nav: {
        projects: "Proyectos",
        research: "Publicaciones",
        experience: "Experiencia",
        stack: "Tecnologías",
        credentials: "Certificados",
        contact: "Contacto",
        downloadCv: "Descargar CV (ES)"
      },
      cvHref: "assets/cv/Roberto_Martin_Gutierrez_CV_ES.pdf",
      cvFilename: "Roberto_Martin_Gutierrez_CV_ES.pdf",
      langBtnLabel: "EN",
      langBtnTitle: "Switch language to English",
      themeToggleLabel: "Cambiar tema claro u oscuro",
      hero: {
        institution: "ICICOR · Hospital Clínico Universitario de Valladolid",
        location: "Valladolid, España",
        specialty: "Ingeniero de IA Biomédica — Cardiología Computacional, Visión por Computador y Cloud MLOps",
        badges: ["AI Engineer", "IA Sanitaria & Cardiología", "Computer Vision · LLMs · AWS"],
        lead: "Ingeniero Biomédico y Máster por la <strong>Universidad de Valladolid (UVa)</strong>. Diseño, valido e integro sistemas de <strong>IA clínica local y en nube (AWS)</strong>, visión por computador, pipelines <strong>LLM/RAG</strong> y herramientas de software verificable.",
        pillars: [
          "IA hospitalaria on-premise & AWS Terraform",
          "Visión 3D, señal fisiológica & LLMs locales",
          "Robótica ROS 2, simulación CFD & ensayos TAVI"
        ],
        ctaPrimary: "Explorar proyectos",
        ctaCv: "Descargar CV en PDF",
        portraitAlt: "Retrato profesional de Roberto Martín Gutiérrez",
        portraitRole: "MSc Biomedical Engineering · UVa",
        portraitMeta: "ORCID 0009-0004-5724-3502"
      },
      metrics: [
        {
          tag: "PTB-XL · AWS EU-WEST-3",
          value: "0.918",
          label: "Macro AUROC en test independiente de ECG 12 derivaciones (n=2.158), validado en AWS"
        },
        {
          tag: "SISTEMAS & PLATAFORMAS",
          value: "11+",
          label: "Sistemas desarrollados en IA clínica, visión 3D, NLP médico, CFD y developer tools"
        },
        {
          tag: "CIENCIA ABIERTA · DOI",
          value: "1st Author",
          label: "Preprint metodológico como autor único en SportRxiv + código/datos en Zenodo (Oct 2026)"
        },
        {
          tag: "EXCELENCIA ACADÉMICA UVA",
          value: "9,4 / 10",
          label: "Calificación TFM Máster Ing. Biomédica (UVa · ISCIII) y 9,3/10 en TFG (IBGM · CSIC)"
        }
      ],
      projectsSection: {
        eyebrow: "01 / Ingeniería e Investigación Aplicada",
        title: "Proyectos destacados y sistemas desarrollados",
        subtitle: "Arquitecturas diseñadas extremo a extremo: desde plataformas hospitalarias aisladas y despliegues auditados con Terraform en AWS hasta herramientas estáticas para agentes de IA.",
        filters: [
          { id: "all", label: "Todos", count: 11 },
          { id: "clinical", label: "IA Clínica y Cardiología", count: 9 },
          { id: "cloud", label: "Cloud & AWS MLOps", count: 1 },
          { id: "devtools", label: "DevTools & LLMs", count: 4 },
          { id: "vision", label: "Visión 3D, CFD y Señal", count: 7 }
        ],
        tier1Eyebrow: "Nivel 01 · Trabajo Destacado",
        tier1Title: "Sistemas principales y casos de estudio",
        tier2Eyebrow: "Nivel 02 · Ingeniería e Investigación Adicional",
        tier2Title: "Visión 3D, privacidad hospitalaria, simulación CFD y señal fisiológica",
        techResourcesLabel: "Recursos técnicos",
        expandLabel: "Detalles técnicos y arquitectura",
        detailsBtn: "Ficha completa",
        zoomLabel: "Ampliar"
      },
      researchSection: {
        eyebrow: "02 / Ciencia Abierta e Investigación Clínica",
        title: "Publicaciones científicas y ensayos clínicos",
        subtitle: "Investigación metodológica reproducible archivada bajo DOI junto a soporte técnico en ensayos cardiovasculares internacionales.",
        preprintTag: "PREPRINT METODOLÓGICO · SPORTRXIV & ZENODO · OCT 2026",
        preprintAuthorRole: "Autor único",
        preprintTitle: "What can be measured from the broadcast? Validity of single-camera video for football-kick kinematics and swing-leg joint loads",
        preprintAuthors: "Roberto Martín Gutiérrez · Universidad de Valladolid / Ciencia Abierta",
        preprintHighlights: [
          { k: "83 + 200", v: "Sujetos MoVi (162 vídeos) y 200 tiros Premier League" },
          { k: "r = 0.84", v: "Gemelo digital de cámara (error medio 3.9°)" },
          { k: "14.7° → 8.3°", v: "Reducción de error 3D · ICC 0.80 en flexión de rodilla" }
        ],
        preprintSummary: "Comparación sistemática frente a captura óptica de movimiento evaluando residuos reales de detección 2D (RTMW-x), elevación 3D (MotionAGFormer), gemelo geométrico de cámara y fusión multiángulo de repeticiones televisivas.",
        primaryDoiLabel: "Leer Preprint (DOI: 10.51224/SportRxiv.1131) ↗",
        zenodoLabel: "Código y Datos Zenodo ↗",
        orcidLabel: "Registro ORCID ↗",
        trialsTag: "ENSAYOS CLÍNICOS INTERNACIONALES · ICICOR / HCUV",
        trialsTitle: "Soporte de ingeniería e imagen en ensayos cardiovasculares TAVI",
        trialsIntro: "Apoyo técnico en software de investigación, flujos de imagen cardiovascular y gestión de datos dentro del Instituto de Ciencias del Corazón (ICICOR):",
        trialsRegistryHeader: "Registro ClinicalTrials.gov",
        trials: [
          {
            name: "START YOUNG",
            nct: "NCT06861361",
            scope: "Ensayo internacional aleatorizado",
            url: "https://clinicaltrials.gov/study/NCT06861361",
            desc: "Evaluación clínica comparativa de implante valvular aórtico transcatéter (TAVI) frente a sustitución quirúrgica convencional."
          },
          {
            name: "VitaFlow LIBERTY Europe",
            nct: "NCT06535659",
            scope: "Estudio multicéntrico europeo",
            url: "https://clinicaltrials.gov/study/NCT06535659",
            desc: "Evaluación multicéntrica europea de seguridad y rendimiento hemodinámico del sistema valvular aórtico TAVI."
          }
        ]
      },
      experienceSection: {
        eyebrow: "03 / Trayectoria Profesional",
        title: "Experiencia en hospitales, liderazgo robótico e I+D",
        subtitle: "Investigación traslacional dentro del entorno clínico hospitalario combinada con coordinación técnica de equipos hardware/software.",
        currentBadge: "Puesto actual",
        items: [
          {
            current: true,
            role: "Ingeniero investigador en IA y cardiología",
            org: "ICICOR · Hospital Clínico Universitario de Valladolid (HCUV)",
            period: "Mar 2026 – Actualidad",
            location: "Valladolid · On-premise & Cloud",
            desc: "Desarrollo, calibración y evaluación de modelos de IA para ecocardiografía transtorácica/transesofágica, señales fisiológicas y texto clínico (LLMs/RAG local); arquitectura de APIs FastAPI, herramientas de anonimización offline y software de apoyo a ensayos clínicos internacionales."
          },
          {
            current: false,
            role: "Responsable técnico de robótica",
            org: "ASTIBOT Ingeniería Informática, Robótica y Domótica",
            period: "Feb 2026 – Mar 2026",
            location: "Coordinación I+D",
            desc: "Coordinación técnica de los equipos de software y electrónica, integración de modelos de IA con hardware embarcado, supervisión como tutor externo de prácticas de la Universidad de Valladolid (UVa) y redacción técnica de propuestas europeas de I+D."
          },
          {
            current: false,
            role: "Programador de I+D en IA y robótica",
            org: "ASTIBOT Ingeniería Informática, Robótica y Domótica",
            period: "Oct 2025 – Feb 2026",
            location: "ROS 2 · Visión en tiempo real",
            desc: "Desarrollo de sistemas de visión artificial en tiempo real con Python, YOLOv8, ROS 2 y contenedores Docker; pipelines de percepción RGB-D y LiDAR e integración completa en plataformas robóticas móviles ROVER X y TrimBot."
          },
          {
            current: false,
            role: "Investigador en IA biomédica · Trabajo Fin de Máster (TFM)",
            org: "Universidad de Valladolid (UVa) · Colaboración ISCIII",
            period: "Ene 2025 – Jun 2025",
            location: "Calificación: 9,4 / 10",
            desc: "Tinción virtual de microscopía biomédica mediante arquitecturas U-Net y ResNet, y diseño de componentes de interoperabilidad entre Keras 3 y bioMONAI/MONAI sobre backend PyTorch."
          },
          {
            current: false,
            role: "Investigación biomédica · Trabajo Fin de Grado (TFG) y prácticas",
            org: "IBGM · CSIC / Universidad de Valladolid (UVa)",
            period: "Ene 2024 – Jul 2024",
            location: "Calificación: 9,3 / 10",
            desc: "Generación y caracterización de modelos celulares de enfermedad mitocondrial con edición genética CRISPR/Cas9 y soporte computacional al análisis cuantitativo de modelos génicos."
          }
        ]
      },
      stackSection: {
        eyebrow: "04 / Arquitectura y Herramientas",
        title: "Stack tecnológico multidisciplinar",
        subtitle: "Ejecución integral desde el entrenamiento y calibración en PyTorch hasta servidores hospitalarios aislados, infraestructura privada con Terraform en AWS y robots ROS 2.",
        coreLabel: "Núcleo principal",
        extraLabel: "Ecosistema complementario",
        groups: [
          {
            index: "01",
            title: "IA & Deep Learning",
            core: ["Python", "PyTorch", "Keras 3", "MONAI / bioMONAI"],
            extra: ["TensorFlow", "Transformers", "Calibración clínica"]
          },
          {
            index: "02",
            title: "Computer Vision & Señal",
            core: ["YOLO", "OpenCV", "3D CNN / 3D VAE", "DICOM / NIfTI"],
            extra: ["U-Net", "ResNet", "TimeSformer", "RTMW-x", "MotionAGFormer", "Espectrogramas Mel"]
          },
          {
            index: "03",
            title: "LLMs, RAG & Agentes IA",
            core: ["RAG Local", "LoRA Fine-Tuning", "Amazon Bedrock", "Qwen-VL"],
            extra: ["LangChain", "FAISS", "Embeddings", "Claude Code & Subagents"]
          },
          {
            index: "04",
            title: "AWS Cloud & MLOps",
            core: ["Terraform", "SageMaker", "Lambda (VPC)", "Step Functions"],
            extra: ["Cognito (PKCE)", "IAM", "EC2", "CloudFormation", "ECR / CodeBuild", "S3 / CloudFront", "DynamoDB / Athena"]
          },
          {
            index: "05",
            title: "Backend, Datos & Privacidad",
            core: ["FastAPI", "Orthanc DICOMweb", "Tesseract OCR 5.5", "Ed25519"],
            extra: ["Flask", "REST / OpenAPI", "Uvicorn", "SQLite", "Módulos REDCap"]
          },
          {
            index: "06",
            title: "Frontend, Desktop & DevOps",
            core: ["React / Vite", "TypeScript / JS", "Docker", "Linux"],
            extra: ["Next.js", "HTML5 / Modern CSS", "Nginx", "Git / GitHub", "Inno Setup"]
          },
          {
            index: "07",
            title: "Robótica & Simulación Física",
            core: ["ROS 2", "LiDAR & RGB-D", "CFD Transitorio", "SLAM"],
            extra: ["MoveIt", "Nav2", "Gazebo", "MATLAB", "C / C++"]
          }
        ]
      },
      credentialsSection: {
        eyebrow: "05 / Formación y Credenciales",
        title: "Base académica y certificaciones verificadas",
        subtitle: "Titulación oficial de Grado y Máster en Ingeniería Biomédica complementada con formación verificable en seguridad de IA en AWS, agentes, RAG y práctica clínica.",
        eduTitle: "Formación Académica",
        certsFeaturedTitle: "Credenciales Destacadas (AWS Oct 2026 & Práctica Clínica)",
        certsAdditionalTitle: "Formación Especializada Completada",
        education: [
          {
            primary: true,
            degree: "Máster en Ingeniería Biomédica",
            school: "Universidad de Valladolid (UVa)",
            period: "2024 – 2026",
            badge: "TFM: 9,4 / 10 · Colaboración ISCIII"
          },
          {
            primary: true,
            degree: "Grado en Ingeniería Biomédica",
            school: "Universidad de Valladolid (UVa)",
            period: "2020 – 2024",
            badge: "TFG: 9,3 / 10 (IBGM · CSIC) · Beca Santander–UVa Excelencia"
          },
          {
            primary: false,
            degree: "Bachillerato de Ciencias y Tecnología",
            school: "IES Julián Marías (Valladolid)",
            period: "2018 – 2020",
            badge: "Media: 9,58 / 10 · Matrícula de Honor"
          }
        ],
        languagesLabel: "Idiomas",
        languagesLine: "Español (nativo) · Inglés (profesional básico) · Alemán (básico)",
        certs: [
          {
            featured: true,
            kind: "Credencial AWS Skill Builder",
            issuer: "Amazon Web Services (AWS)",
            date: "Oct 2026",
            title: "Security, Compliance, and Governance for AI Solutions (CloudFormation & AI Governance)",
            url: "https://skillbuilder.aws/learn/YFACXFGBSJ/security-compliance-and-governance-for-ai-solutions-espaol-de-espaa/F2PFEJET8Z",
            linkLabel: "Verificar credencial ↗"
          },
          {
            featured: true,
            kind: "Credencial AWS Skill Builder",
            issuer: "Amazon Web Services (AWS)",
            date: "Oct 2026",
            title: "Amazon EC2 Basics (Cloud Compute & AWS Architecture)",
            url: "https://skillbuilder.aws/learn/V59J92TZE2/amazon-ec2-basics-espaol-latam/NAMFRSGAA4",
            linkLabel: "Verificar credencial ↗"
          },
          {
            featured: true,
            kind: "Curso AWS Completado",
            issuer: "Amazon Web Services (AWS)",
            date: "Oct 2026",
            title: "Introduction to AWS Identity and Access Management (IAM)",
            url: null
          },
          {
            featured: true,
            kind: "Certificación Regulatoria Clínica",
            issuer: "Global Health Network",
            date: "2026",
            title: "ICH Good Clinical Practice (GCP) E6(R3)",
            url: null
          },
          {
            featured: false,
            kind: "Curso técnico",
            issuer: "Amazon Web Services",
            date: "2026",
            title: "Amazon Bedrock Getting Started",
            url: null
          },
          {
            featured: false,
            kind: "Programa especializado",
            issuer: "Anthropic",
            date: "2026",
            title: "Claude Code in Action · Subagents · Claude Code 101",
            url: null
          },
          {
            featured: false,
            kind: "Curso técnico",
            issuer: "IBM",
            date: "2026",
            title: "RAG for Enhanced AI Outputs",
            url: null
          },
          {
            featured: false,
            kind: "Curso técnico",
            issuer: "Hugging Face",
            date: "2026",
            title: "AI Agents Fundamentals",
            url: null
          },
          {
            featured: false,
            kind: "Curso práctico",
            issuer: "Kaggle",
            date: "2026",
            title: "Computer Vision Certification",
            url: null
          },
          {
            featured: false,
            kind: "Acreditación académica",
            issuer: "ACCIS · UVa",
            date: "2026",
            title: "Congreso de Cardiología (14 h) & Tutor Externo UVa",
            url: null
          }
        ]
      },
      contactSection: {
        eyebrow: "06 / Contacto Directo",
        title: "¿Hablamos sobre IA biomédica, visión por computador o ingeniería MLOps?",
        desc: "Disponible para colaboraciones de investigación, proyectos de inteligencia artificial aplicada a salud y roles de ingeniería de IA o software clínico. Teléfono móvil omitido públicamente por privacidad.",
        primaryEmailBtn: "Escribir a convderover@gmail.com",
        copyEmailBtn: "Copiar correo",
        copiedMsg: "¡Correo copiado al portapapeles!",
        cvGroupLabel: "Currículum Vitae verificable (PDF sin teléfono):",
        cvEsBtn: "Descargar CV (ES · PDF)",
        cvEnBtn: "Download Resume (EN · PDF)",
        channels: [
          {
            title: "LinkedIn · Roberto Martín Gutiérrez",
            meta: "Perfil profesional ↗",
            url: "https://www.linkedin.com/in/roberto-mart%C3%ADn-guti%C3%A9rrez-ingenier%C3%ADa-biom%C3%A9dica/",
            external: true
          },
          {
            title: "GitHub · @convderover",
            meta: "Repositorios y código ↗",
            url: "https://github.com/convderover",
            external: true
          },
          {
            title: "ORCID · 0009-0004-5724-3502",
            meta: "Registro científico ↗",
            url: "https://orcid.org/0009-0004-5724-3502",
            external: true
          },
          {
            title: "CardioCloud · AWS Engineering Study",
            meta: "Caso interactivo + Vídeo 25 s ↗",
            url: "cardiocloud/index.html",
            external: false
          }
        ]
      },
      footer: {
        left: "© 2026 Roberto Martín Gutiérrez · Ingeniería Biomédica & IA (Valladolid, España)",
        right: "Sin rastreadores externos · Tipografía autoalojada · Listo para GitHub Pages"
      },
      modal: {
        highlightsTitle: "Arquitectura y aportaciones clave",
        stackTitle: "Tecnologías empleadas",
        closeLabel: "Cerrar ventana de detalles"
      }
    },

    en: {
      pageTitle: "Roberto Martín Gutiérrez — Biomedical AI Engineer, Computer Vision & Cloud MLOps",
      metaDesc: "Professional portfolio of Roberto Martín Gutiérrez: Biomedical Engineer & AI Researcher in Computational Cardiology (ICICOR · HCUV), Computer Vision, LLMs, and AWS MLOps.",
      skipLink: "Skip to main content",
      aria: {
        primaryNav: "Primary navigation",
        mobileMenuOpen: "Open navigation menu",
        mobileMenuClose: "Close navigation menu",
        metrics: "Verified impact metrics",
        filters: "Filter projects by technical domain",
        zoomPreview: "Enlarge project preview",
        closeZoom: "Close enlarged preview"
      },
      nav: {
        projects: "Projects",
        research: "Publications",
        experience: "Experience",
        stack: "Tech Stack",
        credentials: "Credentials",
        contact: "Contact",
        downloadCv: "Download CV (EN)"
      },
      cvHref: "assets/cv/Roberto_Martin_Gutierrez_CV_EN.pdf",
      cvFilename: "Roberto_Martin_Gutierrez_CV_EN.pdf",
      langBtnLabel: "ES",
      langBtnTitle: "Cambiar idioma a Español",
      themeToggleLabel: "Toggle light or dark color scheme",
      hero: {
        institution: "ICICOR · University Clinical Hospital of Valladolid",
        location: "Valladolid, Spain",
        specialty: "Biomedical AI Engineer — Computational Cardiology, Computer Vision & Cloud MLOps",
        badges: ["AI Engineer", "Medical AI & Cardiology", "Computer Vision · LLMs · AWS"],
        lead: "Biomedical Engineer with an MSc from the <strong>University of Valladolid (UVa)</strong>. I design, validate, and deploy <strong>on-premise clinical AI and AWS cloud workflows</strong>, computer vision pipelines, <strong>local LLM/RAG</strong> systems, and verifiable software tools.",
        pillars: [
          "On-premise hospital AI & AWS Terraform",
          "3D vision, physiological signals & local LLMs",
          "ROS 2 robotics, transient CFD & TAVI trials"
        ],
        ctaPrimary: "Explore projects",
        ctaCv: "Download PDF Resume",
        portraitAlt: "Professional portrait of Roberto Martín Gutiérrez",
        portraitRole: "MSc Biomedical Engineering · UVa",
        portraitMeta: "ORCID 0009-0004-5724-3502"
      },
      metrics: [
        {
          tag: "PTB-XL · AWS EU-WEST-3",
          value: "0.918",
          label: "Held-out Macro AUROC on 12-lead ECG test set (n=2,158), validated end-to-end on AWS"
        },
        {
          tag: "SYSTEMS & PLATFORMS",
          value: "11+",
          label: "Engineered systems across clinical AI, 3D vision, medical NLP, CFD & developer tools"
        },
        {
          tag: "OPEN SCIENCE · DOI",
          value: "1st Author",
          label: "Sole-author methodological preprint on SportRxiv + open Zenodo archive (Oct 2026)"
        },
        {
          tag: "ACADEMIC EXCELLENCE UVA",
          value: "9.4 / 10",
          label: "MSc Biomedical Eng. Thesis grade (UVa · ISCIII) & 9.3/10 BSc Thesis (IBGM · CSIC)"
        }
      ],
      projectsSection: {
        eyebrow: "01 / Applied Engineering & Research",
        title: "Featured projects & engineered systems",
        subtitle: "End-to-end technical architectures spanning air-gapped hospital cardiology platforms, Terraform-audited AWS deployments, and static analysis tools for AI coding agents.",
        filters: [
          { id: "all", label: "All", count: 11 },
          { id: "clinical", label: "Clinical AI & Cardiology", count: 9 },
          { id: "cloud", label: "Cloud & AWS MLOps", count: 1 },
          { id: "devtools", label: "DevTools & LLMs", count: 4 },
          { id: "vision", label: "3D Vision, CFD & Signal", count: 7 }
        ],
        tier1Eyebrow: "Tier 01 · Featured Work",
        tier1Title: "Flagship systems & engineering case studies",
        tier2Eyebrow: "Tier 02 · Additional Engineering & Research",
        tier2Title: "3D biomechanics, hospital privacy, CFD simulation & physiological signals",
        techResourcesLabel: "Technical resources",
        expandLabel: "Technical details & architecture",
        detailsBtn: "Full specs",
        zoomLabel: "Zoom"
      },
      researchSection: {
        eyebrow: "02 / Open Science & Clinical Research",
        title: "Scientific publications & clinical trials",
        subtitle: "DOI-archived reproducible research software alongside engineering support for international multicenter cardiovascular trials.",
        preprintTag: "METHODOLOGICAL PREPRINT · SPORTRXIV & ZENODO · OCT 2026",
        preprintAuthorRole: "Sole author",
        preprintTitle: "What can be measured from the broadcast? Validity of single-camera video for football-kick kinematics and swing-leg joint loads",
        preprintAuthors: "Roberto Martín Gutiérrez · University of Valladolid / Open Science",
        preprintHighlights: [
          { k: "83 + 200", v: "MoVi participants (162 videos) & 200 Premier League shots" },
          { k: "r = 0.84", v: "Camera-geometry digital twin (3.9° mean discrepancy)" },
          { k: "14.7° → 8.3°", v: "Simulated 3D error reduction · 0.80 peak knee flexion ICC" }
        ],
        preprintSummary: "Systematic method-comparison benchmark against optical motion capture evaluating empirical 2D detector residuals (RTMW-x), 3D lifting (MotionAGFormer), camera digital twins, and multi-angle broadcast replay fusion.",
        primaryDoiLabel: "Read Preprint (DOI: 10.51224/SportRxiv.1131) ↗",
        zenodoLabel: "Zenodo Code & Data ↗",
        orcidLabel: "ORCID Record ↗",
        trialsTag: "INTERNATIONAL CLINICAL TRIALS · ICICOR / HCUV",
        trialsTitle: "Research engineering & imaging support in TAVI cardiovascular trials",
        trialsIntro: "Supporting research software, cardiovascular imaging workflows, and trial data operations at the Heart Science Institute (ICICOR):",
        trialsRegistryHeader: "ClinicalTrials.gov Registry",
        trials: [
          {
            name: "START YOUNG",
            nct: "NCT06861361",
            scope: "International randomized trial",
            url: "https://clinicaltrials.gov/study/NCT06861361",
            desc: "Comparative clinical evaluation of transcatheter aortic valve implantation (TAVI) versus conventional surgical valve replacement."
          },
          {
            name: "VitaFlow LIBERTY Europe",
            nct: "NCT06535659",
            scope: "European multicenter study",
            url: "https://clinicaltrials.gov/study/NCT06535659",
            desc: "European multicenter clinical investigation assessing safety and hemodynamic performance of the VitaFlow LIBERTY TAVI system."
          }
        ]
      },
      experienceSection: {
        eyebrow: "03 / Career Timeline",
        title: "Hospital research, robotics leadership & R&D",
        subtitle: "Translational AI engineering inside a university hospital paired with multidisciplinary hardware/software team leadership.",
        currentBadge: "Current role",
        items: [
          {
            current: true,
            role: "AI & Computational Cardiology Research Engineer",
            org: "ICICOR · University Clinical Hospital of Valladolid (HCUV)",
            period: "Mar 2026 – Present",
            location: "Valladolid · On-premise & Cloud",
            desc: "Developing, calibrating, and evaluating AI models for transthoracic/transesophageal echocardiography, physiological signals, and clinical reports (local LLMs/RAG); building FastAPI services, offline PDF anonymization suites, and software supporting international clinical trials."
          },
          {
            current: false,
            role: "Robotics Technical Lead",
            org: "ASTIBOT Robotics & AI Engineering",
            period: "Feb 2026 – Mar 2026",
            location: "R&D Team Coordination",
            desc: "Coordinated software and electronics engineering teams, led AI–hardware integration, supervised University of Valladolid (UVa) external interns, and co-authored European R&D funding proposals."
          },
          {
            current: false,
            role: "AI & Robotics R&D Programmer",
            org: "ASTIBOT Robotics & AI Engineering",
            period: "Oct 2025 – Feb 2026",
            location: "ROS 2 · Real-time Vision",
            desc: "Built real-time computer vision pipelines using Python, YOLOv8, ROS 2, and Docker; implemented RGB-D and LiDAR perception and full systems integration on ROVER X and TrimBot robotic platforms."
          },
          {
            current: false,
            role: "Biomedical AI Researcher · MSc Thesis",
            org: "University of Valladolid (UVa) · ISCIII Collaboration",
            period: "Jan 2025 – Jun 2025",
            location: "Thesis Grade: 9.4 / 10",
            desc: "Microscopy virtual staining with U-Net and ResNet architectures, and design of Keras 3–bioMONAI/MONAI interoperability components running on PyTorch."
          },
          {
            current: false,
            role: "Biomedical Research · BSc Thesis & Intern",
            org: "IBGM · CSIC / University of Valladolid (UVa)",
            period: "Jan 2024 – Jul 2024",
            location: "Thesis Grade: 9.3 / 10",
            desc: "Developed CRISPR/Cas9 mitochondrial disease cellular models and provided computational support for quantitative genetic model analysis."
          }
        ]
      },
      stackSection: {
        eyebrow: "04 / Technical Architecture",
        title: "Multidisciplinary engineering stack",
        subtitle: "End-to-end delivery from PyTorch model training and calibration to air-gapped hospital servers, Terraform-managed AWS VPC workflows, and ROS 2 robots.",
        coreLabel: "Core tools",
        extraLabel: "Complementary ecosystem",
        groups: [
          {
            index: "01",
            title: "AI & Deep Learning",
            core: ["Python", "PyTorch", "Keras 3", "MONAI / bioMONAI"],
            extra: ["TensorFlow", "Transformers", "Clinical Calibration"]
          },
          {
            index: "02",
            title: "Computer Vision & Signals",
            core: ["YOLO", "OpenCV", "3D CNN / 3D VAE", "DICOM / NIfTI"],
            extra: ["U-Net", "ResNet", "TimeSformer", "RTMW-x", "MotionAGFormer", "Mel Spectrograms"]
          },
          {
            index: "03",
            title: "LLMs, RAG & AI Agents",
            core: ["Local RAG", "LoRA Fine-Tuning", "Amazon Bedrock", "Qwen-VL"],
            extra: ["LangChain", "FAISS", "Embeddings", "Claude Code & Subagents"]
          },
          {
            index: "04",
            title: "AWS Cloud & MLOps",
            core: ["Terraform", "SageMaker", "Lambda (VPC)", "Step Functions"],
            extra: ["Cognito (PKCE)", "IAM", "EC2", "CloudFormation", "ECR / CodeBuild", "S3 / CloudFront", "DynamoDB / Athena"]
          },
          {
            index: "05",
            title: "Backend, Data & Privacy",
            core: ["FastAPI", "Orthanc DICOMweb", "Tesseract OCR 5.5", "Ed25519"],
            extra: ["Flask", "REST / OpenAPI", "Uvicorn", "SQLite", "REDCap Modules"]
          },
          {
            index: "06",
            title: "Frontend, Desktop & DevOps",
            core: ["React / Vite", "TypeScript / JS", "Docker", "Linux"],
            extra: ["Next.js", "HTML5 / Modern CSS", "Nginx", "Git / GitHub", "Inno Setup"]
          },
          {
            index: "07",
            title: "Robotics & Physical Simulation",
            core: ["ROS 2", "LiDAR & RGB-D", "Transient CFD", "SLAM"],
            extra: ["MoveIt", "Nav2", "Gazebo", "MATLAB", "C / C++"]
          }
        ]
      },
      credentialsSection: {
        eyebrow: "05 / Education & Credentials",
        title: "Academic foundation & verified credentials",
        subtitle: "MSc & BSc in Biomedical Engineering paired with verifiable 2026 credentials in AWS AI governance, cloud architecture, agentic workflows, and clinical GCP.",
        eduTitle: "Academic Degrees",
        certsFeaturedTitle: "Highlighted Credentials (AWS Oct 2026 & Clinical GCP)",
        certsAdditionalTitle: "Completed Specialized Coursework",
        education: [
          {
            primary: true,
            degree: "MSc in Biomedical Engineering",
            school: "University of Valladolid (UVa)",
            period: "2024 – 2026",
            badge: "Thesis: 9.4 / 10 · ISCIII Collaboration"
          },
          {
            primary: true,
            degree: "BSc in Biomedical Engineering",
            school: "University of Valladolid (UVa)",
            period: "2020 – 2024",
            badge: "Thesis: 9.3 / 10 (IBGM · CSIC) · Santander–UVa Excellence Scholarship"
          },
          {
            primary: false,
            degree: "Science & Technology High School Diploma",
            school: "IES Julián Marías (Valladolid)",
            period: "2018 – 2020",
            badge: "GPA: 9.58 / 10 · Academic Honors"
          }
        ],
        languagesLabel: "Languages",
        languagesLine: "Spanish (native) · English (limited working) · German (elementary)",
        certs: [
          {
            featured: true,
            kind: "AWS Skill Builder Credential",
            issuer: "Amazon Web Services (AWS)",
            date: "Oct 2026",
            title: "Security, Compliance, and Governance for AI Solutions (CloudFormation & AI Governance)",
            url: "https://skillbuilder.aws/learn/YFACXFGBSJ/security-compliance-and-governance-for-ai-solutions-espaol-de-espaa/F2PFEJET8Z",
            linkLabel: "Verify credential ↗"
          },
          {
            featured: true,
            kind: "AWS Skill Builder Credential",
            issuer: "Amazon Web Services (AWS)",
            date: "Oct 2026",
            title: "Amazon EC2 Basics (Cloud Compute & AWS Architecture)",
            url: "https://skillbuilder.aws/learn/V59J92TZE2/amazon-ec2-basics-espaol-latam/NAMFRSGAA4",
            linkLabel: "Verify credential ↗"
          },
          {
            featured: true,
            kind: "Completed AWS Course",
            issuer: "Amazon Web Services (AWS)",
            date: "Oct 2026",
            title: "Introduction to AWS Identity and Access Management (IAM)",
            url: null
          },
          {
            featured: true,
            kind: "Clinical Regulatory Certificate",
            issuer: "Global Health Network",
            date: "2026",
            title: "ICH Good Clinical Practice (GCP) E6(R3)",
            url: null
          },
          {
            featured: false,
            kind: "Technical course",
            issuer: "Amazon Web Services",
            date: "2026",
            title: "Amazon Bedrock Getting Started",
            url: null
          },
          {
            featured: false,
            kind: "Specialized program",
            issuer: "Anthropic",
            date: "2026",
            title: "Claude Code in Action · Subagents · Claude Code 101",
            url: null
          },
          {
            featured: false,
            kind: "Technical course",
            issuer: "IBM",
            date: "2026",
            title: "RAG for Enhanced AI Outputs",
            url: null
          },
          {
            featured: false,
            kind: "Technical course",
            issuer: "Hugging Face",
            date: "2026",
            title: "AI Agents Fundamentals",
            url: null
          },
          {
            featured: false,
            kind: "Practical course",
            issuer: "Kaggle",
            date: "2026",
            title: "Computer Vision Certification",
            url: null
          },
          {
            featured: false,
            kind: "Academic accreditation",
            issuer: "ACCIS · UVa",
            date: "2026",
            title: "Cardiology Congress (14 h) & UVa External Supervisor",
            url: null
          }
        ]
      },
      contactSection: {
        eyebrow: "06 / Direct Contact",
        title: "Let's connect on Biomedical AI, Computer Vision, or Cloud MLOps",
        desc: "Open to research collaborations, healthcare AI engineering projects, and medical software roles. Mobile phone omitted publicly by privacy preference.",
        primaryEmailBtn: "Email convderover@gmail.com",
        copyEmailBtn: "Copy email",
        copiedMsg: "Email copied to clipboard!",
        cvGroupLabel: "Verifiable Curriculum Vitae (phone-redacted PDF):",
        cvEsBtn: "Download Spanish CV (PDF)",
        cvEnBtn: "Download English Resume (PDF)",
        channels: [
          {
            title: "LinkedIn · Roberto Martín Gutiérrez",
            meta: "Professional profile ↗",
            url: "https://www.linkedin.com/in/roberto-mart%C3%ADn-guti%C3%A9rrez-ingenier%C3%ADa-biom%C3%A9dica/",
            external: true
          },
          {
            title: "GitHub · @convderover",
            meta: "Repositories & code ↗",
            url: "https://github.com/convderover",
            external: true
          },
          {
            title: "ORCID · 0009-0004-5724-3502",
            meta: "Scientific record ↗",
            url: "https://orcid.org/0009-0004-5724-3502",
            external: true
          },
          {
            title: "CardioCloud · AWS Engineering Study",
            meta: "Interactive study + 25s Video ↗",
            url: "cardiocloud/index.html",
            external: false
          }
        ]
      },
      footer: {
        left: "© 2026 Roberto Martín Gutiérrez · Biomedical Engineering & AI (Valladolid, Spain)",
        right: "Zero external trackers · Self-hosted typography · GitHub Pages ready"
      },
      modal: {
        highlightsTitle: "Architecture & key contributions",
        stackTitle: "Technologies used",
        closeLabel: "Close details dialog"
      }
    }
  },

  projects: [
    {
      id: "cardiocloud",
      tier: "featured",
      layout: "flagship",
      categories: ["cloud", "clinical"],
      yearEs: "Oct 2026",
      yearEn: "Oct 2026",
      chromeMetaEs: "eu-west-3 · Terraform · PTB-XL v1.0.3",
      chromeMetaEn: "eu-west-3 · Terraform · PTB-XL v1.0.3",
      image: {
        src: "assets/projects/cardiocloud-hero.webp",
        width: 1920,
        height: 1080,
        altEs: "Portada e interfaz AWS ampliada de CardioCloud para clasificación trazable de ECG de 12 derivaciones",
        altEn: "CardioCloud public edition cover and enlarged AWS UI fragments for traceable 12-lead ECG classification"
      },
      gallery: [
        {
          id: "cover",
          labelEs: "Vista general",
          labelEn: "Overview",
          src: "assets/projects/cardiocloud-hero.webp",
          width: 1920,
          height: 1080,
          altEs: "Vista editorial de CardioCloud con ECG de 12 derivaciones y revisión humana",
          altEn: "CardioCloud editorial overview showing 12-lead ECG and persisted human review"
        },
        {
          id: "waveform",
          labelEs: "ECG 12 derivaciones",
          labelEn: "12-Lead UI",
          src: "assets/projects/cardiocloud-waveform.webp",
          width: 822,
          height: 454,
          altEs: "Captura real de las 12 derivaciones del registro PTB-XL 00009 en AWS",
          altEn: "Actual AWS UI capture of the 12-lead ECG waveform for PTB-XL record 00009"
        },
        {
          id: "arch",
          labelEs: "Arquitectura AWS",
          labelEn: "AWS Diagram",
          src: "assets/projects/cardiocloud-arch.webp",
          width: 1600,
          height: 1020,
          altEs: "Diagrama simplificado de arquitectura AWS de CardioCloud en eu-west-3",
          altEn: "Simplified CardioCloud AWS architecture diagram in eu-west-3"
        }
      ],
      visibilityEs: "AWS Validado · Edición Pública v2",
      visibilityEn: "AWS Validated · Public Edition v2",
      isPrivate: false,
      categoryLabelEs: "AWS Cloud MLOps, Terraform & IA Cardiológica",
      categoryLabelEn: "AWS Cloud MLOps, Terraform & Cardiology AI",
      nameEs: "CardioCloud",
      nameEn: "CardioCloud",
      subtitleEs: "Del modelo ECG de 12 derivaciones al flujo cloud trazable en AWS",
      subtitleEn: "From 12-lead ECG model to traceable AWS cloud workflow",
      titleEs: "CardioCloud — Del Modelo ECG al Flujo Cloud Trazable en AWS",
      titleEn: "CardioCloud — From 12-Lead ECG Model to Traceable AWS Cloud Workflow",
      briefEs: "Prototipo end-to-end entrenado sobre PTB-XL v1.0.3 y desplegado con Terraform en AWS (eu-west-3): autenticación Cognito PKCE, procesamiento privado en VPC, inferencia en SageMaker CPU, validación estricta «Validate before display» sobre Bedrock y revisión humana persistida en DynamoDB.",
      briefEn: "End-to-end biomedical AI prototype trained on patient-safe PTB-XL v1.0.3 folds and delivered with Terraform on live AWS (eu-west-3): Cognito PKCE, private VPC processing, SageMaker CPU inference, 'Validate before display' Bedrock checks, and persisted DynamoDB human review.",
      summaryEs: "Prototipo end-to-end de IA biomédica entrenado sobre PTB-XL v1.0.3 (particiones seguras por paciente) e implementado con Terraform y validación real en AWS (eu-west-3): Cognito PKCE, procesamiento privado en VPC (Lambda + Step Functions), inferencia en SageMaker CPU, decisión «Validate before display» sobre Bedrock con fallback determinista, revisión humana requerida y persistida en DynamoDB, y edición pública con evidencia derivada por allowlist y product cut de 25 s.",
      summaryEn: "End-to-end biomedical AI prototype trained on patient-safe PTB-XL v1.0.3 folds and delivered with Terraform on live AWS (eu-west-3): Cognito PKCE, private-subnet Lambda & Step Functions, digest-pinned SageMaker CPU inference, 'Validate before display' Bedrock checks with deterministic fallback, required human review persisted in DynamoDB, allowlisted public evidence derivatives, and a 25s product cut.",
      kpisEs: ["0.918 Macro AUROC (PTB-XL)", "Terraform · AWS eu-west-3", "80 Tests · 6/6 Teardown"],
      kpisEn: ["0.918 Macro AUROC (PTB-XL)", "Terraform · AWS eu-west-3", "80 Checks · 6/6 Teardown"],
      tagsEs: ["PyTorch", "Terraform", "AWS SageMaker", "Amazon Bedrock", "Lambda (VPC)", "Step Functions", "Cognito PKCE", "DynamoDB", "Athena / Parquet", "CodeBuild / ECR"],
      tagsEn: ["PyTorch", "Terraform", "AWS SageMaker", "Amazon Bedrock", "Lambda (VPC)", "Step Functions", "Cognito PKCE", "DynamoDB", "Athena / Parquet", "CodeBuild / ECR"],
      coreTagCount: 4,
      bulletsEs: [
        "Rol y decisiones de ingeniería (AI/ML & Cloud Engineering con herramientas asistidas por IA): entrenamiento PyTorch sobre PTB-XL (2.158 registros de test independiente, Macro AUROC 0.918: NORM 0.937, STTC 0.929, CD 0.917, HYP 0.904, MI 0.902), infraestructura Terraform con IAM de mínimo privilegio y subredes privadas.",
        "Decisión técnica clave («Validate before display»): validación estricta de esquema y evidencia antes de mostrar texto generativo. En la ejecución real en AWS, Bedrock fue invocado, su salida falló la validación, se mostró el fallback determinista etiquetado y se requirió y persistió la revisión humana en DynamoDB.",
        "Edición pública verificada: product cut de 25 s (1080p/30fps con diseño sonoro procedural original) + showcase extendido de 45 s, fragmentos UI ampliados con ajuste uniforme de exposición conservando los recortes fuente intactos, recuperación/auditoría de desmontaje (6/6 estados limpios) y derivados JSON públicos por allowlist sin identificadores operativos de cuenta."
      ],
      bulletsEn: [
        "My role & engineering decisions (AI/ML & Cloud Engineering, end-to-end delivery with AI-assisted tooling): PyTorch model on held-out PTB-XL (2,158 test records, 0.918 Macro AUROC: NORM 0.937, STTC 0.929, CD 0.917, HYP 0.904, MI 0.902), Terraform IaC, scoped IAM roles, and private VPC processing.",
        "Concrete architectural safeguard ('Validate before display'): strict schema/evidence checks gate generative text. Observed live on AWS: Bedrock was invoked, its output failed validation, the labelled deterministic fallback was served, and required human review was persisted in DynamoDB.",
        "Public edition boundaries & media: 25-second 1080p product cut with original procedural sound design + 45s silent showcase, exposure-adjusted UI fragments paired with unadjusted source crops, scoped teardown recovery (6/6 states cleared), and allowlisted public JSON derivatives excluding operational AWS identifiers."
      ],
      noteEs: "Edición pública (CardioCloud-portfolio-v2-public): infraestructura retirada tras validación; los derivados públicos excluyen IDs de cuenta, ARNs, URLs operativas y facturación.",
      noteEn: "Public edition (CardioCloud-portfolio-v2-public): infrastructure safely retired post-validation; allowlisted public derivatives exclude account IDs, ARNs, endpoints, and billing payloads.",
      links: [
        { labelEs: "Abrir Caso Interactivo ↗", labelEn: "Interactive Case Study ↗", url: "cardiocloud/index.html", role: "primary" },
        { labelEs: "Ver Product Cut (25 s) ↗", labelEn: "Watch Product Cut (25s) ↗", url: "cardiocloud/index.html#experience", role: "secondary" },
        { labelEs: "PDF (6 págs.) ↗", labelEn: "Case Study PDF (6p) ↗", url: "cardiocloud/CardioCloud-case-study.pdf", role: "resource" },
        { labelEs: "Arquitectura AWS (SVG) ↗", labelEn: "AWS Architecture (SVG) ↗", url: "cardiocloud/diagrams/architecture-detailed.svg", role: "resource" }
      ]
    },

    {
      id: "ecocardia",
      tier: "featured",
      layout: "featured-clinical",
      categories: ["clinical", "vision", "devtools"],
      yearEs: "2026 · ISCIII DTS25/00100",
      yearEn: "2026 · ISCIII DTS25/00100",
      chromeMetaEs: "LAN Hospitalaria · MODEL_FROZEN SHA",
      chromeMetaEn: "Hospital LAN · MODEL_FROZEN SHA",
      svgKey: "ecocardia",
      visibilityEs: "I+D Clínico Privado · ICICOR / HCUV",
      visibilityEn: "Private Clinical R&D · ICICOR / HCUV",
      isPrivate: true,
      categoryLabelEs: "Plataforma Hospitalaria de Ecocardiografía IA",
      categoryLabelEn: "Hospital Echocardiography AI Platform",
      nameEs: "ECOCARDIA AI",
      nameEn: "ECOCARDIA AI",
      subtitleEs: "Apoyo local a la interpretación de ecocardiografía transtorácica",
      subtitleEn: "On-premise transthoracic echocardiography clinical AI hub",
      titleEs: "ECOCARDIA — Apoyo Local a la Interpretación de Ecocardiografía Transtorácica",
      titleEn: "ECOCARDIA — On-Premise Transthoracic Echocardiography Clinical AI Hub",
      briefEs: "Plataforma hospitalaria 100% on-premise en ICICOR – HCUV que integra enrutamiento anatómico DICOM/Orthanc, modelos calibrados (YOLO, 3D CNN, TimeSformer, Qwen-VL), decisión trazable DERIVAR / NO DERIVAR y asistente RAG local en GPU.",
      briefEn: "100% on-premise hospital platform at ICICOR – HCUV integrating DICOM/Orthanc anatomy gating, calibrated models (YOLO, 3D CNN, TimeSformer, Qwen-VL), traceable referral decisions, and a local GPU RAG assistant.",
      summaryEs: "Plataforma hospitalaria 100% local (sin APIs externas) desarrollada en ICICOR – HCUV que integra clasificación automática de vistas, enrutamiento anatómico DICOM, modelos especializados calibrados (YOLO, 3D CNN, TimeSformer, Qwen-VL), decisión trazable DERIVAR / NO DERIVAR y asistente clínico RAG local en GPU.",
      summaryEn: "100% on-premise hospital platform at ICICOR – HCUV integrating echocardiographic view classification, DICOM anatomy gating, specialized calibrated models (YOLO, 3D CNN, TimeSformer, Qwen-VL), traceable referral decisions, and a local GPU RAG clinical assistant.",
      kpisEs: ["Inferencia 100% Local", "HVI física en mm", "DICOMweb / Orthanc"],
      kpisEn: ["100% On-Premise GPU", "Physical LVH (mm)", "DICOMweb / Orthanc"],
      tagsEs: ["PyTorch", "YOLO / 3D CNN", "TimeSformer", "FastAPI + React", "Qwen-VL", "DICOM / Orthanc", "RAG Local GPU"],
      tagsEn: ["PyTorch", "YOLO / 3D CNN", "TimeSformer", "FastAPI + React", "Qwen-VL", "DICOM / Orthanc", "Local GPU RAG"],
      coreTagCount: 4,
      bulletsEs: [
        "Pipeline clínico congelado y verificable criptográficamente por hash (MODEL_FROZEN), separando estrictamente runtime validado, experimentos y datos fuera de Git.",
        "Medición física de hipertrofia ventricular izquierda (HVI) en milímetros por clip independiente del fabricante, evaluación de derrame pericárdico, esclerosis valvular aórtica e insuficiencia mitral con puntos de operación prerregistrados.",
        "Servidor hospitalario FastAPI en LAN + visor clínico ECOCARDIA Studio (React/Vite) integrado con Orthanc/DICOMweb, gestión longitudinal y asistente RAG local con sesiones de GPU y streaming."
      ],
      bulletsEn: [
        "Cryptographically hash-verified frozen clinical runtime (MODEL_FROZEN) strictly isolating validated inference code from patient DICOMs and weights.",
        "Vendor-independent physical (mm) left ventricular hypertrophy (LVH) measurement per clip, pericardial effusion, aortic sclerosis, and mitral regurgitation operating points.",
        "Hospital LAN FastAPI server + React/Vite ECOCARDIA Studio viewer integrated with Orthanc/DICOMweb, longitudinal study tracking, and local GPU streaming RAG assistant."
      ],
      noteEs: "Investigación clínica institucional privada (ICICOR · Hospital Clínico Universitario de Valladolid · Proyecto ISCIII DTS25/00100). Se resume únicamente la arquitectura técnica pública sin código propietario ni datos clínicos.",
      noteEn: "Private institutional clinical R&D (ICICOR · University Clinical Hospital of Valladolid · Grant ISCIII DTS25/00100). Only public-safe high-level system architecture is summarized.",
      links: []
    },

    {
      id: "convity",
      tier: "featured",
      layout: "featured-product",
      categories: ["devtools"],
      yearEs: "Oct 2026",
      yearEn: "Oct 2026",
      chromeMetaEs: "convity · CFG Diff & L0–L4 Inspector",
      chromeMetaEn: "convity · CFG Diff & L0–L4 Inspector",
      image: {
        src: "assets/projects/convity-explained.webp",
        width: 1280,
        height: 800,
        altEs: "Interfaz real de Convity comparando grafos de flujo antes y después de un cambio hecho por un agente de IA",
        altEn: "Convity interface comparing before and after control-flow graphs following an AI coding agent change"
      },
      gallery: [
        {
          id: "changes",
          labelEs: "Changes (Diff CFG)",
          labelEn: "Changes (CFG Diff)",
          src: "assets/projects/convity-explained.webp",
          width: 1280,
          height: 800,
          altEs: "Modo Changes de Convity comparando el grafo de flujo antes y después de un cambio",
          altEn: "Convity Changes mode comparing before and after control-flow graphs"
        },
        {
          id: "understand",
          labelEs: "Understand",
          labelEn: "Understand",
          src: "assets/projects/convity-understand.webp",
          width: 1280,
          height: 800,
          altEs: "Modo Understand de Convity recorriendo decisiones del grafo de flujo paso a paso",
          altEn: "Convity Understand mode walking step-by-step through control-flow branches"
        },
        {
          id: "vibe",
          labelEs: "VibeConvity (L0)",
          labelEn: "VibeConvity (L0)",
          src: "assets/projects/convity-vibe.webp",
          width: 1280,
          height: 800,
          altEs: "Modo VibeConvity explicando el comportamiento del código sin jerga y enlazado a la línea exacta",
          altEn: "VibeConvity mode summarizing code behavior in plain language linked to exact lines"
        }
      ],
      visibilityEs: "Repo Público · Alpha Privada",
      visibilityEn: "Public Repo · Private Alpha",
      isPrivate: false,
      categoryLabelEs: "Developer Tools & Comprensión de Código IA",
      categoryLabelEn: "Developer Tools & AI Code Understanding",
      nameEs: "Convity",
      nameEn: "Convity",
      subtitleEs: "Comprensión visual y local de cambios generados por agentes de IA",
      subtitleEn: "Visual & local code understanding for AI coding agents",
      titleEs: "Convity — Comprensión Visual y Local de Cambios Generados por Agentes de IA",
      titleEn: "Convity — Visual & Local Code Understanding for AI Coding Agents",
      briefEs: "Producto local para Windows 11 (con skills /convity en Claude Code y $convity en Codex) que convierte funciones JS/TS/Python en grafos de flujo (CFG) interactivos, compara el antes/después entre commits y explica cambios de L0 a L4 sin ejecutar código ni enviar telemetría.",
      briefEn: "Local Windows 11 developer application (with skills for Claude Code and Codex) turning JS/TS/Python functions into interactive control-flow graphs (CFGs), side-by-side structural diffs, and L0–L4 explanations with zero code execution or telemetry.",
      summaryEs: "Aplicación local para Windows 11 (con skills integradas /convity para Claude Code y $convity para Codex) que transforma funciones JS/TS/Python en grafos de flujo de control (CFG) interactivos, compara el antes y después entre commits y explica el comportamiento desde lenguaje llano (L0 / VibeConvity) hasta detalle técnico (L4) sin ejecutar el proyecto ni enviar telemetría.",
      summaryEn: "Local Windows 11 developer tool (with native skills for Claude Code and Codex) turning JS/TS/Python functions into interactive control-flow graphs (CFGs), side-by-side before/after structural diffs, and L0–L4 explanations without executing user code or sending telemetry.",
      kpisEs: ["100% Análisis Estático Local", "CFG Interactivo L0–L4", "Skills Claude Code & Codex"],
      kpisEn: ["100% Local Static Analysis", "Interactive L0–L4 CFG", "Claude Code & Codex Skills"],
      tagsEs: ["TypeScript / JS", "Python AST", "Control-Flow Graphs", "Claude Code / Codex", "Análisis Estático", "HTML / CSS"],
      tagsEn: ["TypeScript / JS", "Python AST", "Control-Flow Graphs", "Claude Code / Codex", "Static Analysis", "HTML / CSS"],
      coreTagCount: 4,
      bulletsEs: [
        "Cuatro modos complementarios: Understand (recorrido paso a paso por decisiones del CFG), Explore (grafo de llamadas e hipótesis por nombre), Changes (grafos Before/After entre versiones Git) y VibeConvity (resumen sin jerga enlazado a la línea exacta).",
        "Rigor epistémico explícito: cada afirmación lleva su base trazable (observado en el código, declarado por el autor, hipótesis o límite del análisis estático).",
        "Privacidad total por diseño: análisis 100% local sin ejecución de scripts del repositorio analizado, sin IA externa activa en la alpha y cero telemetría."
      ],
      bulletsEn: [
        "Four exploration modes: Understand (step-by-step CFG branch walkthrough), Explore (caller/callee graph), Changes (side-by-side before/after flow graphs across Git commits), and VibeConvity.",
        "Explicit epistemic provenance: every statement is tagged as observed in code, author-declared, hypothesis, or static-analysis limit.",
        "Zero-telemetry local execution: reads source files statically on the user's machine without running untrusted scripts or external API calls."
      ],
      noteEs: "Repositorio público con documentación, capturas reales y acceso a la alpha privada en GitHub (sin demo web pública simulada).",
      noteEn: "Public repository with documentation, real product captures, and private-alpha registration on GitHub (desktop-local alpha, not a public web demo).",
      links: [
        { labelEs: "Repositorio GitHub ↗", labelEn: "GitHub Repository ↗", url: "https://github.com/convderover/convity-app", role: "primary" }
      ]
    },

    {
      id: "kick-biomechanics",
      tier: "secondary",
      mediaTheme: "scientific-light",
      categories: ["vision"],
      yearEs: "Oct 2026 · DOI Publicado",
      yearEn: "Oct 2026 · Published DOI",
      image: {
        src: "assets/projects/kick-graphical-abstract.webp",
        width: 1280,
        height: 689,
        altEs: "Graphical abstract del estudio de biomecánica de golpeo desde vídeo de retransmisión frente a captura óptica",
        altEn: "Graphical abstract of the broadcast video football-kick biomechanics validation study against optical motion capture"
      },
      gallery: [
        {
          id: "abstract",
          labelEs: "Validez ICC",
          labelEn: "ICC Validity",
          src: "assets/projects/kick-graphical-abstract.webp",
          width: 1280,
          height: 689,
          altEs: "Matriz de acuerdo ICC frente a captura óptica conservando su escala científica original",
          altEn: "ICC agreement heatmap against optical motion capture in its original scientific color scale"
        },
        {
          id: "recon",
          labelEs: "Pose 3D",
          labelEn: "3D Pose",
          src: "assets/projects/kick-recon.webp",
          width: 1280,
          height: 760,
          altEs: "Reconstrucción cinemática 3D frente a captura óptica de movimiento",
          altEn: "3D kinematic pose reconstruction compared against optical motion capture"
        },
        {
          id: "field",
          labelEs: "Geometría TV",
          labelEn: "Broadcast Twin",
          src: "assets/projects/kick-field.webp",
          width: 1280,
          height: 740,
          altEs: "Gemelo digital de geometría de cámara de retransmisión deportiva",
          altEn: "Broadcast camera-geometry digital twin across football pitch positions"
        }
      ],
      visibilityEs: "Ciencia Abierta · SportRxiv + Zenodo",
      visibilityEn: "Open Science · SportRxiv + Zenodo",
      isPrivate: false,
      categoryLabelEs: "Visión por Computador 3D & Biomecánica",
      categoryLabelEn: "3D Computer Vision & Biomechanics",
      nameEs: "Broadcast Kick Biomechanics",
      nameEn: "Broadcast Kick Biomechanics",
      subtitleEs: "Validez del vídeo monocámara frente a captura óptica en laboratorio",
      subtitleEn: "Single-camera broadcast video validity vs. optical motion capture",
      titleEs: "Broadcast Kick Biomechanics — Validez del Vídeo Monocámara frente a Captura Óptica",
      titleEn: "Broadcast Kick Biomechanics — Single-Camera Video Validity vs. Optical MoCap",
      briefEs: "Estudio metodológico y librería Python reproducible (SportRxiv + Zenodo) que cuantifica qué cinemática 3D y cargas articulares pueden medirse desde vídeo de retransmisión (80 px, 25 fps) frente a MoCap óptico.",
      briefEn: "Validation benchmark and reproducible Python suite (SportRxiv + Zenodo) quantifying 3D kicking kinematics and swing-leg joint loads from broadcast video (80 px, 25 fps) against optical MoCap.",
      summaryEs: "Estudio completo (preprint en SportRxiv + librería Python reproducible en Zenodo y GitHub) que cuantifica qué cinemática 3D y cargas articulares de la pierna de golpeo pueden medirse realmente desde vídeo de retransmisión deportiva (80 px, 25 fps) frente a captura óptica en laboratorio.",
      summaryEn: "End-to-end validation study (SportRxiv preprint + Zenodo/GitHub Python suite) quantifying 3D kicking kinematics and swing-leg joint loads from broadcast-resolution video against laboratory optical motion capture.",
      kpisEs: ["DOI SportRxiv.1131", "83 Sujetos + 200 Tiros", "Error 14.7° → 8.3°"],
      kpisEn: ["DOI SportRxiv.1131", "83 Subjects + 200 Shots", "Error 14.7° → 8.3°"],
      tagsEs: ["Python", "RTMW-x", "MotionAGFormer", "Dinámica Inversa", "YOLOX", "Elevación 3D", "Gemelo Digital", "Pytest"],
      tagsEn: ["Python", "RTMW-x", "MotionAGFormer", "Inverse Dynamics", "YOLOX", "3D Pose Lifting", "Digital Twin", "Pytest"],
      coreTagCount: 4,
      bulletsEs: [
        "Modelado empírico del error 2D real en 200 tiros de Premier League (3DSP) con RTMW-x: más del doble de error que en vídeo de laboratorio del mismo tamaño en píxeles.",
        "Gemelo digital de cámara para 162 grabaciones reales MoVi que predice el error agregado real con correlación r = 0.84 (discrepancia media 3.9°).",
        "Soluciones validadas por sujeto: la fusión de 3 ángulos de repetición eleva el acuerdo en extensión de cadera de 0.40 a 0.78 (ICC 0.80 en flexión de rodilla), y el ajuste fino del elevador 3D bajo ruido de broadcast reduce el error simulado de 14.7° a 8.3°."
      ],
      bulletsEn: [
        "Empirical 2D detector residual bank measured on 200 Premier League broadcast shots (RTMW-x), proving independent Gaussian noise misestimates real residuals.",
        "Camera-geometry digital twin across 162 real MoVi recordings predicting real aggregate video errors with r = 0.84 (mean discrepancy 3.9°).",
        "Subject-cross-validated remedies: 3-replay fusion raises hip-extension agreement from 0.40 to 0.78 (knee peak flexion ICC 0.80), while a broadcast-adapted 3D lifter cuts simulated angular error from 14.7° to 8.3°."
      ],
      noteEs: "Código fuente completo (librería golpeo/, tests unitarios, banco numérico de residuos 2D y figuras EN/ES) archivado abiertamente con DOI.",
      noteEn: "Full reproducible Python codebase, unit tests, numerical 2D-residual bank, and bilingual figures archived openly under DOI.",
      links: [
        { labelEs: "Preprint SportRxiv ↗", labelEn: "SportRxiv Preprint ↗", url: "https://doi.org/10.51224/SportRxiv.1131", role: "primary" },
        { labelEs: "Zenodo DOI ↗", labelEn: "Zenodo DOI ↗", url: "https://doi.org/10.5281/zenodo.23439408", role: "resource" },
        { labelEs: "GitHub ↗", labelEn: "GitHub ↗", url: "https://github.com/convderover/broadcast-kick-biomechanics", role: "resource" }
      ]
    },

    {
      id: "anonimicicor",
      tier: "secondary",
      categories: ["clinical", "devtools"],
      yearEs: "2026 · ICICOR",
      yearEn: "2026 · ICICOR",
      svgKey: "anonimicicor",
      visibilityEs: "Software Institucional Privado",
      visibilityEn: "Private Institutional Software",
      isPrivate: true,
      categoryLabelEs: "Privacidad Clínica & Software Hospitalario",
      categoryLabelEn: "Clinical Privacy & Hospital Software",
      nameEs: "AnonimICICOR",
      nameEn: "AnonimICICOR",
      subtitleEs: "Anonimización irreversible offline de informes clínicos PDF",
      subtitleEn: "Offline irreversible clinical PDF anonymization suite",
      titleEs: "AnonimICICOR — Anonimización Irreversible Offline de PDFs Clínicos",
      titleEn: "AnonimICICOR — Offline Irreversible Clinical PDF Anonymization Suite",
      briefEs: "Suite offline de escritorio y servidor hospitalario que detecta, audita y redacta irreversiblemente datos identificativos (PHI) en PDFs clínicos nativos y escaneados preservando su maquetación.",
      briefEn: "Offline desktop and hospital server suite detecting, auditing, and irreversibly redacting PHI across native and scanned clinical PDFs while preserving document layout.",
      summaryEs: "Aplicación de escritorio y servidor institucional para detectar, auditar y redactar irreversiblemente datos identificativos (PHI) en informes clínicos PDF nativos y escaneados conservando su maquetación original.",
      summaryEn: "Offline desktop and institutional server suite for detecting, reviewing, and irreversibly redacting PHI from native and scanned clinical PDF reports while preserving layout.",
      kpisEs: ["Tesseract 5.5 Offline", "Licencias Ed25519", "REDCap + Windows .exe"],
      kpisEn: ["Offline Tesseract 5.5", "Ed25519 Licenses", "REDCap + Windows .exe"],
      tagsEs: ["Python", "Tesseract OCR 5.5", "Ed25519", "PHP / REDCap", "JavaScript", "Docker", "Inno Setup"],
      tagsEn: ["Python", "Tesseract OCR 5.5", "Ed25519", "PHP / REDCap", "JavaScript", "Docker", "Inno Setup"],
      coreTagCount: 4,
      bulletsEs: [
        "Redacción real sobre coordenadas PDF nativas + OCR local Tesseract 5.5 autocontenido (ES/EN), limpieza de metadatos/XML/adjuntos y verificación automática anti-fugas sobre el texto extraíble final.",
        "Reconocimiento especializado de patrones hospitalarios (NHC, Historia, CIPA, episodio, firmas médicas), procesamiento por lotes con manifiesto de auditoría sin PII y tabla cifrada/separada de equivalencias.",
        "Cinco modalidades de entrega: instalador autónomo Instalar_anonimICICOR.exe sin dependencias externas, edición portátil USB, contenedor Docker institucional, entorno dev y External Module para REDCap con licencias firmadas Ed25519."
      ],
      bulletsEn: [
        "True coordinate-level PDF redaction + bundled offline Tesseract 5.5 OCR (ES/EN), metadata/XML stripping, and automated zero-leak verification.",
        "Hospital-specific entity detection (NHC, CIPA, clinician signatures), batch processing with PII-free audit manifests, and manual bounding-box redaction.",
        "Delivered in 5 modes: dependency-free Windows installer (.exe), portable USB package, institutional Docker service, and REDCap External Module with offline Ed25519-signed licenses."
      ],
      noteEs: "Herramienta institucional interna desarrollada en ICICOR para preparación segura de cohortes clínicas.",
      noteEn: "Internal institutional tool engineered at ICICOR for privacy-preserving clinical research cohorts.",
      links: []
    },

    {
      id: "echoextract",
      tier: "secondary",
      categories: ["clinical", "devtools"],
      yearEs: "2026 · ICICOR",
      yearEn: "2026 · ICICOR",
      svgKey: "echoextract",
      visibilityEs: "Portal Revisores Activo",
      visibilityEn: "Live Reviewer Portal",
      isPrivate: true,
      categoryLabelEs: "Clinical NLP & LLMs Locales",
      categoryLabelEn: "Clinical NLP & Local LLMs",
      nameEs: "EchoExtract-ETT",
      nameEn: "EchoExtract-ETT",
      subtitleEs: "Extracción estructurada de informes clínicos mediante LLMs locales",
      subtitleEn: "Local LLM/NLP structured extraction from echo reports",
      titleEs: "EchoExtract-ETT — Extracción Estructurada de Informes Clínicos con LLMs",
      titleEn: "EchoExtract-ETT — LLM/NLP Structured Extraction from Echo Reports",
      briefEs: "Pipeline NLP y LLMs adaptados con LoRA en GPU local para convertir informes narrativos de ecocardiografía transtorácica en variables clínicas estructuradas sin exponer texto a APIs externas.",
      briefEn: "On-premise GPU LLM (LoRA) and clinical NLP pipeline transforming Spanish free-text echocardiography reports into structured research variables without external cloud APIs.",
      summaryEs: "Pipeline de procesamiento de lenguaje natural y LLMs adaptados (LoRA) en GPU local para transformar informes narrativos de ecocardiografía transtorácica en variables clínicas estructuradas listas para investigación.",
      summaryEn: "Local GPU LLM (LoRA) and clinical NLP pipeline converting free-text transthoracic echocardiography reports into structured quantitative variables for cardiovascular research.",
      kpisEs: ["LLMs Locales / LoRA", "Extracción Estructurada", "Sesiones 72 h Revisores"],
      kpisEn: ["Local GPU LLMs / LoRA", "Structured JSON Output", "72h Reviewer Portal"],
      tagsEs: ["Python", "LLMs / LoRA", "Clinical NLP", "Gradio GPU", "HTML / Vercel"],
      tagsEn: ["Python", "LLMs / LoRA", "Clinical NLP", "Gradio GPU", "HTML / Vercel"],
      coreTagCount: 4,
      bulletsEs: [
        "Extracción automatizada y normalizada de parámetros ventriculares, valvulares y hallazgos diagnósticos a partir de texto clínico no estructurado en español.",
        "Ejecución de la inferencia íntegramente en GPU local para preservar la confidencialidad hospitalaria.",
        "Portal web estático autocontenido con flujo de solicitud y concesión temporal (72 h) de credenciales de evaluación para revisores clínicos."
      ],
      bulletsEn: [
        "Automated extraction and normalization of ventricular measurements, valve findings, and diagnostic conclusions from Spanish free-text reports.",
        "On-premise GPU inference ensuring clinical data never traverses third-party cloud LLM APIs.",
        "Self-contained reviewer request portal managing time-bounded (72h) evaluation sessions."
      ],
      noteEs: "Portal público de solicitud para revisores activo en Vercel; el motor de inferencia corre en GPU local.",
      noteEn: "Reviewer request landing page live on Vercel while the LLM inference engine runs on local GPU hardware.",
      links: [
        { labelEs: "Portal Revisores ↗", labelEn: "Reviewer Portal ↗", url: "https://echoextractett.vercel.app", role: "primary" }
      ]
    },

    {
      id: "echoforward",
      tier: "secondary",
      categories: ["clinical", "vision"],
      yearEs: "2026",
      yearEn: "2026",
      svgKey: "echoforward",
      visibilityEs: "Prototipo Investigación IA",
      visibilityEn: "AI Research Prototype",
      isPrivate: true,
      categoryLabelEs: "Vídeo Médico Generativo · Deep Learning",
      categoryLabelEn: "Generative Medical Video · Deep Learning",
      nameEs: "EchoForward",
      nameEn: "EchoForward",
      subtitleEs: "Síntesis condicional de vídeo ecocardiográfico guiada por FEVI",
      subtitleEn: "LVEF-conditioned echocardiography video synthesis",
      titleEs: "EchoForward — Generación Condicional de Vídeo Ecocardiográfico por FEVI",
      titleEn: "EchoForward — LVEF-Conditioned Echocardiography Video Generation",
      briefEs: "Arquitectura generativa 3D VAE + Spatial Transformer que sintetiza cómo latiría un ecocardiograma A4C bajo una fracción de eyección (LVEF 30–70%) objetivo conservando la identidad anatómica.",
      briefEn: "3D VAE + Conditional Spatial Transformer synthesizing realistic A4C beating-heart videos conditioned on target LVEF (30–70%) while preserving anatomical identity.",
      summaryEs: "Modelo generativo profundo que, dado un ecocardiograma apical 4 cámaras (A4C) y una fracción de eyección (LVEF) objetivo, sintetiza en vídeo cómo latiría ese corazón bajo la función sistólica indicada.",
      summaryEn: "Deep generative video architecture that takes an A4C echocardiogram and a target LVEF (30–70%) to synthesize realistic beating-heart videos conditioned on systolic function.",
      kpisEs: ["EF MAE ~4.5%", "Correlación ~0.998", "VAE SSIM ~0.80"],
      kpisEn: ["EF MAE ~4.5%", "Correlation ~0.998", "VAE SSIM ~0.80"],
      tagsEs: ["PyTorch", "3D VAE", "Spatial Transformer", "EchoNet-Dynamic", "Gradio"],
      tagsEn: ["PyTorch", "3D VAE", "Spatial Transformer", "EchoNet-Dynamic", "Gradio"],
      coreTagCount: 4,
      bulletsEs: [
        "Fase 1: 3D Variational Autoencoder (VAE v3) con strides temporales asimétricos que comprime clips de 16 frames a un espacio latente espacial-temporal (256×4×7×7) alcanzando SSIM ~0.80.",
        "Fase 2: Conditional Spatial Transformer con formulación residual (z_pred = z_src + α·Δz), garantizando identidad exacta cuando ΔEF = 0 y transiciones suaves entre 30% y 70% de FEVI.",
        "Entrenado y evaluado sobre EchoNet-Dynamic con correlación ~0.998 y error absoluto medio de FEVI ~4.5%."
      ],
      bulletsEn: [
        "Stage 1: 3D Variational Autoencoder (VAE v3) with asymmetric temporal strides compressing 16-frame clips into a (256, 4, 7, 7) latent space (reconstruction SSIM ~0.80).",
        "Stage 2: Residual Conditional Spatial Transformer (z_pred = z_src + α·Δz) preserving anatomical identity at ΔEF = 0 across 30–70% target LVEF.",
        "Evaluated on EchoNet-Dynamic achieving ~4.5% EF MAE and ~0.998 EF correlation."
      ],
      noteEs: "Prototipo privado de investigación entrenado sobre el benchmark público EchoNet-Dynamic.",
      noteEn: "Private research prototype trained on the public EchoNet-Dynamic benchmark.",
      links: []
    },

    {
      id: "aortademo",
      tier: "secondary",
      categories: ["vision", "clinical"],
      yearEs: "Oct 2026",
      yearEn: "Oct 2026",
      svgKey: "aortademo",
      visibilityEs: "Prototipo CFD · Privacidad Filtrada",
      visibilityEn: "CFD Prototype · Privacy-Filtered",
      isPrivate: true,
      categoryLabelEs: "Simulación Cardiovascular & CFD",
      categoryLabelEn: "Cardiovascular Simulation & CFD",
      nameEs: "AortaDemo",
      nameEn: "AortaDemo",
      subtitleEs: "Reconstrucción desde Angio-TC y CFD transitorio valvular aórtico",
      subtitleEn: "Angio-CT reconstruction & transient aortic valve CFD",
      titleEs: "AortaDemo — Reconstrucción desde Angio-TC y CFD Transitorio Valvular Aórtico",
      titleEn: "AortaDemo — Angio-CT Reconstruction & Transient Aortic Valve CFD",
      briefEs: "Pipeline automatizado para reconstruir raíz aórtica y válvula desde angio-TC, generar mallado volumétrico, ejecutar CFD hemodinámico transitorio local y auditar convergencia numérica.",
      briefEn: "Automated pipeline reconstructing aortic root and valve geometry from CTA, generating volumetric meshes, running local transient hemodynamic CFD, and auditing numerical convergence.",
      summaryEs: "Pipeline computacional para reconstruir geometría de aorta y válvula aórtica desde angio-TC, generar mallado volumétrico, ejecutar simulaciones CFD transitorias locales y auditar controles de calidad numérica.",
      summaryEn: "Research pipeline reconstructing aortic root and valve geometry from CTA, generating computational meshes, running local transient CFD, and auditing numerical quality gates.",
      kpisEs: ["Cohorte n=76 + n=24", "Fantomas NIfTI Sintéticos", "Auditoría Numérica"],
      kpisEn: ["Cohort n=76 + n=24", "Synthetic NIfTI Phantoms", "Numerical QA Gates"],
      tagsEs: ["Python", "CFD Transitorio", "Angio-TC / NIfTI", "Mallado 3D", "WSL / Linux", "Pytest"],
      tagsEn: ["Python", "Transient CFD", "Angio-CT / NIfTI", "3D Meshing", "WSL / Linux", "Pytest"],
      coreTagCount: 4,
      bulletsEs: [
        "Automatización de preparación geométrica, generación de mallas, simulación hemodinámica transitoria y rescate técnico con controles estrictos de convergencia y calidad de malla.",
        "Evaluación documentada con transparencia metodológica sobre cohorte interna (76 candidatos) y externa congelada (24 candidatos), etiquetando explícitamente alcance no asistencial.",
        "Incluye volúmenes NIfTI sintéticos, política estricta de exclusión de datos de pacientes y batería de tests automatizados."
      ],
      bulletsEn: [
        "Automated geometry preparation, volumetric meshing, local transient hemodynamic CFD runs, and automated numerical quality auditing.",
        "Transparently benchmarked across internal (n=76) and frozen external (n=24) research cohorts with strict non-clinical research scope labeling.",
        "Ships with synthetic NIfTI phantoms and automated privacy/export-scope verification."
      ],
      noteEs: "Prototipo de investigación numérica (clinical_validation: false; sin datos ni geometrías de pacientes en repositorio).",
      noteEn: "Numerical research prototype (clinical_validation: false; patient geometries strictly excluded).",
      links: []
    },

    {
      id: "convalv",
      tier: "secondary",
      categories: ["clinical", "vision"],
      yearEs: "Ene 2026",
      yearEn: "Jan 2026",
      svgKey: "convalv",
      visibilityEs: "Repositorio Público",
      visibilityEn: "Public Repository",
      isPrivate: false,
      categoryLabelEs: "Procesamiento de Señal Cardíaca",
      categoryLabelEn: "Cardiac Signal Processing",
      nameEs: "CONVALV",
      nameEn: "CONVALV",
      subtitleEs: "Clasificación de sonidos cardíacos con espectrogramas Mel y CNN",
      subtitleEn: "Heart sound classifier via Mel spectrograms & CNN REST API",
      titleEs: "CONVALV — Clasificación de Sonidos Cardíacos con CNN y Espectrogramas Mel",
      titleEn: "CONVALV — Heart Sound Classifier via Mel Spectrograms & CNN REST API",
      briefEs: "Clasificador de fonocardiogramas (PCG) que transforma audio cardíaco en espectrogramas Mel para inferencia con CNN, servido mediante API REST en Python e interfaz web.",
      briefEn: "Phonocardiogram (PCG) classifier transforming cardiac audio into Mel spectrograms for CNN inference, served via a decoupled Python REST API and web client.",
      summaryEs: "Sistema de clasificación automática de fonocardiogramas (sonidos cardíacos) que transforma audio fisiológico en espectrogramas Mel, ejecuta inferencia mediante redes convolucionales (CNN) y expone resultados vía API REST y frontend web.",
      summaryEn: "Phonocardiogram classification pipeline transforming heart sound recordings into Mel spectrograms for CNN inference, served through a Python REST API and web interface.",
      kpisEs: ["Espectrogramas Mel", "Clasificador CNN", "API REST + Frontend"],
      kpisEn: ["Mel Spectrograms", "CNN Classifier", "REST API + Web UI"],
      tagsEs: ["Python", "CNN Deep Learning", "Espectrogramas Mel", "API REST", "JavaScript"],
      tagsEn: ["Python", "CNN Deep Learning", "Mel Spectrograms", "REST API", "JavaScript"],
      coreTagCount: 4,
      bulletsEs: [
        "Preprocesado acústico de señales fonocardiográficas y extracción tiempo-frecuencia mediante espectrogramas en escala Mel.",
        "Arquitectura CNN entrenada para detección de patrones acústicos valvulares.",
        "Arquitectura desacoplada con carpeta backend/ (API REST en Python) y frontend/ en JavaScript."
      ],
      bulletsEn: [
        "Acoustic preprocessing and Mel-scale time-frequency spectrogram extraction from phonocardiogram signals.",
        "Convolutional neural network trained to classify heart sound patterns.",
        "Decoupled Python REST backend and JavaScript web frontend published on GitHub."
      ],
      noteEs: "Código fuente disponible en GitHub (el antiguo dominio temporal de demostración fue retirado).",
      noteEn: "Source code available on GitHub (the former temporary demo domain has been retired).",
      links: [
        { labelEs: "Repositorio GitHub ↗", labelEn: "GitHub Repository ↗", url: "https://github.com/convderover/convalv-project", role: "primary" }
      ]
    },

    {
      id: "biomonai-tfm",
      tier: "secondary",
      categories: ["vision", "clinical"],
      yearEs: "2025 · TFM 9,4/10",
      yearEn: "2025 · MSc Thesis 9.4/10",
      svgKey: "biomonai",
      visibilityEs: "Open Source Fork · UVa / ISCIII",
      visibilityEn: "Open Source Fork · UVa / ISCIII",
      isPrivate: false,
      categoryLabelEs: "Imagen Biomédica & Frameworks DL",
      categoryLabelEn: "Biomedical Imaging & DL Frameworks",
      nameEs: "Virtual Staining & bioMONAI",
      nameEn: "Virtual Staining & bioMONAI",
      subtitleEs: "Tinción virtual microscópica e interoperabilidad Keras 3 – MONAI",
      subtitleEn: "Microscopy virtual staining & Keras 3 – MONAI interoperability",
      titleEs: "Tinción Virtual e Interoperabilidad Keras 3 – bioMONAI/MONAI sobre PyTorch",
      titleEn: "Virtual Staining & Keras 3 – bioMONAI/MONAI Interoperability on PyTorch",
      briefEs: "Trabajo Fin de Máster (9,4/10, UVa · ISCIII): modelos U-Net / ResNet de tinción virtual microscópica y puente nativo para entrenar modelos Keras 3 sobre pipelines bioMONAI/MONAI en PyTorch.",
      briefEn: "MSc Thesis (9.4/10, UVa · ISCIII): U-Net / ResNet microscopy virtual staining and native interoperability bridging Keras 3 models into bioMONAI/MONAI PyTorch pipelines.",
      summaryEs: "Trabajo Fin de Máster (9,4/10) en colaboración entre la Universidad de Valladolid y el ISCIII: modelos U-Net / ResNet para tinción virtual microscópica e integración nativa de modelos Keras 3 dentro del ecosistema bioMONAI/MONAI.",
      summaryEn: "MSc Thesis (9.4/10, UVa & ISCIII collaboration): U-Net / ResNet microscopy virtual staining and native interoperability bridging Keras 3 models with bioMONAI/MONAI pipelines on PyTorch.",
      kpisEs: ["Calificación 9,4 / 10", "Keras 3 ↔ MONAI", "U-Net / ResNet"],
      kpisEn: ["Grade 9.4 / 10", "Keras 3 ↔ MONAI", "U-Net / ResNet"],
      tagsEs: ["PyTorch", "Keras 3", "MONAI / bioMONAI", "U-Net / ResNet", "Jupyter"],
      tagsEn: ["PyTorch", "Keras 3", "MONAI / bioMONAI", "U-Net / ResNet", "Jupyter"],
      coreTagCount: 4,
      bulletsEs: [
        "Diseño de adaptadores y flujos de entrenamiento para utilizar modelos multi-backend de Keras 3 directamente sobre pipelines de datos, transformaciones y métricas biomédicas de bioMONAI/MONAI ejecutando en PyTorch.",
        "Aplicación experimental a problemas de tinción virtual de imagen microscópica con arquitecturas encoder-decoder (U-Net / ResNet) y tutoriales reproducibles."
      ],
      bulletsEn: [
        "Engineered interoperability components enabling multi-backend Keras 3 models to train and evaluate seamlessly inside bioMONAI/MONAI PyTorch data and transform pipelines.",
        "Validated on biomedical microscopy virtual staining tasks using U-Net and ResNet backbones."
      ],
      noteEs: "Investigación realizada en colaboración con el Instituto de Salud Carlos III (ISCIII).",
      noteEn: "Conducted in collaboration with Instituto de Salud Carlos III (ISCIII).",
      links: [
        { labelEs: "Fork bioMONAI en GitHub ↗", labelEn: "bioMONAI Fork on GitHub ↗", url: "https://github.com/convderover/bioMONAI", role: "primary" }
      ]
    },

    {
      id: "emboendo",
      tier: "secondary",
      categories: ["clinical", "vision"],
      yearEs: "2026 · PI23/01072 & CI24-10743",
      yearEn: "2026 · PI23/01072 & CI24-10743",
      svgKey: "emboendo",
      visibilityEs: "Proyectos ISCIII & CaixaImpulse",
      visibilityEn: "ISCIII & CaixaImpulse Research",
      isPrivate: true,
      categoryLabelEs: "IA en Endocarditis Infecciosa",
      categoryLabelEn: "Infective Endocarditis AI Research",
      nameEs: "EMBOENDO-DL & CaixaImpulse",
      nameEn: "EMBOENDO-DL & CaixaImpulse",
      subtitleEs: "Predicción de riesgo embólico sobre ecocardiografía ETE con Deep Learning",
      subtitleEn: "Deep learning embolic risk prediction from TEE vegetation imaging",
      titleEs: "EMBOENDO-DL & CaixaImpulse — Predicción de Riesgo Embólico mediante Deep Learning",
      titleEn: "EMBOENDO-DL & CaixaImpulse — Deep Learning for Endocarditis Embolic Risk",
      briefEs: "Colaboración en los proyectos competitivos ISCIII PI23/01072 y CaixaImpulse CI24-10743 en ICICOR – HCUV aplicando Deep Learning sobre ecocardiografía transesofágica (ETE) para predecir riesgo embólico.",
      briefEn: "Research contribution to competitive grants ISCIII PI23/01072 and CaixaImpulse CI24-10743 at ICICOR – HCUV, applying deep learning to TEE vegetation imaging for embolism risk prediction.",
      summaryEs: "Colaboración en los proyectos competitivos EMBOENDO-DL (ISCIII PI23/01072) y CaixaImpulse (CI24-10743) en ICICOR – HCUV, aplicando Deep Learning sobre ecocardiografía transesofágica (ETE) para analizar vegetaciones y predecir eventos embólicos.",
      summaryEn: "Research contributor to EMBOENDO-DL (ISCIII PI23/01072) and CaixaImpulse (CI24-10743) at ICICOR – HCUV, applying deep learning to transesophageal echocardiography (TEE) vegetation imaging for embolism prediction.",
      kpisEs: ["ISCIII PI23/01072", "CaixaImpulse CI24-10743", "ETE / Deep Learning"],
      kpisEn: ["ISCIII PI23/01072", "CaixaImpulse CI24-10743", "TEE / Deep Learning"],
      tagsEs: ["PyTorch", "Deep Learning", "Ecocardiografía ETE", "Imagen Cardiovascular", "Investigación Traslacional"],
      tagsEn: ["PyTorch", "Deep Learning", "TEE Echocardiography", "Cardiovascular Imaging", "Translational Research"],
      coreTagCount: 4,
      bulletsEs: [
        "Apoyo al equipo de investigación computacional del ICICOR en segmentación, análisis de imagen de vegetaciones valvulares sobre ETE y modelado predictivo de riesgo embólico en endocarditis infecciosa.",
        "Integrado en dos proyectos competitivos nacionales y de innovación biomédica: ISCIII PI23/01072 y Fundación ”la Caixa” CaixaImpulse CI24-10743."
      ],
      bulletsEn: [
        "Supporting ICICOR's computational cardiology team on TEE vegetation imaging pipelines and deep learning models predicting embolic complications in infective endocarditis.",
        "Backed by competitive national health research grant ISCIII PI23/01072 and CaixaImpulse Health Innovation grant CI24-10743."
      ],
      noteEs: "Investigación traslacional activa en el Instituto de Ciencias del Corazón (ICICOR · HCUV).",
      noteEn: "Active translational research at the Heart Science Institute (ICICOR · HCUV).",
      links: []
    }
  ],

  schematics: SVG_SCHEMATICS
};
