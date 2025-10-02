# Halcyon Urban Resilience Platform

Halcyon is a NASA Space Apps Challenge project that helps urban planners analyze and improve city resilience using real NASA satellite data. The platform fuses multiple data sources to identify heat, flood, and water stress hotspots, and provides actionable insights for interventions.

## Features

- Interactive map of Dhaka with URVI risk visualization
- Real-time risk factor adjustment
- Scenario simulation for urban interventions
- NASA data integration (GPM, Landsat, POWER, Sentinel, VIIRS, GRACE)
- Professional frontend and backend architecture

## Folder Structure

halcyon-platform/
├── halcyon-frontend/ # Frontend files
├── config/
├── routes/
├── services/
├── utils/
├── node_modules/
├── .env
├── package.json
├── package-lock.json
├── server.js
├── README.md
├── .gitignore
└── docs/


## Getting Started

1. Clone the repository
2. Install backend dependencies: `npm install`
3. Set up `.env` for Google Earth Engine credentials
4. Start backend: `npm run dev`
5. Open frontend in VS Code and use Live Server or Python HTTP server

## NASA Data Sources

- GPM IMERG (precipitation)
- Landsat 8/9 (surface temperature, NDVI)
- NASA POWER (meteorology)
- Sentinel-5P (air quality)
- VIIRS (nighttime lights)
- GRACE-FO (groundwater)

## Deployment

- GitHub for version control
- Vercel for frontend/backend deployment

## License

MIT

## Contributors

- Zubayer & Hirok
- NASA Space Apps Challenge Team

