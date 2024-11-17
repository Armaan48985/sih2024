'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { FaTools, FaUser, FaUsers, FaUserShield } from 'react-icons/fa';
import { MdConstruction } from 'react-icons/md';
import { supabase } from '../supabase';
import { useRouter } from 'next/navigation';

const Page: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [otherRole, setOtherRole] = useState<string>('');
  const [latitude] = useState<number | undefined>();
  const [longitude] = useState<number | undefined>();
  const router = useRouter();


  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendData();
  };

  const sendData = async () => {
    const projectName = (document.getElementById('projectName') as HTMLInputElement)?.value || '';
    const address1 = (document.getElementById('address1') as HTMLInputElement)?.value || '';
    const address2 = (document.getElementById('address2') as HTMLInputElement)?.value || '';
    const startDate = (document.getElementById('startDate') as HTMLInputElement)?.value || '';
    const endDate = (document.getElementById('endDate') as HTMLInputElement)?.value || '';
    const constructionType = (document.getElementById('constructionType') as HTMLSelectElement)?.value || '';

    const { data, error } = await supabase.from('construction').insert([
      {
        user_role: selectedRole || otherRole,
        project_name: projectName,
        address: `${address1}, ${address2}`,
        latitude,
        longitude,
        start_date: startDate,
        end_date: endDate,
        construction_type: constructionType,
      },
    ]);

    if (error) {
      console.error('Error inserting data:', error);
    } else {
      console.log('Data inserted successfully:', data);
      alert('Your information was saved! 🎉');
      router.push('/');
    }
  };

  // const getCurrentLocation = () => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         setLatitude(position.coords.latitude);
  //         setLongitude(position.coords.longitude);
  //       },
  //       () => {
  //         alert('Unable to retrieve location. Please allow location access.');
  //       }
  //     );
  //   } else {
  //     alert('Geolocation is not supported by this browser.');
  //   }
  // };

  return (
    <div className="w-full h-[100%] flex items-center flex-col bg-gray-100 font-poppins">
      <div className="text-center mt-20">
        <h2 className="text-3xl font-semibold mb-4 text-gray-700 font-mont flex-center gap-3">
          Construction Details <MdConstruction />
        </h2>
        <p className="text-gray-500 text-sm">
          Please fill in the details below to submit the construction project information.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 mb-14">
        <div className="bg-white rounded-lg shadow-lg p-8 w-[35rem] relative mt-8">
          <div className="mb-4">
            <label className="block mb-1 text-lg text-gray-600 form-label">
              User Role <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className={`flex items-center gap-4 p-3 border rounded ${
                  selectedRole === 'central-gov' ? 'border-orange-400 font-bold' : 'bg-white text-black border-gray-300 hover:border-gray-800'
                }`}
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
                className={`flex items-center justify-center p-2 border rounded ${
                  selectedRole === 'state-gov' ? 'border-orange-400 font-bold' : 'bg-white text-black border-gray-300 hover:border-gray-800'
                }`}
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
                className={`flex items-center justify-center p-2 py-4 border rounded ${
                  selectedRole === 'construction-manager' ? 'border-orange-400 font-bold' : 'bg-white text-black border-gray-300 hover:border-gray-800'
                }`}
                onClick={() => setSelectedRole('construction-manager')}
              >
                <FaTools className="mr-2" /> Construction Manager
              </button>

              <button
                type="button"
                className={`flex items-center justify-center p-2 border rounded ${
                  selectedRole === 'normal-worker' ? 'border-orange-400 font-bold' : 'bg-white text-black border-gray-300 hover:border-gray-800'
                }`}
                onClick={() => setSelectedRole('normal-worker')}
              >
                <FaUsers className="mr-2" /> Other
              </button>
            </div>

            {selectedRole === 'normal-worker' && (
              <div className="mt-4">
                <label className="block mb-2 form-label text-gray-600">Please specify your role</label>
                <input
                  type="text"
                  value={otherRole}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setOtherRole(e.target.value)}
                  placeholder="Enter your role"
                  className="p-2 border rounded w-full"
                />
              </div>
            )}
          </div>
          {/* Additional fields */}
          {/* [Rest of your form fields go here, unchanged] */}
        </div>
      </form>
    </div>
  );
};

export default Page;
