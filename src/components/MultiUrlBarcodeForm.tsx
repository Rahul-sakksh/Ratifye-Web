import React, { useState, useMemo, useEffect } from "react";
import { Country, State, City } from "country-state-city";
import { Plus, X } from "lucide-react";
import QRTypeSelector from "./QRTypeSelector";
import GeneratedBarcodes from "./GeneratedBarcodes";
import {
  useBarcodeGeneration,
} from "../services/companyApi";
import BarcodeLimitIndicator from "./BarcodeLimitIndicator";
import barcodeLimit from "../utils/barcodeLimit";
import { getGuestId } from "../utils/browserFingerprint";
import { storeGuestBarcode } from "../utils/guestBarcodeStorage";
import AuthPopup from "./authPopup";

export interface LocationData {
  id: string;
  url: string;
  country: string;
  state: string;
  city: string;
}

export interface NoOfScanData {
  id: string;
  url: string;
  noOfScan?: string;
}

export interface TimeData {
  id: string;
  url: string;
  startTime?: string;
  endTime?: string;
}

export interface GeoFencingData {
  id: string;
  url: string;
  latitude?: string;
  longitude?: string;
  radiusInMeter?: string;
}

export interface LanguageData {
  id: string;
  url: string;
  language: string;
}

export interface DeviceData {
  id: string;
  url: string;
  device: string;
}

export interface FormState {
  defaultURL: string;
  selectedType: string;
  locations: LocationData[];
  noOfScanData: NoOfScanData[];
  time: TimeData[];
  geoFencing: GeoFencingData[];
  language: LanguageData[];
  device: DeviceData[];
  qrType: string;
  barcodeName: string;
}

interface MultiUrlBarcodeProps {
  onGenerate: (data: any) => void;
  loading?: boolean;
  title?: boolean;
  activeTAB?: (tab: "create" | "generated") => void;
}

const initialState: FormState = {
  defaultURL: "",
  selectedType: "Location",
  locations: [{ id: "1", url: "", country: "", state: "", city: "" }],
  noOfScanData: [{ id: "1", url: "", noOfScan: "" }],
  time: [{ id: "1", url: "", startTime: "", endTime: "" }],
  geoFencing: [
    { id: "1", url: "", latitude: "", longitude: "", radiusInMeter: "" },
  ],
  language: [{ id: "1", url: "", language: "" }],
  device: [{ id: "1", url: "", device: "" }],
  qrType: "static",
  barcodeName: "",
};

const languages = ["English", "Hindi", "Spanish", "French", "German"];
const devices = ["Android", "iPhone"];

const MultiUrlBarcode: React.FC<MultiUrlBarcodeProps> = ({
  onGenerate,
  loading = false,
  title = true,
  activeTAB

}) => {
  const [form, setForm] = useState<FormState>({ ...initialState });
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [barcodeImageUrl, setBarcodeImageUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);


  const [activeTab, setActiveTab] = useState<"create" | "generated">("create");


  const { remainingCount } = barcodeLimit.getLimitStatus('multiurl');

  useEffect(() => {
    setActiveTab(remainingCount > 0 ? "create" : "generated");
  }, [remainingCount]);

  useEffect(() => {
    activeTAB?.(activeTab);
  }, [activeTab]);


  const fadeInUp = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: 0.5 },
  };


  // Barcode generation hook
  const barcodeGeneration = useBarcodeGeneration({
    onSuccess: (response) => {
      console.log("Barcode generated successfully:", response.data?.record);

      const isLoggedIn = barcodeLimit.isUserLoggedIn();
      const userInfo = barcodeLimit.getUserInfo();

      // Log success for both logged-in and guest users
      if (isLoggedIn && userInfo) {
        console.log(`✅ Barcode generated for user: ${userInfo.companyName}`);
        // Switch to generated barcodes tab for logged-in users
        setActiveTab("generated");
      } else {
        const guestId = getGuestId();
        console.log(
          `✅ Barcode generated for guest user: ${guestId} (${barcodeLimit.getCount('multiurl')}/${3} free generations used)`
        );

        // Store barcode locally for guest users
        if (response.data.record.barcodeImageUrl) {
          storeGuestBarcode({
            barcodeImageUrl: response.data.record.barcodeImageUrl,
            title: form.barcodeName,
            qrType: form.qrType,
            selectedType: form.selectedType,
            defaultURL: form.defaultURL,
            data: response.data.record,
            jsonData: response.data.record.jsonData,
          });
        }
      }




      setForm({ ...initialState });

      if (response.data.record.barcodeImageUrl) {
        setImageLoading(true);
        setBarcodeImageUrl(response.data.record.barcodeImageUrl);

        onGenerate({
          barcodeImageUrl: response.data.record.barcodeImageUrl,
          success: true,
          data: response.data.record,
          isGuest: !isLoggedIn,
        });
      }

      // Show toast notification
      setShowToast(true);

      // Hide toast after 3 seconds
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    },
    onError: (error) => {
      console.error("Barcode generation failed:", error);
      // Handle error - could show error message
    },
  });



  const Types = [
    "Location",
    "Number of scans",
    "Time",
    "Language",
    "Geo-fencing",
    "Device",
  ];

  const allCountries = Country.getAllCountries().map((c) => ({
    name: c.name,
    isoCode: c.isoCode,
  }));

  const getStates = (countryCode: string) =>
    State.getStatesOfCountry(countryCode).map((s) => ({
      name: s.name,
      isoCode: s.isoCode,
    }));

  const getCities = (countryCode: string, stateCode: string) =>
    City.getCitiesOfState(countryCode, stateCode).map((c) => c.name);

  const handleChange = (name: keyof FormState, value: any) =>
    setForm((prev) => ({ ...prev, [name]: value }));

  const handleQRTypeChange = (type: string) => {
    if (type === "dynamic") {
      if (barcodeLimit.isUserLoggedIn()) {
        handleChange("qrType", type);
      } else {
        setShowAuthPopup(true);
      }
    } else {
      handleChange("qrType", type);
    }
  };



  const addItem = (type: string) => {
    const id = Date.now().toString();
    switch (type) {
      case "Location":
        setForm((prev) => ({
          ...prev,
          locations: [
            ...prev.locations,
            { id, url: "", country: "", state: "", city: "" },
          ],
        }));
        break;
      case "Number of scans":
        setForm((prev) => ({
          ...prev,
          noOfScanData: [...prev.noOfScanData, { id, url: "", noOfScan: "" }],
        }));
        break;
      case "Time":
        setForm((prev) => ({
          ...prev,
          time: [...prev.time, { id, url: "", startTime: "", endTime: "" }],
        }));
        break;
      case "Language":
        setForm((prev) => ({
          ...prev,
          language: [...prev.language, { id, url: "", language: "" }],
        }));
        break;
      case "Geo-fencing":
        setForm((prev) => ({
          ...prev,
          geoFencing: [
            ...prev.geoFencing,
            { id, url: "", latitude: "", longitude: "", radiusInMeter: "" },
          ],
        }));
        break;
      case "Device":
        setForm((prev) => ({
          ...prev,
          device: [...prev.device, { id, url: "", device: "" }],
        }));
        break;
    }
  };

  const removeItem = (type: string, id: string) => {
    setForm((prev) => {
      const copy = { ...prev };
      switch (type) {
        case "Location":
          copy.locations = copy.locations.filter((i) => i.id !== id);
          break;
        case "Number of scans":
          copy.noOfScanData = copy.noOfScanData.filter((i) => i.id !== id);
          break;
        case "Time":
          copy.time = copy.time.filter((i) => i.id !== id);
          break;
        case "Language":
          copy.language = copy.language.filter((i) => i.id !== id);
          break;
        case "Geo-fencing":
          copy.geoFencing = copy.geoFencing.filter((i) => i.id !== id);
          break;
        case "Device":
          copy.device = copy.device.filter((i) => i.id !== id);
          break;
      }
      return copy;
    });
  };

  const updateItem = (
    type: string,
    id: string,
    field: string,
    value: string
  ) => {
    setForm((prev) => {
      const copy = { ...prev };
      switch (type) {
        case "Location":
          copy.locations = copy.locations.map((i) =>
            i.id === id
              ? {
                ...i,
                [field]: value,
                ...(field === "country" ? { state: "", city: "" } : {}),
              }
              : i
          );
          break;
        case "Number of scans":
          copy.noOfScanData = copy.noOfScanData.map((i) =>
            i.id === id ? { ...i, [field]: value } : i
          );
          break;
        case "Time":
          copy.time = copy.time.map((i) =>
            i.id === id ? { ...i, [field]: value } : i
          );
          break;
        case "Language":
          copy.language = copy.language.map((i) =>
            i.id === id ? { ...i, [field]: value } : i
          );
          break;
        case "Geo-fencing":
          copy.geoFencing = copy.geoFencing.map((i) =>
            i.id === id ? { ...i, [field]: value } : i
          );
          break;
        case "Device":
          copy.device = copy.device.map((i) =>
            i.id === id ? { ...i, [field]: value } : i
          );
          break;
      }
      return copy;
    });
  };

  const isDisabled = useMemo(() => {
    if (!form.defaultURL || !form.selectedType || form.barcodeName.trim() == "")
      return true;

    // Check barcode generation limit for static Multi-URL barcodes
    const isStaticBarcode = form.qrType === "static";
    const isLoggedIn = barcodeLimit.isUserLoggedIn();

    if (isStaticBarcode && !isLoggedIn && !barcodeLimit.canGenerateStatic('multiurl')) {
      return true;
    }

    switch (form.selectedType) {
      case "Location":
        return form.locations.some(
          (l) => !l.url || !l.country || !l.state || !l.city
        );
      case "Number of scans":
        return form.noOfScanData.some((l) => !l.url || !l.noOfScan);
      case "Time":
        return form.time.some((t) => !t.url || !t.startTime || !t.endTime);
      case "Language":
        return form.language.some((l) => !l.url || !l.language);
      case "Geo-fencing":
        return form.geoFencing.some(
          (g) => !g.url || !g.latitude || !g.longitude || !g.radiusInMeter
        );
      case "Device":
        return form.device.some((d) => !d.url || !d.device);
      default:
        return true;
    }
  }, [form]);

  const handleSubmit = () => {
    const isStaticBarcode = form.qrType === "static";
    const isLoggedIn = barcodeLimit.isUserLoggedIn();

    if (isStaticBarcode && !isLoggedIn) {
      if (!barcodeLimit.canGenerateStatic('multiurl')) {
        const { message } = barcodeLimit.getLimitStatus('multiurl');
        alert(
          `Generation Limit Reached: ${message} Please register or login to continue generating Multi-URL barcodes.`
        );
        return;
      }
    }

    let qrData: any;
    switch (form.selectedType) {
      case "Location":
        qrData = {
          data: form.locations.map((loc) => ({
            type: "Location",
            details: {
              url: loc.url,
              city: loc.city,
              state: loc.state,
              country: loc.country,
            },
          })),
          title: form.barcodeName,
          defaultURL: form.defaultURL,
        };
        break;
      case "Number of scans":
        qrData = {
          data: form.noOfScanData.map((scan) => ({
            type: "Number of scans",
            details: {
              url: scan.url,
              noOfScan: scan.noOfScan,
            },
          })),
          title: form.barcodeName,
          defaultURL: form.defaultURL,
        };
        break;
      case "Time":
        qrData = {
          data: form.time.map((time) => ({
            type: "Time",
            details: {
              url: time.url,
              startTime: time.startTime,
              endTime: time.endTime,
            },
          })),
          title: form.barcodeName,
          defaultURL: form.defaultURL,
        };
        break;
      case "Language":
        qrData = {
          data: form.language.map((lang) => ({
            type: "Language",
            details: {
              url: lang.url,
              language: lang.language,
            },
          })),
          title: form.barcodeName,
          defaultURL: form.defaultURL,
        };
        break;
      case "Geo-fencing":
        qrData = {
          data: form.geoFencing.map((geo) => ({
            type: "Geo-fencing",
            details: {
              url: geo.url,
              latitude: geo.latitude,
              longitude: geo.longitude,
              radiusInMeter: geo.radiusInMeter,
            },
          })),
          title: form.barcodeName,
          defaultURL: form.defaultURL,
        };
        break;
      case "Device":
        qrData = {
          data: form.device.map((device) => ({
            type: "Device",
            details: {
              url: device.url,
              device: device.device,
            },
          })),
          title: form.barcodeName,
          defaultURL: form.defaultURL,
        };
        break;
      default:
        qrData = {
          data: [],
          title: form.barcodeName,
          defaultURL: form.defaultURL,
        };
    }

    if (isStaticBarcode && !isLoggedIn) {
      barcodeLimit.incrementCount('multiurl');
    }
    console.log(qrData, "Submitted Data");

    // Log multi-URL barcode generation with user info
    const userInfo = barcodeLimit.getUserInfo();
    if (isLoggedIn && userInfo) {
      console.log(
        `📊 Multi-URL Barcode Generated: ${userInfo.companyName} (${userInfo.companyEmail}) generated ${form.selectedType} type barcode`
      );
      console.log(`📱 Barcode Details:`, {
        name: form.barcodeName,
        type: form.selectedType,
        qrType: form.qrType,
        defaultURL: form.defaultURL,
        data: qrData,
      });
    } else {
      console.log(
        `📊 Multi-URL Barcode Generated: Anonymous user (${barcodeLimit.getCount('multiurl')}/3 free generations used)`
      );
    }

    // Get logged-in user details from localStorage
    const userSession = localStorage.getItem("userSession");
    let parsedUserInfo = null;

    try {
      parsedUserInfo = userSession ? JSON.parse(userSession) : null;
    } catch (error) {
      console.error("Error parsing user session:", error);
    }

    // Get guest ID for non-logged users
    const guestId = !isLoggedIn ? getGuestId() : null;

    // Log API call details
    if (isLoggedIn && parsedUserInfo) {
      console.log(
        `🚀 Calling API for logged user: ${parsedUserInfo.companyName} (ID: ${parsedUserInfo.id})`
      );
    } else {
      console.log(`🚀 Calling API for guest user: ${guestId}`);
    }

    barcodeGeneration.mutate({
      defaultURL: qrData.defaultURL,
      data: qrData.data,
      title: qrData.title,
      fromWeb: 1,
      loggedIn: isLoggedIn ? 1 : 0,
      companyId: parsedUserInfo ? parsedUserInfo.id : null,
      companyJson: parsedUserInfo ? parsedUserInfo : null,
      qrType: form.qrType,
      guestId: guestId,
    });

    onGenerate(qrData);
  };

  const getAvailableDevices = (currentDeviceId: any) => {
    const selectedDevices = form.device
      .filter((item) => item.id !== currentDeviceId) // Exclude current device
      .map((item) => item.device)
      .filter((device) => device !== ""); // Filter out empty selections

    return devices.filter((device) => !selectedDevices.includes(device));
  };

  const renderRemoveButton = (index: number, type: string, id: string) => {
    if (index === 0) return null;
    return (
      <button
        type="button"
        className="text-red-500 hover:text-red-700 ml-2"
        onClick={() => removeItem(type, id)}
      >
        <X size={20} />
      </button>
    );
  };

  const containerStyle = "p-4 rounded shadow-md bg-gray-50";
  const inputStyle =
    "w-full border border-gray-300 p-2 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400";

  return (
    <div className="bg-white   mx-auto w-full">
      {title && <h2 className="text-2xl font-bold mb-6">Multi URL QR Generator</h2>
      }
      {/* Tab Navigation - only show for logged-in users */}
      {/* {barcodeLimit.isUserLoggedIn() && ( */}
      <div className="flex border-b border-gray-200 mb-6">
        {remainingCount > 0 && <button
          onClick={() => setActiveTab("create")}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${activeTab === "create"
            ? "border-black text-black"
            : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
        >
          Create New Barcode
        </button>}
        <button
          onClick={() => setActiveTab("generated")}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${activeTab === "generated"
            ? "border-black text-black"
            : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
        >
          Generated Barcodes
        </button>
      </div>
      {/* )} */}

      {/* Content based on active tab */}
      {activeTab === "create" ? (
        <div>
          <QRTypeSelector qrType={form.qrType} setQRType={handleQRTypeChange} />

          {/* Barcode Limit Indicator for non-logged-in users */}
          <BarcodeLimitIndicator
            className="mb-4"
            onLogout={() => {
              // Reset QR type to static when user logs out
              handleChange("qrType", "static");
            }}
            type="multiurl"
          />

          {/* Barcode Generation Error Display */}
          {barcodeGeneration.isError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              <p className="text-sm">
                Barcode generation failed:{" "}
                {barcodeGeneration.error?.message || "Please try again"}
              </p>
            </div>
          )}

          <div className="flex-1 mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Barcode Name<span className="text-red-500 pl-[1px]">*</span>
            </label>
            <input
              type="text"
              value={form.barcodeName}
              onChange={(e) => handleChange("barcodeName", e.target.value)}
              className="w-full h-12 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter Barcode Name"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 mb-6">
            <div>
              <label className="block font-medium mb-1">
                Type<span className="text-red-500 pl-[1px]">*</span>
              </label>
              <select
                className={`${inputStyle} appearance-none`}
                value={form.selectedType}
                onChange={(e) => handleChange("selectedType", e.target.value)}
              >
                {Types.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {form.selectedType && (
              <div>
                <label className="block font-medium mb-1">
                  Default URL<span className="text-red-500 pl-[1px]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter default URL"
                  className={inputStyle}
                  value={form.defaultURL}
                  onChange={(e) => handleChange("defaultURL", e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="space-y-4">
            {/* LOCATION */}
            {form.selectedType === "Location" &&
              form.locations.map((loc, idx) => {
                const states = loc.country ? getStates(loc.country) : [];
                const cities =
                  loc.country && loc.state
                    ? getCities(loc.country, loc.state)
                    : [];
                return (
                  <div key={loc.id} className={containerStyle}>
                    <div className="flex justify-between items-center mb-2">
                      <label className="font-semibold">
                        Location Rule {idx + 1}
                      </label>
                      {renderRemoveButton(idx, "Location", loc.id)}
                    </div>
                    <input
                      type="text"
                      placeholder="Enter URL"
                      value={loc.url}
                      onChange={(e) =>
                        updateItem("Location", loc.id, "url", e.target.value)
                      }
                      className={inputStyle}
                    />
                    <select
                      value={loc.country}
                      onChange={(e) =>
                        updateItem(
                          "Location",
                          loc.id,
                          "country",
                          e.target.value
                        )
                      }
                      className={inputStyle}
                    >
                      <option value="">Select Country</option>
                      {allCountries.map((c) => (
                        <option key={c.isoCode} value={c.isoCode}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <select
                      value={loc.state}
                      onChange={(e) =>
                        updateItem("Location", loc.id, "state", e.target.value)
                      }
                      className={inputStyle}
                    >
                      <option value="">Select State</option>
                      {states.map((s) => (
                        <option key={s.isoCode} value={s.isoCode}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                    <select
                      value={loc.city}
                      onChange={(e) =>
                        updateItem("Location", loc.id, "city", e.target.value)
                      }
                      className={inputStyle}
                    >
                      <option value="">Select City</option>
                      {cities.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              })}
            {form.selectedType === "Location" && (
              <button
                className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                onClick={() => addItem("Location")}
              >
                <Plus size={16} /> Add Location
              </button>
            )}

            {/* NUMBER OF SCANS */}
            {form.selectedType === "Number of scans" &&
              form.noOfScanData.map((item, idx) => (
                <div key={item.id} className={containerStyle}>
                  <div className="flex justify-between items-center mb-2">
                    <label className="font-semibold">Scan Rule {idx + 1}</label>
                    {renderRemoveButton(idx, "Number of scans", item.id)}
                  </div>
                  <input
                    type="text"
                    placeholder="Enter URL"
                    value={item.url}
                    onChange={(e) =>
                      updateItem(
                        "Number of scans",
                        item.id,
                        "url",
                        e.target.value
                      )
                    }
                    className={inputStyle}
                  />
                  <input
                    type="number"
                    placeholder="Enter number of scans"
                    value={item.noOfScan}
                    onChange={(e) =>
                      updateItem(
                        "Number of scans",
                        item.id,
                        "noOfScan",
                        e.target.value
                      )
                    }
                    className={inputStyle}
                  />
                </div>
              ))}
            {form.selectedType === "Number of scans" && (
              <button
                className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                onClick={() => addItem("Number of scans")}
              >
                <Plus size={16} /> Add Scan Rule
              </button>
            )}

            {/* TIME */}
            {form.selectedType === "Time" &&
              form.time.map((item, idx) => (
                <div key={item.id} className={containerStyle}>
                  <div className="flex justify-between items-center mb-2">
                    <label className="font-semibold">Time Rule {idx + 1}</label>
                    {renderRemoveButton(idx, "Time", item.id)}
                  </div>
                  <input
                    type="text"
                    placeholder="Enter URL"
                    value={item.url}
                    onChange={(e) =>
                      updateItem("Time", item.id, "url", e.target.value)
                    }
                    className={inputStyle}
                  />

                  <label className="mb-1 font-medium">Start Time</label>
                  <input
                    type="time"
                    value={item.startTime}
                    onChange={(e) =>
                      updateItem("Time", item.id, "startTime", e.target.value)
                    }
                    className={inputStyle}
                  />
                  <label className="mb-1 font-medium">End Time</label>
                  <input
                    type="time"
                    placeholder="End Time"
                    value={item.endTime}
                    onChange={(e) =>
                      updateItem("Time", item.id, "endTime", e.target.value)
                    }
                    className={inputStyle}
                  />
                </div>
              ))}
            {form.selectedType === "Time" && (
              <button
                className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                onClick={() => addItem("Time")}
              >
                <Plus size={16} /> Add Time Rule
              </button>
            )}

            {/* LANGUAGE */}
            {form.selectedType === "Language" &&
              form.language.map((item, idx) => (
                <div key={item.id} className={containerStyle}>
                  <div className="flex justify-between items-center mb-2">
                    <label className="font-semibold">
                      Language Rule {idx + 1}
                    </label>
                    {renderRemoveButton(idx, "Language", item.id)}
                  </div>
                  <input
                    type="text"
                    placeholder="Enter URL"
                    value={item.url}
                    onChange={(e) =>
                      updateItem("Language", item.id, "url", e.target.value)
                    }
                    className={inputStyle}
                  />
                  <select
                    value={item.language}
                    onChange={(e) =>
                      updateItem(
                        "Language",
                        item.id,
                        "language",
                        e.target.value
                      )
                    }
                    className={inputStyle}
                  >
                    <option value="">Select Language</option>
                    {languages.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            {form.selectedType === "Language" && (
              <button
                className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                onClick={() => addItem("Language")}
              >
                <Plus size={16} /> Add Language Rule
              </button>
            )}

            {/* GEO-FENCING */}
            {form.selectedType === "Geo-fencing" &&
              form.geoFencing.map((item, idx) => (
                <div key={item.id} className={containerStyle}>
                  <div className="flex justify-between items-center mb-2">
                    <label className="font-semibold">
                      Geo-fencing Rule {idx + 1}
                    </label>
                    {renderRemoveButton(idx, "Geo-fencing", item.id)}
                  </div>
                  <input
                    type="text"
                    placeholder="Enter URL"
                    value={item.url}
                    onChange={(e) =>
                      updateItem("Geo-fencing", item.id, "url", e.target.value)
                    }
                    className={inputStyle}
                  />
                  <input
                    type="text"
                    placeholder="Latitude"
                    value={item.latitude}
                    onChange={(e) =>
                      updateItem(
                        "Geo-fencing",
                        item.id,
                        "latitude",
                        e.target.value
                      )
                    }
                    className={inputStyle}
                  />
                  <input
                    type="text"
                    placeholder="Longitude"
                    value={item.longitude}
                    onChange={(e) =>
                      updateItem(
                        "Geo-fencing",
                        item.id,
                        "longitude",
                        e.target.value
                      )
                    }
                    className={inputStyle}
                  />
                  <input
                    type="number"
                    placeholder="Radius (meters)"
                    value={item.radiusInMeter}
                    onChange={(e) =>
                      updateItem(
                        "Geo-fencing",
                        item.id,
                        "radiusInMeter",
                        e.target.value
                      )
                    }
                    className={inputStyle}
                  />
                </div>
              ))}

            {form.selectedType === "Geo-fencing" && (
              <button
                type="button"
                className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 mt-2"
                onClick={() => addItem("Geo-fencing")}
              >
                <Plus size={16} /> Add Geo-fencing Rule
              </button>
            )}

            {/* DEVICE */}
            {form.selectedType === "Device" &&
              form.device.map((item, idx) => {
                const availableDevices = getAvailableDevices(item.id);

                return (
                  <div key={item.id} className={containerStyle}>
                    <div className="flex justify-between items-center mb-2">
                      <label className="font-semibold">
                        Device Rule {idx + 1}
                      </label>
                      {renderRemoveButton(idx, "Device", item.id)}
                    </div>
                    <input
                      type="text"
                      placeholder="Enter URL"
                      value={item.url}
                      onChange={(e) =>
                        updateItem("Device", item.id, "url", e.target.value)
                      }
                      className={inputStyle}
                    />
                    <select
                      value={item.device}
                      onChange={(e) =>
                        updateItem("Device", item.id, "device", e.target.value)
                      }
                      className={inputStyle}
                    >
                      <option value="">Select Device</option>
                      {availableDevices.map((device) => (
                        <option key={device} value={device}>
                          {device}
                        </option>
                      ))}
                    </select>

                    {/* Show message when no devices available */}
                    {availableDevices.length === 0 && item.device === "" && (
                      <p className="text-red-500 text-sm mt-1">
                        All devices have been selected in other rules
                      </p>
                    )}
                  </div>
                );
              })}

            {form.selectedType === "Device" && (
              <button
                type="button"
                className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 mt-2"
                onClick={() => addItem("Device")}
              >
                <Plus size={16} /> Add Device Rule
              </button>
            )}
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              onClick={handleSubmit}
              disabled={loading || isDisabled || barcodeGeneration.isPending}
              className={`w-full py-3 px-4 rounded-md text-white font-medium ${loading || isDisabled || barcodeGeneration.isPending
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#1F4B73] hover:bg-gray-800"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors`}
            >
              {loading || barcodeGeneration.isPending ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Generating...
                </span>
              ) : (
                "Generate Barcode"
              )}
            </button>
          </div>


          {showAuthPopup && (
            <AuthPopup
              show={showAuthPopup}
              onClose={() => setShowAuthPopup(false)}

            />
          )}

          {/* Toast Notification */}
          {showToast && (
            <div className="fixed top-4 right-4 z-50 transform transition-all duration-300 ease-in-out">
              <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="font-medium">
                  Barcode generated successfully!
                </span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <GeneratedBarcodes
          onViewBarcode={(barcode) => {
            setActiveTab("create");
            console.log("Viewing barcode:", barcode);
          }}

        />
      )}
    </div>
  );
};

export default MultiUrlBarcode;
