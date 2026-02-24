import { useState, useRef, useContext } from 'react';
import { User, Mail, Lock, GraduationCap, X, Building, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../helper/AuthContext';
import { Toast } from 'primereact/toast';
import ApiService from '../../service/ApiService';
import { POST_APIS } from '../../../connection';
import { UserContext } from '../helper/UserContext';

function AddChildModal({ onAddSuccess }) {
    const {childAdded, setChildAdded} = useContext(UserContext);
    const { closeModal, user } = useAuth();
    const toast = useRef(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        class: '',
        school: '',
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required.';
        if (!formData.email.trim()) newErrors.email = 'Email is required.';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid.';
        if (!formData.class) newErrors.class = 'Class is required.';
        if (!formData.school.trim()) newErrors.school = 'School name is required.';
        if (!formData.password) newErrors.password = 'Password is required.';
        else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters.';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';

        setErrors(newErrors);

        // Return the first error message found, or null if no errors
        const errorValues = Object.values(newErrors);
        return errorValues.length > 0 ? errorValues[0] : null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const firstError = validateForm();
        if (firstError) {
            toast.current.show({ severity: 'warn', detail: firstError });
            return;
        }

        setIsLoading(true);
        try {
            const payload = {
                parentId: user.id, // Assuming parent's ID is in the user object
                childName: formData.fullName,
                childEmail: formData.email,
                childPassword: formData.password,
                grade: parseInt(formData.class, 10),
                school: formData.school
            };
            const response = await ApiService(POST_APIS.addChild, { method: 'POST', body: payload });
            if (response.isSuccess) {
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Child account created successfully!' });
                setChildAdded(childAdded + 1);
                setTimeout(() => {
                    closeModal();
                    onAddSuccess();
                }, 1500);
            } else {
                toast.current.show({ severity: 'error', summary: 'Creation Failed', detail: response.message || 'An error occurred.' });
            }
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: error.message || 'Something went wrong!' });
        } finally {
            setIsLoading(false);

        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md m-4 max-h-[90vh] flex flex-col">
                <Toast ref={toast} />
                {/* Sticky Header */}
                <div className="flex justify-between items-start p-6 pb-4 border-b border-gray-200">
                    <div>
                        <h2 className="text-xl font-semibold text-blue-900 flex items-center gap-2">Create Child Account</h2>
                        <p className="text-sm text-gray-500">Enter your child's details to create their student account.</p>
                    </div>
                    <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X className="size-5" /></button>
                </div>

                {/* Scrollable Body */}
                <form onSubmit={handleSubmit} className="space-y-4 p-6 overflow-y-auto">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Full Name <span className="text-red-500">*</span></label>
                        <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" /><input type="text" placeholder="Enter child's full name" value={formData.fullName} onChange={(e) => handleInputChange('fullName', e.target.value)} className={`pl-10 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`} /></div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Email Address <span className="text-red-500">*</span></label>
                        <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" /><input type="email" placeholder="child@example.com" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} className={`pl-10 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`} /></div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Class/Grade <span className="text-red-500">*</span></label>
                        <div className="relative"><GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" /><select value={formData.class} onChange={(e) => handleInputChange('class', e.target.value)} className={`pl-10 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.class ? 'border-red-500' : 'border-gray-300'}`}><option value="">Select Class</option>{Array.from({ length: 12 }, (_, i) => i + 1).map(c => <option key={c} value={c}>Class {c}</option>)}</select></div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">School Name <span className="text-red-500">*</span></label>
                        <div className="relative"><Building className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" /><input type="text" placeholder="Enter school name" value={formData.school} onChange={(e) => handleInputChange('school', e.target.value)} className={`pl-10 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.school ? 'border-red-500' : 'border-gray-300'}`} /></div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Password <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                            <input type={showPassword ? "text" : "password"} placeholder="Create a password" value={formData.password} onChange={(e) => handleInputChange('password', e.target.value)} className={`pl-10 pr-10 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`} />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer">
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Confirm Password <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                            <input type={showConfirmPassword ? "text" : "password"} placeholder="Re-enter password" value={formData.confirmPassword} onChange={(e) => handleInputChange('confirmPassword', e.target.value)} className={`pl-10 pr-10 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`} />
                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer">
                                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>
                    <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md cursor-pointer disabled:bg-blue-400 disabled:cursor-not-allowed">
                        {isLoading ? 'Creating Account...' : 'Create Child Account'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddChildModal