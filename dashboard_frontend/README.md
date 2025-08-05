# Lightweight React Template for KAVIA

This project provides a minimal React template with a clean, modern UI and minimal dependencies.

## Features

- **Lightweight**: No heavy UI frameworks - uses only vanilla CSS and React
- **Modern UI**: Clean, responsive design with KAVIA brand styling
- **Fast**: Minimal dependencies for quick loading times
- **Simple**: Easy to understand and modify
## Environment Configuration

### Setting Environment Variables

- To configure backend API URLs or advanced settings, use a `.env` file in the **root of this folder** (next to `package.json`).
- File must be named exactly `.env` (no extension).
- Any variable you wish to use in code must be prefixed with `REACT_APP_` (this is required by Create React App).

Example `.env`:
```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_DANGEROUSLY_DISABLE_HOST_CHECK=false
# For preview/cloud/non-localhost dev: uncomment below to fix Invalid Host header errors
# HOST=0.0.0.0
```
- Copy `.env.example` and modify for your needs.
- Never commit your actual `.env` file.

**Do NOT place `.env` files inside `src/` or other subfolders.**

> #### Invalid Host header or cloud/preview access
> If you see an "Invalid Host header" error on preview/cloud/remote/CI/CD/port-forwarded environments,
> add `HOST=0.0.0.0` to your `.env` and restart the dev server. This tells React's dev server to accept requests from all hosts/ports, not just localhost, and is needed for browser access in container/preview/remote setups.
> 
> See [Create React App: HOST documentation](https://create-react-app.dev/docs/advanced-configuration/#custom-environment-variables)
> and [Common Invalid Host Header issues](https://github.com/facebook/create-react-app/issues/11203) for details.

More info: [Create React App: Adding Custom Environment Variables](https://create-react-app.dev/docs/adding-custom-environment-variables/)

-----------

## Getting Started

In the project directory, you can run:

### `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

## Customization

### Colors

The main brand colors are defined as CSS variables in `src/App.css`:

```css
:root {
  --kavia-orange: #E87A41;
  --kavia-dark: #1A1A1A;
  --text-color: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.7);
  --border-color: rgba(255, 255, 255, 0.1);
}
```

### Components

This template uses pure HTML/CSS components instead of a UI framework. You can find component styles in `src/App.css`. 

Common components include:
- Buttons (`.btn`, `.btn-large`)
- Container (`.container`)
- Navigation (`.navbar`)
- Typography (`.title`, `.subtitle`, `.description`)

## Learn More

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
