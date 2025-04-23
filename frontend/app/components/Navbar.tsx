import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

const Navbar = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.navbar}>
      <TouchableOpacity onPress={() => navigation.navigate('menu-list')}>
        <Ionicons name="home" size={24} color="#4B5563" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('create-menu')}>
        <Ionicons name="add-circle" size={24} color="#4B5563" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('profile')}>
        <Ionicons name="person" size={24} color="#4B5563" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default Navbar;
