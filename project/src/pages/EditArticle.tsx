import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Highlight from '@tiptap/extension-highlight';
import { useArticles } from '../hooks/useArticles';
import { useCategories } from '../hooks/useCategories';
import { useAtolls } from '../hooks/useAtolls';
import { useUser } from '../hooks/useUser';
import { MultiSelect } from '../components/MultiSelect';
import { IslandsSelect } from '../components/IslandsSelect';
import ImageBrowser from '../components/ImageBrowser';
import CategorySelector from '../components/CategorySelector';
import { supabase } from '../lib/supabase';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Undo, 
  Redo, 
  Image as ImageIcon,
  Link as LinkIcon,
  Heading1,
  Heading2,
  Code,
  Highlighter,
  Save,
  Send,
  Languages,
  Loader2,
  ArrowLeft,
  X
} from 'lucide-react';

const EditArticle: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { articles, updateArticle } = useArticles();
  const { categories } = useCategories();
  const { atolls } = useAtolls();
  const { user, loading: userLoading } = useUser();
  
  const [title, setTitle] = useState('');
  const [heading, setHeading] = useState('');
  const [socialHeading, setSocialHeading] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState<string | null>(null);
  const [selectedAtolls, setSelectedAtolls] = useState<number[]>([]);
  const [selectedIslands, setSelectedIslands] = useState<number[]>([]);
  const [coverImage, setCoverImage] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [language, setLanguage] = useState<'en'|'dv'>('dv');
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showImageBrowser, setShowImageBrowser] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
      Highlight,
    ],
    content: {},
    editorProps: {
      attributes: {
        class: `prose prose-lg max-w-none focus:outline-none min-h-[300px] ${language === 'dv' ? 'thaana-waheed' : ''}`,
      },
    },
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login', { replace: true });
      }
    };
    
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    if (!id || !editor) return;

    const article = articles.find(a => a.id === id);
    if (article) {
      setTitle(article.title);
      setHeading(article.heading);
      setSocialHeading(article.social_heading || '');
      setCategory(article.category_id?.toString() || '');
      setSubcategory(article.subcategory_id ? article.subcategory_id.toString() : null);
      setSelectedAtolls(article.atoll_ids || []);
      setCoverImage(article.cover_image || '');
      setImageCaption(article.image_caption || '');
      editor.commands.setContent(article.content);
      setLoading(false);
    }
  }, [id, articles, editor]);

  const validateForm = () => {
    if (!user) {
      alert(language === 'dv' ? 'އެކައުންޓަށް ވަދެވަޑައިގަންނަވާ' : 'Please log in to continue');
      return false;
    }
    if (selectedAtolls.length === 0) {
      alert(language === 'dv' ? 'އަތޮޅެއް އިޚްތިޔާރު ކުރައްވާ' : 'Please select at least one atoll');
      return false;
    }
    if (!category) {
      alert(language === 'dv' ? 'ބައެއް އިޚްތިޔާރު ކުރައްވާ' : 'Please select a category');
      return false;
    }
    return true;
  };

  const handleSaveDraft = async () => {
    if (!editor || !id) return;
    if (!validateForm()) return;
    
    try {
      setSaving(true);
      
      if (!user) {
        navigate('/login', { replace: true });
        return;
      }

      await updateArticle(id, {
        title,
        heading,
        social_heading: socialHeading,
        content: editor.getJSON(),
        category_id: parseInt(category),
        subcategory_id: subcategory ? parseInt(subcategory) : null,
        atoll_ids: selectedAtolls,
        cover_image: coverImage,
        image_caption: imageCaption,
        status: 'draft',
        user_id: user.id
      });

      navigate('/articles');
    } catch (error) {
      console.error('Failed to save draft:', error);
      setError('Failed to save draft. Please try again.');
      alert('Failed to save draft. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!editor || !id) return;
    if (!validateForm()) return;
    
    try {
      setPublishing(true);
      
      if (!user) {
        navigate('/login', { replace: true });
        return;
      }

      await updateArticle(id, {
        title,
        heading,
        social_heading: socialHeading,
        content: editor.getJSON(),
        category_id: parseInt(category),
        subcategory_id: subcategory ? parseInt(subcategory) : null,
        atoll_ids: selectedAtolls,
        cover_image: coverImage,
        image_caption: imageCaption,
        status: 'published',
        publish_date: new Date().toISOString(),
        user_id: user.id
      });

      navigate('/articles');
    } catch (error) {
      console.error('Failed to publish:', error);
      setError('Failed to publish. Please try again.');
      alert('Failed to publish. Please try again.');
    } finally {
      setPublishing(false);
    }
  };

  const addImage = () => {
    setShowImageBrowser(true);
  };

  const handleImageSelect = (url: string) => {
    if (editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
    setShowImageBrowser(false);
  };

  const addLink = () => {
    const url = window.prompt('Enter URL');
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'dv' ? 'en' : 'dv');
    if (editor) {
      editor.setEditable(false);
      editor.setEditable(true);
    }
  };

  if (loading || userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto mt-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/articles')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
            <span className={language === 'dv' ? 'thaana-waheed' : ''}>
              {language === 'dv' ? 'އަނބުރާ' : 'Back'}
            </span>
          </button>
          <div>
            <h1 className={`text-2xl font-bold text-gray-900 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
              {language === 'dv' ? 'ލިޔުން އެޑިޓްކުރައްވާ' : 'Edit Article'}
            </h1>
            <p className={`text-gray-600 mt-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
              {language === 'dv' ? 'ލިޔުމަށް ބޭނުންވާ ބަދަލުތައް ގެންނަވާ' : 'Make changes to your article'}
            </p>
          </div>
        </div>
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          dir={language === 'dv' ? 'rtl' : 'ltr'}
        >
          <Languages size={20} className={language === 'dv' ? 'ml-2' : 'mr-2'} />
          <span className={`text-sm font-medium ${language === 'dv' ? 'thaana-waheed' : ''}`}>
            {language === 'dv' ? 'Switch to English' : 'ދިވެހި އަށް ބަދަލުކުރައްވާ'}
          </span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
              {language === 'dv' ? 'ސުރުޚީ (ލެޓިން)' : 'Title (Latin)'}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${language === 'dv' ? 'placeholder:thaana-waheed' : ''}`}
              placeholder={language === 'dv' ? 'ލެޓިން އަކުރުން ސުރުޚީ ލިޔުއްވާ' : 'Enter title in Latin'}
              dir={language === 'dv' ? 'rtl' : 'ltr'}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
              {language === 'dv' ? 'ސުރުޚީ (ދިވެހި)' : 'Heading (Thaana)'}
            </label>
            <input
              type="text"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${language === 'dv' ? 'thaana-waheed placeholder:thaana-waheed' : ''}`}
              placeholder={language === 'dv' ? 'ދިވެހިން ސުރުޚީ ލިޔުއްވާ' : 'Enter heading in Thaana'}
              dir={language === 'dv' ? 'rtl' : 'ltr'}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
              {language === 'dv' ? 'ސޯޝަލް މީޑިއާ ސުރުޚީ' : 'Social Heading'}
            </label>
            <input
              type="text"
              value={socialHeading}
              onChange={(e) => setSocialHeading(e.target.value)}
              className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${language === 'dv' ? 'thaana-waheed placeholder:thaana-waheed' : ''}`}
              placeholder={language === 'dv' ? 'ސޯޝަލް މީޑިއާ ސުރުޚީ ލިޔުއްވާ' : 'Enter social media heading'}
              dir={language === 'dv' ? 'rtl' : 'ltr'}
            />
          </div>

          <div>
            <CategorySelector
              categories={categories || []}
              selectedCategoryId={category}
              selectedSubcategoryId={subcategory}
              onCategoryChange={setCategory}
              onSubcategoryChange={setSubcategory}
              language={language}
            />
          </div>

          <div className="md:col-span-2">
            <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
              {language === 'dv' ? 'އަތޮޅުތައް' : 'Atolls'}
            </label>
            <MultiSelect
              options={atolls || []}
              value={selectedAtolls}
              onChange={setSelectedAtolls}
              language={language}
              placeholder={language === 'dv' ? 'އަތޮޅުތައް އިޚްތިޔާރު ކުރައްވާ' : 'Select atolls'}
            />
          </div>

          {selectedAtolls.length > 0 && (
            <div className="md:col-span-2">
              <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                {language === 'dv' ? 'ރަށްތައް' : 'Islands'}
              </label>
              <IslandsSelect
                atollIds={selectedAtolls}
                value={selectedIslands}
                onChange={setSelectedIslands}
                language={language}
              />
            </div>
          )}

          <div>
            <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
              {language === 'dv' ? 'މައި ފޮޓޯ' : 'Cover Image'}
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setShowImageBrowser(true)}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                aria-label={language === 'dv' ? 'ފޮޓޯއެއް އިންތިޚާބުކުރައްވާ' : 'Select image'}
                title={language === 'dv' ? 'ފޮޓޯއެއް އިންތިޚާބުކުރައްވާ' : 'Select image'}
              >
                <ImageIcon size={20} />
              </button>
              {coverImage && (
                <div className="flex-1 text-sm text-gray-500 py-1 px-2">
                  Image selected
                </div>
              )}
            </div>
            <input
              type="text"
              value={imageCaption}
              onChange={(e) => setImageCaption(e.target.value)}
              className={`mt-2 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${language === 'dv' ? 'thaana-waheed placeholder:thaana-waheed' : ''}`}
              placeholder={language === 'dv' ? 'ފޮޓޯގެ ތަފްޞީލް' : 'Image caption'}
              dir={language === 'dv' ? 'rtl' : 'ltr'}
            />
          </div>
        </div>

        {coverImage && (
          <div className="mb-6 relative h-[200px] rounded-lg overflow-hidden group">
            <img
              src={coverImage}
              alt={imageCaption}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => setCoverImage('')}
              className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label={language === 'dv' ? 'ފޮޓޯ ނައްތާލާ' : 'Remove image'}
              title={language === 'dv' ? 'ފޮޓޯ ނައްތާލާ' : 'Remove image'}
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div className="border-b border-gray-200 mb-4">
          <div className="flex flex-wrap gap-2 pb-4">
            <button
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className={`p-2 rounded hover:bg-gray-100 ${
                editor?.isActive('bold') ? 'bg-gray-100' : ''
              }`}
              title="Bold"
            >
              <Bold size={20} />
            </button>
            <button
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              className={`p-2 rounded hover:bg-gray-100 ${
                editor?.isActive('italic') ? 'bg-gray-100' : ''
              }`}
              title="Italic"
            >
              <Italic size={20} />
            </button>
            <button
              onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
              className={`p-2 rounded hover:bg-gray-100 ${
                editor?.isActive('heading', { level: 1 }) ? 'bg-gray-100' : ''
              }`}
              title="Heading 1"
            >
              <Heading1 size={20} />
            </button>
            <button
              onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`p-2 rounded hover:bg-gray-100 ${
                editor?.isActive('heading', { level: 2 }) ? 'bg-gray-100' : ''
              }`}
              title="Heading 2"
            >
              <Heading2 size={20} />
            </button>
            <button
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              className={`p-2 rounded hover:bg-gray-100 ${
                editor?.isActive('bulletList') ? 'bg-gray-100' : ''
              }`}
              title="Bullet List"
            >
              <List size={20} />
            </button>
            <button
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              className={`p-2 rounded hover:bg-gray-100 ${
                editor?.isActive('orderedList') ? 'bg-gray-100' : ''
              }`}
              title="Numbered List"
            >
              <ListOrdered size={20} />
            </button>
            <button
              onClick={() => editor?.chain().focus().toggleBlockquote().run()}
              className={`p-2 rounded hover:bg-gray-100 ${
                editor?.isActive('blockquote') ? 'bg-gray-100' : ''
              }`}
              title="Quote"
            >
              <Quote size={20} />
            </button>
            <button
              onClick={() => editor?.chain().focus().toggleCode().run()}
              className={`p-2 rounded hover:bg-gray-100 ${
                editor?.isActive('code') ? 'bg-gray-100' : ''
              }`}
              title="Code"
            >
              <Code size={20} />
            </button>
            <button
              onClick={() => editor?.chain().focus().toggleHighlight().run()}
              className={`p-2 rounded hover:bg-gray-100 ${
                editor?.isActive('highlight') ? 'bg-gray-100' : ''
              }`}
              title="Highlight"
            >
              <Highlighter size={20} />
            </button>
            <button
              onClick={addImage}
              className="p-2 rounded hover:bg-gray-100"
              title="Insert Image"
            >
              <ImageIcon size={20} />
            </button>
            <button
              onClick={addLink}
              className={`p-2 rounded hover:bg-gray-100 ${
                editor?.isActive('link') ? 'bg-gray-100' : ''
              }`}
              title="Insert Link"
            >
              <LinkIcon size={20} />
            </button>
            <button
              onClick={() => editor?.chain().focus().undo().run()}
              className="p-2 rounded hover:bg-gray-100 ml-auto"
              title="Undo"
            >
              <Undo size={20} />
            </button>
            <button
              onClick={() => editor?.chain().focus().redo().run()}
              className="p-2 rounded hover:bg-gray-100"
              title="Redo"
            >
              <Redo size={20} />
            </button>
          </div>
        </div>

        <EditorContent editor={editor} className="min-h-[300px]" />
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={handleSaveDraft}
          disabled={saving}
          className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Save size={18} />
          )}
          <span className={language === 'dv' ? 'thaana-waheed' : ''}>
            {language === 'dv' ? 'ޑްރާފްޓް ކުރައްވާ' : 'Save as Draft'}
          </span>
        </button>
        <button
          onClick={handlePublish}
          disabled={publishing}
          className="px-6 py-2 rounded-lg bg-blue-700 text-white hover:bg-blue-800 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {publishing ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Send size={18} />
          )}
          <span className={language === 'dv' ? 'thaana-waheed' : ''}>
            {language === 'dv' ? 'ޝާއިޢު ކުރައްވާ' : 'Publish'}
          </span>
        </button>
      </div>

      <ImageBrowser
        isOpen={showImageBrowser}
        onClose={() => setShowImageBrowser(false)}
        onSelect={handleImageSelect}
        language={language}
      />
    </div>
  );
};

export default EditArticle;