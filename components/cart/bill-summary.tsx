import { Button } from '@/components/ui/button';
import { RView } from '@/components/ui/rview';
import { Text } from '@/components/ui/text';
import { useCMS } from '@/hooks/useCMS';
import { useTheme } from '@/hooks/useTheme';
import { createBillSummaryStyles } from '@/styles/components/bill-summary.styles';
import { CartSummary } from '@/types/cart.types';
import React, { useMemo } from 'react';

interface BillSummaryProps {
  cartSummary: CartSummary;
  appliedCouponCode?: string;
  onDineIn: () => void;
  onOrder: () => void;
  isOrderLoading?: boolean;
}

export const BillSummary: React.FC<BillSummaryProps> = ({
  cartSummary,
  appliedCouponCode,
  onDineIn,
  onOrder,
  isOrderLoading = false,
}) => {
  const { t } = useCMS();
  const { theme } = useTheme();
  const styles = useMemo(() => createBillSummaryStyles(theme), [theme]);

  return (
    <RView style={styles.billContainer}>
      <Text variant="subtitle" style={styles.billTitle}>
        {t('cart.billSummary')}
      </Text>
      
      <RView style={styles.billRow}>
        <Text variant="body" style={styles.billLabel}>
          {t('cart.itemTotal')}
        </Text>
        <Text variant="body" style={styles.billValue}>
          ₹{cartSummary.itemTotal}
        </Text>
      </RView>

      <RView style={styles.billRow}>
        <Text variant="body" style={styles.billLabel}>
          {t('cart.deliveryFee')}
        </Text>
        <Text variant="body" style={styles.billValue}>
          ₹{cartSummary.deliveryFee}
        </Text>
      </RView>

      <RView style={styles.billRow}>
        <Text variant="body" style={styles.billLabel}>
          {t('cart.gst')}
        </Text>
        <Text variant="body" style={styles.billValue}>
          ₹{cartSummary.taxes}
        </Text>
      </RView>

      {cartSummary.discount > 0 && (
        <RView style={styles.billRow}>
          <Text variant="body" style={[styles.billLabel, styles.discountLabel]}>
            {t('cart.discount')} ({appliedCouponCode})
          </Text>
          <Text variant="body" style={[styles.billValue, styles.discountValue]}>
            -₹{Math.round(cartSummary.discount)}
          </Text>
        </RView>
      )}

      <RView style={[styles.billRow, styles.totalRow]}>
        <Text variant="subtitle" style={styles.totalLabel}>
          {t('cart.toPay')}
        </Text>
        <Text variant="subtitle" style={styles.totalValue}>
          ₹{cartSummary.finalTotal}
        </Text>
      </RView>

      <RView style={styles.ctaContainer}>
        <Button
          title={t('cart.dineInButton')}
          onPress={onDineIn}
          variant="outline"
          style={styles.ctaButton}
          disabled={isOrderLoading}
        />
        <Button
          title={t('cart.orderButton')}
          onPress={onOrder}
          style={styles.ctaButton}
          loading={isOrderLoading}
        />
      </RView>
    </RView>
  );
};
