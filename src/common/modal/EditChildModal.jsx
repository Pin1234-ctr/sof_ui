import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, GraduationCap, Building, X, Pencil } from 'lucide-react';
import { Toast } from 'primereact/toast';
import ApiService from '../../service/ApiService';
import { POST_APIS } from '../../../connection';

function EditChildModal({ child, onClose, onUpdateSuccess }) {
    const toast = useRef(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        class: '',
        school: '',
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (child) {
            setFormData({
                fullName: child.name || '',
                email: child.email || '',
                class: child.class?.replace('Class ', '') || '',
                school: child.school_name || '', // Assuming school_name is passed in child object
            });
        }
    }, [child]);

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.class) newErrors.class = 'Class is required.';
        if (!formData.school.trim()) newErrors.school = 'School name is required.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.current.show({ severity: 'warn', summary: 'Validation Error', detail: 'Please check the fields and try again.' });
            return;
        }

        setIsLoading(true);
        try {
            const payload = {
                student_id: child.student_id,
                student_full_name: formData.fullName,
                student_email: formData.email,
                class_grade: parseInt(formData.class, 10),
                school_name: formData.school,
                avatar_url: child.avatar_url || "" // Include avatar_url as per API requirement
            };
            
            const response = await ApiService(POST_APIS.updatechilddetails, { method: 'POST', body: payload });

            if (response && response.message === "Child details updated successfully") {
                toast.current.show({ severity: 'success', summary: 'Success', detail: response.message });
                setTimeout(() => {
                    onUpdateSuccess(); // This function should refetch the children list in ManageChild
                    onClose(); // Close the modal
                }, 1500);
            } else {
                toast.current.show({ severity: 'error', summary: 'Update Failed', detail: response.message || 'An error occurred.' });
            }
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: error.message || 'Something went wrong!' });
        } finally {
            setIsLoading(false);
        }
    };

    if (!child) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md m-4 max-h-[90vh] flex flex-col">
                <Toast ref={toast} />
                <div className="flex justify-between items-start p-6 pb-4 border-b border-gray-200">
                    <div>
                        <h2 className="text-xl font-semibold text-blue-900 flex items-center gap-2"><Pencil size={20} /> Edit Child Details</h2>
                        <p className="text-sm text-gray-500">Update the details for {child.name}.</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X className="size-5" /></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 p-6 overflow-y-auto">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Full Name</label>
                        <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" /><input type="text" value={formData.fullName} readOnly className="pl-10 w-full px-3 py-2 border rounded-md bg-gray-100 cursor-not-allowed border-gray-300" /></div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Email Address</label>
                        <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" /><input type="email" value={formData.email} readOnly className="pl-10 w-full px-3 py-2 border rounded-md bg-gray-100 cursor-not-allowed border-gray-300" /></div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Class/Grade <span className="text-red-500">*</span></label>
                        <div className="relative"><GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" /><select value={formData.class} onChange={(e) => handleInputChange('class', e.target.value)} className={`pl-10 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.class ? 'border-red-500' : 'border-gray-300'}`}><option value="">Select Class</option>{Array.from({ length: 12 }, (_, i) => i + 1).map(c => <option key={c} value={c}>Class {c}</option>)}</select></div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">School Name <span className="text-red-500">*</span></label>
                        <div className="relative"><Building className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" /><input type="text" placeholder="Enter school name" value={formData.school} onChange={(e) => handleInputChange('school', e.target.value)} className={`pl-10 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.school ? 'border-red-500' : 'border-gray-300'}`} /></div>
                    </div>
                    <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md cursor-pointer disabled:bg-blue-400 disabled:cursor-not-allowed">
                        {isLoading ? 'Saving Changes...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EditChildModal