import React, { useEffect, useState } from 'react';
import './Archive.css';
import BackButton from './assets/backbutton3.png';
import { getWarehouseBatches } from './apiService';

function Archive({ archivedBatches = [], onBackClick }) {
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    // Fetch warehouse batches from the API
    const fetchBatches = async () => {
      try {
        const data = await getWarehouseBatches();
        setBatches(data);
      } catch (error) {
        console.error('Error fetching warehouse batches:', error);
        setBatches([]);
      }
    };
    fetchBatches();
  }, []);

  return (
    <div className="archive-content">
      <div className="header">
        <img src={BackButton} alt='BackButton' className='BackButton' onClick={onBackClick} />
        <h2 className="Historytitle">Warehouse Batches</h2>
      </div>
      <div className="table-container">
        <table className="history-table">
          <thead>
            <tr>
              <th>Batch ID</th>
              <th>Raw Weight</th>
              <th>In Time Raw</th>
              <th>In Time Wet</th>
              <th>Out Time Wet</th>
              <th className="scrollable">Wet Weight</th>
              <th className="scrollable">In Time Dry</th>
              <th className="scrollable">Out Time Dry</th>
              <th className="scrollable">Dry Weight</th>
              <th className="scrollable">In Time Powder</th>
              <th className="scrollable">Out Time Powder</th>
              <th className="scrollable">Powder Weight</th>
              <th className="scrollable">Status</th>
              <th className="scrollable">Package ID</th>
              <th className="scrollable">Weight Rescale</th>
            </tr>
          </thead>
          <tbody>
            {batches.map(batch => (
              <tr key={batch.Batch_ID}>
                <td>{batch.Batch_ID}</td>
                <td>{batch.RawWeight}</td>
                <td>{new Date(batch.InTimeRaw).toLocaleString()}</td>
                <td>{new Date(batch.InTimeWet).toLocaleString()}</td>
                <td>{new Date(batch.OutTimeWet).toLocaleString()}</td>
                <td className="scrollable">{batch.WetWeight}</td>
                <td className="scrollable">{new Date(batch.InTimeDry).toLocaleString()}</td>
                <td className="scrollable">{new Date(batch.OutTimeDry).toLocaleString()}</td>
                <td className="scrollable">{batch.DryWeight}</td>
                <td className="scrollable">{new Date(batch.InTimePowder).toLocaleString()}</td>
                <td className="scrollable">{new Date(batch.OutTimePowder).toLocaleString()}</td>
                <td className="scrollable">{batch.PowderWeight}</td>
                <td className="scrollable">{batch.Status}</td>
                <td className="scrollable">{batch.Package_ID}</td>
                <td className="scrollable">{batch.WeightRescale}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Archive;
