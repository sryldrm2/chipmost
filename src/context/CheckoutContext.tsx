import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { CheckoutState, DeliveryAddress, PaymentMethod, CreditCardInfo } from '../types/checkout';

type CheckoutAction =
  | { type: 'SET_STEP'; payload: CheckoutState['step'] }
  | { type: 'SET_ADDRESS'; payload: DeliveryAddress }
  | { type: 'SET_PAYMENT_METHOD'; payload: PaymentMethod }
  | { type: 'SET_CREDIT_CARD_INFO'; payload: CreditCardInfo }
  | { type: 'SET_ORDER_NUMBER'; payload: string }
  | { type: 'SET_PROCESSING'; payload: boolean }
  | { type: 'RESET_CHECKOUT' };

const initialState: CheckoutState = {
  step: 'address',
  selectedAddress: null,
  selectedPaymentMethod: null,
  creditCardInfo: null,
  orderNumber: null,
  isProcessing: false,
};

function checkoutReducer(state: CheckoutState, action: CheckoutAction): CheckoutState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.payload };
    
    case 'SET_ADDRESS':
      return { ...state, selectedAddress: action.payload };
    
    case 'SET_PAYMENT_METHOD':
      return { ...state, selectedPaymentMethod: action.payload };
    
    case 'SET_CREDIT_CARD_INFO':
      return { ...state, creditCardInfo: action.payload };
    
    case 'SET_ORDER_NUMBER':
      return { ...state, orderNumber: action.payload };
    
    case 'SET_PROCESSING':
      return { ...state, isProcessing: action.payload };
    
    case 'RESET_CHECKOUT':
      return initialState;
    
    default:
      return state;
  }
}

type CheckoutContextType = {
  state: CheckoutState;
  setStep: (step: CheckoutState['step']) => void;
  setAddress: (address: DeliveryAddress) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setCreditCardInfo: (info: CreditCardInfo) => void;
  setOrderNumber: (orderNumber: string) => void;
  setProcessing: (isProcessing: boolean) => void;
  resetCheckout: () => void;
  canProceedToPayment: () => boolean;
  canProceedToSummary: () => boolean;
  canPlaceOrder: () => boolean;
};

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(checkoutReducer, initialState);

  const setStep = (step: CheckoutState['step']) => {
    dispatch({ type: 'SET_STEP', payload: step });
  };

  const setAddress = (address: DeliveryAddress) => {
    dispatch({ type: 'SET_ADDRESS', payload: address });
  };

  const setPaymentMethod = (method: PaymentMethod) => {
    dispatch({ type: 'SET_PAYMENT_METHOD', payload: method });
  };

  const setCreditCardInfo = (info: CreditCardInfo) => {
    dispatch({ type: 'SET_CREDIT_CARD_INFO', payload: info });
  };

  const setOrderNumber = (orderNumber: string) => {
    dispatch({ type: 'SET_ORDER_NUMBER', payload: orderNumber });
  };

  const setProcessing = (isProcessing: boolean) => {
    dispatch({ type: 'SET_PROCESSING', payload: isProcessing });
  };

  const resetCheckout = () => {
    dispatch({ type: 'RESET_CHECKOUT' });
  };

  const canProceedToPayment = () => {
    return state.selectedAddress !== null;
  };

  const canProceedToSummary = () => {
    if (!state.selectedAddress || !state.selectedPaymentMethod) return false;
    
    if (state.selectedPaymentMethod === 'credit_card') {
      return state.creditCardInfo !== null;
    }
    
    return true;
  };

  const canPlaceOrder = () => {
    return canProceedToSummary() && !state.isProcessing;
  };

  const value: CheckoutContextType = {
    state,
    setStep,
    setAddress,
    setPaymentMethod,
    setCreditCardInfo,
    setOrderNumber,
    setProcessing,
    resetCheckout,
    canProceedToPayment,
    canProceedToSummary,
    canPlaceOrder,
  };

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
}

