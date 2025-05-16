import React from "react";

const GreyPreviewTable = ({ data, isEditMode, onEdit }) => {
  const groupedData = data.reduce((acc, entry) => {
    const key = `${entry.lotNumber}-${entry.partyName}-${entry.quality}-${entry.shade}-${entry.processType}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(entry);
    return acc;
  }, {});

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    const formattedDate = date.toLocaleDateString("en-US");
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    return `${formattedDate}, ${formattedTime}`;
  };

  return (
    <div className="overflow-x-auto w-full mt-4">
      <table className="text-sm divide-y divide-gray-200">
        <thead className="bg-header text-header-font font-header">
          <tr>
            <th className="px-2 py-2 text-left text-xs font-semibold uppercase">
              Lot
            </th>
            <th className="px-2 py-2 text-left text-xs font-semibold uppercase">
              Party
            </th>
            <th className="px-2 py-2 text-left text-xs font-semibold uppercase">
              Quality
            </th>
            <th className="px-2 py-2 text-left text-xs font-semibold uppercase">
              Shade
            </th>
            <th className="px-2 py-2 text-left text-xs font-semibold uppercase">
              Process
            </th>
            <th className="px-2 py-2 text-left text-xs font-semibold uppercase">
              Challan
            </th>
            <th className="px-2 py-2 text-left text-xs font-semibold uppercase">
              KG
            </th>
            <th className="px-2 py-2 text-left text-xs font-semibold uppercase">
              Meter
            </th>
            <th className="px-2 py-2 text-left text-xs font-semibold uppercase">
              Roll
            </th>
            <th className="px-2 py-2 text-left text-xs font-semibold uppercase">
              Date
            </th>
            {isEditMode && (
              <th className="px-2 py-2 text-left text-xs font-semibold uppercase">
                Edit
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {Object.values(groupedData).map((entries, groupIndex) =>
            entries.map((entry, index) => (
              <tr key={`${groupIndex}-${index}`}>
                <td className="px-2 py-2">{entry.lotNumber}</td>
                <td className="px-2 py-2">{entry.partyName}</td>
                <td className="px-2 py-2">{entry.quality}</td>
                <td className="px-2 py-2">{entry.shade}</td>
                <td className="px-2 py-2">{entry.processType}</td>
                <td className="px-2 py-2">{entry.challanNumber}</td>
                <td className="px-2 py-2">{entry.kg}</td>
                <td className="px-2 py-2">{entry.meter}</td>
                <td className="px-2 py-2">{entry.roll}</td>
                <td className="px-2 py-2">{formatDateTime(entry.dateTime)}</td>
                {isEditMode && (
                  <td className="px-2 py-2">
                    <button
                      onClick={() => onEdit(entry)}
                      className="text-blue-600 hover:underline"
                    >
                      ✏️
                    </button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default GreyPreviewTable;
