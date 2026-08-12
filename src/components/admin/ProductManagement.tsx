import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product, CategoryType, ProductStatus, ColorVariation, SizeStock } from '../../types';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  Sparkles,
  Search,
  Check,
  X,
  Upload,
  ArrowUpDown,
  Tag,
  Layers,
  Image as ImageIcon
} from 'lucide-react';

interface ProductManagementProps {
  onPreviewProduct: (product: Product) => void;
}

export const ProductManagement: React.FC<ProductManagementProps> = ({ onPreviewProduct }) => {
  const { products, addProduct, updateProduct, deleteProduct, toggleHotDeal } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CategoryType>('Sandálias');
  const [collection, setCollection] = useState('Primavera/Verão 2026');
  const [originalPrice, setOriginalPrice] = useState('299.90');
  const [promotionalPrice, setPromotionalPrice] = useState('');
  const [isHotDeal, setIsHotDeal] = useState(false);
  const [status, setStatus] = useState<ProductStatus>('Publicado');
  const [images, setImages] = useState<string[]>([]);

  // Variations Matrix State
  const [variations, setVariations] = useState<ColorVariation[]>([
    {
      colorName: 'Dourado',
      colorHex: '#C9A84C',
      sizes: [33, 34, 35, 36, 37, 38, 39, 40, 41, 42].map((sz) => ({ size: sz, stock: 3 }))
    }
  ]);

  const categories: CategoryType[] = ['Sandálias', 'Scarpin', 'Tênis', 'Botas', 'Rasteiras', 'Promoções'];

  const handleOpenCreate = () => {
    setEditingProductId(null);
    setName('');
    setDescription('');
    setCategory('Sandálias');
    setCollection('Primavera/Verão 2026');
    setOriginalPrice('299.90');
    setPromotionalPrice('');
    setIsHotDeal(false);
    setStatus('Publicado');
    setImages([]);
    setVariations([
      {
        colorName: 'Dourado',
        colorHex: '#C9A84C',
        sizes: [33, 34, 35, 36, 37, 38, 39, 40, 41, 42].map((sz) => ({ size: sz, stock: 3 }))
      }
    ]);
    setModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProductId(product.id);
    setName(product.name);
    setDescription(product.description);
    setCategory(product.category);
    setCollection(product.collection);
    setOriginalPrice(product.originalPrice.toString());
    setPromotionalPrice(product.promotionalPrice ? product.promotionalPrice.toString() : '');
    setIsHotDeal(!!product.isHotDeal);
    setStatus(product.status);
    setImages(product.images || []);
    setVariations(product.variations);
    setModalOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const base64Url = event.target.result as string;
          setImages((prev) => [...prev, base64Url]);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMoveImage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= images.length) return;
    setImages((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return updated;
    });
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    const origP = parseFloat(originalPrice) || 0;
    const promoP = promotionalPrice ? parseFloat(promotionalPrice) : undefined;
    const finalImages = images.length > 0
      ? images
      : ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop'];

    if (editingProductId) {
      updateProduct(editingProductId, {
        name: name.trim(),
        description: description.trim(),
        category,
        collection: collection.trim(),
        originalPrice: origP,
        promotionalPrice: promoP,
        isHotDeal,
        status,
        images: finalImages,
        variations
      });
    } else {
      addProduct({
        name: name.trim(),
        description: description.trim(),
        category,
        collection: collection.trim(),
        originalPrice: origP,
        promotionalPrice: promoP,
        isHotDeal,
        status,
        images: finalImages,
        variations
      });
    }

    setModalOpen(false);
  };

  const handleAddColorVariation = () => {
    const newColor: ColorVariation = {
      colorName: 'Nova Cor',
      colorHex: '#1A1A1A',
      sizes: [33, 34, 35, 36, 37, 38, 39, 40, 41, 42].map((sz) => ({ size: sz, stock: 2 }))
    };
    setVariations((prev) => [...prev, newColor]);
  };

  const handleUpdateStockInMatrix = (colorIdx: number, sizeNum: number, newStock: number) => {
    setVariations((prev) =>
      prev.map((c, cIdx) => {
        if (cIdx !== colorIdx) return c;
        const newSizes = c.sizes.map((s) => (s.size === sizeNum ? { ...s, stock: Math.max(0, newStock) } : s));
        return { ...c, sizes: newSizes };
      })
    );
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E8DFC8] shadow-2xs">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#1A1A1A]">
            Gestão de Produtos e Catálogo
          </h2>
          <p className="text-zinc-500 text-xs mt-0.5">
            Cadastre novos calçados, gerencie fotos e configure a grade de tamanhos (33 ao 42).
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-6 py-3 rounded-full gold-gradient text-white font-bold text-xs shadow-md hover:brightness-105 transition flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Novo Calçado</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-2xs flex items-center gap-3">
        <Search className="w-4 h-4 text-zinc-400 ml-2" />
        <input
          type="text"
          placeholder="Buscar produto por nome, categoria ou código..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none"
        />
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-[#E8DFC8] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-[#F0EAE1] text-[11px] uppercase tracking-wider text-zinc-500 font-bold">
                <th className="p-4 pl-6">Produto / Foto</th>
                <th className="p-4">Categoria</th>
                <th className="p-4">Preço Original</th>
                <th className="p-4">Preço Promo</th>
                <th className="p-4">Grade de Cores</th>
                <th className="p-4">Promoção Imperdível</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-xs">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-[#FAF8F5]/80 transition">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images[0]}
                        alt=""
                        className="w-12 h-14 rounded-xl object-cover border border-zinc-200 shrink-0"
                      />
                      <div>
                        <strong className="font-serif font-bold text-sm text-[#1A1A1A] block">
                          {p.name}
                        </strong>
                        <span className="text-[11px] text-zinc-400">{p.collection}</span>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 font-semibold text-zinc-700">{p.category}</td>

                  <td className="p-4 font-bold text-zinc-800">
                    R$ {p.originalPrice.toFixed(2).replace('.', ',')}
                  </td>

                  <td className="p-4 font-bold text-emerald-700">
                    {p.promotionalPrice
                      ? `R$ ${p.promotionalPrice.toFixed(2).replace('.', ',')}`
                      : '-'}
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      {p.variations.map((v, i) => (
                        <span
                          key={i}
                          title={v.colorName}
                          className="w-4 h-4 rounded-full border border-zinc-300 shadow-2xs inline-block"
                          style={{ backgroundColor: v.colorHex }}
                        />
                      ))}
                      <span className="text-[10px] text-zinc-400 ml-1">
                        ({p.variations.length} cores)
                      </span>
                    </div>
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() => toggleHotDeal(p.id)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold cursor-pointer transition flex items-center gap-1 ${
                        p.isHotDeal
                          ? 'bg-[#1A1A1A] text-[#DFBA61] border border-[#DFBA61]/30'
                          : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
                      }`}
                    >
                      <Sparkles className="w-3 h-3 text-[#C9A84C]" />
                      <span>{p.isHotDeal ? 'Imperdível Ativo' : 'Ativar Promo'}</span>
                    </button>
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        p.status === 'Publicado'
                          ? 'bg-emerald-100 text-emerald-800'
                          : p.status === 'Rascunho'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>

                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onPreviewProduct(p)}
                        className="p-2 text-zinc-500 hover:text-[#C9A84C] hover:bg-zinc-100 rounded-lg transition"
                        title="Preview do produto"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-2 text-zinc-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Editar produto"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="p-2 text-zinc-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Excluir produto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT PRODUCT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-3xl p-6 sm:p-8 shadow-2xl relative my-8 border border-[#E8DFC8] max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="font-serif font-bold text-2xl text-[#1A1A1A] mb-1">
              {editingProductId ? 'Editar Calçado' : 'Cadastrar Novo Calçado'}
            </h3>
            <p className="text-zinc-500 text-xs mb-6">
              Preencha os dados e a grade de estoque do calçado.
            </p>

            <form onSubmit={handleSaveProduct} className="space-y-6">
              
              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">Nome do Calçado *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Scarpin Dourado Salto Fino"
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">Categoria *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-xs bg-white"
                  >
                    {categories.filter((c) => c !== 'Promoções').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Descrição Completa</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Material, tipo de salto, sola, detalhes do produto..."
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-xs"
                />
              </div>

              {/* Prices & Collection */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">Coleção</label>
                  <input
                    type="text"
                    value={collection}
                    onChange={(e) => setCollection(e.target.value)}
                    placeholder="Ex: Primavera/Verão 2026"
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">Preço Original (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">Preço Promocional (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={promotionalPrice}
                    onChange={(e) => setPromotionalPrice(e.target.value)}
                    placeholder="Opcional"
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-xs font-bold text-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">Status na Vitrine</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-xs bg-white"
                  >
                    <option value="Publicado">Publicado</option>
                    <option value="Rascunho">Rascunho</option>
                    <option value="Esgotado">Esgotado</option>
                  </select>
                </div>
              </div>

              {/* Device Image Upload Section */}
              <div className="p-5 bg-[#FAF8F5] rounded-2xl border border-[#E8DFC8] space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <span className="block text-xs font-bold text-[#1A1A1A] flex items-center gap-1.5">
                      <Upload className="w-4 h-4 text-[#C9A84C]" />
                      Fotos do Calçado (Upload do Dispositivo)
                    </span>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      Selecione fotos diretamente do seu celular ou computador. A 1ª foto será a principal na vitrine e a 2ª será a foto exibida ao passar o mouse (hover).
                    </p>
                  </div>

                  <label className="px-4 py-2 rounded-xl gold-gradient text-white font-bold text-xs shadow-xs hover:brightness-105 cursor-pointer flex items-center gap-2 transition shrink-0">
                    <Upload className="w-4 h-4" />
                    <span>Carregar Fotos</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Image Preview List or Empty Dropzone */}
                {images.length === 0 ? (
                  <label className="border-2 border-dashed border-[#D9CBA8] bg-white rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-amber-50/50 transition">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border border-[#E8DFC8] flex items-center justify-center text-[#C9A84C] mb-2">
                      <Upload className="w-6 h-6" />
                    </div>
                    <p className="font-bold text-xs text-zinc-800">Clique para selecionar fotos do seu dispositivo</p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">Disponível para celular e computador (JPG, PNG, WEBP, HEIC)</p>
                  </label>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    {images.map((imgUrl, idx) => (
                      <div key={idx} className="relative group bg-white rounded-2xl border border-zinc-200 p-2 shadow-2xs flex flex-col items-center">
                        <img
                          src={imgUrl}
                          alt={`Foto ${idx + 1}`}
                          className="w-full h-32 object-cover rounded-xl border border-zinc-100"
                        />
                        <div className="mt-2 w-full flex items-center justify-between text-[10px] font-bold">
                          <span className={`px-2 py-0.5 rounded-full ${
                            idx === 0
                              ? 'bg-[#1A1A1A] text-[#DFBA61]'
                              : idx === 1
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-zinc-100 text-zinc-600'
                          }`}>
                            {idx === 0 ? '1ª (Principal)' : idx === 1 ? '2ª (Hover)' : `${idx + 1}ª Foto`}
                          </span>
                          <div className="flex items-center gap-1">
                            {idx > 0 && (
                              <button
                                type="button"
                                onClick={() => handleMoveImage(idx, idx - 1)}
                                className="px-1 py-0.5 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 rounded text-xs font-bold"
                                title="Mover para esquerda"
                              >
                                ←
                              </button>
                            )}
                            {idx < images.length - 1 && (
                              <button
                                type="button"
                                onClick={() => handleMoveImage(idx, idx + 1)}
                                className="px-1 py-0.5 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 rounded text-xs font-bold"
                                title="Mover para direita"
                              >
                                →
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded"
                              title="Remover foto"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Add More Photos Card */}
                    <label className="border-2 border-dashed border-[#D9CBA8] bg-white rounded-2xl min-h-[140px] flex flex-col items-center justify-center text-center cursor-pointer hover:bg-amber-50/50 transition p-3">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Plus className="w-6 h-6 text-[#C9A84C] mb-1" />
                      <span className="text-[11px] font-bold text-zinc-700">Adicionar Fotos</span>
                    </label>
                  </div>
                )}
              </div>

              {/* Variations Matrix: Color + Size (33 to 42) + Stock */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider">
                    Grade de Estoque por Tamanho (33 ao 42)
                  </span>
                  <button
                    type="button"
                    onClick={handleAddColorVariation}
                    className="text-xs font-bold text-[#C9A84C] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Adicionar Outra Cor
                  </button>
                </div>

                {variations.map((v, cIdx) => (
                  <div key={cIdx} className="p-4 rounded-2xl bg-white border border-zinc-200 space-y-3 shadow-2xs">
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={v.colorName}
                        onChange={(e) => {
                          const nameVal = e.target.value;
                          setVariations((prev) =>
                            prev.map((item, idx) => (idx === cIdx ? { ...item, colorName: nameVal } : item))
                          );
                        }}
                        className="px-3 py-1.5 rounded-lg border border-zinc-300 text-xs font-bold text-zinc-800"
                        placeholder="Nome da Cor (Ex: Nude)"
                      />
                      <input
                        type="color"
                        value={v.colorHex}
                        onChange={(e) => {
                          const hexVal = e.target.value;
                          setVariations((prev) =>
                            prev.map((item, idx) => (idx === cIdx ? { ...item, colorHex: hexVal } : item))
                          );
                        }}
                        className="w-8 h-8 rounded-lg cursor-pointer border border-zinc-300"
                      />
                    </div>

                    {/* Size Stocks Input Row */}
                    <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 pt-2 border-t border-zinc-100">
                      {v.sizes.map((s) => (
                        <div key={s.size} className="text-center">
                          <span className="block text-[10px] font-bold text-zinc-500 mb-1">
                            Tam {s.size}
                          </span>
                          <input
                            type="number"
                            min="0"
                            value={s.stock}
                            onChange={(e) => handleUpdateStockInMatrix(cIdx, s.size, parseInt(e.target.value) || 0)}
                            className="w-full text-center py-1 border border-zinc-300 rounded-lg text-xs font-bold text-zinc-800"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-zinc-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-zinc-300 text-xs font-semibold text-zinc-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full gold-gradient text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  {editingProductId ? 'Salvar Alterações' : 'Cadastrar Calçado'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
