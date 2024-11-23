'use client';

import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import Link from "next/link";



export default function Home() {
  // Define the token state as a string or null
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // const searchSatelliteData = async () => {
    //   const url = "https://bhoonidhi-api.nrsc.gov.in/data/search";
    //   const accessToken = "03e7e782-a804-11ef-864c-0afff4b03477"; // Replace with your token.
    
    //   const payload: SearchPayload = {
    //     collections: ["Landsat-8", "Sentinel-2"],
    //     bbox: [76.0, 10.0, 77.0, 11.0],
    //     datetime: "2024-01-01T00:00:00Z/2024-11-20T23:59:59Z",
    //     limit: 10,
    //     sortby: [
    //       {
    //         field: "datetime",
    //         direction: "desc",
    //       },
    //     ],
    //     fields: {
    //       include: ["id", "geometry", "properties.datetime"],
    //       exclude: ["assets"],
    //     },
    //   };
    
    //   try {
    //     const response = await axios.post(url, payload, {
    //       headers: {
    //         Authorization: `Bearer ${accessToken}`,
    //         "Content-Type": "application/json",
    //       },
    //     });
    
    //     console.log("Response Data:", response.data);
    //   } catch (error) {
    //     if (axios.isAxiosError(error)) {
    //       console.error("Error Response:", error.response?.data || error.message);
    //     } else {
    //       console.error("Unexpected Error:", error);
    //     }
    //   }
    // };
    
    // searchSatelliteData();

    async function fetchAccessToken(): Promise<void> {
      try {
        const response = await fetch("https://bhoonidhi-api.nrsc.gov.in/auth/token", {
          method: "POST",
          body: JSON.stringify({
            userId: "ONL_armaan__23",  
            password: "Armaan@23",      
            grant_type: "password",
          }),
        });

        // Handle non-OK response status
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error ${response.status}: ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();

        // Check if access token exists in the response
        if (data && data.access_token) {
          setToken(data.access_token);
        } else {
          throw new Error("Access token not found in response");
        }
      } catch (err) {
        // Proper error handling
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
        console.error("Failed to fetch access token:", err);
      }
    }

    fetchAccessToken()
  
  }, []); // Emp

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
