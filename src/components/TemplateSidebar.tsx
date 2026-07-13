// src/components/TemplateSidebar.tsx

import type { FC } from 'react';
import type { FormSchema } from '../types/schema';

export interface Template {
  id: string;
  name: string;
  icon: string;
  desc: string;
  schema: FormSchema;
}

export const TEMPLATES: Template[] = [
  {
    id: 'login',
    name: 'Login',
    icon: '🔐',
    desc: 'Email + password',
    schema: {
      title: 'Sign In',
      submitLabel: 'Sign In',
      fields: [
        {
          id: 'email',
          label: 'Email',
          type: 'email',
          placeholder: 'you@example.com',
          validation: { required: true },
        },
        {
          id: 'password',
          label: 'Password',
          type: 'password',
          placeholder: '••••••••',
          validation: {
            required: true,
            minLength: 8,
            message: 'Minimum 8 characters',
          },
        },
      ],
    },
  },
  {
    id: 'registration',
    name: 'Registration',
    icon: '👤',
    desc: 'Full sign-up form',
    schema: {
      title: 'Create Account',
      submitLabel: 'Create Account',
      fields: [
        {
          id: 'full_name',
          label: 'Full Name',
          type: 'text',
          placeholder: 'John Doe',
          validation: { required: true },
        },
        {
          id: 'email',
          label: 'Email',
          type: 'email',
          placeholder: 'you@example.com',
          validation: { required: true },
        },
        {
          id: 'password',
          label: 'Password',
          type: 'password',
          validation: { required: true, minLength: 8 },
        },
        {
          id: 'phone',
          label: 'Phone',
          type: 'text',
          placeholder: '+91 98765 43210',
        },
        {
          id: 'gender',
          label: 'Gender',
          type: 'radio',
          options: [
            { label: 'Male', value: 'male' },
            { label: 'Female', value: 'female' },
            { label: 'Other', value: 'other' },
          ],
        },
        {
          id: 'terms',
          label: 'I agree to the Terms & Conditions',
          type: 'checkbox',
          validation: { required: true, message: 'You must accept the terms' },
        },
      ],
    },
  },
  {
    id: 'contact',
    name: 'Contact Us',
    icon: '✉️',
    desc: 'Name, email, message',
    schema: {
      title: 'Get in Touch',
      submitLabel: 'Send Message',
      fields: [
        {
          id: 'name',
          label: 'Name',
          type: 'text',
          placeholder: 'Your name',
          validation: { required: true },
        },
        {
          id: 'email',
          label: 'Email',
          type: 'email',
          placeholder: 'you@example.com',
          validation: { required: true },
        },
        {
          id: 'subject',
          label: 'Subject',
          type: 'select',
          options: [
            { label: 'General Inquiry', value: 'general' },
            { label: 'Technical Support', value: 'support' },
            { label: 'Billing', value: 'billing' },
            { label: 'Other', value: 'other' },
          ],
          validation: { required: true },
        },
        {
          id: 'message',
          label: 'Message',
          type: 'textarea',
          placeholder: 'How can we help?',
          validation: {
            required: true,
            minLength: 20,
            message: 'Please write at least 20 characters',
          },
        },
      ],
    },
  },
  {
    id: 'feedback',
    name: 'Feedback',
    icon: '⭐',
    desc: 'Rating + comments',
    schema: {
      title: 'Share Feedback',
      submitLabel: 'Submit Feedback',
      fields: [
        {
          id: 'rating',
          label: 'Overall Rating',
          type: 'select',
          options: [
            { label: '⭐ Poor', value: '1' },
            { label: '⭐⭐ Fair', value: '2' },
            { label: '⭐⭐⭐ Good', value: '3' },
            { label: '⭐⭐⭐⭐ Very Good', value: '4' },
            { label: '⭐⭐⭐⭐⭐ Excellent', value: '5' },
          ],
          validation: { required: true },
        },
        {
          id: 'recommend',
          label: 'Would you recommend us?',
          type: 'radio',
          options: [
            { label: 'Yes, definitely', value: 'yes' },
            { label: 'Maybe', value: 'maybe' },
            { label: 'No', value: 'no' },
          ],
        },
        {
          id: 'comments',
          label: 'Additional Comments',
          type: 'textarea',
          placeholder: 'Tell us more...',
        },
      ],
    },
  },
  {
    id: 'job',
    name: 'Job Application',
    icon: '💼',
    desc: 'Professional application',
    schema: {
      title: 'Apply for Position',
      submitLabel: 'Submit Application',
      fields: [
        {
          id: 'name',
          label: 'Full Name',
          type: 'text',
          validation: { required: true },
        },
        {
          id: 'email',
          label: 'Email',
          type: 'email',
          validation: { required: true },
        },
        {
          id: 'phone',
          label: 'Phone Number',
          type: 'text',
          validation: { required: true },
        },
        {
          id: 'position',
          label: 'Position',
          type: 'select',
          options: [
            { label: 'Frontend Developer', value: 'frontend' },
            { label: 'Backend Developer', value: 'backend' },
            { label: 'Full Stack Developer', value: 'fullstack' },
            { label: 'DevOps Engineer', value: 'devops' },
          ],
          validation: { required: true },
        },
        {
          id: 'experience',
          label: 'Years of Experience',
          type: 'number',
          validation: { required: true, min: 0, max: 50 },
        },
        {
          id: 'cover',
          label: 'Cover Letter',
          type: 'textarea',
          placeholder: 'Tell us about yourself...',
          validation: {
            required: true,
            minLength: 100,
            message: 'Please write at least 100 characters',
          },
        },
      ],
    },
  },
  {
    id: 'profile',
    name: 'Profile Update',
    icon: '⚙️',
    desc: 'Edit account details',
    schema: {
      title: 'Update Profile',
      submitLabel: 'Save Changes',
      fields: [
        {
          id: 'display_name',
          label: 'Display Name',
          type: 'text',
          validation: { required: true },
        },
        {
          id: 'bio',
          label: 'Short Bio',
          type: 'textarea',
          placeholder: 'A short bio about you...',
        },
        {
          id: 'website',
          label: 'Website URL',
          type: 'text',
          placeholder: 'https://yoursite.com',
        },
        {
          id: 'country',
          label: 'Country',
          type: 'select',
          options: [
            { label: 'India', value: 'IN' },
            { label: 'United States', value: 'US' },
            { label: 'United Kingdom', value: 'GB' },
            { label: 'Germany', value: 'DE' },
            { label: 'Canada', value: 'CA' },
          ],
        },
        {
          id: 'newsletter',
          label: 'Subscribe to newsletter',
          type: 'checkbox',
        },
      ],
    },
  },
  {
    id: 'password_reset',
    name: 'Password Reset',
    icon: '🔑',
    desc: 'Email-based reset',
    schema: {
      title: 'Reset Password',
      submitLabel: 'Send Reset Link',
      fields: [
        {
          id: 'email',
          label: 'Registered Email',
          type: 'email',
          placeholder: 'Enter your account email',
          validation: { required: true },
        },
      ],
    },
  },
  {
    id: 'event',
    name: 'Event Registration',
    icon: '🎟️',
    desc: 'Conference signup',
    schema: {
      title: 'Event Registration',
      submitLabel: 'Register Now',
      fields: [
        {
          id: 'name',
          label: 'Full Name',
          type: 'text',
          validation: { required: true },
        },
        {
          id: 'email',
          label: 'Email',
          type: 'email',
          validation: { required: true },
        },
        {
          id: 'ticket',
          label: 'Ticket Type',
          type: 'radio',
          options: [
            { label: 'General — Free', value: 'general' },
            { label: 'Pro — ₹999', value: 'pro' },
            { label: 'VIP — ₹2,499', value: 'vip' },
          ],
          validation: { required: true },
        },
        {
          id: 'dietary',
          label: 'Dietary Requirements',
          type: 'select',
          options: [
            { label: 'None', value: 'none' },
            { label: 'Vegetarian', value: 'vegetarian' },
            { label: 'Vegan', value: 'vegan' },
            { label: 'Gluten-Free', value: 'gluten_free' },
          ],
        },
        {
          id: 'attendees',
          label: 'Number of Attendees',
          type: 'number',
          validation: { required: true, min: 1, max: 10 },
        },
      ],
    },
  },
];

interface Props {
  onSelect: (template: Template) => void;
  activeId: string | null;
}

const TemplateSidebar: FC<Props> = ({ onSelect, activeId }) => {
  return (
    <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <p
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: '#4b5563',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          margin: '0 0 8px 4px',
        }}
      >
        Templates
      </p>

      {TEMPLATES.map((t) => {
        const active = activeId === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onSelect(t)}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 8,
              padding: '8px 10px',
              borderRadius: 8,
              textAlign: 'left',
              width: '100%',
              cursor: 'pointer',
              transition: 'all 0.15s',
              border: active
                ? '1px solid rgba(99,102,241,0.4)'
                : '1px solid transparent',
              background: active ? 'rgba(99,102,241,0.12)' : 'transparent',
              color: active ? '#a5b4fc' : '#9ca3af',
            }}
            onMouseEnter={(e) => {
              if (!active) {
                (e.currentTarget as HTMLButtonElement).style.background =
                  'rgba(255,255,255,0.04)';
                (e.currentTarget as HTMLButtonElement).style.color = '#e2e4f3';
              }
            }}
            onMouseLeave={(e) => {
              if (!active) {
                (e.currentTarget as HTMLButtonElement).style.background =
                  'transparent';
                (e.currentTarget as HTMLButtonElement).style.color = '#9ca3af';
              }
            }}
          >
            <span
              style={{
                fontSize: 14,
                lineHeight: 1,
                marginTop: 1,
                flexShrink: 0,
              }}
            >
              {t.icon}
            </span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.3 }}>
                {t.name}
              </div>
              <div
                style={{
                  fontSize: 11,
                  marginTop: 2,
                  color: active ? 'rgba(165,180,252,0.6)' : '#4b5563',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {t.desc}
              </div>
            </div>
          </button>
        );
      })}
    </nav>
  );
};

export default TemplateSidebar;
