import { useContext, createContext, useMemo } from 'react';
import ApiService from './services/ApiService';
import PropTypes from 'prop-types';

const ApiServiceContext = createContext(null);

export function ApiServiceProvider({ children }) {
    const apiService = useMemo(() => new ApiService(), []);

    return (
        <ApiServiceContext.Provider value={apiService}>
            {children}
        </ApiServiceContext.Provider>
    );
}

ApiServiceProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export function useApiService() {
    const context = useContext(ApiServiceContext);

    if (context === null) {
      throw new Error('useApiService must be used within an ApiServiceProvider');
    }
  
    return context;
}
