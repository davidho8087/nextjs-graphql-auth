import React, { useState, useContext, createContext } from "react";
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  gql,
} from "@apollo/client";

const authContext = createContext();

export function AuthProvider({ children }) {
  const auth = useProvideAuth();

  return (
    <authContext.Provider value={auth}>
      <ApolloProvider client={auth.createApolloClient()}>
        {children}
      </ApolloProvider>
    </authContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(authContext);
};

function useProvideAuth() {
  const [authToken, setAuthToken] = useState(null);

  const getAuthHeaders = () => {
    if (!authToken) return null;

    return {
      Authorization: `Bearer ${authToken}`,
    };
  };

  function createApolloClient() {
    const link = createHttpLink({
      uri: "http://localhost:1337/graphql",
      credentials: "include",
      headers: getAuthHeaders(),
    });

    return new ApolloClient({
      link,
      cache: new InMemoryCache(),
    });
  }

  const signOut = () => {
    setAuthToken(null);
  };

  const signIn = async ({ username, password }) => {
    console.log("userName", username);
    console.log("password", password);
    const client = createApolloClient();
    const LoginMutation = gql`
      mutation login($username: String!, $password: String!) {
        login(input: { identifier: $username, password: $password }) {
          jwt
          user {
            id
            username
            email
          }
        }
      }
    `;
    const result = await client.mutate({
      mutation: LoginMutation,
      variables: { username, password },
    });

    console.log(result);

    if (result?.data?.login?.token) {
      setAuthToken(result.data.login.token);
    }
  };

  const isSignedIn = () => {
    if (authToken) {
      return true;
    } else {
      return false;
    }
  };

  return {
    createApolloClient,
    signIn,
    signOut,
    isSignedIn,
  };
}
