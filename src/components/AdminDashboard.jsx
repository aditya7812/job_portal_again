import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import {
  collection, getDocs, updateDoc, doc, query, where,
  collectionGroup
} from 'firebase/firestore';
import { toast } from 'react-toastify';

export default function AdminDashboard() {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      console.log("innn")
      const posts = query(collectionGroup(db, 'applications'), where('status', '==', 'pending'));
      const snap = await getDocs(posts);
      console.log(snap)
      setApps(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    fetch();
  }, []);

  const approve = async (id) => {
    /** dummy eligibility: send to ALL companies */
    const compSnap = await getDocs(collection(db, 'companies'));
    const companyIds = compSnap.docs.map(d => d.id);

    await updateDoc(doc(db, 'applications', id), {
      status: 'approved',
      eligibleCompanies: companyIds
    });
    toast.success('Forwarded to eligible companies.');
    setApps(a => a.filter(x => x.id !== id));
  };

  const reject = async (id) => {
    await updateDoc(doc(db, 'applications', id), { status: 'rejected' });
    toast.error('Application rejected.');
    setApps(a => a.filter(x => x.id !== id));
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Pending Applications</h2>
      {apps.map(a => (
        <div key={a.id} className="border p-3 mb-3 rounded">
          <p><b>Name:</b> {a.applicantName}</p>
          <p><b>Email:</b> {a.applicantEmail}</p>
          <a href={a.cvUrl} target="_blank" rel="noreferrer"
             className="underline text-blue-600">View CV</a>
          <div className="mt-2 space-x-2">
            <button onClick={() => approve(a.id)} className="bg-green-500 text-white px-3 py-1 rounded">Approve</button>
            <button onClick={() => reject(a.id)}  className="bg-red-500 text-white px-3 py-1 rounded">Reject</button>
          </div>
        </div>
      ))}
      {apps.length === 0 && <p>No pending applications.</p>}
    </div>
  );
}
