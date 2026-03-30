import React, { useEffect, useState } from "react";
import {
  Calendar,
  Download,
  Trash2,
  ExternalLink,
  MapPin,
  Clock,
  Globe,
  Scan,
  Users,
  X,
  Edit,
  ChartPie,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import {
  useGetCompanyBarcodes,
  useDeleteBarcode,
  useUpdateBarcode,
  type GeneratedBarcode,
} from "../services/companyApi";
import barcodeLimit from "../utils/barcodeLimit";
import AuthenticationPage from "../pages/barcodeAutendication";
import ScannedDetailsModal from "./ScannedDetailsModal";
import axiosInstancetandt from "../services/axiosInstance";
import { useNavigate } from "react-router-dom";
import { getStoredGuestBarcodes } from "../utils/guestBarcodeStorage";
import AuthPopup from "./authPopup";
import { motion } from "framer-motion";

interface GeneratedBarcodesProps {
  onViewBarcode?: (barcode: GeneratedBarcode) => void;

}

const GeneratedBarcodes: React.FC<GeneratedBarcodesProps> = () => {
  const [editingBarcodeId, setEditingBarcodeId] = useState<string | null>(null);
  const [editedData, setEditedData] = useState<any>(null);
  const [downloadingBarcodeId, setDownloadingBarcodeId] = useState<
    string | null
  >(null);
  const [scannedDetails, setScannedDetails] = useState<any[]>([]);
  const [IsLoading, setIsLoading] = useState(false);
  const [IsAnalyticsLoading, setIsAnalyticsLoading] = useState(false);
    const [showAuthRegistPopup, setShowAuthRegistPopup] = useState(false);
  

  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [selectedBarcodeForDetails, setSelectedBarcodeForDetails] = useState<
    any[]
  >([]);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const navigate = useNavigate();

    const {  remainingCount } = barcodeLimit.getLimitStatus('multiurl');
  


  // Get company ID from user session
  const getUserInfo = () => {
    try {
      const userSession = localStorage.getItem("userSession");
      if (userSession) {
        return JSON.parse(userSession);
      }
    } catch (error) {
      console.error("Error parsing user session:", error);
    }
    return null;
  };

  const userInfo = getUserInfo();
  const companyId = userInfo?.id;

  const {
    data: barcodeResponse,
    isLoading: loading,
    isError,
    error,
    refetch: loadGeneratedBarcodes,
  } = useGetCompanyBarcodes(companyId);

  React.useEffect(() => {
    const handleShowLoginPopup = () => {
      console.log("Showing login popup from GeneratedBarcodes...");
      setShowAuthPopup(true);
    };

    window.addEventListener("showLoginPopup", handleShowLoginPopup);
    return () =>
      window.removeEventListener("showLoginPopup", handleShowLoginPopup);
  }, []);

  const handleTryAgain = () => {
    if (!userInfo) {
      console.log("No user info, showing login popup...");
      setShowAuthPopup(true);
      return;
    }
    loadGeneratedBarcodes();
  };

  const deleteBarcode = useDeleteBarcode({
    onSuccess: () => {
      console.log("Barcode deleted successfully");
      loadGeneratedBarcodes();
    },
    onError: (error) => {
      console.error("Failed to delete barcode:", error);
      alert("Failed to delete barcode. Please try again.");
    },
  });

  const updateBarcode = useUpdateBarcode({
    onSuccess: () => {
      console.log("Barcode updated successfully");
      loadGeneratedBarcodes();
      setEditingBarcodeId(null);
      setEditedData(null);
    },
    onError: (error) => {
      console.error("Failed to update barcode:", error);
      alert("Failed to update barcode. Please try again.");
    },
  });

  const getStoredBCData = getStoredGuestBarcodes();
  const barcodes = userInfo ? barcodeResponse?.data?.barcodes || [] : getStoredBCData?.length > 0 ? getStoredBCData : [];

  const getSelectedType = (barcode: GeneratedBarcode) => {
    if (!barcode.jsonData?.data || barcode.jsonData.data.length === 0)
      return "Static";
    return barcode.jsonData.data[0]?.type || "Static";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Location":
        return <MapPin className="w-4 h-4" />;
      case "Time":
        return <Clock className="w-4 h-4" />;
      case "Language":
        return <Globe className="w-4 h-4" />;
      case "Number of scans":
        return <Scan className="w-4 h-4" />;
      case "Geo-fencing":
        return <Users className="w-4 h-4" />;
      default:
        return <ExternalLink className="w-4 h-4" />;
    }
  };

  const handleDownload = async (barcode: GeneratedBarcode) => {
    try {
      setDownloadingBarcodeId(barcode.id);
      const response = await fetch(barcode.barcodeImageUrl, { mode: "cors" });
      if (!response.ok || response.type === "opaque") {
        throw new Error(
          "Failed to fetch image programmatically (possible CORS)"
        );
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${barcode.title.replace(/\s+/g, "_")}_barcode.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading barcode (might be CORS):", err);

      try {
        window.open(barcode.barcodeImageUrl, "_blank", "noopener");

        alert(
          "Could not download file programmatically due to CORS. The image has been opened in a new tab — right-click and save it."
        );
      } catch (e) {
        console.error("Fallback open failed:", e);
        alert(
          "Failed to download or open the image. Please copy this URL and open it in a new tab to save: " +
          barcode.barcodeImageUrl
        );
      }
    } finally {
      setDownloadingBarcodeId(null);
    }
  };

  const handleEdit = (barcode: GeneratedBarcode) => {
    setEditingBarcodeId(barcode.id);
    setEditedData({
      title: barcode.title,
      defaultURL: barcode.defaultURL,
      data: barcode.jsonData.data || [],
    });
  };

  const handleSave = (barcodeId: string) => {
    if (editedData) {
      const apiData = {
        title: editedData.title,
        defaultURL: editedData.defaultURL,
        jsonData: {
          data: editedData.data,
        },
      };
      console.log("Saving edited data:", apiData);
      updateBarcode.mutate({
        barcodeId,
        data: apiData,
      });
    }
  };

  const handleCancel = () => {
    setEditingBarcodeId(null);
    setEditedData(null);
  };

  const updateEditedRule = (ruleIndex: number, field: string, value: any) => {
    setEditedData((prev: any) => ({
      ...prev,
      data: prev.data.map((rule: any, index: number) =>
        index === ruleIndex
          ? {
            ...rule,
            details: {
              ...rule.details,
              [field]: value,
            },
          }
          : rule
      ),
    }));
  };

  const handleDelete = async (barcodeId: string) => {
    if (window.confirm("Are you sure you want to delete this barcode?")) {
      try {
        deleteBarcode.mutate(barcodeId);
      } catch (error) {
        console.error("Error deleting barcode:", error);
      }
    }
  };

  const handleViewScannedDetails = async (barcodeId: string) => {
    try {
      setIsLoading(true);
      const scannedDetails = await axiosInstancetandt.get(
        `/genbarcode/scanned/details/${barcodeId}`
      );
      if (scannedDetails && scannedDetails.data) {
        setScannedDetails(scannedDetails.data.datas || []);
        setSelectedBarcodeForDetails(scannedDetails.data.datas || []);
        setDetailsModalOpen(true);
        console.log("Fetched scanned details:", scannedDetails.data.datas);
      }
    } catch (err) {
      console.error("Error fetching scanned details:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalytics = async (barcodeId: any) => {
    if(!userInfo){
      setShowAuthRegistPopup(true);
      return
    }
    navigate('/analytics', {
      state: { barcodeId }
    });
  };

   const fadeInUp = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: 0.5 },
};

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        <span className="ml-2">Loading generated barcodes...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-red-500 mb-4">
          Error loading barcodes. Please try again.
        </p>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleTryAgain}
        >
          Try Again
        </button>
        {showAuthPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full">
              <div>
                <button
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowAuthPopup(false)}
                >
                  <X className="w-6 h-6" />
                </button>
                <AuthenticationPage />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // if (!companyId || !barcodeLimit.isUserLoggedIn()) {
  //   return (
  //     <div className="text-center py-12">
  //       <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
  //         <Scan className="w-8 h-8 text-gray-400" />
  //       </div>
  //       <h3 className="text-lg font-medium text-gray-900 mb-2">
  //         Login Required
  //       </h3>
  //       <p className="text-gray-500">
  //         Please log in to view your generated barcodes.
  //       </p>
  //     </div>
  //   );
  // }

  if (barcodes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <Scan className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Generated Barcodes
        </h3>
        <p className="text-gray-500">
          You haven't generated any Multi-URL barcodes yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          Generated Barcodes ({barcodes?.length})
        </h3>
        {userInfo && <button
          onClick={() => loadGeneratedBarcodes()}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Refresh
        </button>}
      </div>

       {!(remainingCount > 0) &&
        <div className="flex flex-wrap gap-2 mt-2 mb-4">
          <button onClick={()=>setShowAuthRegistPopup(true)} className="px-3 py-1.5 text-xs font-medium bg-blue-500 text-white rounded-md hover:bg-blue-400 transition cursor-pointer">
            Extend Free Trial
          </button>
          <button  onClick={()=>setShowAuthRegistPopup(true)} className="px-3 py-1.5 text-xs font-medium bg-indigo-500 text-white rounded-md hover:bg-indigo-400 transition cursor-pointer">
            View Analytics
          </button>
          <button
           onClick={() => {navigate("/requestForDemo")}}
            className="px-3 py-1.5 text-xs font-medium bg-emerald-500 text-white rounded-md hover:bg-emerald-400 transition cursor-pointer"
          >
            Request for Demo
          </button>

          <button onClick={() => {navigate("/pricingByBCtype/multiurl")}}  className="px-3 py-1.5 text-xs font-medium bg-sky-500 text-white rounded-md hover:bg-sky-400 transition cursor-pointer">
            View Pricing
          </button>

        </div>
      }

      <div className="space-y-4 grid-cols-3 md:grid md:gap-4">
        {barcodes?.map((barcode) => {
          const isEditing = editingBarcodeId === barcode.id;
          const currentData = isEditing
            ? editedData
            : {
              title: barcode.title,
              defaultURL: barcode.defaultURL,
              data: barcode?.jsonData?.data || [],
            };

    const [containerExpanded, setContainerExpanded] = useState(false);


          return (
            <motion.div {...fadeInUp}
              key={barcode.id}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm h-fit"
            >

              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <img
                    src={barcode.barcodeImageUrl}
                    alt={barcode.title}
                    className="w-16 h-16 object-contain border rounded"
                  />
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">
                      {barcode.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      {getTypeIcon(getSelectedType(barcode))}
                      <span className="text-sm text-gray-500">
                        {getSelectedType(barcode)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => handleSave(barcode.id)}
                        disabled={updateBarcode.isPending}
                        className="px-3 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                      >
                        {updateBarcode.isPending ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-3 py-1.5 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      {/* SCANS BUTTON */}
                      <div className="relative group">
                        <button
                          onClick={() => handleViewScannedDetails(barcode.id)}
                          className="flex items-center justify-center w-9 h-9 bg-green-100 hover:bg-green-200 text-green-700 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={IsLoading}
                        >
                          {IsLoading ? (
                            <div className="w-4 h-4 border-2 border-green-700 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Scan className="w-4 h-4" />
                          )}
                        </button>
                        {/* Tooltip */}
                        <span className="absolute left-1/2 -translate-x-1/2 bottom-[-30px] text-xs bg-gray-800 text-white px-2 py-[2px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                          {IsLoading ? "Loading..." : `${barcode?.scans?.length || 0} Scans`}
                        </span>
                      </div>

                      {/* ANALYTICS BUTTON */}
                      <div className="relative group">
                        <button
                          onClick={() => handleAnalytics(barcode.id)}
                          className="flex items-center justify-center w-9 h-9 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full transition-colors"
                          disabled={IsAnalyticsLoading}
                        >
                          {IsAnalyticsLoading ? (
                            <div className="w-4 h-4 border-2 border-purple-700 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <ChartPie className="w-4 h-4" />
                          )}
                        </button>
                        <span className="absolute left-1/2 -translate-x-1/2 bottom-[-30px] text-xs bg-gray-800 text-white px-2 py-[2px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                          {IsAnalyticsLoading ? "Loading..." : "Analytics"}
                        </span>
                      </div>

                      {/* EDIT BUTTON */}
                      { userInfo &&
                      <div className="relative group">
                        <button
                          onClick={() => handleEdit(barcode)}
                          className="flex items-center justify-center w-9 h-9 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-full transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <span className="absolute left-1/2 -translate-x-1/2 bottom-[-30px] text-xs bg-gray-800 text-white px-2 py-[2px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                          Edit
                        </span>
                      </div>}

                      {/* DOWNLOAD BUTTON */}
                      <div className="relative group">
                        <button
                          onClick={() => handleDownload(barcode)}
                          disabled={downloadingBarcodeId === barcode.id}
                          className={`flex items-center justify-center w-9 h-9 rounded-full transition-colors ${downloadingBarcodeId === barcode.id
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-blue-100 hover:bg-blue-200 text-blue-700"
                            }`}
                        >
                          {downloadingBarcodeId === barcode.id ? (
                            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Download className="w-4 h-4" />
                          )}
                        </button>
                        <span className="absolute left-1/2 -translate-x-1/2 bottom-[-30px] text-xs bg-gray-800 text-white px-2 py-[2px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                          {downloadingBarcodeId === barcode.id ? "Downloading..." : "Download"}
                        </span>
                      </div>
                    </>

                  )}
                </div>
              </div>


              <div className="grid grid-cols-1 gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(barcode.createdAt)}</span>
                </div>
                <div className="flex items-start gap-2">
                  <ExternalLink className="w-4 h-4 mt-0.5" />
                  <div className="flex-1">
                    <div className="break-words text-blue-600 hover:underline">
                      <a
                        href={barcode.defaultURL}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {barcode.defaultURL}
                      </a>
                    </div>
                  </div>
                </div>
              </div>


              <div>
                <div onClick={() => setContainerExpanded(!containerExpanded)} className="flex justify-between items-center mb-3">
                <h5 className="font-medium text-gray-700 ">
                  Conditional Rules
                </h5>

                <div onClick={() => setContainerExpanded(!containerExpanded)} className="cursor-pointer">
                {containerExpanded ?
                <ChevronUp size={22} />
                : <ChevronDown size={22} />}
                </div>
                
                </div>
             { containerExpanded &&  
             <motion.div {...fadeInUp} className="space-y-3">
                  {currentData.data.map((rule: any, index: number) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        {getTypeIcon(rule.type)}
                        <span className="font-semibold text-gray-700">
                          {rule.type} Rule {index + 1}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            URL
                          </label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={rule.details.url || ""}
                              onChange={(e) =>
                                updateEditedRule(index, "url", e.target.value)
                              }
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          ) : (
                            <div className="break-words text-blue-600 hover:underline text-sm">
                              <a
                                href={rule.details.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {rule.details.url}
                              </a>
                            </div>
                          )}
                        </div>

                        {rule.type === "Location" && (
                          <>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">
                                City
                              </label>
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={rule.details.city || ""}
                                  onChange={(e) =>
                                    updateEditedRule(
                                      index,
                                      "city",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              ) : (
                                <span className="text-sm">
                                  {rule.details.city}
                                </span>
                              )}
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">
                                State
                              </label>
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={rule.details.state || ""}
                                  onChange={(e) =>
                                    updateEditedRule(
                                      index,
                                      "state",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              ) : (
                                <span className="text-sm">
                                  {rule.details.state}
                                </span>
                              )}
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">
                                Country
                              </label>
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={rule.details.country || ""}
                                  onChange={(e) =>
                                    updateEditedRule(
                                      index,
                                      "country",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              ) : (
                                <span className="text-sm">
                                  {rule.details.country}
                                </span>
                              )}
                            </div>
                          </>
                        )}

                        {rule.type === "Time" && (
                          <>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">
                                Start Time
                              </label>
                              {isEditing ? (
                                <input
                                  type="time"
                                  value={rule.details.startTime || ""}
                                  onChange={(e) =>
                                    updateEditedRule(
                                      index,
                                      "startTime",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              ) : (
                                <span className="text-sm">
                                  {rule.details.startTime}
                                </span>
                              )}
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">
                                End Time
                              </label>
                              {isEditing ? (
                                <input
                                  type="time"
                                  value={rule.details.endTime || ""}
                                  onChange={(e) =>
                                    updateEditedRule(
                                      index,
                                      "endTime",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              ) : (
                                <span className="text-sm">
                                  {rule.details.endTime}
                                </span>
                              )}
                            </div>
                          </>
                        )}

                        {rule.type === "Language" && (
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">
                              Language
                            </label>
                            {isEditing ? (
                              <input
                                type="text"
                                value={rule.details.language || ""}
                                onChange={(e) =>
                                  updateEditedRule(
                                    index,
                                    "language",
                                    e.target.value
                                  )
                                }
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            ) : (
                              <span className="text-sm">
                                {rule.details.language}
                              </span>
                            )}
                          </div>
                        )}

                        {rule.type === "Number of scans" && (
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">
                              Max Scans
                            </label>
                            {isEditing ? (
                              <input
                                type="number"
                                value={rule.details.noOfScan || ""}
                                onChange={(e) =>
                                  updateEditedRule(
                                    index,
                                    "noOfScan",
                                    e.target.value
                                  )
                                }
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            ) : (
                              <span className="text-sm">
                                {rule.details.noOfScan}
                              </span>
                            )}
                          </div>
                        )}

                        {rule.type === "Geo-fencing" && (
                          <>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">
                                Latitude
                              </label>
                              {isEditing ? (
                                <input
                                  type="number"
                                  step="any"
                                  value={rule.details.latitude || ""}
                                  onChange={(e) =>
                                    updateEditedRule(
                                      index,
                                      "latitude",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              ) : (
                                <span className="text-sm">
                                  {rule.details.latitude}
                                </span>
                              )}
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">
                                Longitude
                              </label>
                              {isEditing ? (
                                <input
                                  type="number"
                                  step="any"
                                  value={rule.details.longitude || ""}
                                  onChange={(e) =>
                                    updateEditedRule(
                                      index,
                                      "longitude",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              ) : (
                                <span className="text-sm">
                                  {rule.details.longitude}
                                </span>
                              )}
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">
                                Radius (m)
                              </label>
                              {isEditing ? (
                                <input
                                  type="number"
                                  value={rule.details.radiusInMeter || ""}
                                  onChange={(e) =>
                                    updateEditedRule(
                                      index,
                                      "radiusInMeter",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              ) : (
                                <span className="text-sm">
                                  {rule.details.radiusInMeter}m
                                </span>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </motion.div>}

              </div>
            </motion.div>
          );
        })}
      </div>
      <ScannedDetailsModal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(!detailsModalOpen)}
        barcodeTitle={""}
        scanData={selectedBarcodeForDetails || []}
        isLoading={IsLoading}
      />

      <AuthPopup
        show={showAuthRegistPopup}
        onClose={() => setShowAuthRegistPopup(false)}

      />
    </div>
  );
};

export default GeneratedBarcodes;
