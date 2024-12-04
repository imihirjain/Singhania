import React, { useState, useEffect } from "react";
import axios from "axios";

function ProcessTable() {
  const [submittedData, setSubmittedData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchSubmittedData();
  }, []);

  const fetchSubmittedData = async () => {
    try {
      const response = await axios.get(
        "https://singhania-inventory.onrender.com/api/lots/completed/process",
        {
          withCredentials: true,
        }
      );
      console.log("Fetched Data:", response.data);
      const sortedData = response.data.sort((a, b) => {
        const dateA = new Date(a.submittedAt);
        const dateB = new Date(b.submittedAt);
        return isNaN(dateB.getTime()) - isNaN(dateA.getTime()) || dateB - dateA;
      });
      setSubmittedData(sortedData);
    } catch (error) {
      console.error("Error fetching submitted data:", error);
    }
  };

  const handleEditClick = (entry, subEntry) => {
    setSelectedEntry({ ...entry, subEntry });
    setShowEditModal(true);
  };

  const handleDeleteClick = (entry, subEntry) => {
    setSelectedEntry({ ...entry, subEntry });
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(
        `https://singhania-inventory.onrender.com/api/lots/${selectedEntry.subEntry._id}`
      );
      fetchSubmittedData();
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting entry:", error);
    }
  };

  const handleEditConfirm = async () => {
    try {
      const updatedEntry = {
        ...selectedEntry,
        ...selectedEntry.subEntry,
        kg: selectedEntry.subEntry.kg,
        meter: selectedEntry.subEntry.meter,
        roll: selectedEntry.subEntry.roll,
      };

      await axios.put(
        `https://singhania-inventory.onrender.com/api/lots/${selectedEntry.subEntry._id}`,
        updatedEntry
      );
      fetchSubmittedData();
      setShowEditModal(false);
    } catch (error) {
      console.error(
        "Error updating entry:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedEntry({
      ...selectedEntry,
      subEntry: { ...selectedEntry.subEntry, [name]: value },
    });
  };

  const groupEntries = (data) => {
    const groupedData = {};
    data.forEach((item) => {
      const key = `${item.partyName}-${item.qualityChallanNumber}`;
      if (!groupedData[key]) {
        groupedData[key] = [];
      }
      groupedData[key].push(item);
    });
    return groupedData;
  };

  const handleSearch = () => {
    const filteredData = submittedData.filter(
      (item) =>
        item.partyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.qualityChallanNumber
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        item.lotNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return filteredData;
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString || isNaN(new Date(dateTimeString).getTime())) {
      return "Invalid Date";
    }

    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return new Date(dateTimeString).toLocaleString("en-US", options);
  };

  const groupedData = groupEntries(handleSearch());

  return (
    <div className="flex flex-col items-center">
      <div className="w-full mt-6 bg-white border-nav border-2 rounded-lg">
        <div className="flex ml-4 mt-4 justify-between items-center">
          <div className="text-title font-bold">
            Process Table <br /> Total: {submittedData.length}
          </div>

          <div className="flex items-center bg-backgrnd justify-center mr-6 h-[35px] overflow-hidden rounded-full">
            <div>
              <img
                className="h-[24px] w-[24px] ml-5"
                src={require("../../assets/searchicon.png")}
                alt="Inventory Management System"
              />
            </div>
            <div className="h-[25px] ml-6 border-total border-[1px]"></div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="mb-4 mt-3 w-[250px] bg-backgrnd placeholder:text-center border border-none placeholder:font-login placeholder:text-[14px] placeholder:bg-backgrnd placeholder:text-total font-medium"
            />
          </div>
        </div>

        {Object.keys(groupedData).length === 0 ? (
          <div className="text-center">
            <p
              className="text-gray-800 font-semibold text-lg"
              style={{ color: "#4A90E2" }}
            >
              Sorry, no data available at the moment.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y mt-6 divide-gray-200 border overflow-hidden">
              <thead className="bg-header text-header-font font-header">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[14px] uppercase">
                    Party Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[14px] uppercase">
                    Lot Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[14px] uppercase">
                    Shade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[14px] uppercase">
                    Process
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[14px] uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[14px] uppercase">
                    Quality
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[14px] uppercase">
                    Challan Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[14px] uppercase">
                    Kg
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[14px] uppercase">
                    Meter
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[14px] uppercase">
                    Roll
                  </th>
                  {/* <th className="px-6 py-3 text-left text-xs font-semibold text-[14px] uppercase">
                    Submitted Date & Time
                  </th> */}
                  <th className="px-12 py-3 text-left text-xs font-semibold text-[14px] uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-login font-header text-[16px] font-medium divide-gray-200">
                {submittedData.map((entry, index) => (
                  <React.Fragment key={index}>
                    {entry.entries.map((subEntry, subIndex) => (
                      <tr key={subEntry._id}>
                        {subIndex === 0 && (
                          <>
                            <td
                              className="px-6 py-4 whitespace-nowrap"
                              rowSpan={entry.entries.length}
                            >
                              {entry.partyName}
                            </td>
                            <td
                              className="px-6 py-4 whitespace-nowrap"
                              rowSpan={entry.entries.length}
                            >
                              {entry.lotNumber || "N/A"}
                            </td>
                            <td
                              className="px-6 py-4 whitespace-nowrap"
                              rowSpan={entry.entries.length}
                            >
                              {entry.shade || "N/A"}
                            </td>
                            <td
                              className="px-6 py-4 whitespace-nowrap"
                              rowSpan={entry.entries.length}
                            >
                              {entry.processType || "N/A"}
                            </td>
                            <td
                              className="px-6 py-4 whitespace-nowrap"
                              rowSpan={entry.entries.length}
                            >
                              {entry.status || "N/A"}
                            </td>
                            <td
                              className="px-6 py-4 whitespace-nowrap"
                              rowSpan={entry.entries.length}
                            >
                              {entry.quality || "N/A"}
                            </td>
                          </>
                        )}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {subEntry.challanNumber || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {subEntry.kg || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {subEntry.meter || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {subEntry.roll || "N/A"}
                        </td>
                        {/* <td className="px-6 py-4 whitespace-nowrap">
                          {subEntry.submittedAt
                            ? formatDateTime(subEntry.submittedAt)
                            : "N/A"}
                        </td> */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            className="inline-flex mt-1 px-4 py-2 text-sm font-medium font-login text-white bg-darkgray rounded-md hover:bg-white hover:text-darkgray outline"
                            onClick={() => handleEditClick(entry, subEntry)}
                          >
                            Edit
                          </button>
                          <button
                            className="inline-flex mt-1 ml-3 px-4 py-2 text-sm font-medium font-login text-white bg-red-700 rounded-md hover:bg-white hover:text-darkgray hover:outline outline-red-800"
                            onClick={() => handleDeleteClick(entry, subEntry)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProcessTable;
