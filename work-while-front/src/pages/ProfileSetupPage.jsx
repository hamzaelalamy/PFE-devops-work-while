import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateUser } from '../redux/slices/authSlice';
import userService from '../services/userService';

const ProfileSetupPage = () => {
  const { user, loading } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    profile: {
      phone: '',
      location: '',
      bio: '',
      skills: [],
      experience: '',
      education: '',
      avatar: ''
    }
  });

  const [skillInput, setSkillInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [completeness, setCompleteness] = useState(0);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        profile: {
          phone: user.profile?.phone || '',
          location: user.profile?.location || '',
          bio: user.profile?.bio || '',
          skills: user.profile?.skills || [],
          experience: user.profile?.experience || '',
          education: user.profile?.education || '',
          avatar: user.profile?.avatar || ''
        }
      });
    }
  }, [user]);

  useEffect(() => {
    calculateCompleteness();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  const calculateCompleteness = () => {
    const fields = [
      formData.firstName,
      formData.lastName,
      formData.email,
      formData.profile.phone,
      formData.profile.location,
      formData.profile.bio,
      formData.profile.skills.length > 0,
      formData.profile.experience,
      formData.profile.education
    ];

    const completedFields = fields.filter(Boolean).length;
    const percentage = Math.round((completedFields / fields.length) * 100);
    setCompleteness(percentage);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('profile.')) {
      const profileField = name.replace('profile.', '');
      setFormData(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          [profileField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSkillAdd = (e) => {
    e.preventDefault();
    if (skillInput.trim() && !formData.profile.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          skills: [...prev.profile.skills, skillInput.trim()]
        }
      }));
      setSkillInput('');
    }
  };

  const handleSkillRemove = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        skills: prev.profile.skills.filter(skill => skill !== skillToRemove)
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError(null);

      const response = await userService.updateProfile(formData);

      // Mettre à jour le store Redux
      dispatch(updateUser(response));

      setSuccess(true);

      // Rediriger après succès
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (err) {
      setError(err.message || 'Échec de la mise à jour du profil');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Dans une vraie application, vous téléchargeriez vers un service cloud
        const avatarUrl = URL.createObjectURL(file);
        setFormData(prev => ({
          ...prev,
          profile: {
            ...prev.profile,
            avatar: avatarUrl
          }
        }));
         
      } catch (_err) {
        setError('Échec du téléchargement de l\'avatar');
      }
    }
  };

  if (loading) {
    return (
        <div className="max-w-4xl mx-auto px-4 mt-24 mb-16">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="space-y-6">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
    );
  }

  return (
      <div className="max-w-4xl mx-auto px-4 mt-24 mb-16">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Configuration du profil</h1>
          <p className="text-gray-600 mt-2">
            Complétez votre profil pour améliorer votre expérience de recherche d'emploi
          </p>
        </div>

        {/* Barre de progression */}
        <div className="mb-8 bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Complétude du profil</span>
            <span className="text-sm font-medium text-blue-600">{completeness}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${completeness}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Complétez votre profil pour augmenter votre visibilité auprès des employeurs
          </p>
        </div>

        {/* Message de succès */}
        {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Save className="h-5 w-5 text-green-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    Profil mis à jour avec succès !
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    Redirection vers le tableau de bord...
                  </p>
                </div>
              </div>
            </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section Avatar */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Camera className="h-5 w-5 mr-2" />
              Photo de profil
            </h3>

            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-100">
                  {formData.profile.avatar ? (
                      <img
                          src={formData.profile.avatar}
                          alt="Profil"
                          className="h-full w-full object-cover"
                      />
                  ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <User className="h-12 w-12 text-gray-400" />
                      </div>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700">
                  <Camera className="h-4 w-4 text-white" />
                  <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                  />
                </label>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Télécharger une photo de profil</p>
                <p className="text-sm text-gray-500">JPG, PNG jusqu'à 2MB</p>
              </div>
            </div>
          </div>

          {/* Informations de base */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Informations de base
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom *
                </label>
                <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom *
                </label>
                <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-mail *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro de téléphone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                      type="tel"
                      name="profile.phone"
                      value={formData.profile.phone}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="+212 6XX XXX XXX"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Localisation
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                      type="text"
                      name="profile.location"
                      value={formData.profile.location}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ville, Pays"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Informations professionnelles */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Briefcase className="h-5 w-5 mr-2" />
              Informations professionnelles
            </h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Biographie
                </label>
                <textarea
                    name="profile.bio"
                    rows="4"
                    value={formData.profile.bio}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Parlez-nous de vous, de votre parcours professionnel et de vos objectifs de carrière..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expérience
                </label>
                <textarea
                    name="profile.experience"
                    rows="4"
                    value={formData.profile.experience}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Décrivez votre expérience professionnelle, vos postes précédents et vos réalisations..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Formation
                </label>
                <textarea
                    name="profile.education"
                    rows="3"
                    value={formData.profile.education}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Votre parcours éducatif, diplômes, certifications..."
                />
              </div>
            </div>
          </div>

          {/* Section Compétences */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Award className="h-5 w-5 mr-2" />
              Compétences
            </h3>

            <div className="space-y-4">
              <div className="flex space-x-2">
                <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ajouter une compétence (ex: JavaScript, Gestion de projet)"
                    onKeyPress={(e) => e.key === 'Enter' && handleSkillAdd(e)}
                />
                <button
                    type="button"
                    onClick={handleSkillAdd}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Ajouter
                </button>
              </div>

              {formData.profile.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.profile.skills.map((skill, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                        >
                    {skill}
                          <button
                              type="button"
                              onClick={() => handleSkillRemove(skill)}
                              className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                      ×
                    </button>
                  </span>
                    ))}
                  </div>
              )}
            </div>
          </div>

          {/* Message d'erreur */}
          {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                </div>
              </div>
          )}

          {/* Section de soumission */}
          <div className="flex justify-between items-center">
            <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50"
            >
              Passer pour l'instant
            </button>

            <button
                type="submit"
                disabled={submitting}
                className={`px-8 py-3 ${
                    submitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                } text-white font-medium rounded-md flex items-center`}
            >
              {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Enregistrement...
                  </>
              ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Enregistrer le profil
                  </>
              )}
            </button>
          </div>
        </form>
      </div>
  );
};

export default ProfileSetupPage;