import { StyleSheet } from 'react-native';
import { Slot } from 'expo-router';

export default function App() {
  return <Slot />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});