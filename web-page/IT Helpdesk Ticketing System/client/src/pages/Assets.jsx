import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Monitor, Smartphone, Keyboard, Mouse, Headphones,
  Printer, Box, X, CheckCircle, AlertCircle
} from 'lucide-react';
import { fetchAssets, createAsset } from '../redux/slices/assetSlice';
import { toast } from '../components/ui/Toast';

const categoryIcons = {
  laptop: Monitor,
  monitor: Monitor,
  phone: Smartphone,
  keyboard: Keyboard,
  mouse: Mouse,
  headset: Headphones,
  printer: Printer,
  other: Box
};

const statusStyles = {
  available: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
  assigned: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
  maintenance: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
  retired: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
};

const Assets = () => {
  const dispatch = useDispatch();
  const { items: assets, pagination, isLoading } = useSelector((state) => state.assets);
  const { user } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filters, setFilters] = useState({ status: '', category: '', search: '' });
  const [page, setPage] = useState(1);
  const [newAsset, setNewAsset] = useState({
    name: '', type: '', serialNumber: '', category: 'laptop',
    status: 'available', location: '', purchaseDate: '', warrantyExpiry: '', notes: ''
  });

  useEffect(() => {
    dispatch(fetchAssets({ page, ...filters }));
  }, [dispatch, page, filters]);

  const handleCreateAsset = () => {
    dispatch(createAsset(newAsset)).then((res) => {
      if (!res.error) {
        toast.success('Asset created successfully');
        setShowCreateModal(false);
        setNewAsset({ name: '', type: '', serialNumber: '', category: 'laptop', status: 'available', location: '', purchaseDate: '', warrantyExpiry: '', notes: '' });
      } else {
        toast.error(res.error.message || 'Failed to create asset');
      }
    });
  };

  const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isWarrantyExpiring = (date) => {
    if (!date) return false;
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    return new Date(date) - new Date() < thirtyDays && new Date(date) > new Date();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Assets</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{pagination?.total || 0} total assets</p>
        </div>
        {user?.role !== 'employee' && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/20"
          >
            <Plus className="w-5 h-5" />
            Add Asset
          </button>
        )}
      </div>

      <div className={`p-4 rounded-2xl ${mode === 'dark' ? 'bg-dark-100/80 glass glass-border' : 'bg-white shadow-sm'}`}>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search assets..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-dark-50 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm"
            />
          </div>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-dark-50 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
          >
            <option value="">All Status</option>
            <option value="available">Available</option>
            <option value="assigned">Assigned</option>
            <option value="maintenance">Maintenance</option>
            <option value="retired">Retired</option>
          </select>
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-dark-50 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
          >
            <option value="">All Categories</option>
            <option value="laptop">Laptop</option>
            <option value="monitor">Monitor</option>
            <option value="keyboard">Keyboard</option>
            <option value="mouse">Mouse</option>
            <option value="headset">Headset</option>
            <option value="phone">Phone</option>
            <option value="printer">Printer</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={`p-5 rounded-2xl ${mode === 'dark' ? 'bg-dark-100/80' : 'bg-white shadow-sm'}`}>
              <div className="h-32 rounded-xl skeleton mb-4" />
              <div className="h-4 w-24 rounded skeleton mb-2" />
              <div className="h-4 w-16 rounded skeleton" />
            </div>
          ))
        ) : assets.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-400">No assets found</div>
        ) : (
          assets.map((asset) => {
            const Icon = categoryIcons[asset.category] || Box;
            const warrantyExpiring = isWarrantyExpiring(asset.warrantyExpiry);
            return (
              <motion.div
                key={asset._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-5 rounded-2xl ${mode === 'dark' ? 'bg-dark-100/80 glass glass-border' : 'bg-white shadow-sm'} hover:shadow-md transition-shadow`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${mode === 'dark' ? 'bg-dark-50' : 'bg-slate-100'}`}>
                    <Icon className="w-6 h-6 text-primary-500" />
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize ${statusStyles[asset.status]}`}>
                    {asset.status}
                  </span>
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{asset.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-mono mb-3">{asset.serialNumber}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400 capitalize">{asset.category}</span>
                  {warrantyExpiring && (
                    <span className="flex items-center gap-1 text-amber-500">
                      <AlertCircle className="w-4 h-4" /> Expiring soon
                    </span>
                  )}
                </div>
                {asset.assignedTo && (
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/50">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-medium">
                        {getInitials(asset.assignedTo.name)}
                      </div>
                      <span className="text-sm text-slate-600 dark:text-slate-400">{asset.assignedTo.name}</span>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })
        )}
      </div>

      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-lg rounded-2xl ${mode === 'dark' ? 'bg-dark-100' : 'bg-white'} shadow-2xl max-h-[90vh] overflow-y-auto`}
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700/50 sticky top-0 bg-white dark:bg-dark-100 z-10">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Add New Asset</h2>
                <button onClick={() => setShowCreateModal(false)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Asset Name</label>
                  <input type="text" value={newAsset.name} onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-dark-50 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" placeholder="Dell XPS 15 Laptop" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Serial Number</label>
                    <input type="text" value={newAsset.serialNumber} onChange={(e) => setNewAsset({ ...newAsset, serialNumber: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-dark-50 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 font-mono" placeholder="SN123456" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Type</label>
                    <input type="text" value={newAsset.type} onChange={(e) => setNewAsset({ ...newAsset, type: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-dark-50 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" placeholder="Latitude XPS 9520" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Category</label>
                    <select value={newAsset.category} onChange={(e) => setNewAsset({ ...newAsset, category: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-dark-50 focus:outline-none focus:ring-2 focus:ring-primary-500/20">
                      <option value="laptop">Laptop</option>
                      <option value="monitor">Monitor</option>
                      <option value="keyboard">Keyboard</option>
                      <option value="mouse">Mouse</option>
                      <option value="headset">Headset</option>
                      <option value="phone">Phone</option>
                      <option value="printer">Printer</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Location</label>
                    <input type="text" value={newAsset.location} onChange={(e) => setNewAsset({ ...newAsset, location: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-dark-50 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" placeholder="Office 301" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Purchase Date</label>
                    <input type="date" value={newAsset.purchaseDate} onChange={(e) => setNewAsset({ ...newAsset, purchaseDate: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-dark-50 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Warranty Expiry</label>
                    <input type="date" value={newAsset.warrantyExpiry} onChange={(e) => setNewAsset({ ...newAsset, warrantyExpiry: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-dark-50 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Notes</label>
                  <textarea value={newAsset.notes} onChange={(e) => setNewAsset({ ...newAsset, notes: e.target.value })} rows={3} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-dark-50 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none" placeholder="Additional notes..." />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 dark:border-slate-700/50">
                <button onClick={() => setShowCreateModal(false)} className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Cancel</button>
                <button onClick={handleCreateAsset} className="px-4 py-2.5 rounded-xl bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors">Create Asset</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Assets;
