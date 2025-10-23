
import React, { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

if (!GOOGLE_MAPS_API_KEY) {
  console.error('Missing Google Maps API key. Please check your .env.local file.');
}

const CityAutocomplete = ({ onSelect, initialValue = '' }) => {
  const inputRef = useRef(null);
  const [inputValue, setInputValue] = useState(initialValue);

  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        initializeAutocomplete();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeAutocomplete;
      document.head.appendChild(script);
    };

    const initializeAutocomplete = () => {
      if (!window.google || !inputRef.current) return;
      
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['(cities)'],
        fields: ['address_components', 'geometry', 'name']
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (onSelect && place && place.address_components && place.geometry) {
          const cityComponent = place.address_components.find(c => c.types.includes('locality'));
          const countryComponent = place.address_components.find(c => c.types.includes('country'));
          
          const city = cityComponent ? cityComponent.long_name : place.name;
          const country = countryComponent ? countryComponent.long_name : '';
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();

          setInputValue(place.name);
          onSelect({ city, country, latitude: lat, longitude: lng });
        }
      });
    };

    loadGoogleMapsScript();

    return () => {
      const scripts = document.head.getElementsByTagName('script');
      for (let i = 0; i < scripts.length; i++) {
        if (scripts[i].src.includes('maps.googleapis.com')) {
          // It's generally not safe to remove the script as other components might use it.
          // We'll just let it be.
        }
      }
    };
  }, []); // onSelect not needed as dependency since we use it directly in the listener

  return (
    <div className="relative">
      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
      <input
        id="cityInput"
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Saisissez votre ville..."
        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1B5E20] focus:border-[#1B5E20]"
      />
    </div>
  );
};

export default CityAutocomplete;
