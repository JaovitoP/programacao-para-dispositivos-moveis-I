import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { Button, ActivityIndicator, View } from 'react-native';
import HomeScreen from './index';
import LoginScreen from './login';
import DetailsScreen from './[id]';  // Crie esses componentes
import CalendarScreen from './calendar';
import CreateScreen from './create';
import ProfileScreen from './profile';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <AppNavigation />
    </AuthProvider>
  );
}

function AppNavigation() {
  const { authState, onLogout } = useAuth();

  return (
      <Stack.Navigator>
        {authState?.authenticated ? (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{
                headerRight: () => <Button onPress={onLogout} title="Sair" />
              }}
            />
            <Stack.Screen name="Details" component={DetailsScreen} />
            <Stack.Screen name="Calendar" component={CalendarScreen} />
            <Stack.Screen name="Create" component={CreateScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} options={{
            headerShown: false
          }} />
        )}
      </Stack.Navigator>
  );
}