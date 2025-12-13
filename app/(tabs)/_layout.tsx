import { Tabs } from 'expo-router';
import { useState } from 'react';
import React from 'react';
import { Icon } from '@rneui/themed';
import { HapticTab } from '@/components/haptic-tab';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Splash } from '@/components/Splash';
import {  useEffect } from 'react';

export default function TabLayout() {
  const colorScheme = useColorScheme();

   const [loading, setLoading] = useState(true);

  return (
    <Tabs
      screenOptions={{
       // tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: "#000000ff",     // ativo
        tabBarInactiveTintColor: "#666666",   // inativo
        tabBarStyle: { display: loading ? 'none' : 'flex' }, 
      }}>
      <Tabs.Screen
        name="index"
        options={{
          
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Icon name="home" type="material" color={color} size={26}
             />
          ),
        }}
      />
      <Tabs.Screen
        name="busca"
        options={{
          title: 'Busca',
          tabBarIcon: ({ color }) => (
            <Icon name="search" type="feather" color={color} size={26} />
          ),

        }}
      />

      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => (
            <Icon name="user" type="font-awesome" color={color} size={26} />
          ),

        }}
      />

      <Tabs.Screen
        name="pedidos"
        options={{
          title: 'Pedidos',
          tabBarIcon: ({ color }) => (
            <Icon name="newspaper" type="material" color={color} size={26} /> // ✅ corrigido
          ),
        }}
      />
    </Tabs>
  );
}
