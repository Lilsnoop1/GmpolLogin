import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { r2Service } from '../lib/r2Service';
import toast from 'react-hot-toast';
import UploadForm from './upload';
import { SearchIcon, FilterIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('instruments');
  const [instruments, setInstruments] = useState([]);
  const [machines, setMachines] = useState([]);
  const [parts,setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  
  // New state for search, filter, and pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchInstruments();
    fetchMachines();
    fetchParts();
  }, [user, router]);

  const fetchInstruments = async () => {
    try {
      const data = await r2Service.listInstruments();
      setInstruments(data);
    } catch (error) {
      console.error('Error fetching instruments:', error);
      toast.error('Failed to fetch instruments');
    } finally {
      setLoading(false);
    }
  };
  const fetchParts = async () => {
    try {
      const data = await r2Service.listParts();
      setParts(data);
    } catch (error) {
      console.error('Error fetching Parts:', error);
      toast.error('Failed to fetch Parts');
    } finally {
      setLoading(false);
    }
  };

  const fetchMachines = async () => {
    try {
      const data = await r2Service.listMachines();
      setMachines(data);
    } catch (error) {
      console.error('Error fetching machines:', error);
      toast.error('Failed to fetch machines');
    }
  };

  const handleDelete = async (fileName) => {
    if (!confirm(`Are you sure you want to delete this ${activeTab === 'instruments' ? 'instrument' : activeTab==='machine'? 'machine': 'part'}?`)) return;

    try {
      if (activeTab === 'instruments') {
        await r2Service.deleteInstrument(fileName);
        toast.success('Instrument deleted successfully');
        fetchInstruments();
      }else if(activeTab==='parts'){
        await r2Service.deletePart(fileName);
        toast.success('Part deleted successfully');
        fetchParts();
      } else {
        await r2Service.deleteMachine(fileName);
        toast.success('Machine deleted successfully');
        fetchMachines();
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete file');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  // New functions for search, filter, and pagination
  const filteredItems = (activeTab === 'instruments' ? instruments : activeTab==='parts'? parts : machines)
    .filter(item => {
      const searchTerm = searchQuery.toLowerCase();
      const itemName = (item.metadata?.['machine-name'] || item.name.replace(/\.[^/.]+$/, '')).toLowerCase();
      const itemDescription = (item.metadata?.['machine-description'] || '').toLowerCase();
      const itemCategory = (item.metadata?.['machine-category'] || '').toLowerCase();
      
      return itemName.includes(searchTerm) || 
             itemDescription.includes(searchTerm) || 
             itemCategory.includes(searchTerm);
    })
    .sort((a, b) => {
      const aValue = a[sortBy] || '';
      const bValue = b[sortBy] || '';
      return sortOrder === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <nav className="bg-white shadow-md border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-bold text-blue-800">GMPOL Portal</h1>
              </div>
              <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                <button
                  onClick={() => {
                    setActiveTab('instruments');
                    setCurrentPage(1);
                    setSearchQuery('');
                  }}
                  className={`${
                    activeTab === 'instruments'
                      ? 'border-blue-600 text-blue-800'
                      : 'border-transparent text-gray-500 hover:border-blue-300 hover:text-blue-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
                >
                  Instruments
                </button>
                <button
                  onClick={() => {
                    setActiveTab('machines');
                    setCurrentPage(1);
                    setSearchQuery('');
                  }}
                  className={`${
                    activeTab === 'machines'
                      ? 'border-blue-600 text-blue-800'
                      : 'border-transparent text-gray-500 hover:border-blue-300 hover:text-blue-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
                >
                  Machines
                </button>
                <button
                  onClick={() => {
                    setActiveTab('parts');
                    setCurrentPage(1);
                    setSearchQuery('');
                  }}
                  className={`${
                    activeTab === 'parts'
                      ? 'border-blue-600 text-blue-800'
                      : 'border-transparent text-gray-500 hover:border-blue-300 hover:text-blue-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
                >
                  Parts
                </button>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-12 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex flex-col space-y-4 mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <h2 className="text-2xl font-semibold text-blue-800">
                {activeTab === 'instruments' ? 'Medical Instruments' : activeTab==='parts'? 'Medical Parts' : 'Medical Machines'}
              </h2>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  Upload New {activeTab === 'instruments' ? 'Instrument' : activeTab==='parts'? 'Parts' : 'Machine'}
                </button>
              </div>
            </div>

            {/* Search and Filter Section */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name, description, or category..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleSort('name')}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FilterIcon className="h-4 w-4 mr-2" />
                  Sort by Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
                <button
                  onClick={() => handleSort('lastModified')}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FilterIcon className="h-4 w-4 mr-2" />
                  Sort by Date {sortBy === 'lastModified' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
              </div>
            </div>
          </div>

          <UploadForm
            isOpen={isUploadModalOpen}
            onClose={() => setIsUploadModalOpen(false)}
            type={activeTab === 'instruments' ? 'instrument' : activeTab==='parts'?'part': 'machine'}
            onSuccess={() => {
              if (activeTab === 'instruments') {
                fetchInstruments();
              }else if(activeTab=='parts'){
                fetchParts();
              } else {
                fetchMachines();
              }
            }}
          />

          {/* Grid of Items */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedItems.map((item) => (
              <div
                key={item.name}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden border border-blue-100 transform hover:-translate-y-1 cursor-pointer"
                onClick={() => router.push({
                  pathname: '/details',
                  query: { 
                    name: item.name,
                    type: activeTab
                  }
                })}
              >
                <div className="relative group">
                  <img
                    src={(activeTab=='instruments'?"https://pub-bad3ff0b003e4cfa9d266bdf59521d9b.r2.dev/":activeTab=='parts'?"https://pub-f431682a7c9f419e9dbc31ec037e5d34.r2.dev/":"https://pub-4aaf0de1afcc494fb5f9a408ec4711b7.r2.dev/")+item.name}
                    alt={item.metadata?.['machine-name'] || item.name.replace(/\.[^/.]+$/, '')}
                    className="w-full h-48 object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                  {item.metadata?.['machine-category'] && (
                    <span className="absolute top-2 right-2 px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
                      {item.metadata['machine-category']}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">
                    {item.metadata?.['machine-name'] || item.name.replace(/\.[^/.]+$/, '')}
                  </h3>
                  {item.metadata?.['machine-description'] && (
                    <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                      {item.metadata['machine-description']}
                    </p>
                  )}
                  <div className="flex justify-between items-center mt-4">
                    <p className="text-xs text-gray-500">
                      Last modified: {new Date(item.lastModified).toLocaleDateString()}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.name);
                      }}
                      className="text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-md px-2 py-1 text-sm font-medium transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeftIcon className="h-4 w-4 mr-1" />
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRightIcon className="h-4 w-4 ml-1" />
              </button>
            </div>
          )}

          {/* No Results Message */}
          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No {activeTab} found matching your search criteria.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 