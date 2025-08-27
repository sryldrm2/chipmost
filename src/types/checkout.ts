export type DeliveryAddress = {
  id: string;
  title: string;
  city: string;
  district: string;
  postalCode: string;
  detail: string;
  isDefault: boolean;
};

export type PaymentMethod = 'credit_card' | 'cash_on_delivery' | 'bank_transfer';

export type CreditCardInfo = {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cardholderName: string;
};

export type CheckoutState = {
  step: 'address' | 'payment' | 'summary';
  selectedAddress: DeliveryAddress | null;
  selectedPaymentMethod: PaymentMethod | null;
  creditCardInfo: CreditCardInfo | null;
  orderNumber: string | null;
  isProcessing: boolean;
};

export type CheckoutFormData = {
  address: DeliveryAddress;
  paymentMethod: PaymentMethod;
  creditCardInfo?: CreditCardInfo;
};

