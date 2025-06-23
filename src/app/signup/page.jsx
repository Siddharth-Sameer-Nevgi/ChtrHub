"use client";
import React, { useState } from "react";
import styles from "@/app/page.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Signup() {
  const router = useRouter();
  const [details, setDetails] = useState({
    username: "",
    email: "",
    password: "",
  });

  const onSignup = async () => {
    try {
      const req = await axios.post("/api/users/signup", details);
      console.log("Signup response:", req.data);
      router.push("/login");
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.loginContainer}>
        <h1 className={styles.loginTitle}>Signup Page</h1>
        <form className={styles.loginForm}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Username</label>
            <input
              id="username"
              type="text"
              value={details.username}
              onChange={(e) =>
                setDetails({ ...details, username: e.target.value })
              }
              placeholder="Enter your username"
              className={styles.formInput}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Email</label>
            <input
              type="email"
              id="email"
              value={details.email}
              onChange={(e) => {
                setDetails({ ...details, email: e.target.value });
              }}
              placeholder="Enter your email"
              className={styles.formInput}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Password</label>
            <input
              type="password"
              id="password"
              value={details.password}
              onChange={(e) => {
                setDetails({ ...details, password: e.target.value });
              }}
              placeholder="Enter your password"
              className={styles.formInput}
              required
            />
          </div>
          <button
            onClick={onSignup}
            type="button"
            disabled={!details.username || !details.email || !details.password}
            className={styles.logSignButton}
          >
            Signup
          </button>
          <Link href="/login" className={styles.signupLink}>
            Already have an account? Login
          </Link>
        </form>
      </div>
      <Footer />
    </div>
  );
}
