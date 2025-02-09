import {useState} from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  useColorScheme,
} from "react-native";
import {ThemedText} from "@/components/ThemedText";
import {ThemedView} from "@/components/ThemedView";

import createStyles from "../styles/index.styles";

export default function GroupAddPopup({
  onClose,
  onAddItems,
}: {
  onClose: () => void;
  onAddItems: (items: {name: string; expires: string}[]) => void;
}) {
  const [items, setItems] = useState<{name: string; expires: string}[]>([]);
  const [itemName, setItemName] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme);

  const addItemToList = () => {
    if (!itemName || !expirationDate) {
      Alert.alert("Error", "Please enter both item name and expiration date.");
      return;
    }

    setItems([...items, {name: itemName, expires: expirationDate}]);
    setItemName("");
    setExpirationDate("");
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <ThemedView style={styles.popupContainer}>
      <ThemedText style={{padding: 30}} type="title">Add Items in Group</ThemedText>

      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
      <TextInput
          style={[styles.input, {flex: 1, marginRight: 10}]}
          placeholder="Item Name"
          placeholderTextColor="#555"
          value={itemName}
          onChangeText={setItemName}
      />
      <TextInput
          style={[styles.input, {flex: 1}]}
          placeholder="Expiration Date (YYYY-MM-DD)"
          placeholderTextColor="#555"
          value={expirationDate}
          onChangeText={setExpirationDate}
      />
      <TouchableOpacity style={styles.addButton} onPress={addItemToList}>
          <ThemedText type="defaultSemiBold" style={styles.addButtonText}>
          Add to Group
          </ThemedText>
      </TouchableOpacity>
      </View>

      {/* list of items */}
      <FlatList
        data={items}
        keyExtractor={(item, index) => index.toString()}
        style={{width: '100%', alignContent: 'center'}}
        renderItem={({item, index}) => (
          <View style={styles.itemContainer}>
            <ThemedText>
              {item.name} - Expires: {item.expires}
            </ThemedText>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => removeItem(index)}>
              <ThemedText
                type="defaultSemiBold"
                style={styles.deleteButtonText}>
                X
              </ThemedText>
            </TouchableOpacity>
          </View>
        )}
      />

      <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', paddingHorizontal: 20 }}>
        <TouchableOpacity
          style={[styles.cancelButton, { alignSelf: 'flex-start' }]}
          onPress={onClose}>
          <ThemedText type="defaultSemiBold" style={styles.cancelButtonText}>
            Cancel
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.confirmButton, { alignSelf: 'flex-end' }]}
          onPress={() => onAddItems(items)}>
          <ThemedText type="defaultSemiBold" style={styles.confirmButtonText}>
            Save Group
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>


  );
}
