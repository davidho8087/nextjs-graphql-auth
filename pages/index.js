import Head from "next/head";

import styles from "../styles/Home.module.css";
import { gql, useQuery } from "@apollo/client";
import { useAuth } from "../lib/auth.js";
import SignIn from "../components/SignIn";
import About from "./about";

export default function Home() {
  const { isSignedIn } = useAuth();
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {!isSignedIn() && <SignIn />}
      {isSignedIn() && <About />}
    </div>
  );
}
