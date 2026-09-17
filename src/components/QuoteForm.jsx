import React, { useState } from 'react';
import { submitQuote } from '../services/quoteService';

export function QuoteForm() {
  const initialFormState = {
    fname: '',
    fphone: '',
    femail: '',
    flocation: '',
    fservice: '',
    fmaterial: '',
    fptype: '',
    freq: '',
    fmsg: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileLabel, setFileLabel] = useState('Drag a file here or click to upload');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedInfo, setSubmittedInfo] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleCopyDetails = async () => {
    if (submittedInfo?.whatsappText && navigator.clipboard) {
      await navigator.clipboard.writeText(submittedInfo.whatsappText).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileLabel(file.name);
    } else {
      setSelectedFile(null);
      setFileLabel('Drag a file here or click to upload');
    }
  };

  const validate = () => {
    const newErrors = {};

    // 1. Full Name (Mandatory)
    if (!formData.fname || formData.fname.trim().length <= 1) {
      newErrors.fname = true;
    }

    // 2. Phone Number (Mandatory)
    const phoneRegex = /^[+]?[\d\s-]{7,15}$/;
    if (!formData.fphone || !phoneRegex.test(formData.fphone.trim())) {
      newErrors.fphone = true;
    }

    // 3. Email (OPTIONAL - only check format if provided)
    if (formData.femail && formData.femail.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.femail.trim())) {
        newErrors.femail = true;
      }
    }

    // 4. Location (Mandatory)
    if (!formData.flocation || formData.flocation.trim() === '') {
      newErrors.flocation = true;
    }

    // 5. Service Required (Mandatory)
    if (!formData.fservice || formData.fservice.trim() === '') {
      newErrors.fservice = true;
    }

    // 6. Material (Mandatory)
    if (!formData.fmaterial || formData.fmaterial.trim() === '') {
      newErrors.fmaterial = true;
    }

    // 7. Project Type (Mandatory)
    if (!formData.fptype || formData.fptype.trim() === '') {
      newErrors.fptype = true;
    }

    // 8. Approximate Requirements (Mandatory)
    if (!formData.freq || formData.freq.trim() === '') {
      newErrors.freq = true;
    }

    // 9. Message (Mandatory)
    if (!formData.fmsg || formData.fmsg.trim() === '') {
      newErrors.fmsg = true;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      setShowSuccess(false);
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        payload.append(key, val);
      });
      if (selectedFile) {
        payload.append('ffile', selectedFile);
      }

      // 1. Submit to backend API & database
      const result = await submitQuote(payload).catch((err) => {
        console.warn('Backend save notice:', err);
        return null;
      });

      let uploadedFileUrl = result?.data?.referenceFile?.fileUrl;

      // Direct client CDN upload fallback: guarantees Instant Direct Link is generated for WhatsApp
      if (!uploadedFileUrl && selectedFile) {
        if (selectedFile.type && selectedFile.type.startsWith('image/')) {
          try {
            const base64 = await new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                const res = reader.result;
                const base64Data = typeof res === 'string' ? res.split(',')[1] : null;
                resolve(base64Data);
              };
              reader.readAsDataURL(selectedFile);
            });

            if (base64) {
              const imgForm = new FormData();
              imgForm.append('key', '6d207e02198a847aa98d0a2a901485a5');
              imgForm.append('action', 'upload');
              imgForm.append('source', base64);
              imgForm.append('format', 'json');

              const imgRes = await fetch('https://freeimage.host/api/1/upload', {
                method: 'POST',
                body: imgForm,
                signal: AbortSignal.timeout(8000)
              });

              if (imgRes.ok) {
                const imgData = await imgRes.json();
                if (imgData?.image?.url) {
                  uploadedFileUrl = imgData.image.url;
                }
              }
            }
          } catch (uploadErr) {
            console.warn('Client upload fallback error:', uploadErr);
          }
        }

        // Document / general fallback
        if (!uploadedFileUrl) {
          try {
            const docForm = new FormData();
            docForm.append('file', selectedFile);
            const docRes = await fetch('https://tmpfiles.org/api/v1/upload', {
              method: 'POST',
              body: docForm,
              signal: AbortSignal.timeout(6000)
            });
            if (docRes.ok) {
              const docData = await docRes.json();
              if (docData?.data?.url) {
                uploadedFileUrl = docData.data.url.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
              }
            }
          } catch (docErr) {
            console.warn('Document upload fallback error:', docErr);
          }
        }
      }

      // 2. Format client typed details with executive layout & proper visual hierarchy
      const whatsappNumber = '919400544477';

      const fileSection = selectedFile ? [
        '📎 *DESIGN REFERENCE FILE*',
        `• *File Name:* ${selectedFile.name}`,
        uploadedFileUrl ? `• *Instant Direct Link:* ${uploadedFileUrl}` : null,
        ''
      ] : [];

      const messageLines = [
        '🏛️ *BLU CORE — NEW QUOTE ENQUIRY*',
        '━━━━━━━━━━━━━━━━━━━━━━━━━',
        '',
        '👤 *CLIENT CONTACT*',
        `• *Full Name:* ${formData.fname}`,
        `• *Phone:* ${formData.fphone}`,
        formData.femail ? `• *Email:* ${formData.femail}` : null,
        `• *Branch Location:* ${formData.flocation}`,
        '',
        '🛠️ *PROJECT SPECIFICATIONS*',
        `• *Service Required:* ${formData.fservice}`,
        `• *Material Choice:* ${formData.fmaterial}`,
        `• *Project Type:* ${formData.fptype}`,
        `• *Approx Scope / Size:* ${formData.freq}`,
        '',
        '💬 *CLIENT MESSAGE*',
        formData.fmsg,
        '',
        ...fileSection,
        '━━━━━━━━━━━━━━━━━━━━━━━━━',
        '_Submitted via BLU CORE Official Portal_'
      ].filter((line) => line !== null);

      const whatsappText = messageLines.join('\n');
      const encodedText = encodeURIComponent(whatsappText);
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedText}`;

      // 3. Auto-copy text to clipboard so it is immediately ready to paste if WhatsApp Web opens blank
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await navigator.clipboard.writeText(whatsappText);
        } catch (clipErr) {
          // ignore clipboard errors
        }
      }

      // 4. Save state for on-screen persistent action buttons
      setSubmittedInfo({
        whatsappUrl,
        whatsappText,
        uploadedFileUrl
      });

      // 5. Open WhatsApp directly
      window.open(whatsappUrl, '_blank');

      setShowSuccess(true);
      setFormData(initialFormState);
      setSelectedFile(null);
      setFileLabel('Drag a file here or click to upload');
      setErrors({});
    } catch (err) {
      console.error('Submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="reveal" id="quote" data-testid="quote-form">
      <div className="form-card">
        <h3>Request a Quote</h3>
        <p>Tell us about your project and we&apos;ll get back to you with the next steps.</p>

        <form id="quoteForm" noValidate onSubmit={handleSubmit}>
          <div className="frow">
            <div className={`field ${errors.fname ? 'err' : ''}`} data-req="true">
              <label htmlFor="fname">Full Name *</label>
              <input
                type="text"
                id="fname"
                name="fname"
                data-testid="quote-fname"
                placeholder="Your name"
                value={formData.fname}
                onChange={handleChange}
              />
              <span className="errmsg">Please enter your name.</span>
            </div>

            <div className={`field ${errors.fphone ? 'err' : ''}`} data-req="true">
              <label htmlFor="fphone">Phone Number *</label>
              <input
                type="tel"
                id="fphone"
                name="fphone"
                data-testid="quote-fphone"
                placeholder="+91 9xxxx xxxxx"
                value={formData.fphone}
                onChange={handleChange}
              />
              <span className="errmsg">Please enter a valid phone number.</span>
            </div>
          </div>

          <div className="frow">
            <div className={`field ${errors.femail ? 'err' : ''}`}>
              <label htmlFor="femail">Email (Optional)</label>
              <input
                type="email"
                id="femail"
                name="femail"
                data-testid="quote-femail"
                placeholder="you@email.com (optional)"
                value={formData.femail}
                onChange={handleChange}
              />
              <span className="errmsg">Please enter a valid email address.</span>
            </div>

            <div className={`field ${errors.flocation ? 'err' : ''}`} data-req="true">
              <label htmlFor="flocation">Location / Branch *</label>
              <select
                id="flocation"
                name="flocation"
                data-testid="quote-flocation"
                value={formData.flocation}
                onChange={handleChange}
              >
                <option value="">Select branch</option>
                <option value="Kanhangad">Kanhangad</option>
                <option value="Payyannur / Trikaripur">Payyannur / Trikaripur</option>
                <option value="Palakkunnu">Palakkunnu</option>
                <option value="Cherupuzha">Cherupuzha</option>
                <option value="Other">Other</option>
              </select>
              <span className="errmsg">Please select your location / branch.</span>
            </div>
          </div>

          <div className="frow">
            <div className={`field ${errors.fservice ? 'err' : ''}`} data-req="true">
              <label htmlFor="fservice">Service Required *</label>
              <select
                id="fservice"
                name="fservice"
                data-testid="quote-fservice"
                value={formData.fservice}
                onChange={handleChange}
              >
                <option value="">Select service</option>
                <option value="Wood Carving">Wood Carving</option>
                <option value="Door Design">Door Design</option>
                <option value="Staircase">Staircase</option>
                <option value="Wall Panels & Hanging">Wall Panels &amp; Hanging</option>
                <option value="Ceiling Design">Ceiling Design</option>
                <option value="Personalized Wooden Gifts">Personalized Wooden Gifts</option>
                <option value="Sign Boards">Sign Boards</option>
                <option value="Other">Other</option>
              </select>
              <span className="errmsg">Please select a service.</span>
            </div>

            <div className={`field ${errors.fmaterial ? 'err' : ''}`} data-req="true">
              <label htmlFor="fmaterial">Material *</label>
              <select
                id="fmaterial"
                name="fmaterial"
                data-testid="quote-fmaterial"
                value={formData.fmaterial}
                onChange={handleChange}
              >
                <option value="">Select material</option>
                <option value="Wood">Wood</option>
                <option value="Plywood">Plywood</option>
                <option value="MDF">MDF</option>
                <option value="HDF">HDF</option>
                <option value="Multiwood">Multiwood</option>
                <option value="WPC">WPC</option>
                <option value="Not sure yet">Not sure yet</option>
              </select>
              <span className="errmsg">Please select a material.</span>
            </div>
          </div>

          <div className="frow">
            <div className={`field ${errors.fptype ? 'err' : ''}`} data-req="true">
              <label htmlFor="fptype">Project Type *</label>
              <select
                id="fptype"
                name="fptype"
                data-testid="quote-fptype"
                value={formData.fptype}
                onChange={handleChange}
              >
                <option value="">Select type</option>
                <option value="Home / Residential">Home / Residential</option>
                <option value="Commercial Space">Commercial Space</option>
                <option value="Office">Office</option>
                <option value="Restaurant / Hospitality">Restaurant / Hospitality</option>
                <option value="Wedding / Event">Wedding / Event</option>
                <option value="Personal Gift">Personal Gift</option>
                <option value="Other">Other</option>
              </select>
              <span className="errmsg">Please select a project type.</span>
            </div>

            <div className={`field ${errors.freq ? 'err' : ''}`} data-req="true">
              <label htmlFor="freq">Approximate Requirements *</label>
              <input
                type="text"
                id="freq"
                name="freq"
                data-testid="quote-freq"
                placeholder="e.g. size, quantity, dimensions"
                value={formData.freq}
                onChange={handleChange}
              />
              <span className="errmsg">Please enter approximate requirements.</span>
            </div>
          </div>

          <div className="field">
            <label htmlFor="ffile">Upload Design / Reference Image (Optional)</label>
            <div className="file-drop">
              <input
                type="file"
                id="ffile"
                name="ffile"
                data-testid="quote-ffile"
                accept="image/*,.pdf"
                onChange={handleFileChange}
              />
              <span id="fileLabel">{fileLabel}</span>
            </div>
          </div>

          <div className={`field ${errors.fmsg ? 'err' : ''}`} data-req="true">
            <label htmlFor="fmsg">Message / Project Details *</label>
            <textarea
              id="fmsg"
              name="fmsg"
              data-testid="quote-fmsg"
              rows="4"
              placeholder="Tell us more about what you're picturing..."
              value={formData.fmsg}
              onChange={handleChange}
            ></textarea>
            <span className="errmsg">Please enter your project message or details.</span>
          </div>

          <div className="submit-row">
            <button
              type="submit"
              className="btn btn-gold"
              data-testid="quote-submit"
              style={{ width: '100%', justifyContent: 'center' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Request a Quote'}
            </button>
          </div>

          <div className={`success-msg ${showSuccess ? 'show' : ''}`} id="successMsg" data-testid="quote-success" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" style={{ width: '22px', height: '22px' }}>
                <circle cx="12" cy="12" r="9" />
                <path d="M8 12l3 3 5-6" />
              </svg>
              <strong style={{ color: 'var(--gold-light)', fontSize: '15px' }}>
                Quote Request Ready & Copied to Clipboard!
              </strong>
            </div>

            <p style={{ margin: '8px 0 14px', fontSize: '13px', color: '#e5e7eb', lineHeight: 1.5 }}>
              All client details have been automatically copied to your clipboard. If WhatsApp opens blank on your browser, simply press <strong>Paste (Ctrl+V)</strong>.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {submittedInfo?.whatsappUrl && (
                <a
                  href={submittedInfo.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-gold"
                  style={{ fontSize: '13px', padding: '9px 18px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  💬 Open WhatsApp Chat
                </a>
              )}

              <button
                type="button"
                className="btn btn-glass"
                onClick={handleCopyDetails}
                style={{ fontSize: '13px', padding: '9px 18px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                {copied ? '✅ Details Copied!' : '📋 Copy Details Again'}
              </button>

              {submittedInfo?.uploadedFileUrl && (
                <a
                  href={submittedInfo.uploadedFileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-glass"
                  style={{ fontSize: '13px', padding: '9px 18px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  📥 View / Download File
                </a>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default QuoteForm;
