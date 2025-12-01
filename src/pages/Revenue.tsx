import { useState } from "react";
import { useEffect } from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import Modal from "../components/Modal";
import Tabs from "../components/Tabs";
import axios from "axios";
import { Plus, Edit, Trash2, Coins as CoinsIcon, Coins } from "lucide-react";
// import { generateMockCoinPackages, generateMockGifts } from "../utils/mockData";

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

  // ---------------- Mock Data ----------------
  // const mockCoinPackages = generateMockCoinPackages();
  // const mockGifts = generateMockGifts();

  // ---------------- Gift Management ----------------
  const [gifts, setGifts] = useState([]);
  // const [gifts, setGifts] = useState<any[]>([]);

  const [newGiftName, setNewGiftName] = useState("");
  const [newGiftPrice, setNewGiftPrice] = useState("");
  const [newGiftIcon, setNewGiftIcon] = useState("");

  // ---------------- Coin Packages ----------------
  // const [coinPackages, setCoinPackages] = useState( "");
  const [coinPackages, setCoinPackages] = useState<any[]>([]);
  const [newPackage, setNewPackage] = useState("");
  const [editPackage, setEditPackage] = useState("");

  const [newCoinCount, setNewCoinCount] = useState("");
  const [newCoinPrice, setNewCoinPrice] = useState("");
  const [newBonus, setNewBonus] = useState("");
  const [editCoinCount, setEditCoinCount] = useState("");
  const [editCoinPrice, setEditCoinPrice] = useState("");
  

  // ---------------- Entry Effects ----------------
  const [entryEffects, setEntryEffects] = useState<any[]>([]);
  const [isEditEntryEffectModalOpen, setIsEditEntryEffectModalOpen] = useState(false);
  const [isDeleteEntryEffectModalOpen, setIsDeleteEntryEffectModalOpen] = useState(false);

  const [newEffectFile, setNewEffectFile] = useState<File | null>(null);
  const [newEffectPreview, setNewEffectPreview] = useState("");

  const [newEffectName, setNewEffectName] = useState("");
  const [newGiftIconFile, setNewGiftIconFile] = useState(null);

  const [selectedEffect, setSelectedEffect] = useState<any>(null);

  const [newEffectCoins,setNewEffectCoins] = useState("");

  const[newEffectImagePreview,setNewEffectImagePreview] = useState(null);

  // ---------------- Entry Effect Functions ----------------
  const handleAddEntryEffect = () => {
    if (!newEffectName || !newEffectFile) {
      alert("Please provide both a name and an animation file!");
      return;
    }

    const newEffect = {
      id: Date.now(),
      name: newEffectName,
      fileName: newEffectFile.name,
      coins: Number(newEffectCoins),
      fileUrl: URL.createObjectURL(newEffectFile),
    };

    setEntryEffects([...entryEffects, newEffect]);
    setNewEffectName("");
    setNewEffectFile(null);
    setSelectedEffect("")
    setNewEffectPreview("");
    setIsEntryEffectModalOpen(false);
  };

  const handleSaveEntryEffectEdit = () => {
    if (!selectedEffect) return;

    setEntryEffects((prev) =>
      prev.map((efe) => (efe.id === selectedEffect.id ? selectedEffect : efe))
    );

    setIsEditEntryEffectModalOpen(false);
    setSelectedEffect(null);
  };

  const handleDeleteEntryEffect = (id: number) => {
    setEntryEffects((prev) => prev.filter((efe) => efe.id !== id));
    setIsDeleteEntryEffectModalOpen(false);
  };

  // ---------------- Coin Package Functions ----------------
  // const handleAddPackage = () => {
  //   // validation
  //   if (!newPackage || !newCoinCount || !newCoinPrice) {
  //     return alert("Please select a package and fill coins & price.");
  //   }

  //   const newPkgObj = {
  //     id: Date.now(),
  //     package: newPackage,
  //     coins: Number(newCoinCount),
  //     price: Number(newCoinPrice),
  //   };

  //   setCoinPackages((prev) => [...prev, newPkgObj]);

  //   // reset fields
  //   setNewPackage("");
  //   setNewCoinCount("");
  //   setNewCoinPrice("");
  //   setIsCoinModalOpen(false);
  // };

  // const handleAddPackage = async () => {
  //   if (!newPackage || !newCoinCount || !newCoinPrice) {
  //     alert("All fields are required");
  //     return;
  //   }
  
  //   try {
  //     const token = localStorage.getItem("adminToken");
  
  //     const response = await axios.post(
  //       "http://localhost:4000/api/admin/coinPackages/",
  //       {
  //         title: newPackage,
  //         coins: Number(newCoinCount),
  //         price: Number(newCoinPrice),
  //         bonus: newBonus || 0, // optional
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  
  //     if (response.data.success) {
  //       // Add newly created package to UI list
  //       setCoinPackages((prev) => [...prev, response.data.data]);
  
  //       // Reset form
  //       setNewPackage("");
  //       setNewCoinCount("");
  //       setNewCoinPrice("");
  //       setNewBonus("");
  
  //       setIsCoinModalOpen(false);
  //     }
  //   } catch (error: any) {
  //     console.error("Create Coin Package Error:", error.response?.data || error);
  //     alert(error.response?.data?.message || "Failed to create coin package");
  //   }
  // };


  const handleAddPackage = async () => {
    if (!newPackage || !newCoinCount || !newCoinPrice) {
      return alert("All fields are required");
    }
  
    try {
      const token = localStorage.getItem("adminToken");
  
      const response = await axios.post(
        "http://localhost:4000/api/admin/coinPackages/",
        {
          title: newPackage,
          coins: Number(newCoinCount),
          price: Number(newCoinPrice),
          bonus: newBonus ? Number(newBonus) : 0,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      if (response.data.success) {
        // Add new package to UI
        setCoinPackages((prev) => [...prev, response.data.data]);
  
        // Reset modal fields
        setNewPackage("");
        setNewCoinCount("");
        setNewCoinPrice("");
        setNewBonus("");
        setIsCoinModalOpen(false);
      }
    } catch (error: any) {
      console.error("Create Coin Package Error:", error.response?.data || error);
      alert(error.response?.data?.message || "Failed to create coin package");
    }
  };
  
  

  // const handleEditOpen = (pkg: any) => {
  //   setSelectedPackage(pkg);
  //   setEditCoinCount(String(pkg.coins ?? ""));
  //   setEditCoinPrice(String(pkg.price ?? ""));
  //   setEditPackage(pkg.package ?? "");
  //   setIsEditModalOpen(true);
  // };


  const handleEditOpen = (pkg: any) => {
    setSelectedPackage(pkg);
    setEditPackage(pkg.title); // ✅ title not package
    setEditCoinCount(String(pkg.coins));
    setEditCoinPrice(String(pkg.price));
    setIsEditModalOpen(true);
  };

  // const handleSaveEdit = () => {
  //   if (!selectedPackage) return;

  //   setCoinPackages((prev) =>
  //     prev.map((p) =>
  //       p.id === selectedPackage.id
  //         ? {
  //             ...p,
  //             package: editPackage,
  //             coins: Number(editCoinCount),
  //             price: Number(editCoinPrice),
  //           }
  //         : p
  //     )
  //   );

  //   // reset edit state
  //   setSelectedPackage(null);
  //   setEditPackage("");
  //   setEditCoinCount("");
  //   setEditCoinPrice("");
  //   setIsEditModalOpen(false);
  // };



  const handleSaveEdit = async () => {
    if (!selectedPackage) return;
  
    try {
      const token = localStorage.getItem("adminToken");
  
      const response = await axios.put(
        `http://localhost:4000/api/admin/coinPackages/${selectedPackage._id}`,
        {
          title: editPackage,
          coins: Number(editCoinCount),
          price: Number(editCoinPrice),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.data.success) {
        // ✅ Update UI with backend response
        setCoinPackages((prev) =>
          prev.map((pkg) =>
            pkg._id === selectedPackage._id ? response.data.data : pkg
          )
        );
  
        alert("Package updated successfully!");
        setIsEditModalOpen(false);
        setSelectedPackage(null);
      }
    } catch (error: any) {
      console.error("Update Error:", error);
      alert(error.response?.data?.message || "Failed to update package");
    }
  };
  


  const handleDeletePackage = () => {
    if (!selectedPackage) return;
    setCoinPackages((prev) => prev.filter((p) => p.id !== selectedPackage.id));
    setSelectedPackage(null);
    setIsDeleteModalOpen(false);
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
      console.log("token",token);
      
  
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
  
  
  
  
  // const handleSaveGiftEdit = () => {
  //   if (selectedGift) {
  //     setGifts((prev) => prev.map((gift) => (gift.id === selectedGift.id ? selectedGift : gift)));
  //     setIsEditGiftModalOpen(false);
  //     setSelectedGift(null);
  //   }
  // };


  const handleSaveGiftEdit = async () => {
    if(!selectedGift) return;

    const token = localStorage.getItem("adminToken");
    const formData = new FormData();

    formData.append("name",selectedGift.name);
    formData.append("price",selectedGift.price);

    if (selectedGift.newImageFile){
      formData.append("icon",selectedGift.newImageFile);
    }

    try {
      const res = await axios.put(
        `http://localhost:4000/api/admin/gift/${selectedGift._id}`,
        formData,
        {
          headers:{
            "Content-Type" : "multipart/form-data",
            Authorization:`Bearer ${token}`,
          },
        }
      );
      if(res.data.success) {
        setGifts((prev)=> prev.map((gif)=> gif._id === selectedGift._id ? res.data.data : gif
      )
    );

    alert("Gift updated successfully!");
    setIsEditGiftModalOpen(false);
    setSelectedGift(null);
      }
      
    } catch (error) {
      console.log(error);
      alert("Failed to update gift")
      
      
    }

  };

 
  // const handleDeleteGift = () => {
  //   if (selectedGift) {
  //     setGifts((prev) => prev.filter((gift) => gift.id !== selectedGift.id));
  //     setIsDeleteGiftModalOpen(false);
  //     setSelectedGift(null);
  //   }
  // };


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
    fetchGifts();
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
          <Card key={pkg.id} className="p-6 text-center rounded-3xl shadow-md hover:shadow-lg transition-all duration-200">
            {/* Package Badge */}
            {pkg.package && <p className="text-sm text-blue-700 font-semibold mb-2">{pkg.package}</p>}

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
    {/* Package Dropdown */}
    <label className="block">
      <span className="text-gray-700 font-medium">Package</span>
      <select
        className="mt-1 block w-full border rounded-lg p-2"
        value={newPackage}
        onChange={(e) => setNewPackage(e.target.value)}
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
        value={newCoinCount}
        onChange={(e) => setNewCoinCount(e.target.value)}
      />
    </label>

    <label className="block">
      <span className="text-gray-700 font-medium">Price (₹)</span>
      <input
        type="number"
        className="mt-1 block w-full border rounded-lg p-2"
        placeholder="Enter price"
        value={newCoinPrice}
        onChange={(e) => setNewCoinPrice(e.target.value)}
      />
    </label>

    <label className="block">
      <span className="text-gray-700 font-medium">Bonus Coins (Optional)</span>
      <input
        type="number"
        className="mt-1 block w-full border rounded-lg p-2"
        placeholder="Enter bonus coins"
        value={newBonus}
        onChange={(e) => setNewBonus(e.target.value)}
      />
    </label>

    <div className="flex justify-end gap-2 pt-4">
      <Button className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg" onClick={() => setIsCoinModalOpen(false)}>
        Cancel
      </Button>
      <Button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700" onClick={handleAddPackage}>
        Add Package
      </Button>
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
            <Button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700" onClick={handleDeletePackage}>
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
                    setSelectedGift({ ...selectedGift, icon: previewUrl , newImageFile:file,

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

          <Button variant="primary">Save Fee Settings</Button>
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

    {/* Grid Card View */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {entryEffects.map((effect) => (
        <Card
          key={effect.id}
          className="p-6 text-center rounded-3xl shadow-md hover:shadow-lg transition-all duration-200"
        >
          {/* Preview Video or Image */}
          {effect.fileUrl && (
            <div className="mb-3">
              {effect.fileUrl.endsWith(".mp4") ||

              effect.fileUrl.endsWith(".mov") ||
              effect.fileUrl.endsWith(".webm") ? (
                <video
                  src={effect.fileUrl}
                  className="w-20 h-20 object-cover rounded-lg mx-auto"
                  autoPlay
                  loop
                  muted
                />
              ) : (
                <img
                  src={effect.fileUrl}
                  className="w-20 h-20 object-cover rounded-lg mx-auto"
                />
              )}
            </div>
          )}

          <p className="font-semibold text-gray-900 mb-1">{effect.name}</p>
          <p className="text-sm text-gray-600">{effect.fileName}</p>
          <p className="text-sm font-bold text-green-700 mt-2">
            {effect.coins} Coins
          </p>

          <div className="flex gap-2 justify-center mt-4">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                setSelectedEffect({ ...effect });
                setIsEditEntryEffectModalOpen(true);
              }}
            >
              <Edit size={14} />
            </Button>

            <Button
              size="sm"
              variant="danger"
              onClick={() => {
                setSelectedEffect(effect);
                setIsDeleteEntryEffectModalOpen(true);
              }}
            >
              <Trash2 size={14} />
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
        <Button
          variant="danger"
          className="flex-1"
          onClick={() => handleDeleteEntryEffect(selectedEffect.id)}
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



