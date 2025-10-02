const fs = require('fs');
const path = require('path');

class DataProcessor {
    constructor() {
        this.processingCache = new Map();
        this.maxCacheSize = 100;
        this.cacheTimeout = 300000; // 5 minutes
    }

    // Normalize data to 0-100 scale for URVI calculation
    normalize(value, min, max) {
        if (max === min) return 0;
        return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
    }

    // Process NASA satellite data for urban analysis
    processSatelliteData(dataType, rawData, bounds) {
        const cacheKey = `${dataType}_${JSON.stringify(bounds)}_${Date.now()}`;

        if (this.processingCache.has(cacheKey)) {
            return this.processingCache.get(cacheKey);
        }

        let processedData;

        switch (dataType.toLowerCase()) {
            case 'imerg':
                processedData = this.processIMERGData(rawData);
                break;
            case 'landsat':
                processedData = this.processLandsatData(rawData);
                break;
            case 'sentinel5p':
                processedData = this.processSentinel5PData(rawData);
                break;
            case 'viirs':
                processedData = this.processVIIRSData(rawData);
                break;
            case 'grace':
                processedData = this.processGRACEData(rawData);
                break;
            default:
                throw new Error(`Unsupported data type for processing: ${dataType}`);
        }

        // Cache the processed data
        this.cacheProcessedData(cacheKey, processedData);

        return processedData;
    }

    // Process GPM IMERG precipitation data
    processIMERGData(rawData) {
        if (!rawData || typeof rawData.precipitation !== 'number') {
            throw new Error('Invalid IMERG data structure');
        }

        const precipitation = rawData.precipitation;

        // Convert mm/hr to flood risk score (0-100)
        // Extreme precipitation > 10mm/hr = high flood risk
        const floodRisk = Math.min(100, (precipitation / 10) * 100);

        return {
            original_value: precipitation,
            flood_risk_score: Math.round(floodRisk * 100) / 100,
            intensity_category: this.getPrecipitationCategory(precipitation),
            processed_timestamp: new Date().toISOString()
        };
    }

    // Process Landsat Land Surface Temperature data  
    processLandsatData(rawData) {
        if (!rawData || typeof rawData.LST !== 'number') {
            throw new Error('Invalid Landsat data structure');
        }

        const lstKelvin = rawData.LST;
        const lstCelsius = lstKelvin - 273.15;
        const ndvi = rawData.NDVI || 0;

        // Convert temperature to heat risk score
        // Normal range: 25-35°C, extreme > 40°C
        const heatRisk = Math.min(100, Math.max(0, ((lstCelsius - 25) / 15) * 100));

        // NDVI health score (higher NDVI = lower heat risk)
        const vegetationHealth = Math.max(0, Math.min(100, ndvi * 100));

        return {
            temperature_celsius: Math.round(lstCelsius * 100) / 100,
            temperature_kelvin: lstKelvin,
            heat_risk_score: Math.round(heatRisk * 100) / 100,
            vegetation_health: Math.round(vegetationHealth * 100) / 100,
            ndvi: ndvi,
            heat_category: this.getTemperatureCategory(lstCelsius),
            processed_timestamp: new Date().toISOString()
        };
    }

    // Process Sentinel-5P air quality data
    processSentinel5PData(rawData) {
        if (!rawData || typeof rawData.tropospheric_NO2_column_number_density !== 'number') {
            throw new Error('Invalid Sentinel-5P data structure');
        }

        const no2Density = rawData.tropospheric_NO2_column_number_density;

        // Convert NO2 column density to air quality risk score
        // WHO guideline: 40 μg/m³ annual average
        // Convert mol/m² to approximate μg/m³ equivalent for risk scoring
        const no2Risk = Math.min(100, Math.max(0, (no2Density / 0.0001) * 100));

        return {
            no2_column_density: no2Density,
            air_quality_risk_score: Math.round(no2Risk * 100) / 100,
            pollution_category: this.getAirQualityCategory(no2Risk),
            processed_timestamp: new Date().toISOString()
        };
    }

    // Process VIIRS nighttime lights data
    processVIIRSData(rawData) {
        if (!rawData || typeof rawData["DNB_BRDF-Corrected_NTL"] !== 'number') {
            throw new Error('Invalid VIIRS data structure');
        }

        const nightlights = rawData["DNB_BRDF-Corrected_NTL"];

        // Convert nighttime lights to human activity/urbanization score
        // Higher values indicate more human activity and infrastructure
        const activityScore = Math.min(100, Math.max(0, (nightlights / 50) * 100));

        return {
            nighttime_lights: nightlights,
            human_activity_score: Math.round(activityScore * 100) / 100,
            urbanization_category: this.getUrbanizationCategory(activityScore),
            processed_timestamp: new Date().toISOString()
        };
    }

    // Process GRACE groundwater data
    processGRACEData(rawData) {
        if (!rawData || typeof rawData.lwe_thickness !== 'number') {
            throw new Error('Invalid GRACE data structure');
        }

        const waterThickness = rawData.lwe_thickness;

        // Convert water thickness anomaly to water stress score
        // Negative values indicate water loss/stress
        const waterStress = Math.max(0, Math.min(100, (-waterThickness + 5) * 10));

        return {
            water_thickness_cm: waterThickness,
            water_stress_score: Math.round(waterStress * 100) / 100,
            water_status: this.getWaterStressCategory(waterStress),
            processed_timestamp: new Date().toISOString()
        };
    }

    // Helper methods for categorization
    getPrecipitationCategory(precipitation) {
        if (precipitation < 0.1) return 'Light';
        if (precipitation < 2.5) return 'Moderate';
        if (precipitation < 10) return 'Heavy';
        if (precipitation < 50) return 'Violent';
        return 'Extreme';
    }

    getTemperatureCategory(celsius) {
        if (celsius < 20) return 'Cool';
        if (celsius < 30) return 'Comfortable';
        if (celsius < 35) return 'Warm';
        if (celsius < 40) return 'Hot';
        return 'Extreme Heat';
    }

    getAirQualityCategory(riskScore) {
        if (riskScore < 20) return 'Good';
        if (riskScore < 40) return 'Moderate';
        if (riskScore < 60) return 'Unhealthy for Sensitive';
        if (riskScore < 80) return 'Unhealthy';
        return 'Very Unhealthy';
    }

    getUrbanizationCategory(activityScore) {
        if (activityScore < 20) return 'Rural';
        if (activityScore < 40) return 'Suburban';
        if (activityScore < 60) return 'Urban';
        if (activityScore < 80) return 'Dense Urban';
        return 'Metropolitan';
    }

    getWaterStressCategory(stressScore) {
        if (stressScore < 20) return 'Abundant';
        if (stressScore < 40) return 'Adequate';
        if (stressScore < 60) return 'Stressed';
        if (stressScore < 80) return 'Severely Stressed';
        return 'Critical';
    }

    // Cache management
    cacheProcessedData(key, data) {
        // Implement LRU cache eviction if needed
        if (this.processingCache.size >= this.maxCacheSize) {
            const firstKey = this.processingCache.keys().next().value;
            this.processingCache.delete(firstKey);
        }

        this.processingCache.set(key, {
            data: data,
            timestamp: Date.now()
        });

        // Auto-expire cache entries
        setTimeout(() => {
            this.processingCache.delete(key);
        }, this.cacheTimeout);
    }

    // Aggregate data for multiple time periods
    aggregateTimeSeriesData(dataArray, aggregationType = 'mean') {
        if (!Array.isArray(dataArray) || dataArray.length === 0) {
            return null;
        }

        const validData = dataArray.filter(item => item && typeof item === 'object');
        if (validData.length === 0) return null;

        switch (aggregationType) {
            case 'mean':
                return this.calculateMean(validData);
            case 'max':
                return this.calculateMax(validData);
            case 'min':
                return this.calculateMin(validData);
            case 'trend':
                return this.calculateTrend(validData);
            default:
                throw new Error(`Unsupported aggregation type: ${aggregationType}`);
        }
    }

    calculateMean(dataArray) {
        const keys = Object.keys(dataArray[0]).filter(key => typeof dataArray[0][key] === 'number');
        const result = {};

        keys.forEach(key => {
            const values = dataArray.map(item => item[key]).filter(val => !isNaN(val));
            result[key] = values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0;
        });

        return result;
    }

    calculateMax(dataArray) {
        const keys = Object.keys(dataArray[0]).filter(key => typeof dataArray[0][key] === 'number');
        const result = {};

        keys.forEach(key => {
            const values = dataArray.map(item => item[key]).filter(val => !isNaN(val));
            result[key] = values.length > 0 ? Math.max(...values) : 0;
        });

        return result;
    }

    calculateMin(dataArray) {
        const keys = Object.keys(dataArray[0]).filter(key => typeof dataArray[0][key] === 'number');
        const result = {};

        keys.forEach(key => {
            const values = dataArray.map(item => item[key]).filter(val => !isNaN(val));
            result[key] = values.length > 0 ? Math.min(...values) : 0;
        });

        return result;
    }

    calculateTrend(dataArray) {
        // Simple linear trend calculation
        const keys = Object.keys(dataArray[0]).filter(key => typeof dataArray[0][key] === 'number');
        const result = {};

        keys.forEach(key => {
            const values = dataArray.map((item, index) => ({ x: index, y: item[key] }))
                                   .filter(point => !isNaN(point.y));

            if (values.length < 2) {
                result[key] = 0;
                return;
            }

            const n = values.length;
            const sumX = values.reduce((sum, point) => sum + point.x, 0);
            const sumY = values.reduce((sum, point) => sum + point.y, 0);
            const sumXY = values.reduce((sum, point) => sum + point.x * point.y, 0);
            const sumXX = values.reduce((sum, point) => sum + point.x * point.x, 0);

            const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
            result[key] = slope;
        });

        return result;
    }

    // Export processed data to file
    async exportData(data, fileName, format = 'json') {
        const exportDir = path.join(__dirname, '../exports');

        // Ensure export directory exists
        if (!fs.existsSync(exportDir)) {
            fs.mkdirSync(exportDir, { recursive: true });
        }

        const filePath = path.join(exportDir, `${fileName}.${format}`);

        try {
            if (format === 'json') {
                fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
            } else if (format === 'csv') {
                const csv = this.jsonToCSV(data);
                fs.writeFileSync(filePath, csv);
            } else {
                throw new Error(`Unsupported export format: ${format}`);
            }

            return filePath;
        } catch (error) {
            console.error('Export error:', error);
            throw error;
        }
    }

    // Convert JSON to CSV format
    jsonToCSV(jsonData) {
        if (!Array.isArray(jsonData) || jsonData.length === 0) {
            return '';
        }

        const headers = Object.keys(jsonData[0]);
        const csvHeaders = headers.join(',');

        const csvRows = jsonData.map(row => {
            return headers.map(header => {
                const value = row[header];
                // Escape commas and quotes in CSV
                if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                    return `"${value.replace(/"/g, '""')}"`;
                }
                return value;
            }).join(',');
        });

        return [csvHeaders, ...csvRows].join('\n');
    }
}

module.exports = new DataProcessor();