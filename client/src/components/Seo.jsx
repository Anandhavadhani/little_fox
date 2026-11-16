import { useEffect } from 'react';

function Seo({ title, description, image, path = '/' }) {
  useEffect(() => {
    const setMeta = (selector, content) => {
      let element = document.head.querySelector(selector);

      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('name' in selector ? 'name' : 'property', selector.includes('og:') ? selector.replace('meta[property="', '').replace('"]', '') : selector.replace('meta[name="', '').replace('"]', ''));
        document.head.appendChild(element);
      }

      element.setAttribute(selector.includes('og:') ? 'property' : 'name', selector.includes('og:') ? selector.replace('meta[property="', '').replace('"]', '') : selector.replace('meta[name="', '').replace('"]', ''));
      element.setAttribute('content', content);
    };

    document.title = title || 'Little Fox';

    const metaDescription = document.head.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description || 'Little Fox book recommendations.');
    } else {
      const tag = document.createElement('meta');
      tag.name = 'description';
      tag.content = description || 'Little Fox book recommendations.';
      document.head.appendChild(tag);
    }

    const ogTitle = document.head.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', title || 'Little Fox');
    } else {
      const tag = document.createElement('meta');
      tag.setAttribute('property', 'og:title');
      tag.content = title || 'Little Fox';
      document.head.appendChild(tag);
    }

    const ogDescription = document.head.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', description || 'Little Fox book recommendations.');
    } else {
      const tag = document.createElement('meta');
      tag.setAttribute('property', 'og:description');
      tag.content = description || 'Little Fox book recommendations.';
      document.head.appendChild(tag);
    }

    const ogImage = document.head.querySelector('meta[property="og:image"]');
    if (ogImage) {
      ogImage.setAttribute('content', image || '/logo/little-fox-logo.jpeg');
    } else {
      const tag = document.createElement('meta');
      tag.setAttribute('property', 'og:image');
      tag.content = image || '/logo/little-fox-logo.jpeg';
      document.head.appendChild(tag);
    }

    const ogUrl = document.head.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute('content', `${window.location.origin}${path}`);
    } else {
      const tag = document.createElement('meta');
      tag.setAttribute('property', 'og:url');
      tag.content = `${window.location.origin}${path}`;
      document.head.appendChild(tag);
    }
  }, [title, description, image, path]);

  return null;
}

export default Seo;
