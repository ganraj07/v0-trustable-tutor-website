// 6-Dot Braille Pattern System
// Dots are numbered 1-6 as follows:
// 1 4
// 2 5
// 3 6

export interface BraillePattern {
  dots: number[];
  character: string;
  description: string;
}

// Keyboard mapping for Braille input
// Using home row and accessible keys
export const KEYBOARD_MAPPING = {
  // Left hand - dots 1-3
  'f': 1,  // dot 1
  'd': 2,  // dot 2
  's': 3,  // dot 3
  // Right hand - dots 4-6
  'j': 4,  // dot 4
  'k': 5,  // dot 5
  'l': 6,  // dot 6
} as const;

// Complete Braille character set mapping
export const BRAILLE_ALPHABET: Record<string, BraillePattern> = {
  'a': { dots: [1], character: 'a', description: 'Letter A' },
  'b': { dots: [1, 2], character: 'b', description: 'Letter B' },
  'c': { dots: [1, 4], character: 'c', description: 'Letter C' },
  'd': { dots: [1, 4, 5], character: 'd', description: 'Letter D' },
  'e': { dots: [1, 5], character: 'e', description: 'Letter E' },
  'f': { dots: [1, 2, 4], character: 'f', description: 'Letter F' },
  'g': { dots: [1, 2, 4, 5], character: 'g', description: 'Letter G' },
  'h': { dots: [1, 2, 5], character: 'h', description: 'Letter H' },
  'i': { dots: [2, 4], character: 'i', description: 'Letter I' },
  'j': { dots: [2, 4, 5], character: 'j', description: 'Letter J' },
  'k': { dots: [1, 3], character: 'k', description: 'Letter K' },
  'l': { dots: [1, 2, 3], character: 'l', description: 'Letter L' },
  'm': { dots: [1, 3, 4], character: 'm', description: 'Letter M' },
  'n': { dots: [1, 3, 4, 5], character: 'n', description: 'Letter N' },
  'o': { dots: [1, 3, 5], character: 'o', description: 'Letter O' },
  'p': { dots: [1, 2, 3, 4], character: 'p', description: 'Letter P' },
  'q': { dots: [1, 2, 3, 4, 5], character: 'q', description: 'Letter Q' },
  'r': { dots: [1, 2, 3, 5], character: 'r', description: 'Letter R' },
  's': { dots: [2, 3, 4], character: 's', description: 'Letter S' },
  't': { dots: [2, 3, 4, 5], character: 't', description: 'Letter T' },
  'u': { dots: [1, 3, 6], character: 'u', description: 'Letter U' },
  'v': { dots: [1, 2, 3, 6], character: 'v', description: 'Letter V' },
  'w': { dots: [2, 4, 5, 6], character: 'w', description: 'Letter W' },
  'x': { dots: [1, 3, 4, 6], character: 'x', description: 'Letter X' },
  'y': { dots: [1, 3, 4, 5, 6], character: 'y', description: 'Letter Y' },
  'z': { dots: [1, 3, 5, 6], character: 'z', description: 'Letter Z' },
  
  // Numbers (with number prefix: dots 3, 4, 5, 6)
  '0': { dots: [3, 4, 5, 6, 5], character: '0', description: 'Number 0' },
  '1': { dots: [3, 4, 5, 6, 1], character: '1', description: 'Number 1' },
  '2': { dots: [3, 4, 5, 6, 1, 2], character: '2', description: 'Number 2' },
  '3': { dots: [3, 4, 5, 6, 1, 4], character: '3', description: 'Number 3' },
  '4': { dots: [3, 4, 5, 6, 1, 4, 5], character: '4', description: 'Number 4' },
  '5': { dots: [3, 4, 5, 6, 1, 5], character: '5', description: 'Number 5' },
  '6': { dots: [3, 4, 5, 6, 1, 2, 4], character: '6', description: 'Number 6' },
  '7': { dots: [3, 4, 5, 6, 1, 2, 4, 5], character: '7', description: 'Number 7' },
  '8': { dots: [3, 4, 5, 6, 1, 2, 5], character: '8', description: 'Number 8' },
  '9': { dots: [3, 4, 5, 6, 2, 4], character: '9', description: 'Number 9' },

  // Punctuation
  '.': { dots: [2, 3, 6], character: '.', description: 'Period' },
  ',': { dots: [2], character: ',', description: 'Comma' },
  '?': { dots: [2, 3, 4, 5, 6], character: '?', description: 'Question mark' },
  '!': { dots: [2, 3, 4, 6], character: '!', description: 'Exclamation' },
  ';': { dots: [2, 3], character: ';', description: 'Semicolon' },
  ':': { dots: [2, 5, 6], character: ':', description: 'Colon' },
  "'": { dots: [3], character: "'", description: 'Apostrophe' },
  '"': { dots: [2, 3, 5, 6], character: '"', description: 'Quote' },
  '(': { dots: [1, 2, 3, 5, 6], character: '(', description: 'Left parenthesis' },
  ')': { dots: [2, 3, 4, 5, 6], character: ')', description: 'Right parenthesis' },
  '-': { dots: [3, 6], character: '-', description: 'Hyphen' },
  '/': { dots: [3, 4, 6], character: '/', description: 'Slash' },
  '\\': { dots: [1, 2, 4, 5, 6], character: '\\', description: 'Backslash' },
  '@': { dots: [4], character: '@', description: 'At symbol' },
  '#': { dots: [3, 4, 5, 6], character: '#', description: 'Hash' },
  '$': { dots: [1, 2, 4, 6], character: '$', description: 'Dollar' },
  '%': { dots: [1, 4, 6], character: '%', description: 'Percent' },
  '&': { dots: [1, 2, 3, 4, 6], character: '&', description: 'Ampersand' },
  '*': { dots: [1, 6], character: '*', description: 'Asterisk' },
  '+': { dots: [2, 3, 4, 6], character: '+', description: 'Plus' },
  '=': { dots: [1, 2, 3, 4, 5, 6], character: '=', description: 'Equals' },
  ' ': { dots: [], character: ' ', description: 'Space' },
};

// Reverse mapping: dots pattern to character
export const DOTS_TO_CHARACTER: Record<string, string> = {};

// Build reverse mapping
Object.entries(BRAILLE_ALPHABET).forEach(([char, pattern]) => {
  const key = pattern.dots.sort().join(',');
  DOTS_TO_CHARACTER[key] = char;
});

// Audio feedback messages
export const AUDIO_MESSAGES = {
  inputReady: 'Braille input ready. Press key combinations to type.',
  characterTyped: 'Character typed:',
  backspace: 'Character deleted',
  spaceDot: 'Space entered',
  newLine: 'New line',
  patternInvalid: 'Invalid Braille pattern. Try again.',
  helpActivated: 'Braille help menu open. Press Escape to close.',
} as const;

// Utility function to convert dot pattern to character
export function dotsToCharacter(dots: number[]): string | null {
  if (dots.length === 0) return ' ';
  const sortedDots = dots.sort().join(',');
  return DOTS_TO_CHARACTER[sortedDots] || null;
}

// Utility function to get pattern for a character
export function getCharacterPattern(char: string): BraillePattern | null {
  return BRAILLE_ALPHABET[char.toLowerCase()] || null;
}

// Utility function to get visual representation of Braille cell
export function getBrailleCellVisualization(dots: number[]): string {
  const cell = [
    [false, false],
    [false, false],
    [false, false],
  ];
  
  dots.forEach(dot => {
    if (dot === 1) cell[0][0] = true;
    if (dot === 2) cell[1][0] = true;
    if (dot === 3) cell[2][0] = true;
    if (dot === 4) cell[0][1] = true;
    if (dot === 5) cell[1][1] = true;
    if (dot === 6) cell[2][1] = true;
  });

  return cell
    .map(row => row.map(dot => (dot ? '●' : '○')).join(' '))
    .join('\n');
}
