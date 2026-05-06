import { Button } from '@/components/ui/button';
import { RView } from '@/components/ui/rview';
import { Text } from '@/components/ui/text';
import { useCMS } from '@/hooks/useCMS';
import { useTheme } from '@/hooks/useTheme';
import { createPaymentMethodModalStyles } from '@/styles/components/payment-method-modal.styles';
import { PaymentMethod } from '@/types/order.types';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
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
  const { t } = useCMS();
  const { theme, colors } = useTheme();
  const paymentMethodModalStyles = useMemo(() => createPaymentMethodModalStyles(theme), [theme]);
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
            <Text style={paymentMethodModalStyles.title}>{t('payment.selectMethod')}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.text} />
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
                <Ionicons name="cash-outline" size={24} color={colors.primary} />
              </RView>
              <RView style={paymentMethodModalStyles.methodInfo}>
                <Text style={paymentMethodModalStyles.methodTitle}>{t('payment.methods.cod')}</Text>
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
                <Ionicons name="card-outline" size={24} color={colors.border} />
              </RView>
              <RView style={paymentMethodModalStyles.methodInfo}>
                <Text style={[paymentMethodModalStyles.methodTitle, { color: colors.textTertiary }]}>
                  Online Payment
                </Text>
                <Text style={[paymentMethodModalStyles.methodDescription, { color: colors.textTertiary }]}>
                  Coming soon
                </Text>
              </RView>
            </Pressable>
          </RView>

          <RView style={paymentMethodModalStyles.footer}>
            <Button
              title={t('payment.proceedToPay')}
              onPress={handleConfirm}
              size="large"
            />
          </RView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};
