import morroCristoImg from '../assets/images/landmark_morro_cristo_1794746258018.jpg';
import praiaCentralImg from '../assets/images/landmark_praia_central_1794746258066.jpg';
import baiaGuaratubaImg from '../assets/images/landmark_baia_guaratuba_1794746258282.jpg';
import paroquiaMatrizImg from '../assets/images/landmark_paroquia_matriz_1794746258732.jpg';
import praiaCaieirasImg from '../assets/images/landmark_praia_caieiras_1794746260909.jpg';

export const BROKER_CONFIG = {
  company: 'Mansão Guaratuba',
  creci: 'Venda Direta com o Proprietário',
  city: 'Guaratuba, Paraná',
  builtArea: '1.100 m²',
  referenceValue: 30000000,
};

export const HERO_MEDIA = {
  image: '/assets/aistudio/WhatsApp_Image_2026-11-14_at_09.52.02__1__e28c8826.jpeg',
  alt: 'Vista aérea real da mansão pé na areia ao lado da Ponte de Guaratuba, com vista panorâmica para a Baía de Guaratuba e oceano',
};

export type GalleryCategory =
  | 'Todos'
  | 'Fachada & Área Externa'
  | "Living & Espelho d'Água"
  | 'Home Cinema Estrelado'
  | 'Suítes & Closet'
  | 'Garagem';

export const GALLERY_CATEGORIES: GalleryCategory[] = [
  'Todos',
  'Fachada & Área Externa',
  "Living & Espelho d'Água",
  'Home Cinema Estrelado',
  'Suítes & Closet',
  'Garagem',
];

export interface GalleryItem {
  id: string;
  title: string;
  category: Exclude<GalleryCategory, 'Todos'>;
  subtitle: string;
  description: string;
  image: string;
  alt: string;
}

export const GALLERY_ITEMS: GalleryItem[] = [
  // Fachada & Área Externa
  {
    id: 'aerea-ponte',
    title: 'Localização Privilegiada ao Lado da Ponte de Guaratuba',
    category: 'Fachada & Área Externa',
    subtitle: 'Vista Aérea Real · Pé na Areia · Baía e Mar',
    description:
      'Implantação exclusiva à beira-mar com 1.100 m² de área construída, vista definitiva para a baía e acesso imediato junto à Ponte de Guaratuba.',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-14_at_09.52.10__3__d03c5370.jpeg',
    alt: 'Foto aérea real mostrando a mansão à beira-mar exatamente ao lado da Ponte de Guaratuba',
  },
  {
    id: 'fachada-mar',
    title: 'Fachada Contemporânea Frente ao Mar & Jardim Pé na Areia',
    category: 'Fachada & Área Externa',
    subtitle: 'Grafite, Madeira Natural & Envidraçamento Panorâmico',
    description:
      'Volumetria em três pavimentos com guarda-corpos em vidro, varandas escalonadas, fechamento em vidro retrátil e gramado com saída direta para a areia.',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-14_at_09.52.06__3__4ebc098e.jpeg',
    alt: 'Fachada voltada para o mar da mansão em grafite, madeira e vidro com gramado frontal',
  },
  {
    id: 'fachada-rua',
    title: 'Fachada Principal em Grafite, Ripado e Pano de Vidro',
    category: 'Fachada & Área Externa',
    subtitle: 'Entrada Social Imponente · Paisagismo & Controle de Acesso',
    description:
      'Entrada principal com revestimento em textura grafite, painel em madeira natural, amplo recuo pavimentado e janela panorâmica em vidro espelhado.',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-14_at_09.52.09__3__0a1aa677.jpeg',
    alt: 'Fachada frontal da mansão com acabamento grafite, painel ripado e esquadria espelhada',
  },
  {
    id: 'piscina-praia',
    title: 'Piscina Frente ao Mar com Iluminação em LED',
    category: 'Fachada & Área Externa',
    subtitle: 'Deck Solarium · Vista Direta para a Praia',
    description:
      'Piscina privativa com perfil linear de LED embutido, guarda-corpo em vidro para preservar o horizonte marinho e espreguiçadeiras voltadas para o oceano.',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-14_at_09.52.05_917b601f.jpeg',
    alt: 'Piscina privativa com iluminação em LED, espreguiçadeiras e vista direta para o mar',
  },
  {
    id: 'terrace-balancos',
    title: 'Terraço Superior com Lareira Externa e Balanços',
    category: 'Fachada & Área Externa',
    subtitle: 'Pergolado em Grafite · Vista Mar e Serra do Mar',
    description:
      'Terraço de contemplação no pavimento superior com balanços suspensos em corda náutica, mesa lareira e vista para as montanhas e oceano.',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-14_at_09.52.01__3__a7b59ba4.jpeg',
    alt: 'Terraço superior com vigas em grafite, balanços suspensos e lareira externa',
  },

  // Living & Espelho d'Água
  {
    id: 'espelho-dagua-mar',
    title: "Espelho d'Água com Pisantes Flutuantes Frente Mar",
    category: "Living & Espelho d'Água",
    subtitle: 'Varanda Gourmet Integrada · LED Linear no Teto',
    description:
      "Área de convivência coberta contornada por espelho d'água cristalino com pisantes flutuantes em travertino, colunas em grafite e vista livre para a praia.",
    image: '/assets/aistudio/WhatsApp_Image_2026-11-14_at_09.52.01__1__679481b0.jpeg',
    alt: "Varanda coberta com espelho d'água, pisantes em pedra e vista direta para a praia",
  },
  {
    id: 'living-escadaria-hidro',
    title: 'Living Social com Escadaria Flutuante e Hidro Interna',
    category: "Living & Espelho d'Água",
    subtitle: 'Pé-Direito Duplo · Forro Ripado e Perfis de LED',
    description:
      'Ambiente integrado com escadaria flutuante iluminada em LED, guarda-corpo em vidro estrutural, forro amadeirado ripado e hidromassagem interna.',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-14_at_09.51.55_f073fa58.jpeg',
    alt: 'Living social com escadaria flutuante iluminada, forro ripado e hidro interna',
  },
  {
    id: 'hidro-vista-piscina',
    title: 'Hidro Spa Interno Integrado à Piscina e ao Mar',
    category: "Living & Espelho d'Água",
    subtitle: 'Panorâmica Piso-Teto · Conexão Total Interno/Externo',
    description:
      'Spa interno aquecido posicionado junto às esquadrias piso-teto com vista direta para a piscina externa e a faixa de areia de Guaratuba.',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-14_at_09.52.04_1bd99fd6.jpeg',
    alt: 'Hidro spa interno com vista através do vidro para a piscina externa e o mar',
  },
  {
    id: 'living-adega-elevador',
    title: 'Sala de Estar, Jantar, Elevador e Adega Climatizada',
    category: "Living & Espelho d'Água",
    subtitle: 'Conceito Aberto Frente Mar · Mármore e Marcenaria Fendi',
    description:
      'Amplo living em tons fendi e off-white com mesa de jantar para 10 lugares, elevador privativo revestido em mármore e adega climatizada com portas em vidro.',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-14_at_09.52.13__1__21841080.jpeg',
    alt: 'Sala de jantar e estar integradas com adega climatizada, elevador e vista para o mar',
  },
  {
    id: 'espaco-gourmet-bar',
    title: 'Espaço Gourmet & Bar Panorâmico com Chopeira',
    category: "Living & Espelho d'Água",
    subtitle: 'Parrilla, Cervejeiras e Garrafeiro Suspenso Frente Mar',
    description:
      'Lounge gourmet completo com bancada em pedra escura, chopeira integrada, parrilla revestida em mármore escuro, adegas e vista frontal para o mar.',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-14_at_09.52.05__1__495ccf8d.jpeg',
    alt: 'Espaço gourmet e bar completo com chopeira, garrafeiro suspenso e vista para o mar',
  },
  {
    id: 'cozinha-gourmet',
    title: 'Cozinha Gourmet com Ilha em Mármore e Eletros Inox',
    category: "Living & Espelho d'Água",
    subtitle: 'Automação & Linha Profissional Embutida',
    description:
      'Cozinha planejada com ilha central em mármore branco, cooktop e chapa embutidos, fornos em inox e refrigerador smart integrado ao jantar.',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-14_at_09.52.10_40dc8218.jpeg',
    alt: 'Cozinha gourmet em tons claros com ilha de mármore e eletrodomésticos em inox',
  },

  // Home Cinema Estrelado
  {
    id: 'home-cinema-teto',
    title: 'Home Cinema Privativo com Teto Estrelado Azul',
    category: 'Home Cinema Estrelado',
    subtitle: 'Fibra Óptica · Projetor HD · Sofá Modular Profundo',
    description:
      'Sala de cinema dedicada com isolamento acústico completo, teto estrelado em fibra óptica com iluminação azul cênica e projetor de alta definição.',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-14_at_09.52.00_e89c2932.jpeg',
    alt: 'Home cinema privativo com teto estrelado azul, projetor e sofá modular amplo',
  },
  {
    id: 'home-cinema-tela',
    title: 'Home Theater — Projeção em Tela Ampla e Acústica',
    category: 'Home Cinema Estrelado',
    subtitle: 'Sistema Surround · Automação de Cenas',
    description:
      'Ângulo voltado para a tela de projeção de grande formato com caixas acústicas dedicadas, painel ripado lateral e climatização silenciosa.',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-14_at_09.52.05__4__f81c8b16.jpeg',
    alt: 'Vista da tela de cinema, equipamento de áudio e teto estrelado do home theater',
  },
  {
    id: 'academia-frente-mar',
    title: 'Academia Privativa Climatizada Frente ao Mar',
    category: 'Home Cinema Estrelado',
    subtitle: 'Equipamentos Profissionais · Vista Panorâmica',
    description:
      'Espaço fitness completo com estação multifuncional, esteira, pesos livres, parede espelhada e janelas panorâmicas voltadas para o oceano e a serra.',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-14_at_09.52.10__1__2404e132.jpeg',
    alt: 'Academia privativa equipada com aparelhos profissionais e vista para o mar',
  },

  // Suítes & Closet
  {
    id: 'suite-master-panoramica',
    title: 'Suíte Master Frente Mar com Rede e TV Retrátil no Teto',
    category: 'Suítes & Closet',
    subtitle: 'Terraço Privativo · Integração com Hidro & Home Office',
    description:
      'Suíte principal de altíssimo padrão com cama king, TV motorizada embutida no forro, rede de descanso voltada para a praia e bancada de escritório.',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-14_at_09.52.09_19b03c98.jpeg',
    alt: 'Suíte master ampla com cama king, TV retrátil no teto, rede e vista para o mar',
  },
  {
    id: 'suite-master-hidro',
    title: 'Spa Privativo da Suíte Master com Vista para o Mar',
    category: 'Suítes & Closet',
    subtitle: 'Banheira de Hidromassagem · Chaise Lounge',
    description:
      'Área íntima de relaxamento dentro da suíte master equipada com banheira de hidromassagem elevada, forro com vigas amadeiradas e varanda frente mar.',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-14_at_09.52.10__2__8e0bbae6.jpeg',
    alt: 'Banheira de hidromassagem na suíte master com chaise laranja e vista para o mar',
  },
  {
    id: 'closet-ilha',
    title: 'Closet Principal em Marcenaria Espelhada e Ilha Central',
    category: 'Suítes & Closet',
    subtitle: 'Portas em Espelho Piso-Teto · Iluminação Linear LED',
    description:
      'Closet espaçoso com armários espelhados do chão ao teto, gaveteiro central tipo ilha, carpete macio e entrada de luz natural.',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-14_at_09.52.02_d86fdc47.jpeg',
    alt: 'Closet amplo com armários espelhados, ilha central de gavetas e iluminação LED',
  },
  {
    id: 'closet-camarinha',
    title: 'Camarinha & Penteadeira Iluminada da Suíte Master',
    category: 'Suítes & Closet',
    subtitle: 'Espelho Camarim · Armários em Vidro Armado',
    description:
      'Espaço exclusivo anexo ao closet com penteadeira ampla e espelho com moldura iluminada em LED, poltrona clássica e armários com iluminação interna.',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-14_at_09.52.06__1__5be49f44.jpeg',
    alt: 'Camarinha da suíte master com penteadeira iluminada em LED e cômoda planejada',
  },
  {
    id: 'banho-master',
    title: 'Sala de Banho Master com Cuba Dupla e Metais Dourados',
    category: 'Suítes & Closet',
    subtitle: 'Box em Vidro com Perfil Dourado · Mármore Calacatta',
    description:
      'Banheiro da suíte master revestido em porcelanato marmorizado com bancada dupla, marcenaria escura, espelhos bisotados e box com acabamento dourado.',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-14_at_09.52.07_925e68ea.jpeg',
    alt: 'Banheiro master com duas cubas, marcenaria grafite e box com perfil dourado',
  },
  {
    id: 'suite-esportiva',
    title: 'Suíte Temática Jovem & Esportiva com Grafite Autoral',
    category: 'Suítes & Closet',
    subtitle: 'Mural Basquete Exclusivo · Luminária Aro & Iluminação LED',
    description:
      'Suíte climatizada com painel artístico esportivo personalizado na cabeceira, luminária temática, cortinas com sanca iluminada e marcenaria sob medida.',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-14_at_09.52.03__3__e2e0b23e.jpeg',
    alt: 'Suíte temática jovem esportiva com mural de basquete, luminária de cesta e TV',
  },
  {
    id: 'suite-infantil-espacial',
    title: 'Suíte Temática Espacial com Escorregador e Beliche',
    category: 'Suítes & Closet',
    subtitle: 'Marcenaria Lúdica Sob Medida · Armário Espelhado',
    description:
      'Dormitório planejado com cama beliche, escorregador em madeira clara, mural temático espacial, bancada de estudos e armários espelhados.',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-14_at_09.52.06_1c3ec661.jpeg',
    alt: 'Suíte infantil temática espacial com beliche em madeira, escorregador e closet espelhado',
  },

  // Garagem
  {
    id: 'garagem-pergola-vidro',
    title: 'Garagem Coberta com Pérgola em Vidro e LED Linear',
    category: 'Garagem',
    subtitle: 'Paredes em Grafite · Piso em Porcelanato Amadeirado',
    description:
      'Amplo pátio e garagem coberta por estrutura metálica e vidro temperado, perfis verticais de LED e portão automatizado em tom grafite.',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-14_at_09.52.03_cb09f89f.jpeg',
    alt: 'Garagem coberta com cobertura em vidro e estrutura metálica escura e piso amadeirado',
  },
  {
    id: 'garagem-acesso-mar',
    title: 'Garagem Coberta de Amplo Porte com Eixo para o Mar',
    category: 'Garagem',
    subtitle: 'Múltiplas Vagas · Acesso Direto da Rua à Orla',
    description:
      'Garagem de grande porte comportando múltiplos veículos e SUVs com área coberta fechada, iluminação embutida e circulação direta até a área de lazer.',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-14_at_09.52.02__2__4dada8f0.jpeg',
    alt: 'Vista ampla da garagem coberta com dupla área de estacionamento e corredor para o mar',
  },
];

export interface ArchitecturalHighlight {
  index: string;
  title: string;
  category: string;
  description: string;
  spanWide?: boolean;
}

export const ARCHITECTURAL_HIGHLIGHTS: ArchitecturalHighlight[] = [
  {
    index: '01',
    title: '1.100 m² Pé na Areia ao Lado da Ponte',
    category: 'Implantação & Escala',
    description:
      'Residência imponente em três pavimentos com fachada contemporânea em grafite, madeira natural ripada, amplos panos de vidro espelhado e saída direta para a areia.',
    spanWide: true,
  },
  {
    index: '02',
    title: 'Living, Escadaria Flutuante & Elevador',
    category: 'Social & Acessibilidade',
    description:
      'Estar e jantar integrados com escadaria flutuante iluminada em LED, elevador privativo revestido em mármore e adega climatizada fechada em vidro.',
  },
  {
    index: '03',
    title: 'Home Cinema Estrelado & Academia',
    category: 'Entretenimento & Saúde',
    description:
      'Sala de cinema privativa com teto estrelado em fibra óptica azul, projetor HD e isolamento acústico, além de academia completa com vista para o mar.',
  },
  {
    index: '04',
    title: "Piscina Frente Mar, Espelho d'Água & Hidro",
    category: 'Lazer & Bem-Estar',
    description:
      "Espelho d'água com pisantes flutuantes, piscina aquecida com LED frente à praia, hidro spa interno integrado e espaço gourmet com chopeira e parrilla.",
  },
  {
    index: '05',
    title: 'Suítes Planejadas & Closet Espelhado',
    category: 'Ala Íntima',
    description:
      'Suíte master com hidro privativa, rede frente mar, camarinha e closet espelhado com ilha, além de suíte esportiva com grafite e suíte infantil temática.',
    spanWide: true,
  },
  {
    index: '06',
    title: 'Garagem Coberta de Amplo Porte',
    category: 'Infraestrutura',
    description:
      'Garagem com cobertura em pérgola de vidro e estrutura metálica, piso em porcelanato amadeirado, iluminação linear em LED e acesso automatizado.',
  },
];

export interface AccordionSpec {
  id: string;
  title: string;
  summary: string;
  items: string[];
}

export const TECHNICAL_ACCORDIONS: AccordionSpec[] = [
  {
    id: 'estrutura',
    title: 'Padrão Construtivo & Fachada (1.100 m²)',
    summary: 'Grafite estrutural, madeira natural ripada e esquadrias panorâmicas',
    items: [
      '1.100 m² de área construída distribuídos com elevador privativo atendendo os pavimentos.',
      'Fachada frontal e posterior em textura grafite, brises e painéis em madeira natural e guarda-corpos em vidro.',
      'Iluminação arquitetônica 100% em LED embutido com perfis lineares nas áreas sociais, escada e garagem.',
      'Piso externo em porcelanato amadeirado e travertino antiderrapante com resistência marinha.',
    ],
  },
  {
    id: 'lazer',
    title: 'Lazer, Gourmet, Cinema & Spa Integrado',
    summary: 'Estrutura completa de resort privativo frente ao mar',
    items: [
      "Espelho d'água com pisantes flutuantes em pedra e varanda gourmet contígua à piscina frente mar.",
      'Spa / hidromassagem interna integrada ao living com escadaria flutuante e vista para a praia.',
      'Lounge gourmet com chopeira profissional, parrilla revestida em mármore escuro, adegas e garrafeiro suspenso.',
      'Home Theater com isolamento acústico, projetor HD e teto estrelado em fibra óptica azul, além de academia equipada.',
    ],
  },
  {
    id: 'suites',
    title: 'Suítes, Closet Espelhado & Marcenaria',
    summary: 'Conforto térmico, marcenaria sob medida e ambientes temáticos',
    items: [
      'Suíte master frente mar com hidro spa privativo, rede de descanso, TV retrátil embutida no teto e escritório.',
      'Closet espaçoso em marcenaria espelhada com ilha central, camarinha com penteadeira iluminada e banheiro com cuba dupla.',
      'Suíte jovem temática esportiva com grafite personalizado de basquete e luminária temática; suíte infantil espacial com beliche e escorregador.',
      'Climatização em todos os ambientes sociais e íntimos com marcenaria ripada e acabamentos em tons fendi.',
    ],
  },
  {
    id: 'localizacao-seguranca',
    title: 'Localização, Garagem & Valorização',
    summary: 'Pé na areia ao lado da Ponte de Guaratuba',
    items: [
      'Terreno pé na areia com saída direta para a praia e vista permanente para a Baía e Ponte de Guaratuba.',
      'Garagem coberta de amplo porte com cobertura em vidro e estrutura metálica para múltiplos veículos.',
      'Atendimento sigiloso e negociação direta com o proprietário, com documentação regularizada para transferência imediata.',
    ],
  },
];

export interface LandmarkItem {
  id: string;
  name: string;
  region: string;
  distance: string;
  travelTime: string;
  description: string;
  image: string;
  alt: string;
}

export const LANDMARKS: LandmarkItem[] = [
  {
    id: 'morro-do-cristo',
    name: 'Morro do Cristo (Brejatuba)',
    region: 'Praia de Brejatuba',
    distance: '3,2 km',
    travelTime: '7 min de carro',
    description:
      'Cartão-postal com mirante no topo do morro e vista panorâmica 360° da orla, ilhas e oceano Atlântico.',
    image: morroCristoImg,
    alt: 'Vista panorâmica do Morro do Cristo e da Praia de Brejatuba em Guaratuba',
  },
  {
    id: 'praia-central',
    name: 'Praia Central',
    region: 'Orla Urbana',
    distance: '2,4 km',
    travelTime: '5 min de carro',
    description:
      'Calçadão arborizado à beira-mar com gastronomia regional, conveniências, cafés e infraestrutura completa.',
    image: praiaCentralImg,
    alt: 'Calçadão e faixa de areia da Praia Central de Guaratuba',
  },
  {
    id: 'baia-guaratuba',
    name: 'Baía de Guaratuba',
    region: 'Frente da Propriedade',
    distance: 'Pé na areia',
    travelTime: 'Acesso imediato',
    description:
      'Cenário náutico de águas protegidas, marinas próximas e pôr do sol emoldurado pela Serra do Mar.',
    image: baiaGuaratubaImg,
    alt: 'Embarcações ancoradas na Baía de Guaratuba ao entardecer',
  },
  {
    id: 'paroquia-bom-sucesso',
    name: 'Paróquia Nossa Senhora do Bom Sucesso',
    region: 'Centro Histórico',
    distance: '1,9 km',
    travelTime: '5 min de carro',
    description:
      'Marco histórico colonial datado do século XVIII, símbolo da tradição e da arquitetura litorânea paranaense.',
    image: paroquiaMatrizImg,
    alt: 'Fachada histórica da Paróquia Nossa Senhora do Bom Sucesso em Guaratuba',
  },
  {
    id: 'praia-caieiras',
    name: 'Praia de Caieiras',
    region: 'Canal da Baía',
    distance: '2,8 km',
    travelTime: '6 min de carro',
    description:
      'Enseada de águas calmas e transparentes junto às pedras naturais, próxima ao canal de travessia de ferry-boat.',
    image: praiaCaieirasImg,
    alt: 'Águas tranquilas da Praia de Caieiras com ferry-boat ao fundo em Guaratuba',
  },
];
