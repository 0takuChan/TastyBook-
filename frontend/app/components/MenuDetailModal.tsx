import React from 'react';
import { Modal, View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MenuDetail {
  name: string;
  ingredients: string;
  steps: string;
  creator: string;
  type: string;
}

interface MenuDetailModalProps {
  visible: boolean;
  onClose: () => void;
  menu: MenuDetail | null;
}

const MenuDetailModal: React.FC<MenuDetailModalProps> = ({ visible, onClose, menu }) => {
  if (!menu) return null;

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#4B5563" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>{menu.name}</Text>
        </View>

      
        <ScrollView style={styles.modalContent}>
          
          <View style={styles.infoSection}>
            <Text style={styles.infoText}>
              {menu.type} • {menu.creator}
            </Text>
          </View>

          
          <Text style={styles.sectionTitle}>ส่วนผสม</Text>
          {menu.ingredients.split('\n').map((item, index) => (
            <Text key={index} style={styles.listItem}>
              {`${index + 1}. ${item}`}
            </Text>
          ))}

          
          <Text style={styles.sectionTitle}>วิธีทำ</Text>
          {menu.steps.split('\n').map((step, index) => (
            <Text key={index} style={styles.listItem}>
              {`${index + 1}. ${step}`}
            </Text>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#E6FFFA',
    paddingHorizontal: 16,
    paddingTop: 25,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    color: '#4B5563',
    marginLeft: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
    textAlign: 'center',
  },
  modalContent: {
    flex: 1,
  },
  infoSection: {
    marginBottom: 15,
  },
  infoText: {
    fontSize: 14,
    color: '#4B5563',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  listItem: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 4,
  },
});

export default MenuDetailModal;