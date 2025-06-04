import { S3Client, ListObjectsV2Command, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { machine_Description } from './description';

const R2_CONFIG = {
  endpoint: process.env.R2_ENDPOINT,
  region: 'auto',
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
};

const s3Client = new S3Client(R2_CONFIG);

export const r2Service = {
  async listInstruments() {
    try {
      const response = await fetch('/api/instruments');
      if (!response.ok) {
        throw new Error('Failed to fetch instruments');
      }
      return response.json();
    } catch (error) {
      console.error('Error listing instruments:', error);
      throw error;
    }
  },
  async listParts() {
    try {
      const response = await fetch('/api/parts');
      if (!response.ok) {
        throw new Error('Failed to fetch instruments');
      }
      return response.json();
    } catch (error) {
      console.error('Error listing Parts:', error);
      throw error;
    }
  },
  async uploadParts(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/parts/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload Part');
      }

      return response.json();
    } catch (error) {
      console.error('Error uploading Part:', error);
      throw error;
    }
  },
  async deletePart(fileName) {
    try {
      const response = await fetch(`/api/parts/delete?fileName=${encodeURIComponent(fileName)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete instrument');
      }

      return response.json();
    } catch (error) {
      console.error('Error deleting instrument:', error);
      throw error;
    }
  },

  async uploadInstrument(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/instruments/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload instrument');
      }

      return response.json();
    } catch (error) {
      console.error('Error uploading instrument:', error);
      throw error;
    }
  },

  async deleteInstrument(fileName) {
    try {
      const response = await fetch(`/api/instruments/delete?fileName=${encodeURIComponent(fileName)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete instrument');
      }

      return response.json();
    } catch (error) {
      console.error('Error deleting instrument:', error);
      throw error;
    }
  },

  // Machine-related functions
  async listMachines() {
    try {
      const response = await fetch('/api/machines');
      if (!response.ok) {
        throw new Error('Failed to fetch machines');
      }
      return response.json();
    } catch (error) {
      console.error('Error listing machines:', error);
      throw error;
    }
  },

  async uploadMachine(file, metadata = {}) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Find matching machine description
      const fileName = file.name.replace(/\.[^/.]+$/, '');
      const machineInfo = machine_Description.find(m => 
        m.name.toLowerCase() === fileName.toLowerCase() || 
        m.device_name?.toLowerCase() === fileName.toLowerCase()
      );

      if (machineInfo) {
        formData.append('name', machineInfo.name || machineInfo.device_name);
        formData.append('category', machineInfo.category || 'Uncategorized');
        formData.append('description', machineInfo.description || 'No description available');
      } else {
        // Fallback to provided metadata or defaults
        formData.append('name', metadata.name || fileName);
        formData.append('category', metadata.category || 'Uncategorized');
        formData.append('description', metadata.description || 'No description available');
      }

      const response = await fetch('/api/machines/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload machine');
      }

      return response.json();
    } catch (error) {
      console.error('Error uploading machine:', error);
      throw error;
    }
  },

  async deleteMachine(fileName) {
    try {
      const response = await fetch(`/api/machines/delete?fileName=${encodeURIComponent(fileName)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete machine');
      }

      return response.json();
    } catch (error) {
      console.error('Error deleting machine:', error);
      throw error;
    }
  },
}; 