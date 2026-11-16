import type { GalleryCategory } from './propertyData';

export type Language = 'pt' | 'es' | 'en';

export interface TranslatedGalleryItem {
  title: string;
  subtitle: string;
  description: string;
  alt: string;
}

export interface TranslatedHighlight {
  title: string;
  category: string;
  description: string;
}

export interface TranslatedAccordion {
  title: string;
  summary: string;
  items: string[];
}

export interface TranslatedLandmark {
  name: string;
  region: string;
  distance: string;
  travelTime: string;
  description: string;
  alt: string;
}

export interface TranslatedTopic {
  number: string;
  title: string;
  points: { label?: string; text: string }[];
}

export interface SiteTranslations {
  docTitle: string;
  header: {
    brand: string;
    navAria: string;
    mobileNavAria: string;
    openMenu: string;
    closeMenu: string;
    cta: string;
    languageSelectorLabel: string;
    nav: {
      mansao: string;
      ambientes: string;
      localizacao: string;
      simulador: string;
    };
  };
  hero: {
    eyebrow: string;
    h1: string;
    description: string;
    ctaPrimary: string;
    ctaSecondary: string;
    fallbackTitle: string;
    heroAlt: string;
    askingPriceLabel: string;
    liveRatePrefix: string;
    attributes: {
      label: string;
      value: string;
    }[];
  };
  showcase: {
    eyebrow: string;
    title: string;
    intro: string;
    dossierEyebrow: string;
    dossierTitle: string;
    dossierDesc: string;
    dossierButton: string;
    highlights: Record<string, TranslatedHighlight>;
    accordions: Record<string, TranslatedAccordion>;
  };
  gallery: {
    eyebrow: string;
    title: string;
    showingPrefix: string;
    photoSingular: string;
    photoPlural: string;
    tapHint: string;
    filterAria: string;
    categories: Record<GalleryCategory, string>;
    collapseBtn: string;
    expandAllTemplate: (count: number) => string;
    lightboxAriaPrefix: string;
    photoCounter: (idx: number, total: number) => string;
    closeLabel: string;
    prevLabel: string;
    nextLabel: string;
    consultRoom: string;
    items: Record<string, TranslatedGalleryItem>;
  };
  location: {
    eyebrow: string;
    title: string;
    capitalLabel: string;
    capitalDistance: string;
    capitalSub: string;
    envLabel: string;
    envValue: string;
    envSub: string;
    swipeTitle: string;
    swipeAction: string;
    fromMansion: string;
    connectivityTitle: string;
    connectivityDesc: string;
    connectivityFooter: string;
    landmarks: Record<string, TranslatedLandmark>;
  };
  simulator: {
    eyebrow: string;
    resetMobile: string;
    resetDesktop: string;
    title: string;
    subtitle: string;
    listedPriceLabel: string;
    rateNoteLive: (rateStr: string) => string;
    rateNoteFallback: (rateStr: string) => string;
    proposalLabel: string;
    proposalInputAria: string;
    basedOnPrefix: string;
    basedOnSuffix: string;
    downPaymentLabel: string;
    downPaymentEditHint: string;
    downPctAria: string;
    downValAria: string;
    downSliderAria: string;
    rangeLabel: string;
    balanceLabel: string;
    termLabel: string;
    termAria: string;
    termSliderAria: string;
    monthsUnit: string;
    monthSingular: string;
    yearSingular: string;
    yearPlural: string;
    andConnector: string;
    equivalentTo: string;
    rateLabel: string;
    rateAria: string;
    rateSliderAria: string;
    rateUnit: string;
    presetBank: string;
    presetDirect: string;
    kpiDown: string;
    kpiBalance: string;
    kpiFirstInstallment: string;
    kpiPriceSub: (sacFirst: string) => string;
    cardHeaderTitle: string;
    cardListedPrice: string;
    cardSimulatedOffer: string;
    summarySentence: (params: {
      down: string;
      financed: string;
      months: number;
      rate: string;
    }) => string;
    colResult: string;
    colSacSub: string;
    colPriceSub: string;
    rowDown: string;
    rowFirst: string;
    rowLast: string;
    rowInterest: (months: number) => string;
    rowTotal: string;
    insightText: (params: {
      diffPrice: string;
      savingsSac: string;
      duration: string;
    }) => string;
    sendButton: string;
    warningStrong: string;
    warningText: string;
    negotiateOptionTitle: string;
    negotiateOptionDesc: string;
    simulateOptionTitle: string;
    simulateOptionDesc: string;
    negotiateSelectedBadge: string;
    negotiateCtaButton: string;
    negotiateSubject: string;
    negotiateNotes: string;
    negotiateModalSummary: string;
  };
  leadForm: {
    eyebrow: string;
    title: string;
    intro: string;
    bullets: [string, string, string];
    attachedProposal: string;
    attachedDown: string;
    attachedMonths: string;
    removeAttachmentAria: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    emailValid: string;
    phoneLabel: string;
    phonePlaceholder: string;
    phoneValid: string;
    cityLabel: string;
    cityPlaceholder: string;
    stateLabel: string;
    statePlaceholder: string;
    dateLabel: string;
    visitModeLabel: string;
    visitInPerson: string;
    visitVirtual: string;
    visitInPersonValue: string;
    visitVirtualValue: string;
    notesLabel: string;
    notesPlaceholder: string;
    submitButton: string;
    submittingButton: string;
    requiredNote: string;
    warningStrong: string;
    warningText: string;
    errorName: string;
    errorEmail: string;
    errorPhoneFallback: string;
    errorCity: string;
    errorState: string;
    errorServerFallback: string;
    errorConnection: string;
    modalTitle: string;
    modalDesc: string;
    modalClose: string;
    modalCloseAria: string;
    defaultSubject: string;
    openFormCta: string;
    openFormSubnote: string;
    cardEyebrow: string;
    cardTitle: string;
    cardStep1: string;
    cardStep2: string;
  };
  proposalModal: {
    dialogTitle: string;
    closeAria: string;
    step1Tab: string;
    step2Tab: string;
    paymentTypeLabel: string;
    cashOption: string;
    financedOption: string;
    negotiateOption: string;
    proposalValueLabel: string;
    presetListed: string;
    presetMinus5: string;
    presetMinus10: string;
    downPctLabel: string;
    downValLabel: string;
    termLabel: string;
    rateLabel: string;
    presetDirectRate: string;
    presetBankRate: string;
    summaryFinanced: string;
    summarySacFirst: string;
    summaryPriceFixed: string;
    summaryCashTotal: string;
    summaryNegotiateLabel: string;
    summaryNegotiateDesc: string;
    continueToData: string;
    editValues: string;
    backToValues: string;
    cashOfferSummary: (val: string) => string;
    negotiateOfferSummary: (listed: string) => string;
    financedOfferSummary: (params: {
      offer: string;
      down: string;
      months: number;
      rate: string;
    }) => string;
    cashSubject: string;
    negotiateSubject: string;
  };
  footer: {
    desc: string;
    modeLabel: string;
    modeValue: string;
    serviceLabel: string;
    serviceLink: string;
    locationLabel: string;
    locationValue: string;
    navTitle: string;
    navLinks: {
      mansao: string;
      galeria: string;
      localizacao: string;
      simulador: string;
      agendar: string;
    };
    legalTitle: string;
    legalText: string;
    copyright: (year: number) => string;
    bottomTag: string;
  };
  guabiruba: {
    fabAria: string;
    fabTitle: string;
    eyebrow: string;
    modalTitle: string;
    closeAria: string;
    intro1: string;
    intro2: string;
    closeBtn: string;
    topics: TranslatedTopic[];
  };
  appContexts: {
    dossierSubject: string;
    dossierNotes: string;
    consultRoomSubject: (room: string) => string;
    consultRoomNotes: (room: string) => string;
    simulationSubject: string;
  };
}

export const TRANSLATIONS: Record<Language, SiteTranslations> = {
  pt: {
    docTitle: 'Mansão Contemporânea Frente ao Mar — Direto com o Proprietário | Guaratuba, PR',
    header: {
      brand: 'Mansão Guaratuba',
      navAria: 'Navegação principal',
      mobileNavAria: 'Navegação mobile',
      openMenu: 'Abrir menu',
      closeMenu: 'Fechar menu',
      cta: 'Faça sua proposta',
      languageSelectorLabel: 'Selecionar idioma e moeda',
      nav: {
        mansao: 'A Mansão',
        ambientes: 'Ambientes',
        localizacao: 'Localização & Distâncias',
        simulador: 'Simulador',
      },
    },
    hero: {
      eyebrow: 'Venda Direta com o Proprietário · Guaratuba - PR · Pé na Areia',
      h1: 'Mansão Contemporânea Frente ao Mar — Direto com o Proprietário',
      description:
        "1.100 m² de arquitetura autoral pé na areia com piscina frente mar, espelho d'água, escadaria flutuante em vidro, elevador privativo, adega climatizada, espaço gourmet com chopeira, academia e home cinema com teto estrelado.",
      ctaPrimary: 'Faça sua proposta',
      ctaSecondary: 'Explorar Imóvel',
      fallbackTitle: 'Mansão Contemporânea Frente ao Mar — Guaratuba, PR',
      heroAlt:
        'Vista aérea real da mansão pé na areia ao lado da Ponte de Guaratuba, com vista panorâmica para a Baía de Guaratuba e oceano',
      askingPriceLabel: 'Valor de Referência',
      liveRatePrefix: 'Cotação do dólar hoje',
      attributes: [
        { label: 'Área Construída', value: '1.100 m² · Triple-A' },
        { label: 'Implantação', value: 'Pé na Areia · Frente Mar' },
        { label: 'Localização', value: 'Ao lado da Ponte' },
        { label: 'Lazer Privativo', value: 'Cinema, Hidro, Adega & Gym' },
      ],
    },
    showcase: {
      eyebrow: 'Arquitetura & Engenharia Residencial · Guaratuba, Paraná',
      title: 'Projetada para contemplar a Baía de Guaratuba com conforto absoluto',
      intro:
        'Cada ambiente equilibra materiais nobres, automação discreta e integração total entre o interior e a orla. Da fachada em grafite e madeira ripada à passagem privativa para a areia, a residência entrega privacidade e padrão construtivo raro no litoral paranaense.',
      dossierEyebrow: 'Memorial Descritivo',
      dossierTitle: 'Ficha Técnica & Acabamentos',
      dossierDesc:
        'Consulte os detalhes estruturais, equipamentos de lazer e soluções de conforto térmico e acústico presentes na mansão.',
      dossierButton: 'Solicitar Dossiê Completo',
      highlights: {
        '01': {
          title: '1.100 m² Pé na Areia ao Lado da Ponte',
          category: 'Implantação & Escala',
          description:
            'Residência imponente em três pavimentos com fachada contemporânea em grafite, madeira natural ripada, amplos panos de vidro espelhado e saída direta para a areia.',
        },
        '02': {
          title: 'Living, Escadaria Flutuante & Elevador',
          category: 'Social & Acessibilidade',
          description:
            'Estar e jantar integrados com escadaria flutuante iluminada em LED, elevador privativo revestido em mármore e adega climatizada fechada em vidro.',
        },
        '03': {
          title: 'Home Cinema Estrelado & Academia',
          category: 'Entretenimento & Saúde',
          description:
            'Sala de cinema privativa com teto estrelado em fibra óptica azul, projetor HD e isolamento acústico, além de academia completa com vista para o mar.',
        },
        '04': {
          title: "Piscina Frente Mar, Espelho d'Água & Hidro",
          category: 'Lazer & Bem-Estar',
          description:
            "Espelho d'água com pisantes flutuantes, piscina aquecida com LED frente à praia, hidro spa interno integrado e espaço gourmet com chopeira e parrilla.",
        },
        '05': {
          title: 'Suítes Planejadas & Closet Espelhado',
          category: 'Ala Íntima',
          description:
            'Suíte master com hidro privativa, rede frente mar, camarinha e closet espelhado com ilha, além de suíte esportiva com grafite e suíte infantil temática.',
        },
        '06': {
          title: 'Garagem Coberta de Amplo Porte',
          category: 'Infraestrutura',
          description:
            'Garagem com cobertura em pérgola de vidro e estrutura metálica, piso em porcelanato amadeirado, iluminação linear em LED e acesso automatizado.',
        },
      },
      accordions: {
        estrutura: {
          title: 'Padrão Construtivo & Fachada (1.100 m²)',
          summary: 'Grafite estrutural, madeira natural ripada e esquadrias panorâmicas',
          items: [
            '1.100 m² de área construída distribuídos com elevador privativo atendendo os pavimentos.',
            'Fachada frontal e posterior em textura grafite, brises e painéis em madeira natural e guarda-corpos em vidro.',
            'Iluminação arquitetônica 100% em LED embutido com perfis lineares nas áreas sociais, escada e garagem.',
            'Piso externo em porcelanato amadeirado e travertino antiderrapante com resistência marinha.',
          ],
        },
        lazer: {
          title: 'Lazer, Gourmet, Cinema & Spa Integrado',
          summary: 'Estrutura completa de resort privativo frente ao mar',
          items: [
            "Espelho d'água com pisantes flutuantes em pedra e varanda gourmet contígua à piscina frente mar.",
            'Spa / hidromassagem interna integrada ao living com escadaria flutuante e vista para a praia.',
            'Lounge gourmet com chopeira profissional, parrilla revestida em mármore escuro, adegas e garrafeiro suspenso.',
            'Home Theater com isolamento acústico, projetor HD e teto estrelado em fibra óptica azul, além de academia equipada.',
          ],
        },
        suites: {
          title: 'Suítes, Closet Espelhado & Marcenaria',
          summary: 'Conforto térmico, marcenaria sob medida e ambientes temáticos',
          items: [
            'Suíte master frente mar com hidro spa privativo, rede de descanso, TV retrátil embutida no teto e escritório.',
            'Closet espaçoso em marcenaria espelhada com ilha central, camarinha com penteadeira iluminada e banheiro com cuba dupla.',
            'Suíte jovem temática esportiva com grafite personalizado de basquete e luminária temática; suíte infantil espacial com beliche e escorregador.',
            'Climatização em todos os ambientes sociais e íntimos com marcenaria ripada e acabamentos em tons fendi.',
          ],
        },
        'localizacao-seguranca': {
          title: 'Localização, Garagem & Valorização',
          summary: 'Pé na areia ao lado da Ponte de Guaratuba',
          items: [
            'Terreno pé na areia com saída direta para a praia e vista permanente para a Baía e Ponte de Guaratuba.',
            'Garagem coberta de amplo porte com cobertura em vidro e estrutura metálica para múltiplos veículos.',
            'Atendimento sigiloso e negociação direta com o proprietário, com documentação regularizada para transferência imediata.',
          ],
        },
      },
    },
    gallery: {
      eyebrow: 'Curadoria Visual · Ambientes Reais',
      title: 'Explore cada ambiente da propriedade',
      showingPrefix: 'Exibindo',
      photoSingular: 'fotografia real',
      photoPlural: 'fotografias reais',
      tapHint: 'do imóvel. Toque em qualquer imagem para ampliar.',
      filterAria: 'Filtrar ambientes por categoria',
      categories: {
        Todos: 'Todos',
        'Fachada & Área Externa': 'Fachada & Área Externa',
        "Living & Espelho d'Água": "Living & Espelho d'Água",
        'Home Cinema Estrelado': 'Home Cinema Estrelado',
        'Suítes & Closet': 'Suítes & Closet',
        Garagem: 'Garagem',
      },
      collapseBtn: 'Recolher galeria',
      expandAllTemplate: (count) => `Ver todas as ${count} fotografias`,
      lightboxAriaPrefix: 'Visualização ampliada:',
      photoCounter: (idx, total) => `Foto ${idx} de ${total}`,
      closeLabel: 'Fechar visualização',
      prevLabel: 'Foto anterior',
      nextLabel: 'Próxima foto',
      consultRoom: 'Consultar Ambiente',
      items: {
        'aerea-ponte': {
          title: 'Localização Privilegiada ao Lado da Ponte de Guaratuba',
          subtitle: 'Vista Aérea Real · Pé na Areia · Baía e Mar',
          description:
            'Implantação exclusiva à beira-mar com 1.100 m² de área construída, vista definitiva para a baía e acesso imediato junto à Ponte de Guaratuba.',
          alt: 'Foto aérea real mostrando a mansão à beira-mar exatamente ao lado da Ponte de Guaratuba',
        },
        'fachada-mar': {
          title: 'Fachada Contemporânea Frente ao Mar & Jardim Pé na Areia',
          subtitle: 'Grafite, Madeira Natural & Envidraçamento Panorâmico',
          description:
            'Volumetria em três pavimentos com guarda-corpos em vidro, varandas escalonadas, fechamento em vidro retrátil e gramado com saída direta para a areia.',
          alt: 'Fachada voltada para o mar da mansão em grafite, madeira e vidro com gramado frontal',
        },
        'fachada-rua': {
          title: 'Fachada Principal em Grafite, Ripado e Pano de Vidro',
          subtitle: 'Entrada Social Imponente · Paisagismo & Controle de Acesso',
          description:
            'Entrada principal com revestimento em textura grafite, painel em madeira natural, amplo recuo pavimentado e janela panorâmica em vidro espelhado.',
          alt: 'Fachada frontal da mansão com acabamento grafite, painel ripado e esquadria espelhada',
        },
        'piscina-praia': {
          title: 'Piscina Frente ao Mar com Iluminação em LED',
          subtitle: 'Deck Solarium · Vista Direta para a Praia',
          description:
            'Piscina privativa com perfil linear de LED embutido, guarda-corpo em vidro para preservar o horizonte marinho e espreguiçadeiras voltadas para o oceano.',
          alt: 'Piscina privativa com iluminação em LED, espreguiçadeiras e vista direta para o mar',
        },
        'terrace-balancos': {
          title: 'Terraço Superior com Lareira Externa e Balanços',
          subtitle: 'Pergolado em Grafite · Vista Mar e Serra do Mar',
          description:
            'Terraço de contemplação no pavimento superior com balanços suspensos em corda náutica, mesa lareira e vista para as montanhas e oceano.',
          alt: 'Terraço superior com vigas em grafite, balanços suspensos e lareira externa',
        },
        'espelho-dagua-mar': {
          title: "Espelho d'Água com Pisantes Flutuantes Frente Mar",
          subtitle: 'Varanda Gourmet Integrada · LED Linear no Teto',
          description:
            "Área de convivência coberta contornada por espelho d'água cristalino com pisantes flutuantes em travertino, colunas em grafite e vista livre para a praia.",
          alt: "Varanda coberta com espelho d'água, pisantes em pedra e vista direta para a praia",
        },
        'living-escadaria-hidro': {
          title: 'Living Social com Escadaria Flutuante e Hidro Interna',
          subtitle: 'Pé-Direito Duplo · Forro Ripado e Perfis de LED',
          description:
            'Ambiente integrado com escadaria flutuante iluminada em LED, guarda-corpo em vidro estrutural, forro amadeirado ripado e hidromassagem interna.',
          alt: 'Living social com escadaria flutuante iluminada, forro ripado e hidro interna',
        },
        'hidro-vista-piscina': {
          title: 'Hidro Spa Interno Integrado à Piscina e ao Mar',
          subtitle: 'Panorâmica Piso-Teto · Conexão Total Interno/Externo',
          description:
            'Spa interno aquecido posicionado junto às esquadrias piso-teto com vista direta para a piscina externa e a faixa de areia de Guaratuba.',
          alt: 'Hidro spa interno com vista através do vidro para a piscina externa e o mar',
        },
        'living-adega-elevador': {
          title: 'Sala de Estar, Jantar, Elevador e Adega Climatizada',
          subtitle: 'Conceito Aberto Frente Mar · Mármore e Marcenaria Fendi',
          description:
            'Amplo living em tons fendi e off-white com mesa de jantar para 10 lugares, elevador privativo revestido em mármore e adega climatizada com portas em vidro.',
          alt: 'Sala de jantar e estar integradas com adega climatizada, elevador e vista para o mar',
        },
        'espaco-gourmet-bar': {
          title: 'Espaço Gourmet & Bar Panorâmico com Chopeira',
          subtitle: 'Parrilla, Cervejeiras e Garrafeiro Suspenso Frente Mar',
          description:
            'Lounge gourmet completo com bancada em pedra escura, chopeira integrada, parrilla revestida em mármore escuro, adegas e vista frontal para o mar.',
          alt: 'Espaço gourmet e bar completo com chopeira, garrafeiro suspenso e vista para o mar',
        },
        'cozinha-gourmet': {
          title: 'Cozinha Gourmet com Ilha em Mármore e Eletros Inox',
          subtitle: 'Automação & Linha Profissional Embutida',
          description:
            'Cozinha planejada com ilha central em mármore branco, cooktop e chapa embutidos, fornos em inox e refrigerador smart integrado ao jantar.',
          alt: 'Cozinha gourmet em tons claros com ilha de mármore e eletrodomésticos em inox',
        },
        'home-cinema-teto': {
          title: 'Home Cinema Privativo com Teto Estrelado Azul',
          subtitle: 'Fibra Óptica · Projetor HD · Sofá Modular Profundo',
          description:
            'Sala de cinema dedicada com isolamento acústico completo, teto estrelado em fibra óptica com iluminação azul cênica e projetor de alta definição.',
          alt: 'Home cinema privativo com teto estrelado azul, projetor e sofá modular amplo',
        },
        'home-cinema-tela': {
          title: 'Home Theater — Projeção em Tela Ampla e Acústica',
          subtitle: 'Sistema Surround · Automação de Cenas',
          description:
            'Ângulo voltado para a tela de projeção de grande formato com caixas acústicas dedicadas, painel ripado lateral e climatização silenciosa.',
          alt: 'Vista da tela de cinema, equipamento de áudio e teto estrelado do home theater',
        },
        'academia-frente-mar': {
          title: 'Academia Privativa Climatizada Frente ao Mar',
          subtitle: 'Equipamentos Profissionais · Vista Panorâmica',
          description:
            'Espaço fitness completo com estação multifuncional, esteira, pesos livres, parede espelhada e janelas panorâmicas voltadas para o oceano e a serra.',
          alt: 'Academia privativa equipada com aparelhos profissionais e vista para o mar',
        },
        'suite-master-panoramica': {
          title: 'Suíte Master Frente Mar com Rede e TV Retrátil no Teto',
          subtitle: 'Terraço Privativo · Integração com Hidro & Home Office',
          description:
            'Suíte principal de altíssimo padrão com cama king, TV motorizada embutida no forro, rede de descanso voltada para a praia e bancada de escritório.',
          alt: 'Suíte master ampla com cama king, TV retrátil no teto, rede e vista para o mar',
        },
        'suite-master-hidro': {
          title: 'Spa Privativo da Suíte Master com Vista para o Mar',
          subtitle: 'Banheira de Hidromassagem · Chaise Lounge',
          description:
            'Área íntima de relaxamento dentro da suíte master equipada com banheira de hidromassagem elevada, forro com vigas amadeiradas e varanda frente mar.',
          alt: 'Banheira de hidromassagem na suíte master com chaise laranja e vista para o mar',
        },
        'closet-ilha': {
          title: 'Closet Principal em Marcenaria Espelhada e Ilha Central',
          subtitle: 'Portas em Espelho Piso-Teto · Iluminação Linear LED',
          description:
            'Closet espaçoso com armários espelhados do chão ao teto, gaveteiro central tipo ilha, carpete macio e entrada de luz natural.',
          alt: 'Closet amplo com armários espelhados, ilha central de gavetas e iluminação LED',
        },
        'closet-camarinha': {
          title: 'Camarinha & Penteadeira Iluminada da Suíte Master',
          subtitle: 'Espelho Camarim · Armários em Vidro Armado',
          description:
            'Espaço exclusivo anexo ao closet com penteadeira ampla e espelho com moldura iluminada em LED, poltrona clássica e armários com iluminação interna.',
          alt: 'Camarinha da suíte master com penteadeira iluminada em LED e cômoda planejada',
        },
        'banho-master': {
          title: 'Sala de Banho Master com Cuba Dupla e Metais Dourados',
          subtitle: 'Box em Vidro com Perfil Dourado · Mármore Calacatta',
          description:
            'Banheiro da suíte master revestido em porcelanato marmorizado com bancada dupla, marcenaria escura, espelhos bisotados e box com acabamento dourado.',
          alt: 'Banheiro master com duas cubas, marcenaria grafite e box com perfil dourado',
        },
        'suite-esportiva': {
          title: 'Suíte Temática Jovem & Esportiva com Grafite Autoral',
          subtitle: 'Mural Basquete Exclusivo · Luminária Aro & Iluminação LED',
          description:
            'Suíte climatizada com painel artístico esportivo personalizado na cabeceira, luminária temática, cortinas com sanca iluminada e marcenaria sob medida.',
          alt: 'Suíte temática jovem esportiva com mural de basquete, luminária de cesta e TV',
        },
        'suite-infantil-espacial': {
          title: 'Suíte Temática Espacial com Escorregador e Beliche',
          subtitle: 'Marcenaria Lúdica Sob Medida · Armário Espelhado',
          description:
            'Dormitório planejado com cama beliche, escorregador em madeira clara, mural temático espacial, bancada de estudos e armários espelhados.',
          alt: 'Suíte infantil temática espacial com beliche em madeira, escorregador e closet espelhado',
        },
        'garagem-pergola-vidro': {
          title: 'Garagem Coberta com Pérgola em Vidro e LED Linear',
          subtitle: 'Paredes em Grafite · Piso em Porcelanato Amadeirado',
          description:
            'Amplo pátio e garagem coberta por estrutura metálica e vidro temperado, perfis verticais de LED e portão automatizado em tom grafite.',
          alt: 'Garagem coberta com cobertura em vidro e estrutura metálica escura e piso amadeirado',
        },
        'garagem-acesso-mar': {
          title: 'Garagem Coberta de Amplo Porte com Eixo para o Mar',
          subtitle: 'Múltiplas Vagas · Acesso Direto da Rua à Orla',
          description:
            'Garagem de grande porte comportando múltiplos veículos e SUVs com área coberta fechada, iluminação embutida e circulação direta até a área de lazer.',
          alt: 'Vista ampla da garagem coberta com dupla área de estacionamento e corredor para o mar',
        },
      },
    },
    location: {
      eyebrow: 'Localização Estratégica & Pontos Turísticos',
      title: 'Frente ao mar em Guaratuba, conectada aos principais cartões-postais',
      capitalLabel: 'Capital do Estado',
      capitalDistance: '120 km',
      capitalSub: 'De Curitiba via BR-376 / Ponte',
      envLabel: 'Entorno Imediato',
      envValue: 'Pé na Areia',
      envSub: 'Ao lado da Ponte de Guaratuba',
      swipeTitle: 'Pontos turísticos e distâncias reais',
      swipeAction: 'Deslize →',
      fromMansion: 'Partindo da mansão',
      connectivityTitle: 'Valorização com a Nova Ponte de Guaratuba',
      connectivityDesc:
        'Situada ao lado do eixo de ligação mais aguardado do litoral paranaense, a propriedade une acesso ágil sem filas de travessia à tranquilidade de uma enseada reservada.',
      connectivityFooter:
        'Acesso terrestre direto · Proximidade de marinas e aeroporto regional de Joinville / Curitiba',
      landmarks: {
        'morro-do-cristo': {
          name: 'Morro do Cristo (Brejatuba)',
          region: 'Praia de Brejatuba',
          distance: '3,2 km',
          travelTime: '7 min de carro',
          description:
            'Cartão-postal com mirante no topo do morro e vista panorâmica 360° da orla, ilhas e oceano Atlântico.',
          alt: 'Vista panorâmica do Morro do Cristo e da Praia de Brejatuba em Guaratuba',
        },
        'praia-central': {
          name: 'Praia Central',
          region: 'Orla Urbana',
          distance: '2,4 km',
          travelTime: '5 min de carro',
          description:
            'Calçadão arborizado à beira-mar com gastronomia regional, conveniências, cafés e infraestrutura completa.',
          alt: 'Calçadão e faixa de areia da Praia Central de Guaratuba',
        },
        'baia-guaratuba': {
          name: 'Baía de Guaratuba',
          region: 'Frente da Propriedade',
          distance: 'Pé na areia',
          travelTime: 'Acesso imediato',
          description:
            'Cenário náutico de águas protegidas, marinas próximas e pôr do sol emoldurado pela Serra do Mar.',
          alt: 'Embarcações ancoradas na Baía de Guaratuba ao entardecer',
        },
        'paroquia-bom-sucesso': {
          name: 'Paróquia Nossa Senhora do Bom Sucesso',
          region: 'Centro Histórico',
          distance: '1,9 km',
          travelTime: '5 min de carro',
          description:
            'Marco histórico colonial datado do século XVIII, símbolo da tradição e da arquitetura litorânea paranaense.',
          alt: 'Fachada histórica da Paróquia Nossa Senhora do Bom Sucesso em Guaratuba',
        },
        'praia-caieiras': {
          name: 'Praia de Caieiras',
          region: 'Canal da Baía',
          distance: '2,8 km',
          travelTime: '6 min de carro',
          description:
            'Enseada de águas calmas e transparentes junto às pedras naturais, próxima ao canal de travessia de ferry-boat.',
          alt: 'Águas tranquilas da Praia de Caieiras com ferry-boat ao fundo em Guaratuba',
        },
      },
    },
    simulator: {
      eyebrow: 'Planejamento Financeiro & Proposta',
      resetMobile: 'Restaurar padrão',
      resetDesktop: 'Restaurar cenário padrão',
      title: 'Simulador de Financiamento & Proposta',
      subtitle:
        'Ajuste entrada, prazo e taxa anual para comparar parcelas mensais e custo total nos sistemas SAC e Price com base no valor anunciado.',
      listedPriceLabel: 'Preço anunciado (fixo)',
      rateNoteLive: (rateStr) => `Dólar comercial hoje: ${rateStr}`,
      rateNoteFallback: (rateStr) => `Taxa referencial: ${rateStr}`,
      proposalLabel: 'Valor da proposta',
      proposalInputAria: 'Valor da proposta em reais',
      basedOnPrefix: 'Baseado no valor de',
      basedOnSuffix: 'Clique no campo acima caso deseje digitar outro valor para simular.',
      downPaymentLabel: 'Entrada',
      downPaymentEditHint: 'Edite % ou valor em R$',
      downPctAria: 'Percentual de entrada',
      downValAria: 'Valor da entrada em reais',
      downSliderAria: 'Barra deslizante de percentual de entrada',
      rangeLabel: 'Faixa simulada: 20% a 80%',
      balanceLabel: 'Saldo a financiar',
      termLabel: 'Prazo',
      termAria: 'Prazo em meses',
      termSliderAria: 'Barra deslizante de prazo em meses',
      monthsUnit: 'meses',
      monthSingular: 'mês',
      yearSingular: 'ano',
      yearPlural: 'anos',
      andConnector: 'e',
      equivalentTo: 'Equivalente a',
      rateLabel: 'Taxa efetiva anual da simulação',
      rateAria: 'Taxa efetiva anual em porcentagem',
      rateSliderAria: 'Barra deslizante de taxa efetiva anual',
      rateUnit: '% a.a.',
      presetBank: '12% · Cenário bancário',
      presetDirect: '8,4% · Negociação direta',
      kpiDown: 'Entrada',
      kpiBalance: 'Saldo a financiar',
      kpiFirstInstallment: 'Primeira parcela',
      kpiPriceSub: (sacFirst) => `Price · ou ${sacFirst} no SAC`,
      cardHeaderTitle: 'Mansão Frente ao Mar · Guaratuba, Paraná, Brasil',
      cardListedPrice: 'Preço anunciado:',
      cardSimulatedOffer: 'Proposta simulada:',
      summarySentence: ({ down, financed, months, rate }) =>
        `Simulação de ${down} de entrada, ${financed} a financiar, ${months} meses e ${rate}% efetivos ao ano.`,
      colResult: 'Resultado',
      colSacSub: 'parcelas decrescentes',
      colPriceSub: 'parcelas iguais*',
      rowDown: 'Entrada',
      rowFirst: 'Primeira parcela',
      rowLast: 'Última parcela',
      rowInterest: (months) => `Juros totais em ${months} meses`,
      rowTotal: 'Total pago, incluindo a entrada',
      insightText: ({ diffPrice, savingsSac, duration }) =>
        `*Valores aproximados, sem correção monetária, seguros ou tarifas. Na simulação, a Price reduz a primeira parcela em cerca de ${diffPrice}, enquanto o SAC economiza cerca de ${savingsSac} em juros ao longo de ${duration}.`,
      sendButton: 'Enviar Proposta ao Proprietário',
      warningStrong: 'Atenção:',
      warningText:
        'Os valores acima são apenas uma simulação. As taxas podem alterar para mais ou para menos conforme as condições do seu banco, e não incluem correção monetária, seguros ou tarifas.',
      negotiateOptionTitle: 'Negociar pessoalmente',
      negotiateOptionDesc:
        'Combinar condições, forma de pagamento e visita diretamente com o proprietário',
      simulateOptionTitle: 'Quero simular entrada e financiamento',
      simulateOptionDesc: 'Comparar parcelas SAC e Price sobre o valor anunciado',
      negotiateSelectedBadge: 'Opção selecionada: Negociar pessoalmente com o proprietário',
      negotiateCtaButton: 'Solicitar Negociação Pessoal',
      negotiateSubject: 'Negociar Pessoalmente com o Proprietário',
      negotiateNotes:
        'Tenho interesse no imóvel e gostaria de negociar pessoalmente diretamente com o proprietário.',
      negotiateModalSummary: 'Negociar pessoalmente · Valor anunciado:',
    },
    leadForm: {
      eyebrow: 'Atendimento Privativo · Direto com o Proprietário',
      title: 'Envie sua proposta ou agende uma visita exclusiva',
      intro:
        'Negocie diretamente com o proprietário com total sigilo e sem intermediação. Preencha seus dados ao lado para encaminhar sua proposta ou solicitar visita reservada em Guaratuba.',
      bullets: [
        'Atendimento com hora marcada, discrição total e retorno em até 24 horas pelo canal informado por você.',
        'Flexibilidade para visitas presenciais em Guaratuba ou apresentação por videoconferência ao vivo.',
        'Envio direto pelo formulário seguro da página, sem abrir aplicativos externos.',
      ],
      attachedProposal: 'Proposta:',
      attachedDown: 'Entrada',
      attachedMonths: 'meses',
      removeAttachmentAria: 'Remover anexo da proposta',
      nameLabel: 'Nome completo',
      namePlaceholder: 'Seu nome completo',
      emailLabel: 'Seu e-mail',
      emailPlaceholder: 'seuemail@exemplo.com',
      emailValid: 'E-mail válido',
      phoneLabel: 'Telefone / WhatsApp',
      phonePlaceholder: '(00) 00000-0000',
      phoneValid: 'WhatsApp / telefone válido',
      cityLabel: 'Cidade',
      cityPlaceholder: 'Ex.: Curitiba',
      stateLabel: 'Estado',
      statePlaceholder: 'Ex.: PR',
      dateLabel: 'Melhor data para visita (opcional)',
      visitModeLabel: 'Modalidade de atendimento',
      visitInPerson: 'Presencial',
      visitVirtual: 'Tour Virtual',
      visitInPersonValue: 'Presencial em Guaratuba',
      visitVirtualValue: 'Tour Virtual Privativo',
      notesLabel: 'Proposta, preferência de horário ou observação (opcional)',
      notesPlaceholder:
        'Escreva sua proposta, condições de pagamento ou melhor horário para retorno',
      submitButton: 'Enviar Proposta e Mensagem',
      submittingButton: 'Enviando...',
      requiredNote: '* Nome, e-mail, telefone, cidade e estado são obrigatórios',
      warningStrong: 'Aviso:',
      warningText:
        'Este cálculo é apenas uma simulação. As taxas podem alterar para mais ou para menos conforme seu banco.',
      errorName: 'Por favor, informe seu nome completo para enviar a mensagem.',
      errorEmail: 'Informe um endereço de e-mail válido para enviar a mensagem.',
      errorPhoneFallback: 'Informe um número de WhatsApp / telefone válido com DDD.',
      errorCity: 'Informe sua cidade para enviar a mensagem.',
      errorState: 'Informe seu estado (UF) para enviar a mensagem.',
      errorServerFallback:
        'Não foi possível enviar sua mensagem. Verifique nome, e-mail e telefone e tente novamente.',
      errorConnection: 'Erro de conexão ao enviar sua mensagem. Tente novamente em instantes.',
      modalTitle: 'Mensagem enviada com sucesso.',
      modalDesc: 'Dentro de 24h entraremos em contato.',
      modalClose: 'Fechar',
      modalCloseAria: 'Fechar janela de confirmação',
      defaultSubject: 'Proposta / Agendamento de Visita',
      openFormCta: 'Faça sua proposta e envie',
      openFormSubnote: 'Abre em tela limpa e fixa · Sem rolagem indesejada',
      cardEyebrow: 'Canal Direto · Sem Intermediários',
      cardTitle: 'Envie valores e agende seu atendimento em 2 passos',
      cardStep1:
        '1. Defina o valor da proposta e se será à vista, parcelado ou negociar direto com o proprietário',
      cardStep2: '2. Preencha seu nome, e-mail e WhatsApp e envie direto ao proprietário',
    },
    proposalModal: {
      dialogTitle: 'Faça sua Proposta',
      closeAria: 'Fechar janela de proposta',
      step1Tab: '1. Valores da Proposta',
      step2Tab: '2. Seus Dados e Envio',
      paymentTypeLabel: 'Forma de pagamento pretendida',
      cashOption: 'À vista',
      financedOption: 'Entrada + Parcelas',
      negotiateOption: 'A negociar',
      proposalValueLabel: 'Valor da sua proposta',
      presetListed: 'Valor anunciado',
      presetMinus5: '-5%',
      presetMinus10: '-10%',
      downPctLabel: 'Entrada (%)',
      downValLabel: 'Valor da entrada',
      termLabel: 'Prazo (meses)',
      rateLabel: 'Taxa anual estimada (% a.a.)',
      presetDirectRate: '8,4% · Direto',
      presetBankRate: '12% · Bancário',
      summaryFinanced: 'Saldo a financiar',
      summarySacFirst: '1ª parcela SAC',
      summaryPriceFixed: 'Parcela fixa Price',
      summaryCashTotal: 'Pagamento à vista',
      summaryNegotiateLabel: 'Negociação direta',
      summaryNegotiateDesc: 'Valores e condições combinados diretamente com o proprietário',
      continueToData: 'Continuar para Seus Dados',
      editValues: 'Editar valores',
      backToValues: 'Voltar aos valores',
      cashOfferSummary: (val) => `Proposta à vista: ${val}`,
      negotiateOfferSummary: (listed) => `A negociar diretamente · Referência: ${listed}`,
      financedOfferSummary: ({ offer, down, months, rate }) =>
        `Proposta: ${offer} · Entrada: ${down} · ${months} meses (${rate}% a.a.)`,
      cashSubject: 'Proposta à Vista — Mansão Frente ao Mar',
      negotiateSubject: 'Proposta A Negociar — Mansão Frente ao Mar',
    },
    footer: {
      desc: 'Apresentação oficial de propriedade exclusiva frente ao mar em Guaratuba, com negociação direta com o proprietário e sem intermediação.',
      modeLabel: 'Modalidade:',
      modeValue: 'Venda Direta com o Proprietário',
      serviceLabel: 'Atendimento:',
      serviceLink: 'Formulário Privativo de Proposta',
      locationLabel: 'Localidade:',
      locationValue: 'Guaratuba, Paraná',
      navTitle: 'Navegação',
      navLinks: {
        mansao: 'A Mansão',
        galeria: 'Galeria de Ambientes',
        localizacao: 'Localização & Distâncias',
        simulador: 'Simulador de Proposta',
        agendar: 'Agendar Visita',
      },
      legalTitle: 'Informações Legais & Disponibilidade',
      legalText:
        'Imóvel exclusivo sujeito à confirmação de disponibilidade, negociação direta de valores e atualização cadastral sem aviso prévio. As simulações apresentadas têm caráter meramente informativo e não constituem proposta vinculante de crédito.',
      copyright: (year) =>
        `© ${year} Mansão Guaratuba · Venda Direta com o Proprietário. Todos os direitos reservados.`,
      bottomTag: 'Mansão Contemporânea Frente ao Mar · Guaratuba, PR',
    },
    guabiruba: {
      fabAria: 'Investir em Guabiruba (Santa Catarina)',
      fabTitle: 'Investir em Guabiruba (SC)',
      eyebrow: 'Oportunidade Estratégica · Santa Catarina',
      modalTitle: 'Investir em Guabiruba (SC)',
      closeAria: 'Fechar janela',
      intro1:
        'Investir em Guabiruba (Santa Catarina) é uma escolha estratégica para quem busca o equilíbrio entre força industrial, qualidade de vida e valorização imobiliária.',
      intro2: 'Os principais motivos para investir no município incluem:',
      closeBtn: 'Fechar',
      topics: [
        {
          number: '1',
          title: 'Economia Forte e Polo Têxtil Consolidado',
          points: [
            {
              label: 'Tradição e escala:',
              text: 'A economia local é fortemente impulsionada pela indústria têxtil e de vestuário, com centenas de empresas gerando empregos formais e movimentando centenas de milhões de reais no Valor Adicional Fiscal (VAF).',
            },
            {
              label: 'Crescimento do PIB:',
              text: 'O Produto Interno Bruto (PIB) do município tem registrado forte expansão nominal, impulsionado por micro, pequenas e médias empresas dinâmicas.',
            },
          ],
        },
        {
          number: '2',
          title: 'Mercado Imobiliário e Déficit Habitacional',
          points: [
            {
              label: 'Valorização patrimonial:',
              text: 'O crescimento da infraestrutura urbana, a chegada de novos loteamentos planejados e a atuação de construtoras locais criam uma forte janela de ganho de capital a médio e longo prazo.',
            },
            {
              label: 'Demanda por moradia:',
              text: 'Há um déficit habitacional e uma procura crescente por imóveis — com destaque para bairros em expansão como o São Pedro —, atraindo tanto investidores de renda com aluguéis quanto famílias que querem sair de grandes centros.',
            },
          ],
        },
        {
          number: '3',
          title: 'Qualidade de Vida e Segurança',
          points: [
            {
              label: 'IDH elevado:',
              text: 'O município possui um Índice de Desenvolvimento Humano (IDH) de 0,754, refletindo bons índices de bem-estar social.',
            },
            {
              label: 'Segurança e tranquilidade:',
              text: 'Guabiruba é reconhecida pelos baixos índices de criminalidade e por manter um forte senso de comunidade interiorano, onde ruas e loteamentos conservam a liberdade para as famílias.',
            },
            {
              label: 'Proximidade com a natureza:',
              text: 'Rodeada por morros, trilhas ecológicas e cachoeiras (como o Morro São José e o Morro Santo Antônio), a cidade atrai o turismo ecológico e quem busca ar puro sem se distanciar dos grandes polos do Vale Europeu.',
            },
          ],
        },
        {
          number: '4',
          title: 'Proximidade com Brusque e Infraestrutura Regional',
          points: [
            {
              text: 'Localizada colada a Brusque, Guabiruba aproveita a infraestrutura de um grande polo comercial e industrial vizinho, além de receber investimentos contínuos em melhorias viárias e de contenção de cheias na região.',
            },
          ],
        },
      ],
    },
    appContexts: {
      dossierSubject: 'Solicitação de Dossiê Completo',
      dossierNotes:
        'Gostaria de receber o memorial descritivo completo e informações sobre a mansão em Guaratuba.',
      consultRoomSubject: (room) => `Consulta sobre ambiente: ${room}`,
      consultRoomNotes: (room) => `Gostaria de mais detalhes sobre o ambiente "${room}".`,
      simulationSubject: 'Proposta Simulada — Mansão Frente ao Mar',
    },
  },

  es: {
    docTitle: 'Mansión Contemporánea Frente al Mar — Venta Directa con el Propietario | Guaratuba, Brasil',
    header: {
      brand: 'Mansão Guaratuba',
      navAria: 'Navegación principal',
      mobileNavAria: 'Navegación móvil',
      openMenu: 'Abrir menú',
      closeMenu: 'Cerrar menú',
      cta: 'Haz tu propuesta',
      languageSelectorLabel: 'Seleccionar idioma y moneda',
      nav: {
        mansao: 'La Mansión',
        ambientes: 'Ambientes',
        localizacao: 'Ubicación y Distancias',
        simulador: 'Simulador',
      },
    },
    hero: {
      eyebrow: 'Venta Directa con el Propietario · Guaratuba - PR, Brasil · Primera Línea de Playa',
      h1: 'Mansión Contemporánea Frente al Mar — Directo con el Propietario',
      description:
        '1.100 m² de arquitectura de autor en primera línea de playa con piscina frente al mar, espejo de agua, escalera flotante de vidrio, ascensor privado, cava climatizada, espacio gourmet con tirador de cerveza, gimnasio y cine en casa con techo estrellado.',
      ctaPrimary: 'Haz tu propuesta',
      ctaSecondary: 'Explorar Propiedad',
      fallbackTitle: 'Mansión Contemporánea Frente al Mar — Guaratuba, Brasil',
      heroAlt:
        'Vista aérea real de la mansión frente al mar junto al Puente de Guaratuba, con vista panorámica a la Bahía de Guaratuba y el océano',
      askingPriceLabel: 'Valor de Referencia (USD hoy)',
      liveRatePrefix: 'Cotización del día',
      attributes: [
        { label: 'Área Construida', value: '1.100 m² · Triple-A' },
        { label: 'Emplazamiento', value: 'En la Arena · Frente al Mar' },
        { label: 'Ubicación', value: 'Junto al Puente' },
        { label: 'Ocio Privado', value: 'Cine, Spa, Cava y Gym' },
      ],
    },
    showcase: {
      eyebrow: 'Arquitectura e Ingeniería Residencial · Guaratuba, Paraná, Brasil',
      title: 'Diseñada para contemplar la Bahía de Guaratuba con confort absoluto',
      intro:
        'Cada espacio equilibra materiales nobles, automatización discreta e integración total entre el interior y el mar. Desde la fachada en grafito y madera alistonada hasta la salida privada a la arena, la residencia ofrece privacidad y un estándar constructivo excepcional en el litoral sur de Brasil.',
      dossierEyebrow: 'Memoria Descriptiva',
      dossierTitle: 'Ficha Técnica y Acabados',
      dossierDesc:
        'Consulte los detalles estructurales, equipamiento de ocio y soluciones de confort térmico y acústico de la mansión.',
      dossierButton: 'Solicitar Dossier Completo',
      highlights: {
        '01': {
          title: '1.100 m² Frente al Mar junto al Puente',
          category: 'Emplazamiento y Escala',
          description:
            'Imponente residencia de tres niveles con fachada contemporánea en grafito, madera natural alistonada, amplios ventanales reflectantes y acceso directo a la playa.',
        },
        '02': {
          title: 'Salón, Escalera Flotante y Ascensor',
          category: 'Área Social y Accesibilidad',
          description:
            'Sala y comedor integrados con escalera flotante iluminada en LED, ascensor privado revestido en mármol y cava climatizada acristalada.',
        },
        '03': {
          title: 'Cine en Casa Estrellado y Gimnasio',
          category: 'Entretenimiento y Salud',
          description:
            'Sala de cine privada con techo estrellado de fibra óptica azul, proyector HD y aislamiento acústico, además de gimnasio completo con vista al mar.',
        },
        '04': {
          title: 'Piscina Frente al Mar, Espejo de Agua y Spa',
          category: 'Ocio y Bienestar',
          description:
            'Espejo de agua con pasarelas flotantes, piscina climatizada con LED frente a la playa, hidromasaje interior integrado y salón gourmet con tirador de cerveza y parrilla.',
        },
        '05': {
          title: 'Suites de Diseño y Vestidor con Espejos',
          category: 'Área Privada',
          description:
            'Suite principal con hidromasaje privado, hamaca frente al mar, tocador tipo camerino y vestidor con isla central, además de suite deportiva con mural y suite infantil temática.',
        },
        '06': {
          title: 'Garaje Cubierto de Gran Capacidad',
          category: 'Infraestructura',
          description:
            'Cochera cubierta con pérgola de vidrio y estructura metálica, suelo en porcelanato símil madera, iluminación lineal LED y portón automatizado.',
        },
      },
      accordions: {
        estrutura: {
          title: 'Calidad Constructiva y Fachada (1.100 m²)',
          summary: 'Grafito estructural, madera natural alistonada y ventanales panorámicos',
          items: [
            '1.100 m² construidos distribuidos en tres plantas conectadas por ascensor privado.',
            'Fachada frontal y trasera con textura grafito, celosías y paneles de madera natural, y barandillas de vidrio.',
            'Iluminación arquitectónica 100% LED empotrada con perfiles lineales en zonas sociales, escalera y garaje.',
            'Pavimento exterior en porcelanato amaderado y travertino antideslizante de grado marino.',
          ],
        },
        lazer: {
          title: 'Ocio, Gourmet, Cine y Spa Integrado',
          summary: 'Infraestructura completa de resort privado frente al océano',
          items: [
            'Espejo de agua con pasos flotantes de piedra y terraza gourmet contigua a la piscina frente al mar.',
            'Spa / hidromasaje interior integrado al salón con escalera flotante y vistas directas a la playa.',
            'Salón gourmet con grifo de cerveza profesional, parrilla revestida en mármol oscuro, cavas y botellero suspendido.',
            'Home Theater con aislamiento acústico, proyector HD y cielo estrellado en fibra óptica azul, además de gimnasio equipado.',
          ],
        },
        suites: {
          title: 'Suites, Vestidor y Carpintería a Medida',
          summary: 'Confort térmico, carpintería exclusiva y habitaciones temáticas',
          items: [
            'Suite principal frente al mar con hidromasaje privado, hamaca, TV retráctil motorizada en el techo y despacho.',
            'Amplio vestidor con puertas de espejo de suelo a techo e isla central, tocador iluminado y baño doble con grifería dorada.',
            'Suite juvenil temática deportiva con mural artístico de baloncesto; suite infantil espacial con litera y tobogán.',
            'Climatización integral en todas las estancias con paneles alistonados y acabados en tonos fendi.',
          ],
        },
        'localizacao-seguranca': {
          title: 'Ubicación, Garaje y Valorización',
          summary: 'Primera línea de playa junto al Puente de Guaratuba',
          items: [
            'Terreno en primera línea con salida directa a la arena y vista permanente a la Bahía y al Puente de Guaratuba.',
            'Garaje cubierto de gran tamaño con cubierta de vidrio y acero para múltiples vehículos.',
            'Atención confidencial y negociación directa con el propietario, con escritura y documentación listas para transferencia.',
          ],
        },
      },
    },
    gallery: {
      eyebrow: 'Curaduría Visual · Espacios Reales',
      title: 'Explore cada ambiente de la propiedad',
      showingPrefix: 'Mostrando',
      photoSingular: 'fotografía real',
      photoPlural: 'fotografías reales',
      tapHint: 'de la propiedad. Toque cualquier imagen para ampliar.',
      filterAria: 'Filtrar ambientes por categoría',
      categories: {
        Todos: 'Todos',
        'Fachada & Área Externa': 'Fachada y Exterior',
        "Living & Espelho d'Água": 'Salón y Espejo de Agua',
        'Home Cinema Estrelado': 'Cine en Casa Estrellado',
        'Suítes & Closet': 'Suites y Vestidor',
        Garagem: 'Garaje',
      },
      collapseBtn: 'Contraer galería',
      expandAllTemplate: (count) => `Ver las ${count} fotografías`,
      lightboxAriaPrefix: 'Vista ampliada:',
      photoCounter: (idx, total) => `Foto ${idx} de ${total}`,
      closeLabel: 'Cerrar vista',
      prevLabel: 'Foto anterior',
      nextLabel: 'Foto siguiente',
      consultRoom: 'Consultar Ambiente',
      items: {
        'aerea-ponte': {
          title: 'Ubicación Privilegiada junto al Puente de Guaratuba',
          subtitle: 'Vista Aérea Real · Primera Línea · Bahía y Mar',
          description:
            'Emplazamiento exclusivo frente al mar con 1.100 m² construidos, vistas definitivas a la bahía y acceso inmediato junto al Puente de Guaratuba.',
          alt: 'Foto aérea real de la mansión frente al mar justo al lado del Puente de Guaratuba',
        },
        'fachada-mar': {
          title: 'Fachada Contemporánea Frente al Mar y Jardín en la Arena',
          subtitle: 'Grafito, Madera Natural y Acristalamiento Panorámico',
          description:
            'Volumetría de tres plantas con barandillas de vidrio, terrazas escalonadas, cerramiento retráctil y césped con salida directa a la arena.',
          alt: 'Fachada frente al mar de la mansión en grafito, madera y vidrio con jardín frontal',
        },
        'fachada-rua': {
          title: 'Fachada Principal en Grafito, Madera y Paño de Vidrio',
          subtitle: 'Entrada Social Imponente · Paisajismo y Control de Acceso',
          description:
            'Acceso principal revestido en textura grafito, panel de madera natural, amplio atrio pavimentado y ventanal panorámico reflectante.',
          alt: 'Fachada principal de la mansión con acabado grafito, madera alistonada y vidrio',
        },
        'piscina-praia': {
          title: 'Piscina Frente al Mar con Iluminación LED',
          subtitle: 'Deck Solárium · Vista Directa a la Playa',
          description:
            'Piscina privada con perfil lineal LED integrado, barandilla de vidrio para preservar el horizonte marino y tumbonas orientadas al océano.',
          alt: 'Piscina privada con iluminación LED, tumbonas y vista directa al mar',
        },
        'terrace-balancos': {
          title: 'Terraza Superior con Chimenea Exterior y Columpios',
          subtitle: 'Pérgola en Grafito · Vista al Mar y la Sierra',
          description:
            'Terraza de contemplación en la planta superior con columpios suspendidos, mesa chimenea y panorámica hacia las montañas y el océano.',
          alt: 'Terraza superior con vigas en grafito, columpios y chimenea exterior',
        },
        'espelho-dagua-mar': {
          title: 'Espejo de Agua con Pasos Flotantes Frente al Mar',
          subtitle: 'Terraza Gourmet Integrada · LED Lineal en Techo',
          description:
            'Área social cubierta rodeada por espejo de agua cristalina con pasos flotantes de travertino, columnas en grafito y vista abierta a la playa.',
          alt: 'Terraza cubierta con espejo de agua, pasos de piedra y vista directa a la playa',
        },
        'living-escadaria-hidro': {
          title: 'Salón Social con Escalera Flotante e Hidromasaje Interior',
          subtitle: 'Doble Altura · Techo Alistonado y Perfiles LED',
          description:
            'Ambiente integrado con escalera flotante iluminada en LED, barandilla de vidrio estructural, techo en madera alistonada y jacuzzi interior.',
          alt: 'Salón social con escalera flotante iluminada, techo de madera e hidromasaje interior',
        },
        'hidro-vista-piscina': {
          title: 'Hidro Spa Interior Integrado a la Piscina y al Mar',
          subtitle: 'Panorámica Suelo-Techo · Conexión Total Interior/Exterior',
          description:
            'Spa interior climatizado junto a los ventanales de suelo a techo con vista directa a la piscina exterior y a la arena de Guaratuba.',
          alt: 'Hidro spa interior con vista a través del cristal hacia la piscina y el mar',
        },
        'living-adega-elevador': {
          title: 'Sala de Estar, Comedor, Ascensor y Cava Climatizada',
          subtitle: 'Concepto Abierto Frente al Mar · Mármol y Carpintería Fendi',
          description:
            'Amplio salón en tonos fendi y blanco roto con mesa para 10 comensales, ascensor privado revestido en mármol y cava climatizada en vidrio.',
          alt: 'Comedor y salón integrados con cava climatizada, ascensor y vista al mar',
        },
        'espaco-gourmet-bar': {
          title: 'Espacio Gourmet y Bar Panorámico con Tirador de Cerveza',
          subtitle: 'Parrilla, Cerveceras y Botellero Suspendido Frente al Mar',
          description:
            'Lounge gourmet completo con barra en piedra oscura, grifo de cerveza integrado, parrilla en mármol oscuro, cavas y vista frontal al océano.',
          alt: 'Espacio gourmet y bar con tirador de cerveza, botellero suspendido y vista al mar',
        },
        'cozinha-gourmet': {
          title: 'Cocina Gourmet con Isla de Mármol y Electrodomésticos Inox',
          subtitle: 'Automatización y Línea Profesional Integrada',
          description:
            'Cocina de diseño con isla central en mármol blanco, placa y plancha empotradas, hornos en acero inoxidable y frigorífico inteligente.',
          alt: 'Cocina gourmet luminosa con isla de mármol y electrodomésticos en acero inoxidable',
        },
        'home-cinema-teto': {
          title: 'Cine en Casa Privado con Techo Estrellado Azul',
          subtitle: 'Fibra Óptica · Proyector HD · Sofá Modular Profundo',
          description:
            'Sala de cine dedicada con aislamiento acústico integral, cielo estrellado en fibra óptica azul escénica y proyector de alta definición.',
          alt: 'Cine en casa privado con techo estrellado azul, proyector y amplio sofá modular',
        },
        'home-cinema-tela': {
          title: 'Home Theater — Proyección en Gran Pantalla y Acústica',
          subtitle: 'Sistema Surround · Automatización de Escenas',
          description:
            'Perspectiva hacia la pantalla de gran formato con altavoces dedicados, panel alistonado lateral y climatización silenciosa.',
          alt: 'Vista de la pantalla de cine, sistema de audio y techo estrellado del home theater',
        },
        'academia-frente-mar': {
          title: 'Gimnasio Privado Climatizado Frente al Mar',
          subtitle: 'Equipamiento Profesional · Vista Panorámica',
          description:
            'Espacio fitness completo con máquina multifunción, cinta de correr, pesas libres, pared con espejos y ventanales hacia el océano y la sierra.',
          alt: 'Gimnasio privado equipado con máquinas profesionales y vista al mar',
        },
        'suite-master-panoramica': {
          title: 'Suite Principal Frente al Mar con Hamaca y TV Retráctil',
          subtitle: 'Terraza Privada · Integración con Spa y Despacho',
          description:
            'Suite principal de altísimo nivel con cama king, TV motorizada oculta en el techo, hamaca orientada a la playa y escritorio.',
          alt: 'Amplia suite principal con cama king, TV retráctil en techo, hamaca y vista al mar',
        },
        'suite-master-hidro': {
          title: 'Spa Privado de la Suite Principal con Vista al Mar',
          subtitle: 'Bañera de Hidromasaje · Chaise Lounge',
          description:
            'Área íntima de relajación en la suite principal con bañera de hidromasaje elevada, vigas de madera y balcón frente al mar.',
          alt: 'Bañera de hidromasaje en la suite principal con tumbona y vista al mar',
        },
        'closet-ilha': {
          title: 'Vestidor Principal con Espejos e Isla Central',
          subtitle: 'Puertas Espejadas Suelo-Techo · Iluminación Lineal LED',
          description:
            'Vestidor espacioso con armarios espejados de suelo a techo, cajonera central tipo isla, moqueta suave y entrada de luz natural.',
          alt: 'Vestidor amplio con armarios de espejo, isla central de cajones e iluminación LED',
        },
        'closet-camarinha': {
          title: 'Tocador Iluminado y Camerino de la Suite Principal',
          subtitle: 'Espejo Camerino · Vitrinas Iluminadas',
          description:
            'Espacio exclusivo anexo al vestidor con amplio tocador y espejo con marco LED, butaca clásica y armarios con iluminación interior.',
          alt: 'Tocador de la suite principal con espejo iluminado LED y cómoda a medida',
        },
        'banho-master': {
          title: 'Baño Principal con Doble Lavabo y Grifería Dorada',
          subtitle: 'Mampara con Perfilería Dorada · Mármol Calacatta',
          description:
            'Baño principal revestido en porcelanato marmolado con doble seno, mueble oscuro, espejos biselados y ducha con detalles dorados.',
          alt: 'Baño principal con dos lavabos, mueble grafito y mampara con perfil dorado',
        },
        'suite-esportiva': {
          title: 'Suite Temática Juvenil Deportiva con Mural de Autor',
          subtitle: 'Mural Exclusivo de Baloncesto · Lámpara Aro y LED',
          description:
            'Suite climatizada con mural artístico deportivo en el cabecero, lámpara temática, cortinas con foseado iluminado y mobiliario a medida.',
          alt: 'Suite temática juvenil deportiva con mural de baloncesto, lámpara de aro y TV',
        },
        'suite-infantil-espacial': {
          title: 'Suite Temática Espacial con Tobogán y Litera',
          subtitle: 'Carpintería Lúdica a Medida · Armario Espejado',
          description:
            'Dormitorio diseñado con litera, tobogán en madera clara, mural espacial, zona de estudio y armarios con puertas de espejo.',
          alt: 'Suite infantil espacial con litera de madera, tobogán y vestidor con espejos',
        },
        'garagem-pergola-vidro': {
          title: 'Garaje Cubierto con Pérgola de Vidrio y LED Lineal',
          subtitle: 'Muros en Grafito · Suelo de Porcelanato Amaderado',
          description:
            'Amplio patio y cochera cubierta por estructura metálica y vidrio templado, perfiles verticales LED y portón automatizado.',
          alt: 'Garaje cubierto con techo de vidrio, estructura metálica oscura y suelo amaderado',
        },
        'garagem-acesso-mar': {
          title: 'Garaje Cubierto de Gran Porte con Eje hacia el Mar',
          subtitle: 'Múltiples Plazas · Acceso Directo de la Calle a la Playa',
          description:
            'Garaje de gran capacidad para varios vehículos y SUVs con zona cubierta cerrada, iluminación empotrada y paso directo hacia el área de ocio.',
          alt: 'Vista amplia del garaje cubierto con doble área de estacionamiento y corredor al mar',
        },
      },
    },
    location: {
      eyebrow: 'Ubicación Estratégica y Puntos Turísticos',
      title: 'Frente al mar en Guaratuba, conectada a los principales atractivos',
      capitalLabel: 'Capital del Estado',
      capitalDistance: '120 km',
      capitalSub: 'Desde Curitiba por BR-376 / Puente',
      envLabel: 'Entorno Inmediato',
      envValue: 'En la Arena',
      envSub: 'Junto al Puente de Guaratuba',
      swipeTitle: 'Puntos turísticos y distancias reales',
      swipeAction: 'Deslice →',
      fromMansion: 'Saliendo de la mansión',
      connectivityTitle: 'Valorización con el Nuevo Puente de Guaratuba',
      connectivityDesc:
        'Ubicada junto al eje de conexión más esperado del litoral paranaense, la propiedad combina acceso ágil sin esperas de cruce con la privacidad de una ensenada reservada.',
      connectivityFooter:
        'Acceso terrestre directo · Proximidad a marinas y aeropuertos regionales de Joinville / Curitiba',
      landmarks: {
        'morro-do-cristo': {
          name: 'Morro do Cristo (Brejatuba)',
          region: 'Playa de Brejatuba',
          distance: '3,2 km',
          travelTime: '7 min en coche',
          description:
            'Emblema local con mirador en la cima y vista panorámica de 360° de la costa, islas y el océano Atlántico.',
          alt: 'Vista panorámica del Morro do Cristo y la Playa de Brejatuba en Guaratuba',
        },
        'praia-central': {
          name: 'Playa Central',
          region: 'Paseo Marítimo Urbano',
          distance: '2,4 km',
          travelTime: '5 min en coche',
          description:
            'Bulevar arbolado frente al mar con gastronomía regional, comercios, cafés y todos los servicios.',
          alt: 'Paseo marítimo y arena de la Playa Central de Guaratuba',
        },
        'baia-guaratuba': {
          name: 'Bahía de Guaratuba',
          region: 'Frente a la Propiedad',
          distance: 'Primera línea',
          travelTime: 'Acceso inmediato',
          description:
            'Escenario náutico de aguas protegidas, marinas cercanas y atardeceres enmarcados por la Sierra do Mar.',
          alt: 'Embarcaciones fondeadas en la Bahía de Guaratuba al atardecer',
        },
        'paroquia-bom-sucesso': {
          name: 'Parroquia Nossa Senhora do Bom Sucesso',
          region: 'Centro Histórico',
          distance: '1,9 km',
          travelTime: '5 min en coche',
          description:
            'Monumento histórico colonial del siglo XVIII, símbolo de la tradición y arquitectura costera de Paraná.',
          alt: 'Fachada histórica de la Parroquia Nossa Senhora do Bom Sucesso en Guaratuba',
        },
        'praia-caieiras': {
          name: 'Playa de Caieiras',
          region: 'Canal de la Bahía',
          distance: '2,8 km',
          travelTime: '6 min en coche',
          description:
            'Ensenada de aguas tranquilas y cristalinas junto a formaciones rocosas naturales.',
          alt: 'Aguas tranquilas de la Playa de Caieiras en Guaratuba',
        },
      },
    },
    simulator: {
      eyebrow: 'Planificación Financiera y Propuesta (en USD)',
      resetMobile: 'Restaurar',
      resetDesktop: 'Restaurar escenario base',
      title: 'Simulador de Financiamiento y Propuesta',
      subtitle:
        'Ajuste el pago inicial, el plazo y la tasa sobre el valor publicado en dólares (cotización real del día) para comparar los sistemas SAC y Price.',
      listedPriceLabel: 'Precio publicado (USD hoy)',
      rateNoteLive: (rateStr) => `Dólar del día: ${rateStr}`,
      rateNoteFallback: (rateStr) => `Tipo de cambio ref.: ${rateStr}`,
      proposalLabel: 'Valor de la propuesta',
      proposalInputAria: 'Valor de la propuesta en dólares estadounidenses',
      basedOnPrefix: 'Calculado sobre',
      basedOnSuffix: 'Haga clic en el campo superior para simular otra oferta.',
      downPaymentLabel: 'Pago inicial (Entrada)',
      downPaymentEditHint: 'Edite % o valor en US$',
      downPctAria: 'Porcentaje de entrada',
      downValAria: 'Valor de la entrada en dólares',
      downSliderAria: 'Control deslizante del porcentaje de entrada',
      rangeLabel: 'Rango simulado: 20% a 80%',
      balanceLabel: 'Saldo a financiar',
      termLabel: 'Plazo',
      termAria: 'Plazo en meses',
      termSliderAria: 'Control deslizante de plazo en meses',
      monthsUnit: 'meses',
      monthSingular: 'mes',
      yearSingular: 'año',
      yearPlural: 'años',
      andConnector: 'y',
      equivalentTo: 'Equivalente a',
      rateLabel: 'Tasa anual efectiva de simulación',
      rateAria: 'Tasa efectiva anual en porcentaje',
      rateSliderAria: 'Control deslizante de tasa anual',
      rateUnit: '% anual',
      presetBank: '12% · Escenario bancario',
      presetDirect: '8,4% · Negociación directa',
      kpiDown: 'Entrada',
      kpiBalance: 'Saldo a financiar',
      kpiFirstInstallment: 'Primera cuota',
      kpiPriceSub: (sacFirst) => `Price · o ${sacFirst} en SAC`,
      cardHeaderTitle: 'Mansión Frente al Mar · Guaratuba, Paraná, Brasil',
      cardListedPrice: 'Precio publicado:',
      cardSimulatedOffer: 'Propuesta simulada:',
      summarySentence: ({ down, financed, months, rate }) =>
        `Simulación de ${down} de entrada, ${financed} a financiar, ${months} meses al ${rate}% efectivo anual.`,
      colResult: 'Concepto',
      colSacSub: 'cuotas decrecientes',
      colPriceSub: 'cuotas fijas*',
      rowDown: 'Entrada',
      rowFirst: 'Primera cuota',
      rowLast: 'Última cuota',
      rowInterest: (months) => `Intereses totales en ${months} meses`,
      rowTotal: 'Total pagado (incluida entrada)',
      insightText: ({ diffPrice, savingsSac, duration }) =>
        `*Valores aproximados en dólares según el tipo de cambio de hoy, sin incluir actualización monetaria, seguros ni comisiones. El sistema Price reduce la primera cuota en aprox. ${diffPrice}, mientras que SAC ahorra unos ${savingsSac} en intereses durante ${duration}.`,
      sendButton: 'Enviar Propuesta al Propietario',
      warningStrong: 'Atención:',
      warningText:
        'Los valores anteriores son solo una simulación. Las tasas pueden variar al alza o a la baja según su banco y la cotización cambiaria vigente.',
      negotiateOptionTitle: 'Negociar personalmente',
      negotiateOptionDesc:
        'Acordar condiciones, forma de pago y visita directamente con el propietario',
      simulateOptionTitle: 'Quiero simular entrada y financiamiento',
      simulateOptionDesc: 'Comparar cuotas SAC y Price sobre el precio publicado',
      negotiateSelectedBadge: 'Opción seleccionada: Negociar personalmente con el propietario',
      negotiateCtaButton: 'Solicitar Negociación Personal',
      negotiateSubject: 'Negociar Personalmente con el Propietario',
      negotiateNotes:
        'Estoy interesado en la propiedad y me gustaría negociar personalmente directamente con el propietario.',
      negotiateModalSummary: 'Negociar personalmente · Precio publicado:',
    },
    leadForm: {
      eyebrow: 'Atención Privada · Directo con el Propietario',
      title: 'Envíe su propuesta o agende una visita exclusiva',
      intro:
        'Negocie directamente con el propietario con total confidencialidad y sin intermediarios. Complete sus datos para enviar su propuesta o solicitar una visita privada en Guaratuba.',
      bullets: [
        'Atención con cita previa, máxima discreción y respuesta en menos de 24 horas por el canal indicado.',
        'Flexibilidad para visitas presenciales en Guaratuba o presentación por videoconferencia en vivo.',
        'Envío directo mediante el formulario seguro de esta página, sin aplicaciones externas.',
      ],
      attachedProposal: 'Propuesta:',
      attachedDown: 'Entrada',
      attachedMonths: 'meses',
      removeAttachmentAria: 'Quitar propuesta adjunta',
      nameLabel: 'Nombre completo',
      namePlaceholder: 'Su nombre completo',
      emailLabel: 'Su correo electrónico',
      emailPlaceholder: 'correo@ejemplo.com',
      emailValid: 'Correo electrónico válido',
      phoneLabel: 'Teléfono / WhatsApp',
      phonePlaceholder: '+34 600 000 000 o WhatsApp',
      phoneValid: 'Teléfono / WhatsApp válido',
      cityLabel: 'Ciudad',
      cityPlaceholder: 'Ej.: Madrid',
      stateLabel: 'Estado / Provincia',
      statePlaceholder: 'Ej.: Madrid',
      dateLabel: 'Fecha preferida de visita (opcional)',
      visitModeLabel: 'Modalidad de atención',
      visitInPerson: 'Presencial',
      visitVirtual: 'Tour Virtual',
      visitInPersonValue: 'Presencial en Guaratuba',
      visitVirtualValue: 'Tour Virtual Privado',
      notesLabel: 'Propuesta, horario preferido o comentario (opcional)',
      notesPlaceholder:
        'Indique su propuesta en USD o BRL, condiciones de pago u horario ideal de contacto',
      submitButton: 'Enviar Propuesta y Mensaje',
      submittingButton: 'Enviando...',
      requiredNote: '* Nombre, correo, teléfono, ciudad y estado son obligatorios',
      warningStrong: 'Aviso:',
      warningText:
        'Este cálculo es solo una simulación. Las tasas pueden cambiar al alza o a la baja según su entidad bancaria.',
      errorName: 'Por favor, ingrese su nombre completo para enviar el mensaje.',
      errorEmail: 'Ingrese un correo electrónico válido para enviar el mensaje.',
      errorPhoneFallback: 'Ingrese un número de teléfono o WhatsApp válido con código de país.',
      errorCity: 'Ingrese su ciudad para enviar el mensaje.',
      errorState: 'Ingrese su estado o provincia para enviar el mensaje.',
      errorServerFallback:
        'No fue posible enviar su mensaje. Verifique nombre, correo y teléfono e intente nuevamente.',
      errorConnection: 'Error de conexión al enviar su mensaje. Inténtelo nuevamente en unos instantes.',
      modalTitle: 'Mensaje enviado con éxito.',
      modalDesc: 'Dentro de 24h nos pondremos en contacto.',
      modalClose: 'Cerrar',
      modalCloseAria: 'Cerrar ventana de confirmación',
      defaultSubject: 'Propuesta / Agendamiento de Visita',
      openFormCta: 'Haz tu propuesta y envía',
      openFormSubnote: 'Ventana fija y limpia · Sin saltos al escribir',
      cardEyebrow: 'Canal Directo · Sin Intermediarios',
      cardTitle: 'Envíe su propuesta y agende atención en 2 pasos',
      cardStep1:
        '1. Defina el valor de su oferta y si es al contado, financiado o negociar directo con el propietario',
      cardStep2: '2. Complete su nombre, correo y WhatsApp y envíe directo al propietario',
    },
    proposalModal: {
      dialogTitle: 'Haz tu Propuesta',
      closeAria: 'Cerrar ventana de propuesta',
      step1Tab: '1. Valores de la Oferta',
      step2Tab: '2. Tus Datos y Envío',
      paymentTypeLabel: 'Modalidad de pago deseada',
      cashOption: 'Al contado',
      financedOption: 'Entrada + Cuotas',
      negotiateOption: 'A negociar',
      proposalValueLabel: 'Valor de tu propuesta',
      presetListed: 'Valor publicado',
      presetMinus5: '-5%',
      presetMinus10: '-10%',
      downPctLabel: 'Entrada (%)',
      downValLabel: 'Valor de entrada',
      termLabel: 'Plazo (meses)',
      rateLabel: 'Tasa anual estimada (% anual)',
      presetDirectRate: '8,4% · Directo',
      presetBankRate: '12% · Bancario',
      summaryFinanced: 'Saldo a financiar',
      summarySacFirst: '1ª cuota SAC',
      summaryPriceFixed: 'Cuota fija Price',
      summaryCashTotal: 'Pago al contado',
      summaryNegotiateLabel: 'Negociación directa',
      summaryNegotiateDesc: 'Valores y condiciones acordados directamente con el propietario',
      continueToData: 'Continuar a Tus Datos',
      editValues: 'Editar valores',
      backToValues: 'Volver a valores',
      cashOfferSummary: (val) => `Oferta al contado: ${val}`,
      negotiateOfferSummary: (listed) => `A negociar directamente · Referencia: ${listed}`,
      financedOfferSummary: ({ offer, down, months, rate }) =>
        `Oferta: ${offer} · Entrada: ${down} · ${months} meses (${rate}% anual)`,
      cashSubject: 'Propuesta al Contado — Mansión Frente al Mar',
      negotiateSubject: 'Propuesta A Negociar — Mansión Frente al Mar',
    },
    footer: {
      desc: 'Presentación oficial de propiedad exclusiva frente al mar en Guaratuba (Brasil), en negociación directa con el propietario y sin intermediarios.',
      modeLabel: 'Modalidad:',
      modeValue: 'Venta Directa con el Propietario',
      serviceLabel: 'Atención:',
      serviceLink: 'Formulario Privado de Propuesta',
      locationLabel: 'Ubicación:',
      locationValue: 'Guaratuba, Paraná, Brasil',
      navTitle: 'Navegación',
      navLinks: {
        mansao: 'La Mansión',
        galeria: 'Galería de Ambientes',
        localizacao: 'Ubicación y Distancias',
        simulador: 'Simulador de Propuesta',
        agendar: 'Agendar Visita',
      },
      legalTitle: 'Información Legal y Disponibilidad',
      legalText:
        'Propiedad exclusiva sujeta a confirmación de disponibilidad, negociación directa de valores y actualización sin previo aviso. Las simulaciones tienen carácter meramente informativo y los valores en USD se calculan según la cotización del día.',
      copyright: (year) =>
        `© ${year} Mansão Guaratuba · Venta Directa con el Propietario. Todos los derechos reservados.`,
      bottomTag: 'Mansión Contemporánea Frente al Mar · Guaratuba, PR, Brasil',
    },
    guabiruba: {
      fabAria: 'Invertir en Guabiruba (Santa Catarina)',
      fabTitle: 'Invertir en Guabiruba (SC)',
      eyebrow: 'Oportunidad Estratégica · Santa Catarina, Brasil',
      modalTitle: 'Invertir en Guabiruba (SC)',
      closeAria: 'Cerrar ventana',
      intro1:
        'Invertir en Guabiruba (Santa Catarina) es una elección estratégica para quienes buscan equilibrio entre fortaleza industrial, calidad de vida y valorización inmobiliaria.',
      intro2: 'Los principales motivos para invertir en el municipio incluyen:',
      closeBtn: 'Cerrar',
      topics: [
        {
          number: '1',
          title: 'Economía Sólida y Polo Textil Consolidado',
          points: [
            {
              label: 'Tradición y escala:',
              text: 'La economía local está fuertemente impulsada por la industria textil y de confección, con cientos de empresas generando empleo formal y gran aporte fiscal regional.',
            },
            {
              label: 'Crecimiento del PIB:',
              text: 'El Producto Interno Bruto (PIB) municipal registra una sólida expansión nominal, impulsado por micro, pequeñas y medianas empresas dinámicas.',
            },
          ],
        },
        {
          number: '2',
          title: 'Mercado Inmobiliario y Demanda Habitacional',
          points: [
            {
              label: 'Valorización patrimonial:',
              text: 'El desarrollo de la infraestructura urbana, nuevos loteos planificados y constructoras locales generan una excelente oportunidad de plusvalía a mediano y largo plazo.',
            },
            {
              label: 'Demanda de vivienda:',
              text: 'Existe un déficit habitacional y creciente demanda —especialmente en barrios en expansión como São Pedro—, atrayendo tanto a inversores de renta como a familias.',
            },
          ],
        },
        {
          number: '3',
          title: 'Calidad de Vida y Seguridad',
          points: [
            {
              label: 'IDH elevado:',
              text: 'El municipio cuenta con un Índice de Desarrollo Humano (IDH) de 0,754, reflejando altos niveles de bienestar social.',
            },
            {
              label: 'Seguridad y tranquilidad:',
              text: 'Guabiruba destaca por sus bajos índices de criminalidad y un fuerte sentido comunitario donde las familias disfrutan de tranquilidad.',
            },
            {
              label: 'Cercanía con la naturaleza:',
              text: 'Rodeada de colinas, senderos ecológicos y cascadas (como el Morro São José y el Morro Santo Antônio), atrae turismo ecológico cerca de los grandes polos del Valle Europeo.',
            },
          ],
        },
        {
          number: '4',
          title: 'Proximidad a Brusque e Infraestructura Regional',
          points: [
            {
              text: 'Colindante con Brusque, Guabiruba aprovecha la infraestructura de un gran centro comercial e industrial vecino y recibe inversiones continuas en vialidad y prevención hídrica.',
            },
          ],
        },
      ],
    },
    appContexts: {
      dossierSubject: 'Solicitud de Dossier Completo',
      dossierNotes:
        'Me gustaría recibir la memoria descriptiva completa e información sobre la mansión en Guaratuba.',
      consultRoomSubject: (room) => `Consulta sobre ambiente: ${room}`,
      consultRoomNotes: (room) => `Me gustaría recibir más detalles sobre el ambiente "${room}".`,
      simulationSubject: 'Propuesta Simulada — Mansión Frente al Mar',
    },
  },

  en: {
    docTitle: 'Contemporary Oceanfront Mansion — Direct Owner Sale | Guaratuba, Brazil',
    header: {
      brand: 'Mansão Guaratuba',
      navAria: 'Main navigation',
      mobileNavAria: 'Mobile navigation',
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
      cta: 'Make an Offer',
      languageSelectorLabel: 'Select language and currency',
      nav: {
        mansao: 'The Mansion',
        ambientes: 'Spaces',
        localizacao: 'Location & Distances',
        simulador: 'Simulator',
      },
    },
    hero: {
      eyebrow: 'Direct Owner Sale · Guaratuba, PR, Brazil · Direct Beachfront',
      h1: 'Contemporary Oceanfront Mansion — Direct From Owner',
      description:
        '1,100 m² (11,840 sq ft) of signature beachfront architecture featuring an oceanfront pool, reflecting pond, floating glass staircase, private elevator, climate-controlled wine cellar, gourmet lounge with draft beer tap, fitness studio, and starlit home cinema.',
      ctaPrimary: 'Make an Offer',
      ctaSecondary: 'Explore Property',
      fallbackTitle: 'Contemporary Oceanfront Mansion — Guaratuba, Brazil',
      heroAlt:
        'Real aerial view of the beachfront mansion right next to the Guaratuba Bridge with panoramic views of Guaratuba Bay and the Atlantic Ocean',
      askingPriceLabel: 'Asking Price (Live USD)',
      liveRatePrefix: "Today's exchange rate",
      attributes: [
        { label: 'Built Area', value: '1,100 m² (11,840 sq ft)' },
        { label: 'Setting', value: 'Toes in the Sand · Oceanfront' },
        { label: 'Location', value: 'Next to the New Bridge' },
        { label: 'Private Leisure', value: 'Cinema, Spa, Wine Cellar & Gym' },
      ],
    },
    showcase: {
      eyebrow: 'Residential Architecture & Engineering · Guaratuba, Paraná, Brazil',
      title: 'Designed to frame Guaratuba Bay with uncompromising comfort',
      intro:
        'Every space balances noble materials, discreet automation, and seamless indoor-outdoor oceanfront flow. From the graphite and natural slatted-wood facade to the private path straight onto the sand, this residence delivers privacy and rare construction quality on southern Brazil’s coast.',
      dossierEyebrow: 'Architectural Brief',
      dossierTitle: 'Technical Specifications & Finishes',
      dossierDesc:
        'Explore the structural details, resort-grade leisure equipment, and thermal and acoustic engineering integrated throughout the mansion.',
      dossierButton: 'Request Full Dossier',
      highlights: {
        '01': {
          title: '1,100 m² Beachfront Beside the Bridge',
          category: 'Site & Scale',
          description:
            'Commanding three-story residence with contemporary graphite facade, natural slatted wood, expansive reflective glass walls, and direct sand access.',
        },
        '02': {
          title: 'Living Area, Floating Staircase & Elevator',
          category: 'Social & Accessibility',
          description:
            'Open-concept living and dining featuring an LED-lit floating staircase, marble-clad private elevator, and glass-enclosed climate-controlled wine cellar.',
        },
        '03': {
          title: 'Starlit Home Cinema & Private Gym',
          category: 'Entertainment & Wellness',
          description:
            'Soundproofed private theater with blue fiber-optic starlit ceiling and HD projection, plus a fully equipped ocean-view fitness room.',
        },
        '04': {
          title: 'Oceanfront Pool, Reflecting Pond & Indoor Spa',
          category: 'Leisure & Well-Being',
          description:
            'Travertine floating stepping stones over a crystal reflecting pond, heated LED beachfront pool, indoor hydro spa, and gourmet bar with draft tap & parrilla.',
        },
        '05': {
          title: 'Bespoke Suites & Mirrored Dressing Room',
          category: 'Private Quarters',
          description:
            'Oceanfront master suite with private hydro spa, hammock, vanity dressing studio, and mirrored walk-in closet, plus custom sports and space-themed suites.',
        },
        '06': {
          title: 'Oversized Covered Glass-Pergola Garage',
          category: 'Infrastructure',
          description:
            'Covered multi-vehicle garage with steel-and-glass pergola roof, wood-grain porcelain flooring, linear LED lighting, and automated gates.',
        },
      },
      accordions: {
        estrutura: {
          title: 'Structural Standard & Facade (1,100 m²)',
          summary: 'Architectural graphite finish, natural slatted timber, and floor-to-ceiling glass',
          items: [
            '1,100 m² (11,840 sq ft) across three levels served by a private marble-clad elevator.',
            'Front and oceanfront facades finished in architectural graphite texture, natural wood brises, and tempered glass balustrades.',
            '100% recessed linear LED architectural lighting across social areas, floating staircase, and garage.',
            'Marine-grade slip-resistant travertine and wood-look porcelain outdoor decking.',
          ],
        },
        lazer: {
          title: 'Leisure, Gourmet Lounge, Cinema & Integrated Spa',
          summary: 'Complete private oceanfront resort infrastructure',
          items: [
            'Crystal reflecting pond with floating travertine pavers leading from the covered gourmet veranda to the beachfront pool.',
            'Indoor heated hydro spa integrated into the living hall beside the floating staircase with ocean views.',
            'Full gourmet bar with commercial draft beer dispenser, dark-marble parrilla grill, wine coolers, and suspended bottle rack.',
            'Acoustically isolated Home Theater with HD projector and fiber-optic starlit ceiling, plus ocean-view gym.',
          ],
        },
        suites: {
          title: 'Suites, Mirrored Closet & Custom Millwork',
          summary: 'Climate control, bespoke cabinetry, and themed bedrooms',
          items: [
            'Oceanfront master suite with private whirlpool spa, ocean-breeze hammock, ceiling-retractable TV, and home office desk.',
            'Expansive mirrored walk-in closet with center island, illuminated vanity studio, and dual-sink master bath with gold fixtures.',
            'Custom sports-themed suite featuring hand-painted basketball mural; playful space-themed kids suite with bunk bed and slide.',
            'Full-home air conditioning paired with warm slatted timber ceilings and fendi-tone bespoke cabinetry.',
          ],
        },
        'localizacao-seguranca': {
          title: 'Location, Garage & Capital Appreciation',
          summary: 'Direct beachfront next to the Guaratuba Bridge',
          items: [
            'Prime beachfront parcel with direct sand access and permanent views over Guaratuba Bay and the new bridge.',
            'Spacious covered garage beneath steel-and-glass pergola accommodating multiple SUVs and guest vehicles.',
            'Strictly confidential direct-owner negotiation with clean title ready for immediate deed transfer.',
          ],
        },
      },
    },
    gallery: {
      eyebrow: 'Visual Curation · Real Photography',
      title: 'Explore every space of the estate',
      showingPrefix: 'Showing',
      photoSingular: 'real photograph',
      photoPlural: 'real photographs',
      tapHint: 'of the property. Tap any image to enlarge.',
      filterAria: 'Filter spaces by category',
      categories: {
        Todos: 'All',
        'Fachada & Área Externa': 'Facade & Grounds',
        "Living & Espelho d'Água": 'Living & Reflecting Pond',
        'Home Cinema Estrelado': 'Starlit Home Cinema',
        'Suítes & Closet': 'Suites & Closet',
        Garagem: 'Garage',
      },
      collapseBtn: 'Collapse gallery',
      expandAllTemplate: (count) => `View all ${count} photographs`,
      lightboxAriaPrefix: 'Enlarged view:',
      photoCounter: (idx, total) => `Photo ${idx} of ${total}`,
      closeLabel: 'Close viewer',
      prevLabel: 'Previous photo',
      nextLabel: 'Next photo',
      consultRoom: 'Inquire About This Space',
      items: {
        'aerea-ponte': {
          title: 'Prime Location Next to the Guaratuba Bridge',
          subtitle: 'Real Aerial View · Direct Beachfront · Bay & Ocean',
          description:
            'Exclusive oceanfront positioning spanning 1,100 m² built area with unobstructed bay views and immediate access next to the Guaratuba Bridge.',
          alt: 'Real aerial photograph showing the beachfront mansion right beside the Guaratuba Bridge',
        },
        'fachada-mar': {
          title: 'Contemporary Oceanfront Facade & Beachfront Lawn',
          subtitle: 'Graphite, Natural Timber & Panoramic Glass',
          description:
            'Three-level architectural massing with glass railings, stepped balconies, retractable glass enclosures, and lawn opening directly onto the beach.',
          alt: 'Oceanfront facade of the mansion in graphite, wood, and glass with beachfront lawn',
        },
        'fachada-rua': {
          title: 'Main Street Facade in Graphite, Wood & Mirror Glass',
          subtitle: 'Commanding Arrival · Landscaping & Access Control',
          description:
            'Grand main entrance clad in architectural graphite texture, natural wood paneling, generous paved forecourt, and reflective panoramic glazing.',
          alt: 'Street-side facade of the mansion with graphite finish, wood slats, and mirrored glass',
        },
        'piscina-praia': {
          title: 'Oceanfront Swimming Pool with Linear LED Lighting',
          subtitle: 'Solarium Deck · Direct Beach Horizon',
          description:
            'Private pool featuring recessed linear LEDs, frameless glass barrier preserving the sea horizon, and sun loungers facing the Atlantic.',
          alt: 'Private pool with LED lighting, sun loungers, and unobstructed ocean view',
        },
        'terrace-balancos': {
          title: 'Upper Terrace with Outdoor Fire Pit & Hanging Swings',
          subtitle: 'Graphite Pergola · Ocean & Coastal Mountain Views',
          description:
            'Upper-level sunset lounge with nautical-rope hanging swings, fire-pit table, and sweeping views of the sea and Serra do Mar mountains.',
          alt: 'Upper terrace with graphite pergola beams, hanging swings, and fire table',
        },
        'espelho-dagua-mar': {
          title: 'Reflecting Pond with Floating Pavers Facing the Sea',
          subtitle: 'Covered Gourmet Veranda · Recessed Ceiling LEDs',
          description:
            'Shaded coastal lounge bordered by a crystal-clear reflecting pool with travertine floating stepping stones and unobstructed beach views.',
          alt: 'Covered beachfront veranda with reflecting pond, stone pavers, and beach view',
        },
        'living-escadaria-hidro': {
          title: 'Main Living Hall with Floating Staircase & Indoor Spa',
          subtitle: 'Double-Height Ceiling · Slatted Wood & LED Profiles',
          description:
            'Seamless social hall showcasing an LED-underlit floating staircase, structural glass balustrade, slatted wood ceiling, and indoor hydro spa.',
          alt: 'Living hall featuring lit floating stairs, slatted ceiling, and indoor hot tub',
        },
        'hidro-vista-piscina': {
          title: 'Indoor Hydro Spa Flowing Out to the Pool & Sea',
          subtitle: 'Floor-to-Ceiling Glass · Complete Indoor-Outdoor Living',
          description:
            'Heated indoor whirlpool positioned right along floor-to-ceiling glass overlooking the exterior pool deck and Guaratuba beach.',
          alt: 'Indoor hydro spa looking through full-height glass to the pool and ocean',
        },
        'living-adega-elevador': {
          title: 'Living, Dining, Marble Elevator & Wine Cellar',
          subtitle: 'Open Oceanfront Concept · Fendi Millwork',
          description:
            'Expansive living and 10-seat dining salon in fendi and off-white tones with marble-wrapped private elevator and glass climate-controlled wine room.',
          alt: 'Dining and living salon with glass wine cellar, marble elevator, and sea view',
        },
        'espaco-gourmet-bar': {
          title: 'Gourmet Lounge & Panoramic Bar with Draft Tap',
          subtitle: 'Parrilla Grill, Beverage Coolers & Suspended Rack',
          description:
            'Complete entertaining lounge with dark stone counter, built-in draft beer tap, dark-marble parrilla, wine fridges, and direct ocean view.',
          alt: 'Gourmet bar lounge with draft dispenser, overhead bottle rack, and ocean backdrop',
        },
        'cozinha-gourmet': {
          title: 'Gourmet Kitchen with Marble Island & Stainless Appliances',
          subtitle: 'Smart Automation & Built-In Pro Line',
          description:
            'Bespoke chef’s kitchen anchored by a white marble island, flush cooktop and teppanyaki grill, stainless wall ovens, and smart refrigerator.',
          alt: 'Bright gourmet kitchen with white marble island and stainless steel appliances',
        },
        'home-cinema-teto': {
          title: 'Private Home Cinema with Blue Starlit Ceiling',
          subtitle: 'Fiber Optics · HD Projection · Deep Modular Lounge',
          description:
            'Acoustically engineered private cinema featuring a glowing blue fiber-optic night sky ceiling, HD projector, and deep lounge seating.',
          alt: 'Private home theater with blue starlit ceiling, projector, and deep modular sofa',
        },
        'home-cinema-tela': {
          title: 'Home Theater — Wide Screen & Acoustic Surround',
          subtitle: 'Dedicated Audio · Scene Automation',
          description:
            'View toward the oversized projection screen flanked by dedicated surround speakers, slatted acoustic paneling, and whisper-quiet cooling.',
          alt: 'Wide cinema screen, acoustic panels, audio gear, and starlit ceiling',
        },
        'academia-frente-mar': {
          title: 'Air-Conditioned Oceanfront Private Fitness Studio',
          subtitle: 'Pro Equipment · Panoramic Ocean & Mountain Views',
          description:
            'Full home gym equipped with multi-station trainer, treadmill, free weights, mirrored wall, and panoramic windows facing sea and mountains.',
          alt: 'Private fitness studio with professional equipment and ocean views',
        },
        'suite-master-panoramica': {
          title: 'Oceanfront Master Suite with Hammock & Ceiling TV',
          subtitle: 'Private Terrace · Spa & Home Office Integration',
          description:
            'Ultra-luxury primary suite with king bed, motorized ceiling-retractable TV, beachfront hammock, and built-in executive desk.',
          alt: 'Spacious master suite with king bed, retractable ceiling TV, hammock, and sea view',
        },
        'suite-master-hidro': {
          title: 'Master Suite Private Spa Overlooking the Ocean',
          subtitle: 'Elevated Whirlpool Tub · Designer Chaise Lounge',
          description:
            'Intimate relaxation sanctuary inside the master suite featuring an elevated hydro tub, timber ceiling beams, and oceanfront balcony.',
          alt: 'Master suite whirlpool tub with lounge chaise and panoramic ocean view',
        },
        'closet-ilha': {
          title: 'Primary Dressing Room with Mirrors & Center Island',
          subtitle: 'Floor-to-Ceiling Mirrored Doors · Linear LED',
          description:
            'Generous walk-in closet lined with full-height mirrored wardrobes, center island chest, plush carpeting, and natural daylight.',
          alt: 'Expansive walk-in closet with mirrored doors, center drawer island, and LED lighting',
        },
        'closet-camarinha': {
          title: 'Master Vanity Studio & Illuminated Dressing Table',
          subtitle: 'Hollywood Mirror · Illuminated Glass Cabinetry',
          description:
            'Dedicated dressing alcove adjacent to the closet with wide makeup vanity, backlit LED mirror frame, accent chair, and glass cabinets.',
          alt: 'Master dressing vanity with backlit LED mirror and custom storage cabinetry',
        },
        'banho-master': {
          title: 'Master Bath Suite with Dual Vanity & Gold Fixtures',
          subtitle: 'Gold-Trimmed Glass Shower · Calacatta Porcelain',
          description:
            'Master bathroom wrapped in Calacatta-style marble porcelain with double sinks, dark millwork, beveled mirrors, and brushed-gold shower enclosure.',
          alt: 'Master bathroom with dual sinks, dark cabinetry, and gold-trimmed glass shower',
        },
        'suite-esportiva': {
          title: 'Custom Youth Sports Suite with Hand-Painted Mural',
          subtitle: 'Bespoke Basketball Artwork · Hoop Sconce & LED Cove',
          description:
            'Climate-controlled bedroom featuring custom basketball wall art behind the headboard, novelty hoop lighting, cove-lit drapery, and built-ins.',
          alt: 'Sports-themed youth suite with basketball mural, hoop light fixture, and TV',
        },
        'suite-infantil-espacial': {
          title: 'Space-Themed Kids Suite with Bunk Bed & Slide',
          subtitle: 'Playful Bespoke Millwork · Mirrored Closet',
          description:
            'Custom children’s suite complete with natural wood bunk beds, integrated indoor slide, space-themed mural, study desk, and mirrored wardrobes.',
          alt: 'Space-themed kids bedroom with wooden bunk bed, slide, and mirrored closet',
        },
        'garagem-pergola-vidro': {
          title: 'Covered Garage with Glass Pergola & Linear LEDs',
          subtitle: 'Graphite Walls · Wood-Look Porcelain Paving',
          description:
            'Expansive motor court and covered parking beneath dark steel and tempered glass pergola, vertical LED light strips, and automated gate.',
          alt: 'Covered garage featuring tempered glass roof, dark steel frame, and wood-tile floor',
        },
        'garagem-acesso-mar': {
          title: 'High-Capacity Covered Garage with Ocean Axis',
          subtitle: 'Multiple Bays · Direct Street-to-Beach Passage',
          description:
            'Large covered parking hall designed for multiple SUVs and luxury cars with enclosed bays, recessed lighting, and direct flow to the beach.',
          alt: 'Wide view of covered multi-car garage leading straight toward the oceanfront lawn',
        },
      },
    },
    location: {
      eyebrow: 'Strategic Location & Coastal Landmarks',
      title: 'Oceanfront in Guaratuba, connected to every coastal landmark',
      capitalLabel: 'State Capital',
      capitalDistance: '120 km',
      capitalSub: 'From Curitiba via BR-376 / Bridge',
      envLabel: 'Immediate Setting',
      envValue: 'Beachfront',
      envSub: 'Right beside the Guaratuba Bridge',
      swipeTitle: 'Landmarks & real distances',
      swipeAction: 'Swipe →',
      fromMansion: 'From the mansion',
      connectivityTitle: 'Capital Appreciation with the New Guaratuba Bridge',
      connectivityDesc:
        'Positioned right beside Paraná’s most anticipated coastal infrastructure link, the estate combines seamless ferry-free highway access with the seclusion of a private cove.',
      connectivityFooter:
        'Direct land access · Minutes from marinas and regional airports in Joinville & Curitiba',
      landmarks: {
        'morro-do-cristo': {
          name: 'Morro do Cristo (Brejatuba)',
          region: 'Brejatuba Beach',
          distance: '3.2 km',
          travelTime: '7 min drive',
          description:
            'Iconic hilltop overlook offering 360° panoramic views of the coastline, coastal islands, and Atlantic Ocean.',
          alt: 'Panoramic view of Morro do Cristo and Brejatuba Beach in Guaratuba',
        },
        'praia-central': {
          name: 'Praia Central',
          region: 'Main Boardwalk',
          distance: '2.4 km',
          travelTime: '5 min drive',
          description:
            'Tree-lined oceanfront promenade with regional dining, cafes, convenience services, and vibrant coastal life.',
          alt: 'Boardwalk and sandy shoreline of Praia Central in Guaratuba',
        },
        'baia-guaratuba': {
          name: 'Guaratuba Bay',
          region: 'Property Frontage',
          distance: 'Steps away',
          travelTime: 'Immediate access',
          description:
            'Protected boating waters, nearby yacht marinas, and dramatic sunsets framed by the Serra do Mar mountain range.',
          alt: 'Boats anchored in calm Guaratuba Bay at sunset',
        },
        'paroquia-bom-sucesso': {
          name: 'Nossa Senhora do Bom Sucesso Church',
          region: 'Historic Center',
          distance: '1.9 km',
          travelTime: '5 min drive',
          description:
            '18th-century colonial landmark celebrating the heritage and coastal architecture of southern Brazil.',
          alt: 'Historic colonial facade of Nossa Senhora do Bom Sucesso Church in Guaratuba',
        },
        'praia-caieiras': {
          name: 'Caieiras Beach',
          region: 'Bay Channel',
          distance: '2.8 km',
          travelTime: '6 min drive',
          description:
            'Sheltered cove with calm, clear waters nestled beside natural granite boulders along the bay channel.',
          alt: 'Calm waters at Caieiras Beach in Guaratuba',
        },
      },
    },
    simulator: {
      eyebrow: 'Financial Planning & Offer Simulator (USD)',
      resetMobile: 'Reset',
      resetDesktop: 'Reset default scenario',
      title: 'Financing & Purchase Offer Simulator',
      subtitle:
        "Adjust down payment, term, and annual rate on the asking price in US Dollars (converted at today's real exchange rate) to compare SAC and Price schedules side by side.",
      listedPriceLabel: 'Asking price (Live USD)',
      rateNoteLive: (rateStr) => `Today's rate: ${rateStr}`,
      rateNoteFallback: (rateStr) => `Reference rate: ${rateStr}`,
      proposalLabel: 'Offer amount',
      proposalInputAria: 'Offer amount in US dollars',
      basedOnPrefix: 'Based on asking price of',
      basedOnSuffix: 'Click the field above to enter a custom offer amount.',
      downPaymentLabel: 'Down payment',
      downPaymentEditHint: 'Edit % or US$ amount',
      downPctAria: 'Down payment percentage',
      downValAria: 'Down payment in US dollars',
      downSliderAria: 'Down payment percentage slider',
      rangeLabel: 'Simulated range: 20% to 80%',
      balanceLabel: 'Amount to finance',
      termLabel: 'Term',
      termAria: 'Term in months',
      termSliderAria: 'Loan term in months slider',
      monthsUnit: 'months',
      monthSingular: 'month',
      yearSingular: 'year',
      yearPlural: 'years',
      andConnector: 'and',
      equivalentTo: 'Equivalent to',
      rateLabel: 'Effective annual interest rate',
      rateAria: 'Annual interest rate percentage',
      rateSliderAria: 'Annual interest rate slider',
      rateUnit: '% p.a.',
      presetBank: '12% · Bank benchmark',
      presetDirect: '8.4% · Direct owner terms',
      kpiDown: 'Down payment',
      kpiBalance: 'Financed balance',
      kpiFirstInstallment: 'First installment',
      kpiPriceSub: (sacFirst) => `Price · or ${sacFirst} in SAC`,
      cardHeaderTitle: 'Oceanfront Mansion · Guaratuba, Paraná, Brazil',
      cardListedPrice: 'Asking price:',
      cardSimulatedOffer: 'Simulated offer:',
      summarySentence: ({ down, financed, months, rate }) =>
        `Simulation with ${down} down payment, ${financed} financed over ${months} months at ${rate}% effective annual rate.`,
      colResult: 'Metric',
      colSacSub: 'declining payments',
      colPriceSub: 'fixed payments*',
      rowDown: 'Down payment',
      rowFirst: 'First monthly payment',
      rowLast: 'Final monthly payment',
      rowInterest: (months) => `Total interest over ${months} months`,
      rowTotal: 'Total paid (incl. down payment)',
      insightText: ({ diffPrice, savingsSac, duration }) =>
        `*Approximate USD figures at today's live exchange rate, excluding monetary indexing, insurance, or bank fees. Price lowers the initial payment by about ${diffPrice}, while SAC saves roughly ${savingsSac} in total interest over ${duration}.`,
      sendButton: 'Send Offer to Owner',
      warningStrong: 'Notice:',
      warningText:
        'Figures above are for simulation only. Interest rates may shift up or down depending on your bank and prevailing FX rates.',
      negotiateOptionTitle: 'Negotiate in person',
      negotiateOptionDesc:
        'Discuss terms, payment structure, and viewing directly with the owner',
      simulateOptionTitle: 'I want to simulate down payment & financing',
      simulateOptionDesc: 'Compare SAC and Price installments on the asking price',
      negotiateSelectedBadge: 'Selected option: Negotiate in person with the owner',
      negotiateCtaButton: 'Request In-Person Negotiation',
      negotiateSubject: 'Negotiate In Person with Owner',
      negotiateNotes:
        'I am interested in the property and would like to negotiate terms in person directly with the owner.',
      negotiateModalSummary: 'Negotiate in person · Asking price:',
    },
    leadForm: {
      eyebrow: 'Private Concierge · Direct Owner Contact',
      title: 'Submit your offer or schedule a private viewing',
      intro:
        'Negotiate directly with the owner in strict confidence with zero brokerage intermediaries. Complete the form to submit your offer or book a private tour in Guaratuba.',
      bullets: [
        'By-appointment private service with complete discretion and response within 24 hours via your preferred channel.',
        'Flexible scheduling for in-person tours in Guaratuba or live private video walkthroughs.',
        'Direct encrypted submission through this page with no external redirects.',
      ],
      attachedProposal: 'Offer:',
      attachedDown: 'Down payment',
      attachedMonths: 'months',
      removeAttachmentAria: 'Remove attached simulation',
      nameLabel: 'Full name',
      namePlaceholder: 'Your full name',
      emailLabel: 'Your email',
      emailPlaceholder: 'you@example.com',
      emailValid: 'Valid email address',
      phoneLabel: 'Phone / WhatsApp',
      phonePlaceholder: '+1 (555) 000-0000 or WhatsApp',
      phoneValid: 'Valid WhatsApp / phone number',
      cityLabel: 'City',
      cityPlaceholder: 'e.g. Miami',
      stateLabel: 'State / Province',
      statePlaceholder: 'e.g. FL',
      dateLabel: 'Preferred viewing date (optional)',
      visitModeLabel: 'Viewing format',
      visitInPerson: 'In-Person',
      visitVirtual: 'Virtual Tour',
      visitInPersonValue: 'In-Person in Guaratuba',
      visitVirtualValue: 'Private Virtual Tour',
      notesLabel: 'Offer details, preferred time, or notes (optional)',
      notesPlaceholder:
        'Share your offer in USD or BRL, payment structure, or preferred time to connect',
      submitButton: 'Send Offer & Message',
      submittingButton: 'Sending...',
      requiredNote: '* Name, email, phone, city, and state are required',
      warningStrong: 'Notice:',
      warningText:
        'This calculation is a simulation only. Final rates may adjust higher or lower depending on your bank.',
      errorName: 'Please enter your full name to send your message.',
      errorEmail: 'Please enter a valid email address.',
      errorPhoneFallback: 'Please enter a valid phone or WhatsApp number with country code.',
      errorCity: 'Please enter your city.',
      errorState: 'Please enter your state or province.',
      errorServerFallback:
        'Unable to send your message. Please verify your name, email, and phone number and try again.',
      errorConnection: 'Connection error while sending your message. Please try again shortly.',
      modalTitle: 'Message sent successfully.',
      modalDesc: 'We will contact you within 24 hours.',
      modalClose: 'Close',
      modalCloseAria: 'Close confirmation window',
      defaultSubject: 'Purchase Offer / Private Viewing Request',
      openFormCta: 'Make an Offer & Send',
      openFormSubnote: 'Opens in a steady, distraction-free view',
      cardEyebrow: 'Direct Line · Zero Intermediaries',
      cardTitle: 'Send your offer & contact info in 2 quick steps',
      cardStep1:
        '1. Set your offer price and cash, installment terms, or negotiate directly with the owner',
      cardStep2: '2. Enter your name, email & WhatsApp and submit directly to the owner',
    },
    proposalModal: {
      dialogTitle: 'Make Your Offer',
      closeAria: 'Close offer window',
      step1Tab: '1. Offer Values',
      step2Tab: '2. Your Info & Send',
      paymentTypeLabel: 'Preferred payment structure',
      cashOption: 'All Cash',
      financedOption: 'Down Payment + Terms',
      negotiateOption: 'To Negotiate',
      proposalValueLabel: 'Your offer amount',
      presetListed: 'Listed price',
      presetMinus5: '-5%',
      presetMinus10: '-10%',
      downPctLabel: 'Down payment (%)',
      downValLabel: 'Down payment amount',
      termLabel: 'Term (months)',
      rateLabel: 'Estimated annual rate (% p.a.)',
      presetDirectRate: '8.4% · Direct',
      presetBankRate: '12% · Bank',
      summaryFinanced: 'Financed balance',
      summarySacFirst: '1st SAC installment',
      summaryPriceFixed: 'Fixed Price installment',
      summaryCashTotal: 'All-cash offer',
      summaryNegotiateLabel: 'Direct negotiation',
      summaryNegotiateDesc: 'Price and payment terms agreed directly with the owner',
      continueToData: 'Continue to Your Info',
      editValues: 'Edit values',
      backToValues: 'Back to values',
      cashOfferSummary: (val) => `All-cash offer: ${val}`,
      negotiateOfferSummary: (listed) => `Open to negotiate · Listed: ${listed}`,
      financedOfferSummary: ({ offer, down, months, rate }) =>
        `Offer: ${offer} · Down: ${down} · ${months} months (${rate}% p.a.)`,
      cashSubject: 'All-Cash Offer — Oceanfront Mansion',
      negotiateSubject: 'Negotiable Offer — Oceanfront Mansion',
    },
    footer: {
      desc: 'Official presentation of an exclusive oceanfront residence in Guaratuba, Brazil — offered directly by the owner without intermediaries.',
      modeLabel: 'Sale Type:',
      modeValue: 'Direct Owner Sale',
      serviceLabel: 'Contact:',
      serviceLink: 'Private Inquiry & Offer Form',
      locationLabel: 'Location:',
      locationValue: 'Guaratuba, Paraná, Brazil',
      navTitle: 'Navigation',
      navLinks: {
        mansao: 'The Mansion',
        galeria: 'Photo Gallery',
        localizacao: 'Location & Distances',
        simulador: 'Offer Simulator',
        agendar: 'Book Viewing',
      },
      legalTitle: 'Legal Notice & Availability',
      legalText:
        'Exclusive property subject to availability confirmation, direct negotiation, and price adjustments without prior notice. Financing simulations are informational only and USD figures reflect today’s live FX rate.',
      copyright: (year) =>
        `© ${year} Mansão Guaratuba · Direct Owner Sale. All rights reserved.`,
      bottomTag: 'Contemporary Oceanfront Mansion · Guaratuba, PR, Brazil',
    },
    guabiruba: {
      fabAria: 'Invest in Guabiruba (Santa Catarina)',
      fabTitle: 'Invest in Guabiruba (SC)',
      eyebrow: 'Strategic Opportunity · Santa Catarina, Brazil',
      modalTitle: 'Investing in Guabiruba (SC)',
      closeAria: 'Close window',
      intro1:
        'Investing in Guabiruba (Santa Catarina, Brazil) is a strategic choice for those seeking a balance of industrial strength, high quality of life, and real estate appreciation.',
      intro2: 'Key reasons to invest in the municipality include:',
      closeBtn: 'Close',
      topics: [
        {
          number: '1',
          title: 'Strong Economy & Established Textile Hub',
          points: [
            {
              label: 'Scale and heritage:',
              text: 'The local economy is strongly driven by textile and apparel manufacturing, with hundreds of companies generating formal jobs and major fiscal value-add.',
            },
            {
              label: 'GDP growth:',
              text: 'Municipal GDP has posted strong nominal expansion, fueled by dynamic micro, small, and medium-sized enterprises.',
            },
          ],
        },
        {
          number: '2',
          title: 'Real Estate Market & Housing Demand',
          points: [
            {
              label: 'Capital appreciation:',
              text: 'Expanding urban infrastructure, newly planned subdivisions, and local developers create a compelling medium-to-long-term capital gain window.',
            },
            {
              label: 'Strong housing demand:',
              text: 'Persistent housing demand—especially in fast-growing neighborhoods such as São Pedro—attracts both rental-yield investors and relocating families.',
            },
          ],
        },
        {
          number: '3',
          title: 'Quality of Life & Safety',
          points: [
            {
              label: 'High HDI:',
              text: 'The city holds a Human Development Index (HDI) of 0.754, reflecting strong social well-being.',
            },
            {
              label: 'Safety and peace of mind:',
              text: 'Guabiruba is widely recognized for low crime rates and a welcoming community spirit where families enjoy everyday freedom.',
            },
            {
              label: 'Close to nature:',
              text: 'Surrounded by lush hills, eco-trails, and waterfalls (such as Morro São José and Morro Santo Antônio), it draws eco-tourism right beside Santa Catarina’s European Valley.',
            },
          ],
        },
        {
          number: '4',
          title: 'Proximity to Brusque & Regional Infrastructure',
          points: [
            {
              text: 'Bordering Brusque directly, Guabiruba leverages a major commercial and industrial hub while receiving ongoing investments in roadways and flood-mitigation infrastructure.',
            },
          ],
        },
      ],
    },
    appContexts: {
      dossierSubject: 'Full Architectural Dossier Request',
      dossierNotes:
        'I would like to receive the complete architectural brief and additional information on the Guaratuba oceanfront mansion.',
      consultRoomSubject: (room) => `Space inquiry: ${room}`,
      consultRoomNotes: (room) => `I would like more details about "${room}".`,
      simulationSubject: 'Simulated Offer — Oceanfront Mansion',
    },
  },
};
