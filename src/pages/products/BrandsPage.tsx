import { useEffect, useState } from "react";
import { MasterDetailLayout } from "@/components/layout/MasterDetailLayout";
import { useBrands } from "@/hooks/useBrands";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search, ChevronLeft, Trash2, Save, Tags, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

export default function BrandsPage() {
  const { data: brands, createMutation, isLoading, updateMutation, deleteMutation, isError } = useBrands();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [brandName, setBrandName] = useState("");
  const [brandSymbol, setBrandSymbol] = useState("");

  const selectedBrand = brands?.find(b => b.id === selectedId);

  useEffect(() => {
    if (selectedBrand) {
      setBrandName(selectedBrand.name);
      setBrandSymbol(selectedBrand.symbol);
    } else {
      setBrandName("");
      setBrandSymbol("");
    }
  }, [selectedBrand, selectedId]);

  if (isLoading) return <div className="p-8 animate-pulse text-gray-400">Loading brands...</div>;
  if (isError) return <div className="p-8 text-red-500">Failed to load brands.</div>;




  const handleSave = () => {
    if (brandName === "") return toast.error("Name and Symbol are required");

    if (selectedId) {
      updateMutation.mutate({ id: selectedId, name: brandName, symbol: brandSymbol }, {
        onSuccess: () => {
          setBrandName(""); // Clear form
          setBrandSymbol(""); // Clear form
          setSelectedId(null); // Go back to "Create" view on mobile
        }
      });

      return;
    }

    createMutation.mutate({ name: brandName, symbol: brandSymbol }, {
      onSuccess: () => {
        setBrandName(""); // Clear form
        setBrandSymbol(""); // Clear form
        setSelectedId(null); // Go back to "Create" view on mobile
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className={selectedId ? "hidden md:flex justify-between items-center" : "flex justify-between items-center"}>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Brands</h1>
          <p className="text-sm text-gray-500">Manage product brands and their identities.</p>
        </div>
        <Button onClick={() => setSelectedId(null)} className="gap-2 bg-blue-600">
          <Plus size={18} /> <span>New Brand</span>
        </Button>
      </div>

      <MasterDetailLayout
        showDetails={!!selectedId}
        list={
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-100 bg-white sticky top-0 z-10">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                <Input placeholder="Search brands..." className="pl-9 bg-gray-50 border-none h-10" />
              </div>
            </div>

            <div className="divide-y divide-gray-50">
              {brands?.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setSelectedId(b.id)}
                  className={`w-full text-left p-4 flex items-center justify-between transition-all hover:bg-gray-50 ${selectedId === b.id ? 'bg-blue-50/50 border-r-4 border-blue-600' : ''
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg border border-gray-100 flex items-center justify-center overflow-hidden bg-white">
                      {<Tags size={18} className="text-gray-400" />}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{b.name}</p>
                      <p className="text-xs text-gray-400 truncate w-32">{b.symbol}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        }
        details={
          <div className="max-w-2xl mx-auto space-y-8">
            <Button variant="ghost" onClick={() => setSelectedId(null)} className="md:hidden -ml-2 mb-4 text-blue-600">
              <ChevronLeft size={20} /> Back to List
            </Button>

            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedId ? `Edit ${selectedBrand?.name}` : 'Create New Brand'}
                </h2>
                <p className="text-sm text-gray-500">Brand identity</p>
              </div>
              {selectedId && (
                <Button variant="outline" size="icon" className="text-red-500 border-red-100">
                  <Trash2 size={18} />
                </Button>
              )}
            </div>

            <div className="grid gap-6 py-4">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1 space-y-4 w-full">
                  <div className="grid gap-2">
                    <label className="text-sm font-semibold text-gray-700">Brand Name</label>
                    <Input
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      placeholder="e.g. Coca-Cola" className="h-11" />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-semibold text-gray-700">Symbol</label>
                    <Input
                      value={brandSymbol}
                      onChange={(e) => setBrandSymbol(e.target.value)}
                      placeholder="Gino" className="h-11" />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex items-center gap-3">
              <Button onClick={handleSave} disabled={createMutation.isPending || updateMutation.isPending} className="flex-1 md:flex-none md:min-w-[160px] h-11 bg-blue-600">
                {selectedId ? "Update" : "Create"} Brand
              </Button>
            </div>
          </div>
        }
      />
    </div>
  );
}