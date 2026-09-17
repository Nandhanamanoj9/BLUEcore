import React, { useState } from 'react';
import { useSiteImages } from '../context/SiteImagesContext';
import { APPLICATION_GROUPS } from '../data/siteData';
import '../styles/admin.css';

export default function Admin({ onBackToSite }) {
  const {
    slots,
    galleries,
    galleryItems,
    materialsGallery,
    projectsGallery,
    isAuthenticated,
    adminUser,
    loginAdmin,
    logoutAdmin,
    refreshImages
  } = useSiteImages();

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active section management tab
  // Options: 'all' | 'hero' | 'about' | 'showcase' | 'materials' | 'gallery' | 'projects'
  const [selectedSection, setSelectedSection] = useState('materials');

  // Active project category inside projects section
  // Options: 'RESIDENTIAL' | 'COMMERCIAL' | 'EXTERIOR' | 'ALL'
  const [selectedProjectCat, setSelectedProjectCat] = useState('RESIDENTIAL');

  // Staged multi-image upload state (preview before saving)
  const [stagedFiles, setStagedFiles] = useState([]); // [{ file, previewUrl, name, size }]
  const [stagedTargetGallery, setStagedTargetGallery] = useState('materials_gallery');
  const [stagedCategory, setStagedCategory] = useState('MATERIALS');
  const [stagedTitlePrefix, setStagedTitlePrefix] = useState('');
  const [uploadProgress, setUploadProgress] = useState(null); // { current, total }

  // Status & toast
  const [toastMessage, setToastMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Portfolio gallery category filter
  const [galleryFilterCat, setGalleryFilterCat] = useState('ALL');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 4000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    const res = await loginAdmin(email, password);
    setIsLoggingIn(false);
    if (!res.success) {
      setLoginError(res.message);
    } else {
      showToast('Welcome to BLU CORE Admin Portal');
    }
  };

  // Upload single file to persistent storage
  const uploadSingleImage = async (file) => {
    const token = localStorage.getItem('blucore_admin_token');
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch('http://localhost:5000/api/images/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const data = await res.json();
    if (!data.success) {
      throw new Error(data.message || 'Image upload failed');
    }
    return data.data.fileUrl;
  };

  // Update Section Slot Image (Hero, About, Showcase)
  const handleSlotUpload = async (slotId, file) => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const uploadedUrl = await uploadSingleImage(file);
      const token = localStorage.getItem('blucore_admin_token');

      const res = await fetch(`http://localhost:5000/api/images/slots/${slotId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ imageUrl: uploadedUrl })
      });

      const data = await res.json();
      if (data.success) {
        await refreshImages();
        showToast(`Updated image for ${slots[slotId]?.title || slotId}`);
      } else {
        showToast(data.message || 'Failed to update slot');
      }
    } catch (err) {
      showToast(err.message || 'Error updating slot image');
    } finally {
      setIsProcessing(false);
    }
  };

  // Reset Slot to Default
  const handleSlotReset = async (slotId) => {
    setIsProcessing(true);
    try {
      const token = localStorage.getItem('blucore_admin_token');
      const res = await fetch(`http://localhost:5000/api/images/slots/${slotId}/reset`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        await refreshImages();
        showToast(`Reset ${slots[slotId]?.title || slotId} to original default asset`);
      } else {
        showToast(data.message || 'Failed to reset slot');
      }
    } catch (err) {
      showToast(err.message || 'Error resetting slot');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Multiple File Selection -> Stage for Preview Before Saving
  const handleFilesSelected = (e, galleryKey, defaultCat) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newStaged = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      name: file.name,
      size: (file.size / 1024).toFixed(1) + ' KB'
    }));

    setStagedFiles((prev) => [...prev, ...newStaged]);
    setStagedTargetGallery(galleryKey);
    setStagedCategory(defaultCat || 'MATERIALS');
    // Clear input so same file can be picked again if needed
    e.target.value = '';
  };

  const removeStagedFile = (index) => {
    setStagedFiles((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].previewUrl);
      updated.splice(index, 1);
      return updated;
    });
  };

  const clearStagedFiles = () => {
    stagedFiles.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    setStagedFiles([]);
    setUploadProgress(null);
  };

  // Save/Upload All Staged Photos to Persistent Storage
  const handleSaveStagedPhotos = async () => {
    if (stagedFiles.length === 0) return;
    setIsProcessing(true);
    setUploadProgress({ current: 0, total: stagedFiles.length });

    try {
      const uploadedItems = [];
      for (let i = 0; i < stagedFiles.length; i++) {
        setUploadProgress({ current: i + 1, total: stagedFiles.length });
        const staged = stagedFiles[i];
        const uploadedUrl = await uploadSingleImage(staged.file);
        const fileNameWithoutExt = staged.name.replace(/\.[^/.]+$/, '');
        const title = stagedTitlePrefix
          ? `${stagedTitlePrefix} ${i + 1}`
          : fileNameWithoutExt.replace(/[-_]/g, ' ');

        uploadedItems.push({
          image: uploadedUrl,
          label: title,
          cat: stagedCategory,
          legend: [stagedCategory, 'Custom CNC Precision']
        });
      }

      const token = localStorage.getItem('blucore_admin_token');
      const res = await fetch(`http://localhost:5000/api/images/galleries/${stagedTargetGallery}/batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ items: uploadedItems })
      });

      const data = await res.json();
      if (data.success) {
        await refreshImages();
        clearStagedFiles();
        showToast(`Successfully uploaded & saved ${uploadedItems.length} photos to ${stagedTargetGallery.replace('_', ' ')}!`);
      } else {
        showToast(data.message || 'Failed to save photos to gallery');
      }
    } catch (err) {
      showToast(err.message || 'Error saving photos');
    } finally {
      setIsProcessing(false);
      setUploadProgress(null);
    }
  };

  // Replace Single Photo in Any Gallery
  const handleReplaceGalleryPhoto = async (galleryKey, itemId, file) => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const uploadedUrl = await uploadSingleImage(file);
      const token = localStorage.getItem('blucore_admin_token');

      const res = await fetch(`http://localhost:5000/api/images/galleries/${galleryKey}/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ image: uploadedUrl })
      });

      const data = await res.json();
      if (data.success) {
        await refreshImages();
        showToast('Photo replaced successfully');
      } else {
        showToast(data.message || 'Failed to replace photo');
      }
    } catch (err) {
      showToast(err.message || 'Error replacing photo');
    } finally {
      setIsProcessing(false);
    }
  };

  // Delete Single Photo in Any Gallery
  const handleDeleteGalleryPhoto = async (galleryKey, itemId, title) => {
    if (!window.confirm(`Are you sure you want to remove "${title}" from the gallery?`)) {
      return;
    }
    setIsProcessing(true);
    try {
      const token = localStorage.getItem('blucore_admin_token');
      const res = await fetch(`http://localhost:5000/api/images/galleries/${galleryKey}/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (data.success) {
        await refreshImages();
        showToast(`Removed "${title}" from gallery`);
      } else {
        showToast(data.message || 'Failed to delete photo');
      }
    } catch (err) {
      showToast(err.message || 'Error deleting photo');
    } finally {
      setIsProcessing(false);
    }
  };

  // Login view if unauthorized
  if (!isAuthenticated) {
    return (
      <div className="admin-layout">
        <header className="admin-header">
          <div className="admin-header-inner">
            <div className="admin-brand">
              <h2>BLU CORE</h2>
              <span className="admin-badge">ADMIN PORTAL</span>
            </div>
            <button onClick={onBackToSite} className="admin-btn-secondary">
              ← Back to Website
            </button>
          </div>
        </header>

        <main className="admin-login-wrap">
          <div className="admin-login-card">
            <h3>Admin Sign In</h3>
            <p>Authenticate to manage live website images, hero visuals, materials, and showcase galleries.</p>

            {loginError && (
              <div style={{
                background: 'rgba(224, 106, 80, 0.12)',
                border: '1px solid #E06A50',
                color: '#9E321B',
                padding: '10px 14px',
                borderRadius: '6px',
                fontSize: '13px',
                marginBottom: '20px'
              }}>
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#70452A', marginBottom: '6px' }}>
                  ADMIN EMAIL
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="blucorenc@gmail.com"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '6px',
                    border: '1px solid rgba(185, 130, 74, 0.3)',
                    background: '#FDFBF7',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#70452A', marginBottom: '6px' }}>
                  PASSWORD
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '6px',
                    border: '1px solid rgba(185, 130, 74, 0.3)',
                    background: '#FDFBF7',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                style={{
                  marginTop: '10px',
                  background: 'linear-gradient(135deg, #70452A 0%, #4D2D19 100%)',
                  color: '#F7F2E9',
                  border: '1px solid #C49A5A',
                  padding: '14px',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: isLoggingIn ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 12px rgba(112, 69, 42, 0.25)'
                }}
              >
                {isLoggingIn ? 'Authenticating...' : 'Sign In to Management'}
              </button>
            </form>
          </div>
        </main>
      </div>
    );
  }

  // Active items for galleries
  const activeMaterials = materialsGallery || [];
  const activeProjects = projectsGallery || [];
  const activeMainGallery = galleryFilterCat === 'ALL'
    ? galleryItems
    : galleryItems.filter((item) => (item.cat || item.category)?.toLowerCase() === galleryFilterCat.toLowerCase());

  const categoriesList = ['ALL', 'WALL PANELS', 'DOORS', 'WOOD CARVING', 'CEILING', '3D PANELS', 'CUSTOM DESIGNS'];

  return (
    <div className="admin-layout">
      {/* Sticky Admin Header */}
      <header className="admin-header">
        <div className="admin-header-inner">
          <div className="admin-brand">
            <h2>BLU CORE</h2>
            <span className="admin-badge">IMAGE MANAGEMENT CMS</span>
          </div>

          <div className="admin-nav-actions">
            <span style={{ fontSize: '13px', color: '#E8D8C3' }}>
              Logged in as: <strong>{adminUser?.name || 'BLU CORE Admin'}</strong>
            </span>
            <button onClick={onBackToSite} className="admin-btn-secondary">
              ← View Website
            </button>
            <button onClick={logoutAdmin} className="admin-btn-danger">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="admin-container">
        {/* Section Navigation Pills */}
        <div className="section-nav-pills">
          <button
            className={`section-nav-pill ${selectedSection === 'materials' ? 'active' : ''}`}
            onClick={() => setSelectedSection('materials')}
          >
            🪵 Materials Gallery ({activeMaterials.length})
          </button>
          <button
            className={`section-nav-pill ${selectedSection === 'gallery' ? 'active' : ''}`}
            onClick={() => setSelectedSection('gallery')}
          >
            🖼️ Portfolio Gallery ({galleryItems.length})
          </button>
          <button
            className={`section-nav-pill ${selectedSection === 'hero' ? 'active' : ''}`}
            onClick={() => setSelectedSection('hero')}
          >
            ⚡ Hero / CNC Visual
          </button>
          <button
            className={`section-nav-pill ${selectedSection === 'about' ? 'active' : ''}`}
            onClick={() => setSelectedSection('about')}
          >
            🏛️ About BLU CORE
          </button>
          <button
            className={`section-nav-pill ${selectedSection === 'showcase' ? 'active' : ''}`}
            onClick={() => setSelectedSection('showcase')}
          >
            ✨ Showcase Cards (3)
          </button>
          <button
            className={`section-nav-pill ${selectedSection === 'projects' ? 'active' : ''}`}
            onClick={() => setSelectedSection('projects')}
          >
            📐 Projects Gallery ({activeProjects.length})
          </button>
        </div>

        {/* STAGED MULTI-PHOTO UPLOAD ZONE (Appears when user has selected photos) */}
        {stagedFiles.length > 0 && (
          <div className="staged-upload-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h4 style={{ margin: '0 0 4px', fontFamily: 'var(--serif)', fontSize: '18px', color: '#241811' }}>
                  Staged Photos Ready to Upload ({stagedFiles.length} Selected)
                </h4>
                <p style={{ margin: 0, fontSize: '13px', color: '#75665A' }}>
                  Review and preview your photos before saving. They will automatically appear in the {stagedTargetGallery.replace('_', ' ')}.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={clearStagedFiles}
                  disabled={isProcessing}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '6px',
                    border: '1px solid rgba(185, 130, 74, 0.3)',
                    background: '#F7F2E9',
                    color: '#70452A',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Clear Selection
                </button>

                <button
                  type="button"
                  onClick={handleSaveStagedPhotos}
                  disabled={isProcessing}
                  style={{
                    padding: '9px 18px',
                    borderRadius: '6px',
                    border: '1px solid #C49A5A',
                    background: 'linear-gradient(135deg, #70452A 0%, #4D2D19 100%)',
                    color: '#F7F2E9',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: isProcessing ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 12px rgba(112, 69, 42, 0.25)'
                  }}
                >
                  {isProcessing
                    ? `Uploading (${uploadProgress?.current || 1}/${uploadProgress?.total || stagedFiles.length})...`
                    : `Upload & Save All (${stagedFiles.length}) Photos`}
                </button>
              </div>
            </div>

            {/* Optional Title Prefix and Category selector for Projects */}
            <div style={{ marginTop: '16px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '220px' }}>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#70452A', marginBottom: '4px' }}>
                  OPTIONAL TITLE / LABEL FOR THESE PHOTOS
                </label>
                <input
                  type="text"
                  placeholder="e.g. Solid Teak Panel, Luxury Villa Living Room..."
                  value={stagedTitlePrefix}
                  onChange={(e) => setStagedTitlePrefix(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '5px',
                    border: '1px solid rgba(185, 130, 74, 0.3)',
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {stagedTargetGallery === 'projects_gallery' && (
                <div style={{ width: '220px' }}>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#70452A', marginBottom: '4px' }}>
                    TARGET PROJECT CATEGORY
                  </label>
                  <select
                    value={stagedCategory}
                    onChange={(e) => setStagedCategory(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '5px',
                      border: '1px solid rgba(185, 130, 74, 0.3)',
                      background: '#FFFFFF',
                      fontSize: '13px',
                      fontWeight: 500,
                      boxSizing: 'border-box'
                    }}
                  >
                    {APPLICATION_GROUPS.map((g) => (
                      <option key={g.category} value={g.category.toUpperCase()}>
                        {g.category.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Upload Progress Bar */}
            {uploadProgress && (
              <div className="upload-progress-wrap">
                <div
                  className="upload-progress-bar"
                  style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
                />
              </div>
            )}

            {/* Staged Previews Grid */}
            <div className="staged-grid">
              {stagedFiles.map((staged, idx) => (
                <div key={idx} className="staged-card">
                  <img src={staged.previewUrl} alt={staged.name} className="staged-thumb" />
                  <button
                    type="button"
                    onClick={() => removeStagedFile(idx)}
                    className="staged-remove-btn"
                    title="Remove from batch"
                  >
                    ✕
                  </button>
                  <div className="staged-meta">
                    <span title={staged.name}>{staged.name}</span>
                    <small>{staged.size}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SECTION 1: MATERIALS GALLERY MANAGEMENT (MAIN SPEC) */}
        {/* ======================================================== */}
        {selectedSection === 'materials' && (
          <div>
            <div className="admin-gallery-header">
              <div>
                <h3 style={{ fontFamily: 'var(--serif)', fontSize: '22px', color: '#241811', margin: '0 0 6px' }}>
                  Materials Gallery Grid Management
                </h3>
                <p style={{ color: '#75665A', fontSize: '14px', margin: 0 }}>
                  Upload multiple photos of finished carved materials (Teak, Multiwood, MDF, HDF, WPC). All photos automatically appear in the public Materials section with full click-to-open lightbox support.
                </p>
              </div>

              {/* Multiple Image Selection Trigger */}
              <label style={{
                background: 'linear-gradient(135deg, #70452A 0%, #4D2D19 100%)',
                color: '#F7F2E9',
                border: '1px solid #C49A5A',
                padding: '11px 20px',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '13.5px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(112, 69, 42, 0.25)'
              }}>
                <span>+ Add Photos to Materials Gallery</span>
                <input
                  type="file"
                  multiple
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  disabled={isProcessing}
                  style={{ display: 'none' }}
                  onChange={(e) => handleFilesSelected(e, 'materials_gallery', 'MATERIALS')}
                />
              </label>
            </div>

            {/* Grid of Existing Materials Gallery Items */}
            <div className="admin-gallery-grid">
              {activeMaterials.length === 0 ? (
                <div style={{
                  gridColumn: '1 / -1',
                  background: '#FFFFFF',
                  padding: '40px 20px',
                  textAlign: 'center',
                  borderRadius: '8px',
                  border: '1px dashed rgba(185, 130, 74, 0.3)'
                }}>
                  <p style={{ color: '#75665A', fontSize: '15px', margin: '0 0 16px' }}>
                    No custom material photos uploaded yet. The public website is displaying the default material sample cards.
                  </p>
                  <label style={{
                    background: '#70452A',
                    color: '#F7F2E9',
                    padding: '10px 18px',
                    borderRadius: '6px',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-block'
                  }}>
                    Select Multiple Material Photos to Upload
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => handleFilesSelected(e, 'materials_gallery', 'MATERIALS')}
                    />
                  </label>
                </div>
              ) : (
                activeMaterials.map((item) => {
                  const img = item.image || item.src;
                  const label = item.label || item.title || 'Precision Material Carving';
                  const legend = Array.isArray(item.legend) ? item.legend.join(' · ') : (item.legend || 'CNC Material Spec');

                  return (
                    <div key={item.id} className="admin-gallery-card">
                      <div className="admin-gallery-thumb">
                        <img src={img} alt={label} onError={(e) => { e.target.src = '/images/showcase/wall-panels.jpg'; }} />
                      </div>

                      <div className="admin-gallery-info">
                        <span className="admin-gallery-cat">MATERIAL WORK</span>
                        <span className="admin-gallery-title">{label}</span>
                        <span style={{ fontSize: '11.5px', color: '#8A7A6D' }}>{legend}</span>
                      </div>

                      <div className="admin-gallery-actions">
                        <label style={{
                          fontSize: '12px',
                          color: '#70452A',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          📁 Replace
                          <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            disabled={isProcessing}
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                handleReplaceGalleryPhoto('materials_gallery', item.id, e.target.files[0]);
                              }
                            }}
                          />
                        </label>

                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() => handleDeleteGalleryPhoto('materials_gallery', item.id, label)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#C0604A',
                            fontSize: '12px',
                            cursor: 'pointer',
                            fontWeight: 500
                          }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SECTION 2: PORTFOLIO GALLERY (MAIN MASONRY GRID) */}
        {/* ======================================================== */}
        {selectedSection === 'gallery' && (
          <div>
            <div className="admin-gallery-header">
              <div>
                <h3 style={{ fontFamily: 'var(--serif)', fontSize: '22px', color: '#241811', margin: '0 0 6px' }}>
                  Portfolio Gallery Showcase
                </h3>
                <p style={{ color: '#75665A', fontSize: '14px', margin: 0 }}>
                  Manage the main client-facing portfolio gallery. Supports category filtering, multi-photo batch addition, and instant lightbox zoom.
                </p>
              </div>

              <label style={{
                background: 'linear-gradient(135deg, #70452A 0%, #4D2D19 100%)',
                color: '#F7F2E9',
                border: '1px solid #C49A5A',
                padding: '11px 20px',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '13.5px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(112, 69, 42, 0.25)'
              }}>
                <span>+ Add Photos to Portfolio</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  disabled={isProcessing}
                  style={{ display: 'none' }}
                  onChange={(e) => handleFilesSelected(e, 'main_gallery', galleryFilterCat === 'ALL' ? 'WOOD CARVING' : galleryFilterCat)}
                />
              </label>
            </div>

            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
              {categoriesList.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setGalleryFilterCat(cat)}
                  style={{
                    padding: '7px 16px',
                    fontSize: '13px',
                    borderRadius: '999px',
                    border: '1px solid',
                    borderColor: galleryFilterCat === cat ? '#70452A' : 'rgba(185, 130, 74, 0.25)',
                    background: galleryFilterCat === cat ? '#70452A' : '#FFFFFF',
                    color: galleryFilterCat === cat ? '#F7F2E9' : '#75665A',
                    fontWeight: galleryFilterCat === cat ? 600 : 500,
                    cursor: 'pointer'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Grid */}
            <div className="admin-gallery-grid">
              {activeMainGallery.map((item) => {
                const img = item.image || item.src;
                const label = item.label || item.title || 'Precision CNC Project';
                const cat = item.cat || item.category || 'WOOD CARVING';
                const legend = Array.isArray(item.legend) ? item.legend.join(' · ') : (item.legend || 'Custom Precision Spec');

                return (
                  <div key={item.id} className="admin-gallery-card">
                    <div className="admin-gallery-thumb">
                      <img src={img} alt={label} onError={(e) => { e.target.src = '/images/showcase/wall-panels.jpg'; }} />
                    </div>

                    <div className="admin-gallery-info">
                      <span className="admin-gallery-cat">{cat}</span>
                      <span className="admin-gallery-title">{label}</span>
                      <span style={{ fontSize: '11.5px', color: '#8A7A6D' }}>{legend}</span>
                    </div>

                    <div className="admin-gallery-actions">
                      <label style={{
                        fontSize: '12px',
                        color: '#70452A',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        📁 Replace
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          disabled={isProcessing}
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              handleReplaceGalleryPhoto('main_gallery', item.id, e.target.files[0]);
                            }
                          }}
                        />
                      </label>

                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => handleDeleteGalleryPhoto('main_gallery', item.id, label)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#C0604A',
                          fontSize: '12px',
                          cursor: 'pointer',
                          fontWeight: 500
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SECTION 3: HERO / CNC MACHINE VISUAL */}
        {/* ======================================================== */}
        {selectedSection === 'hero' && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: '22px', color: '#241811', margin: '0 0 6px' }}>
                Hero / CNC Machine Visual
              </h3>
              <p style={{ color: '#75665A', fontSize: '14px', margin: 0 }}>
                Upload a custom photograph of your real CNC machine or workshop. When empty, the website automatically falls back to the interactive 3D CNC machine.
              </p>
            </div>

            <div style={{ maxWidth: '640px' }} className="admin-slot-card">
              <div className="admin-slot-header">
                <h4>{slots.hero_cnc?.title || 'Hero CNC Machine'}</h4>
                <span className="admin-slot-section-tag">HERO SECTION</span>
              </div>

              <div className="admin-slot-preview" style={{ aspectRatio: '16/9' }}>
                {slots.hero_cnc?.currentUrl ? (
                  <img src={slots.hero_cnc.currentUrl} alt="Hero CNC" />
                ) : (
                  <div className="admin-slot-empty">
                    <span>Using Interactive 3D Machine (Default)</span>
                  </div>
                )}
              </div>

              <div className="admin-slot-body">
                <p>{slots.hero_cnc?.description}</p>
                <div style={{ fontSize: '11.5px', color: '#8A7A6D' }}>
                  <strong>Active State:</strong> {slots.hero_cnc?.currentUrl ? 'Custom Image Active' : 'Interactive 3D Active'}
                </div>

                <div className="admin-slot-controls">
                  <label className="admin-upload-zone" style={{ flex: 1 }}>
                    <span>📁 Upload Custom Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isProcessing}
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleSlotUpload('hero_cnc', e.target.files[0]);
                        }
                      }}
                    />
                  </label>

                  {slots.hero_cnc?.currentUrl && (
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleSlotReset('hero_cnc')}
                      style={{
                        padding: '10px 14px',
                        fontSize: '12px',
                        background: '#F7F2E9',
                        border: '1px solid rgba(185, 130, 74, 0.3)',
                        borderRadius: '6px',
                        color: '#70452A',
                        cursor: 'pointer',
                        fontWeight: 500
                      }}
                    >
                      ↺ Restore 3D Model
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SECTION 4: ABOUT BLU CORE CRAFTSMANSHIP */}
        {/* ======================================================== */}
        {selectedSection === 'about' && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: '22px', color: '#241811', margin: '0 0 6px' }}>
                About BLU CORE Section Visual
              </h3>
              <p style={{ color: '#75665A', fontSize: '14px', margin: 0 }}>
                Main craftsmanship photograph displayed in the About section alongside the workshop narrative.
              </p>
            </div>

            <div style={{ maxWidth: '640px' }} className="admin-slot-card">
              <div className="admin-slot-header">
                <h4>{slots.about_main?.title || 'Workshop Craftsmanship'}</h4>
                <span className="admin-slot-section-tag">ABOUT SECTION</span>
              </div>

              <div className="admin-slot-preview" style={{ aspectRatio: '16/10' }}>
                <img
                  src={slots.about_main?.currentUrl || slots.about_main?.defaultUrl || '/images/about/cnc-craftsmanship.jpg'}
                  alt="About craftsmanship"
                />
              </div>

              <div className="admin-slot-body">
                <p>{slots.about_main?.description}</p>
                <div style={{ fontSize: '11.5px', color: '#8A7A6D', wordBreak: 'break-all' }}>
                  <strong>File:</strong> {slots.about_main?.currentUrl || slots.about_main?.defaultUrl}
                </div>

                <div className="admin-slot-controls">
                  <label className="admin-upload-zone" style={{ flex: 1 }}>
                    <span>📁 Upload Workshop Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isProcessing}
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleSlotUpload('about_main', e.target.files[0]);
                        }
                      }}
                    />
                  </label>

                  {slots.about_main?.currentUrl && slots.about_main.currentUrl !== slots.about_main.defaultUrl && (
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleSlotReset('about_main')}
                      style={{
                        padding: '10px 14px',
                        fontSize: '12px',
                        background: '#F7F2E9',
                        border: '1px solid rgba(185, 130, 74, 0.3)',
                        borderRadius: '6px',
                        color: '#70452A',
                        cursor: 'pointer',
                        fontWeight: 500
                      }}
                    >
                      ↺ Reset
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SECTION 5: SHOWCASE FEATURE CARDS */}
        {/* ======================================================== */}
        {selectedSection === 'showcase' && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: '22px', color: '#241811', margin: '0 0 6px' }}>
                Showcase Feature Photographs
              </h3>
              <p style={{ color: '#75665A', fontSize: '14px', margin: 0 }}>
                Replace the primary high-resolution photographs featured in Wall Panels, Door Design, and Ceiling Design.
              </p>
            </div>

            <div className="admin-slots-grid">
              {['showcase_wall_panels', 'showcase_door_design', 'showcase_ceiling_design'].map((slotKey) => {
                const slot = slots[slotKey];
                if (!slot) return null;
                return (
                  <div key={slotKey} className="admin-slot-card">
                    <div className="admin-slot-header">
                      <h4>{slot.title}</h4>
                      <span className="admin-slot-section-tag">SHOWCASE</span>
                    </div>

                    <div className="admin-slot-preview">
                      <img
                        src={slot.currentUrl || slot.defaultUrl}
                        alt={slot.title}
                        onError={(e) => {
                          e.target.src = '/images/showcase/wall-panels.jpg';
                        }}
                      />
                    </div>

                    <div className="admin-slot-body">
                      <p>{slot.description}</p>
                      <div className="admin-slot-controls">
                        <label className="admin-upload-zone" style={{ flex: 1 }}>
                          <span>📁 Choose New Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            disabled={isProcessing}
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                handleSlotUpload(slotKey, e.target.files[0]);
                              }
                            }}
                          />
                        </label>

                        {slot.currentUrl && slot.currentUrl !== slot.defaultUrl && (
                          <button
                            type="button"
                            disabled={isProcessing}
                            onClick={() => handleSlotReset(slotKey)}
                            style={{
                              padding: '10px 14px',
                              fontSize: '12px',
                              background: '#F7F2E9',
                              border: '1px solid rgba(185, 130, 74, 0.3)',
                              borderRadius: '6px',
                              color: '#70452A',
                              cursor: 'pointer',
                              fontWeight: 500
                            }}
                          >
                            ↺ Reset
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SECTION 6: PROJECTS / ARCHITECTURAL APPLICATIONS */}
        {/* ======================================================== */}
        {selectedSection === 'projects' && (() => {
          // Helper to count photos per category
          const getCategoryCount = (catName) => {
            if (catName === 'ALL') return activeProjects.length;
            return activeProjects.filter((item) => {
              const cat = (item.cat || item.category || '').toUpperCase();
              const target = catName.toUpperCase();
              return cat === target || (Array.isArray(item.legend) && item.legend.some((l) => String(l).toUpperCase() === target));
            }).length;
          };

          const activeCatValue = selectedProjectCat === 'ALL' ? 'RESIDENTIAL' : selectedProjectCat;
          const activeGroup = APPLICATION_GROUPS.find((g) => g.category.toUpperCase() === selectedProjectCat.toUpperCase());
          const activeCatTitle = selectedProjectCat === 'ALL'
            ? 'All Project Categories'
            : `${selectedProjectCat} Projects`;
          const activeCatItems = activeGroup
            ? activeGroup.items.join(', ')
            : 'All architectural areas';

          // Filter displayed projects for active category tab
          const displayedProjects = selectedProjectCat === 'ALL'
            ? activeProjects
            : activeProjects.filter((item) => {
                const cat = (item.cat || item.category || '').toUpperCase();
                const target = selectedProjectCat.toUpperCase();
                return cat === target || (Array.isArray(item.legend) && item.legend.some((l) => String(l).toUpperCase() === target));
              });

          return (
            <div>
              {/* Category Subnav Selector (Residential, Commercial, Exterior, All) */}
              <div className="admin-category-subnav">
                {APPLICATION_GROUPS.map((group) => {
                  const catUpper = group.category.toUpperCase();
                  const count = getCategoryCount(catUpper);
                  const isActive = selectedProjectCat === catUpper;
                  return (
                    <button
                      key={group.category}
                      type="button"
                      className={`admin-subnav-btn ${isActive ? 'active' : ''}`}
                      onClick={() => setSelectedProjectCat(catUpper)}
                    >
                      <span>{group.category}</span>
                      <small style={{
                        background: isActive ? 'rgba(112, 69, 42, 0.12)' : 'rgba(0, 0, 0, 0.08)',
                        padding: '2px 7px',
                        borderRadius: '999px',
                        fontSize: '11px',
                        fontWeight: 600
                      }}>
                        {count}
                      </small>
                    </button>
                  );
                })}
                <button
                  type="button"
                  className={`admin-subnav-btn ${selectedProjectCat === 'ALL' ? 'active' : ''}`}
                  onClick={() => setSelectedProjectCat('ALL')}
                >
                  <span>All Categories</span>
                  <small style={{
                    background: selectedProjectCat === 'ALL' ? 'rgba(112, 69, 42, 0.12)' : 'rgba(0, 0, 0, 0.08)',
                    padding: '2px 7px',
                    borderRadius: '999px',
                    fontSize: '11px',
                    fontWeight: 600
                  }}>
                    {activeProjects.length}
                  </small>
                </button>
              </div>

              {/* Category Header & Upload Action */}
              <div className="admin-gallery-header">
                <div>
                  <h3 style={{ fontFamily: 'var(--serif)', fontSize: '22px', color: '#241811', margin: '0 0 6px' }}>
                    {activeCatTitle} ({displayedProjects.length} Photos)
                  </h3>
                  <p style={{ color: '#75665A', fontSize: '14px', margin: 0 }}>
                    {selectedProjectCat === 'ALL'
                      ? 'Showing all architectural project photos across all categories.'
                      : `Manage photos displayed in the public "${selectedProjectCat}" horizontal scroll gallery (${activeCatItems}).`}
                  </p>
                </div>

                <label style={{
                  background: 'linear-gradient(135deg, #70452A 0%, #4D2D19 100%)',
                  color: '#F7F2E9',
                  border: '1px solid #C49A5A',
                  padding: '11px 20px',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '13.5px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(112, 69, 42, 0.25)'
                }}>
                  <span>+ Upload {selectedProjectCat === 'ALL' ? 'Residential' : selectedProjectCat} Photos</span>
                  <input
                    type="file"
                    multiple
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    disabled={isProcessing}
                    style={{ display: 'none' }}
                    onChange={(e) => handleFilesSelected(e, 'projects_gallery', activeCatValue)}
                  />
                </label>
              </div>

              {/* Grid of Projects or Empty Placeholder Message */}
              <div className="admin-gallery-grid">
                {displayedProjects.length === 0 ? (
                  <div style={{
                    gridColumn: '1 / -1',
                    background: '#FFFFFF',
                    padding: '44px 24px',
                    textAlign: 'center',
                    borderRadius: '8px',
                    border: '1px dashed rgba(185, 130, 74, 0.35)'
                  }}>
                    <p style={{ color: '#241811', fontSize: '16px', fontWeight: 600, margin: '0 0 8px' }}>
                      No custom photographs uploaded for {activeCatTitle} yet.
                    </p>
                    <p style={{ color: '#75665A', fontSize: '13.5px', maxWidth: '600px', margin: '0 auto 20px' }}>
                      The public website is currently displaying the default architectural placeholder cards ({activeCatItems}). Uploading photos here will dynamically display your custom work in the public Projects section.
                    </p>
                    <label style={{
                      background: '#70452A',
                      color: '#F7F2E9',
                      padding: '10px 20px',
                      borderRadius: '6px',
                      fontSize: '13.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-block'
                    }}>
                      + Select {selectedProjectCat === 'ALL' ? 'Residential' : selectedProjectCat} Photos to Upload
                      <input
                        type="file"
                        multiple
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        style={{ display: 'none' }}
                        onChange={(e) => handleFilesSelected(e, 'projects_gallery', activeCatValue)}
                      />
                    </label>
                  </div>
                ) : (
                  displayedProjects.map((item) => {
                    const img = item.image || item.src;
                    const label = item.label || item.title || 'Architectural Project';
                    const categoryTag = (item.cat || item.category || 'PROJECT').toUpperCase();
                    const legend = Array.isArray(item.legend)
                      ? item.legend.join(' · ')
                      : (item.legend || 'Architectural Application');

                    return (
                      <div key={item.id} className="admin-gallery-card">
                        <div className="admin-gallery-thumb">
                          <img
                            src={img}
                            alt={label}
                            onError={(e) => {
                              e.target.src = '/images/showcase/wall-panels.jpg';
                            }}
                          />
                        </div>

                        <div className="admin-gallery-info">
                          <span className="admin-gallery-cat">{categoryTag} PROJECT</span>
                          <span className="admin-gallery-title">{label}</span>
                          <span style={{ fontSize: '11.5px', color: '#8A7A6D' }}>{legend}</span>
                        </div>

                        <div className="admin-gallery-actions">
                          <label style={{
                            fontSize: '12px',
                            color: '#70452A',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            📁 Replace
                            <input
                              type="file"
                              accept="image/png, image/jpeg, image/jpg, image/webp"
                              style={{ display: 'none' }}
                              disabled={isProcessing}
                              onChange={(e) => {
                                if (e.target.files?.[0]) {
                                  handleReplaceGalleryPhoto('projects_gallery', item.id, e.target.files[0]);
                                }
                              }}
                            />
                          </label>

                          <button
                            type="button"
                            disabled={isProcessing}
                            onClick={() => handleDeleteGalleryPhoto('projects_gallery', item.id, label)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#C0604A',
                              fontSize: '12px',
                              cursor: 'pointer',
                              fontWeight: 500
                            }}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })()}
      </main>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="admin-toast">
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
