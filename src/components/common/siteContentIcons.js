import {
  BookOpen,
  Bot,
  Circle,
  Compass,
  GraduationCap,
  Headphones,
  Home,
  Languages,
  Mic2,
  Newspaper,
  Palette,
} from 'lucide-react';

const ICONS = Object.freeze({
  home: Home,
  compass: Compass,
  'book-open': BookOpen,
  bookopen: BookOpen,
  bot: Bot,
  'graduation-cap': GraduationCap,
  graduationcap: GraduationCap,
  headphones: Headphones,
  languages: Languages,
  'mic-2': Mic2,
  mic2: Mic2,
  microphone: Mic2,
  newspaper: Newspaper,
  palette: Palette,
});

export function siteContentIcon(iconKey) {
  const key = String(iconKey || '').trim().toLowerCase().replace(/_/g, '-');
  return ICONS[key] || ICONS[key.replace(/-/g, '')] || Circle;
}

export default siteContentIcon;
