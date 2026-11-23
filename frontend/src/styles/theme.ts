/**
 * RutuDrishti AI — Climate Intelligence Studio
 * Centralized Design System & Scientific Design Tokens
 */

export const theme = {
  colors: {
    // Primary Architectural Palette
    background: '#F5F2EB',
    surface: '#FFFFFF',
    surfaceAlt: '#FAF8F4',
    surfaceMuted: '#EFECE4',
    ink: '#252E37',
    inkMuted: '#5C6773',
    inkLight: '#8A95A1',
    navigation: '#252E37',
    navSurface: '#1F2730',
    navBorder: '#2E3944',

    // Scientific & Editorial Accents
    scientific: '#174F5B',
    scientificMuted: '#246B7B',
    scientificSurface: '#EBF4F6',
    scientificBorder: '#BED9DF',

    terracotta: '#C16B4C',
    terracottaMuted: '#D48669',
    terracottaSurface: '#FDF3EE',
    terracottaBorder: '#EFCFBF',

    sage: '#84917B',
    sageMuted: '#9BA892',
    sageSurface: '#F3F6F1',
    sageBorder: '#D1DBCB',

    divider: '#DBD5CC',
    dividerStrong: '#C6BEB2',

    // Calibrated Semantic Risk Palette
    risk: {
      low: {
        base: '#3B7A57',
        bg: '#EAF4EE',
        border: '#B8DBC5',
        text: '#1F5436',
      },
      moderate: {
        base: '#B8860B',
        bg: '#FDF8EB',
        border: '#EEDEA6',
        text: '#7A5C0E',
      },
      high: {
        base: '#C16B4C',
        bg: '#FAF0EB',
        border: '#ECC8B8',
        text: '#883E22',
      },
      severe: {
        base: '#9E3A32',
        bg: '#F9EBEA',
        border: '#E7BBB6',
        text: '#6B1E17',
      },
    },

    // Legacy compatibility mapping
    primary: {
      deepForest: '#174F5B',
      limestone: '#F5F2EB',
      sage: '#84917B',
      copper: '#C16B4C',
      charcoal: '#252E37',
      forestMuted: '#235D6B',
      forestDark: '#123942',
      limestoneDark: '#DBD5CC',
      limestoneLight: '#FAF8F4',
    },
    analytics: {
      midnightTeal: '#174F5B',
      dustyCyan: '#5E8B94',
      parchment: '#FAF8F4',
      deepTeal: '#0F343C',
      cyanLight: '#EBF4F6',
      cyanMuted: '#89AEB5',
      parchmentBorder: '#DBD5CC',
    },
    neutral: {
      white: '#FFFFFF',
      surface: '#FFFFFF',
      surfaceAlt: '#FAF8F4',
      border: '#DBD5CC',
      borderSubtle: '#E8E4DB',
      textPrimary: '#252E37',
      textSecondary: '#5C6773',
      textMuted: '#8A95A1',
      textInverse: '#F5F2EB',
    },
  },

  typography: {
    fontSans: "'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontMono: "'IBM Plex Mono', 'Menlo', monospace",
    fontHeading: "'Manrope', -apple-system, BlinkMacSystemFont, sans-serif",
  },

  shadows: {
    none: 'none',
    subtle: '0 1px 2px rgba(37, 46, 55, 0.04)',
    card: '0 1px 3px rgba(37, 46, 55, 0.05), 0 1px 2px rgba(37, 46, 55, 0.03)',
    elevated: '0 4px 12px rgba(37, 46, 55, 0.07)',
    floating: '0 8px 24px rgba(37, 46, 55, 0.09)',
  },

  radii: {
    none: '0',
    xs: '2px',
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '10px',
    pill: '9999px',
  },

  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },

  // Distinct Contextual Themes per Page
  pageThemes: {
    overview: {
      bg: '#F5F2EB',
      bannerBg: '#1F2730',
      bannerBorder: '#2E3944',
      accent: '#C16B4C',
      highlight: '#84917B',
    },
    climate: {
      bg: '#F4F2EB',
      bannerBg: '#174F5B',
      bannerBorder: '#246B7B',
      accent: '#84917B',
      highlight: '#FAF8F4',
    },
    drought: {
      bg: '#F6F3EC',
      bannerBg: '#2A2926',
      bannerBorder: '#3E3B37',
      accent: '#C16B4C',
      highlight: '#F5F2EB',
    },
    models: {
      bg: '#F5F2EB',
      bannerBg: '#222C36',
      bannerBorder: '#323E4C',
      accent: '#174F5B',
      highlight: '#C16B4C',
    },
    vulnerability: {
      bg: '#F5F2EC',
      bannerBg: '#1E3539',
      bannerBorder: '#2C494F',
      accent: '#C16B4C',
      highlight: '#FAF8F4',
    },
    xai: {
      bg: '#F4F3ED',
      bannerBg: '#202E33',
      bannerBorder: '#30424A',
      accent: '#5E8B94',
      highlight: '#84917B',
    },
    simulation: {
      bg: '#F6F3EB',
      bannerBg: '#2B2A2E',
      bannerBorder: '#3E3C42',
      accent: '#C16B4C',
      highlight: '#84917B',
    },
    data: {
      bg: '#F5F2EB',
      bannerBg: '#222930',
      bannerBorder: '#323B44',
      accent: '#84917B',
      highlight: '#F5F2EB',
    },
    methodology: {
      bg: '#FAF8F4',
      bannerBg: '#1F2730',
      bannerBorder: '#2E3944',
      accent: '#C16B4C',
      highlight: '#84917B',
    },
  },
};

export type Theme = typeof theme;
