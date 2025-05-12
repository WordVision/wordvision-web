"use client";
import React, { useState } from "react";
import { User, PenSquare, LogOut } from "lucide-react";

export default function UserProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    email: "johndoe@example.com",
    firstName: "John",
    lastName: "Doe",
    birthDate: "1990-01-15",
  });

  const [formData, setFormData] = useState({ ...userData });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: any) => {
    if (e) {
      e.preventDefault();
    }
    setUserData({ ...formData });
    setIsEditing(false);
  };

  const formatBirthDate = (dateString: any) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleSignOut = () => {
    alert("User signed out successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="md:flex">
          <div className="p-8 w-full">
            <div className="flex items-center justify-center mb-8">
              <div className="bg-blue-500 rounded-full p-3">
                <User size={48} className="text-white" />
              </div>
            </div>

            <div className="uppercase tracking-wide text-sm text-blue-500 font-semibold text-center mb-6">
              User Profile
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Birth Date
                  </label>
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={handleSubmit}
                    className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-300"
                  >
                    Save
                  </button>

                  <button
                    onClick={() => {
                      setFormData({ ...userData });
                      setIsEditing(false);
                    }}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="mt-1 text-lg text-gray-900">{userData.email}</p>
                </div>

                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-sm font-medium text-gray-500">
                    First Name
                  </h3>
                  <p className="mt-1 text-lg text-gray-900">
                    {userData.firstName}
                  </p>
                </div>

                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-sm font-medium text-gray-500">
                    Last Name
                  </h3>
                  <p className="mt-1 text-lg text-gray-900">
                    {userData.lastName}
                  </p>
                </div>

                <div className="pb-4">
                  <h3 className="text-sm font-medium text-gray-500">
                    Birth Date
                  </h3>
                  <p className="mt-1 text-lg text-gray-900">
                    {formatBirthDate(userData.birthDate)}
                  </p>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 flex items-center justify-center bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-300"
                  >
                    <PenSquare size={18} className="mr-2" />
                    Edit Profile
                  </button>

                  <button
                    onClick={handleSignOut}
                    className="flex-1 flex items-center justify-center bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-300"
                  >
                    <LogOut size={18} className="mr-2" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
