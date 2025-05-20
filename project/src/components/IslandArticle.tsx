import React from 'react';
import { useIslandData } from '../hooks/useIslandData';
import { Compass, MapPin, ThermometerSun, Users, Building, Plane, Ship } from 'lucide-react';

interface IslandArticleProps {
  id: number;
  language?: 'en' | 'dv';
}

export const IslandArticle: React.FC<IslandArticleProps> = ({ id, language = 'en' }) => {
  const { island, loading, error } = useIslandData(id);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
        {language === 'dv' ? 'މައްސަލައެއް ދިމާވެއްޖެ' : error}
      </div>
    );
  }

  if (!island) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-lg">
        {language === 'dv' ? 'ރަށް ނުފެނުނު' : 'Island not found'}
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className={`text-4xl font-bold text-gray-900 mb-2 ${
          language === 'dv' ? 'text-right thaana-waheed' : ''
        }`}>
          {language === 'dv' ? island.name : island.name_en}
        </h1>
        
        <div className={`flex items-center text-gray-600 gap-4 ${
          language === 'dv' ? 'justify-end' : ''
        }`}>
          <div className="flex items-center gap-1">
            <MapPin size={16} />
            <span className={language === 'dv' ? 'thaana-waheed' : ''}>
              {language === 'dv' ? island.atoll?.name : island.atoll?.name_en}
            </span>
          </div>
          {island.island_category && (
            <div className="flex items-center gap-1">
              <Building size={16} />
              <span className={language === 'dv' ? 'thaana-waheed' : ''}>
                {language === 'dv' ? island.island_category : island.island_category_en}
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Location Information */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className={`text-xl font-semibold mb-4 ${
          language === 'dv' ? 'text-right thaana-waheed' : ''
        }`}>
          {language === 'dv' ? 'ރަށުގެ މަޢުލޫމާތު' : 'Location Information'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {island.longitude && island.latitude && (
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Compass className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  {language === 'dv' ? 'ކޯޑިނޭޓްސް' : 'Coordinates'}
                </p>
                <p className="text-sm font-medium">
                  {island.latitude}, {island.longitude}
                </p>
              </div>
            </div>
          )}
          
          {island.island_code && (
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <MapPin className="text-green-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  {language === 'dv' ? 'ރަށުގެ ކޯޑު' : 'Island Code'}
                </p>
                <p className="text-sm font-medium">{island.island_code}</p>
              </div>
            </div>
          )}

          {island.election_commission_code && (
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Users className="text-purple-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  {language === 'dv' ? 'އިލެކްޝަންސް ކޯޑު' : 'Elections Code'}
                </p>
                <p className="text-sm font-medium">{island.election_commission_code}</p>
              </div>
            </div>
          )}

          {island.postal_code && (
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-50 rounded-lg">
                <Building className="text-yellow-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  {language === 'dv' ? 'ޕޯސްޓަލް ކޯޑު' : 'Postal Code'}
                </p>
                <p className="text-sm font-medium">{island.postal_code}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Island Details */}
      {island.island_details && (
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className={`text-xl font-semibold mb-4 ${
            language === 'dv' ? 'text-right thaana-waheed' : ''
          }`}>
            {language === 'dv' ? 'ތަފްޞީލު' : 'About'}
          </h2>
          <p className={`text-gray-600 ${
            language === 'dv' ? 'text-right thaana-waheed' : ''
          }`}>
            {island.island_details}
          </p>
        </section>
      )}

      {/* Transportation */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className={`text-xl font-semibold mb-4 ${
          language === 'dv' ? 'text-right thaana-waheed' : ''
        }`}>
          {language === 'dv' ? 'ދަތުރުފަތުރު' : 'Transportation'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-50 rounded-lg">
              <Plane className="text-sky-600" size={20} />
            </div>
            <div>
              <p className={`text-sm ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                {language === 'dv' ? 'ވައިގެ މަގުން' : 'By Air'}
              </p>
              <p className={`text-sm text-gray-500 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                {language === 'dv' 
                  ? 'އެންމެ ކައިރީ އެއަރޕޯޓް: ވެލާނާ އިންޓަރނޭޝަނަލް އެއަރޕޯޓް' 
                  : 'Nearest Airport: Velana International Airport'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Ship className="text-blue-600" size={20} />
            </div>
            <div>
              <p className={`text-sm ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                {language === 'dv' ? 'ކަނޑުމަގުން' : 'By Sea'}
              </p>
              <p className={`text-sm text-gray-500 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                {language === 'dv'
                  ? 'ފެރީ ޚިދުމަތް ލިބެން ހުންނާނެ'
                  : 'Regular ferry service available'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Alternative Names */}
      {(island.other_name_en || island.other_name_dv) && (
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className={`text-xl font-semibold mb-4 ${
            language === 'dv' ? 'text-right thaana-waheed' : ''
          }`}>
            {language === 'dv' ? 'އެހެން ނަންތައް' : 'Alternative Names'}
          </h2>
          
          <div className="space-y-2">
            {island.other_name_en && (
              <p className="text-gray-600">
                <span className="font-medium">English: </span>
                {island.other_name_en}
              </p>
            )}
            {island.other_name_dv && (
              <p className="text-gray-600 text-right thaana-waheed">
                <span className="font-medium">ދިވެހި: </span>
                {island.other_name_dv}
              </p>
            )}
          </div>
        </section>
      )}
    </article>
  );
};