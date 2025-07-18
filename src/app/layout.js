import "./globals.css";
import { Toaster } from "react-hot-toast";
export const metadata = {
  title: "ChtrHub",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="top-right" reverseOrder={false} />
      </body>
    </html>
  );
}
