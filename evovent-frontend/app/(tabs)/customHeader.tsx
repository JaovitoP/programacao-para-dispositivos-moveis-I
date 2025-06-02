import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { User, PlusCircle } from 'lucide-react-native';

interface CustomHeaderProps {
  userName?: string;
  userPhoto?: string;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({ userName = "Usuário", userPhoto }) => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.createButton}
        onPress={() => router.push('/create')}
      >
        <PlusCircle size={24} color="#6366f1" />
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.profileContainer}
        onPress={() => router.push('/profile')}
      >
        {userPhoto ? (
          <Image source={{ uri: userPhoto }} style={styles.profileImage} />
        ) : (
          <View style={styles.profilePlaceholder}>
            <User size={24} color="#6366f1" />
          </View>
        )}
        <Text style={styles.userName}>{userName}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 50,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  profilePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  createButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
});

export default CustomHeader;