import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router/js-tabs';

import { useApp } from '@/context/AppContext';

export default function TabsLayout() {
  const { items } = useApp();

  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: 'Menú',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="restaurant" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="carrito"
        options={{
          title: 'Carrito',
          tabBarBadge: items.length > 0 ? items.length : undefined,
          tabBarIcon: ({ color, size }) => <Ionicons name="cart" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
