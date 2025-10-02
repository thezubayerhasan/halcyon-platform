const ee = require('@google/earthengine');

class EarthEngineConfig {
    constructor() {
        this.initialized = false;
        this.authToken = null;
        this.projectId = process.env.GEE_PROJECT_ID || 'earth-engine-project';
    }

    async authenticate() {
        try {
            const serviceAccount = process.env.GEE_SERVICE_ACCOUNT;
            const privateKey = process.env.GEE_PRIVATE_KEY;

            if (!serviceAccount || !privateKey) {
                console.warn('Google Earth Engine credentials not provided. Using mock data mode.');
                return false;
            }

            const credentials = {
                client_email: serviceAccount,
                private_key: privateKey.replace(/\\n/g, '\n'),
                private_key_id: process.env.GEE_PRIVATE_KEY_ID
            };

            await ee.data.authenticateViaPrivateKey(credentials);
            await ee.initialize({
                project: this.projectId
            });

            this.initialized = true;
            this.authToken = ee.data.getAuthToken();

            console.log('Google Earth Engine authenticated successfully');
            return true;
        } catch (error) {
            console.error('Earth Engine authentication failed:', error);
            return false;
        }
    }

    isAuthenticated() {
        return this.initialized && this.authToken !== null;
    }

    getCollectionInfo(collectionId) {
        const collections = {
            'NASA/GPM_L3/IMERG_V07': {
                description: 'GPM IMERG Precipitation V07',
                bands: ['precipitation', 'precipitationQualityIndex'],
                temporal_resolution: '30 minutes',
                spatial_resolution: '11 km',
                date_range: ['2000-06-01', 'present']
            },
            'LANDSAT/LC08_C02_T1_L2': {
                description: 'Landsat 8 Collection 2 Level 2',
                bands: ['ST_B10', 'SR_B5', 'SR_B4', 'SR_B3'],
                temporal_resolution: '16 days',
                spatial_resolution: '30 m',
                date_range: ['2013-03-18', 'present']
            },
            'COPERNICUS/S5P/OFFL/L3_NO2': {
                description: 'Sentinel-5P NO2 Offline',
                bands: ['tropospheric_NO2_column_number_density'],
                temporal_resolution: 'Daily',
                spatial_resolution: '1.1 km',
                date_range: ['2018-06-28', 'present']
            },
            'NASA/VIIRS/002/VNP46A2': {
                description: 'VIIRS Nighttime Lights',
                bands: ['DNB_BRDF-Corrected_NTL'],
                temporal_resolution: 'Daily',
                spatial_resolution: '500 m',
                date_range: ['2012-01-19', 'present']
            },
            'NASA/GRACE/MASS_GRIDS/LAND': {
                description: 'GRACE Land Mass Grids',
                bands: ['lwe_thickness'],
                temporal_resolution: 'Monthly',
                spatial_resolution: '25 km',
                date_range: ['2002-04-01', 'present']
            },
            'USGS/SRTMGL1_003': {
                description: 'SRTM Digital Elevation Model',
                bands: ['elevation'],
                temporal_resolution: 'Static',
                spatial_resolution: '30 m',
                date_range: ['2000-02-11', '2000-02-22']
            }
        };

        return collections[collectionId] || null;
    }

    // Utility methods for Earth Engine operations
    createGeometry(bounds) {
        if (Array.isArray(bounds) && bounds.length === 4) {
            // [west, south, east, north]
            return ee.Geometry.Rectangle(bounds);
        }
        throw new Error('Invalid bounds format. Expected [west, south, east, north]');
    }

    createDateRange(startDate, endDate) {
        return ee.DateRange(startDate, endDate);
    }

    // Common filtering operations
    filterCollection(collection, geometry, dateRange, cloudCover = null) {
        let filtered = ee.ImageCollection(collection)
            .filterBounds(geometry)
            .filterDate(dateRange.start(), dateRange.end());

        if (cloudCover !== null && collection.includes('LANDSAT')) {
            filtered = filtered.filter(ee.Filter.lt('CLOUD_COVER', cloudCover));
        }

        return filtered;
    }

    // Reducer operations
    getReducers() {
        return {
            mean: ee.Reducer.mean(),
            max: ee.Reducer.max(),
            min: ee.Reducer.min(),
            median: ee.Reducer.median(),
            percentile: (percentile) => ee.Reducer.percentile([percentile]),
            count: ee.Reducer.count(),
            stdDev: ee.Reducer.stdDev(),
            variance: ee.Reducer.variance()
        };
    }

    // Scale and projection settings for different datasets
    getScaleAndProjection(collectionId) {
        const settings = {
            'NASA/GPM_L3/IMERG_V07': { scale: 11000, crs: 'EPSG:4326' },
            'LANDSAT/LC08_C02_T1_L2': { scale: 30, crs: 'EPSG:4326' },
            'COPERNICUS/S5P/OFFL/L3_NO2': { scale: 1113, crs: 'EPSG:4326' },
            'NASA/VIIRS/002/VNP46A2': { scale: 500, crs: 'EPSG:4326' },
            'NASA/GRACE/MASS_GRIDS/LAND': { scale: 25000, crs: 'EPSG:4326' },
            'USGS/SRTMGL1_003': { scale: 30, crs: 'EPSG:4326' }
        };

        return settings[collectionId] || { scale: 1000, crs: 'EPSG:4326' };
    }

    // Export configuration for different formats
    getExportConfig(format = 'json') {
        const configs = {
            json: {
                format: 'JSON',
                selectors: null
            },
            geotiff: {
                format: 'GEO_TIFF',
                formatOptions: {
                    cloudOptimized: true
                }
            },
            csv: {
                format: 'CSV',
                selectors: null
            }
        };

        return configs[format] || configs.json;
    }
}

module.exports = new EarthEngineConfig();