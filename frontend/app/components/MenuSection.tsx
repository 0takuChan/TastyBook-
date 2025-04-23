import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MenuDetailModal from './MenuDetailModal';

interface MenuItem {
  name: string;
  ingredients: string;
  steps: string;
  creator: string;
  type: string;
}

interface MenuSectionProps {
  menus: MenuItem[];
}

const MenuSection: React.FC<MenuSectionProps> = ({ menus }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);

  const handleViewAll = (menu: MenuItem) => {
    setSelectedMenu(menu);
    setModalVisible(true);
  };

  if (menus.length === 0) return null;

  return (
    <View style={styles.section}>
      {menus.map((menu, index) => (
        <View key={index} style={styles.menuBox}>
          <Text style={styles.sectionTitle}>{menu.name}</Text>
          <Text style={styles.menuItem}>{`${index + 1}. ${menu.name}`}</Text>
          <Text style={styles.ingredients}>{menu.ingredients}</Text>
          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={() => handleViewAll(menu)}
          >
            <Text style={styles.viewAllText}>VIEW ALL</Text>
          </TouchableOpacity>
        </View>
      ))}

      <MenuDetailModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        menu={selectedMenu}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 16,
  },
  menuBox: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  menuItem: {
    fontSize: 14,
    color: '#4B5563',
  },
  ingredients: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 16,
    marginBottom: 8,
  },
  viewAllButton: {
    alignSelf: 'flex-end',
  },
  viewAllText: {
    color: '#3B82F6',
    fontWeight: '500',
    fontSize: 12,
  },
});

export default MenuSection;