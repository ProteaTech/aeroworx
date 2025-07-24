import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from './firebase/config'

/**
 * Upload a single File to `folder/filename` under your Firebase Storage bucket.
 * Returns the public download URL.
 */
export async function uploadImage(file: File, folder: string): Promise<string> {
  const timestamp = Date.now()
  const path = `${folder}/${timestamp}_${file.name}`
  const storageRef = ref(storage, path)
  // uploadBytes preserves metadata; you could use uploadBytesResumable if you want progress
  await uploadBytes(storageRef, file)
  return await getDownloadURL(storageRef)
}

/**
 * Upload multiple images in parallel to the same folder.
 * Returns an array of download URLs (in the same order as files).
 */
export async function uploadImages(
  files: File[],
  folder: string
): Promise<string[]> {
  const uploads = files.map((file) => uploadImage(file, folder))
  return Promise.all(uploads)
}
