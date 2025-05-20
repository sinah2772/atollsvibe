import React, { useState } from 'react';
import { Lightbulb, Plus, Edit, Trash2, Check, X, ListFilter } from 'lucide-react';

interface Idea {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  created_at: string;
  category: 'feature' | 'story' | 'interview' | 'investigation' | 'opinion';
}

interface IdeasSectionProps {
  language?: 'en' | 'dv';
}

type Tab = 'all' | 'feature' | 'story' | 'interview' | 'investigation' | 'opinion';

const IdeasSection: React.FC<IdeasSectionProps> = ({ language = 'en' }) => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [category, setCategory] = useState<Idea['category']>('story');

  const tabs: { id: Tab; label: { en: string; dv: string } }[] = [
    { id: 'all', label: { en: 'All Ideas', dv: 'ހުރިހާ އައިޑިއާ' } },
    { id: 'feature', label: { en: 'Features', dv: 'ފީޗަރ' } },
    { id: 'story', label: { en: 'Stories', dv: 'ވާހަކަ' } },
    { id: 'interview', label: { en: 'Interviews', dv: 'އިންޓަވިއު' } },
    { id: 'investigation', label: { en: 'Investigations', dv: 'ތަޙްޤީޤް' } },
    { id: 'opinion', label: { en: 'Opinion', dv: 'ޚިޔާލު' } }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      setIdeas(prev => prev.map(idea => 
        idea.id === editingId 
          ? { ...idea, title, description, category }
          : idea
      ));
      setEditingId(null);
    } else {
      const newIdea: Idea = {
        id: Math.random().toString(36).substring(2),
        title,
        description,
        status: 'pending',
        created_at: new Date().toISOString(),
        category
      };
      setIdeas(prev => [newIdea, ...prev]);
    }

    setTitle('');
    setDescription('');
    setCategory('story');
    setShowForm(false);
  };

  const handleEdit = (idea: Idea) => {
    setTitle(idea.title);
    setDescription(idea.description);
    setCategory(idea.category);
    setEditingId(idea.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm(language === 'dv' ? 'މި އައިޑިއާ ފޮހެލަން ބޭނުންތޯ؟' : 'Are you sure you want to delete this idea?')) {
      setIdeas(prev => prev.filter(idea => idea.id !== id));
    }
  };

  const handleStatusChange = (id: string) => {
    setIdeas(prev => prev.map(idea => {
      if (idea.id !== id) return idea;
      
      const statusOrder: Idea['status'][] = ['pending', 'in-progress', 'completed'];
      const currentIndex = statusOrder.indexOf(idea.status);
      const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
      
      return { ...idea, status: nextStatus };
    }));
  };

  const getStatusColor = (status: Idea['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
    }
  };

  const getStatusText = (status: Idea['status']) => {
    switch (status) {
      case 'pending':
        return language === 'dv' ? 'ނުފަށާ' : 'Pending';
      case 'in-progress':
        return language === 'dv' ? 'ކުރަމުންދާ' : 'In Progress';
      case 'completed':
        return language === 'dv' ? 'ނިމިފައި' : 'Completed';
    }
  };

  const getCategoryColor = (category: Idea['category']) => {
    switch (category) {
      case 'feature':
        return 'bg-purple-100 text-purple-800';
      case 'story':
        return 'bg-blue-100 text-blue-800';
      case 'interview':
        return 'bg-green-100 text-green-800';
      case 'investigation':
        return 'bg-red-100 text-red-800';
      case 'opinion':
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getCategoryText = (category: Idea['category']) => {
    switch (category) {
      case 'feature':
        return language === 'dv' ? 'ފީޗަރ' : 'Feature';
      case 'story':
        return language === 'dv' ? 'ވާހަކަ' : 'Story';
      case 'interview':
        return language === 'dv' ? 'އިންޓަވިއު' : 'Interview';
      case 'investigation':
        return language === 'dv' ? 'ތަޙްޤީޤް' : 'Investigation';
      case 'opinion':
        return language === 'dv' ? 'ޚިޔާލު' : 'Opinion';
    }
  };

  const filteredIdeas = ideas.filter(idea => 
    activeTab === 'all' || idea.category === activeTab
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Lightbulb className="text-yellow-500" />
          <h2 className={`text-lg font-semibold text-gray-900 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
            {language === 'dv' ? 'އައު އައިޑިއާތައް' : 'Story Ideas'}
          </h2>
        </div>
        <button
          onClick={() => {
            if (!showForm) {
              setTitle('');
              setDescription('');
              setCategory('story');
              setEditingId(null);
            }
            setShowForm(!showForm);
          }}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${
            showForm
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          } transition-colors`}
        >
          {showForm ? (
            <>
              <X size={16} />
              <span className={language === 'dv' ? 'thaana-waheed' : ''}>
                {language === 'dv' ? 'ކެންސަލް' : 'Cancel'}
              </span>
            </>
          ) : (
            <>
              <Plus size={16} />
              <span className={language === 'dv' ? 'thaana-waheed' : ''}>
                {language === 'dv' ? 'އައު އައިޑިއާއެއް' : 'New Idea'}
              </span>
            </>
          )}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                {language === 'dv' ? 'ސުރުޚީ' : 'Title'}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  language === 'dv' ? 'text-right thaana-waheed' : ''
                }`}
                dir={language === 'dv' ? 'rtl' : 'ltr'}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                {language === 'dv' ? 'ބާވަތް' : 'Category'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Idea['category'])}
                className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  language === 'dv' ? 'text-right thaana-waheed' : ''
                }`}
                dir={language === 'dv' ? 'rtl' : 'ltr'}
              >
                {tabs.slice(1).map(tab => (
                  <option key={tab.id} value={tab.id}>
                    {language === 'dv' ? tab.label.dv : tab.label.en}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                {language === 'dv' ? 'ތަފްޞީލު' : 'Description'}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  language === 'dv' ? 'text-right thaana-waheed' : ''
                }`}
                dir={language === 'dv' ? 'rtl' : 'ltr'}
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <span className={language === 'dv' ? 'thaana-waheed' : ''}>
                  {editingId
                    ? language === 'dv' ? 'އަޕްޑޭޓް ކުރައްވާ' : 'Update'
                    : language === 'dv' ? 'ސޭވް ކުރައްވާ' : 'Save'}
                </span>
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-4 overflow-x-auto" aria-label="Tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                whitespace-nowrap py-2 px-3 border-b-2 text-sm font-medium
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <span className={language === 'dv' ? 'thaana-waheed' : ''}>
                {language === 'dv' ? tab.label.dv : tab.label.en}
              </span>
              {tab.id === 'all' && (
                <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                  {ideas.length}
                </span>
              )}
              {tab.id !== 'all' && (
                <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                  {ideas.filter(idea => idea.category === tab.id).length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="space-y-4">
        {filteredIdeas.length === 0 ? (
          <div className="text-center py-8">
            <p className={`text-gray-500 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
              {language === 'dv' 
                ? 'އައު އައިޑިއާއެއް އިތުރު ކުރައްވާ'
                : 'Add your first story idea'}
            </p>
          </div>
        ) : (
          filteredIdeas.map(idea => (
            <div 
              key={idea.id}
              className="p-4 rounded-lg border border-gray-200 hover:border-blue-200 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(idea.category)}`}>
                      {getCategoryText(idea.category)}
                    </span>
                    <button
                      onClick={() => handleStatusChange(idea.id)}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(idea.status)}`}
                    >
                      {getStatusText(idea.status)}
                    </button>
                  </div>
                  <h3 className={`font-medium text-gray-900 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                    {idea.title}
                  </h3>
                  <p className={`mt-1 text-sm text-gray-600 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                    {idea.description}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(idea)}
                    className="p-1 hover:bg-gray-100 rounded-full text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(idea.id)}
                    className="p-1 hover:bg-gray-100 rounded-full text-gray-500 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default IdeasSection;