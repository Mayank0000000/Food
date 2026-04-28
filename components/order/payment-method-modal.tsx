import { Button } from '@/components/ui/button';
import { RView } from '@/components/ui/rview';
import { Text } from '@/components/ui/text';
import { paymentMethodModalStyles } from '@/styles/components/payment-method-modal.styles';
import { PaymentMethod } from '@/types/order.types';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, Pressable, TouchableOpacity } from 'react-native';

interface PaymentMethodModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (method: PaymentMethod) => void;
}

export const PaymentMethodModal: React.FC<PaymentMethodModalProps> = ({
  visible,
  onClose,
  onConfirm,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('cod');

  const handleConfirm = () => {
    onConfirm(selectedMethod);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={paymentMethodModalStyles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={paymentMethodModalStyles.container}
          onPress={(e) => e.stopPropagation()}
        >
          <RView style={paymentMethodModalStyles.header}>
            <Text style={paymentMethodModalStyles.title}>Select Payment Method</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </RView>

          <RView style={paymentMethodModalStyles.content}>
            <Pressable
              style={[
                paymentMethodModalStyles.methodCard,
                selectedMethod === 'cod' && paymentMethodModalStyles.methodCardSelected,
              ]}
              onPress={() => setSelectedMethod('cod')}
            >
              <RView style={paymentMethodModalStyles.methodIcon}>
                <Ionicons name="cash-outline" size={24} color="#FF6B35" />
              </RView>
              <RView style={paymentMethodModalStyles.methodInfo}>
                <Text style={paymentMethodModalStyles.methodTitle}>Cash on Delivery</Text>
                <Text style={paymentMethodModalStyles.methodDescription}>
                  Pay when you receive your order
                </Text>
              </RView>
              {selectedMethod === 'cod' && (
                <Ionicons name="checkmark-circle" size={24} color="#22C55E" />
              )}
            </Pressable>

            <Pressable
              style={[
                paymentMethodModalStyles.methodCard,
                paymentMethodModalStyles.methodCardDisabled,
              ]}
              disabled
            >
              <RView style={paymentMethodModalStyles.methodIcon}>
                <Ionicons name="card-outline" size={24} color="#ccc" />
              </RView>
              <RView style={paymentMethodModalStyles.methodInfo}>
                <Text style={[paymentMethodModalStyles.methodTitle, { color: '#ccc' }]}>
                  Online Payment
                </Text>
                <Text style={[paymentMethodModalStyles.methodDescription, { color: '#ccc' }]}>
                  Coming soon
                </Text>
              </RView>
            </Pressable>
          </RView>

          <RView style={paymentMethodModalStyles.footer}>
            <Button
              title="Confirm Order"
              onPress={handleConfirm}
              size="large"
            />
          </RView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};
