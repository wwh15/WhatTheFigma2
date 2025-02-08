import { StyleSheet, ColorSchemeName } from 'react-native';

// Function to return styles based on theme (light/dark)
export default (theme: ColorSchemeName) =>
  StyleSheet.create({
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 16,
    },
    inputContainer: {
      padding: 12,
      backgroundColor: theme === 'dark' ? '#2C2C2E' : '#F8F9FA',
      borderRadius: 8,
      marginBottom: 12,
    },
    input: {
      height: 40,
      borderColor: theme === 'dark' ? '#555' : '#ccc',
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 10,
      marginBottom: 10,
      backgroundColor: theme === 'dark' ? '#3A3A3C' : '#FFFFFF',
      color: theme === 'dark' ? '#FFFFFF' : '#000000',
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
      backgroundColor: theme === 'dark' ? '#444' : '#E0F7FA',
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
      height: 500,
      width: 1500,
      bottom: 0,
      left: 0,
      position: 'absolute',
    },

    // 💡 New styles for GroupAddPopup.tsx
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    popupContainer: {
      width: '85%',
      backgroundColor: theme === 'dark' ? '#2C2C2E' : '#FFFFFF',
      padding: 20,
      borderRadius: 12,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 5, // For Android shadow
    },
    confirmButton: {
      backgroundColor: '#34C759',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 10,
    },
    confirmButtonText: {
      color: 'white',
      fontSize: 16,
    },
    cancelButton: {
      marginTop: 10,
      padding: 10,
      borderRadius: 8,
      backgroundColor: '#FF3B30',
    },
    cancelButtonText: {
      color: 'white',
      fontSize: 16,
    },
  });
