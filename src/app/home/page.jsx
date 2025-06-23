"use client";
import React, { useState, useEffect } from "react";
import { v4 } from "uuid";
import axios from "axios";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import styles from "@/app/page.module.css";

export default function Home() {
  const [user, setUser] = useState(null);
  const [iproomId, setipRoomId] = useState("");
  const router = useRouter();

  const generateRoomId = async () => {
    const roomID = v4();
    console.log("Generated Room ID:", roomID);
    try {
      const res = await axios.post("/api/users/home", { roomID });
      if (res.status === 201) {
        console.log("Room created successfully:", res.data);
        router.push(`/room/${roomID}`);
      } else {
        console.error("Failed to create room:", res.data.error);
      }
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  const handleJoinRoom = async () => {
    if (!iproomId) {
      console.error("Room ID is required");
      return;
    }
    try {
      const res = await axios.get(`/api/users/joinRoom?roomID=${iproomId}`);
      if (res.status === 200) {
        console.log("Joined room successfully:", res.data);
        router.push(`/room/${iproomId}`);
      } else {
        console.error("Failed to join room:", res.data.error);
      }
    } catch (error) {
      console.error("Error joining room:", error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/users/home");
        setUser(res.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  return (
    <>
      <Navbar />
      <div className={styles.professionalContainer}>
        <div className={styles.contentWrapper}>
          {/* User Profile Section */}
          <section className={styles.profileSection}>
            <h1 className={styles.mainTitle}>Dashboard</h1>

            {user ? (
              <div className={styles.profileCard}>
                <div className={styles.avatar}>
                  {user.user.username.charAt(0).toUpperCase()}
                </div>
                <div className={styles.profileInfo}>
                  <h2 className={styles.welcomeText}>
                    Welcome back, {user.user.username}!
                  </h2>
                  <p className={styles.userDetail}>
                    <span className={styles.detailLabel}>Email:</span>{" "}
                    {user.user.email}
                  </p>
                </div>
              </div>
            ) : (
              <div className={styles.loadingSkeleton}></div>
            )}
          </section>

          {/* Rooms Section */}
          <section className={styles.roomsSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Your Rooms</h2>
              <button onClick={generateRoomId} className={styles.primaryButton}>
                + Create New Room
              </button>
            </div>

            {user?.isMember && user.isMember.length > 0 ? (
              <div className={styles.roomsGrid}>
                {user.isMember.map((room) => (
                  <div key={room.roomID} className={styles.roomCard}>
                    <div className={styles.roomHeader}>
                      <span className={styles.roomBadge}>Active</span>
                      <h3 className={styles.roomTitle}>Room #{room.roomID}</h3>
                    </div>
                    <div className={styles.roomActions}>
                      <button
                        onClick={() => router.push(`/room/${room.roomID}`)}
                        className={styles.actionButton}
                      >
                        Join Room
                      </button>
                      <button
                        onClick={async () => {
                          await axios.delete(`/api/users/home`, {
                            data: { roomID: room.roomID },
                          });
                          window.location.reload();
                        }}
                        className={`${styles.actionButton} ${styles.deleteAction}`}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>💬</div>
                <p className={styles.emptyText}>
                  You haven't joined any rooms yet
                </p>
              </div>
            )}
          </section>

          {/* Join Room Section */}
          <section className={styles.joinSection}>
            <h2 className={styles.sectionTitle}>Join Existing Room</h2>
            <div className={styles.joinForm}>
              <input
                type="text"
                className={styles.formInput}
                placeholder="Enter Room ID"
                onChange={(e) => setipRoomId(e.target.value)}
              />
              <button onClick={handleJoinRoom} className={styles.primaryButton}>
                Join Room
              </button>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}
