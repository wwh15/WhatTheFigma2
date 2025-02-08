import { useState } from 'react';
import { View, TextInput, TouchableOpacity, FlatList, Alert, useColorScheme } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import createStyles from '../styles/index.styles';

export default function GroupAddPopup({ onClose, onAddItems }: { onClose: () => void; onAddItems: (items: { name: string; expires: string }[]) => void }) {
  const [items, setItems] = useState<{ name: string; expires: string }[]>([]);
  const [itemName, setItemName] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme);

  const addItemToList = () => {
    if (!itemName || !expirationDate) {
      Alert.alert('Error', 'Please enter both item name and expiration date.');
      return;
    }

    setItems([...items, { name: itemName, expires: expirationDate }]);
    setItemName('');
    setExpirationDate('');
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <ThemedView style={styles.modalContainer}>
      <ThemedText type="title">Add Items in Group</ThemedText>

      <TextInput
        style={styles.input}
        placeholder="Item Name"
        placeholderTextColor="#555"
        value={itemName}
        onChangeText={setItemName}
      />
      <TextInput
        style={styles.input}
        placeholder="Expiration Date (YYYY-MM-DD)"
        placeholderTextColor="#555"
        value={expirationDate}
        onChangeText={setExpirationDate}
      />

      <TouchableOpacity style={styles.addButton} onPress={addItemToList}>
        <ThemedText type="defaultSemiBold" style={styles.addButtonText}>Add to Group</ThemedText>
      </TouchableOpacity>

      <FlatList
        data={items}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.itemContainer}>
            <ThemedText>{item.name} - Expires: {item.expires}</ThemedText>
            <TouchableOpacity style={styles.deleteButton} onPress={() => removeItem(index)}>
              <ThemedText type="defaultSemiBold" style={styles.deleteButtonText}>X</ThemedText>
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity style={styles.confirmButton} onPress={() => onAddItems(items)}>
        <ThemedText type="defaultSemiBold" style={styles.confirmButtonText}>Save Group</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
        <ThemedText type="defaultSemiBold" style={styles.cancelButtonText}>Cancel</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}
