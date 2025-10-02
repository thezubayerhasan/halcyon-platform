const axios = require('axios');
const dataProcessor = require('../utils/dataProcessor');

class URVICalculator {
    constructor() {
        this.defaultWeights = {
            heat_risk: 25,
            flood_risk: 20,
            groundwater_stress: 15,
            air_quality: 15,
            infrastructure_vulnerability: 10,
            social_vulnerability: 10,
            economic_resilience: 5
        };

        // Dhaka ward data with comprehensive risk factors
        this.dhakaWards = [
            {
                id: 1,
                name: "Dhanmondi Ward",
                description: "Mixed residential area with moderate risk",
                population: 185000,
                area: 8.2,
                demographics: { income_level: "Middle", education_rate: 75 },
                infrastructure: { hospitals: 3, schools: 12, critical_facilities: 8 },
                base_urvi: 67,
                risk_factors: {
                    heat_risk: 65,
                    flood_risk: 70,
                    groundwater_stress: 45,
                    air_quality: 60,
                    infrastructure_vulnerability: 55,
                    social_vulnerability: 40,
                    economic_resilience: 75
                },
                coordinates: [23.755, 90.375]
            },
            {
                id: 2,
                name: "Old Dhaka",
                description: "Historic dense area with extreme flood risk",
                population: 420000,
                area: 12.5,
                demographics: { income_level: "Low", education_rate: 45 },
                infrastructure: { hospitals: 2, schools: 8, critical_facilities: 4 },
                base_urvi: 83,
                risk_factors: {
                    heat_risk: 85,
                    flood_risk: 95,
                    groundwater_stress: 80,
                    air_quality: 85,
                    infrastructure_vulnerability: 90,
                    social_vulnerability: 85,
                    economic_resilience: 25
                },
                coordinates: [23.7175, 90.400]
            },
            {
                id: 3,
                name: "Gulshan District",
                description: "Affluent area with lower overall risk",
                population: 125000,
                area: 15.8,
                demographics: { income_level: "High", education_rate: 90 },
                infrastructure: { hospitals: 8, schools: 15, critical_facilities: 20 },
                base_urvi: 44,
                risk_factors: {
                    heat_risk: 40,
                    flood_risk: 35,
                    groundwater_stress: 30,
                    air_quality: 45,
                    infrastructure_vulnerability: 25,
                    social_vulnerability: 20,
                    economic_resilience: 90
                },
                coordinates: [23.800, 90.420]
            },
            {
                id: 4,
                name: "Tejgaon Industrial",
                description: "High pollution and infrastructure risk",
                population: 220000,
                area: 18.3,
                demographics: { income_level: "Low-Middle", education_rate: 60 },
                infrastructure: { hospitals: 2, schools: 6, critical_facilities: 12 },
                base_urvi: 76,
                risk_factors: {
                    heat_risk: 75,
                    flood_risk: 60,
                    groundwater_stress: 70,
                    air_quality: 95,
                    infrastructure_vulnerability: 85,
                    social_vulnerability: 70,
                    economic_resilience: 45
                },
                coordinates: [23.775, 90.400]
            },
            {
                id: 5,
                name: "Ramna Government",
                description: "Government district with moderate risk",
                population: 95000,
                area: 6.7,
                demographics: { income_level: "Middle-High", education_rate: 85 },
                infrastructure: { hospitals: 4, schools: 8, critical_facilities: 25 },
                base_urvi: 57,
                risk_factors: {
                    heat_risk: 55,
                    flood_risk: 50,
                    groundwater_stress: 40,
                    air_quality: 65,
                    infrastructure_vulnerability: 35,
                    social_vulnerability: 30,
                    economic_resilience: 80
                },
                coordinates: [23.735, 90.375]
            },
            {
                id: 6,
                name: "Wari Historic",
                description: "Historic area with high social vulnerability",
                population: 380000,
                area: 10.2,
                demographics: { income_level: "Low", education_rate: 40 },
                infrastructure: { hospitals: 1, schools: 5, critical_facilities: 3 },
                base_urvi: 78,
                risk_factors: {
                    heat_risk: 70,
                    flood_risk: 75,
                    groundwater_stress: 65,
                    air_quality: 80,
                    infrastructure_vulnerability: 85,
                    social_vulnerability: 90,
                    economic_resilience: 30
                },
                coordinates: [23.7175, 90.430]
            },
            {
                id: 7,
                name: "Pallabi Residential",
                description: "Dense residential with high heat risk",
                population: 450000,
                area: 14.1,
                demographics: { income_level: "Low-Middle", education_rate: 55 },
                infrastructure: { hospitals: 2, schools: 10, critical_facilities: 6 },
                base_urvi: 79,
                risk_factors: {
                    heat_risk: 90,
                    flood_risk: 70,
                    groundwater_stress: 75,
                    air_quality: 75,
                    infrastructure_vulnerability: 80,
                    social_vulnerability: 75,
                    economic_resilience: 40
                },
                coordinates: [23.800, 90.360]
            },
            {
                id: 8,
                name: "Mohammadpur Mixed",
                description: "Mixed development with balanced risk",
                population: 290000,
                area: 11.8,
                demographics: { income_level: "Middle", education_rate: 70 },
                infrastructure: { hospitals: 3, schools: 11, critical_facilities: 9 },
                base_urvi: 67,
                risk_factors: {
                    heat_risk: 65,
                    flood_risk: 65,
                    groundwater_stress: 60,
                    air_quality: 70,
                    infrastructure_vulnerability: 60,
                    social_vulnerability: 50,
                    economic_resilience: 65
                },
                coordinates: [23.755, 90.355]
            },
            {
                id: 9,
                name: "Sutrapur Riverside",
                description: "Extreme flood risk at riverside location",
                population: 310000,
                area: 9.4,
                demographics: { income_level: "Low", education_rate: 35 },
                infrastructure: { hospitals: 1, schools: 4, critical_facilities: 2 },
                base_urvi: 82,
                risk_factors: {
                    heat_risk: 75,
                    flood_risk: 100,
                    groundwater_stress: 85,
                    air_quality: 70,
                    infrastructure_vulnerability: 95,
                    social_vulnerability: 85,
                    economic_resilience: 25
                },
                coordinates: [23.6925, 90.430]
            },
            {
                id: 10,
                name: "Sabujbagh Industrial",
                description: "Industrial zone with high air quality risk",
                population: 240000,
                area: 16.9,
                demographics: { income_level: "Low", education_rate: 50 },
                infrastructure: { hospitals: 1, schools: 7, critical_facilities: 8 },
                base_urvi: 76,
                risk_factors: {
                    heat_risk: 70,
                    flood_risk: 65,
                    groundwater_stress: 75,
                    air_quality: 100,
                    infrastructure_vulnerability: 75,
                    social_vulnerability: 80,
                    economic_resilience: 35
                },
                coordinates: [23.800, 90.460]
            }
        ];

        this.interventionTypes = [
            {
                name: "Urban Greening",
                description: "Parks, green roofs, urban forests",
                impacts: { heat_risk: -15, air_quality: -10, social_vulnerability: -5 }
            },
            {
                name: "Flood Management", 
                description: "Drainage, retention basins, permeable surfaces",
                impacts: { flood_risk: -20, infrastructure_vulnerability: -10 }
            },
            {
                name: "Cool Infrastructure",
                description: "Cool roofs, reflective surfaces, shade structures",
                impacts: { heat_risk: -18, infrastructure_vulnerability: -8 }
            },
            {
                name: "Renewable Energy",
                description: "Solar panels, energy efficiency, grid resilience", 
                impacts: { economic_resilience: 15, infrastructure_vulnerability: -12 }
            }
        ];
    }

    // Calculate URVI for all Dhaka wards with custom weights
    async calculateDhakaURVI(customWeights = null) {
        const weights = customWeights || this.defaultWeights;

        return this.dhakaWards.map(ward => {
            const urvi = this.calculateWardURVI(ward.risk_factors, weights);
            return {
                ...ward,
                current_urvi: Math.round(urvi * 100) / 100,
                risk_level: this.getRiskLevel(urvi),
                color: this.getURVIColor(urvi)
            };
        });
    }

    // Calculate URVI for a single ward using weighted geometric mean
    calculateWardURVI(riskFactors, weights) {
        // Normalize weights to percentages
        const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
        const normalizedWeights = {};

        Object.keys(weights).forEach(key => {
            normalizedWeights[key] = weights[key] / totalWeight;
        });

        // Handle economic_resilience (higher is better, so invert)
        const adjustedFactors = { ...riskFactors };
        adjustedFactors.economic_resilience = 100 - adjustedFactors.economic_resilience;

        // Calculate weighted geometric mean
        let product = 1;
        let totalWeightUsed = 0;

        Object.keys(adjustedFactors).forEach(factor => {
            if (normalizedWeights[factor]) {
                const value = Math.max(adjustedFactors[factor], 1); // Avoid zero
                const weight = normalizedWeights[factor];
                product *= Math.pow(value, weight);
                totalWeightUsed += weight;
            }
        });

        // Normalize to 0-100 scale
        return Math.pow(product, 1) * (totalWeightUsed > 0 ? 1 : 0);
    }

    // Generate comprehensive ward analysis report
    async generateWardReport(wardId, customWeights = null) {
        const ward = this.dhakaWards.find(w => w.id === parseInt(wardId));
        if (!ward) {
            throw new Error(`Ward with ID ${wardId} not found`);
        }

        const weights = customWeights || this.defaultWeights;
        const currentURVI = this.calculateWardURVI(ward.risk_factors, weights);

        // Calculate intervention scenarios
        const interventionScenarios = this.interventionTypes.map(intervention => {
            const adjustedFactors = { ...ward.risk_factors };

            // Apply intervention impacts
            Object.keys(intervention.impacts).forEach(factor => {
                if (adjustedFactors[factor] !== undefined) {
                    adjustedFactors[factor] = Math.max(0, Math.min(100, 
                        adjustedFactors[factor] + intervention.impacts[factor]
                    ));
                }
            });

            const newURVI = this.calculateWardURVI(adjustedFactors, weights);
            const improvement = currentURVI - newURVI;

            return {
                ...intervention,
                new_urvi: Math.round(newURVI * 100) / 100,
                improvement: Math.round(improvement * 100) / 100,
                improvement_percentage: Math.round((improvement / currentURVI) * 100 * 100) / 100
            };
        });

        return {
            ward: {
                ...ward,
                current_urvi: Math.round(currentURVI * 100) / 100,
                risk_level: this.getRiskLevel(currentURVI),
                color: this.getURVIColor(currentURVI)
            },
            intervention_scenarios: interventionScenarios,
            analysis: {
                highest_risk_factors: this.getHighestRiskFactors(ward.risk_factors),
                priority_interventions: interventionScenarios
                    .sort((a, b) => b.improvement - a.improvement)
                    .slice(0, 2),
                population_affected: ward.population,
                density: Math.round(ward.population / ward.area)
            },
            timestamp: new Date().toISOString()
        };
    }

    // Get risk level category based on URVI score
    getRiskLevel(urvi) {
        if (urvi <= 20) return 'Low';
        if (urvi <= 40) return 'Low-Medium';
        if (urvi <= 60) return 'Medium';
        if (urvi <= 80) return 'High';
        return 'Extreme';
    }

    // Get color code for URVI visualization
    getURVIColor(urvi) {
        if (urvi <= 20) return '#0d47a1'; // Deep Blue
        if (urvi <= 40) return '#1976d2'; // Light Blue
        if (urvi <= 60) return '#fbc02d'; // Yellow
        if (urvi <= 80) return '#f57c00'; // Orange
        return '#d32f2f'; // Red
    }

    // Identify highest risk factors for a ward
    getHighestRiskFactors(riskFactors) {
        const factors = Object.entries(riskFactors)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => {
                // Economic resilience is inverse (higher is better)
                const aVal = a.name === 'economic_resilience' ? 100 - a.value : a.value;
                const bVal = b.name === 'economic_resilience' ? 100 - b.value : b.value;
                return bVal - aVal;
            })
            .slice(0, 3);

        return factors;
    }

    // Validate weight configuration
    validateWeights(weights) {
        const requiredFactors = Object.keys(this.defaultWeights);
        const providedFactors = Object.keys(weights);

        // Check if all required factors are provided
        const missingFactors = requiredFactors.filter(factor => !providedFactors.includes(factor));
        if (missingFactors.length > 0) {
            throw new Error(`Missing weight factors: ${missingFactors.join(', ')}`);
        }

        // Check if weights sum to 100
        const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
        if (Math.abs(totalWeight - 100) > 0.01) {
            throw new Error(`Weights must sum to 100, got ${totalWeight}`);
        }

        return true;
    }

    // Get ward by ID
    getWardById(wardId) {
        return this.dhakaWards.find(ward => ward.id === parseInt(wardId));
    }

    // Get all wards
    getAllWards() {
        return this.dhakaWards;
    }
}

module.exports = new URVICalculator();