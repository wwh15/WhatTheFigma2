import { useState, useEffect } from "react";
import { View, TextInput, TouchableOpacity, Modal, FlatList, Alert, useColorScheme, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { Camera , CameraView} from "expo-camera"; // Import Camera from expo-camera

import createStyles from "../styles/index.styles";

interface ShelfProduct {
  ID: number;
  Category_ID: number;
  Name: string;
  Name_subtitle: string;
  Keywords: string;
  DOP_Refrigerate_Min?: number; // Shelf life in days
  DOP_Refrigerate_Max?: number;
  DOP_Refrigerate_Metric?: string;
  // ... add additional fields if needed
}

/**
 * Merges an array of single-key objects into one object.
 * Example: [ { "Name": "Lettuce" }, { "Keywords": "Lettuce,leaf,spinach" } ]
 * becomes: { Name: "Lettuce", Keywords: "Lettuce,leaf,spinach" }
 */
function mergeProductData(dataArray: any[]): { [key: string]: any } {
  return dataArray.reduce((acc, curr) => ({ ...acc, ...curr }), {});
}

/**
 * Matches the API product (using its title and description) against the shelf-life database.
 * Returns the shelf life in days (using DOP_Refrigerate_Min) if a match is found.
 */
function matchShelfLife(
  apiProduct: { title: string; description: string },
  shelfData: ShelfProduct[]
): number | null {
  const titleLower = apiProduct.title.toLowerCase();
  const descriptionLower = apiProduct.description.toLowerCase();

  for (let product of shelfData) {
    if (product.Keywords) {
      const keywords = product.Keywords.split(",").map((k) => k.trim().toLowerCase());
      const isMatch = keywords.some(
        (keyword) =>
          titleLower.includes(keyword) || descriptionLower.includes(keyword)
      );
      console.log(product);
      if (isMatch) {
        // Prefer DOP_Refrigerate_Min if available; otherwise, use Refrigerate_Min
        if (product.DOP_Refrigerate_Max != null) {
          return product.DOP_Refrigerate_Max;
        } else if (product.Refrigerate_Max!= null) {
          return product.Refrigerate_Max;
        }
      }
    }
  }
  return null;
}


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
  const [isScannerVisible, setScannerVisible] = useState(false); // State for barcode scanner
  const [hasPermission, setHasPermission] = useState<null | boolean>(null);
  // New state: shelf-life database (fetched from an online JSON)
  const [shelfLifeDatabase, setShelfLifeDatabase] = useState<ShelfProduct[]>([]);

  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme);

  const SHELF_LIFE_DB_URL = "https://www.fsis.usda.gov/shared/data/EN/foodkeeper.json";
 // Request camera permissions
 useEffect(() => {
  (async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === "granted");
  })();
}, []);

useEffect(() => {
  fetch(SHELF_LIFE_DB_URL)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok for shelf-life data.");
      }
      //console.log("Shelf-life DB response:", response);
      return response.json();
    })
    .then((data) => {
      //console.log("Raw shelf-life DB data:", data);
      let products: ShelfProduct[] = [];

      if (data.sheets) {
        // Locate the sheet named "Product"
        const productSheet = data.sheets.find((sheet: any) => sheet.name === "Product");
        if (productSheet && Array.isArray(productSheet.data)) {
          // Each element in productSheet.data is an array of objects.
          // For each row, merge the objects into a single product object.
          products = productSheet.data.map((row: any[]) =>
            row.reduce((acc: any, item: any) => ({ ...acc, ...item }), {})
          );
          //console.log("Extracted products from 'Product' sheet:", products);
        } else {
          //console.error("Product sheet not found or has no data:", productSheet);
        }
      } else if (Array.isArray(data)) {
        // Fallback if data is a plain array.
        products = data.map((product: any) =>
          Array.isArray(product)
            ? product.reduce((acc: any, item: any) => ({ ...acc, ...item }), {})
            : product
        );
      } else if (data && typeof data === "object") {
        // Fallback for objects with common keys.
        if (Array.isArray(data.products)) {
          products = data.products.map((product: any) =>
            Array.isArray(product)
              ? product.reduce((acc: any, item: any) => ({ ...acc, ...item }), {})
              : product
          );
        } else if (Array.isArray(data.items)) {
          products = data.items.map((product: any) =>
            Array.isArray(product)
              ? product.reduce((acc: any, item: any) => ({ ...acc, ...item }), {})
              : product
          );
        } else {
          products = [data];
        }
      } else {
        //console.error("Unexpected shelf-life data format:", data);
      }
      //console.log("Final processed shelf-life products:", products);
      setShelfLifeDatabase(products);
    })
    .catch((err) => {
      console.error("Error fetching shelf-life data:", err);
    });
}, []);



const modalStyles = StyleSheet.create({
  camera: {
    flex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
    backgroundColor: "red",
    padding: 12,
    borderRadius: 8,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
  const handleDateChange = (_event: unknown, date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setExpirationDate(date.toISOString().split("T")[0]); // Format as YYYY-MM-DD
    }
  };

  // Adds example item when Camera button is pressed
  const addExampleItemsFromCamera = () => {
    setItems([...items, { name: "Example Item (Camera)", expires: "2025-03-01" }]);
  }

 // Handle barcode scanning
  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    setScannerVisible(false); // Close scanner after scanning
    //console.log(data);
    try {
      // Fetch item details using an external API
      const response = await fetch(
        `https://api.upcitemdb.com/prod/trial/lookup?upc=${data}`
      );
      const json = await response.json();
      console.log(json);
      if (json.items[0]) {
        const apiProduct = json.items[0];
        const fetchedItemName = apiProduct.title || "Unknown Item";
        console.log(fetchedItemName);
        setItemName(fetchedItemName);
        //setItems([
         // ...items,
         // { name: itemName, expires: "2025-12-31" }, // Arbitrary expiration date
        //]);
        if (shelfLifeDatabase.length > 0) {
          const shelfLifeDays = matchShelfLife(
            { title: apiProduct.title, description: apiProduct.description },
            shelfLifeDatabase
          );
          console.log(shelfLifeDays);
          if (shelfLifeDays) {
            const today = new Date();
            const expiryDateCalc = new Date(
              today.getTime() + shelfLifeDays * 24 * 60 * 60 * 1000
            );
            // Format the expiry date as YYYY-MM-DD and update state.
            setExpirationDate(expiryDateCalc.toISOString().split("T")[0]);
          } else {
            // If no shelf-life match is found, you might choose to leave expirationDate unchanged or alert the user.
            Alert.alert("Shelf-Life Not Found", "No matching shelf-life data found for this item.");
          }
        }
      } 
      else {
        Alert.alert("Error", "Unable to fetch item details for this barcode.");
      }
    } 
    catch (error) {
      //console.error("Error fetching barcode data:", error);
      //Alert.alert("Error", "Failed to fetch item details. Try again.");
    }
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

          <TouchableOpacity onPress={() => setScannerVisible(true)}style={styles.iconButton}>
            <Ionicons name="barcode-outline" size={24} color={colorScheme === "dark" ? "white" : "black"} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Input Fields */}
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {/* Item Name Input */}
        <TextInput
          style={styles.input}
          placeholder="Item name"
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
            <ThemedText type="default" style={{ color: "#555", fontSize: 14 }}>
              { expirationDate === "" ? "Date" : expirationDate }
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
            keyExtractor={(_, index) => index.toString()}
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 10 }}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item, index }) => (
              <View style={styles.itemContainer}>
                <ThemedText style={{ flex: 1 }}>
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

      {/* Barcode Scanner Modal */}
      <Modal visible={isScannerVisible} animationType="slide">
      {hasPermission === null ? (
        <View style={modalStyles.centeredView}>
          <ThemedText>Requesting camera permission...</ThemedText>
        </View>
      ) : hasPermission === false ? (
        <View style={modalStyles.centeredView}>
          <ThemedText>No access to camera</ThemedText>
        </View>
      ) : (
        <CameraView
          //launchScanner = {true}
          style={modalStyles.camera}
          onBarcodeScanned={({ data }) => {
            // Pass the scanned data as an object if needed:
            handleBarCodeScanned({ data });
            // Optionally, you can remove this extra call if you already call it inside handleBarCodeScanned.
            // setScannerVisible(false);
          }}
        >
        <TouchableOpacity
            onPress={() => setScannerVisible(false)}
            style={modalStyles.closeButton}
          >
          <ThemedText style={modalStyles.closeButtonText}>Close Scanner</ThemedText>
        </TouchableOpacity>
        </CameraView>
      )}
      </Modal>

      
    </ThemedView>
  );
}