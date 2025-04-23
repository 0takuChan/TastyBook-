import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Input from '../components/Input';
import Button from '../components/Button';
import axios from 'axios';

export default function SignUp() {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState(false); // เพิ่มสถานะโหลด

  const navigation = useNavigation();

  const handleSignUp = async () => {
    // 🔎 ตรวจสอบค่าว่าง
    if (!username.trim() || !email.trim()) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }
  
    // 🔎 ตรวจสอบว่าอีเมลลงท้ายด้วย @gmail.com
    if (!email.endsWith('@gmail.com')) {
      alert('อีเมลต้องลงท้ายด้วย @gmail.com');
      return;
    }
  
    try {
      setLoading(true);
      await axios.post('http://10.0.2.2:5000/api/users', { username, email });
      navigation.navigate('login');
    } catch (error) {
      alert('มีข้อผิดพลาดในการสมัครสมาชิก');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>สมัครสมาชิก</Text>

      <Input label="ชื่อผู้ใช้" value={username} onChangeText={setUsername} />
      <Input label="อีเมล" value={email} onChangeText={setEmail} />

      <Button
        title={loading ? 'กำลังสมัคร...' : 'สมัครสมาชิก'}
        onPress={handleSignUp}
        color="bg-orange-500"
        disabled={loading}
      />

      <TouchableOpacity onPress={() => navigation.navigate('login')} style={styles.linkContainer}>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <Text style={styles.linkText}>มีบัญชีแล้ว? </Text>
          <Text style={styles.link} onPress={() => navigation.navigate('login')}>เข้าสู่ระบบ</Text>
        </View>
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
    color: '#2DD4BF',
    fontWeight: 'bold',
  },
});
