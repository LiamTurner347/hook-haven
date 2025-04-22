# Hook Haven

Welcome to Hook Haven!

Hook Haven is a full-stack webhook testing tool for inspecting HTTP requests. Built with React, TypeScript, Node.js, Express, PostgreSQL, MongoDB, with NGINX-based routing, deployed on DigitalOcean.

A user can create a unique bucket for webhooks. Each bucket is associated with two URLs:

- one for sending requests to the bucket; and
- one for viewing requests made to the bucket (viewable via a UI).

When requests are made to the bucket:

- The request method, path, headers, and body are displayed on the UI
- The user can see a list of total requests made to a bucket
- The user can click past requests from this list and view data for that request
- The bucket and request data are stored in PostgeSQL
- The request payload data is stored in MongoDB
- The user is associated with a specific bucket, so that the same visitor can navigate back to the same bucket after closing and reopening the window
- The user can easily click a button to copy the endpoint
