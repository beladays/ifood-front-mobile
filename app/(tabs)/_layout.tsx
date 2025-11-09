import { Tabs } from 'expo-router';
import React from 'react';
import { Icon } from '@rneui/themed';
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
                <Icon name="home" type="material" color={color} size={26} />
          ), 
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Busca',
          tabBarIcon: ({ color }) =>(
                <Icon name= "search" type="feather" color={color} size={26} />
          ), 
         
        }}
      />

       <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => (
                <Icon name= "user" type="font-awesome" color={color} size={26} />
          ), 
       
        }}
      />
    </Tabs>
  );
}
