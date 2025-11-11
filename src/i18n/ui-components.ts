/**
 * UI Components translations for EN/ES
 * Supports bilingual shadcn/ui component examples
 */
export const uiComponentTranslations = {
  en: {
    buttons: {
      title: 'Button Components',
      primary: 'Primary Button',
      secondary: 'Secondary Button',
      accent: 'Accent Button',
      outline: 'Outline Button',
      ghost: 'Ghost Button',
      link: 'Link Button',
      destructive: 'Destructive Button',
      sizes: 'Button Sizes',
      small: 'Small',
      default: 'Default',
      large: 'Large',
      extraLarge: 'Extra Large',
    },
    cards: {
      title: 'Card Components',
      cardTitle: 'Card Title',
      cardDescription: 'This is a card description that provides context.',
      cardContent:
        'Card content goes here. Cards are perfect for grouping related information with consistent spacing and styling.',
      actionButton: 'Action',
      secondaryButton: 'Cancel',
    },
    dialogs: {
      title: 'Dialog Components',
      openDialog: 'Open Dialog',
      dialogTitle: 'Are you absolutely sure?',
      dialogDescription:
        'This action cannot be undone. This will permanently delete your account and remove your data from our servers.',
      confirmButton: 'Continue',
      cancelButton: 'Cancel',
    },
    navbar: {
      title: 'Navigation Menu Components',
      menu: 'Menu',
      userMenu: 'Account',
      profile: 'Profile',
      settings: 'Settings',
      help: 'Help',
      logout: 'Log out',
      account: 'My Account',
    },
    demo: {
      title: 'shadcn/ui Components Demo',
      subtitle: 'Brand-aligned UI components for JuaneloJGAC Tech',
      description:
        'All components follow the brand guidelines with proper colors, typography, spacing, and accessibility standards (WCAG 2.1 AA).',
      darkModeToggle: 'Toggle Dark Mode',
      responsive: 'Responsive Design',
      accessible: 'WCAG 2.1 AA Compliant',
      bilingual: 'Bilingual Support (EN/ES)',
      brandColors: 'Brand Color System',
    },
  },
  es: {
    buttons: {
      title: 'Componentes de Botón',
      primary: 'Botón Primario',
      secondary: 'Botón Secundario',
      accent: 'Botón de Acento',
      outline: 'Botón de Contorno',
      ghost: 'Botón Fantasma',
      link: 'Botón de Enlace',
      destructive: 'Botón Destructivo',
      sizes: 'Tamaños de Botón',
      small: 'Pequeño',
      default: 'Predeterminado',
      large: 'Grande',
      extraLarge: 'Extra Grande',
    },
    cards: {
      title: 'Componentes de Tarjeta',
      cardTitle: 'Título de Tarjeta',
      cardDescription: 'Esta es una descripción de tarjeta que proporciona contexto.',
      cardContent:
        'El contenido de la tarjeta va aquí. Las tarjetas son perfectas para agrupar información relacionada con espaciado y estilo consistentes.',
      actionButton: 'Acción',
      secondaryButton: 'Cancelar',
    },
    dialogs: {
      title: 'Componentes de Diálogo',
      openDialog: 'Abrir Diálogo',
      dialogTitle: '¿Estás absolutamente seguro?',
      dialogDescription:
        'Esta acción no se puede deshacer. Esto eliminará permanentemente tu cuenta y removerá tus datos de nuestros servidores.',
      confirmButton: 'Continuar',
      cancelButton: 'Cancelar',
    },
    navbar: {
      title: 'Componentes de Menú de Navegación',
      menu: 'Menú',
      userMenu: 'Cuenta',
      profile: 'Perfil',
      settings: 'Configuración',
      help: 'Ayuda',
      logout: 'Cerrar sesión',
      account: 'Mi Cuenta',
    },
    demo: {
      title: 'Demostración de Componentes shadcn/ui',
      subtitle: 'Componentes UI alineados con la marca para JuaneloJGAC Tech',
      description:
        'Todos los componentes siguen las pautas de marca con colores, tipografía, espaciado y estándares de accesibilidad apropiados (WCAG 2.1 AA).',
      darkModeToggle: 'Alternar Modo Oscuro',
      responsive: 'Diseño Responsivo',
      accessible: 'Compatible con WCAG 2.1 AA',
      bilingual: 'Soporte Bilingüe (EN/ES)',
      brandColors: 'Sistema de Colores de Marca',
    },
  },
} as const;

export type UIComponentLang = keyof typeof uiComponentTranslations;
