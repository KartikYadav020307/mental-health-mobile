import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons';

export default function BottomNav({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.wrapper}>
      {/* Absolute floating FAB for AI Coach */}
      <View style={styles.fabContainer}>
         <TouchableOpacity 
           style={styles.fabButton} 
           activeOpacity={0.8}
           onPress={() => navigation.navigate('AICoach' as never)}
         >
           <FontAwesome5 name="robot" size={28} color="#fff" solid />
         </TouchableOpacity>
      </View>
      <View style={styles.container}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          let iconName = 'home';
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Explore') iconName = 'compass';
          else if (route.name === 'Sleep') iconName = 'moon';
          else if (route.name === 'Progress') iconName = 'chart-bar';
          else if (route.name === 'Profile') iconName = 'user-alt';



          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tabButton}
              activeOpacity={0.7}
            >
              <FontAwesome5 
                name={iconName} 
                size={28} 
                color={isFocused ? '#1CB0F6' : '#AFAFAF'} 
                solid={isFocused}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    backgroundColor: '#ffffff',
  },
  container: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 2,
    borderTopColor: '#E5E5E5',
    paddingBottom: 32,
    paddingTop: 16,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  fabContainer: {
    position: 'absolute',
    right: 20,
    top: -80,
    zIndex: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#1CB0F6', // Macaw Blue
    borderBottomColor: '#1899D6',
    borderWidth: 0,
    borderBottomWidth: 6,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
