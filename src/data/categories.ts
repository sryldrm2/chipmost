export type Category = { id: string; title: string; emoji: string; desc?: string; popular?: boolean };

export const CATEGORIES: Category[] = [
  { id: 'conn', title: 'Konnektörler', emoji: '🔌', desc: 'RF, endüstriyel', popular: true },
  { id: 'wire', title: 'Kablolar', emoji: '🧵', desc: 'Cat6, güç, sinyal', popular: true },
  { id: 'acc',  title: 'Aksesuarlar', emoji: '🧰', desc: 'Makaron, kelepçe' },
  { id: 'tool', title: 'Araçlar', emoji: '🛠️', desc: 'Pense, soyucu' },
  { id: 'pcb',  title: 'PCB', emoji: '🧩', desc: 'Prototipleme' },
  { id: 'psu',  title: 'Güç', emoji: '🔋', desc: 'Adaptör, regülatör' },
];


