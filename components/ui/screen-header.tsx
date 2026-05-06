import { Button } from '@/components/ui/button';
import { RView } from '@/components/ui/rview';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/useTheme';
import { createScreenHeaderStyles } from '@/styles/components/screen-header.styles';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
  showBackButton?: boolean;
  rightComponent?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  onBack,
  showBackButton = true,
  rightComponent,
  style,
}) => {
  const router = useRouter();
  const { theme, colors } = useTheme();
  const screenHeaderStyles = useMemo(() => createScreenHeaderStyles(theme), [theme]);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <RView style={[screenHeaderStyles.header, style]}>
      {showBackButton ? (
        <Button
          variant="outline"
          size="small"
          onPress={handleBack}
          style={screenHeaderStyles.backButton}
        >
          <Ionicons name="arrow-back" size={16} color={colors.text} />
        </Button>
      ) : (
        <RView style={screenHeaderStyles.placeholder} />
      )}
      <Text variant="title" style={screenHeaderStyles.title}>
        {title}
      </Text>
      {rightComponent ? rightComponent : <RView style={screenHeaderStyles.placeholder} />}
    </RView>
  );
};
