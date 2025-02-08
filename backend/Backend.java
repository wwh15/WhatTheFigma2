import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import org.json.JSONArray;
import org.json.JSONObject;

public class Backend {

    // Spoonacular API Key
    private static final String API_KEY = "YOUR_SPOONACULAR_API_KEY";

    /**
     * Fetch recommended recipes based on the user's inventory.
     */
    public static JSONArray fetchRecommendedRecipes(String[] ingredients) {
        try {
            // Construct the URL
            String baseUrl = "https://api.spoonacular.com/recipes/findByIngredients";
            String ingredientList = String.join(",", ingredients);
            String urlString = baseUrl + "?ingredients=" + ingredientList + "&apiKey=" + API_KEY;
            URL url = new URL(urlString);

            // Make the HTTP request
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");

            // Read the response
            BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            StringBuilder response = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                response.append(line);
            }
            reader.close();

            // Parse and return the response as a JSON array
            return new JSONArray(response.toString());

        } catch (Exception e) {
            e.printStackTrace();
            return new JSONArray();
        }
    }
}