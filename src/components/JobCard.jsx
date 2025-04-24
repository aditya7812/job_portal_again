import { db, storage } from '../firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

const handleApply = async () => {
  await addDoc(collection(db, 'applications'), {
    seekerId: user.uid,
    seekerName: user.displayName,
    email: user.email,
    cvUrl,          // you already upload CV to storage – keep same
    timestamp: serverTimestamp(),
    status: 'pending'
  });
  toast.info('Application submitted. Admin will review it shortly.');
};
