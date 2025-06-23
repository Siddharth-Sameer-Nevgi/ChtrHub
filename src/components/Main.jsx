import React from "react";
import styles from "@/app/page.module.css";

export default function Main() {
  return (
    <main className={styles.mainContent}>
      <div className={styles.titleSection}>
        <h1 className={styles.mainTitle}>Welcome to ChatterHub</h1>
        <p className={styles.mainDescription}>
          Connect with your family and friends...
        </p>
      </div>
      <div className={styles.featuresBoxMain}>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>💬</div>
          <h3>Live Chat</h3>
          <p>
            Send and receive messages instantly using a fast messaging system.
          </p>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>🆔</div>
          <h3>Unique Room IDs</h3>
          <p>
            Every chat has its own special link, so your messages stay organized
            and private.
          </p>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>🗃️</div>
          <h3>Messages Saved</h3>
          <p>
            All messages are saved in the database, so you don’t lose anything.
          </p>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>🔐</div>
          <h3>Secure Login</h3>
          <p>Only logged-in users can join and chat, keeping things safe.</p>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>⚡</div>
          <h3>No Page Refresh</h3>
          <p>
            Messages show up right away without needing to refresh the page.
          </p>
        </div>
      </div>
    </main>
  );
}
