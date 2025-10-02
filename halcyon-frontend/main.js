// Halcyon Urban Resilience Intelligence Platform
// Application State Management and Core Functionality

class HalcyonApp {
    constructor() {
        // Application state
        this.map = null;
        this.wardLayers = {};
        this.selectedWard = null;
        this.currentWeights = {
            heat_risk: 25,
            flood_risk: 20,
            groundwater_stress: 15,
            air_quality: 15,
            infrastructure_vulnerability: 10,
            social_vulnerability: 10,
            economic_resilience: 5
        };
        
        // Chart instances
        this.radarChart = null;
        this.barChart = null;

        // Ward data
        this.wardData = [
            {
                "id": 1,
                "name": "Dhanmondi Ward",
                "description": "Mixed residential area with moderate risk",
                "population": 185000,
                "area": 8.2,
                "demographics": {"income_level": "Middle", "education_rate": 75},
                "infrastructure": {"hospitals": 3, "schools": 12, "critical_facilities": 8},
                "base_urvi": 67,
                "risk_factors": {
                    "heat_risk": 65,
                    "flood_risk": 70,
                    "groundwater_stress": 45,
                    "air_quality": 60,
                    "infrastructure_vulnerability": 55,
                    "social_vulnerability": 40,
                    "economic_resilience": 75
                },
                "coordinates": [[23.745, 90.365], [23.745, 90.385], [23.765, 90.385], [23.765, 90.365], [23.745, 90.365]],
                "center": [23.755, 90.375]
            },
            {
                "id": 2,
                "name": "Old Dhaka",
                "description": "Historic dense area with extreme flood risk",
                "population": 420000,
                "area": 12.5,
                "demographics": {"income_level": "Low", "education_rate": 45},
                "infrastructure": {"hospitals": 2, "schools": 8, "critical_facilities": 4},
                "base_urvi": 83,
                "risk_factors": {
                    "heat_risk": 85,
                    "flood_risk": 95,
                    "groundwater_stress": 80,
                    "air_quality": 85,
                    "infrastructure_vulnerability": 90,
                    "social_vulnerability": 85,
                    "economic_resilience": 25
                },
                "coordinates": [[23.705, 90.385], [23.705, 90.415], [23.730, 90.415], [23.730, 90.385], [23.705, 90.385]],
                "center": [23.7175, 90.400]
            },
            {
                "id": 3,
                "name": "Gulshan District",
                "description": "Affluent area with lower overall risk",
                "population": 125000,
                "area": 15.8,
                "demographics": {"income_level": "High", "education_rate": 90},
                "infrastructure": {"hospitals": 8, "schools": 15, "critical_facilities": 20},
                "base_urvi": 44,
                "risk_factors": {
                    "heat_risk": 40,
                    "flood_risk": 35,
                    "groundwater_stress": 30,
                    "air_quality": 45,
                    "infrastructure_vulnerability": 25,
                    "social_vulnerability": 20,
                    "economic_resilience": 90
                },
                "coordinates": [[23.785, 90.405], [23.785, 90.435], [23.815, 90.435], [23.815, 90.405], [23.785, 90.405]],
                "center": [23.800, 90.420]
            },
            {
                "id": 4,
                "name": "Tejgaon Industrial",
                "description": "High pollution and infrastructure risk",
                "population": 220000,
                "area": 18.3,
                "demographics": {"income_level": "Low-Middle", "education_rate": 60},
                "infrastructure": {"hospitals": 2, "schools": 6, "critical_facilities": 12},
                "base_urvi": 76,
                "risk_factors": {
                    "heat_risk": 75,
                    "flood_risk": 60,
                    "groundwater_stress": 70,
                    "air_quality": 95,
                    "infrastructure_vulnerability": 85,
                    "social_vulnerability": 70,
                    "economic_resilience": 45
                },
                "coordinates": [[23.765, 90.385], [23.765, 90.415], [23.785, 90.415], [23.785, 90.385], [23.765, 90.385]],
                "center": [23.775, 90.400]
            },
            {
                "id": 5,
                "name": "Ramna Government",
                "description": "Government district with moderate risk",
                "population": 95000,
                "area": 6.7,
                "demographics": {"income_level": "Middle-High", "education_rate": 85},
                "infrastructure": {"hospitals": 4, "schools": 8, "critical_facilities": 25},
                "base_urvi": 57,
                "risk_factors": {
                    "heat_risk": 55,
                    "flood_risk": 50,
                    "groundwater_stress": 40,
                    "air_quality": 65,
                    "infrastructure_vulnerability": 35,
                    "social_vulnerability": 30,
                    "economic_resilience": 80
                },
                "coordinates": [[23.725, 90.365], [23.725, 90.385], [23.745, 90.385], [23.745, 90.365], [23.725, 90.365]],
                "center": [23.735, 90.375]
            },
            {
                "id": 6,
                "name": "Wari Historic",
                "description": "Historic area with high social vulnerability",
                "population": 380000,
                "area": 10.2,
                "demographics": {"income_level": "Low", "education_rate": 40},
                "infrastructure": {"hospitals": 1, "schools": 5, "critical_facilities": 3},
                "base_urvi": 78,
                "risk_factors": {
                    "heat_risk": 70,
                    "flood_risk": 75,
                    "groundwater_stress": 65,
                    "air_quality": 80,
                    "infrastructure_vulnerability": 85,
                    "social_vulnerability": 90,
                    "economic_resilience": 30
                },
                "coordinates": [[23.705, 90.415], [23.705, 90.445], [23.730, 90.445], [23.730, 90.415], [23.705, 90.415]],
                "center": [23.7175, 90.430]
            },
            {
                "id": 7,
                "name": "Pallabi Residential",
                "description": "Dense residential with high heat risk",
                "population": 450000,
                "area": 14.1,
                "demographics": {"income_level": "Low-Middle", "education_rate": 55},
                "infrastructure": {"hospitals": 2, "schools": 10, "critical_facilities": 6},
                "base_urvi": 79,
                "risk_factors": {
                    "heat_risk": 90,
                    "flood_risk": 70,
                    "groundwater_stress": 75,
                    "air_quality": 75,
                    "infrastructure_vulnerability": 80,
                    "social_vulnerability": 75,
                    "economic_resilience": 40
                },
                "coordinates": [[23.785, 90.345], [23.785, 90.375], [23.815, 90.375], [23.815, 90.345], [23.785, 90.345]],
                "center": [23.800, 90.360]
            },
            {
                "id": 8,
                "name": "Mohammadpur Mixed",
                "description": "Mixed development with balanced risk",
                "population": 290000,
                "area": 11.8,
                "demographics": {"income_level": "Middle", "education_rate": 70},
                "infrastructure": {"hospitals": 3, "schools": 11, "critical_facilities": 9},
                "base_urvi": 67,
                "risk_factors": {
                    "heat_risk": 65,
                    "flood_risk": 65,
                    "groundwater_stress": 60,
                    "air_quality": 70,
                    "infrastructure_vulnerability": 60,
                    "social_vulnerability": 50,
                    "economic_resilience": 65
                },
                "coordinates": [[23.745, 90.345], [23.745, 90.365], [23.765, 90.365], [23.765, 90.345], [23.745, 90.345]],
                "center": [23.755, 90.355]
            },
            {
                "id": 9,
                "name": "Sutrapur Riverside",
                "description": "Extreme flood risk at riverside location",
                "population": 310000,
                "area": 9.4,
                "demographics": {"income_level": "Low", "education_rate": 35},
                "infrastructure": {"hospitals": 1, "schools": 4, "critical_facilities": 2},
                "base_urvi": 82,
                "risk_factors": {
                    "heat_risk": 75,
                    "flood_risk": 100,
                    "groundwater_stress": 85,
                    "air_quality": 70,
                    "infrastructure_vulnerability": 95,
                    "social_vulnerability": 85,
                    "economic_resilience": 25
                },
                "coordinates": [[23.680, 90.415], [23.680, 90.445], [23.705, 90.445], [23.705, 90.415], [23.680, 90.415]],
                "center": [23.6925, 90.430]
            },
            {
                "id": 10,
                "name": "Sabujbagh Industrial",
                "description": "Industrial zone with high air quality risk",
                "population": 240000,
                "area": 16.9,
                "demographics": {"income_level": "Low", "education_rate": 50},
                "infrastructure": {"hospitals": 1, "schools": 7, "critical_facilities": 8},
                "base_urvi": 76,
                "risk_factors": {
                    "heat_risk": 70,
                    "flood_risk": 65,
                    "groundwater_stress": 75,
                    "air_quality": 100,
                    "infrastructure_vulnerability": 75,
                    "social_vulnerability": 80,
                    "economic_resilience": 35
                },
                "coordinates": [[23.785, 90.445], [23.785, 90.475], [23.815, 90.475], [23.815, 90.445], [23.785, 90.445]],
                "center": [23.800, 90.460]
            }
        ];

        this.interventionTypes = {
            "urban-greening": {
                "name": "Urban Greening",
                "description": "Parks, green roofs, urban forests",
                "impacts": {"heat_risk": -15, "air_quality": -10, "social_vulnerability": -5}
            },
            "flood-management": {
                "name": "Flood Management",
                "description": "Drainage, retention basins, permeable surfaces",
                "impacts": {"flood_risk": -20, "infrastructure_vulnerability": -10}
            },
            "cool-infrastructure": {
                "name": "Cool Infrastructure",
                "description": "Cool roofs, reflective surfaces, shade structures",
                "impacts": {"heat_risk": -18, "infrastructure_vulnerability": -8}
            },
            "renewable-energy": {
                "name": "Renewable Energy",
                "description": "Solar panels, energy efficiency, grid resilience",
                "impacts": {"economic_resilience": 15, "infrastructure_vulnerability": -12}
            }
        };

        this.init();
    }

    init() {
        console.log('Initializing Halcyon App...');
        this.initializeMap();
        this.setupEventListeners();
        
        // Hide loading after map is ready
        setTimeout(() => {
            document.getElementById('mapLoading').classList.add('hidden');
            this.updateMapColors();
        }, 2000);
    }

    initializeMap() {
        console.log('Initializing map...');
        
        // Initialize Leaflet map centered on Dhaka
        this.map = L.map('map').setView([23.8103, 90.4125], 11);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors | NASA Earth Science Data',
            maxZoom: 18
        }).addTo(this.map);

        // Add ward polygons
        this.wardData.forEach(ward => {
            console.log('Adding ward:', ward.name);
            
            const layer = L.polygon(ward.coordinates, {
                fillOpacity: 0.7,
                weight: 2,
                color: '#333',
                fillColor: this.getURVIColor(this.calculateURVI(ward))
            }).addTo(this.map);

            // Add click event for ward selection
            layer.on('click', (e) => {
                console.log('Ward clicked:', ward.name);
                this.selectWard(ward);
                L.DomEvent.stopPropagation(e);
            });
            
            // Add hover tooltip
            layer.bindTooltip(`
                <div class="popup-content">
                    <h4>${ward.name}</h4>
                    <div class="popup-urvi">URVI: ${this.calculateURVI(ward)}</div>
                    <div class="popup-risk-level ${this.getRiskLevelClass(this.calculateURVI(ward))}">${this.getRiskLevel(this.calculateURVI(ward))}</div>
                </div>
            `, { 
                permanent: false, 
                sticky: true,
                direction: 'top',
                offset: [0, -10]
            });

            this.wardLayers[ward.id] = layer;
        });

        console.log('Map initialized with', Object.keys(this.wardLayers).length, 'wards');
    }

    setupEventListeners() {
        // Weight sliders
        const sliders = document.querySelectorAll('.weight-slider');
        sliders.forEach(slider => {
            slider.addEventListener('input', (e) => this.updateWeight(e.target));
        });

        // Reset weights button
        document.getElementById('resetWeights').addEventListener('click', () => this.resetWeights());

        // Intervention simulation
        document.getElementById('simulateBtn').addEventListener('click', () => this.simulateIntervention());

        // Export button
        document.getElementById('exportBtn').addEventListener('click', () => this.exportActionBrief());
    }

    calculateURVI(ward) {
        let urvi = 0;
        const factors = ward.risk_factors;
        
        // Calculate weighted URVI score
        urvi += (factors.heat_risk * this.currentWeights.heat_risk) / 100;
        urvi += (factors.flood_risk * this.currentWeights.flood_risk) / 100;
        urvi += (factors.groundwater_stress * this.currentWeights.groundwater_stress) / 100;
        urvi += (factors.air_quality * this.currentWeights.air_quality) / 100;
        urvi += (factors.infrastructure_vulnerability * this.currentWeights.infrastructure_vulnerability) / 100;
        urvi += (factors.social_vulnerability * this.currentWeights.social_vulnerability) / 100;
        
        // Economic resilience is inverted (higher economic resilience = lower risk)
        urvi += ((100 - factors.economic_resilience) * this.currentWeights.economic_resilience) / 100;
        
        return Math.round(urvi);
    }

    getURVIColor(urvi) {
        if (urvi < 20) return '#0d47a1'; // Deep Blue - Low Risk
        if (urvi < 40) return '#1976d2'; // Light Blue - Low-Medium Risk
        if (urvi < 60) return '#fbc02d'; // Yellow - Medium Risk
        if (urvi < 80) return '#f57c00'; // Orange - High Risk
        return '#d32f2f'; // Red - Extreme Risk
    }

    getRiskLevel(urvi) {
        if (urvi < 20) return 'Low Risk';
        if (urvi < 40) return 'Low-Medium Risk';
        if (urvi < 60) return 'Medium Risk';
        if (urvi < 80) return 'High Risk';
        return 'Extreme Risk';
    }

    getRiskLevelClass(urvi) {
        if (urvi < 20) return 'risk-low';
        if (urvi < 40) return 'risk-low-medium';
        if (urvi < 60) return 'risk-medium';
        if (urvi < 80) return 'risk-high';
        return 'risk-extreme';
    }

    updateWeight(slider) {
        const factor = slider.dataset.factor;
        const value = parseInt(slider.value);
        
        this.currentWeights[factor] = value;
        
        // Update display
        const valueDisplay = document.getElementById(slider.id.replace('-slider', '-value'));
        if (valueDisplay) {
            valueDisplay.textContent = `${value}%`;
        }
        
        // Normalize weights to sum to 100
        this.normalizeWeights();
        
        // Update map colors in real-time
        this.updateMapColors();
        
        // Update selected ward display if any
        if (this.selectedWard) {
            this.updateWardDisplay();
        }
    }

    normalizeWeights() {
        const total = Object.values(this.currentWeights).reduce((sum, val) => sum + val, 0);
        
        if (total !== 100) {
            const factor = 100 / total;
            Object.keys(this.currentWeights).forEach(key => {
                this.currentWeights[key] = Math.round(this.currentWeights[key] * factor);
            });
            
            // Update all sliders and displays
            Object.keys(this.currentWeights).forEach(key => {
                const slider = document.querySelector(`[data-factor="${key}"]`);
                if (slider) {
                    const valueDisplay = document.getElementById(slider.id.replace('-slider', '-value'));
                    slider.value = this.currentWeights[key];
                    if (valueDisplay) {
                        valueDisplay.textContent = `${this.currentWeights[key]}%`;
                    }
                }
            });
        }
        
        // Update total display
        const totalElement = document.getElementById('total-weight');
        if (totalElement) {
            totalElement.textContent = '100%';
        }
    }

    updateMapColors() {
        console.log('Updating map colors...');
        this.wardData.forEach(ward => {
            const urvi = this.calculateURVI(ward);
            const color = this.getURVIColor(urvi);
            const layer = this.wardLayers[ward.id];
            
            if (layer) {
                layer.setStyle({
                    fillColor: color,
                    fillOpacity: 0.7,
                    weight: ward.id === this.selectedWard?.id ? 3 : 2,
                    color: ward.id === this.selectedWard?.id ? '#000' : '#333'
                });
                
                // Update tooltip content with new URVI
                layer.setTooltipContent(`
                    <div class="popup-content">
                        <h4>${ward.name}</h4>
                        <div class="popup-urvi">URVI: ${urvi}</div>
                        <div class="popup-risk-level ${this.getRiskLevelClass(urvi)}">${this.getRiskLevel(urvi)}</div>
                    </div>
                `);
            }
        });
    }

    selectWard(ward) {
        console.log('Selecting ward:', ward.name);
        this.selectedWard = ward;
        this.updateMapColors(); // Refresh highlighting
        this.showWardAnalysis(ward);
    }

    showWardAnalysis(ward) {
        const urvi = this.calculateURVI(ward);
        
        // Hide default message, show ward overview
        document.getElementById('default-message').classList.add('hidden');
        document.getElementById('ward-overview').classList.remove('hidden');
        
        // Update ward information
        document.getElementById('ward-name').textContent = ward.name;
        document.getElementById('ward-description').textContent = ward.description;
        document.getElementById('ward-population').textContent = ward.population.toLocaleString();
        document.getElementById('ward-area').textContent = ward.area;
        document.getElementById('ward-urvi').textContent = urvi;
        document.getElementById('ward-risk-level').textContent = this.getRiskLevel(urvi);
        
        // Update infrastructure stats
        document.getElementById('ward-hospitals').textContent = ward.infrastructure.hospitals;
        document.getElementById('ward-schools').textContent = ward.infrastructure.schools;
        document.getElementById('ward-facilities').textContent = ward.infrastructure.critical_facilities;
        
        // Create risk analysis charts
        this.createRiskCharts(ward);
    }

    createRiskCharts(ward) {
        const factors = ward.risk_factors;
        
        // Destroy existing charts
        if (this.radarChart) {
            this.radarChart.destroy();
            this.radarChart = null;
        }
        if (this.barChart) {
            this.barChart.destroy();
            this.barChart = null;
        }
        
        // Create Radar Chart
        const radarCtx = document.getElementById('riskRadarChart');
        if (radarCtx) {
            this.radarChart = new Chart(radarCtx.getContext('2d'), {
                type: 'radar',
                data: {
                    labels: [
                        'Heat Risk', 'Flood Risk', 'Groundwater', 'Air Quality',
                        'Infrastructure', 'Social', 'Economic'
                    ],
                    datasets: [{
                        label: 'Risk Factors',
                        data: [
                            factors.heat_risk,
                            factors.flood_risk,
                            factors.groundwater_stress,
                            factors.air_quality,
                            factors.infrastructure_vulnerability,
                            factors.social_vulnerability,
                            100 - factors.economic_resilience // Invert for display
                        ],
                        backgroundColor: 'rgba(25, 118, 210, 0.2)',
                        borderColor: '#1976d2',
                        borderWidth: 2,
                        pointBackgroundColor: '#1976d2',
                        pointBorderWidth: 0,
                        pointRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        r: {
                            beginAtZero: true,
                            max: 100,
                            ticks: {
                                stepSize: 20,
                                display: false
                            },
                            grid: {
                                color: 'rgba(0,0,0,0.1)'
                            },
                            angleLines: {
                                color: 'rgba(0,0,0,0.1)'
                            },
                            pointLabels: {
                                font: {
                                    size: 11
                                }
                            }
                        }
                    }
                }
            });
        }
        
        // Create Bar Chart
        const barCtx = document.getElementById('riskBarChart');
        if (barCtx) {
            this.barChart = new Chart(barCtx.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: ['Heat', 'Flood', 'Water', 'Air', 'Infrastructure', 'Social', 'Economic'],
                    datasets: [{
                        label: 'Risk Level',
                        data: [
                            factors.heat_risk,
                            factors.flood_risk,
                            factors.groundwater_stress,
                            factors.air_quality,
                            factors.infrastructure_vulnerability,
                            factors.social_vulnerability,
                            100 - factors.economic_resilience
                        ],
                        backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C'],
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            grid: {
                                color: 'rgba(0,0,0,0.1)'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        }
    }

    simulateIntervention() {
        const interventionType = document.getElementById('interventionSelect').value;
        if (!interventionType || !this.selectedWard) {
            alert('Please select a ward and intervention type');
            return;
        }
        
        const intervention = this.interventionTypes[interventionType];
        if (!intervention) {
            console.error('Intervention not found:', interventionType);
            return;
        }
        
        // Calculate impacts
        const impacts = [];
        Object.keys(intervention.impacts).forEach(factor => {
            const change = intervention.impacts[factor];
            const factorName = this.formatFactorName(factor);
            impacts.push({
                factor: factorName,
                change: change,
                type: change > 0 ? 'positive' : 'negative'
            });
        });
        
        // Display results
        const resultsDiv = document.getElementById('simulation-results');
        const impactDisplay = document.getElementById('impact-display');
        
        if (resultsDiv && impactDisplay) {
            impactDisplay.innerHTML = impacts.map(impact => `
                <div class="impact-item">
                    <span>${impact.factor}:</span>
                    <span class="impact-${impact.type}">
                        ${impact.change > 0 ? '+' : ''}${impact.change}%
                    </span>
                </div>
            `).join('');
            
            resultsDiv.classList.remove('hidden');
        }
    }

    formatFactorName(factor) {
        return factor.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    resetWeights() {
        const defaultWeights = {
            heat_risk: 25,
            flood_risk: 20,
            groundwater_stress: 15,
            air_quality: 15,
            infrastructure_vulnerability: 10,
            social_vulnerability: 10,
            economic_resilience: 5
        };
        
        this.currentWeights = { ...defaultWeights };
        
        // Update sliders and displays
        Object.keys(defaultWeights).forEach(key => {
            const slider = document.querySelector(`[data-factor="${key}"]`);
            if (slider) {
                const valueDisplay = document.getElementById(slider.id.replace('-slider', '-value'));
                slider.value = defaultWeights[key];
                if (valueDisplay) {
                    valueDisplay.textContent = `${defaultWeights[key]}%`;
                }
            }
        });
        
        this.updateMapColors();
        
        if (this.selectedWard) {
            this.updateWardDisplay();
        }
    }

    updateWardDisplay() {
        if (!this.selectedWard) return;
        
        const urvi = this.calculateURVI(this.selectedWard);
        const urviElement = document.getElementById('ward-urvi');
        const riskLevelElement = document.getElementById('ward-risk-level');
        
        if (urviElement) urviElement.textContent = urvi;
        if (riskLevelElement) riskLevelElement.textContent = this.getRiskLevel(urvi);
        
        // Update charts with new weights
        this.createRiskCharts(this.selectedWard);
    }

    exportActionBrief() {
        if (!this.selectedWard) {
            alert('Please select a ward first');
            return;
        }
        
        const urvi = this.calculateURVI(this.selectedWard);
        const ward = this.selectedWard;
        
        const briefContent = `HALCYON URBAN RESILIENCE ACTION BRIEF
=========================================

Ward: ${ward.name}
URVI Score: ${urvi} (${this.getRiskLevel(urvi)})
Population: ${ward.population.toLocaleString()}
Area: ${ward.area} km²

RISK ASSESSMENT:
- Heat Risk: ${ward.risk_factors.heat_risk}%
- Flood Risk: ${ward.risk_factors.flood_risk}%
- Groundwater Stress: ${ward.risk_factors.groundwater_stress}%
- Air Quality Risk: ${ward.risk_factors.air_quality}%
- Infrastructure Vulnerability: ${ward.risk_factors.infrastructure_vulnerability}%
- Social Vulnerability: ${ward.risk_factors.social_vulnerability}%
- Economic Resilience: ${ward.risk_factors.economic_resilience}%

INFRASTRUCTURE:
- Hospitals: ${ward.infrastructure.hospitals}
- Schools: ${ward.infrastructure.schools}
- Critical Facilities: ${ward.infrastructure.critical_facilities}

CURRENT WEIGHT CONFIGURATION:
- Urban Heat Island Risk: ${this.currentWeights.heat_risk}%
- Flood Risk: ${this.currentWeights.flood_risk}%
- Groundwater Stress: ${this.currentWeights.groundwater_stress}%
- Air Quality Risk: ${this.currentWeights.air_quality}%
- Infrastructure Vulnerability: ${this.currentWeights.infrastructure_vulnerability}%
- Social Vulnerability: ${this.currentWeights.social_vulnerability}%
- Economic Resilience: ${this.currentWeights.economic_resilience}%

Generated by Halcyon Urban Resilience Intelligence Platform
NASA Space Apps Challenge 2024
Data Sources: NASA Earth Science Data, OpenStreetMap, Dhaka City Corporation
        `;
        
        // Create and download file
        const blob = new Blob([briefContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `halcyon-action-brief-${ward.name.toLowerCase().replace(/\s+/g, '-')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing Halcyon App...');
    window.halcyonApp = new HalcyonApp();
});