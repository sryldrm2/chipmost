import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type CheckoutStep = 'address' | 'payment' | 'summary';

interface CheckoutProgressProps {
  currentStep: CheckoutStep;
}

const steps: { key: CheckoutStep; title: string; icon: string }[] = [
  { key: 'address', title: 'Adres', icon: 'location' },
  { key: 'payment', title: 'Ödeme', icon: 'card' },
  { key: 'summary', title: 'Özet', icon: 'checkmark-circle' },
];

export default function CheckoutProgress({ currentStep }: CheckoutProgressProps) {
  const getStepStatus = (step: CheckoutStep) => {
    const stepIndex = steps.findIndex(s => s.key === step);
    const currentIndex = steps.findIndex(s => s.key === currentStep);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  const getStepColor = (status: 'completed' | 'current' | 'pending') => {
    switch (status) {
      case 'completed': return '#198754';
      case 'current': return '#0a58ca';
      case 'pending': return '#ccc';
    }
  };

  const getStepIcon = (step: CheckoutStep, status: 'completed' | 'current' | 'pending') => {
    const stepData = steps.find(s => s.key === step);
    
    if (status === 'completed') {
      return 'checkmark';
    }
    
    return stepData?.icon || 'help';
  };

  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const status = getStepStatus(step.key);
        const color = getStepColor(status);
        const icon = getStepIcon(step.key, status);
        
        return (
          <React.Fragment key={step.key}>
            {/* Step Circle */}
            <View style={styles.stepContainer}>
              <View style={[styles.stepCircle, { borderColor: color }]}>
                <Ionicons 
                  name={icon as any} 
                  size={20} 
                  color={color} 
                />
              </View>
              <Text style={[styles.stepTitle, { color }]}>
                {step.title}
              </Text>
            </View>
            
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <View style={[
                styles.connector, 
                { 
                  backgroundColor: getStepColor(getStepStatus(steps[index + 1].key)) === '#198754' 
                    ? '#198754' 
                    : '#e3e3e7' 
                }
              ]} />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e3e3e7',
  },
  stepContainer: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  stepTitle: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  connector: {
    height: 2,
    flex: 1,
    maxWidth: 40,
  },
});

