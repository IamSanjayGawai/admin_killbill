import { useState } from "react";
import { useEffect } from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import Modal from "../components/Modal";
import Tabs from "../components/Tabs";
import axios from "axios";
import { Plus, Edit, Trash2, Coins as CoinsIcon, Coins } from "lucide-react";
import { generateMockCoinPackages, generateMockGifts } from "../utils/mockData";

export default function Revenue() {
  // ---------------- Modal States ----------------
  const [isCoinModalOpen, setIsCoinModalOpen] = useState(false);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);


  const [isEntryEffectModalOpen, setIsEntryEffectModalOpen] = useState(false);
  const [isEditGiftModalOpen, setIsEditGiftModalOpen] = useState(false);
  const [isDeleteGiftModalOpen, setIsDeleteGiftModalOpen] = useState(false);

  // ---------------- Selected Items ----------------
  const [selectedGift, setSelectedGift] = useState<any>(null);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);

  // ---------------- Fee Inputs ----------------
  const [platformFee, setPlatformFee] = useState("30");
  const [hostFee, setHostFee] = useState("70");
  // ---------------- Gift Management ----------------
  const [gifts, setGifts] = useState([]);
  const [newGiftName, setNewGiftName] = useState("");
  const [newGiftPrice, setNewGiftPrice] = useState("");
  const [newGiftIcon, setNewGiftIcon] = useState("");

  // ---------------- Coin Packages ----------------

  const [newPackage, setNewPackage] = useState("");

  // ---------------- Coin Packages ----------------
  const [coinPackages, setCoinPackages] = useState<any[]>([]);

  const [editPackage, setEditPackage] = useState("");


  const [newCoinCount, setNewCoinCount] = useState("");
  const [newCoinPrice, setNewCoinPrice] = useState("");
  const [editCoinCount, setEditCoinCount] = useState("");
  const [editCoinPrice, setEditCoinPrice] = useState("");

  // ---------------- Entry Effects ----------------
  const [entryEffects, setEntryEffects] = useState<any[]>([]);
  const [effects, setEffects] = useState([]);
  const [isEditEntryEffectModalOpen, setIsEditEntryEffectModalOpen] = useState(false);
  const [isDeleteEntryEffectModalOpen, setIsDeleteEntryEffectModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);


  const [newEffectFile, setNewEffectFile] = useState<File | null>(null);
  const [newEffectPreview, setNewEffectPreview] = useState("");

  const [newEffectName, setNewEffectName] = useState("");
  const [newGiftIconFile, setNewGiftIconFile] = useState(null);

  const [selectedEffect, setSelectedEffect] = useState<any>(null);

  const [newEffectCoins, setNewEffectCoins] = useState("");

  const [newEffectImagePreview, setNewEffectImagePreview] = useState(null);

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

      if (response.data.success) {
        // Add the new effect from backend response to frontend state
        setEntryEffects((prev) => [...prev, response.data.data]);

        // Reset form
        setNewEffectName("");
        setNewEffectFile(null);
        setNewEffectPreview("");
        setNewEffectCoins("");
        setIsEntryEffectModalOpen(false);

        alert("Entry effect created successfully!");
      }
    } catch (error: any) {
      console.error("Error creating entry effect:", error);
      alert(error.response?.data?.message || "Failed to create entry effect");
    }
  };

  // Entry Effect handlesubmit...........

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      alert("Please select an animation file");
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("Admin token not found");

      const result = await createEntryEffect(
        title,
        String(price),   // ensure string for FormData
        selectedFile,
        token
      );

      console.log("Entry Effect Created:", result);
      alert("Entry Effect Created Successfully");

      fetchEntryEffects();  // refresh list
      closeModal();
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to create entry effect");
    }
  };
  const handleEditOpen = (pkg: any) => {
    setSelectedPackage(pkg);
    setEditCoinCount(String(pkg.coins ?? ""));
    setEditCoinPrice(String(pkg.price ?? ""));
    setEditPackage(pkg.package ?? "");
    setIsEditModalOpen(true);
  };

  // ---------------- Gift Functions ----------------
  const openEditModal = (item: any) => {
    setSelectedGift(item);
    setIsEditGiftModalOpen(true);
  };

  const openDeleteModal = (item: any) => {
    setSelectedGift(item);
    setIsDeleteGiftModalOpen(true);
  };





// coins packages................

  const handleAddCoinPackage = async () => {
    if (!newPackage.title || !newPackage.coins || !newPackage.price) {
      return alert("Please fill all fields!");
    }

    try {
      const token = localStorage.getItem("adminToken");
      console.log("token", token);
      const response = await axios.post(
        "http://localhost:4000/api/admin/coin-packages",
        {
          title: newPackage.title,
          coins: Number(newPackage.coins),
          price: Number(newPackage.price),
          bonus: Number(newPackage.bonus || 0),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setCoinPackages((prev) => [...prev, response.data.data]);
        setIsCoinModalOpen(false);
        setNewPackage({ title: "", coins: "", price: "", bonus: "" });
      }
    } catch (error) {
      console.log("Error adding coin package:", error.response?.data || error.message);
    }
  };

  const updateCoinPackage = async () => {
    try {
      const token = localStorage.getItem("adminToken");  // or use your auth method
      if (!selectedPackage) {
        alert("Please select a package");
        return;
      }

      const response = await axios.put(
        `http://localhost:4000/api/admin/coin-packages/${selectedPackage._id}`,
        {
          title,
          coins,
          price,
          bonus,
          isActive
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Package updated successfully");
      console.log(response.data);

      // close modal
      setShowAddModal(false);

      // reload packages after update
      fetchPackages();

    } catch (error) {
      console.error(error);
      alert("Failed to update package");
    }
  };

  const deleteCoinPackage = async (id) => {
    try {
      const response = await axios.delete(
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
      const response = await axios.post("http://localhost:4000/api/admin/gift", formData, {
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
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Updated:", response.data);
      alert("Coin package updated successfully!");

      setIsEditModalOpen(false);
      fetchPackages(); // refresh table

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
      formData.append("price", selectedGift.price);
  
      // If a new icon file was uploaded
      if (selectedGift.newIconFile) {
        formData.append("icon", selectedGift.newIconFile);
      }
  
      const response = await axios.put(
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

      const response = await axios.delete(
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

      const response = await axios.get(
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



  useEffect(() => {
    const fetchCoinPackages = async () => {
      try {
        const response = await axios.get(
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

    fetchCoinPackages();
  }, []);


  useEffect(() => {
    fetchGifts();
  }, []);

  // Get Fees .................

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/admin/fees-management"
        );

        if (response.data.success) {
          const data = response.data.data;
          setPlatformFee(data.platformFee?.toString() || "30");
          setHostFee(data.hostFee?.toString() || "70");
        }
      } catch (error) {
        console.error("Error fetching fees:", error);
      }
    };

    fetchFees();
  }, []);

  const handleSave = async () => {
    try {
      const response = await axios.put(
        "http://localhost:4000/api/admin/fees-management",
        {
          platformFee: Number(platformFee),
          hostFee: Number(hostFee),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      if (response.data.success) {
        alert("Fees updated successfully!");
        console.log("Updated fees:", response.data.data);
      }
    } catch (error) {
      console.error("Error updating fees:", error);
      alert("Failed to update fees");
    }
  };

  // Entry Effect............

  const createEntryEffect = async (title, price, file, token) => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("price", price);
      formData.append("animation", file); // MUST match multer field name

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

      return response.data;
    } catch (error) {
      console.error("Error creating entry effect:", error);
      throw error;
    }
  };

  // Get Entry Effects .................
  const fetchEntryEffects = async () => {
    try {
      const response = await axios.get(
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
      formData.append("title", selectedEffect.name);
      formData.append("price", String(selectedEffect.price));

      if (selectedEffect.newFile) {
        formData.append("animation", selectedEffect.newFile);
      }

      const response = await axios.put(
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
        setEffects((prev) =>
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

      const response = await axios.delete(
        `http://localhost:4000/api/admin/entry-effects/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        // Remove the entry effect from frontend state
        setEffects((prev) => prev.filter((efe) => efe._id !== id));
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
        setEffects(res.data); // backend returns {success, data}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 p-6">
        {coinPackages.map((pkg: any) => (
          <Card key={pkg._id} className="p-6 text-center rounded-3xl shadow-md hover:shadow-lg transition-all duration-200">
            {/* Package Badge */}
            {pkg.package && <p className="text-sm text-blue-700 font-semibold mb-2">{pkg.title}</p>}

            <div className="flex flex-col items-center mb-4">
              <CoinsIcon className="text-yellow-500 mb-3" size={30} />
              <h2 className="text-3xl font-bold text-gray-900">{pkg.coins}</h2>
              <p className="text-sm text-gray-600">Coins</p>
            </div>

            <p className="text-2xl font-bold text-blue-600 mb-5">₹{pkg.price}</p>

            <div className="flex items-center justify-center gap-3 mt-auto">
              <Button size="sm" variant="secondary" onClick={() => handleEditOpen(pkg)}>
                <Edit size={14} />
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => {
                  setSelectedPackage(pkg);
                  setIsDeleteModalOpen(true);
                }}
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </Card>
        ))}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {gifts.map((gift) => (
          <Card key={gift._id} className="p-6 text-center rounded-3xl shadow-md hover:shadow-lg transition-all duration-200">
            <div className="text-5xl mb-3">
              <img src={gift.icon} alt="gift icon" />

            </div>
            <p className="font-semibold text-gray-900 mb-1">{gift.name}</p>
            {/* <p className="text-sm text-gray-600 mb-2">Animation: {gift.animation}</p> */}
            <p className="text-lg font-bold text-blue-600 mb-4">{gift.price} coins</p>

            <div className="flex gap-2 justify-center">
              <Button size="sm" variant="secondary" onClick={() => { setSelectedGift({ ...gift }); setIsEditGiftModalOpen(true); }}>
                <Edit size={14} />
              </Button>
              <Button size="sm" variant="danger" onClick={() => { setSelectedGift(gift); setIsDeleteGiftModalOpen(true); }}>
                <Trash2 size={14} />
              </Button>
            </div>
          </Card>
        ))}
      </div>

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
                      ...selectedGift, icon: previewUrl, newImageFile: file,

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

  // feesTab and entryEffectsTab (kept mostly as in your original — trimmed for brevity)
  const feesTab = (
    <div className="space-y-6">
      <Card title="Platform & Host Fee Settings">
        <div className="space-y-6">
          <p className="text-gray-700 mb-4">Configure the revenue split between the platform and streamers. Total must equal 100%.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-blue-50 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">Platform Fee (%)</label>
              <Input type="number" value={platformFee} onChange={(e) => { const val = parseInt(e.target.value) || 0; setPlatformFee(val.toString()); setHostFee((100 - val).toString()); }} min="0" max="100" />
              <p className="text-sm text-gray-600 mt-2">The percentage that goes to the platform</p>
            </div>

            <div className="p-6 bg-green-50 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">Host Fee (%)</label>
              <Input type="number" value={hostFee} onChange={(e) => { const val = parseInt(e.target.value) || 0; setHostFee(val.toString()); setPlatformFee((100 - val).toString()); }} min="0" max="100" />
              <p className="text-sm text-gray-600 mt-2">The percentage that goes to the streamer</p>
            </div>
          </div>

          <Button variant="primary" onClick={handleSave}>
            Save Fee Settings
          </Button>

        </div>
      </Card>
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

      {/* entry effect View tab */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {effects.map((item) => (
          <Card key={item._id} className="p-4 rounded-xl shadow-md">
            <video
              src={item.animation}
              controls
              className="w-full h-40 object-contain mb-3"
            />
            <p className="font-semibold text-gray-900">{item.title}</p>
            <p className="text-blue-600 font-bold">{item.price} coins</p>

            <div className="flex gap-2 justify-center mt-3">
              <Button size="sm" onClick={() => { setSelectedEffect(item); setIsEditEntryEffectModalOpen(true); }}>
                Edit
              </Button>

              <Button size="sm" variant="danger" onClick={() => { setSelectedEffect(item); setIsDeleteEntryEffectModalOpen(true); }}>
                Delete
              </Button>
            </div>
          </Card>
        ))}
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
            label="Effect Coins"
            placeholder="Enter price"
            type="number"
            value={newEffectCoins}
            onChange={(e) => setNewEffectCoins(e.target.value)}
          />

          <Input
            label="Upload File (Image / Video)"
            type="file"
            accept="image/*, video/*"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setNewEffectFile(file);
              if (file) {
                const previewURL = URL.createObjectURL(file);
                setNewEffectPreview(previewURL);
              }
            }}
          />

          {/* Preview Uploaded File */}
          {newEffectPreview && (
            <>
              {newEffectPreview.includes("video") ||
                newEffectPreview.endsWith(".mp4") ||
                newEffectPreview.endsWith(".webm") ? (
                <video
                  src={newEffectPreview}
                  className="w-24 h-24 mx-auto rounded-lg"
                  autoPlay
                  loop
                  muted
                />
              ) : (
                <img
                  src={newEffectPreview}
                  className="w-24 h-24 mx-auto rounded-lg object-cover"
                />
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
              value={selectedEffect.name}
              onChange={(e) =>
                setSelectedEffect({ ...selectedEffect, name: e.target.value })
              }
            />

            <Input
              label="Price (₹)"
              type="number"
              value={selectedEffect.price}
              onChange={(e) =>
                setSelectedEffect({ ...selectedEffect, price: e.target.value })
              }
            />

            <Input
              label="Replace Image / Video"
              type="file"
              accept="image/*, video/*"
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
            {selectedEffect.fileUrl && (
              <>
                {selectedEffect.fileUrl.endsWith(".mp4") ||
                  selectedEffect.fileUrl.endsWith(".mov") ? (
                  <video
                    src={selectedEffect.fileUrl}
                    className="w-24 h-24 mx-auto"
                    autoPlay
                    loop
                    muted
                  />
                ) : (
                  <img
                    src={selectedEffect.fileUrl}
                    className="w-24 h-24 mx-auto rounded-lg"
                  />
                )}
              </>
            )}

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
          <strong>{selectedEffect?.name}</strong>?
        </p>

        <div className="flex gap-4 mt-4">
          {/* <Button
            variant="danger"
            className="flex-1"
            onClick={() => handleDeleteEntryEffect(selectedEffect.id)}
          >
            Delete
          </Button> */}
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
          { key: "fees", label: "Platform Fees", content: feesTab },
          { key: "entryEffects", label: "Entry Effects", content: entryEffectsTab },
        ]}
      />
    </div>
  );
}



