import React, { useState, useEffect } from 'react';
import './Home.css';
import MoralmLogo from './assets/MoralmLogo.png';
import NotifBellLogo from './assets/NotifBellLogo.png';
import ShopCartLogo from './assets/ShopCartLogo.png';
import ArchiveLogo from './assets/ArchiveLogo.png';
import UserLogo from './assets/UserLogo2.png';
import ArrowLogo from './assets/ArrowLogo.png';
import NotificationsModal from './NotifPopUp';
import WarehouseModal from './Warehouse';
import Archive from './Archive';
import StepPopUp from './StepPopUp';
import Burger from './assets/burger.png';
import LogoutIcon from './assets/logout.png';
import { getCentras, getBatchesByCentraId, updateBatch, getNotifications } from './apiService';
import { signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

const createSteps = (status) => {
  const steps = [
    { step: 'Gather Leaves', completed: false },
    { step: 'Wet Leaves', completed: false },
    { step: 'Dry Leaves', completed: false },
    { step: 'Flour Leaves', completed: false },
    { step: 'Deliver', completed: false },
    { step: 'Rescale', completed: false },
  ];

  const statusIndexMap = {
    'Gather Leaves': 0,
    'Wet Leaves': 1,
    'Dry Leaves': 2,
    'Flour Leaves': 3,
    'Deliver': 4,
    'Rescale': 5,
  };

  const completedIndex = statusIndexMap[status];
  if (completedIndex !== undefined) {
    for (let i = 0; i <= completedIndex; i++) {
      steps[i].completed = true;
    }
  }

  return steps;
};

const Home = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeLink, setActiveLink] = useState('');
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isWarehouseModalOpen, setIsWarehouseModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [batches, setBatches] = useState([]);
  const [centras, setCentras] = useState([]);
  const [stepPopupOpen, setStepPopupOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedStepIndex, setSelectedStepIndex] = useState(null);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [dropdownStates, setDropdownStates] = useState([]);
  const [completedBatches, setCompletedBatches] = useState([]);
  const [archivedBatches, setArchivedBatches] = useState([]);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [rescaleBatches, setRescaleBatches] = useState([]); // New state for rescale batches

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error('Error logging out:', error);
      alert('Error logging out: ' + error.message);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const topRightButtons = document.querySelector('.top-right-buttons');
      if (window.scrollY > 100) {
        topRightButtons.classList.add('hide');
      } else {
        topRightButtons.classList.remove('hide');
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchCentras = async () => {
      try {
        const centrasData = await getCentras();
        setCentras(Array.isArray(centrasData) ? centrasData : []);
        if (centrasData.length > 0) {
          setActiveLink(centrasData[0].CentraName); // Default to the first Centra
        }
      } catch (error) {
        console.error("Error fetching centras", error);
        setCentras([]);
      }
    };

    fetchCentras();

    const interval = setInterval(() => {
      fetchCentras();
    }, 30000); // Refreshes every 30 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchBatches = async () => {
      if (activeLink) {
        try {
          const centra = centras.find(centra => centra.CentraName === activeLink);
          if (centra) {
            const batchesData = await getBatchesByCentraId(centra.Centra_ID);
            const filteredBatches = Array.isArray(batchesData) ? batchesData.filter(batch => batch.Status !== "Warehouse") : [];
            setBatches(filteredBatches.map(batch => ({
              ...batch,
              steps: createSteps(batch.Status)
            })));
            const rescaleData = Array.isArray(batchesData) ? batchesData.filter(batch => batch.Status === "Rescale") : [];
            setRescaleBatches(rescaleData); // Set rescale batches state
          } else {
            console.warn("Centra not found for activeLink:", activeLink);
          }
        } catch (error) {
          console.error("Error fetching batches", error);
          setBatches([]); // Set batches to an empty array on error
        }
      }
    };

    fetchBatches();

    const interval = setInterval(() => {
      fetchBatches();
    }, 5000); // Refreshes every 30 seconds

    return () => clearInterval(interval);
  }, [activeLink, centras]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const notificationsData = await getNotifications();
        setNotifications(notificationsData);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setNotifications([]);
      }
    };

    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 5000); // Refresh notifications every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const toggleNav = () => setIsOpen(!isOpen);
  const handleLinkClick = (link) => {
    setActiveLink(link);
    setDropdownStates([]);
  };

  const handleNotificationClick = () => {
    setIsNotificationModalOpen(!isNotificationModalOpen);
    document.body.classList.add('no-scroll');
  };
  const closeNotificationModal = () => {
    setIsNotificationModalOpen(false);
    document.body.classList.remove('no-scroll');
  };
  const handleWarehouseClick = () => setIsWarehouseModalOpen(!isWarehouseModalOpen);
  const closeWarehouseModal = () => setIsWarehouseModalOpen(false);

  const handleNotificationClose = (id) => setNotifications(notifications.filter(notification => notification.id !== id));
  const handleClearAllNotifications = () => setNotifications([]);

  const handleConfirmWarehouse = (selectedBatches) => {
    console.log("Batches sent to warehouse:", selectedBatches);
    const remainingBatches = batches.filter(batch => !selectedBatches.includes(batch.Batch_ID));
    const archivedBatchesToAdd = completedBatches.filter(batch => selectedBatches.includes(batch.Batch_ID));
    setArchivedBatches([...archivedBatches, ...archivedBatchesToAdd]);
    setCompletedBatches([]);
    setBatches(remainingBatches);
    closeWarehouseModal();
  };

  const handleOpenStepPopup = (batch, stepIndex) => {
    if (stepIndex === 1 && batch.WetWeight === null && batch.Status !== "Wet Leaves") {
      alert("Wet Weight Not Set Yet");
      return;
    }
    else if (stepIndex === 2 && batch.DryWeight === null && batch.Status !== "Dry Leaves") {
      alert("Dry Weight Not Set Yet");
      return;
    }
    else if (stepIndex === 3 && batch.PowderWeight === null && batch.Status !== "Flour Leaves") {
      alert("Powder Weight Not Set Yet");
      return;
    }
    else if (stepIndex === 4 && batch.Package_ID === null){
       alert("Delivery has not arrived yet");
       return;
     }
    else if(stepIndex === 5 && batch.Status !== "Rescale" ){
      alert("Package not yet received");
      return;
    }
    else if (stepIndex > 0 && !batch.steps[stepIndex - 1].completed) {
      alert("Please complete the previous steps first.");
      return;
    }
    setSelectedBatch(batch);
    setSelectedStepIndex(stepIndex);
    setStepPopupOpen(true);
  };

  const handleCloseStepPopup = () => {
    setStepPopupOpen(false);
    setSelectedBatch(null);
    setSelectedStepIndex(null);
  };

  const completeStep = async () => {
    const updatedBatches = batches.map(batch => {
      if (batch.Batch_ID === selectedBatch.Batch_ID) {
        const updatedSteps = batch.steps.map((step, index) =>
          index === selectedStepIndex ? { ...step, completed: true } : step
        );
        const allStepsCompleted = updatedSteps.every(step => step.completed);
        if (allStepsCompleted && !completedBatches.includes(batch.Batch_ID)) {
          setCompletedBatches([...completedBatches, batch]);
        }
        return { ...batch, steps: updatedSteps };
      }
      return batch;
    });

    // Make sure to update the batch status in the backend if stepIndex is 4
    if (selectedStepIndex === 4) {
      try {
        await updateBatch(selectedBatch.Batch_ID, { step: 'Rescale', weight: selectedBatch.WeightRescale });
      } catch (error) {
        console.error('Error updating batch status:', error);
      }
    }

    setBatches(updatedBatches);
    handleCloseStepPopup();
  };

  const handleArchiveClick = () => setIsArchiveOpen(true);
  const closeArchive = () => setIsArchiveOpen(false);

  const toggleProfileDropdown = () => setIsProfileDropdownOpen(!isProfileDropdownOpen);

  return (
    <div>
      {!isArchiveOpen && (
        <>
          <div className={`sidenav ${isOpen ? 'open' : 'closed'}`}>
            {isOpen && (
              <div>
                <div className="logo">
                  <img src={MoralmLogo} alt="Moralm Logo" className="moralmlogo" />
                </div>
                {centras.length === 0 ? (
                  <div>Loading...</div>
                ) : (
                  centras.map((centra) => (
                    <a
                      key={centra.Centra_ID}
                      href="#"
                      className={activeLink === centra.CentraName ? 'active' : ''}
                      onClick={() => handleLinkClick(centra.CentraName)}
                    >
                      {centra.CentraName}
                    </a>
                  ))
                )}
              </div>
            )}
          </div>
          <div className={`overlay ${isOpen ? 'open' : ''}`} onClick={toggleNav}></div>
        </>
      )}
      <div className={`content-container ${isArchiveOpen ? 'archive-open' : 'archive-closed'}`}>
        {!isArchiveOpen && <h2 className='ProcessTitle'>Batch Progress</h2>}
        <div className = {`icon-container-burger ${isArchiveOpen ? 'archive-open':'archive-closed'}`}>
            <img src={Burger} alt= 'Burger' className={`IconBurger ${isArchiveOpen ? 'archive-open':'archive-closed'}`} onClick={toggleNav}/>
        </div>
        <div className="top-right-buttons">
          <div className="icon-container" onClick={handleNotificationClick}>
            <img src={NotifBellLogo} alt="Notifications" className="icon" />
          </div>
          <div className="icon-container" onClick={handleWarehouseClick}>
            <img src={ShopCartLogo} alt="Shopping Cart" className="icon" />
          </div>
          <div className="icon-container" onClick={handleArchiveClick}>
            <img src={ArchiveLogo} alt="Archive" className="icon-archive" />
          </div>
          <div className="icon-container-profile" onClick={toggleProfileDropdown}>
            <div className="profile-arrow-button">
              <img src={UserLogo} alt="User" className="User" />
              <img src={ArrowLogo} alt="Arrow" className="icon arrow" />
            </div>
            {isProfileDropdownOpen && (
              <div className="dropdown-menu-profile">
                <div className="dropdown-item-profile">Profile</div>
                <div className="separator"></div>
                <div className="dropdown-item-profile logout" onClick={handleLogout}>
                  Logout
                  <img src={LogoutIcon} className='LogoutIcon'/>
                </div>
              </div>
            )}
          </div>
        </div>
        <NotificationsModal
          isActive={isNotificationModalOpen}
          onClose={closeNotificationModal}
          notifications={notifications}
          onNotificationClose={handleNotificationClose}
          onClearAllNotifications={handleClearAllNotifications}
        />
        <WarehouseModal
          isActive={isWarehouseModalOpen}
          onClose={closeWarehouseModal}
          batches={rescaleBatches} // Pass only rescale batches
          onConfirm={handleConfirmWarehouse}
        />
        {isArchiveOpen ? (
          <Archive 
          archivedBatches={archivedBatches}
          onBackClick={closeArchive}/>
        ) : (
          <>
            {batches.length === 0 ? (
              <div className="no-batches-message">No batches available</div>
            ) : (
              batches.map((batch, index) => (
                <div key={batch.Batch_ID} className="batch-row">
                  <div className="batch-title">
                    <div className="column-header">Batch {batch.Batch_ID}</div>
                  </div>
                  <div className="batch-content">
                    {batch.steps.map((step, stepIndex) => (
                      <div key={stepIndex} className={`step-container ${step.completed ? 'completed' : ''}`}
                        onClick={() => handleOpenStepPopup(batch, stepIndex)}>
                        <div className="step-circle">{stepIndex + 1}</div>
                        <div className="step-name">{step.step}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
            {stepPopupOpen && selectedBatch && (
              <StepPopUp
                batch={selectedBatch}
                stepIndex={selectedStepIndex}
                onClose={handleCloseStepPopup}
                onConfirm={completeStep}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
