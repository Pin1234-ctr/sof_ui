import React, { useState, useRef } from 'react';
import { UserCircle, User, Mail, Phone, Lock, X, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../helper/AuthContext';
import { Toast } from 'primereact/toast';
import ApiService from '../../service/ApiService';
import { POST_APIS } from '../../../connection';

function RegistrationModal() {
    const { closeModal, openLoginModal } = useAuth();
    const toast = useRef(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleInputChange = (field, value) => {
        if (field === 'phone') {
            // Allow only digits and limit to 10
            const numericValue = value.replace(/\D/g, '');
            if (numericValue.length <= 10) {
                setFormData((prev) => ({ ...prev, [field]: numericValue }));
            }
        } else {
            setFormData((prev) => ({ ...prev, [field]: value }));
        }
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required.';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required.';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid.';
        }
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required.';
        } else if (!/^\d{10}$/.test(formData.phone)) {
            newErrors.phone = 'Phone number must be 10 digits.';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required.';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters.';
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.current.show({ severity: 'error', summary: 'Validation Error', detail: 'Please check the fields and try again.' });
            return;
        }

        setIsLoading(true);
        try {
            const payload = {
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                role: "parent"
            };
            const response = await ApiService(POST_APIS.register, { method: 'POST', body: payload });
            if (response.isSuccess) {
                toast.current.show({ severity: 'success', summary: 'Success', detail: response.message || 'Registration Successful!' });
                setTimeout(() => { closeModal(); openLoginModal(); }, 1500);
            } else {
                toast.current.show({ severity: 'error', summary: 'Registration Failed', detail: response.message || 'An error occurred.' });
            }
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: error.message || 'Something went wrong!' });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md m-4 max-h-[90vh] flex flex-col">
                {/* Sticky Header */}
                <div className="flex justify-between items-start p-6 pb-4 border-b border-gray-200">
                    <div>
                        <h2 className="text-xl font-semibold text-blue-900 flex items-center gap-2">
                            <UserCircle className="size-6" />
                            Parent Registration
                        </h2>
                        <p className="text-sm text-gray-500">
                            Create your parent account to get started with SOF Prep Excellence
                        </p>
                    </div>
                    <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                        <X className="size-5" />
                    </button>
                </div>

                {/* Scrollable Body */}
                <form onSubmit={handleSubmit} className="space-y-4 p-6 overflow-y-auto">
                    <Toast ref={toast} />
                    <div className="space-y-2">
                        <label htmlFor="fullName" className="text-sm font-medium text-gray-700">Full Name <span className="text-red-500">*</span></label>
                        <div className="relative"><User className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" /><input id="fullName" type="text" placeholder="Enter your full name" value={formData.fullName} onChange={(e) => handleInputChange('fullName', e.target.value)} className={`pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.fullName ? 'border-red-500' : ''}`} /></div>
                        {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address <span className="text-red-500">*</span></label>
                        <div className="relative"><Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" /><input id="email" type="text" placeholder="parent@example.com" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} className={`pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : ''}`} /></div>
                        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number <span className="text-red-500">*</span></label>
                        <div className="relative flex items-center">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400 z-10" />
                            {formData.phone && <span className="absolute left-10 pl-1 pr-2 text-gray-500">+91</span>}
                            <input id="phone" type="tel" placeholder="Enter your phone number" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phone ? 'border-red-500' : ''} ${formData.phone ? 'pl-20' : 'pl-10'}`} />
                        </div>
                        {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium text-gray-700">Password <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
                            <input id="password" type={showPassword ? "text" : "password"} placeholder="Create a password (min. 6 characters)" value={formData.password} onChange={(e) => handleInputChange('password', e.target.value)} className={`pl-10 pr-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-500' : ''}`} />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer">
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm Password <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
                            <input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="Re-enter your password" value={formData.confirmPassword} onChange={(e) => handleInputChange('confirmPassword', e.target.value)} className={`pl-10 pr-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.confirmPassword ? 'border-red-500' : ''}`} />
                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer">
                                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        {errors.confirmPassword && (<p className="text-sm text-red-500">{errors.confirmPassword}</p>)}
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 space-y-2">
                        <p className="text-sm text-blue-900"><strong>Parent Account Benefits:</strong></p>
                        <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
                            <li>Create and manage multiple child accounts</li>
                            <li>Access to resource library and study materials</li>
                            <li>Generate custom tests for your children</li>
                            <li>Monitor performance and track progress</li>
                        </ul>
                    </div>

                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                        <p className="text-sm text-gray-700">
                            <strong>Note:</strong> Student accounts are created by parents. After registration, you can add your children from the parent dashboard.
                        </p>
                    </div>

                    <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md cursor-pointer disabled:bg-blue-400 disabled:cursor-not-allowed">
                        {isLoading ? 'Creating Account...' : 'Create Parent Account'}
                    </button>
                    
                    <div className="pt-4 mt-4 border-t border-gray-200">
                        <p className="text-center text-sm text-gray-600">
                            Already have an account?{' '}
                            <button type="button" onClick={() => { closeModal(); openLoginModal(); }} className="text-blue-600 hover:underline font-medium cursor-pointer">
                                Login here
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RegistrationModal