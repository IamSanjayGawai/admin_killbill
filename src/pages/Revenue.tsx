
import { useState } from "react";
import { useEffect } from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import Modal from "../components/Modal";
import Tabs from "../components/Tabs";
import getMediaType from "../utils/mediatype"
import axios from "axios";
import { Plus, Edit, Trash2, Coins as CoinsIcon } from "lucide-react";
import EntryEffectRenderer from "../components/EntryEffectRenderer";
import LottieThumbnail from "../components/LottieThumbnail";



type NewPackage = {
  _id: string
  title: string;
  coins: string;
  price: string;
  bonus: string;
  offerId?: string | null;
  offer?: any; // Offer details from backend
  originalPrice?: number;
  finalPrice?: number;
  hasOffer?: boolean;
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

type Gift = {
  _id: string;
  name: string;
  price: number;
  icon: string;
  newIconFile?: File;
  offerId?: string | null;
  offer?: any;
  originalPrice?: number;
  finalPrice?: number;
  hasOffer?: boolean;
};

type Offer = {
  _id: string;
  title: string;
  discountType: 'PERCENT' | 'FLAT' | 'BONUS';
  discountValue: number;
  discountAmount?: number;
  discountPercentage?: number;
  appliesTo?: string[];
};

type PreviewModalProps = {
  open: boolean;
  onClose: () => void;
  fileUrl?: string;
  type?: "image" | "video" | "lottie";
  animation?: { url: string; type: "LOTTIE" | "GIF" | "VIDEO" } | null;
};




export default function Revenue() {
  // ---------------- Modal States ----------------
  const [isCoinModalOpen, setIsCoinModalOpen] = useState(false);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editOffer, setEditOffer] = useState("");
  const [isEntryEffectModalOpen, setIsEntryEffectModalOpen] = useState(false);
  const [isEditGiftModalOpen, setIsEditGiftModalOpen] = useState(false);
  const [isDeleteGiftModalOpen, setIsDeleteGiftModalOpen] = useState(false);

  // ---------------- Selected Items ----------------
  const [selectedGift, setSelectedGift] = useState<any>(null);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);

  // ---------------- Gift Management ----------------
  const [gifts, setGifts] = useState<Gift[]>([]);

  const [newGiftName, setNewGiftName] = useState("");
  const [newGiftPrice, setNewGiftPrice] = useState("");
  const [newGiftIcon, setNewGiftIcon] = useState("");

  // ---------------- Coin Packages ----------------

  const [newPackage, setNewPackage] = useState<NewPackage>({
    title: "",
    coins: "",
    price: "",
    bonus: "",
    offerId: null,
    _id: "",
  });


  // ---------------- Coin Packages ----------------

  const [coinPackages, setCoinPackages] = useState<NewPackage[]>([]);
  const [availableOffers, setAvailableOffers] = useState<Offer[]>([]);

  const [editPackage, setEditPackage] = useState("");

  const [editCoinCount, setEditCoinCount] = useState("");
  const [editCoinPrice, setEditCoinPrice] = useState("");


  // ---------------- Entry Effects ----------------
  const [entryEffects, setEntryEffects] = useState<any[]>([]);
  const [isEditEntryEffectModalOpen, setIsEditEntryEffectModalOpen] = useState(false);
  const [isDeleteEntryEffectModalOpen, setIsDeleteEntryEffectModalOpen] = useState(false);
  const [newEffectPackages, setNewEffectPackages] = useState({
    days7: "",
    days30: "",
    days90: "",
    days365: "",
  });
  const [newEffectOffer, setNewEffectOffer] = useState("");

  const [newEffectFile, setNewEffectFile] = useState<File | null>(null);
  const [newEffectPreview, setNewEffectPreview] = useState("");

  const [newEffectName, setNewEffectName] = useState("");
  const [newGiftIconFile, setNewGiftIconFile] = useState<File | null>(null);
  const [selectedEffect, setSelectedEffect] = useState<any>(null);

  const [newEffectCoins, setNewEffectCoins] = useState("");


  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);


  // Preview Modal State
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState("");
  const [previewType, setPreviewType] = useState<"image" | "video" | "lottie">("image");
  const [previewAnimation, setPreviewAnimation] = useState<{ url: string; type: "LOTTIE" | "GIF" | "VIDEO" } | null>(null);


  // Generate validity packages based on entry effect base price (matches frontend logic)
  const generateValidityPackages = (basePrice: number) => {
    if (!basePrice || basePrice <= 0) {
      basePrice = 100; // Default fallback
    }
    
    return [
      { 
        id: 1, 
        coins: Math.round(basePrice * 3), 
        days: '7 Days', 
        validityDays: 7, 
        discount: 0,
        off: '0% Off' 
      },
      { 
        id: 2, 
        coins: Math.round(basePrice * 5), 
        days: '30 Days', 
        validityDays: 30, 
        discount: 10,
        off: '10% Off' 
      },
      { 
        id: 3, 
        coins: Math.round(basePrice * 8), 
        days: '90 Days', 
        validityDays: 90, 
        discount: 15,
        off: '15% Off' 
      },
      { 
        id: 4, 
        coins: Math.round(basePrice * 10), 
        days: '365 Days', 
        validityDays: 365, 
        discount: 20,
        off: '20% Off' 
      },
    ];
  };

  // ---------------- Entry Effect Functions ----------------
  const handleAddEntryEffect = async () => {
    if (!newEffectName || !newEffectFile || !newEffectCoins) {
      alert("Please provide name, coins, and a file!");
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");

      const formData = new FormData();
      formData.append("title", newEffectName);
      formData.append("price", newEffectCoins);
      
      // Add validity packages if provided
      const packages: any = {};
      if (newEffectPackages.days7) packages.days7 = newEffectPackages.days7;
      if (newEffectPackages.days30) packages.days30 = newEffectPackages.days30;
      if (newEffectPackages.days90) packages.days90 = newEffectPackages.days90;
      if (newEffectPackages.days365) packages.days365 = newEffectPackages.days365;
      
      if (Object.keys(packages).length > 0) {
        formData.append("validityPackages", JSON.stringify(packages));
      }
      
      formData.append("animation", newEffectFile); // must match multer field

      const response = await axios.post(
        "http://localhost:4000/api/admin/entry-effects/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Type guard to ensure response.data shape
      const data = response.data as { success?: boolean; data?: any };

      if (data && data.success) {
        // Add the new effect from backend response to frontend state
        setEntryEffects((prev) => [...prev, data.data]);

        // Reset form
        setNewEffectName("");
        setNewEffectFile(null);
        setNewEffectPreview("");
        setNewEffectCoins("");
        setNewEffectPackages({ days7: "", days30: "", days90: "", days365: "" });
        setIsEntryEffectModalOpen(false);

        alert("Entry effect created successfully!");
      }
    } catch (error: any) {
      console.error("Error creating entry effect:", error);
      alert(error.response?.data?.message || "Failed to create entry effect");
    }
  };


  const handleEditOpen = (pkg: any) => {
    setSelectedPackage(pkg);
    setEditPackage(pkg.title); // ✅ title not package
    setEditCoinCount(String(pkg.coins));
    setEditCoinPrice(String(pkg.price));
    setEditOffer(pkg.offerId || "");
    setIsEditModalOpen(true);
  };

  // coins packages................

  const handleAddCoinPackage = async () => {
    if (!newPackage.title || !newPackage.coins || !newPackage.price) {
      return alert("Please fill all fields!");
    }

    try {
      const token = localStorage.getItem("adminToken");
      console.log("token", token);
      const response = await axios.post<ApiResponse<any>>(
        "http://localhost:4000/api/admin/coin-packages",
        {
          title: newPackage.title,
          coins: Number(newPackage.coins),
          price: Number(newPackage.price),
          bonus: Number(newPackage.bonus || 0),
          offerId: newPackage.offerId || null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        // Refresh the list to get offer calculations from backend
        await fetchCoinPackages();
        setIsCoinModalOpen(false);
        setNewPackage({ title: "", coins: "", price: "", bonus: "", offerId: null, _id: "", });
        alert("Coin package created successfully!");
      }
    } catch (error: any) {
      console.log("Error adding coin package:", error.response?.data || error.message);
    }
  };
  const deleteCoinPackage = async (id: string | number) => {
    try {
      await axios.delete(
        `http://localhost:4000/api/admin/coin-packages/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );
      alert("Coin package deleted successfully");
      setCoinPackages((prev) => prev.filter((pkg) => pkg._id !== id));
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("Failed to delete");
    }
  };
  //  Gift .................

  const handleAddGift = async () => {
    try {
      // Validation
      if (!newGiftName || !newGiftPrice || !newGiftIconFile) {
        return alert("Please provide gift name, price, and upload an image!");
      }

      // Create FormData
      const formData = new FormData();
      formData.append("name", newGiftName);
      formData.append("price", newGiftPrice);
      formData.append("icon", newGiftIconFile); // matches backend multer field

      // Get token
      const token = localStorage.getItem("adminToken");
      console.log("token", token);


      // Axios POST request
      const response = await axios.post<ApiResponse<any>>("http://localhost:4000/api/admin/gift", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        alert("Gift created successfully!");

        // Update gifts state with newly created gift
        setGifts((prev) => [...prev, response.data.data]);

        // Reset form & close modal
        setNewGiftName("");
        setNewGiftPrice("");
        setNewGiftIcon("");
        setNewGiftIconFile(null);
        setIsGiftModalOpen(false);
      }
    } catch (error: any) {
      console.error("Gift Upload Error:", error);
      alert(error.response?.data?.message || "Failed to create gift");
    }
  };

  const handleSaveEdit = async () => {
    try {
      if (!selectedPackage) {
        alert("No package selected");
        return;
      }

      const token = localStorage.getItem("adminToken");

      const response = await axios.put(
        `http://localhost:4000/api/admin/coin-packages/${selectedPackage._id}`,
        {
          title: editPackage,
          coins: editCoinCount,
          price: editCoinPrice,
          offerId: editOffer || null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Updated:", response.data);
      
      // Refresh the list to get offer calculations from backend
      await fetchCoinPackages();
      
      setIsEditModalOpen(false);
      alert("Coin package updated successfully!");

    } catch (error) {
      console.error(error);
      alert("Failed to update package");
    }
  };

  //  Gift .................


  const handleSaveGiftEdit = async () => {
    try {
      if (!selectedGift) return alert("No gift selected!");

      const token = localStorage.getItem("adminToken");
      const formData = new FormData();

      // name & price
      formData.append("name", selectedGift.name);
      formData.append("price", String(selectedGift.price));


      // If a new icon file was uploaded
      if (selectedGift.newIconFile) {
        formData.append("icon", selectedGift.newIconFile);
      }

      const response = await axios.put<ApiResponse<any>>(
        `http://localhost:4000/api/admin/gift/${selectedGift._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        // Update UI
        setGifts((prev) =>
          prev.map((g) =>
            g._id === selectedGift._id ? response.data.data : g
          )
        );

        alert("Gift updated successfully!");
        setIsEditGiftModalOpen(false);
        setSelectedGift(null);
      }
    } catch (error: any) {
      console.error("Gift Edit Error:", error);
      alert(error.response?.data?.message || "Failed to update gift");
    }
  };

  const handleDeleteGift = async () => {
    if (!selectedGift) return;

    try {
      const token = localStorage.getItem("adminToken");

      const response = await axios.delete<ApiResponse<any>>(
        `http://localhost:4000/api/admin/gift/${selectedGift._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        // Remove the gift from frontend state
        setGifts((prev) => prev.filter((gift) => gift._id !== selectedGift._id));

        alert("Gift deleted successfully!");
        setIsDeleteGiftModalOpen(false);
        setSelectedGift(null);
      }
    } catch (error: any) {
      console.error("Delete Gift Error:", error);
      alert(error.response?.data?.message || "Failed to delete gift");
    }
  };

  const fetchGifts = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const response = await axios.get<ApiResponse<any>>(
        "http://localhost:4000/api/admin/gift",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setGifts(response.data.data); // backend sends { data: [...] }
      }
    } catch (error: any) {
      console.error("Fetch Gifts Error:", error);
      alert(error.response?.data?.message || "Failed to load gifts");
    }
  };

  // Fetch coin packages function (needs to be accessible outside useEffect)
  const fetchCoinPackages = async () => {
    try {
      const response = await axios.get<ApiResponse<any>>(
        "http://localhost:4000/api/admin/coin-packages/",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      if (response.data.success) {
        setCoinPackages(response.data.data);
      }
    } catch (error) {
      console.log("Error fetching coin packages:", error);
    }
  };

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/admin/offers?status=active",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            },
          }
        );
        if ((response.data as any).success) {
          setAvailableOffers((response.data as any).data.offers || []);
        }
      } catch (error) {
        console.log("Error fetching offers:", error);
      }
    };

    fetchCoinPackages();
    fetchOffers();
  }, []);


  useEffect(() => {
    fetchGifts();
  }, []);

  // Get Entry Effects .................    
  const fetchEntryEffects = async () => {
    try {
      const response = await axios.get<ApiResponse<any>>(
        "http://localhost:4000/api/admin/entry-effects/"
      );

      return response.data; // contains success & data array
    } catch (error) {
      console.error("Error fetching entry effects:", error);
      throw error;
    }
  };

  // Edit Entry Effect .................

  const handleSaveEntryEffectEdit = async () => {
    if (!selectedEffect) return;

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("Admin token not found");

      const formData = new FormData();
      formData.append("title", selectedEffect.title);
      formData.append("price", String(selectedEffect.price));
      
      // Add validity packages if provided
      if (selectedEffect.validityPackages) {
        const packages: any = {};
        if (selectedEffect.validityPackages.days7 !== undefined && selectedEffect.validityPackages.days7 !== null && selectedEffect.validityPackages.days7 !== '') {
          packages.days7 = selectedEffect.validityPackages.days7;
        }
        if (selectedEffect.validityPackages.days30 !== undefined && selectedEffect.validityPackages.days30 !== null && selectedEffect.validityPackages.days30 !== '') {
          packages.days30 = selectedEffect.validityPackages.days30;
        }
        if (selectedEffect.validityPackages.days90 !== undefined && selectedEffect.validityPackages.days90 !== null && selectedEffect.validityPackages.days90 !== '') {
          packages.days90 = selectedEffect.validityPackages.days90;
        }
        if (selectedEffect.validityPackages.days365 !== undefined && selectedEffect.validityPackages.days365 !== null && selectedEffect.validityPackages.days365 !== '') {
          packages.days365 = selectedEffect.validityPackages.days365;
        }
        
        if (Object.keys(packages).length > 0) {
          formData.append("validityPackages", JSON.stringify(packages));
        }
      }

      if (selectedEffect.newFile) {
        formData.append("animation", selectedEffect.newFile);
      }

      const response = await axios.put<ApiResponse<any>>(
        `http://localhost:4000/api/admin/entry-effects/${selectedEffect._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        // Update effects state immediately with backend response
        setEntryEffects((prev) =>
          prev.map((ef) =>
            ef._id === selectedEffect._id ? response.data.data : ef
          )
        );

        alert("Entry effect updated successfully!");
        setIsEditEntryEffectModalOpen(false);
        setSelectedEffect(null);
      } else {
        alert(response.data.message || "Failed to update entry effect");
      }
    } catch (error: any) {
      console.error("Update Error:", error);
      alert(error.response?.data?.message || "Failed to update entry effect");
    }
  };

  // Delete Entry Effect .................
  const handleDeleteEntryEffect = async (id: string) => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("Admin token not found");

      const response = await axios.delete<ApiResponse<any>>(
        `http://localhost:4000/api/admin/entry-effects/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        // Remove the entry effect from frontend state
        setEntryEffects((prev) => prev.filter((efe) => efe._id !== id));
        alert("Entry effect deleted successfully!");
        setIsDeleteEntryEffectModalOpen(false);
        setSelectedEffect(null);
      } else {
        alert(response.data.message || "Failed to delete entry effect");
      }
    } catch (error: any) {
      console.error("Delete Entry Effect Error:", error);
      alert(error.response?.data?.message || "Failed to delete entry effect");
    }
  };

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetchEntryEffects();
        setEntryEffects(res.data); // backend returns {success, data}
      } catch (err) {
        console.log(err);
      }
    }
    loadData();
  }, []);

  // ---------------- Tabs content ----------------
  const coinsTab = (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-gray-600">Manage coin packages and pricing</p>
        <Button variant="primary" className="flex items-center" onClick={() => setIsCoinModalOpen(true)}>
          <Plus size={18} className="mr-2" />
          Add Package
        </Button>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {coinPackages.map((pkg: any) => {
          // Check if package has an offer
          const hasDirectOfferPrice = pkg.offerPrice && Number(pkg.offerPrice) < Number(pkg.price);
          const hasOfferFromBackend = pkg.hasOffer === true;
          const hasOfferFromObject = pkg.offerId && pkg.offer && (pkg.offer.discountPercentage || pkg.offer.discountValue);
          
          const hasOffer = hasDirectOfferPrice || hasOfferFromBackend || hasOfferFromObject;
          const offer = pkg.offer;
          
          // Determine final and original prices
          let finalPrice = Number(pkg.price);
          let originalPrice = Number(pkg.price);
          
          if (hasDirectOfferPrice) {
            finalPrice = Number(pkg.offerPrice);
            originalPrice = Number(pkg.price);
          } else if (pkg.finalPrice !== undefined && pkg.originalPrice !== undefined) {
            finalPrice = Number(pkg.finalPrice);
            originalPrice = Number(pkg.originalPrice);
          }
          
          // Calculate discount percentage for display
          let discountPercentage = 0;
          if (hasOffer && offer && (offer.discountPercentage || offer.discountValue)) {
            discountPercentage = offer.discountPercentage || offer.discountValue || 0;
          } else if (hasOffer && originalPrice > finalPrice) {
            discountPercentage = Math.round(((originalPrice - finalPrice) / originalPrice) * 100);
          }
          
          const savings = originalPrice - finalPrice;
          
          return (
            <div
              key={pkg._id}
              className="group relative bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 hover:border-yellow-400 transform hover:-translate-y-2"
            >
              {/* Top Offer Banner */}
              {hasOffer && discountPercentage > 0 && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white text-center py-2 z-10 shadow-lg">
                  <span className="text-xs font-bold tracking-wide">🎉 {discountPercentage}% OFF</span>
                </div>
              )}

              {/* Coins Display Section */}
              <div className={`relative h-48 bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 overflow-hidden border-b-2 border-gray-300 ${hasOffer && discountPercentage > 0 ? 'pt-12' : ''}`}>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                  <div className="p-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    <CoinsIcon className="text-white" size={32} />
                  </div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-1">{pkg.coins}</h2>
                  <p className="text-sm font-semibold text-gray-600">Coins</p>
                </div>
                
                {/* Decorative Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.3),transparent_50%)]"></div>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-4 bg-gradient-to-b from-white via-slate-50 to-gray-100">
                {/* Package Title */}
                {pkg.title && (
                  <h3 className="font-bold text-gray-900 text-sm mb-2 text-center line-clamp-1">
                    {pkg.title}
                  </h3>
                )}

                {/* Price Display */}
                <div className="mb-3">
                  {hasOffer && originalPrice !== finalPrice && finalPrice < originalPrice ? (
                    <div className="text-center space-y-1.5">
                      <div className="inline-flex items-center gap-2 px-3 py-2 bg-white rounded-lg border-2 border-green-200 shadow-sm">
                        <div className="p-1 bg-green-100 rounded-md">
                          <span className="text-green-600 font-bold text-xs">₹</span>
                        </div>
                        <div>
                          <span className="text-xs text-gray-400 line-through block">
                            ₹{originalPrice}
                          </span>
                          <span className="text-xl font-bold text-green-600 block">
                            ₹{finalPrice}
                          </span>
                        </div>
                      </div>
                      {savings > 0 && (
                        <div className="inline-block bg-green-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                          💰 Save ₹{savings}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="inline-flex items-center gap-2 px-3 py-2 bg-white rounded-lg border-2 border-blue-200 shadow-sm">
                        <div className="p-1 bg-blue-100 rounded-md">
                          <span className="text-blue-600 font-bold text-xs">₹</span>
                        </div>
                        <span className="text-xl font-bold text-blue-600">
                          ₹{pkg.price}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Offer Title */}
                {hasOffer && offer && offer.title && (
                  <p className="text-xs text-orange-600 font-semibold mb-2 text-center line-clamp-1">
                    {offer.title}
                  </p>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2 border-t border-gray-200">
                  <button
                    onClick={() => handleEditOpen(pkg)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <Edit size={14} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedPackage(pkg);
                      setIsDeleteModalOpen(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>

              {/* Bottom Accent Line */}
              <div className="h-1.5 bg-gradient-to-r from-yellow-400 via-orange-500 to-amber-500"></div>
            </div>
          );
        })}
      </div>

      {/* Add Coin Modal */}
      <Modal isOpen={isCoinModalOpen} onClose={() => setIsCoinModalOpen(false)} title="Add Coin Package">
        <div className="space-y-4">
          <label className="block">
            <span className="text-gray-700 font-medium">Package</span>
            <select
              className="mt-1 block w-full border rounded-lg p-2"
              value={newPackage.title}
              onChange={(e) => setNewPackage({ ...newPackage, title: e.target.value })}
            >
              <option value="">Select a package</option>
              <option value="Basic Pack">Basic Pack</option>
              <option value="Silver Pack">Silver Pack</option>
              <option value="Gold Pack">Gold Pack</option>
              <option value="Premium Pack">Premium Pack</option>
            </select>
          </label>

          <label className="block">
            <span className="text-gray-700 font-medium">Coins</span>
            <input
              type="number"
              className="mt-1 block w-full border rounded-lg p-2"
              placeholder="Enter number of coins"
              value={newPackage.coins}
              onChange={(e) => setNewPackage({ ...newPackage, coins: e.target.value })}
            />
          </label>

          <label className="block">
            <span className="text-gray-700 font-medium">Price (₹)</span>
            <input
              type="number"
              className="mt-1 block w-full border rounded-lg p-2"
              placeholder="Enter price"
              value={newPackage.price}
              onChange={(e) => setNewPackage({ ...newPackage, price: e.target.value })}
            />
          </label>

          <label className="block">
            <span className="text-gray-700 font-medium">Offer (Optional)</span>
            <select
              className="mt-1 block w-full border rounded-lg p-2"
              value={newPackage.offerId || ""}
              onChange={(e) => setNewPackage({ ...newPackage, offerId: e.target.value || null })}
            >
              <option value="">No Offer</option>
              {availableOffers.filter(o => o.appliesTo?.includes('COIN')).map((offer) => (
                <option key={offer._id} value={offer._id}>
                  {offer.title} ({offer.discountValue}{offer.discountType === 'PERCENT' ? '%' : ' ₹'})
                </option>
              ))}
            </select>
          </label>

          <div className="flex justify-end gap-2 pt-4">
            <Button className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg" onClick={() => setIsCoinModalOpen(false)}>Cancel</Button>
            <Button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700" onClick={handleAddCoinPackage}>Add Package</Button>
          </div>
        </div>
      </Modal>

      {/* Edit Coin Package Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Coin Package">
        {selectedPackage && (
          <div className="space-y-4">
            {/* Package Dropdown */}
            <label className="block">
              <span className="text-gray-700 font-medium">Package</span>
              <select className="mt-1 block w-full border rounded-lg p-2" value={editPackage} onChange={(e) => setEditPackage(e.target.value)}>
                <option value="">Select a package</option>
                <option value="Basic Pack">Basic Pack</option>
                <option value="Silver Pack">Silver Pack</option>
                <option value="Gold Pack">Gold Pack</option>
                <option value="Premium Pack">Premium Pack</option>
              </select>
            </label>

            <label className="block">
              <span className="text-gray-700 font-medium">Coins</span>
              <input type="number" className="mt-1 block w-full border rounded-lg p-2" value={editCoinCount} onChange={(e) => setEditCoinCount(e.target.value)} />
            </label>

            <label className="block">
              <span className="text-gray-700 font-medium">Price (₹)</span>
              <input type="number" className="mt-1 block w-full border rounded-lg p-2" value={editCoinPrice} onChange={(e) => setEditCoinPrice(e.target.value)} />
            </label>

            <label className="block">
              <span className="text-gray-700 font-medium">Offer (Optional)</span>
              <select
                className="mt-1 block w-full border rounded-lg p-2"
                value={editOffer}
                onChange={(e) => setEditOffer(e.target.value)}
              >
                <option value="">No Offer</option>
                {availableOffers.filter(o => o.appliesTo?.includes('COIN')).map((offer) => (
                  <option key={offer._id} value={offer._id}>
                    {offer.title} ({offer.discountValue}{offer.discountType === 'PERCENT' ? '%' : ' ₹'})
                  </option>
                ))}
              </select>
            </label>
            <div className="flex justify-end gap-2 pt-4">
              <Button className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onClick={handleSaveEdit}>
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete Coin Package">
        <div className="text-center space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete the <strong>{selectedPackage?.coins}</strong> coins package?
          </p>

          <div className="flex justify-center gap-3">
            <Button className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              onClick={() => deleteCoinPackage(selectedPackage._id)}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );

  const giftsTab = (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-gray-600">Manage gift items and animations</p>
        <Button variant="primary" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-3xl hover:bg-blue-700" onClick={() => setIsGiftModalOpen(true)}>
          <Plus size={18} /> Add Gift
        </Button>
      </div>

      {/* Gift Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {gifts.map((gift) => {
          const hasOffer = gift.hasOffer && gift.offer;
          const originalPrice = gift.originalPrice || gift.price;
          const finalPrice = gift.finalPrice || gift.price;
          const discountPercentage = gift.offer?.discountPercentage || gift.offer?.discountValue || 0;
          const savings = originalPrice - finalPrice;

          return (
            <div 
              key={gift._id} 
              className="group relative bg-gradient-to-br from-white via-purple-50 to-pink-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-purple-200 hover:border-purple-400 transform hover:-translate-y-2"
            >
              {/* Top Offer Banner */}
              {hasOffer && discountPercentage > 0 && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white text-center py-2 z-10 shadow-lg">
                  <span className="text-xs font-bold tracking-wide">🎉 {discountPercentage}% OFF</span>
                </div>
              )}

              {/* Image Section */}
              <div 
                className="relative h-48 bg-gradient-to-br from-purple-100 via-pink-100 to-rose-100 overflow-hidden cursor-pointer border-b-2 border-purple-200"
                onClick={() => {
                  setPreviewFile(gift.icon);
                  setPreviewType("image");
                  setPreviewOpen(true);
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center p-6">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img
                      src={gift.icon}
                      alt={gift.name}
                      className="max-w-full max-h-full object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-300 filter brightness-105"
                    />
                  </div>
                </div>
                
                {/* Decorative Pattern Overlay */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.3),transparent_50%)]"></div>
                </div>
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-500/0 via-transparent to-transparent group-hover:from-blue-500/10 transition-all duration-300"></div>
              </div>

              {/* Content Section */}
              <div className="p-4 bg-gradient-to-b from-white via-purple-50/50 to-pink-50/50">
                {/* Gift Name */}
                <h3 className="font-bold text-gray-900 text-base mb-2 text-center line-clamp-2">
                  {gift.name}
                </h3>

                {/* Price Display */}
                <div className="mb-3">
                  {hasOffer && originalPrice !== finalPrice && finalPrice < originalPrice ? (
                    <div className="text-center space-y-1.5">
                      <div className="inline-flex items-center gap-2 px-3 py-2 bg-white rounded-lg border-2 border-green-200 shadow-sm">
                        <div className="p-1 bg-green-100 rounded-md">
                          <CoinsIcon className="text-green-600" size={16} />
                        </div>
                        <div>
                          <span className="text-xs text-gray-400 line-through block">
                            {originalPrice} coins
                          </span>
                          <span className="text-lg font-bold text-green-600 block">
                            {finalPrice} coins
                          </span>
                        </div>
                      </div>
                      {savings > 0 && (
                        <div className="inline-block bg-green-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                          💰 Save {savings}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="inline-flex items-center gap-2 px-3 py-2 bg-white rounded-lg border-2 border-blue-200 shadow-sm">
                        <div className="p-1 bg-blue-100 rounded-md">
                          <CoinsIcon className="text-blue-600" size={16} />
                        </div>
                        <span className="text-lg font-bold text-blue-600">
                          {gift.price} coins
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2 border-t border-gray-200">
                  <button
                    onClick={() => { 
                      setSelectedGift({ ...gift }); 
                      setIsEditGiftModalOpen(true); 
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <Edit size={14} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => { 
                      setSelectedGift(gift); 
                      setIsDeleteGiftModalOpen(true); 
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </button>
                </div>

              </div>

              {/* Bottom Accent Line */}
              <div className="h-1.5 bg-gradient-to-r from-purple-400 via-pink-500 to-rose-500"></div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {gifts.length === 0 && (
        <div className="text-center py-20 bg-gradient-to-br from-violet-50 via-fuchsia-50 to-pink-50 rounded-2xl border-2 border-dashed border-purple-300">
          <div className="inline-flex p-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-lg mb-4">
            <CoinsIcon className="text-white" size={48} />
          </div>
          <p className="text-gray-800 font-bold text-xl mb-2">No gifts available</p>
          <p className="text-gray-600 mb-6">Start by adding your first gift to the platform</p>
          <Button 
            variant="primary" 
            onClick={() => setIsGiftModalOpen(true)}
            className="flex items-center gap-2 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg"
          >
            <Plus size={18} /> Add Your First Gift
          </Button>
        </div>
      )}

      {/* Add Gift Modal */}
      <Modal isOpen={isGiftModalOpen} onClose={() => setIsGiftModalOpen(false)} title="Add New Gift">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Gift Image</label>
            <input
              type="file"
              accept="image/*"
              className="w-full border border-gray-300 rounded-lg p-2"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setNewGiftIconFile(file);
                  const reader = new FileReader();
                  reader.onloadend = () => setNewGiftIcon(reader.result as string);
                  reader.readAsDataURL(file);
                }
              }}
            />

            {newGiftIcon && (
              <div className="mt-3 flex justify-center">
                <img src={newGiftIcon} alt="Gift Preview" className="w-20 h-20 object-cover rounded-lg border" />
              </div>
            )}
          </div>

          <label className="block">
            <span className="text-gray-700 font-medium">Gift Name</span>
            <input type="text" className="mt-1 block w-full border rounded-lg p-2" placeholder="Enter gift name" value={newGiftName} onChange={(e) => setNewGiftName(e.target.value)} />
          </label>

          <label className="block">
            <span className="text-gray-700 font-medium">Price (coins)</span>
            <input type="number" className="mt-1 block w-full border rounded-lg p-2" placeholder="Enter price" value={newGiftPrice} onChange={(e) => setNewGiftPrice(e.target.value)} />
          </label>

          <div className="flex justify-end gap-2 pt-4">
            <Button className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg" onClick={() => setIsGiftModalOpen(false)}>Cancel</Button>
            <Button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700" onClick={handleAddGift}>Add Gift</Button>
          </div>
        </div>
      </Modal>

      {/* Edit Gift Modal */}
      <Modal isOpen={isEditGiftModalOpen} onClose={() => setIsEditGiftModalOpen(false)} title="Edit Gift">
        {selectedGift && (
          <div className="space-y-4">
            <label className="block">
              <span className="text-gray-700 font-medium">Gift Icon / Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const previewUrl = URL.createObjectURL(file);
                    setSelectedGift({
                      ...selectedGift, icon: previewUrl, newIconFile: file,

                    });
                  }
                }}
                className="mt-1 block w-full border rounded-lg p-2"
              />
            </label>

            {selectedGift.icon && (
              <div className="mt-3 flex justify-center">
                <img src={selectedGift.icon} alt="" className="max-w-[100px] max-h-[100px] rounded-lg" />
              </div>
            )}

            <label className="block">
              <span className="text-gray-700 font-medium">Gift Name</span>
              <input type="text" value={selectedGift.name} onChange={(e) => setSelectedGift({ ...selectedGift, name: e.target.value })} className="mt-1 block w-full border rounded-lg p-2" />
            </label>

            <label className="block">
              <span className="text-gray-700 font-medium">Price (coins)</span>
              <input type="number" value={selectedGift.price} onChange={(e) => setSelectedGift({ ...selectedGift, price: Number(e.target.value) })} className="mt-1 block w-full border rounded-lg p-2" />
            </label>


            <div className="flex justify-end gap-2 pt-4">
              <Button className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg" onClick={() => setIsEditGiftModalOpen(false)}>Cancel</Button>
              <Button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onClick={handleSaveGiftEdit}>Save Changes</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Gift Modal */}
      <Modal isOpen={isDeleteGiftModalOpen} onClose={() => setIsDeleteGiftModalOpen(false)} title="Delete Gift">
        <div className="text-center space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete the gift <strong>{selectedGift?.name}</strong>?
          </p>

          <div className="flex justify-center gap-3">
            <Button className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg" onClick={() => setIsDeleteGiftModalOpen(false)}>Cancel</Button>
            <Button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700" onClick={handleDeleteGift}>Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  );

  const entryEffectsTab = (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-gray-600">Manage Entry Effects</p>
        <Button
          variant="primary"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-3xl hover:bg-blue-700"
          onClick={() => setIsEntryEffectModalOpen(true)}
        >
          <Plus size={18} /> Add Effect
        </Button>
      </div>

      {/* ---------------- ENTRY EFFECT VIEW TAB ---------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {entryEffects.map((item) => {
          // Extract animation URL and type (handle both string and object formats)
          const animationUrl = typeof item.animation === "string" 
            ? item.animation 
            : (item.animation?.url || "");
          const mediaType = getMediaType(item.animation);
          
          // Debug logging for Lottie files
          if (mediaType === "lottie") {
            console.log("[Revenue] Entry Effect Lottie:", {
              title: item.title,
              animation: item.animation,
              url: animationUrl,
              urlType: typeof animationUrl,
              urlLength: animationUrl?.length,
              type: typeof item.animation === "object" ? item.animation?.type : "unknown"
            });
          }

          const hasOffer = item.hasOffer && item.offer;
          const originalPrice = item.originalPrice || item.price;
          const finalPrice = item.finalPrice || item.price;
          const discountPercentage = item.offer?.discountPercentage || item.offer?.discountValue || 0;
          const savings = originalPrice - finalPrice;

          return (
            <div 
              key={item._id}
              className="group relative bg-gradient-to-br from-white via-purple-50 to-pink-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-purple-200 hover:border-purple-400 transform hover:-translate-y-2"
            >
              {/* Top Offer Banner */}
              {hasOffer && discountPercentage > 0 && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white text-center py-2 z-10 shadow-lg">
                  <span className="text-xs font-bold tracking-wide">🎉 {discountPercentage}% OFF</span>
                </div>
              )}

              {/* Media Preview Section */}
              <div 
                className={`relative h-48 bg-gradient-to-br from-purple-100 via-pink-100 to-rose-100 overflow-hidden cursor-pointer border-b-2 border-purple-200 ${hasOffer && discountPercentage > 0 ? 'pt-12' : ''}`}
                onClick={() => {
                  if (typeof item.animation === "object" && item.animation?.url) {
                    setPreviewAnimation({ url: item.animation.url, type: item.animation.type || "LOTTIE" });
                  } else {
                    setPreviewAnimation({ url: animationUrl, type: mediaType === "lottie" ? "LOTTIE" : mediaType === "video" ? "VIDEO" : "GIF" });
                  }
                  setPreviewOpen(true);
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center p-6">
                  <div className="relative w-full h-full flex items-center justify-center">
                    {mediaType === "video" ? (
                      <video
                        src={animationUrl}
                        className="max-w-full max-h-full object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-300 filter brightness-105"
                        muted
                        playsInline
                        preload="metadata"
                      />
                    ) : mediaType === "lottie" ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <LottieThumbnail url={animationUrl} className="rounded-lg group-hover:scale-110 transition-transform duration-300" height={192} />
                      </div>
                    ) : (
                      <img
                        src={animationUrl}
                        alt={item.title}
                        className="max-w-full max-h-full object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-300 filter brightness-105"
                      />
                    )}
                  </div>
                </div>
                
                {/* Decorative Pattern Overlay */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.3),transparent_50%)]"></div>
                </div>
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-purple-500/0 via-transparent to-transparent group-hover:from-purple-500/10 transition-all duration-300"></div>
              </div>

              {/* Content Section */}
              <div className="p-4 bg-gradient-to-b from-white via-purple-50/50 to-pink-50/50">
                {/* Effect Title */}
                <h3 className="font-bold text-gray-900 text-base mb-2 text-center line-clamp-2">
                  {item.title}
                </h3>

                {/* Price Display */}
                <div className="mb-3">
                  {hasOffer && originalPrice !== finalPrice && finalPrice < originalPrice ? (
                    <div className="text-center space-y-1.5">
                      <div className="inline-flex items-center gap-2 px-3 py-2 bg-white rounded-lg border-2 border-green-200 shadow-sm">
                        <div className="p-1 bg-green-100 rounded-md">
                          <CoinsIcon className="text-green-600" size={16} />
                        </div>
                        <div>
                          <span className="text-xs text-gray-400 line-through block">
                            {originalPrice} coins
                          </span>
                          <span className="text-lg font-bold text-green-600 block">
                            {finalPrice} coins
                          </span>
                        </div>
                      </div>
                      {savings > 0 && (
                        <div className="inline-block bg-green-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                          💰 Save {savings}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="inline-flex items-center gap-2 px-3 py-2 bg-white rounded-lg border-2 border-blue-200 shadow-sm">
                        <div className="p-1 bg-blue-100 rounded-md">
                          <CoinsIcon className="text-blue-600" size={16} />
                        </div>
                        <span className="text-lg font-bold text-blue-600">
                          {item.price} coins
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Validity Badge */}
                <div className="mb-3 text-center">
                  <span className="inline-block px-3 py-1.5 text-xs font-bold bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 rounded-full border border-emerald-200">
                    {item.validityDays === -1
                      ? "✨ Lifetime"
                      : `⏱️ ${item.validityDays} Days`}
                  </span>
                </div>

                {/* Validity Packages Preview */}
                <div className="mb-3 p-3 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-purple-200">
                  <p className="text-xs font-semibold text-gray-700 mb-2 text-center">📦 Available Packages</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(item.validityPackages ? [
                      { id: 1, coins: item.validityPackages.days7 || Math.round((item.price || 100) * 3), days: '7 Days', validityDays: 7 },
                      { id: 2, coins: item.validityPackages.days30 || Math.round((item.price || 100) * 5), days: '30 Days', validityDays: 30 },
                      { id: 3, coins: item.validityPackages.days90 || Math.round((item.price || 100) * 8), days: '90 Days', validityDays: 90 },
                      { id: 4, coins: item.validityPackages.days365 || Math.round((item.price || 100) * 10), days: '365 Days', validityDays: 365 },
                    ] : generateValidityPackages(item.price || item.finalPrice || 100)).map((pkg) => (
                      <div
                        key={pkg.id}
                        className="text-center p-1.5 bg-white rounded border border-purple-100"
                      >
                        <div className="text-xs font-bold text-purple-700">🪙 {pkg.coins}</div>
                        <div className="text-[10px] text-gray-600">{pkg.days}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setSelectedEffect(item);
                      setIsEditEntryEffectModalOpen(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <Edit size={14} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedEffect(item);
                      setIsDeleteEntryEffectModalOpen(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>

              {/* Bottom Accent Line */}
              <div className="h-1.5 bg-gradient-to-r from-purple-400 via-pink-500 to-rose-500"></div>
            </div>
          );
        })}
      </div>



      {/* ------------------------- ADD ENTRY EFFECT MODAL ------------------------- */}

      <Modal
        isOpen={isEntryEffectModalOpen}
        onClose={() => setIsEntryEffectModalOpen(false)}
        title="Add Entry Effect"
      >
        <div className="space-y-4">

          <Input
            label="Effect Name"
            placeholder="Enter effect name"
            value={newEffectName}
            onChange={(e) => setNewEffectName(e.target.value)}
          />

          <Input
            label="Effect Coins (Base Price)"
            placeholder="Enter base price"
            type="number"
            value={newEffectCoins}
            onChange={(e) => setNewEffectCoins(e.target.value)}
          />

          {/* Validity Packages Preview */}
          {newEffectCoins && Number(newEffectCoins) > 0 && (
            <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-purple-200">
              <p className="text-sm font-semibold text-gray-700 mb-3">📦 Package Preview</p>
              <p className="text-xs text-gray-600 mb-3">These packages will be shown to users (custom prices override auto-calculated):</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 1, coins: newEffectPackages.days7 || Math.round(Number(newEffectCoins) * 3), days: '7 Days', validityDays: 7 },
                  { id: 2, coins: newEffectPackages.days30 || Math.round(Number(newEffectCoins) * 5), days: '30 Days', validityDays: 30 },
                  { id: 3, coins: newEffectPackages.days90 || Math.round(Number(newEffectCoins) * 8), days: '90 Days', validityDays: 90 },
                  { id: 4, coins: newEffectPackages.days365 || Math.round(Number(newEffectCoins) * 10), days: '365 Days', validityDays: 365 },
                ].map((pkg) => (
                  <div
                    key={pkg.id}
                    className="p-3 bg-white rounded-lg border-2 border-purple-200 hover:border-purple-400 transition-colors"
                  >
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-700 mb-1">🪙 {pkg.coins}</div>
                      <div className="text-sm font-semibold text-gray-700 mb-1">{pkg.days}</div>
                      {(newEffectPackages[`days${pkg.validityDays}`] || newEffectPackages[`days${pkg.validityDays}`] === 0) && (
                        <div className="text-xs text-green-600 font-bold">Custom Price</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Validity Packages Pricing */}
          <div className="space-y-3">
            <label className="block">
              <span className="text-gray-700 font-medium">Validity Packages Pricing (Optional)</span>
              <p className="text-xs text-gray-500 mt-1">Leave empty to use auto-generated prices from base price</p>
            </label>
            
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="7 Days (Coins)"
                placeholder="Auto: base × 3"
                type="number"
                value={newEffectPackages.days7}
                onChange={(e) => setNewEffectPackages({ ...newEffectPackages, days7: e.target.value })}
              />
              <Input
                label="30 Days (Coins)"
                placeholder="Auto: base × 5"
                type="number"
                value={newEffectPackages.days30}
                onChange={(e) => setNewEffectPackages({ ...newEffectPackages, days30: e.target.value })}
              />
              <Input
                label="90 Days (Coins)"
                placeholder="Auto: base × 8"
                type="number"
                value={newEffectPackages.days90}
                onChange={(e) => setNewEffectPackages({ ...newEffectPackages, days90: e.target.value })}
              />
              <Input
                label="365 Days (Coins)"
                placeholder="Auto: base × 10"
                type="number"
                value={newEffectPackages.days365}
                onChange={(e) => setNewEffectPackages({ ...newEffectPackages, days365: e.target.value })}
              />
            </div>
          </div>

          <Input
            label="Offer"
            placeholder="e.g. Limited Time Offer"
            value={newEffectOffer}
            onChange={(e) => setNewEffectOffer(e.target.value)}
          />

          {/* // When setting preview for new entry effect */}
          <Input
            type="file"
            accept="image/*,video/*,.json,application/json"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setNewEffectFile(file);

              if (file) {
                const previewURL = URL.createObjectURL(file);
                setNewEffectPreview(previewURL);

                // Detect type properly
                if (file.type.startsWith("video/")) {
                  setPreviewType("video");
                } else if (file.type === "application/json" || file.name.toLowerCase().endsWith(".json")) {
                  // For JSON/Lottie files, read the file and show a preview
                  setPreviewType("lottie");
                  // Read JSON file to show preview
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    try {
                      const jsonData = JSON.parse(e.target?.result as string);
                      // Store JSON data for preview
                      setNewEffectPreview(JSON.stringify(jsonData));
                    } catch (err) {
                      console.error("Failed to parse JSON:", err);
                    }
                  };
                  reader.readAsText(file);
                } else {
                  setPreviewType("image");
                }
              }

            }}
          />


          {/* Preview Uploaded File */}
          {newEffectPreview && (
            <>
              {/* Small Preview */}
              {previewType === "video" ? (
                <video
                  src={newEffectPreview}
                  className="w-24 h-24 mx-auto rounded-lg cursor-pointer object-cover"
                  autoPlay
                  loop
                  muted
                  onClick={() => setIsPreviewModalOpen(true)}
                />
              ) : previewType === "lottie" && newEffectFile ? (
                <div className="w-24 mx-auto rounded-lg cursor-pointer overflow-hidden bg-gray-100">
                  <LottieThumbnail 
                    url={URL.createObjectURL(newEffectFile)} 
                    className="rounded" 
                    height={96}
                  />
                </div>
              ) : (
                <img
                  src={newEffectPreview}
                  className="w-24 h-24 mx-auto rounded-lg cursor-pointer object-cover"
                  onClick={() => setIsPreviewModalOpen(true)}
                />
              )}

              {/* Fullscreen Preview Modal */}
              {isPreviewModalOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                  <div className="relative max-w-[90vw] max-h-[90vh]">

                    {previewType === "video" ? (
                      <video
                        src={newEffectPreview}
                        controls
                        autoPlay
                        className="max-w-[90vw] max-h-[90vh] rounded-lg"
                      />
                    ) : (
                      <img
                        src={newEffectPreview}
                        className="max-w-[90vw] max-h-[90vh] rounded-lg object-contain"
                      />
                    )}

                    <button
                      className="absolute -top-4 -right-4 bg-black text-white w-10 h-10 rounded-full flex items-center justify-center text-2xl"
                      onClick={() => setIsPreviewModalOpen(false)}
                    >
                      &times;
                    </button>
                  </div>

                </div>
              )}
            </>
          )}

          <Button variant="primary" onClick={handleAddEntryEffect} className="w-full">
            Add Effect
          </Button>

        </div>
      </Modal>

      {/* ------------------------- EDIT ENTRY EFFECT MODAL ------------------------- */}
      <Modal
        isOpen={isEditEntryEffectModalOpen}
        onClose={() => setIsEditEntryEffectModalOpen(false)}
        title="Edit Entry Effect"
      >
        {selectedEffect && (
          <div className="space-y-4">

            <Input
              label="Effect Name"
              value={selectedEffect.title}
              onChange={(e) =>
                setSelectedEffect({ ...selectedEffect, title: e.target.value })
              }
            />

            <Input
              label="Price (Base Price in Coins)"
              type="number"
              value={selectedEffect.price}
              onChange={(e) =>
                setSelectedEffect({ ...selectedEffect, price: e.target.value })
              }
            />

            {/* Validity Packages Preview for Edit */}
            {selectedEffect.price && Number(selectedEffect.price) > 0 && (
              <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-purple-200">
                <p className="text-sm font-semibold text-gray-700 mb-3">📦 Generated Validity Packages (Preview)</p>
                <p className="text-xs text-gray-600 mb-3">These packages will be shown to users in the mobile app:</p>
                <div className="grid grid-cols-2 gap-3">
                  {generateValidityPackages(Number(selectedEffect.price)).map((pkg) => (
                    <div
                      key={pkg.id}
                      className="p-3 bg-white rounded-lg border-2 border-purple-200 hover:border-purple-400 transition-colors"
                    >
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-700 mb-1">🪙 {pkg.coins}</div>
                        <div className="text-sm font-semibold text-gray-700 mb-1">{pkg.days}</div>
                        {pkg.discount > 0 ? (
                          <div className="text-xs text-green-600 font-bold bg-green-50 px-2 py-1 rounded-full inline-block">
                            {pkg.off}
                          </div>
                        ) : (
                          <div className="text-xs text-gray-400">Standard</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Validity Packages Pricing */}
            <div className="space-y-3">
              <label className="block">
                <span className="text-gray-700 font-medium">Validity Packages Pricing (Optional)</span>
                <p className="text-xs text-gray-500 mt-1">Leave empty to use auto-generated prices from base price</p>
              </label>
              
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="7 Days (Coins)"
                  placeholder="Auto: base × 3"
                  type="number"
                  value={selectedEffect.validityPackages?.days7 || ""}
                  onChange={(e) => setSelectedEffect({
                    ...selectedEffect,
                    validityPackages: {
                      ...(selectedEffect.validityPackages || {}),
                      days7: e.target.value
                    }
                  })}
                />
                <Input
                  label="30 Days (Coins)"
                  placeholder="Auto: base × 5"
                  type="number"
                  value={selectedEffect.validityPackages?.days30 || ""}
                  onChange={(e) => setSelectedEffect({
                    ...selectedEffect,
                    validityPackages: {
                      ...(selectedEffect.validityPackages || {}),
                      days30: e.target.value
                    }
                  })}
                />
                <Input
                  label="90 Days (Coins)"
                  placeholder="Auto: base × 8"
                  type="number"
                  value={selectedEffect.validityPackages?.days90 || ""}
                  onChange={(e) => setSelectedEffect({
                    ...selectedEffect,
                    validityPackages: {
                      ...(selectedEffect.validityPackages || {}),
                      days90: e.target.value
                    }
                  })}
                />
                <Input
                  label="365 Days (Coins)"
                  placeholder="Auto: base × 10"
                  type="number"
                  value={selectedEffect.validityPackages?.days365 || ""}
                  onChange={(e) => setSelectedEffect({
                    ...selectedEffect,
                    validityPackages: {
                      ...(selectedEffect.validityPackages || {}),
                      days365: e.target.value
                    }
                  })}
                />
              </div>
            </div>

            <Input
              label="Offer"
              value={selectedEffect.offer || ""}
              onChange={(e) =>
                setSelectedEffect({ ...selectedEffect, offer: e.target.value })
              }
            />
            <Input
              label="Replace Image / Video"
              type="file"
              accept="image/*,video/*,.json,application/json"
              onChange={(e) => {
                const newFile = e.target.files?.[0] || null;
                if (newFile) {
                  setSelectedEffect({
                    ...selectedEffect,
                    newFile: newFile,
                    fileName: newFile.name,
                    fileUrl: URL.createObjectURL(newFile),
                  });
                }
              }}
            />

            {/* Preview */}
            {selectedEffect?.fileUrl && (() => {
              const mediaType = getMediaType(selectedEffect.fileUrl);

              return (
                <>
                  {mediaType === "video" ? (
                    <video
                      src={selectedEffect.fileUrl}
                      className="w-24 h-24 mx-auto rounded-lg object-cover"
                      autoPlay
                      loop
                      muted
                    />
                  ) : (
                    <img
                      src={selectedEffect.fileUrl}
                      className="w-24 h-24 mx-auto rounded-lg object-cover"
                    />
                  )}
                </>
              );
            })()}
            <Button
              variant="primary"
              onClick={handleSaveEntryEffectEdit}
              className="w-full"
            >
              Save Changes
            </Button>

          </div>
        )}
      </Modal>

      {/* ------------------------- DELETE ENTRY EFFECT MODAL ------------------------- */}
      <Modal
        isOpen={isDeleteEntryEffectModalOpen}
        onClose={() => setIsDeleteEntryEffectModalOpen(false)}
        title="Delete Entry Effect"
      >
        <p className="text-gray-700">
          Are you sure you want to delete{" "}
          <strong>{selectedEffect?.title}</strong>?
        </p>

        <div className="flex gap-4 mt-4">
          <Button
            variant="danger"
            className="flex-1"
            onClick={() => handleDeleteEntryEffect(selectedEffect._id)}
          >
            Delete
          </Button>
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => setIsDeleteEntryEffectModalOpen(false)}
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
  // -------------------- Return --------------------
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Coins & Revenue Management</h1>
        <p className="text-gray-600 mt-1">Manage coin packages, gifts, withdrawal requests, and entry effects</p>
      </div>

      <Tabs
        tabs={[
          { key: "coins", label: "Coin Packages", content: coinsTab },
          { key: "gifts", label: "Gifts", content: giftsTab },
          { key: "entryEffects", label: "Entry Effects", content: entryEffectsTab },
        ]}
      />

      <PreviewModal
        open={previewOpen}
        onClose={() => {
          setPreviewOpen(false);
          setPreviewAnimation(null);
          setPreviewFile("");
        }}
        fileUrl={previewFile}
        type={previewType}
        animation={previewAnimation}
      />

    </div>
  );
}
// ------------------------- PREVIEW MODAL -------------------------

const PreviewModal = ({
  open,
  onClose,
  fileUrl,
  type,
  animation,
}: PreviewModalProps) => {
  const [showFullscreenAnimation, setShowFullscreenAnimation] = useState(false);

  if (!open) return null;

  // If animation object is provided, show Entry Effect preview
  if (animation) {
    return (
      <>
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg shadow-xl p-4 max-w-3xl w-full relative">

            {/* Close Button */}
            <button
              className="absolute top-3 right-3 bg-gray-200 hover:bg-gray-300 rounded-full px-3 py-1 text-sm font-semibold z-10"
              onClick={onClose}
            >
              ✕
            </button>

            {/* Animation Preview */}
            <div className="flex flex-col items-center p-4">
              <p className="text-sm text-gray-600 mb-4">
                Animation Type: <span className="font-semibold">{animation.type}</span>
              </p>
              <div className="w-full bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                {animation.type === "LOTTIE" ? (
                  <LottieThumbnail url={animation.url} className="rounded-xl" height={384} />
                ) : animation.type === "VIDEO" ? (
                  <video
                    src={animation.url}
                    controls
                    autoPlay
                    loop={false}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <img
                    src={animation.url}
                    alt="Preview"
                    className="max-w-full max-h-full object-contain"
                  />
                )}
              </div>
              <button
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={() => setShowFullscreenAnimation(true)}
              >
                Play Fullscreen Animation
              </button>
            </div>
          </div>
        </div>

        {/* Fullscreen Entry Effect Animation */}
        {showFullscreenAnimation && animation && (
          <EntryEffectRenderer
            animation={animation}
            duration={3}
            onComplete={() => {
              setShowFullscreenAnimation(false);
              onClose();
            }}
            className="bg-black bg-opacity-50"
          />
        )}
      </>
    );
  }

  // Legacy preview for image/video (gifts, etc.)
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg shadow-xl p-4 max-w-3xl w-full relative">

        {/* Close Button */}
        <button
          className="absolute top-3 right-3 bg-gray-200 hover:bg-gray-300 rounded-full px-3 py-1 text-sm font-semibold"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Media Preview */}
        <div className="flex justify-center items-center p-4">
          {type === "video" ? (
            <video
              src={fileUrl}
              controls
              autoPlay
              className="max-h-[70vh] rounded-lg"
            />
          ) : (
            <img
              src={fileUrl}
              alt="Preview"
              className="max-h-[70vh] rounded-lg object-contain"
            />
          )}
        </div>
      </div>
    </div>
  );
};





