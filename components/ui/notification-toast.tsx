import { RView } from '@/components/ui/rview';
import { Text } from '@/components/ui/text';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, Modal, StyleSheet } from 'react-native';

interface NotificationToastProps {
  visible: boolean;
  onClose: () => void;
  message: string;
  type?: 'success' | 'error' | 'info';
  icon?: keyof typeof Ionicons.glyphMap;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ 
  visible, 
  onClose, 
  message,
  type = 'success',
  icon,
}) => {
  const slideAnim = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        handleClose();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: 100,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  if (!visible) return null;

  const getIconName = (): keyof typeof Ionicons.glyphMap => {
    if (icon) return icon;
    switch (type) {
      case 'success':
        return 'checkmark-circle';
      case 'error':
        return 'close-circle';
      case 'info':
        return 'information-circle';
      default:
        return 'checkmark-circle';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'success':
        return '#22C55E';
      case 'error':
        return '#EF4444';
      case 'info':
        return '#3B82F6';
      default:
        return '#22C55E';
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={handleClose}
    >
      <RView style={styles.overlay}>
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <RView style={styles.content}>
            <Ionicons name={getIconName()} size={24} color={getIconColor()} />
            <Text variant="body" style={styles.message}>
              {message}
            </Text>
          </RView>
        </Animated.View>
      </RView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'transparent',
    pointerEvents: 'box-none',
  },
  container: {
    width: '90%',
    marginBottom: 100,
    backgroundColor: '#1F2937',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  message: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
});
