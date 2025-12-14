"use client";
import Image from "next/image";
import CustomerHeader from "./_components/CustomerHeader";
import Footer from "./_components/Footer";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [locations, setLocations] = useState([]);
  
  const [restaurants, setRestaurants] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [showLocation, setShowLocation] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadLocations();
    loadRestaurants();
  }, []);

  const loadLocations = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/customers/locations");
      const data = await res.json();
      console.log("API response:", data);

      if (data.success && Array.isArray(data.result)) {
        setLocations(data.result);
        console.log("setLocations called with:", data.result);
      } else {
        console.warn("No result array found in response");
      }
    } catch (err) {
      console.error("Failed to fetch locations:", err);
    }
  };

  const loadRestaurants = async (params) => {
    let url = "http://localhost:3000/api/customers";
    if(params?.location){
      url = url+"?location="+params.location

    }else if (params?.restaurant) {
      url = url+"?restaurant="+ params.restaurant;

    }
    let response = await fetch(url);
    response = await response.json();
    console.log("bbbbb",response)
    if (response.success) {
      setRestaurants(response.result);
    }
  };

  useEffect(() => {
    console.log("locations state updated:", locations);
  }, [locations]);

  const handleListItem = (item) => {
    setSelectedLocation(item);
    setShowLocation(false);
    loadRestaurants({location:item})
  };



  return (
    <main>
      <CustomerHeader />
      <div className="main-page-banner">
        <h1>Food delivery App</h1>
        <div className="input-wrapper">
          <input
            type="text"
            value={selectedLocation}
            readOnly
            onClick={() => setShowLocation(true)}
            className="select-input"
            placeholder="Select Place"
          />
          {showLocation && (
            <ul className="location-list">
              {locations.map((item, index) => (
                <li key={index} onClick={() => handleListItem(item)}>
                  {item}
                </li>
              ))}
            </ul>
          )}
          <input
            type="text"
            className="search-input"
            onChange={(event) =>
              loadRestaurants({ restaurant: event.target.value })
            }
            placeholder="Enter food or restaurant name"
          />
        </div>
      </div>
      <div className="restaurant-list-container">
        {restaurants.map((item) => (
          <div
            key={item._id}
            className="restaurant-wrapper"
            onClick={() =>
              router.push("explore/" + item.name + "?id=" + item._id)
            }
          >
            <h3>{item.name}</h3>
            <h5>Contact: {item.contact}</h5>
            <div className="address-wrapper">
              <div>{item.city},</div>
              <div className="address">
                {item.address}, Email: {item.email}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Footer />
    </main>
  );
}
