import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  color?: string; // tailwind-like เช่น "bg-orange-500"
}

export default function Button({ title, onPress, disabled, color }: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        { backgroundColor: getColor(color) },
        disabled && styles.disabled,
      ]}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

function getColor(twColor?: string): string {
  const map: Record<string, string> = {
    'bg-orange-500': '#F97316',
    'bg-blue-500': '#3B82F6',
    'bg-green-500': '#10B981',
    'bg-red-500': '#EF4444',
  };
  return map[twColor || ''] || '#F97316'; // fallback สีส้ม
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabled: {
    opacity: 0.6,
  },
});
