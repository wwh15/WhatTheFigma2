import { useState, useEffect } from 'react';
import { Image, StyleSheet, FlatList, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const [inventory, setInventory] = useState<{ name: string; expires: string }[]>([]);
  const [itemName, setItemName] = useState('');
  const [expirationDate, setExpirationDate] = useState('');

  // Load inventory from AsyncStorage
  useEffect(() => {
    const loadInventory = async () => {
      try {
        const storedItems = await AsyncStorage.getItem('inventory');
        if (storedItems) {
          setInventory(JSON.parse(storedItems));
        }
      } catch (error) {
        console.error('Error loading inventory:', error);
      }
    };

    loadInventory();
  }, []);

  // Function to add a new item
  const addItem = async () => {
    if (!itemName || !expirationDate) {
      Alert.alert('Error', 'Please enter both item name and expiration date.');
      return;
    }

    const newItem = { name: itemName, expires: expirationDate };
    const updatedInventory = [...inventory, newItem];

    try {
      await AsyncStorage.setItem('inventory', JSON.stringify(updatedInventory));
      setInventory(updatedInventory); // Update UI
      setItemName('');
      setExpirationDate('');
    } catch (error) {
      console.error('Error saving item', error);
    }
  };

  // Function to delete an item
  const deleteItem = async (index: number) => {
    const updatedInventory = inventory.filter((_, i) => i !== index);

    try {
      await AsyncStorage.setItem('inventory', JSON.stringify(updatedInventory));
      setInventory(updatedInventory); // Update UI
    } catch (error) {
      console.error('Error deleting item', error);
    }
  };

  return (
    <ParallaxScrollView headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }} headerImage={
      <Image source={require('@/assets/images/produce.png')} style={styles.reactLogo} />
    }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Your Fridge Inventory</ThemedText>
      </ThemedView>

      {/* Input Fields to Add Items */}
      <ThemedView style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Item Name"
          value={itemName}
          onChangeText={setItemName}
        />
        <TextInput
          style={styles.input}
          placeholder="Expiration Date (YYYY-MM-DD)"
          value={expirationDate}
          onChangeText={setExpirationDate}
        />
        <TouchableOpacity style={styles.addButton} onPress={addItem}>
          <ThemedText type="defaultSemiBold" style={styles.addButtonText}>Add Item</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {/* Inventory List */}
      {inventory.length === 0 ? (
        <ThemedView style={styles.emptyContainer}>
          <ThemedText type="subtitle">No items added yet.</ThemedText>
          <ThemedText>Add items to track their expiration dates.</ThemedText>
        </ThemedView>
      ) : (
        <FlatList
          data={inventory}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.itemContainer}>
              <View style={styles.itemTextContainer}>
                <ThemedText type="subtitle">{item.name}</ThemedText>
                <ThemedText>Expires: {item.expires}</ThemedText>
              </View>
              <TouchableOpacity style={styles.deleteButton} onPress={() => deleteItem(index)}>
                <ThemedText type="defaultSemiBold" style={styles.deleteButtonText}>X</ThemedText>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  inputContainer: {
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    marginBottom: 12,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
    backgroundColor: '#E0F7FA',
  },
  itemTextContainer: {
    flex: 1,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
  },
  reactLogo: {
    height: 250,
    width: 1500,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
