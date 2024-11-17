'use client';
import { useState } from 'react';
import { supabase } from '../supabase';
import { useRouter } from 'next/navigation';

const PhoneOtpLoginPage = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const router = useRouter();

  const handleButtonClick = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otpSent) {
      if (phoneNumber.length < 10) {
        setErrorMessage('Please enter a valid phone number.');
        return;
      }

      try {
        const { data, error } = await supabase.auth.signInWithOtp({
          phone: '91' + phoneNumber,
        });

        if (error) {
          setErrorMessage(error.message);
          return;
        }

        if (data) {
          console.log('OTP sent to', phoneNumber);
          setOtpSent(true);
          setErrorMessage('');
        }
      } catch {
        setErrorMessage('Something went wrong, please try again.');
      }
    } else {
      if (otp.length < 6) {
        setErrorMessage('Please enter a valid OTP.');
        return;
      }

      try {
        const { data: { session }, error } = await supabase.auth.verifyOtp({
          phone: '91' + phoneNumber,
          token: otp,
          type: 'sms',
        });

        if (error) {
          setErrorMessage(error.message);
          return;
        }

        if (session) {
          console.log('working')
          // Example fetch request from the frontend
        await fetch('/api/set-session-cookie', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: session.access_token }),
        });

          console.log('OTP verified, logging in...');
          router.push('/');
          setOtpSent(false);
        }
      } catch {
        setErrorMessage('Failed to verify OTP, please try again.');
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Phone OTP Login</h1>
      
      <form
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-6"
        onSubmit={handleButtonClick}
      >
        {/* Phone Number Input */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-600 mb-2" htmlFor="phone">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            placeholder="Enter your phone number"
            className="w-full p-3 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>

        {/* OTP Input */}
        {otpSent && (
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-600 mb-2" htmlFor="otp">
              OTP Code
            </label>
            <input
              type="text"
              id="otp"
              placeholder="Enter OTP"
              className="w-full p-3 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="text-red-500 text-sm text-center">
            {errorMessage}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300"
          onClick={handleButtonClick}
        >
          {otpSent ? 'Verify OTP' : 'Send OTP'} {/* Change button text */}
        </button>
      </form>

      <div className="mt-4 text-center text-sm text-gray-600">
        <span>Dont have an account?</span>
        <button className="text-blue-600 hover:underline ml-1">
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default PhoneOtpLoginPage;
