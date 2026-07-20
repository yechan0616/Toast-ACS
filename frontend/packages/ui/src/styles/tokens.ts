export const brandColors = {
  main: '#2962FF',
  sub1: '#6100FF',
  sub2: '#00C853',
} as const

export const fontColors = {
  white: '#FFFFFF',
  black: '#111111',
  sub: '#505050',
  info: '#767676',
  disabled: '#999999',
} as const

export const bgColors = {
  white: '#FFFFFF',
  light: '#F7F7FB',
  regular: '#F1F1F5',
  black: '#111111',
} as const

export const lineColors = {
  light: '#F1F1F5',
  regular: '#E5E5EC',
  black: '#111111',
} as const

export const iconColors = {
  white: '#FFFFFF',
  black: '#2A2A37',
  sub: '#545461',
  info: '#81818D',
  disabled: '#A5A5AF',
} as const

export const statusColors = {
  error: '#DC0000',
  errorDeep: '#D32F2F',
  success: '#43A047',
  pending: '#F9A825',
} as const

export const grey = {
  50: '#F9F9F9',
  100: '#F5F5F5',
  200: '#EEEEEE',
  300: '#DBDBDB',
  400: '#B6B6B6',
  500: '#999999',
  600: '#767676',
  700: '#666666',
  800: '#505050',
  900: '#111111',
} as const

export const blueGrey = {
  50: '#F8F8FA',
  100: '#F1F1F5',
  200: '#ECECF2',
  300: '#E5E5EC',
  400: '#CACBD5',
  500: '#A5A5AF',
  600: '#81818D',
  700: '#666677',
  800: '#484858',
  900: '#2A2A37',
} as const

export const black = {
  100: '#494949',
  150: '#454545',
  200: '#414141',
  250: '#3D3D3D',
  300: '#383838',
  350: '#353535',
  400: '#303030',
  450: '#2C2C2C',
  500: '#282828',
  550: '#242424',
  600: '#202020',
  650: '#1C1C1C',
  700: '#181818',
  750: '#141414',
  800: '#101010',
  850: '#0C0C0C',
  950: '#080808',
} as const

export const fontFamily =
  "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Apple SD Gothic Neo', sans-serif"

export const fontWeights = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const

export const letterSpacings = {
  kr: '-0.025em',
  en: '0',
} as const

export interface TextStyle {
  fontSize: string
  lineHeight: number
}

const text = (size: number, lineHeight: number): TextStyle => ({
  fontSize: `${size}px`,
  lineHeight,
})

export const typography = {
  pc: {
    display: {
      d1: text(96, 1.3),
      d2: text(88, 1.3),
      d3: text(80, 1.3),
      d4: text(72, 1.3),
      d5: text(64, 1.3),
      d6: text(56, 1.3),
    },
    headline: {
      h1: text(48, 1.3),
      h2: text(40, 1.3),
      h3: text(32, 1.3),
      h4: text(28, 1.4),
      h5: text(24, 1.4),
      h6: text(20, 1.4),
    },
    title: {
      t1: text(32, 1.3),
      t2: text(28, 1.4),
      t3: text(24, 1.4),
      t4: text(20, 1.4),
      t5: text(18, 1.4),
    },
    body: {
      b1: text(16, 1.4),
      b2: text(15, 1.45),
      b3: text(14, 1.45),
      b4: text(13, 1.45),
    },
    caption: {
      c1: text(13, 1.45),
      c2: text(12, 1.45),
      c3: text(11, 1.45),
    },
  },
  mo: {
    display: {
      d1: text(56, 1.3),
      d2: text(48, 1.3),
      d3: text(40, 1.3),
      d4: text(36, 1.3),
      d5: text(32, 1.3),
      d6: text(28, 1.4),
    },
    headline: {
      h1: text(32, 1.3),
      h2: text(28, 1.4),
      h3: text(24, 1.4),
      h4: text(20, 1.4),
      h5: text(18, 1.4),
      h6: text(16, 1.4),
    },
    title: {
      t1: text(24, 1.4),
      t2: text(20, 1.4),
      t3: text(18, 1.4),
      t4: text(16, 1.4),
    },
    body: {
      b1: text(15, 1.45),
      b2: text(14, 1.45),
      b3: text(13, 1.45),
      b4: text(12, 1.45),
    },
    caption: {
      c1: text(13, 1.45),
      c2: text(12, 1.45),
      c3: text(11, 1.45),
    },
  },
} as const

export function typo(
  style: TextStyle,
  weight: number = fontWeights.medium,
  letterSpacing: string = letterSpacings.kr,
) {
  return `
    font-size: ${style.fontSize};
    font-weight: ${weight};
    line-height: ${style.lineHeight};
    letter-spacing: ${letterSpacing};
  `
}

export const spacingScale = {
  pc: [2, 4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 56, 70, 80, 100, 120, 140, 180],
  mo: [2, 4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 60, 70, 80, 100, 120, 140, 180],
} as const

export const breakpoints = {
  sm: '600px',
  tablet: '800px',
  desktop: '1320px',
  wide: '1920px',
} as const

export const grid = {
  pcColumns: 12,
  mobileColumns: 8,
  mobileMargin: '20px',
  pcMin: '1320px',
  pcMax: '1920px',
  mobileBase: '375px',
} as const

export const controlColors = {
  brand: '#2962FF',
  brandHover: '#1E54EA',
  brandPress: '#2855D2',
  disabled: '#A5ADB8',
  grayBg: '#F1F1F5',
  grayHover: '#EBEBF2',
  grayPress: '#E5E5EC',
  lineBorder: '#E5E5EC',
  focusBorder: '#2185FF',
  focusRing: 'rgba(0, 115, 255, 0.4)',
} as const

export const radii = {
  control: '4px',
  card: '8px',
  panel: '16px',
  pill: '999px',
} as const

export const shadows = {
  card: '0 1px 2px rgba(15, 23, 42, 0.04), 0 12px 28px -16px rgba(15, 23, 42, 0.14)',
} as const

export const buttonHeights = {
  tiny: '28px',
  xsmall: '32px',
  small: '36px',
  medium: '42px',
  large: '48px',
  xlarge: '54px',
} as const

export const iconSizes = [12, 16, 20, 24, 28, 32, 36] as const

export const iconStroke = {
  regular: '2px',
  thin: '1.5px',
} as const
