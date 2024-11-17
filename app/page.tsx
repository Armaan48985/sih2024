'use client';

import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import Link from "next/link";

export default function Home() {
  // Define the token state as a string or null
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null); // Error can be a string or null

  useEffect(() => {
    async function fetchAccessToken(): Promise<void> {
      try {
        const response = await fetch("https://bhoonidhi-api.nrsc.gov.in/auth/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: "luffy__23",        // replace with your userId
            password: "Armaan@23",  // replace with your password
            grant_type: "password",
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error ${response.status}: ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        // Ensure data has the property `access_token`
        if (data.access_token) {
          setToken(data.access_token);
        } else {
          throw new Error("Access token not found in response");
        }
      } catch (err) {
        // Check if the error is an instance of Error
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
        console.error("Failed to fetch access token:", err);
      }
    }

    fetchAccessToken();
  }, []);

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-100 font-poppins relative">
      <div>
        <h1>Home Page</h1>
        {error ? (
          <p>Error: {error}</p>
        ) : (
          <p>Access Token: {token ? token : "Loading..."}</p>
        )}
      </div>

      <Link href="/construction-form">
        <div className="w-20 h-20 absolute right-28 bottom-16 flex items-center justify-center rounded-full bg-orange-400 animate-zoom cursor-pointer">
          <span className="text-3xl text-white">
            <FaPlus />
          </span>
        </div>
      </Link>
    </div>
  );
}
