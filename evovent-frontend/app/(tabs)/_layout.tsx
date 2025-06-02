import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { Button, ActivityIndicator, View } from 'react-native';
import HomeScreen from './index';
import LoginScreen from './login';
import RegisterScreen from './register';
import DetailsScreen from './[id]';
import CalendarScreen from './calendar';
import CreateScreen from './create';
import ProfileScreen from './profile';
import MyReservationsScreen from './myReservations';
import MyEventsScreen from './myEvents';
import DashboardScreen from './dashboard';
import ParticipantsScreen from './participants';
import Tabs from '../components/tabs';

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
          <Stack.Screen name="MainTabs" component={Tabs} options={{ headerShown: false }} />
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{
                headerShown: false
              }}
            />
            <Stack.Screen name="Details" component={DetailsScreen} options={{
            title: "Detalhes do evento",
          }}/>
            <Stack.Screen name="Calendar" component={CalendarScreen} />
            <Stack.Screen name="Create" component={CreateScreen} options={{ title: "Novo evento" }}/>
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="MyReservations" component={MyReservationsScreen} options={{
            title: "Reservas feitas",
          }}/>
          <Stack.Screen name="MyEvents" component={MyEventsScreen} options={{
            title: "Meus Eventos",
          }}/>
          <Stack.Screen name="Dashboard" component={DashboardScreen} options={{
            title: "Dashboard",
          }}/>
          <Stack.Screen name="Participants" component={ParticipantsScreen} options={{
            title: "Registro de Participantes",
          }}/>
          </>
        ) : (
          <>
          <Stack.Screen name="Login" component={LoginScreen} options={{
            headerShown: false
          }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{
            headerShown: false
          }} />
          </>
        )}
      </Stack.Navigator>
  );
}