import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Habaru</h3>
            <p className="text-gray-600 text-sm">
              Your trusted source for news and information in the Maldives.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 thaana-waheed">ސެކްޝަންތައް</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/category/politics" className="text-gray-600 hover:text-blue-600 thaana-waheed">
                  ސިޔާސީ
                </Link>
              </li>
              <li>
                <Link to="/category/business-economy" className="text-gray-600 hover:text-blue-600 thaana-waheed">
                  އިޤްތިޞާދީ
                </Link>
              </li>
              <li>
                <Link to="/category/sports" className="text-gray-600 hover:text-blue-600 thaana-waheed">
                  ކުޅިވަރު
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 thaana-waheed">އިތުރު މައުލޫމާތު</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-blue-600 thaana-waheed">
                  އަހަރުމެންނާ ބެހޭ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-blue-600 thaana-waheed">
                  ގުޅުއްވާ
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-blue-600 thaana-waheed">
                  ޝަރުތުތައް
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 thaana-waheed">ސޯޝަލް މީޑިއާ</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-blue-600">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600">
                <Twitter size={24} />
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600">
                <Instagram size={24} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} Habaru. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;