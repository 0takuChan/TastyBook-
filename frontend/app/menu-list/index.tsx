import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import MenuSection from '../components/MenuSection';
import Navbar from '../components/Navbar';
import Pagination from '../components/Pagination';

interface Creator {
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

const MenuList: React.FC = () => {
  const [types, setTypes] = useState<Type[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [selectedType, setSelectedType] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await axios.get<Type[]>('http://10.0.2.2:5000/api/types');
        setTypes(response.data);
        if (response.data.length > 0) {
          setSelectedType(response.data[0].name);
        }
      } catch (error) {
        alert('มีข้อผิดพลาดในการดึงประเภทเมนู');
      }
    };

    const fetchMenus = async () => {
      try {
        const response = await axios.get<{ menus: Menu[]; total: number }>(
          `http://10.0.2.2:5000/api/menus?page=1&limit=1000`
        );
        setMenus(response.data.menus);
      } catch (error) {
        alert('มีข้อผิดพลาดในการดึงรายการเมนู');
      }
    };

    fetchTypes();
    fetchMenus();
  }, []);

  const filteredMenus = useMemo(() => {
    return menus.filter((menu) => menu.type.name === selectedType);
  }, [menus, selectedType]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedType]);

  useEffect(() => {
    setTotalPages(Math.ceil(filteredMenus.length / 3));
  }, [filteredMenus]);

  const currentMenus = useMemo(() => {
    return filteredMenus
      .slice((currentPage - 1) * 3, currentPage * 3)
      .map((menu) => ({
        name: menu.name,
        ingredients: menu.ingredients || 'ไม่มีข้อมูลส่วนผสม',
        steps: menu.steps || 'ไม่มีข้อมูลขั้นตอน',
        creator: menu.creator.username,
        type: menu.type.name === 'Main Diet' ? 'Meal' : menu.type.name,
      }));
  }, [filteredMenus, currentPage]);

  return (
    <View style={styles.container}>
      
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Tasty Book</Text>
        <Text style={styles.subHeader}>Welcome! A Variety Of Recipes Are Waiting For You.</Text>

        
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabContainer}
          contentContainerStyle={styles.tabContentContainer}
        >
          {types.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[styles.tab, selectedType === type.name && styles.selectedTab]}
              onPress={() => setSelectedType(type.name)}
            >
              <Text style={[styles.tabText, selectedType === type.name && styles.selectedTabText]}>
                {type.name === 'Main Diet' ? 'Meal' : type.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      
      <ScrollView style={styles.menuContainer}>
        {selectedType && <MenuSection menus={currentMenus} />}
      </ScrollView>

      
      <View style={styles.paginationContainer}>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </View>

      <Navbar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6FFFA',
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 25,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
  },
  subHeader: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 30,
  },
  tabContainer: {
    marginBottom: 8,
  },
  tabContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tab: {
    backgroundColor: '#D1FAE5',
    paddingVertical: 8,
    paddingHorizontal: 17,
    borderRadius: 50,
    marginRight: 20,
    borderWidth: 1,
    borderColor: '#34D399',
  },
  selectedTab: {
    backgroundColor: '#34D399',
    borderColor: '#34D399',
  },
  tabText: {
    color: '#000',
    fontWeight: '500',
    fontSize: 14,
    textAlign: 'center',
  },
  selectedTabText: {
    color: '#FFF',
  },
  menuContainer: {
    flex: 1,
    marginBottom: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  paginationContainer: {
    alignItems: 'center',
    marginTop: 1,
    marginBottom: 85,
  },
});

export default MenuList;
