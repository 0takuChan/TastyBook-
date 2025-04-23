import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import MenuFormModal from '../components/MenuFormModal';
import Navbar from '../components/Navbar';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Creator {
  id: number;
  username: string;
}

interface Type {
  id: number;
  name: string;
}

interface Menu {
  id: number;
  name: string;
  ingredients: string;
  steps: string;
  type: Type;
  creator: Creator;
}

const CreateMenu: React.FC = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [types, setTypes] = useState<Type[]>([]);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);

  // ฟังก์ชันในการดึงข้อมูลผู้ใช้จาก AsyncStorage โดยใช้ userId
  const getUserFromStorage = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId'); // ดึง userId จาก AsyncStorage
      if (!userId) {
        alert('ไม่มีข้อมูลผู้ใช้');
        return null;
      }
      return userId; // ส่งกลับ userId ที่ดึงจาก AsyncStorage
    } catch (error) {
      alert('มีข้อผิดพลาดในการดึงข้อมูลผู้ใช้');
      return null;
    }
  };

  // ดึงเมนูทั้งหมดที่สร้างโดย creatorId
  const fetchMenus = async () => {
    const creatorId = await getUserFromStorage();
    if (!creatorId) return;
  
    try {
      const response = await axios.get<{ menus: Menu[]; total: number }>('http://10.0.2.2:5000/api/menus'); // ตรวจสอบข้อมูลที่ได้จาก API
      console.log('Fetched menus:', response.data.menus); 
      const filteredMenus = response.data.menus.filter(menu => menu.creator.id.toString() === creatorId);
      
      setMenus(filteredMenus);
    } catch (error) {
      alert('มีข้อผิดพลาดในการดึงรายการเมนู');
    }
  };
  
  const fetchTypes = async () => {
    try {
      const response = await axios.get('http://10.0.2.2:5000/api/types');
      setTypes(response.data.types); // หรือ response.data แล้วแต่ API
    } catch (error) {
      alert('ไม่สามารถโหลดประเภทเมนูได้');
    }
  };

  useEffect(() => {
    fetchMenus();
    fetchTypes(); // ดึงประเภทอาหารด้วย
  }, []); // เมื่อคอมโพเนนต์โหลด จะเรียกใช้ fetchMenus

  // ฟังก์ชันการสร้างเมนู
  const handleCreate = async (menuData: { name: string; ingredients: string; steps: string; typeId: string }) => {
    try {
      // ดึง userId จาก AsyncStorage
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        alert('ไม่พบข้อมูลผู้ใช้');
        return;
      }

      // ส่งคำขอสร้างเมนูพร้อมกับ creatorId
      await axios.post('http://10.0.2.2:5000/api/menus', {
        name: menuData.name,
        ingredients: menuData.ingredients,
        steps: menuData.steps,
        typeId: parseInt(menuData.typeId),
        creatorId: Number(userId), // ส่ง creatorId ที่ดึงมาจาก AsyncStorage
      });

      fetchMenus(); // ดึงเมนูใหม่หลังจากสร้าง
    } catch (error) {
      alert('มีข้อผิดพลาดในการสร้างเมนู');
    }
  };

  // ฟังก์ชันการแก้ไขเมนู
  const handleEdit = async (menuData: { name: string; ingredients: string; steps: string; typeId: string }) => {
    if (!selectedMenu) return;
    try {
      await axios.put(`http://10.0.2.2:5000/api/menus/${selectedMenu.id}`, {
        ...menuData,
        typeId: parseInt(menuData.typeId),
      });
      fetchMenus(); // ดึงเมนูใหม่หลังจากแก้ไข
    } catch (error) {
      alert('มีข้อผิดพลาดในการแก้ไขเมนู');
    }
  };

  // ฟังก์ชันการลบเมนู
  const handleDelete = (menuId: number) => {
    Alert.alert('ยืนยันการลบ', 'คุณแน่ใจหรือไม่ว่าต้องการลบเมนูนี้?', [
      { text: 'ยกเลิก', style: 'cancel' },
      {
        text: 'ยืนยัน',
        style: 'destructive',
        onPress: async () => {
          try {
            await axios.delete(`http://10.0.2.2:5000/api/menus/${menuId}`);
            fetchMenus(); // ดึงเมนูใหม่หลังจากลบ
          } catch (error) {
            alert('มีข้อผิดพลาดในการลบเมนู');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Create Menu</Text>
        <Text style={styles.subHeader}>Welcome! Let's Create Your Delicious Recipe Together!</Text>
        <Text style={styles.sectionTitle}>My Book</Text>
        <Text style={styles.sectionCount}>{menus.length}</Text>
      </View>

      <ScrollView style={styles.menuContainer}>
        {menus.map((menu) => (
          <View key={menu.id} style={styles.menuBox}>
            <Text style={styles.menuTitle}>{menu.name}</Text>
            <Text style={styles.menuCreator}>Created by: {menu.creator.username}</Text>
            {menu.ingredients.split('\n').map((item, idx) => (
              <Text key={idx} style={styles.listItem}>{`${idx + 1}. ${item}`}</Text>
            ))}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(menu.id)}>
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => {
                  setSelectedMenu(menu);
                  setEditModalVisible(true);
                }}
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.createButton} onPress={() => setCreateModalVisible(true)}>
        <Text style={styles.createButtonText}>CREATE</Text>
      </TouchableOpacity>

      <MenuFormModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onSave={handleCreate}
        types={types}
        title="Create Menu"
      />
      <MenuFormModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        onSave={handleEdit}
        types={types}
        title="Edit Menu"
        initialData={selectedMenu ? {
          name: selectedMenu.name,
          ingredients: selectedMenu.ingredients,
          steps: selectedMenu.steps,
          typeId: selectedMenu.type.id.toString(),
        } : undefined}
      />

      <Navbar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E6FFFA' },
  headerContainer: { paddingHorizontal: 16, paddingTop: 25 },
  header: { fontSize: 24, fontWeight: 'bold', color: '#000', marginBottom: 15 },
  subHeader: { fontSize: 14, color: '#4B5563', marginBottom: 30 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#000', marginBottom: 8 },
  sectionCount: {
    fontSize: 14,
    color: '#4B5563',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  menuContainer: { flex: 1, paddingHorizontal: 16, marginBottom: 80 },
  menuBox: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  menuTitle: { fontSize: 16, fontWeight: 'bold', color: '#000', marginBottom: 8 },
  menuCreator: { fontSize: 14, color: '#4B5563', marginBottom: 4 },
  listItem: { fontSize: 14, color: '#4B5563', marginBottom: 4 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 },
  deleteButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  deleteButtonText: { color: '#FFF', fontWeight: '500', fontSize: 12 },
  editButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#3B82F6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  editButtonText: { color: '#3B82F6', fontWeight: '500', fontSize: 12 },
  createButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#34D399',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 8,
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
  },
  createButtonText: { color: '#34D399', fontWeight: 'bold', fontSize: 16 },
});

export default CreateMenu;
