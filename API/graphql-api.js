// netlify/functions/graphql-api.js

const { graphql, buildSchema } = require('graphql');
const Airtable = require('airtable');
require('dotenv').config();

// Initialize Airtable with your API key and base ID
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

// GraphQL schema definition
const schema = buildSchema(`
  type Mutation {
    submitData(data: [InputData]!): String
  }

  input InputData {
    name: String!
    email: String!
  }

  type Query {
    status: String
  }
`);

// Root provides resolver functions for the API
const root = {
  status: () => {
    return 'GraphQL API is running';
  },

  submitData: async ({ data }) => {
    // Validate input array
    const invalidItems = data.filter(item => !item.name || !item.email);
    if (invalidItems.length > 0) {
      throw new Error('Some items are missing required fields');
    }

    // Map data to Airtable format
    const airtableRecords = data.map(item => ({
      fields: {
        Name: item.name,
        Email: item.email,
      },
    }));

    // Send valid data to Airtable
    try {
      await base('Table Name').create(airtableRecords);
      return 'Data successfully added to Airtable';
    } catch (error) {
      console.error('Error adding data to Airtable:', error);
      throw new Error('Error adding data to Airtable');
    }
  },
};

// CORS protection
const allowedOrigins = [
  'https://housemapper.co.uk', // Your allowed public URL
  'https://web.postman.co',       // Postman's app URL (use token auth if needed)
];

exports.handler = async function(event, context) {
  const origin = event.headers.origin;
  const postmanHeader = event.headers['x-postman-token'];

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : '',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Postman-Token',
        'Access-Control-Max-Age': '86400',
      },
      body: '',
    };
  }

  if (!allowedOrigins.includes(origin) && (!postmanHeader || postmanHeader !== process.env.POSTMAN_TOKEN)) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: 'CORS: This origin or Postman token is not allowed' }),
    };
  }

  if (event.httpMethod === 'POST') {
    const { query, variables } = JSON.parse(event.body);

    // Execute GraphQL query
    try {
      const response = await graphql(schema, query, root, null, variables);
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(response),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Server error' }),
      };
    }
  }

  return {
    statusCode: 405,
    body: JSON.stringify({ error: 'Method not allowed' }),
  };
};
