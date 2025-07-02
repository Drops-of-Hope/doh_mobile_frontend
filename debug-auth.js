// Debug script to test react-native-app-auth import
const { Platform } = require("react-native");

console.log("Platform:", Platform.OS);

try {
  const appAuth = require("react-native-app-auth");
  console.log("Import successful!");
  console.log("Available methods:", Object.keys(appAuth));

  // Check if authorize method exists and is a function
  if (appAuth && typeof appAuth.authorize === "function") {
    console.log("authorize function is available and valid.");
  } else {
    console.error("authorize function is not available or invalid.");
  }

  // Check if other essential methods exist
  ["refresh", "revoke", "logout", "prefetchConfiguration"].forEach((method) => {
    if (typeof appAuth[method] === "function") {
      console.log(`${method} function is available and valid.`);
    } else {
      console.error(`${method} function is not available or invalid.`);
    }
  });
} catch (error) {
  console.error("Import failed:", error);
}
