import { useState } from 'react'

interface ImageUploadProps {
  onImagesSelected: (files: File[]) => void
  disabled?: boolean
}

export default function ImageUpload({ onImagesSelected, disabled }: ImageUploadProps) {
  const [dragOver, setDragOver] = useState(false)

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return
    const imageFiles = Array.from(files).filter((f) => f.type.startsWith('image/'))
    if (imageFiles.length > 0) onImagesSelected(imageFiles)
  }

  return (
    <div className="space-y-3">
      <label
        className={`block border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          dragOver ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200 bg-gray-50 hover:border-gray-300'
        } ${disabled ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files) }}
      >
        <div className="text-4xl mb-2">🖼️</div>
        <p className="text-sm font-medium text-gray-700">Tap to choose photos</p>
        <p className="text-xs text-gray-400 mt-1">Multiple images supported</p>
        <input
          type="file"
          accept="image/*"
          multiple
          disabled={disabled}
          className="hidden"
          onChange={(e) => { handleFiles(e.target.files); e.target.value = '' }}
        />
      </label>

      <label
        className={`w-full flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors ${disabled ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
      >
        <span>📷</span>
        Take Photo
        <input
          type="file"
          accept="image/*"
          capture="environment"
          disabled={disabled}
          className="hidden"
          onChange={(e) => { handleFiles(e.target.files); e.target.value = '' }}
        />
      </label>
    </div>
  )
}
