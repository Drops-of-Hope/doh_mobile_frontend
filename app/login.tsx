import React, { useState } from "react";
import { Button, View, Text } from "react-native";
import * as AuthSession from "expo-auth-session";
import * as SecureStore from "expo-secure-store";

const authConfig = {
  issuer: "https://api.asgardeo.io/t/dropsofhope",
  clientId: "cvkLW1k579ozp8tp7tRx7vGqvssa",
  redirectUri: AuthSession.makeRedirectUri(),
  scopes: ["openid", "profile", "email"],
};

const discovery = {
  authorizationEndpoint: `${authConfig.issuer}/oauth2/authorize`,
  tokenEndpoint: `${authConfig.issuer}/oauth2/token`,
};

export default function Login() {
  const [authState, setAuthState] = useState(null);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: authConfig.clientId,
      redirectUri: authConfig.redirectUri,
      scopes: authConfig.scopes,
      responseType: AuthSession.ResponseType.Code,
    },
    discovery
  );

  React.useEffect(() => {
    const handleAuthResponse = async () => {
      if (response?.type === "success" && response.params.code) {
        try {
          const tokenResponse = await fetch(discovery.tokenEndpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              grant_type: "authorization_code",
              code: response.params.code,
              redirect_uri: authConfig.redirectUri,
              client_id: authConfig.clientId,
            }).toString(),
          });

          const tokens = await tokenResponse.json();
          setAuthState(tokens);
          await SecureStore.setItemAsync("authState", JSON.stringify(tokens));
          console.log("Login successful:", tokens);
        } catch (error) {
          console.error("Login failed:", error);
        }
      } else if (response?.type === "error" || response?.type === "dismiss") {
        console.error("Authentication failed or canceled.");
      }
    };

    handleAuthResponse();
  }, [response]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Login Screen</Text>
      <Button
        title="Login with Asgardeo"
        onPress={() => promptAsync()}
        disabled={!request}
      />
    </View>
  );
}
