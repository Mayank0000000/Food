import { Button } from '@/components/ui/button';
import { RView } from '@/components/ui/rview';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/useTheme';
import { createAlertStyles } from '@/styles/components/alert.styles';
import { AlertProps } from '@/types/components/alert.types';
import React, { useMemo } from 'react';
import { Modal, Pressable } from 'react-native';

export const Alert: React.FC<AlertProps> = ({
  visible,
  title,
  message,
  buttons = [],
  onDismiss,
}) => {
  const { theme } = useTheme();
  const alertStyles = useMemo(() => createAlertStyles(theme), [theme]);

  const handleButtonPress = (onPress?: () => void) => {
    onPress?.();
    onDismiss?.();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <Pressable style={alertStyles.backdrop} onPress={onDismiss}>
        <Pressable style={alertStyles.container} onPress={(e) => e.stopPropagation()}>
          <RView style={alertStyles.content}>
            {title && <Text style={alertStyles.title}>{title}</Text>}
            {message && <Text style={alertStyles.message}>{message}</Text>}
            
            <RView style={alertStyles.buttonContainer}>
              {buttons.map((button, index) => (
                <Button
                  key={index}
                  title={button.text}
                  onPress={() => handleButtonPress(button.onPress)}
                  variant={button.style === 'destructive' ? 'outline' : 'primary'}
                  style={[
                    alertStyles.button,
                    buttons.length > 1 && index === 0 && alertStyles.buttonSpacing,
                    button.style === 'destructive' && alertStyles.destructiveButton,
                  ]}
                  textStyle={button.style === 'destructive' && alertStyles.destructiveText}
                />
              ))}
            </RView>
          </RView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
