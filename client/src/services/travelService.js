import api from './api';

export const getStates = (params) => api.get('/states', { params });
export const getState  = (id)     => api.get(`/states/${id}`);

export const getCities     = (params) => api.get('/cities', { params });
export const getCity       = (id)     => api.get(`/cities/${id}`);

export const getCategories = ()        => api.get('/categories');

export const getPlaces  = (params) => api.get('/places', { params });
export const getPlace   = (id)     => api.get(`/places/${id}`);

// Auth
export const login    = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);
export const getMe    = ()     => api.get('/auth/me');

// Admin
export const getAdminStats = () => api.get('/admin/stats');

export const createPlace = (data) => api.post('/admin/places', data);
export const updatePlace = (id, data) => api.put(`/admin/places/${id}`, data);
export const deletePlace = (id)       => api.delete(`/admin/places/${id}`);

export const createState = (data) => api.post('/admin/states', data);
export const updateState = (id, data) => api.put(`/admin/states/${id}`, data);
export const deleteState = (id)       => api.delete(`/admin/states/${id}`);

export const createCity = (data)      => api.post('/admin/cities', data);
export const updateCity = (id, data)  => api.put(`/admin/cities/${id}`, data);
export const deleteCity = (id)        => api.delete(`/admin/cities/${id}`);

export const createCategory = (data)      => api.post('/admin/categories', data);
export const updateCategory = (id, data)  => api.put(`/admin/categories/${id}`, data);
export const deleteCategory = (id)        => api.delete(`/admin/categories/${id}`);
