import '@testing-library/jest-dom/vitest';

// jsdom does not implement scrollIntoView.
Element.prototype.scrollIntoView = () => {};

// jsdom does not implement window.scrollTo.
window.scrollTo = () => {};
