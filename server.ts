import app from "./src/app";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const PORT: string | number = process.env.API_PORT || 8080;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
