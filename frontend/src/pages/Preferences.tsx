import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CommutePreferences from '../components/CommutePreferences';
import HousingPreferences from '../components/HousingPreferences';
import AmenitiesPreferences from '../components/AmenitiesPreferences';

interface CommutePreferencesData {
  workLocation: {
    street: string;
    city: string;
    zipCode: string;
    state: string;
  };
  maxCommuteTime: number;
  transportationMethod: string;
}

interface HousingPreferencesData {
  homeType: string;
  rentOrBuy: string;
  rentPriceMin: number;
  rentPriceMax: number;
  buyPriceMin: number;
  buyPriceMax: number;
  bedrooms: number;
  bathrooms: number;
  parking: string;
}

interface AmenitiesPreferencesData {
  interests: string[];
  location: string;
  lifestyle: string[];
  goodSchoolDistrict: boolean;
  proximityToAmenities: string;
}

type Step = 'commute' | 'housing' | 'amenities';

function Preferences(): React.JSX.Element {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>('commute');
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);

  const [commutePreferences, setCommutePreferences] = useState<CommutePreferencesData>({
    workLocation: {
      street: '',
      city: '',
      zipCode: '',
      state: '',
    },
    maxCommuteTime: 30,
    transportationMethod: '',
  });

  const [housingPreferences, setHousingPreferences] = useState<HousingPreferencesData>({
    homeType: '',
    rentOrBuy: '',
    rentPriceMin: 1000,
    rentPriceMax: 3000,
    buyPriceMin: 300000,
    buyPriceMax: 800000,
    bedrooms: 0,
    bathrooms: 0,
    parking: ''
  });

  const [amenitiesPreferences, setAmenitiesPreferences] = useState<AmenitiesPreferencesData>({
    interests: [],
    location: '',
    lifestyle: [],
    goodSchoolDistrict: false,
    proximityToAmenities: ''
  });

  function validateCommuteStep(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!commutePreferences.workLocation.street.trim()) {
      errors.push('Street address is required');
    }
    if (!commutePreferences.workLocation.city.trim()) {
      errors.push('City is required');
    }
    if (!commutePreferences.workLocation.state) {
      errors.push('State is required');
    }
    if (!commutePreferences.workLocation.zipCode || commutePreferences.workLocation.zipCode.length !== 5) {
      errors.push('Valid ZIP code is required');
    }
    if (!commutePreferences.transportationMethod) {
      errors.push('Transportation method is required');
    }
    
    return { isValid: errors.length === 0, errors };
  }

  function validateHousingStep(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!housingPreferences.homeType) {
      errors.push('Home type is required');
    }
    if (!housingPreferences.rentOrBuy) {
      errors.push('Rent or buy preference is required');
    }
    if (housingPreferences.rentOrBuy === 'rent' || housingPreferences.rentOrBuy === 'either') {
      if (housingPreferences.rentPriceMin >= housingPreferences.rentPriceMax) {
        errors.push('Minimum rent must be less than maximum rent');
      }
    }
    if (housingPreferences.rentOrBuy === 'buy' || housingPreferences.rentOrBuy === 'either') {
      if (housingPreferences.buyPriceMin >= housingPreferences.buyPriceMax) {
        errors.push('Minimum buy price must be less than maximum buy price');
      }
    }
    
    return { isValid: errors.length === 0, errors };
  }

  function validateAmenitiesStep(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!amenitiesPreferences.interests.length) {
      errors.push('At least one interest is required');
    }
    
    return { isValid: errors.length === 0, errors };
  }
  
  function handleBack() {
    if (currentStep === 'housing') {
      setCurrentStep('commute');
    } else if (currentStep === 'amenities') {
      setCurrentStep('housing');
    }
  }

  function handleNext() {
    let validation: { isValid: boolean; errors: string[] };
    
    if (currentStep === 'commute') {
      validation = validateCommuteStep();
      if (!validation.isValid) {
        setErrors(validation.errors);
        return;
      }
      
      setSaving(true);
      axios.post(`/api/preferences/commute`, commutePreferences)
        .then(() => {
        setCurrentStep('housing');
      })
      .catch(error => {
        console.error('Error saving preferences:', error);
        setErrors(['Failed to save preferences. Please try again.']);
      })
      .finally(() => {
        setSaving(false);
      });
    } 
    else if (currentStep === 'housing') {
      validation = validateHousingStep();
      if (!validation.isValid) {
        setErrors(validation.errors);
        return;
      }
      
      axios.post(`/api/preferences/housing`, housingPreferences)
        .then(() => {
          setCurrentStep('amenities');
        })
        .catch(error => {
          console.error('Error saving preferences:', error);
          setErrors(['Failed to save preferences. Please try again.']);
        })
        .finally(() => {
          setSaving(false);
        });
    }
    else if (currentStep === 'amenities') {
      validation = validateAmenitiesStep();
      if (!validation.isValid) {
        setErrors(validation.errors);
        return;
      }
    }

    axios.post(`/api/preferences/amenities`, amenitiesPreferences)
      .then(() => {
        setCurrentStep('amenities');
      })
      .catch(error => {
        console.error('Error saving preferences:', error);
        setErrors(['Failed to save preferences. Please try again.']);
      })
      .finally(() => {
        setSaving(false);
      });
  }

  function handleSubmit() {
    setLoading(true);

    // Combine all preferences
    const allPreferences = {
      commute: commutePreferences,
      housing: housingPreferences,
      amenities: amenitiesPreferences
    };

    // TODO: Save preferences to backend
    console.log('All preferences:', allPreferences);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert('Preferences saved successfully!');
      navigate('/dashboard');
    }, 1000);
  }

  function renderCurrentStep() {
    switch (currentStep) {
      case 'commute':
        return (
          <CommutePreferences
            preferences={commutePreferences}
            onUpdate={setCommutePreferences}
            onNext={handleNext}
            saving={saving}
            errors={errors}
          />
        );
      case 'housing':
        return (
          <HousingPreferences
            preferences={housingPreferences}
            onUpdate={setHousingPreferences}
            onNext={handleNext}
            onBack={handleBack}
            saving={saving}
            errors={errors}
          />
        );
      case 'amenities':
        return (
          <AmenitiesPreferences
            preferences={amenitiesPreferences}
            onUpdate={setAmenitiesPreferences}
            onBack={handleBack}
            onNext={handleNext}
            loading={loading}
          />
        );
      default:
        return null;
    }
  }

  return (
    <div>
      {renderCurrentStep()}
    </div>
  );
}

export default Preferences;
