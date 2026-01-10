// src/pages/products/ProductsPage.tsx
import { useState, useEffect } from "react";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useBrands } from "@/hooks/useBrands";
import { MasterDetailLayout } from "@/components/layout/MasterDetailLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Upload, Save, Barcode, ShieldCheck, Trash2, Search, Plus } from "lucide-react";
import { toast } from "sonner";

export default function ProductsPage() {
  const { data: products, createMutation, updateMutation, isLoading } = useProducts();
  const { data: categories } = useCategories();
  const { data: brands } = useBrands();

  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [barcode, setBarcode] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [brandId, setBrandId] = useState("");
  const [nafdac, setNafdac] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);


  const selectedProduct = products?.find(p => p.id === selectedId);

  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(imageFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  useEffect(() => {
    if (selectedProduct) {
      setName(selectedProduct.name);
      setBarcode(selectedProduct.barcode);
      setNafdac(selectedProduct.nafdac_regno ?? "");
      setManufacturer(selectedProduct.manufacturer ?? "");
      setImageFile(null);
      setCategoryId(selectedProduct.category[0]?.id || "");
      setBrandId(selectedProduct.brand.id || "");
      setPreviewUrl(selectedProduct.image_url)
      // Note: Setting dropdowns requires finding the ID based on the name if API returns name
    } else {
      setName(""); setBarcode(""); setCategoryId(""); setBrandId(""); setNafdac(""); setManufacturer(""); setImageFile(null);
      setPreviewUrl(null);
    }
  }, [selectedId, selectedProduct]);


  const displayImage = previewUrl || selectedProduct?.image_url;

  const handleSave = () => {
    if (!name || !barcode || !categoryId || !brandId || (!selectedId && !imageFile)) {
      return toast.error("Please fill all required fields and upload an image");
    }

    const fd = new FormData();
    fd.append("name", name);
    fd.append("barcode", barcode);
    fd.append("category_id", categoryId);
    fd.append("brand_id", brandId);
    if (imageFile) fd.append("imageFile", imageFile);
    if (nafdac) fd.append("nafdac_regno", nafdac);
    if (manufacturer) fd.append("manufacturer", manufacturer);

    if (selectedId) {
      updateMutation.mutate({
        id: selectedId,
        formData: fd
      }, {
        onSuccess: () => {
          setSelectedId(null);
          setName("");
          setBarcode("");
          setCategoryId("");
          setBrandId("");
          setNafdac("");
          setManufacturer("");
          setImageFile(null);
          setPreviewUrl(null)
        }
      });
      return;
    }


    createMutation.mutate(fd, {
      onSuccess: () => {
        setSelectedId(null);
        setName("");
        setBarcode("");
        setCategoryId("");
        setBrandId("");
        setNafdac("");
        setManufacturer("");
        setImageFile(null);
        setPreviewUrl(null);
      }
    });
  };

  if (isLoading) return <div className="p-8 animate-pulse">Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Page Header - Hidden on mobile when editing to save space */}
      <div className={selectedId ? "hidden md:flex justify-between items-center" : "flex justify-between items-center"}>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-sm text-gray-500">Manage your product effectively.</p>
        </div>
        <Button onClick={() => setSelectedId(null)} className="gap-2 bg-blue-600 hover:bg-blue-700">
          <Plus size={18} /> <span className="hidden sm:inline">New Product</span>
        </Button>
      </div>


      <MasterDetailLayout
        showDetails={!!selectedId || name !== ""}
        list={
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                <Input placeholder="Search categories..." className="pl-9 bg-gray-50 border-none h-10 focus-visible:ring-1" />
              </div>
            </div>

            <div className="divide-y divide-gray-50">
              {products?.map(p => (
                <button key={p.id} onClick={() => setSelectedId(p.id)} className={`w-full p-4 flex items-center gap-3 ${selectedId === p.id && 'bg-blue-50 border-r-4 border-blue-600'}`}>
                  <img src={p.image_url} className="w-10 h-10 object-contain rounded border" />
                  <div className="text-left">
                    <p className="text-sm font-bold truncate w-40">{p.name}</p>
                    <p className="text-[10px] text-gray-400 uppercase">{p.brand.name}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        }
        details={
          <div className="max-w-2xl space-y-6">
            <h2 className="text-xl font-bold">{selectedId ? `Edit ${selectedProduct?.name}` : "New Product"}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Product Name*</label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Coca Cola 50cl" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Barcode*</label>
                <Input value={barcode} onChange={e => setBarcode(e.target.value)} placeholder="0000000000" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Category*</label>
                <SearchableSelect options={categories} value={categoryId} onChange={setCategoryId} placeholder="Select Category" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Brand*</label>
                <SearchableSelect options={brands} value={brandId} onChange={setBrandId} placeholder="Select Brand" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">NAFDAC No</label>
                <Input value={nafdac} onChange={e => setNafdac(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Manufacturer</label>
                <Input value={manufacturer} onChange={e => setManufacturer(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Product Image
              </label>

              <div className="h-32 w-32 relative group overflow-hidden rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 transition-all hover:border-blue-400">
                {/* The actual image display */}
                <div className="aspect-square flex items-center justify-center p-4">
                  {displayImage ? (
                    <img
                      src={displayImage}
                      alt="Preview"
                      className="max-h-full max-w-full object-contain transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="text-center">
                      <Upload className="mx-auto text-gray-300 mb-2" size={32} />
                      <p className="text-[10px] text-gray-400 font-bold uppercase">No Image Selected</p>
                    </div>
                  )}
                </div>

                {/* The hidden input and overlay */}
                <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-all opacity-0 group-hover:opacity-100">
                  <div className="bg-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 scale-90 group-hover:scale-100 transition-transform">
                    <Upload size={16} className="text-blue-600" />
                    <span className="text-xs font-bold text-gray-900">Change Image</span>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setImageFile(file);
                    }}
                  />
                </label>
              </div>

              {imageFile && (
                <p className="text-[10px] text-blue-600 font-bold uppercase mt-2">
                  Ready to upload: {imageFile.name}
                </p>
              )}
            </div>

            <Button onClick={handleSave} disabled={createMutation.isPending || updateMutation.isPending} className="w-full bg-blue-600 h-12">
              {createMutation.isPending || updateMutation.isPending ? "Uploading..." : "Save Product"}
            </Button>
          </div>
        }
      />
    </div>
  );
}