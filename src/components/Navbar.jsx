"use client";
import React, { useState, useEffect } from "react";
import styles from "@/app/page.module.css";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState({
    email: "",
    username: "",
  });
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await axios.get("/api/users/userInfo");
        setUserInfo(res.data.user);
        if (res.data.user) {
          setIsLoggedIn(true);
        }
      } catch (err) {
        console.error("Failed to fetch user info:", err);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navLeft}>
        <img
          src="https://www.shutterstock.com/image-vector/support-icon-can-be-used-600nw-1887496465.jpg"
          alt="ChatterHub Logo"
          width={40}
          height={40}
          className={styles.logo}
        />
        <span className={styles.appName}>ChatterHub</span>
      </div>
      <div className={styles.navRight}>
        {isLoggedIn ? (
          <button
            className={`${styles.navButton} ${styles.logoutButton}`}
            onClick={async () => {
              await axios.delete("api/users/userInfo");
              setIsLoggedIn(false);
              setUserInfo({ email: "", username: "" });
              router.push("/");
            }}
          >
            Logout
          </button>
        ) : (
          <>
            <a
              className={`${styles.navButton} ${styles.loginButton}`}
              href="/login"
            >
              Login
            </a>
            <a
              className={`${styles.navButton} ${styles.signupButton}`}
              href="/signup"
            >
              Sign Up
            </a>
          </>
        )}
      </div>
    </nav>
  );
}
