"use client";
import React, { useState } from "react";
import styles from "@/app/page.module.css";
import toast from "react-hot-toast";
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
    otpGenerated: "",
    otpEntered: "",
    otpExpires: null,
  });

  const onSignup = async () => {
    try {
      if (details.otpGenerated !== details.otpEntered) {
        toast.error("OTP does not match");
        console.error("OTP does not match");
        return;
      }
      if (new Date() > new Date(details.otpExpires)) {
        toast.error("OTP has expired");
        console.error("OTP has expired");
        return;
      }
      const { otpGenerated, otpEntered, otpExpires, ...signupDetails } =
        details;
      const req = await axios.post("/api/users/signup", signupDetails);
      console.log("Signup response:", req.data);
      toast.success("Signup successful! Please login.");
      router.push("/login");
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Signup failed. Please try again.");
    }
  };

  const onSendOtp = async () => {
    if (!details.email) {
      console.error("Email is required to send OTP");
      toast.error("Email is required to send OTP");
      return;
    }
    if (new Date(details.otpExpires) > new Date()) {
      console.error("OTP already sent and not expired yet");
      toast.error("OTP already sent and not expired yet");
      return;
    }
    try {
      const res = await axios.post("/api/users/req-otp", {
        email: details.email,
        type: "VERIFY",
      });
      console.log("OTP sent successfully:", res.data);
      toast.success("OTP sent successfully to your email!");
      setDetails({
        ...details,
        otpGenerated: res.data.otp,
        otpExpires: res.data.otpexpires,
      });
    } catch (error) {
      console.error("Send OTP error:", error);
      toast.error("Failed to send OTP. Please try again.");
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
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>OTP</label>
            <input
              type="text"
              id="otp"
              value={details.otpEntered}
              onChange={(e) => {
                setDetails({ ...details, otpEntered: e.target.value });
              }}
              placeholder="Enter your otp"
              className={styles.formInput}
              required
            />
          </div>
          <button
            type="button"
            disabled={!details.email}
            className={`${styles.logSignButton} ${styles.sendOtpButton}`}
            onClick={onSendOtp}
          >
            Get OTP
          </button>
          <button
            onClick={onSignup}
            type="button"
            disabled={
              !details.username ||
              !details.email ||
              !details.password ||
              !details.otpEntered
            }
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
