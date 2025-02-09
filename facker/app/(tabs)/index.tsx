import {useState, useEffect} from "react";
import { Image, FlatList, View, TouchableOpacity, Alert, useColorScheme, Modal, SafeAreaView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import {ThemedText} from "@/components/ThemedText";
import {ThemedView} from "@/components/ThemedView";
import GroupAddPopup from "@/components/GroupAddPopup"; // New component for adding items in groups

import createStyles from "../../styles/index.styles";

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme);

  const [inventory, setInventory] = useState<{name: string; expires: string}[]>(
    []
  );
  const [isModalVisible, setModalVisible] = useState(false); // Control the group add popup

  useEffect(() => {
    const loadInventory = async () => {
      try {
        const storedItems = await AsyncStorage.getItem("inventory");
        if (storedItems) {
          setInventory(JSON.parse(storedItems));
        }
      } catch (error) {
        console.error("Error loading inventory:", error);
      }
    };

    loadInventory();
  }, []);

  const addItemsInGroup = async (
    newItems: {name: string; expires: string}[]
  ) => {
    const updatedInventory = [...inventory, ...newItems];

    try {
      await AsyncStorage.setItem("inventory", JSON.stringify(updatedInventory));
      setInventory(updatedInventory);
      setModalVisible(false); // Close the popup after adding items
    } catch (error) {
      console.error("Error saving items", error);
    }
  };

  const deleteItem = async (index: number) => {
    const updatedInventory = inventory.filter((_, i) => i !== index);

    try {
      await AsyncStorage.setItem("inventory", JSON.stringify(updatedInventory));
      setInventory(updatedInventory);
    } catch (error) {
      console.error("Error deleting item", error);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{light: "#A1CEDC", dark: "#1D3D47"}}
      headerImage={
        <Image
          source={require("@/assets/images/produce.png")}
          style={styles.reactLogo}
        />
      }>

      <View style={styles.headerContainer}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Your Inventory</ThemedText>
        </ThemedView>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <ThemedText type="defaultSemiBold" style={styles.addButtonText}>
            Add Items
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* Display Inventory */}
      {inventory.length === 0 ? (
        <ThemedView style={styles.emptyContainer}>
          <ThemedText type="subtitle">No items added yet.</ThemedText>
          <ThemedText>Add items to track their expiration dates.</ThemedText>
        </ThemedView>
      ) : (
        <SafeAreaView style={{flex: 1}}>
          <FlatList
            data={inventory}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => (
              <View style={styles.itemContainer}>
                <View style={styles.itemTextContainer}>
                  <ThemedText
                    type="subtitle"
                    style={{color: colorScheme === "dark" ? "white" : "black"}}>
                    {item.name}
                  </ThemedText>
                  <ThemedText
                    style={{color: colorScheme === "dark" ? "white" : "black"}}>
                    Expires: {item.expires}
                  </ThemedText>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteItem(index)}>
                  <ThemedText
                    type="defaultSemiBold"
                    style={styles.deleteButtonText}>
                    X
                  </ThemedText>
                </TouchableOpacity>
              </View>
            )}
          />
        </SafeAreaView>
      )}

      {/* Group Add Popup */}
      <Modal visible={isModalVisible} animationType="fade" transparent>
        <View style={styles.modalContainer}>
          <GroupAddPopup
            onClose={() => setModalVisible(false)}
            onAddItems={addItemsInGroup}
          />
        </View>
      </Modal>
    </ParallaxScrollView>
  );
}
