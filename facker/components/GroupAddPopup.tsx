import { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  useColorScheme,
  ScrollView,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Ionicons } from "@expo/vector-icons"; // Icons for buttons

import createStyles from "../styles/index.styles";

export default function GroupAddPopup({
  onClose,
  onAddItems,
}: {
  onClose: () => void;
  onAddItems: (items: { name: string; expires: string }[]) => void;
}) {
  const [items, setItems] = useState<{ name: string; expires: string }[]>([]);
  const [itemName, setItemName] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme);

  // Adds example item when Camera button is pressed
  const addExampleItemsFromCamera = () => {
    setItems([...items, { name: "Example Item (Camera)", expires: "2025-03-01" }]);
  };

  // Adds example item when Barcode button is pressed
  const addExampleItemFromBarcode = () => {
    setItems([...items, { name: "Example Item (Barcode)", expires: "2025-02-15" }]);
  };

  const addItemToList = () => {
    if (!itemName || !expirationDate) {
      Alert.alert("Error", "Please enter both item name and expiration date.");
      return;
    }

    setItems([...items, { name: itemName, expires: expirationDate }]);
    setItemName("");
    setExpirationDate("");
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <ThemedView style={styles.popupContainer}>
      {/* Title + Camera & Barcode Buttons */}
      <View style={styles.titleRow}>
        <ThemedText type="title" style={styles.titleText}>Add Items in Group</ThemedText>

        <View style={styles.iconButtonsContainer}>
          <TouchableOpacity onPress={addExampleItemsFromCamera} style={styles.iconButton}>
            <Ionicons name="camera-outline" size={24} color={colorScheme === "dark" ? "white" : "black"} />
          </TouchableOpacity>

          <TouchableOpacity onPress={addExampleItemFromBarcode} style={styles.iconButton}>
            <Ionicons name="barcode-outline" size={24} color={colorScheme === "dark" ? "white" : "black"} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Input Fields */}
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <TextInput
          style={[styles.input, { flex: 1, marginRight: 10 }]}
          placeholder="Item Name"
          placeholderTextColor="#555"
          value={itemName}
          onChangeText={setItemName}
        />
        <TextInput
          style={[styles.input, { flex: 1 }]}
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

      {/* Scrollable List */}
      {items.length === 0 ? (
        <ThemedView style={styles.emptyPopupContainer}>
          <ThemedText type="subtitle">No items added yet.</ThemedText>
          <ThemedText>Add items to track their expiration dates.</ThemedText>
        </ThemedView>
      ) : (
        <View style={styles.scrollableListContainer}>
          <FlatList
            data={items}
            keyExtractor={(item, index) => index.toString()}
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 10 }}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item, index }) => (
              <View style={styles.itemContainer}>
                <ThemedText>
                  {item.name} - Expires: {item.expires}
                </ThemedText>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => removeItem(index)}
                >
                  <ThemedText type="defaultSemiBold" style={styles.deleteButtonText}>
                    X
                  </ThemedText>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      )}

      {/* Cancel & Save Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
          <ThemedText type="defaultSemiBold" style={styles.cancelButtonText}>
            Cancel
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.confirmButton} onPress={() => onAddItems(items)}>
          <ThemedText type="defaultSemiBold" style={styles.confirmButtonText}>
            Save Group
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}
