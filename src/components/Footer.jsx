import React from "react";
import styles from "@/app/page.module.css";
import { FaGithub, FaEnvelope, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <p>© 2025 ChatterHub. All rights reserved.</p>
        <p className={styles.credits}>Developed by Siddharth Sameer Nevgi</p>
        <div className={styles.socialLinks}>
          <a
            href="https://www.linkedin.com/in/siddharth-sameer-nevgi/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <FaLinkedin size={24} />
          </a>
          <a
            href="https://github.com/Siddharth-Sameer-Nevgi"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <FaGithub size={24} />
          </a>

          <a href="mailto:siddharthnevgi28@gmail.com" aria-label="Email">
            <FaEnvelope size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
}
