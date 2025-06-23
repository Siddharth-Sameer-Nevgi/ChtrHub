import Image from "next/image";
import styles from "./page.module.css";
import React from "react";
import Navbar from "@/components/Navbar";
import Main from "@/components/Main";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className={styles.container}>
      <Navbar />
      <Main />
      <Footer />
    </div>
  );
}
