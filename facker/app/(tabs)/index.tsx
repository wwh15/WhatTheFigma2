import {useState, useEffect, useRef} from "react";
import { Image, FlatList, View, TouchableOpacity, Alert, useColorScheme, Modal, SafeAreaView, Platform } from "react-native";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import {ThemedText} from "@/components/ThemedText";
import {ThemedView} from "@/components/ThemedView";
import GroupAddPopup from "@/components/GroupAddPopup"; // New component for adding items in groups

import createStyles from "../../styles/index.styles";

export default function HomeScreen() {
  // color scheme
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme);

  // state variables
  const [inventory, setInventory] = useState<{name: string; expires: string}[]>([]);
  const [isModalVisible, setModalVisible] = useState(false); // Control the group add popup

  // notification handler
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  async function cancelNotifications() {
    if (Platform.OS === "web") {
      return;
    }
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  // Load inventory from AsyncStorage
  useEffect(() => {
    const loadInventory = async () => {
      try {
        await cancelNotifications();
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

  // Function to request and check permissions
  async function requestNotificationPermissions() {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      return newStatus === "granted";
    }
    return true;
  }

  // schedule a notification
  const scheduleNotification = async (foodItem: string, expirationDate: string) => {
    if (Platform.OS === "web") {
      return;
    }

    const expirationDateObj = new Date(expirationDate);
    const currentDate = new Date();
    const daysUntilExpiration = Math.max(Math.ceil((expirationDateObj.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)), 0);
    if (daysUntilExpiration === 0) {
      console.log("Item is already expired");
      return;
    }
    console.log(daysUntilExpiration);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Food Expiration Reminder",
        body: `${foodItem} is expiring soon!`,
        sound: true,
      },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: daysUntilExpiration },
    });
  };

  // Function to schedule notifications for all inventory items
  async function updateNotifications(inventory: {name: string; expires: string}[]) {
    await cancelNotifications();

    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      console.log("Notification permissions not granted");
      return;
    }

    for (const item of inventory) {
      await scheduleNotification(item.name, item.expires);
    }
  }

  // Function to add items in groups
  const addItemsInGroup = async (
    newItems: {name: string; expires: string}[]
  ) => {
    const updatedInventory = [...inventory, ...newItems];
    updatedInventory.sort((a, b) => new Date(a.expires).getTime() - new Date(b.expires).getTime());

    try {
      await AsyncStorage.setItem("inventory", JSON.stringify(updatedInventory));
      setInventory(updatedInventory);
      updateNotifications(updatedInventory);
      setModalVisible(false); // Close the popup after adding items
    } catch (error) {
      console.error("Error saving items", error);
    }
  };

  // Function to delete an item from the inventory
  const deleteItem = async (index: number) => {
    const updatedInventory = inventory.filter((_, i) => i !== index);

    try {
      await AsyncStorage.setItem("inventory", JSON.stringify(updatedInventory));
      setInventory(updatedInventory);
      updateNotifications(updatedInventory);
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
                    style={{color: colorScheme === "dark" ? "white" : "black"}}>
                    {item.name}
                  </ThemedText>
                  <ThemedText
                    type="subtitle"
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
