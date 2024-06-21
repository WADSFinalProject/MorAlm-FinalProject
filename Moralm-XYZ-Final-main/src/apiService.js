import axios from 'axios';

// Create an instance of axios with a base URL
const apiClient = axios.create({
  baseURL: 'http://localhost:8000', // Change this to your actual API base URL
  headers: {
    'Content-Type': 'application/json'
  }
});

// Function to get all centras
export const getCentras = async () => {
  try {
    const response = await apiClient.get('/centra/');
    return response.data;
  } catch (error) {
    console.error('Error fetching centras:', error);
    throw error;
  }
};

// Function to get batches by centra ID
export const getBatchesByCentraId = async (centraId) => {
  try {
    const response = await apiClient.get(`/api/batches/${centraId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching batches for centra ID ${centraId}:`, error);
    throw error;
  }
};

// Function to create a new centra
export const createCentra = async (centraData) => {
  try {
    const response = await apiClient.post('/centra/', centraData);
    return response.data;
  } catch (error) {
    console.error('Error creating centra:', error);
    throw error;
  }
};

// Function to read centras
export const readCentras = async (skip = 0, limit = 100) => {
  try {
    const response = await apiClient.get(`/centra?skip=${skip}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error reading centras:', error);
    throw error;
  }
};

// Function to read a specific centra by ID
export const readCentraById = async (centraId) => {
  try {
    const response = await apiClient.get(`/centra/${centraId}`);
    return response.data;
  } catch (error) {
    console.error(`Error reading centra by ID ${centraId}:`, error);
    throw error;
  }
};

// Function to update a centra
export const updateCentra = async (centraId, centraData) => {
  try {
    const response = await apiClient.put(`/centra/${centraId}`, centraData);
    return response.data;
  } catch (error) {
    console.error(`Error updating centra by ID ${centraId}:`, error);
    throw error;
  }
};

// Function to delete a centra
export const deleteCentra = async (centraId) => {
  try {
    const response = await apiClient.delete(`/centra/${centraId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting centra by ID ${centraId}:`, error);
    throw error;
  }
};

// Function to create a new delivery
export const createDelivery = async (deliveryData) => {
  try {
    const response = await apiClient.post('/delivery/', deliveryData);
    return response.data;
  } catch (error) {
    console.error('Error creating delivery:', error);
    throw error;
  }
};

// Function to read deliveries
export const readDeliveries = async (skip = 0, limit = 100) => {
  try {
    const response = await apiClient.get(`/delivery?skip=${skip}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error reading deliveries:', error);
    throw error;
  }
};

// Function to read a specific delivery by package ID
export const readDeliveryByPackageId = async (packageId) => {
  try {
    const response = await apiClient.get(`/delivery/${packageId}`);
    return response.data;
  } catch (error) {
    console.error(`Error reading delivery by package ID ${packageId}:`, error);
    throw error;
  }
};

// Function to update a delivery
export const updateDelivery = async (packageId, deliveryData) => {
  try {
    const response = await apiClient.put(`/delivery/${packageId}`, deliveryData);
    return response.data;
  } catch (error) {
    console.error(`Error updating delivery by package ID ${packageId}:`, error);
    throw error;
  }
};

// Function to delete a delivery
export const deleteDelivery = async (packageId) => {
  try {
    const response = await apiClient.delete(`/delivery/${packageId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting delivery by package ID ${packageId}:`, error);
    throw error;
  }
};

// Function to create a new batch
export const createBatch = async (batchData) => {
  try {
    const response = await apiClient.post('/batch/', batchData);
    return response.data;
  } catch (error) {
    console.error('Error creating batch:', error);
    throw error;
  }
};

// Function to read batches
export const readBatches = async (skip = 0, limit = 100) => {
  try {
    const response = await apiClient.get(`/batch?skip=${skip}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error reading batches:', error);
    throw error;
  }
};

// Function to read a specific batch by ID
export const readBatchById = async (batchId) => {
  try {
    const response = await apiClient.get(`/batch/${batchId}`);
    return response.data;
  } catch (error) {
    console.error(`Error reading batch by ID ${batchId}:`, error);
    throw error;
  }
};

// Function to read a batch by package ID
export const readBatchByPackageId = async (packageId) => {
  try {
    const response = await apiClient.get(`/batch/package/${packageId}`);
    return response.data;
  } catch (error) {
    console.error(`Error reading batch by package ID ${packageId}:`, error);
    throw error;
  }
};

// Function to read a centra by batch ID
export const readCentraByBatchId = async (batchId) => {
  try {
    const response = await apiClient.get(`/centra/batch/${batchId}`);
    return response.data;
  } catch (error) {
    console.error(`Error reading centra by batch ID ${batchId}:`, error);
    throw error;
  }
};

// Function to update a batch
export const updateBatch = async (batchId, batchUpdateData) => {
  try {
    const response = await apiClient.put(`/batch/${batchId}`, batchUpdateData);
    return response.data;
  } catch (error) {
    console.error(`Error updating batch by ID ${batchId}:`, error);
    throw error;
  }
};

// Function to delete a batch
export const deleteBatch = async (batchId) => {
  try {
    const response = await apiClient.delete(`/batch/${batchId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting batch by ID ${batchId}:`, error);
    throw error;
  }
};

// Function to create a new batch with specific weight and centra ID
export const createNewBatch = async (weight, centraId) => {
  try {
    const response = await apiClient.post('/api/create_batch', { weight, centra_id: centraId });
    return response.data;
  } catch (error) {
    console.error('Error creating new batch:', error);
    throw error;
  }
};

// Add this function to apiService.js

// Function to get archived batches
export const getArchivedBatches = async () => {
  try {
    const response = await apiClient.get('/api/archived_batches');
    return response.data;
  } catch (error) {
    console.error('Error fetching archived batches:', error);
    throw error;
  }
};

// Function to get notifications
export const getNotifications = async () => {
  try {
    const response = await apiClient.get('/api/notifications');
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

export const deleteNotificationById = async (id) => {
  try {
    const response = await apiClient.delete(`/api/notifications/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting notification by ID ${id}:`, error);
    throw error;
  }
};

// Function to delete all notifications
export const deleteAllNotifications = async () => {
  try {
    const response = await apiClient.delete(`/api/notifications`);
    return response.data;
  } catch (error) {
    console.error('Error deleting all notifications:', error);
    throw error;
  }
};

// Function to get warehouse batches
export const getWarehouseBatches = async () => {
  try {
    const response = await apiClient.get('/api/warehouse_batches');
    return response.data;
  } catch (error) {
    console.error('Error fetching warehouse batches:', error);
    throw error;
  }
};

export const updateBatchesStatus = async (batchIds) => {
  try {
    const response = await apiClient.put('/batches/update_status', batchIds);
    return response.data;
  } catch (error) {
    console.error('Error updating batches status:', error);
    throw error;
  }
};
