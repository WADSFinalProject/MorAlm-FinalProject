import React, { useState, useEffect } from 'react';
import './StepPopUp.css';
import { updateBatch, readDeliveryByPackageId } from './apiService'; // Import the updateBatch and readDeliveryByPackageId functions

const StepPopUp = ({ batch, stepIndex, onClose, onConfirm }) => {
  const step = batch.steps[stepIndex];
  let confirmTitle = '';

  const [rescaleWeight, setRescaleWeight] = useState(batch.WeightRescale || '');
  const [expeditionType, setExpeditionType] = useState('N/A'); // State to hold the expedition type

  switch (stepIndex) {
    case 4:
      confirmTitle = 'Received'; 
      break;
    case 5:
      confirmTitle = 'Add to list'; 
      break;    
    default:
      confirmTitle = 'Close';
      break;
  }

  useEffect(() => {
    const fetchDeliveryDetails = async () => {
      if (batch.Package_ID) {
        try {
          const delivery = await readDeliveryByPackageId(batch.Package_ID);
          setExpeditionType(delivery.ExpeditionType);
        } catch (error) {
          console.error('Error fetching delivery details:', error);
        }
      }
    };

    if (stepIndex === 4) {
      fetchDeliveryDetails();
    }
  }, [batch.Package_ID, stepIndex]);

  const handleConfirm = async () => {
    if (stepIndex === 4) {
      try {
        await updateBatch(batch.Batch_ID, { step: 'Rescale', weight: batch.WeightRescale });
        console.log("Batch status updated to 'Rescale'");
      } catch (error) {
        console.error('Error updating batch status:', error);
      }
    } else if (stepIndex === 5) {
      try {
        await updateBatch(batch.Batch_ID, { step: 'Rescale', weight: rescaleWeight });
        console.log("Batch weight rescale updated");
      } catch (error) {
        console.error('Error updating batch weight rescale:', error);
      }
    }
    onConfirm();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-body">
          {stepIndex === 0 && (
            <div className="modal-field">
              <label className="modal-label">Gather Leaves Weight: {batch.RawWeight} kg</label>
              <div className="modal-number">In Time Raw: {batch.InTimeRaw ? new Date(batch.InTimeRaw).toLocaleString(): 'N/A'}</div>
            </div>
          )}
          {stepIndex === 1 && (
            <div className="modal-field">
              <label className="modal-label">Wet Leaves Weight: {batch.WetWeight} kg</label>
              <div className="modal-number">In Time Wet: {batch.InTimeWet ? new Date(batch.InTimeWet).toLocaleString():'N/A'}</div>
              <div className="modal-number">Out Time Wet: {batch.OutTimeWet ? new Date(batch.OutTimeWet).toLocaleString():'N/A'}</div>             
            </div>
          )}
          {stepIndex === 2 && (
            <div className="modal-field">
              <label className="modal-label">Dry Leaves Weight: {batch.DryWeight} kg</label>
              <div className="modal-number">In Time Dry: {batch.InTimeDry ? new Date(batch.InTimeDry).toLocaleString(): 'N/A'}</div>
              <div className="modal-number">Out Time Dry: {batch.OutTimeDry ? new Date(batch.OutTimeDry).toLocaleString() : 'N/A'}</div>             
            </div>
          )}
          {stepIndex === 3 && (
            <div className="modal-field">
              <label className="modal-label">Powdered Leaves Weight: {batch.PowderWeight} kg</label>
              <div className="modal-number">In Time Powder: {batch.InTimePowder ? new Date(batch.InTimePowder).toLocaleString() : 'N/A'}</div>
              <div className="modal-number">Out Time Powder: {batch.OutTimePowder ? new Date(batch.OutTimePowder).toLocaleString() : 'N/A'}</div>             
            </div>
          )}
          {stepIndex === 4 && (
            <div className="modal-field">
              <label className="modal-label">Package Data</label>
              <div className="modal-number">Package ID: {batch.Package_ID}</div>
              <div className="modal-number">Expedition: {expeditionType}</div>            
            </div>
          )}
          {stepIndex === 5 && (
            <div className="modal-field">
              <label className="modal-label">Leaves Data Form</label>
              <label className="modal-label">Rescale Weight</label>
              <div className="modal-input">
                <input
                  type="number"
                  placeholder="Weight (kg)"
                  className="modal-input-field"
                  value={rescaleWeight}
                  onChange={(e) => setRescaleWeight(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
        <div className="modal-footer">
          {stepIndex === 5 ? (
            <>
              <button onClick={handleConfirm} className="confirm-button">{confirmTitle}</button>
            </>
          ) : (
            <button onClick={handleConfirm} className="confirm-button">{confirmTitle}</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepPopUp;
