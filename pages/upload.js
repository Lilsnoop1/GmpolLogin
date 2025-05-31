import React, { useState, useRef } from 'react';
import { PlusIcon, TrashIcon, XIcon, UploadIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const UploadForm = ({ isOpen, onClose, type, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    features: [{ name: '', feature: '' }],
    specifications: [{ name: '', value: '', isNested: false, subSpecs: [] }]
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleFeatureChange = (index, field, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index][field] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, { name: '', feature: '' }]
    });
  };

  const removeFeature = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  const handleSpecChange = (index, field, value) => {
    const newSpecs = [...formData.specifications];
    newSpecs[index][field] = value;
    setFormData({ ...formData, specifications: newSpecs });
  };

  const toggleNestedSpec = (index) => {
    const newSpecs = [...formData.specifications];
    newSpecs[index].isNested = !newSpecs[index].isNested;
    if (newSpecs[index].isNested) {
      newSpecs[index].subSpecs = [{ name: '', value: '' }];
    } else {
      newSpecs[index].subSpecs = [];
    }
    setFormData({ ...formData, specifications: newSpecs });
  };

  const handleSubSpecChange = (specIndex, subSpecIndex, field, value) => {
    const newSpecs = [...formData.specifications];
    newSpecs[specIndex].subSpecs[subSpecIndex][field] = value;
    setFormData({ ...formData, specifications: newSpecs });
  };

  const addSubSpec = (specIndex) => {
    const newSpecs = [...formData.specifications];
    newSpecs[specIndex].subSpecs.push({ name: '', value: '' });
    setFormData({ ...formData, specifications: newSpecs });
  };

  const removeSubSpec = (specIndex, subSpecIndex) => {
    const newSpecs = [...formData.specifications];
    newSpecs[specIndex].subSpecs = newSpecs[specIndex].subSpecs.filter((_, i) => i !== subSpecIndex);
    setFormData({ ...formData, specifications: newSpecs });
  };

  const addSpecification = () => {
    setFormData({
      ...formData,
      specifications: [...formData.specifications, { name: '', value: '', isNested: false, subSpecs: [] }]
    });
  };

  const removeSpecification = (index) => {
    const newSpecs = formData.specifications.filter((_, i) => i !== index);
    setFormData({ ...formData, specifications: newSpecs });
  };

  const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    setSelectedFile(file);

    const extension = file.name.split('.').pop(); // get the extension
    setFormData(prev => ({
      ...prev,
      extension: extension // add it to the form data
    }));
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading('Uploading...');

    try {
      // First upload the file
      const formDataFile = new FormData();
      formDataFile.append('file', selectedFile);

      if (type === 'machine') {
        const fileResponse = await fetch('/api/machines/upload', {
          method: 'POST',
          body: formDataFile,
        });
        if (!fileResponse.ok) {
          throw new Error('Failed to upload file');
        }
        const { url } = await fileResponse.json();
        // Then upload the description with the file URL
        const response = await fetch('/api/machines/descriptions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            url,
            type // Add type to distinguish between instruments and machines
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to upload description');
        }

        toast.success('Upload successful!', {
          id: loadingToast,
        });
      } else if (type === 'instrument') {
        formDataFile.append('name', formData.name);
        const fileResponse = await fetch('/api/instruments/upload', {
          method: 'POST',
          body: formDataFile,
        });
        if (!fileResponse.ok) {
          throw new Error('Failed to upload file');
        }
        setSelectedFile(null);
        toast.success('Upload successful!', {
          id: loadingToast,
        });
      }

      // Reset form after successful upload
      setFormData({
        name: '',
        description: '',
        features: [{ name: '', feature: '' }],
        specifications: [{ name: '', value: '', isNested: false, subSpecs: [] }]
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onClose();
      
      // Call the onSuccess callback to refresh the parent component's data
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || 'An error occurred', {
        id: loadingToast,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Upload New {type === 'machine' ? 'Machine' : 'Instrument'}</h1>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <XIcon className="h-6 w-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Selection */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                id="file-upload"
                onChange={handleFileSelect}
                className="hidden"
                accept="image/*"
                ref={fileInputRef}
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
              >
                <UploadIcon className="h-5 w-5 mr-2" />
                {selectedFile ? 'Change File' : 'Select File'}
              </label>
              {selectedFile && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected file: {selectedFile.name}
                </p>
              )}
            </div>

            {/* Basic Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            {type === 'machine' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Features Section */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium text-gray-900">Features</h2>
                    <button
                      type="button"
                      onClick={addFeature}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <PlusIcon className="h-4 w-4 mr-1" />
                      Add Feature
                    </button>
                  </div>

                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex gap-4 mb-4">
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Feature Name"
                          value={feature.name}
                          onChange={(e) => handleFeatureChange(index, 'name', e.target.value)}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Feature Description"
                          value={feature.feature}
                          onChange={(e) => handleFeatureChange(index, 'feature', e.target.value)}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                      </div>
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="p-2 text-red-600 hover:text-red-800"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Specifications Section */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium text-gray-900">Specifications</h2>
                    <button
                      type="button"
                      onClick={addSpecification}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <PlusIcon className="h-4 w-4 mr-1" />
                      Add Specification
                    </button>
                  </div>

                  {formData.specifications.map((spec, specIndex) => (
                    <div key={specIndex} className="mb-6 p-4 border rounded-lg">
                      <div className="flex gap-4 mb-4">
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="Specification Name"
                            value={spec.name}
                            onChange={(e) => handleSpecChange(specIndex, 'name', e.target.value)}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <div className="flex items-center">
                          <label className="inline-flex items-center">
                            <input
                              type="checkbox"
                              checked={spec.isNested}
                              onChange={() => toggleNestedSpec(specIndex)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-600">Nested Specification</span>
                          </label>
                        </div>
                        {specIndex > 0 && (
                          <button
                            type="button"
                            onClick={() => removeSpecification(specIndex)}
                            className="p-2 text-red-600 hover:text-red-800"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        )}
                      </div>

                      {spec.isNested ? (
                        <div className="ml-4">
                          {spec.subSpecs.map((subSpec, subSpecIndex) => (
                            <div key={subSpecIndex} className="flex gap-4 mb-4">
                              <div className="flex-1">
                                <input
                                  type="text"
                                  placeholder="Sub-specification Name"
                                  value={subSpec.name}
                                  onChange={(e) => handleSubSpecChange(specIndex, subSpecIndex, 'name', e.target.value)}
                                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                  required
                                />
                              </div>
                              <div className="flex-1">
                                <input
                                  type="text"
                                  placeholder="Sub-specification Value"
                                  value={subSpec.value}
                                  onChange={(e) => handleSubSpecChange(specIndex, subSpecIndex, 'value', e.target.value)}
                                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                  required
                                />
                              </div>
                              {subSpecIndex > 0 && (
                                <button
                                  type="button"
                                  onClick={() => removeSubSpec(specIndex, subSpecIndex)}
                                  className="p-2 text-red-600 hover:text-red-800"
                                >
                                  <TrashIcon className="h-5 w-5" />
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => addSubSpec(specIndex)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100"
                          >
                            <PlusIcon className="h-4 w-4 mr-1" />
                            Add Sub-specification
                          </button>
                        </div>
                      ) : (
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="Specification Value"
                            value={spec.value}
                            onChange={(e) => handleSpecChange(specIndex, 'value', e.target.value)}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadForm; 