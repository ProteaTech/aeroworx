// lib/firestore/posts.ts
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  updateDoc,
  Timestamp,
  DocumentData,
  DocumentSnapshot,
  setDoc,
} from 'firebase/firestore'
import type { Post, Video, PostLink } from '@/lib/models'

const db = getFirestore()
const postsCol = collection(db, 'posts')

/** The shape of data we write into Firestore for a Post */
export interface PostData {
  id: string
  title: string
  content: string
  imageUrls: string[]
  videos: Video[] // empty array for now
  links: PostLink[]
  postedAt: Timestamp
  authorName: string
  authorImageUrl: string
  likes?: number
}

/** Fetch a single post by ID */
export async function getPostById(id: string): Promise<Post | null> {
  const docRef = doc(postsCol, id)
  const snap: DocumentSnapshot<DocumentData> = await getDoc(docRef)
  if (!snap.exists()) return null
  const data = snap.data() as Post
  const postedAt = new Date(data.postedAt as unknown as string)
  return {
    ...data,
    id: snap.id,
    postedAt: Timestamp.fromDate(postedAt),
  }
}

/** Create a new post. Returns the new post ID. */
export async function createPost(data: PostData): Promise<string> {
  // get a temp id from firestore
  // so we can update it later with the actual ID
  const initialRef = doc(collection(db, 'posts'))
  const actualRef = doc(db, `posts/${initialRef.id}`)
  await setDoc(actualRef, {
    ...data,
    id: initialRef.id,
    postedAt: data.postedAt.toDate().toISOString(),
    likes: data.likes ?? 0,
  })
  return initialRef.id
}

/** Update an existing post by ID */
export async function updatePost(
  id: string,
  data: Partial<PostData>
): Promise<void> {
  if (data.postedAt) {
    delete data.postedAt
  }

  const docRef = doc(postsCol, id)
  await updateDoc(docRef, {
    ...data,
  })
}
