
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import AddressAutocomplete, { AddressData } from '@/components/address/AddressAutocomplete';
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';

interface PropertyAddressFormProps {
  form: UseFormReturn<any>;
  defaultAddress?: string;
}

const PropertyAddressForm: React.FC<PropertyAddressFormProps> = ({ form, defaultAddress }) => {
  const { t } = useLanguage();
  
  const handleAddressSelect = (addressData: AddressData) => {
    // Update form with the address components
    form.setValue('address', addressData.fullAddress);
    
    if (addressData.city) {
      form.setValue('city', addressData.city);
    }
    
    if (addressData.state) {
      form.setValue('state', addressData.state);
    }
    
    if (addressData.postalCode) {
      form.setValue('zipCode', addressData.postalCode);
    }
    
    if (addressData.country) {
      form.setValue('country', addressData.country);
    }
    
    // If there are lat/lng values, save them too
    if (addressData.lat && addressData.lng) {
      form.setValue('latitude', addressData.lat);
      form.setValue('longitude', addressData.lng);
    }
  };

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('address')}</FormLabel>
            <FormControl>
              <AddressAutocomplete
                defaultValue={field.value || defaultAddress || ''}
                onAddressSelect={handleAddressSelect}
                required
                id="property-address"
              />
            </FormControl>
            <FormDescription>
              {t('propertyAddressDescription')}
            </FormDescription>
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('city')}</FormLabel>
              <FormControl>
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder={t('enterCity')}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="zipCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('zipCode')}</FormLabel>
              <FormControl>
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder={t('enterZipCode')}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('state')}</FormLabel>
              <FormControl>
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder={t('enterState')}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('country')}</FormLabel>
              <FormControl>
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder={t('enterCountry')}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default PropertyAddressForm;
