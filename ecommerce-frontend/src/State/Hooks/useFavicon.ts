import { useEffect } from 'react';

export const useFavicon = (template: string) => {
  useEffect(() => {
    const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    
    if (template === 'TEMP2') { 
      link.href = `${process.env.PUBLIC_URL}/favicon.ico`;
    } else {
      link.href = `${process.env.PUBLIC_URL}/favicon.ico`;
    }
    
    document.getElementsByTagName('head')[0].appendChild(link);
  }, [template]);
};