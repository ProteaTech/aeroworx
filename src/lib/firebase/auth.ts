'use client'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  AuthErrorCodes,
  getAdditionalUserInfo,
  type UserCredential,
  OAuthProvider,
  sendEmailVerification,
} from 'firebase/auth'
import { auth } from './config'
import { FirebaseError } from 'firebase/app'
import { redirect } from 'next/navigation'

export interface SignInWithProviderResponse {
  credential: UserCredential
  isNewUser: boolean
}
// Sign in with Google
export async function signInWithGoogle(): Promise<SignInWithProviderResponse> {
  const provider = new GoogleAuthProvider()
  provider.setCustomParameters({
    login_hint: 'user@helloathlete.app',
  })
  const userCredential = await signInWithPopup(auth, provider)

  const additionalUserInfo = getAdditionalUserInfo(userCredential)

  if (additionalUserInfo?.isNewUser) {
    return {
      credential: userCredential,
      isNewUser: true,
    }
  }

  return {
    credential: userCredential,
    isNewUser: false,
  }
}

/**
 * Sign In with Apple
 * @returns {Promise<SignInWithProviderResponse>} - The user credential and
 * whether the user is new
 * @throws {FirebaseError} - If Firebase fails to sign in
 * @throws {Error} - If the sign-in fails for any other reason
 */
export async function signInWithApple(): Promise<SignInWithProviderResponse> {
  const provider = new OAuthProvider('apple.com')
  provider.addScope('email')
  provider.addScope('name')
  provider.setCustomParameters({
    login_hint: 'user@proteatech.dev',
  })

  const userCredential = await signInWithPopup(auth, provider)

  const additionalUserInfo = getAdditionalUserInfo(userCredential)

  return {
    credential: userCredential,
    isNewUser: additionalUserInfo?.isNewUser || false,
  }
}

/**
 * Sign in with email and password
 * @param email - The email address of the user
 * @param password - The password of the user
 */
export async function signIn(email: string, password: string): Promise<void> {
  await signInWithEmailAndPassword(auth, email, password)
}

/**
 * Sign up with email and password
 * @param email - The email address of the user
 * @param password - The password of the user
 */
export async function signUp(
  email: string,
  password: string
): Promise<UserCredential> {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  )

  sendEmailVerification(userCredential.user)
  return userCredential
}

// Sign out
export const signOut = async ({ redirectTo }: { redirectTo?: string }) => {
  try {
    await firebaseSignOut(auth)

    if (redirectTo) {
      return redirect(redirectTo)
    }

    return { error: null }
  } catch (error) {
    if (error instanceof FirebaseError) {
      const message = getFirebaseErrorMessage(error)
      return { error: message }
    }

    const message = error instanceof Error ? error.message : 'Unknown error'
    return { error: message }
  }
}

export function getFirebaseErrorMessage(error: FirebaseError): string {
  switch (error.code) {
    case AuthErrorCodes.EMAIL_EXISTS:
      return 'Email already exists'
    case AuthErrorCodes.USER_DELETED:
      return 'Your account cannot be found. Have you signed up?'
    case AuthErrorCodes.INVALID_PASSWORD:
      return 'Your password is incorrect'
    case AuthErrorCodes.INVALID_EMAIL:
      return 'Invalid email address'
    case AuthErrorCodes.WEAK_PASSWORD:
      return 'Password should be at least 6 characters'
    case AuthErrorCodes.USER_DISABLED:
      return 'Your account has been disabled. Please contact support'
    case AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER:
      return 'Too many attempts. Please try again later'
    case AuthErrorCodes.OPERATION_NOT_ALLOWED:
      return 'Operation not allowed. Please contact support'
    default:
      return error.message
  }
}
