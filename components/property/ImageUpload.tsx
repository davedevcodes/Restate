'use client'
import { useState, useCallback } from 'react'
import { uploadToCloudinary, CloudinaryUploadResult } from '@/lib/cloudinary'
import toast from 'react-hot-toast'

interface ImageUploadProps { value: CloudinaryUploadResult[]; onChange: (images: CloudinaryUploadResult[]) => void; maxImages?: number }

export default function ImageUpload({ value, onChange, maxImages=10 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const handleUpload = useCallback(async (files: FileList | File[]) => {
    const arr = Array.from(files)
    const remaining = maxImages - value.length
    if (arr.length > remaining) { toast.error(`You can only upload ${remaining} more image(s)`); return }
    const valid = arr.filter((f) => {
      if (!f.type.startsWith('image/')) { toast.error(`${f.name} is not an image`); return false }
      if (f.size > 10*1024*1024) { toast.error(`${f.name} is too large (max 10MB)`); return false }
      return true
    })
    if (!valid.length) return
    setUploading(true)
    try {
      const results = await Promise.all(valid.map(uploadToCloudinary))
      onChange([...value, ...results])
      toast.success(`${results.length} image(s) uploaded successfully`)
    } catch { toast.error('Failed to upload. Check Cloudinary configuration.') }
    finally { setUploading(false) }
  }, [value, onChange, maxImages])

  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); setDragOver(false); handleUpload(e.dataTransfer.files) }
  const removeImage = (i: number) => onChange(value.filter((_,idx) => idx!==i))
  const moveToMain = (i: number) => { const n=[...value]; const [m]=n.splice(i,1); n.unshift(m); onChange(n) }

  return (
    <div className="space-y-3">
      {value.length < maxImages && (
        <div onDragOver={(e) => { e.preventDefault(); setDragOver(true) }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop}
          className="relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer"
          style={{ borderColor: dragOver ? 'var(--brand-400)' : 'var(--color-border)', backgroundColor: dragOver ? 'var(--brand-100)' : 'var(--color-surface-2)' }}>
          <input type="file" accept="image/*" multiple onChange={(e) => e.target.files && handleUpload(e.target.files)} className="absolute inset-0 opacity-0 cursor-pointer" disabled={uploading} />
          <div className="flex flex-col items-center gap-3">
            {uploading ? (
              <>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor:'var(--brand-100)' }}>
                  <i className="fa-solid fa-spinner animate-spin text-xl" style={{ color:'var(--brand-500)' }} />
                </div>
                <p className="text-sm text-muted">Uploading images...</p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor:'var(--color-surface-3)' }}>
                  <i className="fa-solid fa-cloud-arrow-up text-xl text-muted" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary">Drop images here or click to browse</p>
                  <p className="text-xs text-muted mt-0.5">PNG, JPG, WEBP up to 10MB · Max {maxImages} images</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      
        {value.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {value.map((img, i) => (
              <div
                key={img.public_id || i}
                className="relative group aspect-square rounded-xl overflow-hidden border" style={{ borderColor:'var(--color-border)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.secure_url} alt={`Image ${i+1}`} className="w-full h-full object-cover" />
                {i===0 && (
                  <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded text-xs font-bold text-white" style={{ backgroundColor:'var(--brand-500)' }}>
                    <i className="fa-solid fa-star mr-1 text-xs" />Main
                  </div>
                )}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2" style={{ backgroundColor:'rgba(0,0,0,0.5)' }}>
                  {i>0 && (
                    <button type="button" onClick={() => moveToMain(i)} className="w-8 h-8 rounded-full flex items-center justify-center transition-colors" style={{ backgroundColor:'rgba(255,255,255,0.9)' }} title="Set as main">
                      <i className="fa-solid fa-star text-xs" style={{ color:'var(--brand-600)' }} />
                    </button>
                  )}
                  <button type="button" onClick={() => removeImage(i)} className="w-8 h-8 rounded-full flex items-center justify-center bg-red-500 text-white hover:bg-red-600 transition-colors" title="Remove">
                    <i className="fa-solid fa-trash-can text-xs" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      
      {value.length > 0 && (
        <p className="text-xs text-muted"><i className="fa-solid fa-circle-info mr-1.5" />{value.length} of {maxImages} images uploaded. Hover to set main or remove.</p>
      )}
    </div>
  )
}
