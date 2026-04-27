import { PressableView } from '@/components/ui/pressable-view';
import { RView } from '@/components/ui/rview';
import { Text } from '@/components/ui/text';
import { toastStyles } from '@/styles/components/toast.styles';
import { MenuItem } from '@/types/menu.types';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Modal } from 'react-native';

interface ToastProps {
  visible: boolean;
  onClose: () => void;
  items: MenuItem[];
  totalItems: number;
}

export const Toast: React.FC<ToastProps> = ({ visible, onClose, items, totalItems }) => {
  const router = useRouter();
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

  const handleViewCart = () => {
    handleClose();
    router.push('/(tabs)/cart');
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={handleClose}
    >
      <RView style={toastStyles.overlay}>
        <Animated.View
          style={[
            toastStyles.container,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <RView style={toastStyles.content}>
            <RView style={toastStyles.leftSection}>
              <RView style={toastStyles.imagesContainer}>
                {items.slice(0, 2).map((item, index) => (
                  <Image
                    key={item.id}
                    source={{ uri: item.image }}
                    style={[
                      toastStyles.itemImage,
                      index === 1 && toastStyles.overlappingImage,
                    ]}
                    contentFit="cover"
                  />
                ))}
              </RView>
              <Text variant="body" style={toastStyles.message}>
                {totalItems} item{totalItems > 1 ? 's' : ''} added
              </Text>
            </RView>

            <PressableView style={toastStyles.viewCartButton} onPress={handleViewCart}>
              <Text variant="body" style={toastStyles.viewCartText}>
                View cart
              </Text>
              <Ionicons name="chevron-forward" size={16} color="#fff" />
            </PressableView>
          </RView>
        </Animated.View>
      </RView>
    </Modal>
  );
};