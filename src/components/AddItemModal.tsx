import { useState } from 'react'
import Modal from './Modal'
import ImageUpload from './ImageUpload'
import { extractProductsFromImages } from '../lib/claude'
import type { ExtractedProduct } from '../types'

type NewItem = { name: string; price: number | null; weight: string | null; quantity: number }

interface AddItemModalProps {
  onClose: () => void
  onAdd: (item: NewItem) => Promise<unknown>
  onAddMultiple: (items: NewItem[]) => Promise<void>
}

export default function AddItemModal({ onClose, onAdd, onAddMultiple }: AddItemModalProps) {
  const [mode, setMode] = useState<'manual' | 'photo'>('manual')

  // Manual state
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [weight, setWeight] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [manualLoading, setManualLoading] = useState(false)

  // Photo state
  const [photoStep, setPhotoStep] = useState<'upload' | 'processing' | 'review'>('upload')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [extracted, setExtracted] = useState<ExtractedProduct[]>([])
  const [photoError, setPhotoError] = useState('')
  const [addingLoading, setAddingLoading] = useState(false)

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setManualLoading(true)
    try {
      await onAdd({
        name: name.trim(),
        price: price ? parseFloat(price) : null,
        weight: weight.trim() || null,
        quantity: Math.max(1, parseInt(quantity) || 1),
      })
      onClose()
    } finally {
      setManualLoading(false)
    }
  }

  const handleImagesSelected = (files: File[]) => {
    setSelectedFiles(files)
    setPhotoError('')
    setPreviews(files.map((f) => URL.createObjectURL(f)))
  }

  const handleExtract = async () => {
    if (selectedFiles.length === 0) return
    setPhotoStep('processing')
    setPhotoError('')
    try {
      const products = await extractProductsFromImages(selectedFiles)
      if (products.length === 0) {
        setPhotoError('No products detected. Try clearer photos or switch to manual entry.')
        setPhotoStep('upload')
        return
      }
      setExtracted(products)
      setPhotoStep('review')
    } catch (err) {
      setPhotoError(err instanceof Error ? err.message : 'Failed to process images')
      setPhotoStep('upload')
    }
  }

  const updateExtracted = (index: number, field: keyof ExtractedProduct, value: string) => {
    setExtracted((prev) =>
      prev.map((p, i) => {
        if (i !== index) return p
        if (field === 'price') return { ...p, price: value ? parseFloat(value) : null }
        return { ...p, [field]: value || null }
      })
    )
  }

  const removeExtracted = (index: number) => {
    setExtracted((prev) => prev.filter((_, i) => i !== index))
  }

  const handleAddAll = async () => {
    if (extracted.length === 0) return
    setAddingLoading(true)
    try {
      await onAddMultiple(extracted.map((p) => ({ ...p, quantity: 1 })))
      onClose()
    } finally {
      setAddingLoading(false)
    }
  }

  return (
    <Modal title="Add Item" onClose={onClose}>
      {/* Tab toggle */}
      <div className="flex rounded-xl bg-gray-100 p-1 mb-5">
        {(['manual', 'photo'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              mode === m ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {m === 'manual' ? 'Manual' : '📸 Scan Photo'}
          </button>
        ))}
      </div>

      {/* Manual entry */}
      {mode === 'manual' && (
        <form onSubmit={handleManualSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Cadbury Dairy Milk 200g"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              autoFocus
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Price</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full border border-gray-200 rounded-xl pl-7 pr-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Weight</label>
              <input
                type="text"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="e.g. 200g"
                className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={manualLoading || !name.trim()}
            className="w-full bg-indigo-600 text-white font-semibold rounded-xl py-3 hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {manualLoading ? 'Adding…' : 'Add Item'}
          </button>
        </form>
      )}

      {/* Photo scan */}
      {mode === 'photo' && (
        <div className="space-y-4">
          {photoStep === 'upload' && (
            <>
              <ImageUpload onImagesSelected={handleImagesSelected} />

              {previews.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">
                    {selectedFiles.length} photo{selectedFiles.length > 1 ? 's' : ''} selected
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {previews.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt=""
                        className="w-16 h-16 object-cover rounded-lg border border-gray-100"
                      />
                    ))}
                  </div>
                </div>
              )}

              {photoError && (
                <p className="text-sm text-red-600 bg-red-50 rounded-xl p-3">{photoError}</p>
              )}

              <button
                onClick={handleExtract}
                disabled={selectedFiles.length === 0}
                className="w-full bg-indigo-600 text-white font-semibold rounded-xl py-3 hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                Extract Products with AI
              </button>
            </>
          )}

          {photoStep === 'processing' && (
            <div className="text-center py-14 space-y-3">
              <div className="text-5xl animate-pulse">🤖</div>
              <p className="font-semibold text-gray-700">Analysing photos…</p>
              <p className="text-sm text-gray-400">Claude AI is reading your product images</p>
            </div>
          )}

          {photoStep === 'review' && (
            <div className="space-y-3">
              <p className="text-sm text-gray-500">
                Found <span className="font-semibold text-gray-700">{extracted.length}</span> product
                {extracted.length !== 1 ? 's' : ''}. Edit if needed before adding.
              </p>

              {extracted.map((product, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-3 space-y-2 bg-gray-50">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={product.name}
                      onChange={(e) => updateExtracted(index, 'name', e.target.value)}
                      className="flex-1 text-sm font-medium bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      onClick={() => removeExtracted(index)}
                      className="p-1.5 text-gray-300 hover:text-red-500 transition-colors shrink-0"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                      <input
                        type="number"
                        value={product.price ?? ''}
                        onChange={(e) => updateExtracted(index, 'price', e.target.value)}
                        placeholder="Price"
                        min="0"
                        step="0.01"
                        className="w-full text-sm bg-white border border-gray-200 rounded-lg pl-6 pr-2 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <input
                      type="text"
                      value={product.weight ?? ''}
                      onChange={(e) => updateExtracted(index, 'weight', e.target.value)}
                      placeholder="Weight"
                      className="w-full text-sm bg-white border border-gray-200 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              ))}

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => { setPhotoStep('upload'); setSelectedFiles([]); setPreviews([]) }}
                  className="flex-1 border border-gray-200 text-gray-600 font-medium rounded-xl py-3 text-sm hover:bg-gray-50 transition-colors"
                >
                  Scan More
                </button>
                <button
                  onClick={handleAddAll}
                  disabled={addingLoading || extracted.length === 0}
                  className="flex-1 bg-indigo-600 text-white font-semibold rounded-xl py-3 text-sm hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  {addingLoading ? 'Adding…' : `Add ${extracted.length} Item${extracted.length !== 1 ? 's' : ''}`}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  )
}
