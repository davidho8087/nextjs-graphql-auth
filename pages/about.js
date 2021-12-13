import React from "react";
import { useAuth } from "../lib/auth.js";

export default function About() {
  const { signOut } = useAuth();

  return (
    <div>
      <p>Hello bro!</p>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}
