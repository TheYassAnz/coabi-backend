import app from "./src/app";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const PORT: string | number = process.env.API_PORT || 8080;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// uncomment for android testing purposes
// app.listen(8080, '0.0.0.0', () => {
//   console.log(`Server is running on http://0.0.0.0:${PORT}`);
// });
