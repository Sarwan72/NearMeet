
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, User, Building, HelpCircle, Users, Heart, Star, Coffee } from 'lucide-react';
import { Link } from 'react-router-dom';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
    contactReason: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const contactMethods = [
    {
      icon: <Mail className="w-8 h-8" />,
      title: "Email Us",
      description: "Reach out via email",
      contact: "support@nearmeet.com",
      subtext: "We respond within 24 hours",
      action: "mailto:support@nearmeet.com"
    },
    {
      icon: <Phone className="w-8 h-8" />,
      title: "Call Us",
      description: "Talk directly with our team",
      contact: "+1 (555) 987-6543",
      subtext: "Mon-Fri, 9AM-6PM",
      action: "tel:+15559876543"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Support",
      description: "Join our meetup discussions",
      contact: "Online Forum",
      subtext: "Available 24/7",
      action: "#"
    },
    {
      icon: <HelpCircle className="w-8 h-8" />,
      title: "Help Center",
      description: "Find answers to common questions",
      contact: "100+ Articles",
      subtext: "Safety and Meetup Guidelines",
      action: "#"
    }
  ];

  const contactReasons = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'support', label: 'Technical Support' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'feedback', label: 'Feedback' },
    { value: 'press', label: 'Press & Media' },
    { value: 'careers', label: 'Careers' }
  ];

  const socialLinks = [
    { name: 'Twitter', url: '#', color: 'bg-blue-500' },
    { name: 'Instagram', url: '#', color: 'bg-pink-500' },
    { name: 'Facebook', url: '#', color: 'bg-blue-600' },
    { name: 'LinkedIn', url: '#', color: 'bg-blue-700' }
  ];

  const offices = [
    {
      city: "Jhansi",
      address: "Biet Jhansi",
      timezone: "IST (UTC+5:30)",
      isHeadquarters: true
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    setSubmitStatus('success');
    setIsSubmitting(false);

    setTimeout(() => {
      setFormData({
        name: '', email: '', company: '', subject: '', message: '', contactReason: 'general'
      });
      setSubmitStatus(null);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-12">
      
      {/* Hero */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Get in Touch with NearMeet
        </h1>
        <p className="text-lg md:text-xl text-gray-600">
          Have questions about planning meetups, safety, or account issues? Contact our team and we’ll help you.
        </p>
      </div>

      {/* Contact Methods */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {contactMethods.map((method, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition cursor-pointer border border-gray-200" onClick={() => method.action.startsWith('#') ? null : window.open(method.action, '_blank')}>
            <div className="mb-4 p-3 bg-blue-500 rounded-xl inline-block text-white">{method.icon}</div>
            <h3 className="text-xl font-bold mb-1">{method.title}</h3>
            <p className="text-gray-600 mb-2">{method.description}</p>
            <p className="font-semibold">{method.contact}</p>
            <p className="text-sm text-gray-500">{method.subtext}</p>
          </div>
        ))}
      </div>

      {/* Contact Form and Offices */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
        {/* Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow">
          <h3 className="text-2xl font-bold mb-6">Send Us a Message</h3>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Reason for Contact</label>
            <select
              name="contactReason"
              value={formData.contactReason}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-2"
            >
              {contactReasons.map(reason => (
                <option key={reason.value} value={reason.value}>{reason.label}</option>
              ))}
            </select>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name *"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="border px-4 py-2 rounded-xl w-full"
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address *"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="border px-4 py-2 rounded-xl w-full"
              />
            </div>
            <input
              type="text"
              name="company"
              placeholder="Company (Optional)"
              value={formData.company}
              onChange={handleInputChange}
              className="border px-4 py-2 rounded-xl w-full"
            />
            <input
              type="text"
              name="subject"
              placeholder="Subject *"
              value={formData.subject}
              onChange={handleInputChange}
              required
              className="border px-4 py-2 rounded-xl w-full"
            />
            <textarea
              name="message"
              placeholder="Message *"
              rows={5}
              value={formData.message}
              onChange={handleInputChange}
              required
              className="border px-4 py-2 rounded-xl w-full"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-xl text-white font-semibold ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>

          {submitStatus === 'success' && (
            <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-xl">
              Message sent successfully! We'll get back to you soon.
            </div>
          )}
        </div>

        {/* Offices */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow">
            <h3 className="text-xl font-bold mb-4">Our Offices</h3>
            {offices.map((office, index) => (
              <div key={index} className="border p-3 rounded-lg mb-3">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-semibold">{office.city}</h4>
                  {office.isHeadquarters && <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">HQ</span>}
                </div>
                <p className="text-gray-600 flex items-center"><MapPin className="w-4 h-4 mr-1" /> {office.address}</p>
                <p className="text-gray-500 flex items-center"><Clock className="w-4 h-4 mr-1" /> {office.timezone}</p>
              </div>
            ))}
          </div>

          {/* Social Links */}
          <div className="bg-white rounded-2xl p-6 shadow">
            <h3 className="text-xl font-bold mb-4">Follow Us</h3>
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <a key={index} href={social.url} target="_blank" rel="noopener noreferrer" className={`w-10 h-10 flex items-center justify-center rounded-full text-white ${social.color}`}>
                  {social.name[0]}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Help Center */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Need Immediate Help?</h2>
        <p className="text-gray-600 mb-4">Check our Help Center for safety tips, meetup guidelines, and troubleshooting.</p>
        <Link to="/help" className="px-6 py-3 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600">
          Visit Help Center
        </Link>
      </div>

    </div>
  );
};

export default Contact;
