// getOAuthTokens.js
import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// Define the scope for Gmail access
const SCOPES = ["https://mail.google.com/"];

// Function to generate the authorization URL
const getAuthUrl = () => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  console.log("Authorize this app by visiting this url:", url);
};

// Function to exchange authorization code for tokens
const getTokens = async (code) => {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log("Access Token:", tokens.access_token);
    console.log("Refresh Token:", tokens.refresh_token);
  } catch (error) {
    console.error("Error retrieving tokens:", error);
  }
};

// Uncomment the line below to get the URL, visit it, and authorize your app.
getAuthUrl();

// Once you have the authorization code from the URL, call getTokens with the code
// Example usage: getTokens('your-authorization-code');
// getTokens(
//   "4/0AeanS0bWM0ZGE-vJd7OOwqgjKqe1jJ15nlB6SL1CmffppiHx2_UauQ2k-5XdcPGh2c_AjA"
// );
