import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import Input from '../components/Input';
import Button from '../components/Button';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const navigation = useNavigation(); 

  const handleLogin = async () => {
    try {
      console.log('กำลังส่งคำขอ login:', username, email);

      const response = await axios.get(`http://10.0.2.2:5000/api/users/${username}/${email}`);

      if (response.data) {
        
        await AsyncStorage.setItem('userEmail', email);
        await AsyncStorage.setItem('userId', response.data.id.toString());
        navigation.navigate('menu-list', { username, email });
      }
    } catch (error) {
      console.error('login error:', error);
      alert('อีเมลหรือชื่อผู้ใช้ไม่ถูกต้อง');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>เข้าสู่ระบบ</Text>
      <Input label="ชื่อผู้ใช้" value={username} onChangeText={setUsername} />
      <Input label="อีเมล" value={email} onChangeText={setEmail} />
      <Button title="เข้าสู่ระบบ" onPress={handleLogin} />
      <TouchableOpacity onPress={() => navigation.navigate('signup')} style={styles.linkContainer}>
        <Text style={styles.linkText}>
          ยังไม่มีบัญชี? <Text style={styles.link}>สมัครสมาชิก</Text>
        </Text>
      </TouchableOpacity>

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
  linkContainer: {
    marginTop: 16,
  },
  linkText: {
    textAlign: 'center',
    color: '#4B5563',
  },
  link: {
    color: '#F97316',
  },
});
