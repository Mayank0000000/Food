import { Button } from '@/components/ui/button';
import { RView } from '@/components/ui/rview';
import { Text } from '@/components/ui/text';
import { useCMS } from '@/hooks/useCMS';
import { useTheme } from '@/hooks/useTheme';
import { createAddressCardStyles } from '@/styles/components/address-card.styles';
import { Address } from '@/types/address.types';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { TouchableOpacity } from 'react-native';

interface AddressCardProps {
  address: Address;
  onDelete: (address: Address) => void;
  onSetDefault: (addressId: string) => void;
}

export const AddressCard: React.FC<AddressCardProps> = ({
  address,
  onDelete,
  onSetDefault,
}) => {
  const { t } = useCMS();
  const { theme, colors } = useTheme();
  const styles = useMemo(() => createAddressCardStyles(theme), [theme]);

  const getAddressIcon = () => {
    switch (address.type) {
      case 'home':
        return 'home';
      case 'work':
        return 'briefcase';
      default:
        return 'location';
    }
  };

  return (
    <RView style={styles.card}>
      <RView style={styles.header}>
        <RView style={styles.typeContainer}>
          <Ionicons name={getAddressIcon()} size={20} color={colors.primary} />
          <Text variant="subtitle" style={styles.label}>
            {address.label}
          </Text>
          {address.isDefault && (
            <RView style={styles.defaultBadge}>
              <Text variant="caption" style={styles.defaultText}>
                {t('addresses.default')}
              </Text>
            </RView>
          )}
        </RView>
        <TouchableOpacity onPress={() => onDelete(address)}>
          <Ionicons name="trash-outline" size={20} color={colors.error} />
        </TouchableOpacity>
      </RView>

      <Text variant="body" style={styles.addressLine}>
        {address.addressLine1}
      </Text>
      {address.addressLine2 && (
        <Text variant="body" style={styles.addressLine}>
          {address.addressLine2}
        </Text>
      )}
      <Text variant="body" style={styles.addressLine}>
        {address.city}, {address.state} - {address.pincode}
      </Text>
      {address.landmark && (
        <Text variant="caption" style={styles.landmark}>
          {t('addresses.landmark')}: {address.landmark}
        </Text>
      )}

      {!address.isDefault && (
        <Button
          title={t('addresses.setAsDefault')}
          variant="outline"
          size="small"
          onPress={() => onSetDefault(address.id)}
          style={styles.setDefaultButton}
        />
      )}
    </RView>
  );
};
