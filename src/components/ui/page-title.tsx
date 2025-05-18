
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useLanguage } from '@/contexts/LanguageContext';

interface PageTitleProps {
  title: string;
  description?: string;
  noIndex?: boolean;
  children?: React.ReactNode;
  showTitle?: boolean;
  className?: string;
  titleClassName?: string;
  breadcrumbs?: Array<{ label: string; path?: string }>;
}

/**
 * Page title component with SEO and accessibility features
 */
export const PageTitle: React.FC<PageTitleProps> = ({
  title,
  description,
  noIndex = false,
  children,
  showTitle = true,
  className = '',
  titleClassName = '',
  breadcrumbs,
}) => {
  const { t } = useLanguage();
  const appName = t ? t('propertyFlow') : 'PropertyFlow';
  
  // For screen readers, announce the page title on component mount
  useEffect(() => {
    const announcementNode = document.createElement('div');
    announcementNode.setAttribute('aria-live', 'assertive');
    announcementNode.setAttribute('class', 'sr-only');
    announcementNode.textContent = `${title} - ${appName}`;
    
    document.body.appendChild(announcementNode);
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcementNode);
    }, 1000);
  }, [title, appName]);

  return (
    <>
      <Helmet>
        <title>{`${title} - ${appName}`}</title>
        {description && <meta name="description" content={description} />}
        {noIndex && <meta name="robots" content="noindex" />}
      </Helmet>
      
      <div className={`mb-6 ${className}`}>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-2">
            <ol className="flex text-sm text-muted-foreground">
              {breadcrumbs.map((crumb, index) => (
                <li key={index} className="flex items-center">
                  {index > 0 && <span className="mx-2">/</span>}
                  {crumb.path ? (
                    <a href={crumb.path} className="hover:text-primary transition-colors">
                      {crumb.label}
                    </a>
                  ) : (
                    <span>{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        
        {showTitle && (
          <h1 className={`text-2xl font-bold tracking-tight md:text-3xl ${titleClassName}`}>
            {title}
          </h1>
        )}
        
        {children}
      </div>
    </>
  );
};

export default PageTitle;
