import React, { useState } from 'react';
import './Warehouse.css';
import { updateBatchesStatus } from './apiService'; // Add this import

const WarehouseModal = ({ isActive, onClose, batches, onConfirm }) => {
    const [selectedBatches, setSelectedBatches] = useState([]);

    if (!isActive) return null;

    const handleSelectBatch = (batchId) => {
        setSelectedBatches(prevSelected =>
            prevSelected.includes(batchId)
                ? prevSelected.filter(id => id !== batchId)
                : [...prevSelected, batchId]
        );
    };

    const handleSelectAll = () => {
        if (selectedBatches.length === batches.length) {
            setSelectedBatches([]);
        } else {
            setSelectedBatches(batches.map(batch => batch.Batch_ID));
        }
    };

    const sendSelectedToWarehouse = async () => {
        try {
            await updateBatchesStatus(selectedBatches); // Call the API to update status
            onConfirm(selectedBatches); // Update the state in the parent component
        } catch (error) {
            console.error("Error updating batch status", error);
        }
    };

    return (
        <div className="warehouse-modal-overlay" onClick={onClose}>
            <div className="warehouse-modal-content" onClick={e => e.stopPropagation()}>
                <div className="warehouse-modal-header">
                    <span className="AllPackageTitle">All Packages</span>
                    <button className="warehouse-close-button" onClick={onClose}>&times;</button>
                </div>
                <div className="warehouse-modal-body">
                    <table className="warehouse-table">
                        <thead>
                            <tr>
                                <th className='Check'>
                                    <input
                                        type="checkbox"
                                        className="warehouse-select-all-checkbox"
                                        checked={selectedBatches.length === batches.length && batches.length > 0}
                                        onChange={handleSelectAll}
                                    />
                                </th>
                                <th>Batch ID</th>
                                <th>Hewan (kg)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {batches.length > 0 ? (
                                batches.map((batch) => (
                                    <tr key={batch.Batch_ID} className={selectedBatches.includes(batch.Batch_ID) ? 'selected' : ''}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedBatches.includes(batch.Batch_ID)}
                                                onChange={() => handleSelectBatch(batch.Batch_ID)}
                                            />
                                        </td>
                                        <td>{batch.Batch_ID}</td>
                                        <td>{batch.WeightRescale}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="no-packages">There are no packages</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {batches.length > 0 && (
                    <div className="warehouse-modal-footer">
                        <button className="warehouse-confirm-button" onClick={sendSelectedToWarehouse}>Deliver Selected</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WarehouseModal;

