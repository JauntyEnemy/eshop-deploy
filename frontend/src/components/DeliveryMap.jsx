import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const SHOP_LOCATION = [25.349610, 55.379580]; // Zahrat Alrabie Shop Location

// Component to handle map clicks
function LocationMarker({ onLocationSelect }) {
    const [position, setPosition] = useState(null);
    const map = useMapEvents({
        click(e) {
            setPosition(e.latlng);
            onLocationSelect(e.latlng);
            map.flyTo(e.latlng, map.getZoom());
        },
    });

    return position === null ? null : (
        <Marker position={position}>
            <Popup>Your Delivery Location</Popup>
        </Marker>
    );
}

// Component to adjust map view bounds
function MapView({ userLocation }) {
    const map = useMap();

    useEffect(() => {
        if (userLocation) {
            const bounds = L.latLngBounds([SHOP_LOCATION, [userLocation.lat, userLocation.lng]]);
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [userLocation, map]);

    return null;
}

// Bounds for Dubai, Sharjah, Ajman
// SW: Jebel Ali/Dubai South | NE: Ajman/UAQ Border
const UAE_BOUNDS = [
    [24.700000, 54.800000],
    [25.550000, 55.800000]
];

const VALID_EMIRATES = ['Dubai', 'Sharjah', 'Ajman'];

const DeliveryMap = ({ onDistanceChange, addressQuery }) => {
    const [userLoc, setUserLoc] = useState(null);
    const [distance, setDistance] = useState(0);
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    // Geocode Address when query changes
    useEffect(() => {
        if (!addressQuery) return;

        const geocodeAddress = async () => {
            setLoadingLocation(true);
            setErrorMsg('');
            try {
                // Use Nominatim API for open-source geocoding
                // Append 'United Arab Emirates' for better accuracy
                const query = `${addressQuery}, United Arab Emirates`;
                const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`);
                const data = await response.json();

                if (data && data.length > 0) {
                    const { lat, lon, display_name } = data[0];

                    // Verify Emirate
                    const isSupported = VALID_EMIRATES.some(e => display_name.includes(e));
                    if (!isSupported) {
                        setErrorMsg(`Delivery is only available in ${VALID_EMIRATES.join(', ')}`);
                        return;
                    }

                    const latLng = { lat: parseFloat(lat), lng: parseFloat(lon) };

                    setUserLoc(latLng);
                    const dist = calculateDistance(SHOP_LOCATION[0], SHOP_LOCATION[1], latLng.lat, latLng.lng);
                    setDistance(dist);
                    onDistanceChange(dist);
                } else {
                    setErrorMsg("Location not found. Please try a more specific address.");
                }
            } catch (error) {
                console.error("Geocoding failed:", error);
                setErrorMsg("Failed to find location. Please check your internet connection or try again.");
            } finally {
                setLoadingLocation(false);
            }
        };

        // Debounce slightly to avoid rapid calls
        const timeoutId = setTimeout(() => {
            geocodeAddress();
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [addressQuery]); // Dependency on addressQuery logic

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of the earth in km
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Number((R * c).toFixed(2));
    };

    const handleLocationSelect = async (latlng) => {
        // Reverse geocode to check if click is in valid emirate
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`);
            const data = await response.json();

            if (data && data.display_name) {
                const isSupported = VALID_EMIRATES.some(e => data.display_name.includes(e));
                if (!isSupported) {
                    alert(`Sorry, we currently only deliver to ${VALID_EMIRATES.join(', ')}.`);
                    return;
                }
            }
        } catch (e) {
            // If check fails, allow but warn (or block, depending on strictness. allowing for now)
            console.error("Reverse geocoding failed:", e);
        }

        setUserLoc(latlng);
        setErrorMsg('');
        const dist = calculateDistance(SHOP_LOCATION[0], SHOP_LOCATION[1], latlng.lat, latlng.lng);
        setDistance(dist);
        onDistanceChange(dist);
    };

    // Calculate initial fee or distance logic here if needed

    return (
        <div className="space-y-4">
            <div className="h-[400px] w-full rounded-xl overflow-hidden border border-gray-300 relative z-0">
                <MapContainer
                    center={SHOP_LOCATION}
                    zoom={10}
                    minZoom={9}
                    maxBounds={UAE_BOUNDS}
                    maxBoundsViscosity={1.0}
                    scrollWheelZoom={true}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        attribution='&copy; CARTO'
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    />

                    {/* Shop Marker */}
                    <Marker position={SHOP_LOCATION}>
                        <Popup>
                            <strong>Zahrat Alrabie</strong>
                        </Popup>
                    </Marker>

                    {/* User Marker */}
                    <LocationMarker onLocationSelect={handleLocationSelect} />

                    {/* Path line */}
                    {userLoc && (
                        <>
                            <Polyline positions={[SHOP_LOCATION, [userLoc.lat, userLoc.lng]]} color="blue" dashArray="10, 10" />
                            <MapView userLocation={userLoc} />
                        </>
                    )}
                </MapContainer>

                {errorMsg && (
                    <div className="absolute top-4 left-4 right-4 z-[999] bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                        <span className="block sm:inline">{errorMsg}</span>
                    </div>
                )}
            </div>

            {userLoc && (
                <div className="bg-blue-50 p-4 rounded-lg flex justify-between items-center border border-blue-200">
                    <div>
                        <p className="text-sm text-gray-600">Estimate distance from Shop</p>
                        <p className="text-xl font-bold text-blue-800">{distance} km</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-600">Estimated Delivery Time</p>
                        <p className="font-semibold text-gray-900">{Math.ceil(distance * 3 + 20)} - {Math.ceil(distance * 3 + 40)} mins</p>
                    </div>
                </div>
            )}

            {loadingLocation && (
                <div className="text-center text-blue-600 text-sm">
                    Finding location on map...
                </div>
            )}

            {!userLoc && !loadingLocation && (
                <p className="text-sm text-center text-gray-500 italic">
                    Select a Region/Emirate above or tap on the map to pin location.
                </p>
            )}
        </div>
    );
};

export default DeliveryMap;
