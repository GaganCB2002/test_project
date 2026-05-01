import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Filter,
  Eye,
  Edit,
  Trash2,
  X,
  MessageSquare,
  Mail,
  UserPlus,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  MoreVertical,
  Briefcase,
  GraduationCap,
  Code,
  Zap,
  Palette,
  Bug,
  Filter as FilterIcon,
  UserCog,
} from 'lucide-react';

// Mock team members data
const mockTeamMembers = [
  {
    id: '1',
    name: 'Alex Kim',
    email: 'alex.kim@techlead.io',
    avatar: 'AK',
    role: 'tech-lead',
    department: 'Engineering',
    skills: ['React', 'Node.js', 'System Design', 'AWS'],
    status: 'online',
    lastActive: new Date(),
    tasksAssigned: 8,
    bio: 'Senior Tech Lead with 10+ years of experience in full-stack development.',
  },
  {
    id: '2',
    name: 'Sarah Chen',
    email: 'sarah.chen@techlead.io',
    avatar: 'SC',
    role: 'developer',
    department: 'Engineering',
    skills: ['Vue.js', 'Python', 'PostgreSQL', 'Docker'],
    status: 'online',
    lastActive: new Date(Date.now() - 5 * 60 * 1000),
    tasksAssigned: 5,
    bio: 'Full-stack developer specializing in modern JavaScript frameworks.',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@techlead.io',
    avatar: 'MJ',
    role: 'developer',
    department: 'Engineering',
    skills: ['React', 'TypeScript', 'GraphQL', 'MongoDB'],
    status: 'offline',
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
    tasksAssigned: 6,
    bio: 'Frontend engineer passionate about building scalable web applications.',
  },
  {
    id: '4',
    name: 'Emma Davis',
    email: 'emma.davis@techlead.io',
    avatar: 'ED',
    role: 'qa',
    department: 'Quality Assurance',
    skills: ['Selenium', 'Jest', 'Cypress', 'API Testing'],
    status: 'online',
    lastActive: new Date(Date.now() - 2 * 60 * 1000),
    tasksAssigned: 4,
    bio: 'QA Engineer focused on automated testing and quality assurance.',
  },
  {
    id: '5',
    name: 'James Wilson',
    email: 'james.wilson@techlead.io',
    avatar: 'JW',
    role: 'tech-lead',
    department: 'Engineering',
    skills: ['Go', 'Kubernetes', 'DevOps', 'System Architecture'],
    status: 'offline',
    lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000),
    tasksAssigned: 7,
    bio: 'DevOps and infrastructure specialist with cloud expertise.',
  },
  {
    id: '6',
    name: 'Lisa Park',
    email: 'lisa.park@techlead.io',
    avatar: 'LP',
    role: 'developer',
    department: 'Engineering',
    skills: ['Flutter', 'React Native', 'Firebase', 'Mobile Dev'],
    status: 'online',
    lastActive: new Date(Date.now() - 15 * 60 * 1000),
    tasksAssigned: 3,
    bio: 'Mobile development expert building cross-platform applications.',
  },
  {
    id: '7',
    name: 'David Brown',
    email: 'david.brown@techlead.io',
    avatar: 'DB',
    role: 'qa',
    department: 'Quality Assurance',
    skills: ['Manual Testing', 'JIRA', 'TestRail', 'Performance Testing'],
    status: 'offline',
    lastActive: new Date(Date.now() - 3 * 60 * 60 * 1000),
    tasksAssigned: 2,
    bio: 'Manual QA specialist with expertise in test planning and execution.',
  },
  {
    id: '8',
    name: 'Rachel Green',
    email: 'rachel.green@techlead.io',
    avatar: 'RG',
    role: 'developer',
    department: 'Engineering',
    skills: ['Angular', 'RxJS', 'NgRx', 'TypeScript'],
    status: 'online',
    lastActive: new Date(Date.now() - 30 * 60 * 1000),
    tasksAssigned: 4,
    bio: 'Angular specialist with deep expertise in reactive programming.',
  },
];

const roleConfig = {
  'tech-lead': { label: 'Tech Lead', color: 'bg-purple-500/20 text-purple-500 border-purple-500', icon: Zap },
  developer: { label: 'Developer', color: 'bg-blue-500/20 text-blue-500 border-blue-500', icon: Code },
  qa: { label: 'QA', color: 'bg-green-500/20 text-green-500 border-green-500', icon: Bug },
};

const skillIcons = {
  React: Code,
  Vue: Code,
  Angular: Code,
  Node: Code,
  Python: Code,
  AWS: Zap,
  Docker: Zap,
  Kubernetes: Zap,
  default: Code,
};

const getSkillIcon = (skill) => {
  const Icon = skillIcons[skill] || skillIcons.default;
  return <Icon className="w-3 h-3" />;
};

const formatLastActive = (date) => {
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

const Team = () => {
  const dispatch = useDispatch();
  const { darkMode } = useSelector((state) => state.theme);
  const { user } = useSelector((state) => state.auth);

  const [teamMembers, setTeamMembers] = useState(mockTeamMembers);
  const [activeRoleFilter, setActiveRoleFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [showMemberModal, setShowMemberModal] = useState(false);

  // Calculate stats
  const stats = {
    total: teamMembers.length,
    online: teamMembers.filter((m) => m.status === 'online').length,
    byRole: {
      'tech-lead': teamMembers.filter((m) => m.role === 'tech-lead').length,
      developer: teamMembers.filter((m) => m.role === 'developer').length,
      qa: teamMembers.filter((m) => m.role === 'qa').length,
    },
  };

  // Role filter tabs
  const roleTabs = [
    { id: 'all', label: 'All', count: stats.total },
    { id: 'tech-lead', label: 'Tech Lead', count: stats.byRole['tech-lead'] },
    { id: 'developer', label: 'Developer', count: stats.byRole.developer },
    { id: 'qa', label: 'QA', count: stats.byRole.qa },
  ];

  // Filter members
  const filteredMembers = teamMembers.filter((member) => {
    const matchesRole = activeRoleFilter === 'all' || member.role === activeRoleFilter;
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesRole && matchesSearch;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  const openMemberModal = (member) => {
    setSelectedMember(member);
    setShowMemberModal(true);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="p-6 space-y-6 max-w-[1600px] mx-auto"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Team</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and view your team members
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-white font-medium"
        >
          <UserPlus className="w-5 h-5" />
          Add Member
        </motion.button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ y: -4 }}
          className="backdrop-blur-xl bg-white/10 dark:bg-gray-800/30 rounded-xl border border-white/20 dark:border-gray-700/50 p-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Members</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="backdrop-blur-xl bg-white/10 dark:bg-gray-800/30 rounded-xl border border-white/20 dark:border-gray-700/50 p-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.online}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Online Now</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="backdrop-blur-xl bg-white/10 dark:bg-gray-800/30 rounded-xl border border-white/20 dark:border-gray-700/50 p-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.byRole['tech-lead']}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Tech Leads</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="backdrop-blur-xl bg-white/10 dark:bg-gray-800/30 rounded-xl border border-white/20 dark:border-gray-700/50 p-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Code className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.byRole.developer + stats.byRole.qa}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Developers & QA</p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Search and Filter Bar */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/10 dark:bg-gray-800/30 border border-white/20 dark:border-gray-700/50 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
          />
        </div>

        {/* Role Filter Tabs */}
        <div className="flex items-center gap-2 p-1 bg-white/10 dark:bg-gray-800/30 rounded-xl border border-white/20 dark:border-gray-700/50 overflow-x-auto">
          {roleTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveRoleFilter(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeRoleFilter === tab.id
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-white/10'
              }`}
            >
              {tab.label}
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-white/20">
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Team Members Grid */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredMembers.map((member, index) => {
            const role = roleConfig[member.role];
            const RoleIcon = role.icon;
            return (
              <motion.div
                key={member.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                onClick={() => openMemberModal(member)}
                className="backdrop-blur-xl bg-white/10 dark:bg-gray-800/30 rounded-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden cursor-pointer"
              >
                <div className="p-5">
                  {/* Avatar with status */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-lg font-medium text-white">
                        {member.avatar}
                      </div>
                      <div
                        className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 ${
                          member.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-primary-500 transition-colors"
                        title="Message"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-secondary-500 transition-colors"
                        title="More"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Name and Role */}
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{member.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${role.color} rounded-full text-xs font-medium`}>
                        <RoleIcon className="w-3 h-3" />
                        {role.label}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{member.department}</span>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {member.skills.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 dark:bg-gray-700/50 rounded text-xs text-gray-600 dark:text-gray-300"
                      >
                        {getSkillIcon(skill)}
                        {skill}
                      </span>
                    ))}
                    {member.skills.length > 3 && (
                      <span className="inline-flex items-center px-2 py-0.5 bg-gray-100 dark:bg-gray-700/50 rounded text-xs text-gray-500">
                        +{member.skills.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      <span>{member.tasksAssigned} tasks</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatLastActive(member.lastActive)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-4 border-t border-white/10 dark:border-gray-700/50">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 px-3 py-2 bg-primary-500/10 text-primary-500 hover:bg-primary-500/20 rounded-lg text-sm font-medium transition-colors"
                    >
                      View Profile
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 px-3 py-2 bg-secondary-500/10 text-secondary-500 hover:bg-secondary-500/20 rounded-lg text-sm font-medium transition-colors"
                    >
                      Assign Task
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filteredMembers.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-16">
          <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">No team members found</h3>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            {searchQuery ? 'Try adjusting your search or filters' : 'Add your first team member to get started'}
          </p>
        </motion.div>
      )}

      {/* Member Detail Modal */}
      <AnimatePresence>
        {showMemberModal && selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && setShowMemberModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto backdrop-blur-xl bg-white/10 dark:bg-gray-800/80 rounded-2xl border border-white/20 dark:border-gray-700/50 shadow-2xl"
            >
              {/* Modal Header */}
              <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-white/10 dark:border-gray-700/50 bg-white/10 dark:bg-gray-800/80 backdrop-blur-xl rounded-t-2xl">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Member Profile</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowMemberModal(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Member Details */}
              <div className="p-6">
                <div className="flex items-start gap-6 mb-6">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-2xl font-medium text-white">
                      {selectedMember.avatar}
                    </div>
                    <div
                      className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-white dark:border-gray-800 ${
                        selectedMember.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedMember.name}</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">{selectedMember.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {(() => {
                        const role = roleConfig[selectedMember.role];
                        const RoleIcon = role.icon;
                        return (
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${role.color} rounded-full text-sm font-medium`}>
                            <RoleIcon className="w-4 h-4" />
                            {role.label}
                          </span>
                        );
                      })()}
                      <span className="text-sm text-gray-500 dark:text-gray-400">{selectedMember.department}</span>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">About</h4>
                  <p className="text-gray-900 dark:text-white">{selectedMember.bio}</p>
                </div>

                {/* Skills */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedMember.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-500/10 text-primary-500 rounded-lg text-sm font-medium"
                      >
                        {getSkillIcon(skill)}
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-white/5 dark:bg-gray-700/20 rounded-xl border border-white/10 dark:border-gray-600/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Briefcase className="w-4 h-4 text-primary-500" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">Assigned Tasks</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{selectedMember.tasksAssigned}</p>
                  </div>
                  <div className="p-4 bg-white/5 dark:bg-gray-700/20 rounded-xl border border-white/10 dark:border-gray-600/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">Last Active</span>
                    </div>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">{formatLastActive(selectedMember.lastActive)}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowMemberModal(false)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-500 hover:bg-primary-600 rounded-xl text-white font-medium transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Send Message
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowMemberModal(false)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-secondary-500 hover:bg-secondary-600 rounded-xl text-white font-medium transition-colors"
                  >
                    <UserCog className="w-4 h-4" />
                    Assign Task
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Team;
