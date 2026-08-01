export const THEMES = {
  'theme-obsidian': {
    id: 'theme-obsidian',
    name: 'Obsidian Dark',
    cardBg: 'rgba(15, 23, 42, 0.75)',
    cardBorder: 'rgba(255, 255, 255, 0.1)',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    accent: '#38BDF8',
  },
  'theme-midnight': {
    id: 'theme-midnight',
    name: 'Deep Midnight',
    cardBg: 'rgba(10, 15, 30, 0.8)',
    cardBorder: 'rgba(99, 102, 241, 0.2)',
    textPrimary: '#EEF2FF',
    textSecondary: '#A5B4FC',
    accent: '#818CF8',
  },
  'theme-aurora': {
    id: 'theme-aurora',
    name: 'Aurora Teal',
    cardBg: 'rgba(6, 44, 48, 0.8)',
    cardBorder: 'rgba(45, 212, 191, 0.2)',
    textPrimary: '#F0FDFA',
    textSecondary: '#99F6E4',
    accent: '#2DD4BF',
  },
  'theme-solar': {
    id: 'theme-solar',
    name: 'Solar Amber',
    cardBg: 'rgba(45, 26, 10, 0.8)',
    cardBorder: 'rgba(251, 146, 60, 0.2)',
    textPrimary: '#FFF7ED',
    textSecondary: '#FDBA74',
    accent: '#FB923C',
  }
};

// Dynamic Gradient Stops based on Time of Day and Weather Category
export const GRADIENTS = {
  dawn: {
    clear: ['#2D1B4E', '#5B2C6F', '#E87A5D', '#FFB07C'],
    cloudy: ['#231942', '#5E548E', '#BE95C4', '#E0B1CB'],
    rain: ['#1D2A44', '#3B4863', '#687895', '#A0ACC0'],
    thunder: ['#161329', '#301B4B', '#4D2D68', '#79488D'],
    snow: ['#2C3A47', '#57606F', '#A4B0BE', '#CED6E0'],
    fog: ['#2F3542', '#57606F', '#747D8C', '#A4B0BE'],
  },
  day: {
    clear: ['#0EA5E9', '#0284C7', '#0369A1', '#075985'],
    cloudy: ['#334155', '#475569', '#64748B', '#94A3B8'],
    rain: ['#1E293B', '#334155', '#475569', '#64748B'],
    thunder: ['#0F172A', '#1E1B4B', '#312E81', '#4338CA'],
    snow: ['#475569', '#64748B', '#94A3B8', '#CBD5E1'],
    fog: ['#334155', '#475569', '#64748B', '#94A3B8'],
  },
  dusk: {
    clear: ['#1E1B4B', '#4C1D95', '#9D174D', '#C2410C'],
    cloudy: ['#2E1065', '#581C87', '#831843', '#9A3412'],
    rain: ['#172554', '#1E3A8A', '#3730A3', '#4C1D95'],
    thunder: ['#111827', '#1E1B4B', '#4C1D95', '#701A75'],
    snow: ['#1E293B', '#334155', '#475569', '#64748B'],
    fog: ['#1E293B', '#334155', '#475569', '#64748B'],
  },
  night: {
    clear: ['#020617', '#0F172A', '#1E293B', '#0F172A'],
    cloudy: ['#030712', '#0B1329', '#111827', '#1F2937'],
    rain: ['#020617', '#091E3A', '#0F2B48', '#17375E'],
    thunder: ['#030712', '#140826', '#220E3D', '#2D1454'],
    snow: ['#0F172A', '#1E293B', '#334155', '#475569'],
    fog: ['#090D16', '#111827', '#1F2937', '#374151'],
  }
};
