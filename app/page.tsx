'use client'
import { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaPlus, FaTimes, FaTools, FaUser, FaUsers, FaUserShield } from "react-icons/fa"; 
import { supabase } from "./supabase";
import { SonnerDemo } from "@/components/SonnerDemo";
import LocationPicker from "@/components/LocationPicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {


  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAccessToken() {
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
        setToken(data.access_token);  // Assuming access_token is in the response body

      } catch (error) {
        setError(error?.message);
        console.error("Failed to fetch access token:", error);
      }
    }

    fetchAccessToken();
  }, []);

const router = useRouter()
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-100 font-poppins relative">
      
      <div>
        <h1>Home Page</h1>
        {error ? <p>Error: {error}</p> : <p>Access Token: {token ? token : "Loading..."}</p>}
      </div>
      
      
      <Link href='/construction-form'>
        <div className="w-20 h-20 absolute right-28 bottom-16 flex items-center justify-center rounded-full bg-orange-400 animate-zoom cursor-pointer">
          <span className="text-3xl text-white">
            <FaPlus />
          </span>
        </div>
      </Link>
       

    
    </div>
  );
}
