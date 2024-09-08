// lib/sanity.js
import sanityClient from '@sanity/client';

export const client = sanityClient({
  projectId: 'your-project-id', // Replace with your Sanity project ID
  dataset: 'your-dataset-name', // Replace with your dataset name
  apiVersion: '2023-01-01', // Use the latest API version
  useCdn: true, // `false` if you want to ensure fresh data
  token: process.env.SANITY_API_TOKEN, // Optional: add token for private datasets
});
