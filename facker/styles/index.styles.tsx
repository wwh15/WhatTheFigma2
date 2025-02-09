import {StyleSheet, ColorSchemeName} from "react-native";

// Function to return styles based on theme (light/dark)
export default (theme: ColorSchemeName) =>
  StyleSheet.create({
    titleContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 20,
      padding: 10,
    },
    inputContainer: {
      padding: 12,
      backgroundColor: theme === "dark" ? "#2C2C2E" : "#F8F9FA",
      borderRadius: 8,
      marginBottom: 12,
    },
    headerContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      marginBottom: 10,
    },
    addButton: {
      marginLeft: 10,
      backgroundColor: "#007AFF",
      padding: 10,
      borderRadius: 6,
    },
    addButtonText: {
      color: "white",
      fontSize: 16,
    },
    emptyContainer: {
      alignItems: "center",
      marginTop: 20,
    },
    itemContainer: {
      flex: 1,
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 10,
      marginVertical: 10,
      borderRadius: 8,
      backgroundColor: theme === "dark" ? "#444" : "#E0F7FA",
    },
    itemTextContainer: {
      flex: 1,
    },
    deleteButton: {
      backgroundColor: "#FF3B30",
      paddingVertical: 5,
      paddingHorizontal: 12,
      borderRadius: 8,
    },
    deleteButtonText: {
      color: "white",
      fontSize: 16,
    },
    reactLogo: {
      height: "100%",
      width: "100%",
      bottom: 0,
      left: 0,
      position: "absolute",
    },

    // styles for GroupAddPopup.tsx
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    emptyPopupContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme === 'dark' ? '#2C2C2E' : '#FFFFFF',
      marginTop: 20,
    },
    confirmButton: {
      backgroundColor: "#34C759",
      marginTop: 10,
      padding: 10,
      borderRadius: 8,
    },
    confirmButtonText: {
      color: "white",
      fontSize: 16,
    },
    cancelButton: {
      marginTop: 10,
      padding: 10,
      borderRadius: 8,
      backgroundColor: "#FF3B30",
    },
    cancelButtonText: {
      color: "white",
      fontSize: 16,
    },
    titleRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      paddingBottom: 10,
    },
    titleText: {
      flex: 1,
      textAlign: "center",
    },
    iconButtonsContainer: {
      flexDirection: "row",
    },
    iconButton: {
      padding: 10,
    },
    input: {
      flex: 1,
      borderColor: theme === "dark" ? "#555" : "#ccc",
      borderWidth: 1,
      borderRadius: 8,
      padding: 10,
      marginHorizontal: 10,
      backgroundColor: theme === "dark" ? "#3A3A3C" : "#FFFFFF",
      color: theme === "dark" ? "#FFFFFF" : "#000000",
    },
    popupContainer: {
      width: '90%',
      maxWidth: 600,
      height: '80%',
      maxHeight: 500,
      backgroundColor: theme === 'dark' ? '#2C2C2E' : '#FFFFFF',
      padding: 20,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    scrollableListContainer: {
      flex: 1,
      paddingTop: 20,
      width: '100%',
      maxHeight: '100%',
    },
    buttonRow: {
      flexDirection: "row",
      width: "100%",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingTop: 10,
    }, 
    modalOverlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    },
    modalContent: {
      width: "85%",
      backgroundColor: theme === "dark" ? "black" : "white", // ✅ Adjust based on theme
      padding: 20,
      borderRadius: 10,
      alignItems: "center",
    },
    closeButton: {
      marginTop: 10,
      backgroundColor: "#007AFF",
      paddingVertical: 8,
      paddingHorizontal: 20,
      borderRadius: 6,
    },
    closeButtonText: {
      color: "white",
      fontSize: 16,
    },
  });
