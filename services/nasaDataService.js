const ee = require('@google/earthengine');
const axios = require('axios');

class NASADataService {
    constructor() {
        this.initialized = false;
        this.powerApiBase = 'https://power.larc.nasa.gov/api/temporal';
    }

    async initialize() {
        try {
            // Initialize Google Earth Engine
            const serviceAccount = process.env.GEE_SERVICE_ACCOUNT;
            const privateKey = process.env.GEE_PRIVATE_KEY;

            if (serviceAccount && privateKey) {
                const credentials = {
                    client_email: serviceAccount,
                    private_key: privateKey.replace(/\\n/g, '\n')
                };

                await ee.data.authenticateViaPrivateKey(credentials);
                await ee.initialize();
                console.log('Google Earth Engine initialized successfully');
            } else {
                console.warn('Earth Engine credentials not provided, using mock data');
            }

            this.initialized = true;
        } catch (error) {
            console.error('Failed to initialize NASA services:', error);
            throw error;
        }
    }

    async fetchData(dataType, params) {
        if (!this.initialized) {
            throw new Error('NASA Data Service not initialized');
        }

        switch (dataType.toLowerCase()) {
            case 'imerg':
                return await this.getIMERGData(params);
            case 'landsat':
                return await this.getLandsatLST(params);
            case 'sentinel5p':
                return await this.getSentinel5P_NO2(params);
            case 'viirs':
                return await this.getVIIRSNightlights(params);
            case 'power':
                return await this.getPowerData(params);
            case 'grace':
                return await this.getGRACEData(params);
            default:
                throw new Error(`Unsupported data type: ${dataType}`);
        }
    }

    async getIMERGData(params) {
        try {
            if (!ee.data.getAuthToken()) {
                return this.getMockIMERGData();
            }

            const { bounds, days = 30 } = params;
            const endDate = new Date();
            const startDate = new Date(endDate.getTime() - (days * 24 * 60 * 60 * 1000));

            const collection = ee.ImageCollection('NASA/GPM_L3/IMERG_V07')
                .filterDate(startDate, endDate)
                .filterBounds(ee.Geometry.Rectangle(bounds))
                .select(['precipitation']);

            const meanPrecipitation = collection.mean();
            const stats = meanPrecipitation.reduceRegion({
                reducer: ee.Reducer.mean(),
                geometry: ee.Geometry.Rectangle(bounds),
                scale: 11000,
                maxPixels: 1e9
            });

            return await stats.getInfo();
        } catch (error) {
            console.error('IMERG data fetch error:', error);
            return this.getMockIMERGData();
        }
    }

    async getLandsatLST(params) {
        try {
            if (!ee.data.getAuthToken()) {
                return this.getMockLandsatData();
            }

            const { bounds, months = 6 } = params;
            const endDate = new Date();
            const startDate = new Date(endDate.getTime() - (months * 30 * 24 * 60 * 60 * 1000));

            const collection = ee.ImageCollection('LANDSAT/LC08_C02_T1_L2')
                .filterDate(startDate, endDate)
                .filterBounds(ee.Geometry.Rectangle(bounds))
                .filter(ee.Filter.lt('CLOUD_COVER', 20));

            const withLST = collection.map(image => {
                const lst = image.select('ST_B10').multiply(0.00341802).add(149.0);
                const ndvi = image.normalizedDifference(['SR_B5', 'SR_B4']);
                return image.addBands([lst.rename('LST'), ndvi.rename('NDVI')]);
            });

            const meanImage = withLST.mean();
            const stats = meanImage.select(['LST', 'NDVI']).reduceRegion({
                reducer: ee.Reducer.mean(),
                geometry: ee.Geometry.Rectangle(bounds),
                scale: 30,
                maxPixels: 1e9
            });

            return await stats.getInfo();
        } catch (error) {
            console.error('Landsat data fetch error:', error);
            return this.getMockLandsatData();
        }
    }

    async getSentinel5P_NO2(params) {
        try {
            if (!ee.data.getAuthToken()) {
                return this.getMockSentinel5PData();
            }

            const { bounds, days = 30 } = params;
            const endDate = new Date();
            const startDate = new Date(endDate.getTime() - (days * 24 * 60 * 60 * 1000));

            const collection = ee.ImageCollection('COPERNICUS/S5P/OFFL/L3_NO2')
                .filterDate(startDate, endDate)
                .filterBounds(ee.Geometry.Rectangle(bounds))
                .select(['tropospheric_NO2_column_number_density']);

            const meanNO2 = collection.mean();
            const stats = meanNO2.reduceRegion({
                reducer: ee.Reducer.mean(),
                geometry: ee.Geometry.Rectangle(bounds),
                scale: 1113,
                maxPixels: 1e9
            });

            return await stats.getInfo();
        } catch (error) {
            console.error('Sentinel-5P data fetch error:', error);
            return this.getMockSentinel5PData();
        }
    }

    async getVIIRSNightlights(params) {
        try {
            if (!ee.data.getAuthToken()) {
                return this.getMockVIIRSData();
            }

            const { bounds, months = 12 } = params;
            const endDate = new Date();
            const startDate = new Date(endDate.getTime() - (months * 30 * 24 * 60 * 60 * 1000));

            const collection = ee.ImageCollection('NASA/VIIRS/002/VNP46A2')
                .filterDate(startDate, endDate)
                .filterBounds(ee.Geometry.Rectangle(bounds))
                .select(['DNB_BRDF-Corrected_NTL']);

            const meanNTL = collection.mean();
            const stats = meanNTL.reduceRegion({
                reducer: ee.Reducer.mean(),
                geometry: ee.Geometry.Rectangle(bounds),
                scale: 500,
                maxPixels: 1e9
            });

            return await stats.getInfo();
        } catch (error) {
            console.error('VIIRS data fetch error:', error);
            return this.getMockVIIRSData();
        }
    }

    async getPowerData(params) {
        try {
            const { latitude, longitude, startDate, endDate } = params;

            const url = `${this.powerApiBase}/daily/point`;
            const queryParams = new URLSearchParams({
                parameters: 'T2M,RH2M,WS10M,PRECTOTCORR',
                community: 'RE',
                longitude: longitude,
                latitude: latitude,
                start: startDate.replace(/-/g, ''),
                end: endDate.replace(/-/g, ''),
                format: 'JSON'
            });

            const response = await axios.get(`${url}?${queryParams}`, {
                timeout: 30000
            });

            return response.data;
        } catch (error) {
            console.error('NASA POWER API error:', error);
            return this.getMockPowerData();
        }
    }

    async getGRACEData(params) {
        try {
            if (!ee.data.getAuthToken()) {
                return this.getMockGRACEData();
            }

            const { bounds, months = 24 } = params;
            const endDate = new Date();
            const startDate = new Date(endDate.getTime() - (months * 30 * 24 * 60 * 60 * 1000));

            const collection = ee.ImageCollection('NASA/GRACE/MASS_GRIDS/LAND')
                .filterDate(startDate, endDate)
                .filterBounds(ee.Geometry.Rectangle(bounds))
                .select(['lwe_thickness']);

            const meanThickness = collection.mean();
            const stats = meanThickness.reduceRegion({
                reducer: ee.Reducer.mean(),
                geometry: ee.Geometry.Rectangle(bounds),
                scale: 25000,
                maxPixels: 1e9
            });

            return await stats.getInfo();
        } catch (error) {
            console.error('GRACE data fetch error:', error);
            return this.getMockGRACEData();
        }
    }

    // Mock data methods for development/fallback
    getMockIMERGData() {
        return {
            precipitation: 0.15 + Math.random() * 0.3, // mm/hr
            quality_flag: 1,
            timestamp: new Date().toISOString()
        };
    }

    getMockLandsatData() {
        return {
            LST: 305.5 + Math.random() * 10, // Kelvin (32-42°C range)
            NDVI: 0.2 + Math.random() * 0.4,
            timestamp: new Date().toISOString()
        };
    }

    getMockSentinel5PData() {
        return {
            tropospheric_NO2_column_number_density: 0.00005 + Math.random() * 0.0001,
            timestamp: new Date().toISOString()
        };
    }

    getMockVIIRSData() {
        return {
            "DNB_BRDF-Corrected_NTL": 15.5 + Math.random() * 20,
            timestamp: new Date().toISOString()
        };
    }

    getMockPowerData() {
        return {
            parameters: {
                T2M: 28 + Math.random() * 8, // °C
                RH2M: 65 + Math.random() * 25, // %
                WS10M: 2 + Math.random() * 4, // m/s
                PRECTOTCORR: Math.random() * 5 // mm/day
            },
            timestamp: new Date().toISOString()
        };
    }

    getMockGRACEData() {
        return {
            lwe_thickness: -2 + Math.random() * 4, // cm
            timestamp: new Date().toISOString()
        };
    }
}

module.exports = new NASADataService();