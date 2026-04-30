import { Card } from '@/components/ui/card';
import { PressableView } from '@/components/ui/pressable-view';
import { RView } from '@/components/ui/rview';
import { Text } from '@/components/ui/text';
import { dateTimeSelectorStyles } from '@/styles/components/date-time-selector.styles';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, ScrollView, TouchableOpacity, View } from 'react-native';

interface DateTimeSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export const DateTimeSelector: React.FC<DateTimeSelectorProps> = ({
  selectedDate,
  onDateChange,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Generate next 30 days
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  // Generate time slots (every 15 minutes)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const time = new Date();
        time.setHours(hour, minute, 0, 0);
        slots.push(time);
      }
    }
    return slots;
  };

  const handleDateSelect = (date: Date) => {
    const newDate = new Date(selectedDate);
    newDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
    onDateChange(newDate);
    setShowDatePicker(false);
  };

  const handleTimeSelect = (time: Date) => {
    const newDate = new Date(selectedDate);
    newDate.setHours(time.getHours(), time.getMinutes(), 0, 0);
    onDateChange(newDate);
    setShowTimePicker(false);
  };

  return (
    <Card style={dateTimeSelectorStyles.container}>
      <Text variant="subtitle" style={dateTimeSelectorStyles.title}>
        Select Date & Time
      </Text>

      <RView style={dateTimeSelectorStyles.selectorsRow}>
        {/* Date Selector */}
        <PressableView
          style={dateTimeSelectorStyles.selectorButton}
          onPress={() => setShowDatePicker(true)}
        >
          <RView style={dateTimeSelectorStyles.iconContainer}>
            <Ionicons name="calendar-outline" size={20} color="#FF6B35" />
          </RView>
          <RView style={dateTimeSelectorStyles.textContainer}>
            <Text variant="caption" style={dateTimeSelectorStyles.label}>
              Date
            </Text>
            <Text variant="body" style={dateTimeSelectorStyles.value}>
              {formatDate(selectedDate)}
            </Text>
          </RView>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </PressableView>

        {/* Time Selector */}
        <PressableView
          style={dateTimeSelectorStyles.selectorButton}
          onPress={() => setShowTimePicker(true)}
        >
          <RView style={dateTimeSelectorStyles.iconContainer}>
            <Ionicons name="time-outline" size={20} color="#FF6B35" />
          </RView>
          <RView style={dateTimeSelectorStyles.textContainer}>
            <Text variant="caption" style={dateTimeSelectorStyles.label}>
              Time
            </Text>
            <Text variant="body" style={dateTimeSelectorStyles.value}>
              {formatTime(selectedDate)}
            </Text>
          </RView>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </PressableView>
      </RView>

      {/* Date Picker Modal */}
      <Modal
        visible={showDatePicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={dateTimeSelectorStyles.modalOverlay}>
          <View style={dateTimeSelectorStyles.modalContent}>
            <View style={dateTimeSelectorStyles.modalHeader}>
              <Text variant="subtitle" style={dateTimeSelectorStyles.modalTitle}>
                Select Date
              </Text>
              <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <ScrollView style={dateTimeSelectorStyles.scrollView}>
              {generateDates().map((date, index) => {
                const isSelected =
                  date.toDateString() === selectedDate.toDateString();
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      dateTimeSelectorStyles.optionItem,
                      isSelected && dateTimeSelectorStyles.optionItemSelected,
                    ]}
                    onPress={() => handleDateSelect(date)}
                  >
                    <Text
                      variant="body"
                      style={[
                        dateTimeSelectorStyles.optionText,
                        isSelected && dateTimeSelectorStyles.optionTextSelected,
                      ]}
                    >
                      {formatDate(date)}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark" size={20} color="#FF6B35" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Time Picker Modal */}
      <Modal
        visible={showTimePicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTimePicker(false)}
      >
        <View style={dateTimeSelectorStyles.modalOverlay}>
          <View style={dateTimeSelectorStyles.modalContent}>
            <View style={dateTimeSelectorStyles.modalHeader}>
              <Text variant="subtitle" style={dateTimeSelectorStyles.modalTitle}>
                Select Time
              </Text>
              <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <ScrollView style={dateTimeSelectorStyles.scrollView}>
              {generateTimeSlots().map((time, index) => {
                const isSelected =
                  time.getHours() === selectedDate.getHours() &&
                  time.getMinutes() === selectedDate.getMinutes();
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      dateTimeSelectorStyles.optionItem,
                      isSelected && dateTimeSelectorStyles.optionItemSelected,
                    ]}
                    onPress={() => handleTimeSelect(time)}
                  >
                    <Text
                      variant="body"
                      style={[
                        dateTimeSelectorStyles.optionText,
                        isSelected && dateTimeSelectorStyles.optionTextSelected,
                      ]}
                    >
                      {formatTime(time)}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark" size={20} color="#FF6B35" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </Card>
  );
};