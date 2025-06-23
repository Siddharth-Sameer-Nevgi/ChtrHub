"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import styles from "@/app/page.module.css";

export default function Login() {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const onLogin = async () => {
    try {
      const res = await axios.post("/api/users/login", user);
      console.log("Response from login:", res.data);
      router.push("/home");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.loginContainer}>
        <h1 className={styles.loginTitle}>Login Page</h1>
        <form className={styles.loginForm}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Email</label>
            <input
              type="email"
              id="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
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
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              placeholder="Enter your password"
              className={styles.formInput}
              required
            />
          </div>
          <button
            type="button"
            onClick={onLogin}
            className={styles.logSignButton}
          >
            Login
          </button>
          <Link href="/signup" className={styles.signupLink}>
            New User? Sign Up
          </Link>
        </form>
      </div>
      <Footer />
    </div>
  );
}
