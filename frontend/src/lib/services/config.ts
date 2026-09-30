export const IS_DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || true; // Fallback to true if undefined

// Explicitly defaulting to true for the SIH demo fallback resilience requirement.
// Set NEXT_PUBLIC_DEMO_MODE=false in your .env to hit real endpoints.
