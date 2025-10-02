const express = require('express');
const router = express.Router();
const nasaDataService = require('../services/nasaDataService');
const urviCalculator = require('../services/urviCalculator');
const dataProcessor = require('../utils/dataProcessor');

// Get current URVI data for Dhaka wards
router.get('/urvi/dhaka', async (req, res) => {
    try {
        const weights = req.query.weights ? JSON.parse(req.query.weights) : null;
        const urviData = await urviCalculator.calculateDhakaURVI(weights);

        res.json({
            success: true,
            data: urviData,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('URVI calculation error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to calculate URVI data',
            message: error.message
        });
    }
});

// Get NASA satellite data for specific location and time range
router.get('/nasa-data/:dataType', async (req, res) => {
    try {
        const { dataType } = req.params;
        const { lat, lon, startDate, endDate } = req.query;

        if (!lat || !lon) {
            return res.status(400).json({
                success: false,
                error: 'Latitude and longitude are required'
            });
        }

        const data = await nasaDataService.fetchData(dataType, {
            latitude: parseFloat(lat),
            longitude: parseFloat(lon),
            startDate: startDate || getDefaultStartDate(),
            endDate: endDate || new Date().toISOString().split('T')[0]
        });

        res.json({
            success: true,
            data: data,
            source: `NASA ${dataType.toUpperCase()}`,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error(`NASA ${req.params.dataType} fetch error:`, error);
        res.status(500).json({
            success: false,
            error: `Failed to fetch ${req.params.dataType} data`,
            message: error.message
        });
    }
});

// Get precipitation data from GPM IMERG
router.get('/precipitation/dhaka', async (req, res) => {
    try {
        const { days = 30 } = req.query;
        const precipitationData = await nasaDataService.getIMERGData({
            bounds: [90.25, 23.65, 90.50, 23.90], // Dhaka bounds
            days: parseInt(days)
        });

        res.json({
            success: true,
            data: precipitationData,
            source: 'NASA GPM IMERG',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Precipitation data error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch precipitation data',
            message: error.message
        });
    }
});

// Get land surface temperature from Landsat
router.get('/temperature/dhaka', async (req, res) => {
    try {
        const { months = 6 } = req.query;
        const temperatureData = await nasaDataService.getLandsatLST({
            bounds: [90.25, 23.65, 90.50, 23.90],
            months: parseInt(months)
        });

        res.json({
            success: true,
            data: temperatureData,
            source: 'NASA Landsat 8/9',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Temperature data error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch temperature data',
            message: error.message
        });
    }
});

// Get air quality data from Sentinel-5P
router.get('/air-quality/dhaka', async (req, res) => {
    try {
        const { days = 30 } = req.query;
        const airQualityData = await nasaDataService.getSentinel5P_NO2({
            bounds: [90.25, 23.65, 90.50, 23.90],
            days: parseInt(days)
        });

        res.json({
            success: true,
            data: airQualityData,
            source: 'Sentinel-5P TROPOMI',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Air quality data error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch air quality data',
            message: error.message
        });
    }
});

// Get nighttime lights data from VIIRS
router.get('/nighttime-lights/dhaka', async (req, res) => {
    try {
        const { months = 12 } = req.query;
        const nightlightsData = await nasaDataService.getVIIRSNightlights({
            bounds: [90.25, 23.65, 90.50, 23.90],
            months: parseInt(months)
        });

        res.json({
            success: true,
            data: nightlightsData,
            source: 'VIIRS DNB',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Nighttime lights data error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch nighttime lights data',
            message: error.message
        });
    }
});

// Export ward analysis report
router.get('/export/ward/:wardId', async (req, res) => {
    try {
        const { wardId } = req.params;
        const weights = req.query.weights ? JSON.parse(req.query.weights) : null;

        const reportData = await urviCalculator.generateWardReport(wardId, weights);

        res.json({
            success: true,
            data: reportData,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Ward report generation error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate ward report',
            message: error.message
        });
    }
});

function getDefaultStartDate() {
    const date = new Date();
    date.setMonth(date.getMonth() - 6);
    return date.toISOString().split('T')[0];
}

module.exports = router;