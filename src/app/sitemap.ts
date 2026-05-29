import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://millionwoodusa.com',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
      alternates: {
        languages: {
          en: 'https://millionwoodusa.com/?lang=en',
          es: 'https://millionwoodusa.com/?lang=es',
        },
      },
    },
  ];
}
