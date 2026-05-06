import { Card } from '@/components/ui/card';
import { PressableView } from '@/components/ui/pressable-view';
import { RView } from '@/components/ui/rview';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/useTheme';
import { createSeatSelectorStyles } from '@/styles/components/seat-selector.styles';
import { Seat } from '@/types/dine.types';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';

interface SeatSelectorProps {
  seats: Seat[];
  selectedSeatId: string | null;
  onSelectSeat: (seat: Seat) => void;
}

export const SeatSelector: React.FC<SeatSelectorProps> = ({
  seats,
  selectedSeatId,
  onSelectSeat,
}) => {
  const { theme, colors } = useTheme();
  const seatSelectorStyles = useMemo(() => createSeatSelectorStyles(theme), [theme]);
  const getSeatIcon = (type: Seat['type']) => {
    switch (type) {
      case 'single':
        return 'person';
      case 'double':
        return 'people';
      case 'family':
        return 'people-circle';
      default:
        return 'person';
    }
  };

  const getSeatColor = (seat: Seat) => {
    if (!seat.isAvailable) return '#E5E7EB';
    if (seat.id === selectedSeatId) return '#FF6B35';
    return '#22C55E';
  };

  const renderSeat = (seat: Seat) => {
    const isSelected = seat.id === selectedSeatId;
    const seatColor = getSeatColor(seat);

    return (
      <PressableView
        key={seat.id}
        style={[
          seatSelectorStyles.seatButton,
          !seat.isAvailable && seatSelectorStyles.seatDisabled,
          isSelected && seatSelectorStyles.seatSelected,
        ]}
        onPress={() => seat.isAvailable && onSelectSeat(seat)}
        disabled={!seat.isAvailable}
      >
        <RView style={[seatSelectorStyles.seatIcon, { backgroundColor: seatColor }]}>
          <Ionicons
            name={getSeatIcon(seat.type)}
            size={20}
            color="#fff"
          />
        </RView>
        <Text
          variant="caption"
          style={[
            seatSelectorStyles.seatNumber,
            !seat.isAvailable && seatSelectorStyles.seatNumberDisabled,
            isSelected && seatSelectorStyles.seatNumberSelected,
          ]}
        >
          {seat.number}
        </Text>
      </PressableView>
    );
  };

  return (
    <Card style={seatSelectorStyles.container}>
      <Text variant="subtitle" style={seatSelectorStyles.title}>
        Select Your Seat
      </Text>

      <RView style={seatSelectorStyles.legend}>
        <RView style={seatSelectorStyles.legendItem}>
          <RView style={[seatSelectorStyles.legendDot, { backgroundColor: '#22C55E' }]} />
          <Text variant="caption" style={seatSelectorStyles.legendText}>
            Available
          </Text>
        </RView>
        <RView style={seatSelectorStyles.legendItem}>
          <RView style={[seatSelectorStyles.legendDot, { backgroundColor: '#E5E7EB' }]} />
          <Text variant="caption" style={seatSelectorStyles.legendText}>
            Occupied
          </Text>
        </RView>
        <RView style={seatSelectorStyles.legendItem}>
          <RView style={[seatSelectorStyles.legendDot, { backgroundColor: '#FF6B35' }]} />
          <Text variant="caption" style={seatSelectorStyles.legendText}>
            Selected
          </Text>
        </RView>
      </RView>

      <RView style={seatSelectorStyles.seatsGrid}>
        {seats.map(renderSeat)}
      </RView>

      <RView style={seatSelectorStyles.seatTypes}>
        <RView style={seatSelectorStyles.seatTypeItem}>
          <Ionicons name="person" size={16} color={colors.textSecondary} />
          <Text variant="caption" style={seatSelectorStyles.seatTypeText}>
            Single (1-8)
          </Text>
        </RView>
        <RView style={seatSelectorStyles.seatTypeItem}>
          <Ionicons name="people" size={16} color={colors.textSecondary} />
          <Text variant="caption" style={seatSelectorStyles.seatTypeText}>
            Double (9-16)
          </Text>
        </RView>
        <RView style={seatSelectorStyles.seatTypeItem}>
          <Ionicons name="people-circle" size={16} color={colors.textSecondary} />
          <Text variant="caption" style={seatSelectorStyles.seatTypeText}>
            Family (17-20)
          </Text>
        </RView>
      </RView>
    </Card>
  );
};
