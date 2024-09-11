## Project Structure of Next.js 14

#### Directory Structure

```
src/
└─── app/                 # App entry point
    └─── (pages)/         # Group folder page
        └─── layout.tsx   # Main layout
    └─── api/             # Api route
        └─── [...path]/   # Api SSR dynamic path
        └─── auth/        # Api next-auth
        └─── sse/         # Api for sse (fix path)
└─── components/          # Component utility
└─── context/             # Use context (Language, Loading)
└─── styles/              # Theme.scss for config color theme, globals.css
└─── types/               # Interface type (session next-auth)
└─── utils/               # Utility function and default data
public/                   # Asset file
```

#### Start App

##### Install dependencies

`$ yarn install` or `$ npm install`

##### Start app

`$ yarn start` or `$ npm start`
