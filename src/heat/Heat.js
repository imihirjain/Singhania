import React, { useEffect, useState } from "react";
import axios from "axios";
import ReusableTable from "../grey-stock/ReusableTable";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HeatComponent = () => {
  const [lots, setLots] = useState([]);

  useEffect(() => {
    fetchLots();
  }, []);

  const fetchLots = async () => {
    try {
      const response = await axios.get(
        `https://singhania-inventory.onrender.com/api/lots/status/heat`
      );
      console.log("Fetched Lots:", response.data);
      setLots(response.data);
    } catch (error) {
      console.error("Error fetching lots:", error);
      toast.error("Error fetching lots");
    }
  };

  const handleMarkComplete = async (lotId) => {
    try {
      await axios.post(
        "https://singhania-inventory.onrender.com/api/lots/status",
        {
          lotId,
          status: "complete",
        }
      );
      fetchLots();
      toast.success("Lot marked as complete");
    } catch (error) {
      console.error("Error updating lot status:", error);
      toast.error("Error updating lot status");
    }
  };

  return (
    <div className="lg:w-[1200px] items-center px-4 py-8">
      <h1 className="text-3xl font-semibold font-login text-center text-white shadow-lg bg-darkgray rounded-md p-6 hover:scale-105 transition-transform duration-300">
        Heat Management
      </h1>
      <ReusableTable
        text="Heatset"
        lots={lots}
        handleMarkComplete={handleMarkComplete}
      />
      <ToastContainer position="top-center" />
    </div>
  );
};

export default HeatComponent;
