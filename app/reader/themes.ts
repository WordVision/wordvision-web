export const midnightReaderTheme = {
  // Global body styles
  body: {
    'background-color': '#1e1e1e', // A dark, but not pure black, background
    'color': '#d4d4d4',            // A light gray for text, not stark white
    'font-family': "'-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    'font-size': '105%',           // Slightly larger base font size for readability
    'line-height': '1.7',          // Generous line spacing
    'padding-top': '20px',         // Some padding for content from the top of the reader
    'padding-bottom': '20px',      // Some padding for content from the bottom
    'padding-left': '15px',        // Padding on the sides
    'padding-right': '15px'
  },

  div: {
    'color': '#d4d4d4 !important', // Use !important as a strong override if needed
    'font-family': "'-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif !important",
    'background-color': 'transparent !important' // Ensure no overriding background from epub
  },

  // Paragraphs
  p: {
    'margin-bottom': '1.2em',
    'text-align': 'left !important',
  },

  // Headings (h1-h6)
  'h1, h2, h3, h4, h5, h6': {
    'color': '#e0e0e0',             // Slightly brighter for headings
    'font-family': "'-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif", // Consistent font
    'margin-top': '1.5em',
    'margin-bottom': '0.8em',
    'line-height': '1.3',
    'font-weight': '600'            // Slightly bolder
  },
  h1: { 'font-size': '2.2em' },
  h2: { 'font-size': '1.8em' },
  h3: { 'font-size': '1.5em' },
  h4: { 'font-size': '1.3em' },
  h5: { 'font-size': '1.1em' },
  h6: { 'font-size': '1.0em', 'font-style': 'italic' },

  // Links
  "a, a:link": {
    'color': '#61afef',             // A pleasant, readable blue for links
    'text-decoration': 'none',
    'font-weight': 'bold'           // Make links slightly bolder to stand out
  },
  'a:hover': {
    'color': '#82c0ff',             // Slightly lighter blue on hover
    'text-decoration': 'underline'
  },
  'a:visited': {
    'color': '#c678dd'              // A gentle purple for visited links
  },

  // Blockquotes
  blockquote: {
    'background-color': '#2a2a2a',
    'border-left': '4px solid #61afef', // Accent border with the link color
    'margin': '1.5em 0',
    'padding': '0.5em 1em',
    'color': '#cccccc'
  },
  'blockquote p': {
    'margin-bottom': '0.5em'
  },

  // Code blocks and inline code
  'pre': {
    'background-color': '#282c34', // Common dark background for code
    'color': '#abb2bf',            // Common text color for code
    'padding': '0.5rem',
    'border-radius': '4px',
    'overflow-x': 'auto',          // For horizontal scrolling if code is wide
    'font-family': "'Fira Code', 'Consolas', 'Monaco', 'Andale Mono', 'Ubuntu Mono', monospace",
    'font-size': '0.9em',
    'line-height': '1.5'
  },
  'code': {
    'background-color': '#282c34',
    'color': '#abb2bf',
    'padding': '0.2em 0.4em',
    'border-radius': '3px',
    'font-family': "'Fira Code', 'Consolas', 'Monaco', 'Andale Mono', 'Ubuntu Mono', monospace",
    'font-size': '0.9em'
  },
  'pre code': { // Reset padding for code inside pre
    'padding': '0',
    'background-color': 'transparent'
  },

  // Images
  img: {
    'max-width': '100%',    // Ensure images are responsive and don't overflow
    'height': 'auto',       // Maintain aspect ratio
    'display': 'block',     // Helps with centering if margin auto is used
    'margin-left': 'auto',
    'margin-right': 'auto',
    'margin-top': '1em',
    'margin-bottom': '1em'
  },

  // Horizontal rule
  hr: {
    'border': '0',
    'border-top': '1px solid #444444', // A subtle separator
    'margin': '2em 0'
  },

  // Lists
  'ul, ol': {
    'margin-left': '1.5em',
    'margin-bottom': '1em'
  },

  li: {
    'margin-bottom': '0.5em'
  },
};

export const daylightReaderTheme = {
  // Global body styles
  body: {
    'background-color': '#FCFCFC', // A very light, clean background, not stark white
    'color': '#222222',            // A dark gray for text for good readability
    'font-family': "'-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    'font-size': '105%',
    'line-height': '1.7',
    'padding-top': '20px',
    'padding-bottom': '20px',
    'padding-left': '15px',
    'padding-right': '15px'
  },

  // General div styling to ensure consistent text color and transparent background
  div: {
    'color': '#222222 !important', // Ensures divs inherit the main dark text color
    'font-family': "'-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif !important", // Keep consistent font
    'background-color': 'transparent !important' // Ensure no overriding background from epub
  },

  // Paragraphs
  p: {
    'margin-bottom': '1.2em',
    'text-align': 'left !important', // Retained from your dark theme
    // Color will be inherited from 'body' or 'div'
  },

  // Headings (h1-h6)
  'h1, h2, h3, h4, h5, h6': {
    'color': '#111111',             // Slightly darker/richer for headings on a light background
    'font-family': "'-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    'margin-top': '1.5em',
    'margin-bottom': '0.8em',
    'line-height': '1.3',
    'font-weight': '600'
  },
  h1: { 'font-size': '2.2em' },
  h2: { 'font-size': '1.8em' },
  h3: { 'font-size': '1.5em' },
  h4: { 'font-size': '1.3em' },
  h5: { 'font-size': '1.1em' },
  h6: { 'font-size': '1.0em', 'font-style': 'italic' },

  // Links
  "a, a:link": {
    'color': '#0066CC',             // A standard, readable blue for links on light backgrounds
    'text-decoration': 'none',
    'font-weight': 'bold'
  },
  'a:hover': {
    'color': '#004499',             // A darker blue for hover effect
    'text-decoration': 'underline'
  },
  'a:visited': {
    'color': '#551A8B',             // Standard purple for visited links
  },

  // Blockquotes
  blockquote: {
    'background-color': '#f0f0f0',    // Light gray background for blockquotes
    'border-left': '4px solid #0066CC', // Accent border with the new link color
    'margin': '1.5em 0',
    'padding': '0.5em 1em',
    'color': '#444444'                // Darker gray text for blockquotes
  },
  'blockquote p': {
    'margin-bottom': '0.5em',
    // Text color will be inherited from blockquote
  },

  // Code blocks and inline code
  'pre': {
    'background-color': '#f4f4f4',    // Light gray background, common for code
    'color': '#2d2d2d',               // Dark text color for code
    'padding': '0.5rem', // Kept padding from your example, adjust if needed
    'border-radius': '4px',
    'overflow-x': 'auto',
    'font-family': "'Fira Code', 'Consolas', 'Monaco', 'Andale Mono', 'Ubuntu Mono', monospace",
    'font-size': '0.9em',
    'line-height': '1.5',
    'border': '1px solid #e1e1e1'    // Optional: slight border for pre blocks
  },
  'code': {
    'background-color': '#f4f4f4',    // Consistent with pre
    'color': '#2d2d2d',               // Consistent with pre
    'padding': '0.2em 0.4em',
    'border-radius': '3px',
    'font-family': "'Fira Code', 'Consolas', 'Monaco', 'Andale Mono', 'Ubuntu Mono', monospace",
    'font-size': '0.9em'
  },
  'pre code': {
    'padding': '0',
    'background-color': 'transparent', // Code inside pre shouldn't have its own background
    'border': 'none'                   // No border for code within pre if pre has one
  },

  // Images
  img: {
    'max-width': '100%',
    'height': 'auto',
    'display': 'block',
    'margin-left': 'auto',
    'margin-right': 'auto',
    'margin-top': '1em',
    'margin-bottom': '1em'
  },

  // Horizontal rule
  hr: {
    'border': '0',
    'border-top': '1px solid #cccccc', // Light gray separator
    'margin': '2em 0'
  },

  // Lists
  'ul, ol': {
    'margin-left': '1.5em',
    'margin-bottom': '1em'
  },
  li: {
    'margin-bottom': '0.5em'
  },

  // --- ANNOTATION HIGHLIGHTS (Examples for Light Theme) ---
  // You'd adapt your annotation classes. Here are some ideas:
  // '.light-theme-gold-highlight svg g path': {
  //   'fill': '#FFD700 !important', // Gold, more vibrant on light
  //   'fill-opacity': '0.3 !important'
  // },
  // '.light-theme-teal-highlight svg g path': {
  //   'fill': '#008080 !important', // Teal
  //   'fill-opacity': '0.35 !important'
  // },
  // '.light-theme-purple-highlight svg g path': {
  //   'fill': '#9370DB !important', // Medium Purple
  //   'fill-opacity': '0.35 !important'
  // }
};
