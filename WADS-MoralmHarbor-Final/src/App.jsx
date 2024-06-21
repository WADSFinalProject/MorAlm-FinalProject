import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Filter from './components/Filter';
import PackageBox from './components/PackageBox';
import { getDeliveries, getCentra, getBatches, updateDelivery, deleteDelivery } from './apiService';
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";

function HarbourApp() {
  const [packages, setPackages] = useState([]);
  const [centra, setCentra] = useState([]);
  const [batches, setBatches] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showDropdown, setShowDropdown] = useState(null);

  useEffect(() => {
    const fetchPackages = async () => {
      const deliveryData = await getDeliveries();
      const centraData = await getCentra();
      const batchData = await getBatches();
      setPackages(deliveryData);
      setCentra(centraData);
      setBatches(batchData);

      // Log the fetched data
      console.log('Deliveries:', deliveryData);
      console.log('Centra:', centraData);
      console.log('Batches:', batchData);
    };
    fetchPackages();
  }, []);

  const getSenderName = (packageId) => {
    const batch = batches.find(b => b.Package_ID === packageId);
    if (!batch) {
      console.log(`No batch found for package ID: ${packageId}`);
      return 'Unknown';
    }
    const centraEntry = centra.find(c => c.Centra_ID === batch.Centra_ID);
    if (!centraEntry) {
      console.log(`No centra found for centra ID: ${batch.Centra_ID}`);
      return 'Unknown';
    }
    return centraEntry.CentraName;
  };

  const getWeight = (packageId) => {
    // Filter batches to find all with the same package ID
    const filteredBatches = batches.filter(b => b.Package_ID === packageId);
    
    // If no batches are found, log an error and return 'Unknown'
    if (filteredBatches.length === 0) {
      console.log(`No batch found for package ID: ${packageId}`);
      return 'Unknown';
    }
  
    // Sum the weights of all filtered batches
    const totalWeight = filteredBatches.reduce((sum, batch) => sum + batch.PowderWeight, 0);
  
    // Convert the total weight to kg and return it
    return `${totalWeight} kg`; // Convert weight to kg
  };
  

  const filteredPackages = packages.filter(pkg => {
    if (filter === 'all') {
      return true;
    } else {
      return pkg.Status && pkg.Status.toLowerCase() === filter.toLowerCase();
    }
  });

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        console.log("User logged out successfully");
        // Clear session storage
        sessionStorage.clear();
        // Navigate to login page
        navigate('/login');
      })
      .catch((error) => {
        // An error happened.
        console.error("Error logging out: ", error);
      });
  };

  const updateStatus = async (id, newStatus) => {
    const currentDateTime = new Date().toISOString();
    let updatedPackage;
    if (newStatus === 'Arrived in Harbor' || newStatus === 'Received by XYZ') {
      updatedPackage = await updateDelivery(id, { Status: newStatus, OutDeliveryTime: currentDateTime });
    } else {
      updatedPackage = await updateDelivery(id, { Status: newStatus });
    }
    setPackages(packages.map(pkg => (pkg.Package_ID === id ? updatedPackage : pkg)));
  };

  const deletePackage = async (id) => {
    await deleteDelivery(id);
    setPackages(packages.filter(pkg => pkg.Package_ID !== id));
  };

  return (
    <div className="App">
      <Header />
      <div className='ShipmentTracking'>Shipment Tracking</div>
      <div className='filterbox'>
        <Filter packages={packages} setFilter={setFilter} />
      </div>
      <div className='Box'>
        <PackageBox
          filteredPackages={filteredPackages}
          showDropdown={showDropdown}
          setShowDropdown={setShowDropdown}
          updateStatus={updateStatus}
          deletePackage={deletePackage}
          getSenderName={getSenderName}
          getWeight={getWeight}
        />
      </div>
    </div>
  );
}

export default HarbourApp;
