import {StyleSheet, ColorSchemeName} from "react-native";

export default (theme: ColorSchemeName) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    title: {
      fontSize: 24,
      marginBottom: 16,
      textAlign: "center",
    },
    filterContainer: {
      marginBottom: 16,
      color: "white",
    },
    input: {
      height: 40,
      borderColor: "#ccc",
      borderWidth: 1,
      borderRadius: 4,
      padding: 8,
      marginBottom: 10,
    },
    searchButton: {
      backgroundColor: "#00A1E4",
      padding: 10,
      borderRadius: 4,
      alignItems: "center",
    },
    searchButtonText: {
      color: "white",
    },
    recipeCard: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 8,
      padding: 10,
      borderRadius: 8,
      backgroundColor: theme === "dark" ? "#2C2C2E" : "#F8F9FA",
    },
    recipeImage: {
      width: 60,
      height: 60,
      borderRadius: 8,
      marginRight: 10,
    },
    recipeTitle: {
      fontSize: 18,
    },
    reactLogo: {
      height: "100%",
      width: "100%",
      bottom: 0,
      left: 0,
      position: "absolute",
    },
  });
