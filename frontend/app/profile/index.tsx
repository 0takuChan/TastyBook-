import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'; 
import Button from '../components/Button';
import axios from 'axios';
import Navbar from '../components/Navbar';

interface User {
  username: string;
  email: string;
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const navigation = useNavigation(); 

  useEffect(() => {
    const fetchUserFromStorage = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('userEmail');
        console.log('📦 Email จาก AsyncStorage:', storedEmail);

        if (storedEmail) {
          const response = await axios.get(`http://10.0.2.2:5000/api/users/${storedEmail}`);

          setUser(response.data);
        } else {
          
          navigation.navigate('login'); 
        }
      } catch (error) {
        Alert.alert('เกิดข้อผิดพลาด', 'ไม่สามารถโหลดข้อมูลผู้ใช้ได้');
      }
    };

    fetchUserFromStorage();
  }, [navigation]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userEmail');
    navigation.navigate('login');  
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>โปรไฟล์</Text>
      {user ? (
        <>
          <Text style={styles.text}>ชื่อผู้ใช้: {user.username}</Text>
          <Text style={styles.text}>อีเมล: {user.email}</Text>
        </>
      ) : (
        <Text style={styles.text}>กำลังโหลดข้อมูลผู้ใช้...</Text>
      )}
      <Button title="ออกจากระบบ" onPress={handleLogout} style={styles.logoutButton} />
      <Navbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6FFFA',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1D4ED8',
    textAlign: 'center',
    marginBottom: 32,
  },
  text: {
    fontSize: 18,
    color: '#4B5563',
    marginBottom: 16,
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
});
