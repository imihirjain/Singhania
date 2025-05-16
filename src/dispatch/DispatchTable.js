import React, { useState, useEffect } from "react";
import axios from "axios";
import { ExportButtons } from "../components/ExportButton";

function DispatchTable() {
  const [submittedData, setSubmittedData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchSubmittedData();
  }, []);

  const fetchSubmittedData = async () => {
    try {
      const response = await axios.get(
        "https://singhania-inventory.onrender.com/api/dispatch",
        {
          withCredentials: true,
        }
      );
      console.log("Fetched Data:", response.data);
      const sortedData = response.data.sort((a, b) => {
        return new Date(b.dispatchDate) - new Date(a.dispatchDate);
      });
      setSubmittedData(sortedData);
    } catch (error) {
      console.error("Error fetching submitted data:", error);
    }
  };

  const groupEntries = (data) => {
    const groupedData = {};
    data.forEach((item) => {
      const key = `${item.party}-${item.lotNumber}`;
      if (!groupedData[key]) {
        groupedData[key] = [];
      }
      groupedData[key].push(item);
    });
    return groupedData;
  };

  const handleSearch = () => {
    const filteredData = submittedData.filter((item) => {
      const party = item.party ? item.party.toLowerCase() : "";
      const lotNumber = item.lotNumber ? item.lotNumber.toLowerCase() : "";
      const qualityChallanNumber = item.qualityChallanNumber
        ? item.qualityChallanNumber.toLowerCase()
        : "";
      return (
        party.includes(searchQuery.toLowerCase()) ||
        lotNumber.includes(searchQuery.toLowerCase()) ||
        qualityChallanNumber.includes(searchQuery.toLowerCase())
      );
    });
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
  console.log("grouped", groupedData);

  const flattenData = (data) => {
    if (!Array.isArray(data)) return []; // ✅ Prevent errors

    return data.map((item) => ({
      Dispatch_Date: formatDateTime(item.dispatchDate) || "N/A",
      lotNumber: item.lotNumber || "N/A",
      party: item.party || "N/A",
      quality: item.quality || "N/A",
      shade: item.shade || "N/A",
      process: item.process || "N/A",
      status: item.status || "N/A",
      ChallanNumber: item.qualityChallanNumber || "N/A",
      karigar: item.karigarName || "N/A",
      kg: item.kg || "N/A",
      meter: item.meter || "N/A",
      roll: item.roll || "N/A",
    }));
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full mt-6 bg-white border-nav border-2 rounded-lg">
        <div className="flex flex-col lg:flex lg:flex-row ml-4 mt-4 lg:justify-between">
          <div className="text-title font-bold">
            Dispatch Table <br /> Total: {submittedData.length}
          </div>

          <div className="flex items-center justify-center gap-7">
            <ExportButtons
              className="justify-end"
              tableData={flattenData(handleSearch())}
              filename="Dispatch Table"
              orientation="landscape"
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
                    Karigar Name
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
                  <React.Fragment key={key}>
                    <tr>
                      <td
                        className="px-6 py-4 whitespace-nowrap"
                        rowSpan={value.length}
                      >
                        {formatDateTime(value[0].dispatchDate) || "N/A"}
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap"
                        rowSpan={value.length}
                      >
                        {value[0].lotNumber}
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap"
                        rowSpan={value.length}
                      >
                        {value[0].party}
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap"
                        rowSpan={value.length}
                      >
                        {value[0].quality || "N/A"}
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap"
                        rowSpan={value.length}
                      >
                        {value[0].shade || "N/A"}
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap"
                        rowSpan={value.length}
                      >
                        {value[0].process || "N/A"}
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap"
                        rowSpan={value.length}
                      >
                        {value[0].status || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {value[0].qualityChallanNumber || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {value[0].karigarName || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {value[0].kg || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {value[0].meter || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {value[0].roll || "N/A"}
                      </td>
                    </tr>
                    {value.slice(1).map((item, idx) => (
                      <tr key={idx}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.qualityChallanNumber || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.karigarName || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.kg || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.meter || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.roll || "N/A"}
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

export default DispatchTable;
