import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUp from './signup';
import Login from './login';
import Profile from './profile';
import CreateMenu from './create-menu';
import MenuList from './menu-list';

const Stack = createNativeStackNavigator();

export default function Layout() {
  return (
    <Stack.Navigator initialRouteName="login">
      <Stack.Screen 
        name="login" 
        component={Login} 
        options={{ title: 'เข้าสู่ระบบ', headerShown: false }} 
      />
      <Stack.Screen 
        name="signup" 
        component={SignUp} 
        options={{ title: 'สมัครสมาชิก', headerShown: false }} 
      />
      <Stack.Screen 
        name="profile" 
        component={Profile} 
        options={{ title: 'โปรไฟล์', headerShown: false }} 
      />
      <Stack.Screen 
        name="create-menu" 
        component={CreateMenu} 
        options={{ title: 'สร้างเมนู', headerShown: false }} 
      />
      <Stack.Screen 
        name="menu-list" 
        component={MenuList} 
        options={{ title: 'รายการเมนู', headerShown: false }} 
      />
    </Stack.Navigator>
  );
}
