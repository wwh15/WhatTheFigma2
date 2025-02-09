import { useState, useEffect } from "react";
import { View, TextInput, TouchableOpacity, Modal, FlatList, Alert, useColorScheme, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";

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
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme);

  const handleDateChange = (_event: unknown, date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setExpirationDate(date.toISOString().split("T")[0]); // Format as YYYY-MM-DD
    }
  };

  // Adds example item when Camera button is pressed
  const addExampleItemsFromCamera = () => {
    setItems([...items, { name: "Example Item (Camera)", expires: "2025-03-01" }]);
  };

  // Adds example item when Barcode button is pressed
  const addExampleItemFromBarcode = () => {
    setItems([...items, { name: "Example Item (Barcode)", expires: "2025-02-15" }]);
  };

  const addItemToList = () => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(expirationDate)) {
      Alert.alert("Error", "Please enter a valid date in YYYY-MM-DD format.");
      return;
    }
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

  useEffect(() => {
    if (showDatePicker) {
      handleDateChange(null, selectedDate);
    }
  }, [showDatePicker]);

  return (
    <ThemedView style={styles.popupContainer}>
      {/* Title + Camera & Barcode Buttons */}
      <View style={styles.titleRow}>
        <ThemedText type="title" style={styles.titleText}>Add Items</ThemedText>

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
        {/* Item Name Input */}
        <TextInput
          style={styles.input}
          placeholder="Item Name"
          placeholderTextColor="#555"
          value={itemName}
          onChangeText={setItemName}
        />
        {/* Date Picker */}
        {Platform.OS === "web" ? (
          <TextInput
            style={styles.input}
            placeholder="Select date (YYYY-MM-DD)"
            placeholderTextColor="#555"
            value={expirationDate}
            onChangeText={setExpirationDate}
          />
        ) : (
          // Mobile: Show a button that opens the Date Picker
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDatePicker(true)}
          >
            <ThemedText type="default" style={{ color: "#555" }}>
              {expirationDate === "" ? "Select Date" : expirationDate}
            </ThemedText>
          </TouchableOpacity>
        )}

        {/* iOS Picker */}
        {showDatePicker && Platform.OS === "ios" && (
          <Modal
            transparent
            animationType="none"
            visible={showDatePicker}
            onRequestClose={() => setShowDatePicker(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="spinner"
                  onChange={handleDateChange}
                  textColor={colorScheme === "dark" ? "white" : "black"}
                  themeVariant={colorScheme === "dark" ? "dark" : "light"}
                />
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowDatePicker(false)}
                >
                  <ThemedText type="defaultSemiBold" style={styles.closeButtonText}>
                    Done
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
        {/* Android Picker */}
        {showDatePicker && Platform.OS === "android" && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default" // Keeps it compact on Android
            onChange={handleDateChange}
          />
        )}
        
        {/* Add Item Button */}
        <TouchableOpacity style={styles.addButton} onPress={addItemToList}>
          <ThemedText type="defaultSemiBold" style={styles.addButtonText}>
            Add item
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
            Save
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}
