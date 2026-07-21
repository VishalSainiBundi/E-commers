import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import ReduxProvider from "@/redux/ReduxProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
  title: "Verify Email — ISHOP",
  description: "Verify your email address to complete registration.",
};

export default function VerifyOtpLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ReduxProvider>
          {children}
          <ToastContainer position="top-right" autoClose={2000} />
        </ReduxProvider>
      </body>
    </html>
  );
}
