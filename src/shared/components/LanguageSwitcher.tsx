import React from 'react';
import { useTranslation } from 'react-i18next';

export const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
  };

  const currentLang = i18n.language === 'ar' ? 'العربية' : 'English';

  return (
    <button
      onClick={toggleLanguage}
      className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
      aria-label={t('common.language')}
    >
      <span className="w-4 h-4 mr-2 text-gray-500">🌐</span>
      <span className="font-medium">{currentLang}</span>
    </button>
  );
};