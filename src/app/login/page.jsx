"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import styles from "@/app/page.module.css";

export default function Login() {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    password: "",
    otpEntered: "",
    otpGenerated: "",
    otpExpires: null,
  });
  const [isReset, setIsReset] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const onSendOtp = async () => {
    if (!user.email) {
      console.error("Email is required to send OTP");
      toast.error("Email is required to send OTP");
      return;
    }
    if (new Date(user.otpExpires) > new Date()) {
      console.error("OTP already sent and not expired yet");
      toast.error("OTP already sent and not expired yet");
      return;
    }
    try {
      const res = await axios.post("/api/users/req-otp", {
        email: user.email,
        type: "RESET",
      });
      toast.success("OTP sent successfully to your email");
      setUser({
        ...user,
        otpGenerated: res.data.otp,
        otpExpires: res.data.otpexpires,
      });
      setIsReset(true);
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  };

  const verifyOTP = () => {
    if (user.otpEntered !== user.otpGenerated) {
      console.error("OTP does not match");
      toast.error("OTP does not match");
      return;
    }
    if (new Date() > new Date(user.otpExpires)) {
      console.error("OTP has expired");
      toast.error("OTP has expired");
      return;
    }
    setIsVerified(true);
    toast.success("OTP verified successfully");
  };

  const onLogin = async () => {
    try {
      const res = await axios.post("/api/users/login", user);
      console.log("Response from login:", res.data);
      toast.success("Login successful");
      router.push("/home");
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
      console.error("Login failed:", error);
    }
  };

  const onResetPassword = async () => {
    try {
      const res = await axios.post("/api/users/changePassword", {
        email: user.email,
        password: user.password,
      });
      console.log("Password reset response:", res.data);
      toast.success("Password reset successfully");
      router.push("/login");
      setIsReset(false);
      setIsVerified(false);
    } catch (error) {
      console.error("Reset password failed:", error);
      toast.error("Failed to reset password");
    }
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.loginContainer}>
        {isReset ? (
          <>
            <h1 className={styles.loginTitle}>Reset Password</h1>
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
              {isVerified ? (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Password</label>
                    <input
                      type="password"
                      id="password"
                      value={user.password}
                      onChange={(e) =>
                        setUser({ ...user, password: e.target.value })
                      }
                      placeholder="Enter your new password password"
                      className={styles.formInput}
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={onResetPassword}
                    className={styles.logSignButton}
                  >
                    Continue
                  </button>
                </>
              ) : (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>OTP</label>
                    <input
                      type="text"
                      id="otpEntered"
                      value={user.otpEntered}
                      onChange={(e) =>
                        setUser({ ...user, otpEntered: e.target.value })
                      }
                      placeholder="Enter your OTP"
                      className={styles.formInput}
                      required
                    />
                  </div>
                  <button
                    type="button"
                    className={`${styles.logSignButton} ${styles.sendOtpButton}`}
                    onClick={onSendOtp}
                  >
                    Get OTP
                  </button>
                  <button
                    type="button"
                    className={styles.logSignButton}
                    onClick={verifyOTP}
                  >
                    Verify OTP
                  </button>
                </>
              )}
            </form>
          </>
        ) : (
          <>
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
                  onChange={(e) =>
                    setUser({ ...user, password: e.target.value })
                  }
                  placeholder="Enter your password"
                  className={styles.formInput}
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
              <a className={styles.signupLink} onClick={() => setIsReset(true)}>
                Forgot Password?
              </a>
            </form>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
