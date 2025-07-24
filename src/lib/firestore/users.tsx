'use client'

import { doc, DocumentReference, getDoc } from 'firebase/firestore'
import { firestore } from '../firebase/config'
import { User } from '../models'

export async function getUserByUid(uid: string): Promise<User | undefined> {
  const ref: DocumentReference = doc(firestore, `users/${uid}`)
  const snapshot = await getDoc(ref)

  if (snapshot.exists() === false) {
    return undefined
  } else {
    return snapshot.data() as User
  }
}
