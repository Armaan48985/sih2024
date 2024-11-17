'use client'
import React from 'react'
import { useState } from "react";
import { FaMapMarkerAlt, FaPlus, FaTimes, FaTools, FaUser, FaUsers, FaUserShield } from "react-icons/fa"; 

import { SonnerDemo } from "@/components/SonnerDemo";
import LocationPicker from "@/components/LocationPicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { supabase } from '../supabase';
import { MdConstruction } from 'react-icons/md';
const page = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [otherRole, setOtherRole] = useState(''); 
  const [dataSent, setDataSent] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [latitude, setLatitude] = useState<number>();
  const [longitude, setLongitude] = useState<number>();
  const router = useRouter()
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  const toggleMap = () => setShowMap(!showMap);
  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log('hey')
    sendData();
    handleClose(); 
  };

  const sendData = async () => {
    const { data, error } = await supabase.from('construction').insert([
      {
        user_role: selectedRole,
        project_name: (document.getElementById("projectName") as HTMLInputElement).value,
        address: (document.getElementById("address1") as HTMLInputElement).value + ", " + (document.getElementById("address2") as HTMLInputElement).value,
        latitude: latitude,
        longitude: longitude,
        start_date: (document.getElementById("startDate") as HTMLInputElement).value,
        end_date: (document.getElementById("endDate") as HTMLInputElement).value,
        construction_type: (document.getElementById("constructionType") as HTMLSelectElement).value,
      }
    ]);

    console.log('hey2')
    if (error) {
      console.error("Error inserting data:", error);
    } else {
      console.log("Data inserted successfully:", data);
      setDataSent(true);
      alert('Your information was saved! 🎉')
      router.push("/");
     
    }
  };

  
  // Function to handle getting the current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          alert("Unable to retrieve location. Please allow location access.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };
  return (
    <div className="w-full h-[100%] flex items-center flex-col bg-gray-100 font-poppins">
      {/* Heading Section */}
      <div className="text-center mt-20">
        <h2 className="text-3xl font-semibold mb-4 text-gray-700 font-mont flex-center gap-3">Construction Details <MdConstruction /></h2>
        <p className="text-gray-500 text-sm">Please fill in the details below to submit the construction project information.</p>
      </div>


    <form onSubmit={handleSubmit} className="space-y-6 mb-14">
    <div className="bg-white rounded-lg shadow-lg p-8 w-[35rem] relative mt-8">
  
    {/* Form Section */}
      
      {/* User Role Selection */}
      <div className="mb-4">
      <label className="block mb-1 text-lg text-gray-600 form-label">
        User Role <span className="text-red-500">*</span>
      </label>
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          className={`flex items-center gap-4 p-3 border rounded ${selectedRole === 'central-gov' ? 'border-orange-400 font-bold' : 'bg-white text-black border-gray-300 hover:border-gray-800'}`}
          onClick={() => setSelectedRole('central-gov')}
        >
          <FaUser size={20} />
          <div>
            <span>Central Government</span>
            <div className="text-xs text-center">(NHAI)</div>
          </div>
        </button>

        <button
          type="button"
          className={`flex items-center justify-center p-2 border rounded ${selectedRole === 'state-gov' ? 'border-orange-400 font-bold' : 'bg-white text-black border-gray-300 hover:border-gray-800'}`}
          onClick={() => setSelectedRole('state-gov')}
        >
          <FaUserShield size={20} />
          <div>
            <span>State Government</span>
            <div className="text-xs text-center">(PWD)</div>
          </div>
        </button>

        <button
          type="button"
          className={`flex items-center justify-center p-2 py-4 border rounded ${selectedRole === 'construction-manager' ? 'border-orange-400 font-bold' : 'bg-white text-black border-gray-300 hover:border-gray-800'}`}
          onClick={() => setSelectedRole('construction-manager')}
        >
          <FaTools className="mr-2" /> Construction Manager
        </button>

        <button
          type="button"
          className={`flex items-center justify-center p-2 border rounded ${selectedRole === 'normal-worker' ? 'border-orange-400 font-bold' : 'bg-white text-black border-gray-300 hover:border-gray-800'}`}
          onClick={() => setSelectedRole('normal-worker')}
        >
          <FaUsers className="mr-2" /> Other
        </button>
      </div>

      {/* Conditionally render input box if "Other" is selected */}
      {selectedRole === 'normal-worker' && (
        <div className="mt-4">
          <label className="block mb-2 form-label text-gray-600">Please specify your role</label>
          <input
            type="text"
            value={otherRole}
            onChange={(e) => setOtherRole(e.target.value)}
            placeholder="Enter your role"
            className="p-2 border rounded w-full"
          />
        </div>
      )}
    </div>
      
      {/* Project Name */}
      <div className="mb-6">
        <label className="block mb-1 text-lg text-gray-600 form-label" htmlFor="projectName">Project Name</label>
        <input
          type="text"
          id="projectName"
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
      </div>
      
      {/* Address Fields */}
      <div className="mb-4">
        <label className="block mb-1 text-lg text-gray-600 form-label" htmlFor="address1">Address 1 <span className="text-red-500">*</span></label>
        <input
          type="text"
          id="address1"
          className="w-full p-3 border border-gray-300 rounded-lg"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 text-lg text-gray-600 form-label" htmlFor="address2">Address 2 <span className="text-red-500">*</span></label>
        <input
          type="text"
          id="address2"
          className="w-full p-3 border border-gray-300 rounded-lg"
          required
        />
      </div>
      
      {/* Latitude & Longitude */}
      <div className="mb-4">
        <label className="block mb-1 text-lg text-gray-600 form-label">Latitude & Longitude</label>
        <div className="flex gap-4">
          <input
            type="number"
            id="latitude"
            value={latitude}
            onChange={(e) => setLatitude(Number(e.target.value))}
            placeholder="Latitude"
            className="w-1/2 p-3 border border-gray-300 rounded-lg"
          />
          <input
            type="number"
            id="longitude"
            value={longitude}
            onChange={(e) => setLongitude(Number(e.target.value))}
            placeholder="Longitude"
            className="w-1/2 p-3 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      {/* Choose Location */}
      <div className="flex justify-between gap-4 mt-4">
        <Button
          type="button"
          className="w-full p-2 text-white bg-[#26A697] rounded-lg hover:bg-[#26a697ef] transition"
          onClick={toggleMap}
        >
          <span>Choose from Map</span>
          <FaMapMarkerAlt size={16} />
        </Button>
        <div className="flex justify-center items-center">
          <p className="text-gray-600">or</p>
        </div>
        <Button
          type="button"
          className="w-full p-2 text-white bg-[#26A697] rounded-lg hover:bg-[#26a697ef] transition"
          onClick={getCurrentLocation}
        >
          Use Current Location
        </Button>
      </div>

      {/* Start Date & End Date */}
      <div className="flex gap-8 mt-10">
        <div className="w-1/2">
          <label className="block mb-1 text-lg text-gray-600 form-label" htmlFor="startDate">Start Date <span className="text-red-500">*</span></label>
          <input
            type="date"
            id="startDate"
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div className="w-1/2">
          <label className="block mb-1 text-lg text-gray-600 form-label" htmlFor="endDate">Projected End Date <span className="text-red-500">*</span></label>
          <input
            type="date"
            id="endDate"
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
        </div>
      </div>
      
      {/* Construction Type */}
      <div className="mb-4 mt-6">
        <label className="block mb-1 text-lg text-gray-600 form-label" htmlFor="constructionType">Type of Construction <span className="text-red-500">*</span></label>
        <select
          id="constructionType"
          className="w-full p-3 border border-gray-300 rounded-lg"
          required
        >
          <option value="">Select type</option>
          <option value="residential">Residential</option>
          <option value="commercial">Commercial</option>
          <option value="infrastructure">Infrastructure</option>
          <option value="industrial">Industrial</option>
          <option value="other">Other</option>
        </select>
      </div>
      
      {/* Description */}
      <div className="mb-4">
        <label className="block mb-1 text-lg text-gray-600 form-label" htmlFor="description">Description</label>
        <textarea
          id="description"
          className="w-full p-3 border border-gray-300 rounded-lg"
          rows={4}
        />
      </div>
      
      {/* Contact Information */}
      <div className="mb-4">
        <label className="block mb-1 text-lg text-gray-600 form-label" htmlFor="contactInfo">Contact Information</label>
        <input
          type="text"
          id="contactInfo"
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
      </div>

      {/* Attachments */}
      <div className="mb-4">
        <label className="block mb-1 text-lg text-gray-600 form-label " htmlFor="attachments">Visuals of site</label>
        <input
          type="file"
          id="attachments"
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
      </div>
      
      {/* Submit Button */}
    </div>
      <div className='my-8 w-[35rem]'>
        <button
          type="submit"
          className="w-full bg-[#26A697] text-white p-3 py-4 rounded-lg transition"
        >
          Submit
        </button>
      </div>
    </form>
      

   

      {showMap && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative w-[65vw] h-[75vh] bg-white rounded-lg overflow-hidden shadow-lg">
          
            <LocationPicker 
              onSelectLocation={(lat:any, lng:any) => {
                setLatitude(lat);
                setLongitude(lng);
              }} 
              showMap={showMap} 
              setShowMap={setShowMap} 
              setLatitude={setLatitude} 
              setLongitude={setLongitude}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default page