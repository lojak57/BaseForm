import React, { useState } from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  FileText,
  Users,
  Video,
  BookOpen,
  Folder,
  Video as VideoIcon,
  Code,
  Headphones,
  FileCode,
  ChevronRight,
  Plus,
  Check,
  Clock,
  Clock3,
  CalendarClock,
  Trash2,
  Edit
} from "lucide-react";

// Service types enum
export enum ServiceType {
  CONSULTATION = 'consultation',
  DIGITAL_DELIVERABLE = 'digital_deliverable',
  SUBSCRIPTION = 'subscription',
  COURSE = 'course',
  TEMPLATE_LIBRARY = 'template_library',
  LIVE_EVENT = 'live_event',
  WORKFLOW_AUTOMATION = 'workflow_automation',
  SUPPORT = 'support',
  WHITE_LABEL = 'white_label',
  API_REPORT = 'api_report'
}

// Service interface
export interface Service {
  id: string;
  type: ServiceType;
  name: string;
  description: string;
  price: string;
  priceModel: 'one-time' | 'recurring';
  recurringInterval?: 'monthly' | 'annually';
  details: any; // Specific details based on service type
}

// Define interfaces for different service types
interface ConsultationService {
  duration: '30' | '60' | '90';
  availableDays: string[];
  availableTimeSlots: string[];
  zoomIntegration: boolean;
  autoInvoice: boolean;
}

interface DigitalDeliverableService {
  fileType: string;
  deliveryMethod: 'email' | 'portal';
  downloadLimit: number;
  accessExpiry: number; // Days
}

// Props for the ServiceOfferings component
interface ServiceOfferingsProps {
  services: Service[];
  onAddService: (service: Service) => void;
  onEditService: (id: string, service: Service) => void;
  onDeleteService: (id: string) => void;
  primaryColor: string;
  secondaryColor: string;
}

const ServiceOfferings: React.FC<ServiceOfferingsProps> = ({
  services,
  onAddService,
  onEditService,
  onDeleteService,
  primaryColor,
  secondaryColor
}) => {
  const [selectedType, setSelectedType] = useState<ServiceType>(ServiceType.CONSULTATION);
  const [serviceName, setServiceName] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [priceModel, setPriceModel] = useState<'one-time' | 'recurring'>('one-time');
  const [recurringInterval, setRecurringInterval] = useState<'monthly' | 'annually'>('monthly');
  
  // Consultation specific states
  const [duration, setDuration] = useState<'30' | '60' | '90'>('60');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [zoomIntegration, setZoomIntegration] = useState(true);
  const [autoInvoice, setAutoInvoice] = useState(true);
  
  // States for other service types would be defined here
  
  const getServiceIcon = (type: ServiceType) => {
    switch (type) {
      case ServiceType.CONSULTATION:
        return <Calendar className="w-5 h-5" />;
      case ServiceType.DIGITAL_DELIVERABLE:
        return <FileText className="w-5 h-5" />;
      case ServiceType.SUBSCRIPTION:
        return <Users className="w-5 h-5" />;
      case ServiceType.COURSE:
        return <Video className="w-5 h-5" />;
      case ServiceType.TEMPLATE_LIBRARY:
        return <Folder className="w-5 h-5" />;
      case ServiceType.LIVE_EVENT:
        return <VideoIcon className="w-5 h-5" />;
      case ServiceType.WORKFLOW_AUTOMATION:
        return <Code className="w-5 h-5" />;
      case ServiceType.SUPPORT:
        return <Headphones className="w-5 h-5" />;
      case ServiceType.WHITE_LABEL:
        return <FileCode className="w-5 h-5" />;
      case ServiceType.API_REPORT:
        return <FileText className="w-5 h-5" />;
      default:
        return <Calendar className="w-5 h-5" />;
    }
  };

  const resetForm = () => {
    setServiceName('');
    setServiceDescription('');
    setServicePrice('');
    setPriceModel('one-time');
    setRecurringInterval('monthly');
    setDuration('60');
    setSelectedDays([]);
    setTimeSlots([]);
    setZoomIntegration(true);
    setAutoInvoice(true);
  };
  
  const handleAddService = () => {
    // Validate form
    if (!serviceName || !serviceDescription || !servicePrice) {
      alert('Please fill out all required fields');
      return;
    }
    
    // Create service details based on type
    let details: any = {};
    
    switch (selectedType) {
      case ServiceType.CONSULTATION:
        details = {
          duration,
          availableDays: selectedDays,
          availableTimeSlots: timeSlots,
          zoomIntegration,
          autoInvoice
        };
        break;
      // Add other service types here
      default:
        details = {};
    }
    
    // Create the service object
    const newService: Service = {
      id: Date.now().toString(),
      type: selectedType,
      name: serviceName,
      description: serviceDescription,
      price: servicePrice,
      priceModel,
      recurringInterval: priceModel === 'recurring' ? recurringInterval : undefined,
      details
    };
    
    // Call the parent component's onAddService function
    onAddService(newService);
    
    // Reset the form
    resetForm();
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#f8f9fb] border-2 border-gray-200 rounded-xl overflow-hidden mb-6">
        <div className="bg-[#0d3b66] text-white px-6 py-4 flex justify-between items-center">
          <h3 className="text-lg font-medium flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Add Service Offerings
          </h3>
          <div className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">
            Premium Feature
          </div>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <h4 className="font-medium mb-4">Select Service Type</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <ServiceTypeCard 
                type={ServiceType.CONSULTATION} 
                icon={<Calendar className="w-6 h-6" />}
                title="Consultation Call"
                selected={selectedType === ServiceType.CONSULTATION}
                onClick={() => setSelectedType(ServiceType.CONSULTATION)}
                color={primaryColor}
              />
              <ServiceTypeCard 
                type={ServiceType.DIGITAL_DELIVERABLE} 
                icon={<FileText className="w-6 h-6" />}
                title="Digital Deliverable"
                selected={selectedType === ServiceType.DIGITAL_DELIVERABLE}
                onClick={() => setSelectedType(ServiceType.DIGITAL_DELIVERABLE)}
                color={primaryColor}
              />
              <ServiceTypeCard 
                type={ServiceType.SUBSCRIPTION} 
                icon={<Users className="w-6 h-6" />}
                title="Subscription"
                selected={selectedType === ServiceType.SUBSCRIPTION}
                onClick={() => setSelectedType(ServiceType.SUBSCRIPTION)}
                color={primaryColor}
              />
              <ServiceTypeCard 
                type={ServiceType.COURSE} 
                icon={<Video className="w-6 h-6" />}
                title="Online Course"
                selected={selectedType === ServiceType.COURSE}
                onClick={() => setSelectedType(ServiceType.COURSE)}
                color={primaryColor}
              />
              <ServiceTypeCard 
                type={ServiceType.TEMPLATE_LIBRARY} 
                icon={<Folder className="w-6 h-6" />}
                title="Template Library"
                selected={selectedType === ServiceType.TEMPLATE_LIBRARY}
                onClick={() => setSelectedType(ServiceType.TEMPLATE_LIBRARY)}
                color={primaryColor}
              />
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="font-medium mb-4">Service Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Service Name</label>
                <input 
                  type="text" 
                  placeholder="e.g., Strategy Consultation Call" 
                  className="w-full p-3 border border-gray-200 rounded-md"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Price</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 border border-r-0 border-gray-200 rounded-l-md bg-gray-50">
                    $
                  </span>
                  <input 
                    type="text" 
                    placeholder="99.99" 
                    className="flex-1 p-3 border border-gray-200 rounded-r-md"
                    value={servicePrice}
                    onChange={(e) => setServicePrice(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea 
                rows={3}
                placeholder="Describe what clients will get from this service" 
                className="w-full p-3 border border-gray-200 rounded-md"
                value={serviceDescription}
                onChange={(e) => setServiceDescription(e.target.value)}
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Pricing Model</label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    checked={priceModel === 'one-time'} 
                    onChange={() => setPriceModel('one-time')}
                  />
                  <span>One-time Payment</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    checked={priceModel === 'recurring'} 
                    onChange={() => setPriceModel('recurring')}
                  />
                  <span>Recurring</span>
                </label>
              </div>
              
              {priceModel === 'recurring' && (
                <div className="mt-3 pl-4 border-l-2 border-gray-200">
                  <label className="block text-sm font-medium mb-2">Billing Frequency</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2">
                      <input 
                        type="radio" 
                        checked={recurringInterval === 'monthly'} 
                        onChange={() => setRecurringInterval('monthly')}
                      />
                      <span>Monthly</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input 
                        type="radio" 
                        checked={recurringInterval === 'annually'} 
                        onChange={() => setRecurringInterval('annually')}
                      />
                      <span>Annually</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
            
            {/* Conditional fields based on service type */}
            {selectedType === ServiceType.CONSULTATION && (
              <div className="border border-gray-200 rounded-lg p-4 mb-6 bg-gray-50">
                <h4 className="font-medium mb-4">Consultation Settings</h4>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Call Duration</label>
                  <div className="flex space-x-3">
                    <button 
                      className={`px-4 py-2 rounded-md flex items-center gap-2 ${duration === '30' ? 'bg-[#0d3b66] text-white' : 'bg-white border border-gray-200'}`}
                      onClick={() => setDuration('30')}
                    >
                      <Clock className="w-4 h-4" /> 30 min
                    </button>
                    <button 
                      className={`px-4 py-2 rounded-md flex items-center gap-2 ${duration === '60' ? 'bg-[#0d3b66] text-white' : 'bg-white border border-gray-200'}`}
                      onClick={() => setDuration('60')}
                    >
                      <Clock3 className="w-4 h-4" /> 60 min
                    </button>
                    <button 
                      className={`px-4 py-2 rounded-md flex items-center gap-2 ${duration === '90' ? 'bg-[#0d3b66] text-white' : 'bg-white border border-gray-200'}`}
                      onClick={() => setDuration('90')}
                    >
                      <CalendarClock className="w-4 h-4" /> 90 min
                    </button>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Integrations</label>
                  <div className="flex items-center gap-4 flex-wrap">
                    <label className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={zoomIntegration} 
                        onChange={(e) => setZoomIntegration(e.target.checked)}
                      /> 
                      Auto-generate Zoom link
                    </label>
                    <label className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={autoInvoice} 
                        onChange={(e) => setAutoInvoice(e.target.checked)}
                      /> 
                      Auto-generate invoice
                    </label>
                  </div>
                </div>
                
                <div className="p-3 border border-blue-100 bg-blue-50 rounded-md text-sm text-blue-700">
                  When a client books, they'll receive a confirmation email with the Zoom link and calendar invite.
                </div>
              </div>
            )}
            
            {/* Similar conditional sections for other service types would go here */}
            
            <div className="flex justify-end">
              <Button 
                className="bg-[#18a77e] hover:bg-[#18a77e]/90"
                onClick={handleAddService}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Service
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Services list */}
      {services.length > 0 ? (
        <div className="space-y-4">
          <h3 className="font-medium">Your Services ({services.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map(service => (
              <div key={service.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {getServiceIcon(service.type)}
                    <span className="font-medium">{service.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => onEditService(service.id, service)}
                      className="p-1 text-gray-500 hover:text-blue-500"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onDeleteService(service.id)}
                      className="p-1 text-gray-500 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-[#18a77e] font-semibold">${service.price}</div>
                      <div className="text-xs text-gray-500">
                        {service.priceModel === 'one-time' ? 'One-time payment' : `${service.recurringInterval} billing`}
                      </div>
                    </div>
                    <div className="text-xs px-2 py-1 rounded-full bg-gray-100">
                      {service.type.replace('_', ' ')}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-[#0d3b66]/10 flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-[#0d3b66]" />
          </div>
          <h3 className="text-lg font-medium mb-2">No Services Created</h3>
          <p className="text-gray-500 mb-4 max-w-md mx-auto">
            Add services to offer consultations, digital products, courses, and more to your customers.
          </p>
        </div>
      )}
    </div>
  );
};

// Helper component for service type cards
interface ServiceTypeCardProps {
  type: ServiceType;
  icon: React.ReactNode;
  title: string;
  selected: boolean;
  onClick: () => void;
  color: string;
}

const ServiceTypeCard: React.FC<ServiceTypeCardProps> = ({
  type,
  icon,
  title,
  selected,
  onClick,
  color
}) => {
  return (
    <div 
      className={`border p-4 rounded-lg cursor-pointer transition-all ${
        selected 
          ? `border-[${color}] bg-[${color}]/5` 
          : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onClick}
    >
      <div className="flex flex-col items-center text-center gap-2">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
          selected ? `bg-[${color}] text-white` : 'bg-gray-100 text-gray-500'
        }`}>
          {icon}
        </div>
        <div className="font-medium text-sm">{title}</div>
      </div>
    </div>
  );
};

export default ServiceOfferings; 