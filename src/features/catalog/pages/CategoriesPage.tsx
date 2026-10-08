// src/pages/products/CategoriesPage.tsx
import { useState, useEffect } from "react";
import { MasterDetailLayout } from "@/shared/components/layout/MasterDetailLayout";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Plus, Search, ChevronLeft, Trash2 } from "lucide-react";
import { useCategories } from "@/features/catalog/hooks/useCategories";
import { toast } from "sonner";



export default function CategoriesPage() {

  const { data: categories, createMutation, isLoading, updateMutation, deleteMutation, isError } = useCategories();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const selectedCategory = categories?.find(c => c.id === selectedId);
  const [isCreating, setIsCreating] = useState(false); // [!code ++]

  useEffect(() => {
    if (selectedCategory) {
      setCategoryName(selectedCategory.name);
    } else {
      setCategoryName("");
    }
  }, [selectedId, selectedCategory]);

  if (isLoading) return <div className="p-8 animate-pulse text-gray-400">Loading...</div>;
  if (isError) return <div className="p-8 text-red-500">Error loading data</div>;


  const handleSave = () => {
    if (categoryName === "") return toast.error("Name is required");

    if (selectedId) {
      updateMutation.mutate({ id: selectedId, name: categoryName }, {
        onSuccess: () => {
          setCategoryName(""); // Clear form
          setSelectedId(null); // Go back to "Create" view on mobile
        }
      });

      return;
    }

    // Trigger the mutation
    createMutation.mutate({ name: categoryName }, {
      onSuccess: () => {
        setCategoryName(""); // Clear form
        setSelectedId(null); // Go back to "Create" view on mobile
      }
    });
  };

  const handleDelete = () => {
    if (!selectedId) return;

    // Professional touch: Simple confirmation browser alert
    if (window.confirm("Are you sure you want to delete this category?")) {
      deleteMutation.mutate(selectedId, {
        onSuccess: () => {
          setSelectedId(null); // Clear selection after deletion
        }
      });
    }
  };



  return (
    <div className="space-y-6">
      {/* Page Header - Hidden on mobile when editing to save space */}
      <div className={selectedId ? "hidden md:flex justify-between items-center" : "flex justify-between items-center"}>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
          <p className="text-sm text-gray-500">Organize your inventory into logical groups.</p>
        </div>
        <Button onClick={() => {
          setSelectedId(null);
          setIsCreating(true);
        }} className="gap-2 bg-blue-600 hover:bg-blue-700">
          <Plus size={18} /> <span className="hidden sm:inline">New Category</span>
        </Button>
      </div>

      <MasterDetailLayout
        showDetails={!!selectedId || isCreating} // [!code ++]
        list={
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                <Input placeholder="Search categories..." className="pl-9 bg-gray-50 border-none h-10 focus-visible:ring-1" />
              </div>
            </div>

            <div className="divide-y divide-gray-50">
              {categories!.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedId(cat.id)}
                  className={`w-full text-left p-4 flex items-center justify-between transition-all hover:bg-gray-50 ${selectedId === cat.id ? 'bg-blue-50/50 border-r-4 border-blue-600' : ''
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center text-xl">
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{cat.name}</p>
                      <p className="text-xs text-gray-500">ID: {cat.id.slice(0, 8)}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        }
        details={
          <div className="max-w-2xl mx-auto space-y-8">
            <Button
              variant="ghost"
              onClick={() => {setSelectedId(null); setIsCreating(false);}} // [!code ++]
              className="md:hidden -ml-2 mb-4 text-blue-600 flex gap-2 items-center"
            >
              <ChevronLeft size={20} /> Back to List
            </Button>

            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedId ? `Edit ${selectedCategory?.name}` : 'Create New Category'}
                </h2>
                <p className="text-sm text-gray-500">Update the category name and symbol.</p>
              </div>
              {selectedId && (
                <Button variant="outline" size="icon" className="text-red-500 hover:bg-red-50 border-red-100" onClick={handleDelete}
                  disabled={deleteMutation.isPending}>
                  <Trash2 size={18} />
                </Button>
              )}
            </div>

            <div className="grid gap-6 py-4">
              <div className="grid gap-2">
                <label className="text-sm font-semibold text-gray-700">Category Name</label>
                <Input
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="e.g. Beverages"
                  className="h-11 focus-visible:ring-blue-500"
                />
              </div>


            </div>

            <div className="pt-6 border-t border-gray-100 flex items-center gap-3">
              <Button className="flex-1 md:flex-none md:min-w-[140px] gap-2 h-11 bg-blue-600"
                onClick={handleSave}
                disabled={createMutation.isPending} // Disable button while saving
              >
                {createMutation.isPending ? "Saving..." : selectedId != null ? "Update" : "Create"}
              </Button>
              <Button
                variant="ghost"
                onClick={() => setSelectedId(null)}
                className="flex-1 md:flex-none h-11"
              >
                Cancel
              </Button>
            </div>
          </div>
        }
      />
    </div>
  );
}