import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, serverTimestamp, getDocFromServer } from 'firebase/firestore';
import LZString from 'lz-string';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = (firebaseConfig as any).firestoreDatabaseId ? getFirestore(app, (firebaseConfig as any).firestoreDatabaseId) : getFirestore(app);
export const auth = getAuth(app);

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function createDashboard(sales: any[], adsSpend: number) {
  if (!auth.currentUser) throw new Error("Must be logged in to save dashboard.");
  
  const dashboardRef = doc(collection(db, 'dashboards'));
  const payloadStr = LZString.compressToBase64(JSON.stringify(sales));
  
  if (payloadStr.length > 900000) {
    throw new Error("Tamanho muito grande. Tente usar uma planilha com menos linhas ou resumida.");
  }

  const payload = {
    ownerId: auth.currentUser.uid,
    sales: payloadStr,
    adsSpend: Number(adsSpend) || 0,
    createdAt: serverTimestamp()
  };
  
  try {
    let timeoutId: any;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => reject(new Error("Timeout ao conectar com o banco de dados. Verifique a conexão com a internet ou se a permissão foi negada silenciosamente.")), 15000);
    });

    await Promise.race([
      setDoc(dashboardRef, payload),
      timeoutPromise
    ]);
    clearTimeout(timeoutId);

    return dashboardRef.id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, 'dashboards');
  }
}

export async function fetchDashboard(dashboardId: string) {
  try {
    const docSnap = await getDocFromServer(doc(db, 'dashboards', dashboardId));
    if (docSnap.exists()) {
      const data = docSnap.data();
      let parsedSales = [];
      try {
        const rawSales = data.sales || "";
        if (rawSales.startsWith('[') || rawSales.startsWith('{')) {
          parsedSales = JSON.parse(rawSales);
        } else {
          // Try Base64 first, then fallback to UTF16 for backwards compatibility if needed
          let decompressed = LZString.decompressFromBase64(rawSales);
          if (!decompressed) {
            decompressed = LZString.decompressFromUTF16(rawSales);
          }
          if (decompressed) {
            parsedSales = JSON.parse(decompressed);
          }
        }
      } catch (e) {
        console.error("Error parsing sales from DB", e);
      }

      return {
        sales: parsedSales,
        adsSpend: data.adsSpend || 0
      };
    }
    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, `dashboards/${dashboardId}`);
    return null;
  }
}

export let cachedAccessToken: string | null = null;

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  provider.addScope('https://www.googleapis.com/auth/drive.file');
  provider.addScope('https://www.googleapis.com/auth/spreadsheets.readonly');
  provider.setCustomParameters({
    prompt: 'consent select_account'
  });
  try {
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (credential?.accessToken) {
      cachedAccessToken = credential.accessToken;
    }
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (e) {
    console.error('Login failed', e);
    throw e;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logoutGoogle = async () => {
  await auth.signOut();
  cachedAccessToken = null;
};
