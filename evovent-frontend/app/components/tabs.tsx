import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../(tabs)/index';
import CalendarScreen from '../(tabs)/calendar';
import ProfileScreen from '../(tabs)/profile';
import MyEventsScreen from '../(tabs)/myReservations';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: string = '';

          if (route.name === 'Home') iconName = 'home-outline';
          else if (route.name === 'Calendário') iconName = 'calendar-outline';
          else if (route.name === 'Perfil') iconName = 'person-outline';
          else if (route.name === 'Minhas Reservas') iconName = 'qr-code';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Calendário" component={CalendarScreen} />
      <Tab.Screen name="Minhas Reservas" component={MyEventsScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
