import { convert } from './currency';

export type CartLine = { 
  unitPrice: number; 
  currency: 'USD'|'TRY'|'EUR'; 
  qty: number; 
  moq?: number;
  id?: string; // for validation purposes
};

export async function calculateTotalsTRY(lines: CartLine[], shippingTRY: number) {
  let sub = 0;
  for (const l of lines) {
    const unitTRY = await convert(l.unitPrice, l.currency, 'TRY');
    sub += unitTRY * l.qty;
  }
  const subtotalTRY = Math.round(sub * 100) / 100;
  const totalTRY = Math.round((subtotalTRY + (shippingTRY || 0)) * 100) / 100;
  return { subtotalTRY, shippingTRY: shippingTRY || 0, totalTRY };
}

export function validateMOQ(lines: CartLine[]) {
  const viol = lines
    .filter(l => (l.moq ?? 1) > l.qty)
    .map(l => ({ id: (l as any).id, need: l.moq ?? 1, have: l.qty }));
  return { ok: viol.length === 0, violations: viol };
}
