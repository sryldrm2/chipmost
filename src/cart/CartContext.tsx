import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { CartLine, CartState } from './CartTypes';

type CartCtx = {
  state: CartState;
  addItem: (item: Omit<CartLine, 'qty'>, qty?: number) => void;
  removeItem: (id: string) => void;
  inc: (id: string) => void;
  dec: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clear: () => void;
  applyCoupon: (code: string) => boolean;
  clearCoupon: () => void;
  setDeliveryNote: (note: string) => void;
  totalCount: number;
  subtotal: number;
  finalTotal: number;
};

const Ctx = createContext<CartCtx | null>(null);

const STORAGE_KEY = 'chipmost_cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CartState>({ 
    lines: [], 
    discount: 0, 
    couponCode: undefined, 
    deliveryNote: undefined 
  });

  // Local storage'dan sepet verilerini yükle
  useEffect(() => {
    loadCartFromStorage();
  }, []);

  // Sepet değiştiğinde local storage'a kaydet
  useEffect(() => {
    saveCartToStorage();
  }, [state]);

  const loadCartFromStorage = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Migrate old cart data if needed
        if (parsed.lines && parsed.lines.length > 0 && !parsed.lines[0].hasOwnProperty('unitPrice')) {
          parsed.lines = parsed.lines.map((line: any) => ({
            ...line,
            unitPrice: line.price || 0,
            currency: line.currency || 'TRY',
            moq: line.moq || 1
          }));
        }
        setState(parsed);
      }
    } catch (error) {
      console.error('Sepet yüklenirken hata:', error);
    }
  };

  const saveCartToStorage = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Sepet kaydedilirken hata:', error);
    }
  };

  const addItem: CartCtx['addItem'] = (item, qty = 1) => {
    // Stok kontrolü
    if (!item.inStock) {
      return; // Stokta olmayan ürün eklenemez
    }

    // MOQ kontrolü - minimum sipariş miktarını sağla
    const minQty = item.moq ?? 1;
    const actualQty = Math.max(qty, minQty);

    setState(prev => {
      const i = prev.lines.findIndex(x => x.id === item.id);
      if (i >= 0) {
        const next = [...prev.lines];
        const newQty = next[i].qty + actualQty;
        // Mevcut ürün için de MOQ kontrolü yap
        next[i] = { ...next[i], qty: Math.max(newQty, minQty) };
        return { ...prev, lines: next };
      }
      return { ...prev, lines: [...prev.lines, { ...item, qty: actualQty }] };
    });
  };

  const removeItem: CartCtx['removeItem'] = (id) =>
    setState(prev => ({ ...prev, lines: prev.lines.filter(x => x.id !== id) }));

  const inc: CartCtx['inc'] = (id) =>
    setState(prev => ({ ...prev, lines: prev.lines.map(x => x.id === id ? { ...x, qty: x.qty + 1 } : x) }));

  const dec: CartCtx['dec'] = (id) =>
    setState(prev => {
      const line = prev.lines.find(x => x.id === id);
      if (!line) return prev;
      
      const minQty = line.moq ?? 1;
      const newQty = Math.max(minQty, line.qty - 1);
      
      // Eğer yeni miktar MOQ'dan küçükse, miktarı MOQ'da tut
      if (newQty < minQty) {
        return {
          ...prev,
          lines: prev.lines.map(x => x.id === id ? { ...x, qty: minQty } : x)
        };
      }
      
      return {
        ...prev,
        lines: prev.lines.map(x => x.id === id ? { ...x, qty: newQty } : x)
      };
    });

  const updateQuantity: CartCtx['updateQuantity'] = (id, qty) => {
    setState(prev => {
      const line = prev.lines.find(x => x.id === id);
      if (!line) return prev;
      
      const minQty = line.moq ?? 1;
      const actualQty = Math.max(qty, minQty);
      
      // Eğer miktar 0 veya negatifse ve MOQ 1'den büyükse, ürünü kaldır
      if (qty <= 0 && minQty > 1) {
        return { ...prev, lines: prev.lines.filter(x => x.id !== id) };
      }
      
      // Eğer miktar 0 veya negatifse ve MOQ 1 ise, ürünü kaldır
      if (qty <= 0 && minQty === 1) {
        return { ...prev, lines: prev.lines.filter(x => x.id !== id) };
      }
      
      return {
        ...prev,
        lines: prev.lines.map(x => x.id === id ? { ...x, qty: actualQty } : x)
      };
    });
  };

  const clear = () => setState({ lines: [], discount: 0, couponCode: undefined, deliveryNote: undefined });

  const applyCoupon: CartCtx['applyCoupon'] = (code) => {
    const upperCode = code.toUpperCase().trim();
    
    // Basit kupon sistemi (gerçek uygulamada backend'den kontrol edilir)
    if (upperCode === 'INDIRIM10') {
      const discount = subtotal * 0.1; // %10 indirim
      setState(prev => ({ ...prev, couponCode: upperCode, discount }));
      return true;
    }
    
    return false;
  };

  const clearCoupon = () => {
    setState(prev => ({ ...prev, couponCode: undefined, discount: 0 }));
  };

  const setDeliveryNote: CartCtx['setDeliveryNote'] = (note) => {
    setState(prev => ({ ...prev, deliveryNote: note.trim() || undefined }));
  };

  const subtotal = useMemo(
    () => state.lines.reduce((s, l) => s + l.unitPrice * l.qty, 0),
    [state.lines]
  );

  const totalCount = useMemo(
    () => state.lines.reduce((s, l) => s + l.qty, 0),
    [state.lines]
  );

  const finalTotal = useMemo(
    () => subtotal - state.discount,
    [subtotal, state.discount]
  );

  const value: CartCtx = { 
    state, 
    addItem, 
    removeItem, 
    inc, 
    dec, 
    updateQuantity,
    clear, 
    applyCoupon, 
    clearCoupon, 
    setDeliveryNote, 
    totalCount, 
    subtotal, 
    finalTotal 
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useCart must be used within CartProvider');
  return v;
}
