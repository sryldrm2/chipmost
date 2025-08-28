export type Category = { id: string; title: string; emoji: string; desc?: string; popular?: boolean };

export const CATEGORIES: Category[] = [
  { id: 'conn', title: 'Konnektörler', emoji: '🔌', desc: 'RF, endüstriyel', popular: true },
  { id: 'wire', title: 'Kablolar', emoji: '🧵', desc: 'Cat6, güç, sinyal', popular: true },
  { id: 'acc',  title: 'Aksesuarlar', emoji: '🧰', desc: 'Makaron, kelepçe' },
  { id: 'tool', title: 'Araçlar', emoji: '🛠️', desc: 'Pense, soyucu' },
  { id: 'pcb',  title: 'PCB', emoji: '🧩', desc: 'Prototipleme' },
  { id: 'psu',  title: 'Güç', emoji: '🔋', desc: 'Adaptör, regülatör' },
  { id: 'sensor', title: 'Sensörler', emoji: '📡', desc: 'Sıcaklık, basınç' },
  { id: 'motor', title: 'Motorlar', emoji: '⚙️', desc: 'DC, servo, step' },
  { id: 'led', title: 'LED\'ler', emoji: '💡', desc: 'RGB, beyaz, renkli' },
  { id: 'switch', title: 'Anahtarlar', emoji: '🔘', desc: 'Düğme, toggle' },
  { id: 'resistor', title: 'Dirençler', emoji: '⚡', desc: '1/4W, 1/2W, 1W' },
  { id: 'capacitor', title: 'Kondansatörler', emoji: '🔋', desc: 'Elektrolitik, seramik' },
  { id: 'diode', title: 'Diyotlar', emoji: '➡️', desc: 'LED, zener, schottky' },
  { id: 'transistor', title: 'Transistörler', emoji: '🔺', desc: 'NPN, PNP, MOSFET' },
  { id: 'ic', title: 'Entegre Devreler', emoji: '🖥️', desc: 'Op-amp, timer, logic' },
  { id: 'display', title: 'Ekranlar', emoji: '📺', desc: 'LCD, OLED, 7-segment' },
  { id: 'battery', title: 'Piller', emoji: '🔋', desc: 'Li-ion, NiMH, alkaline' },
  { id: 'adapter', title: 'Adaptörler', emoji: '🔌', desc: 'AC/DC, USB, şarj' },
  { id: 'antenna', title: 'Antenler', emoji: '📡', desc: 'WiFi, Bluetooth, GSM' },
  { id: 'heatsink', title: 'Soğutucular', emoji: '❄️', desc: 'Alüminyum, bakır' },
];


