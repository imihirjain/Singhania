import React, { useState, useEffect } from "react";
import axios from "axios";
import { ExportButtons } from "../components/ExportButton";

const HeatsetTable = () => {
  const [submittedData, setSubmittedData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchSubmittedData();
  }, []);

  const fetchSubmittedData = async () => {
    try {
      const response = await axios.get(
        "https://singhania-inventory.onrender.com/api/lots/completed/heat",
        {
          withCredentials: true,
        }
      );
      const sortedData = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setSubmittedData(sortedData);
    } catch (error) {
      console.error("Error fetching submitted data:", error);
    }
  };

  const groupEntries = (data) => {
    const groupedData = {};
    data.forEach((item) => {
      const key = `${item.partyName}-${item.quality}-${item.lotNumber}`;
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
        item.lotNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return filteredData;
  };

  const formatDateTime = (dateTimeString) => {
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

  const flattenData = () => {
    const rows = [];
    Object.values(groupedData).forEach((lots) => {
      lots.forEach((lot) => {
        lot.entries.forEach((entry) => {
          rows.push({
            date: formatDateTime(lot.createdAt),
            lotNumber: lot.lotNumber,
            partyName: lot.partyName,
            quality: lot.quality,
            shade: lot.shade,
            process: lot.processType,
            status: lot.status,
            challanNumber: entry.challanNumber,
            kg: entry.kg,
            meter: entry.meter,
            roll: entry.roll,
          });
        });
      });
    });
    return rows;
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full mt-6 bg-white border-nav border-2 rounded-lg">
        <div className="flex flex-col lg:flex lg:flex-row ml-4 mt-4 lg:justify-between ">
          <div className="text-title font-bold">
            Heatset Table <br /> Total: {submittedData.length}
          </div>
          <div className="flex items-center justify-center gap-7">
            <ExportButtons
              className="justify-end"
              tableData={flattenData()}
              filename="HeatSet Table"
            />
            <div className="flex items-center bg-backgrnd mt-3 justify-center mr-6 h-[35px] overflow-hidden rounded-full">
              <div>
                <img
                  className="h-[24px] w-[24px] ml-5"
                  src={require("../assets/stockinSearch.png")}
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
                    Date & Time
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold text-[14px] uppercase">
                    Lot Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[14px] uppercase">
                    Party Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[14px] uppercase">
                    Quality
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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-login font-header text-[16px] font-medium divide-gray-200">
                {Object.entries(groupedData).map(([key, value], index) => (
                  <React.Fragment key={index}>
                    {value.map((entry, idx) => (
                      <React.Fragment key={entry._id}>
                        {entry.entries.map((subEntry, subIdx) => (
                          <tr key={subEntry._id}>
                            {idx === 0 && subIdx === 0 && (
                              <React.Fragment>
                                <td
                                  className="px-6 py-4 whitespace-nowrap"
                                  rowSpan={entry.entries.length}
                                >
                                  {formatDateTime(entry.createdAt) || "N/A"}
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
                                  {entry.partyName}
                                </td>
                                <td
                                  className="px-6 py-4 whitespace-nowrap"
                                  rowSpan={entry.entries.length}
                                >
                                  {entry.quality}
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
                              </React.Fragment>
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
                          </tr>
                        ))}
                      </React.Fragment>
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
};

export default HeatsetTable;
