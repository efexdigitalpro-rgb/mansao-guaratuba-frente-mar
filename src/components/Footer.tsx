import { BROKER_CONFIG } from '../data/propertyData';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#1A1A1A] text-[#EAE5DC] border-t border-white/10">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10 pb-10 sm:pb-12 border-b border-white/10">
          <div className="md:col-span-5">
            <a
              href="#topo"
              className="font-display text-2xl font-semibold tracking-tight text-[#FAF8F5]"
            >
              {BROKER_CONFIG.company}
            </a>
            <p className="text-sm text-[#C8B8A2] leading-relaxed mt-3 max-w-md">
              Apresentação oficial de propriedade exclusiva frente ao mar em Guaratuba, com
              negociação direta com o proprietário e sem intermediação.
            </p>
            <div className="mt-5 text-xs text-[#EAE5DC] space-y-1.5">
              <p>
                <span className="text-[#C8B8A2]">Modalidade:</span> {BROKER_CONFIG.creci}
              </p>
              <p>
                <span className="text-[#C8B8A2]">Atendimento:</span>{' '}
                <a href="#agendamento" className="text-[#C59B27] hover:underline">
                  Formulário Privativo de Proposta
                </a>
              </p>
              <p>
                <span className="text-[#C8B8A2]">Localidade:</span> {BROKER_CONFIG.city}
              </p>
            </div>
          </div>

          <div className="md:col-span-3">
            <p className="text-xs font-semibold text-[#FAF8F5] mb-3 sm:mb-4">Navegação</p>
            <ul className="space-y-1 sm:space-y-2.5 text-sm text-[#C8B8A2]">
              <li>
                <a
                  href="#mansao"
                  className="inline-flex items-center min-h-[38px] sm:min-h-0 hover:text-[#C59B27] transition-colors"
                >
                  A Mansão
                </a>
              </li>
              <li>
                <a
                  href="#ambientes"
                  className="inline-flex items-center min-h-[38px] sm:min-h-0 hover:text-[#C59B27] transition-colors"
                >
                  Galeria de Ambientes
                </a>
              </li>
              <li>
                <a
                  href="#localizacao"
                  className="inline-flex items-center min-h-[38px] sm:min-h-0 hover:text-[#C59B27] transition-colors"
                >
                  Localização &amp; Distâncias
                </a>
              </li>
              <li>
                <a
                  href="#simulador"
                  className="inline-flex items-center min-h-[38px] sm:min-h-0 hover:text-[#C59B27] transition-colors"
                >
                  Simulador de Proposta
                </a>
              </li>
              <li>
                <a
                  href="#agendamento"
                  className="inline-flex items-center min-h-[38px] sm:min-h-0 hover:text-[#C59B27] transition-colors"
                >
                  Agendar Visita
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="text-xs font-semibold text-[#FAF8F5] mb-3 sm:mb-4">
              Informações Legais &amp; Disponibilidade
            </p>
            <p className="text-xs text-[#C8B8A2] leading-relaxed">
              Imóvel exclusivo sujeito à confirmação de disponibilidade, negociação direta de
              valores e atualização cadastral sem aviso prévio. As simulações apresentadas têm
              caráter meramente informativo e não constituem proposta vinculante de crédito.
            </p>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-center sm:text-left text-xs text-[#9E9589]">
          <p>
            © {year} {BROKER_CONFIG.company} · {BROKER_CONFIG.creci}. Todos os direitos reservados.
          </p>
          <p>Mansão Contemporânea Frente ao Mar · Guaratuba, PR</p>
        </div>
      </div>
    </footer>
  );
}
