import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeftIcon, TruckIcon, ScaleIcon, RulerIcon, InfoIcon } from 'lucide-react';

const machineurl = "https://pub-4aaf0de1afcc494fb5f9a408ec4711b7.r2.dev";
const instrumenturl = "https://pub-bad3ff0b003e4cfa9d266bdf59521d9b.r2.dev";

export default function Details() {
  const router = useRouter();
  const { name, type } = router.query;
  const [loading, setLoading] = useState(true);
  const [machineData, setMachineData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!name || !type) return;

    if (type === 'instruments') {
      // For instruments, we don't need to fetch any data
      setLoading(false);
    } else {
      // Only fetch data for machines
      const cleanName = name.replace(/\.[^/.]+$/, '');
      setLoading(true);
      fetch(`/api/machines/singledesc/${cleanName}`)
        .then(res => res.json())
        .then(data => {
          setMachineData(data.data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching machine details:', err);
          setError('Failed to load machine details');
          setLoading(false);
        });
    }
  }, [name, type]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const renderSpecifications = (specs, level = 0) => {
    return (
      <ul className={`pl-${level * 4} space-y-2`}>
        {Object.entries(specs).map(([key, value]) => (
          <li key={key} className="flex flex-col">
            <span className="text-gray-700 font-medium">{key}</span>
            {typeof value === 'string' || typeof value === 'number' ? (
              <span className="text-gray-900">{value}</span>
            ) : (
              renderSpecifications(value, level + 1)
            )}
          </li>
        ))}
      </ul>
    );
  };

  const renderInstrumentDetails = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-gray-100 rounded-lg overflow-hidden">
        <img
          src={`${instrumenturl}/${encodeURIComponent(name)}`}
          alt={name.replace(/\.[^/.]+$/, '')}
          className="w-full h-auto object-cover"
          loading="lazy"
        />
      </div>

      <div>
        <div className="mb-6">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mb-2">
            Instrument
          </span>
          <h1 className="text-3xl font-bold text-gray-900">
            Instrument {name.replace(/\.[^/.]+$/, '')}
          </h1>
        </div>
      </div>
    </div>
  );

  const renderMachineDetails = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-gray-100 rounded-lg overflow-hidden">
        <img
          src={`${machineurl}/${name}`}
          alt={machineData?.name}
          className="w-full h-auto object-cover"
          loading="lazy"
        />
      </div>

      <div>
        <div className="mb-6">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mb-2">
            {machineData?.name}
          </span>
          <h1 className="text-3xl font-bold text-gray-900">{machineData?.name}</h1>
        </div>

        <div className="border-t border-b border-gray-200 py-4 my-6">
          <h2 className="text-lg font-semibold mb-2">Description</h2>
          <p className="text-gray-700">{machineData?.metadata.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {'Dimensions' in (machineData?.metadata.specifications || {}) && typeof machineData?.metadata.specifications['Dimensions'] === 'string' && (
            <div className="flex items-start">
              <RulerIcon className="h-5 w-5 text-gray-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">Dimensions</h3>
                <p className="text-sm text-gray-500">{machineData?.metadata.specifications['Dimensions']}</p>
              </div>
            </div>
          )}

          {'Weight' in (machineData?.metadata.specifications || {}) && typeof machineData?.metadata.specifications['Weight'] === 'string' && (
            <div className="flex items-start">
              <ScaleIcon className="h-5 w-5 text-gray-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">Weight</h3>
                <p className="text-sm text-gray-500">{machineData?.metadata.specifications['Weight']}</p>
              </div>
            </div>
          )}

          {'Condition' in (machineData?.metadata.specifications || {}) && typeof machineData?.metadata.specifications['Condition'] === 'string' && (
            <div className="flex items-start">
              <InfoIcon className="h-5 w-5 text-gray-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">Condition</h3>
                <p className="text-sm text-gray-500">{machineData?.metadata.specifications['Condition']}</p>
              </div>
            </div>
          )}

          {'Availability' in (machineData?.metadata.specifications || {}) && typeof machineData?.metadata.specifications['Availability'] === 'string' && (
            <div className="flex items-start">
              <TruckIcon className="h-5 w-5 text-gray-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">Availability</h3>
                <p className="text-sm text-gray-500">{machineData?.metadata.specifications['Availability']}</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Technical Specifications</h2>
          <div className="bg-gray-50 rounded-lg p-4">
            {machineData?.metadata.specifications && renderSpecifications(machineData.metadata.specifications)}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to {type === 'instruments' ? 'Instruments' : 'Machines'}
          </button>
        </div>

        {type === 'instruments' ? renderInstrumentDetails() : renderMachineDetails()}

        <div className="mt-12 border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Additional Information</h2>
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Compatibility</h3>
            <p className="text-gray-700 mb-4">Contact us for detailed compatibility information.</p>
            <h3 className="text-lg font-semibold mb-4">Shipping & Handling</h3>
            <p className="text-gray-700">
              All products are carefully packaged to ensure safe delivery. For international shipping or special handling
              requirements, please contact our sales team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 