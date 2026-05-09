export interface CloudinaryUploadResult {
  public_id: string
  url: string
  secure_url: string
  width: number
  height: number
  format: string
}

export async function uploadToCloudinary(file: File): Promise<CloudinaryUploadResult> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'restate_properties') // Create this preset in Cloudinary
  formData.append('folder', 'restate/properties')

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  if (!cloudName) throw new Error('Cloudinary cloud name not configured')

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: formData }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Upload failed')
  }

  return response.json()
}

export async function uploadMultipleImages(files: File[]): Promise<CloudinaryUploadResult[]> {
  const uploads = files.map((file) => uploadToCloudinary(file))
  return Promise.all(uploads)
}

export function getOptimizedImageUrl(
  publicId: string,
  options: { width?: number; height?: number; quality?: number } = {}
): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const { width = 800, height, quality = 80 } = options

  const transforms = [
    `f_auto`,
    `q_${quality}`,
    width ? `w_${width}` : '',
    height ? `h_${height}` : '',
    'c_fill',
  ]
    .filter(Boolean)
    .join(',')

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transforms}/${publicId}`
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  // This should be done server-side for security
  const response = await fetch('/api/cloudinary/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ public_id: publicId }),
  })

  if (!response.ok) throw new Error('Failed to delete image')
}
