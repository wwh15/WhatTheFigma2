import React, {useEffect, useState} from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import {ThemedText} from "@/components/ThemedText";
import {ThemedView} from "@/components/ThemedView";

import createStyles from "../../styles/recipes.styles";

const SPOONACULAR_API_KEY = "128fe0a67bad40deb52ce0d651f19d57";

export default function Recipes() {
  const [inventory, setInventory] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const storedItems = await AsyncStorage.getItem("inventory");
        if (storedItems) {
          const parsedItems = JSON.parse(storedItems);
          setInventory(parsedItems.map((item: {name: string}) => item.name));
        }
      } catch (error) {
        console.error("Error loading inventory:", error);
      }
    };

    fetchInventory();
  }, []);

  const fetchRecipes = async () => {
    if (inventory.length === 0) {
      Alert.alert("No ingredients", "Add ingredients to your inventory first.");
      return;
    }

    setIsLoading(true);

    const ingredients = inventory.join(",");
    const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=5&ranking=2&apiKey=${SPOONACULAR_API_KEY}&ignorePantry=true`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        setRecipes(data);
      } else {
        console.error("Error fetching recipes:", data);
        Alert.alert("Error", "Unable to fetch recipes. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Network Error", "Check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{light: "#A1CEDC", dark: "#1D3D47"}}
      headerImage={
        <Image
          source={require("@/assets/images/recipe.jpg")}
          style={styles.reactLogo}
        />
      }>
      <View style={styles.filterContainer}>
        <ThemedText type="title" style={styles.title}>
          Recipe Finder
        </ThemedText>
        <TouchableOpacity style={styles.searchButton} onPress={fetchRecipes}>
          <ThemedText type="defaultSemiBold" style={styles.searchButtonText}>
            Find Recipes
          </ThemedText>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#00A1E4" />
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.recipeCard}
              onPress={() => Alert.alert(item.title)}>
              <Image source={{uri: item.image}} style={styles.recipeImage} />
              <ThemedText type="subtitle" style={styles.recipeTitle}>
                {item.title}
              </ThemedText>
            </TouchableOpacity>
          )}
        />
      )}
    </ParallaxScrollView>
  );
}
