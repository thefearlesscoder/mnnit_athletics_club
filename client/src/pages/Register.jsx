import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MemberRegisterForm from '../components/MemberRegisterForm';
import NormalUserRegisterForm from '../components/NormalUserRegisterForm';

const Register = () => {
  const [role, setRole] = useState('normal user');

  return (
    <div className="page-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem', width: '100%', maxWidth: '400px' }}>
        <button
          type="button"
          onClick={() => setRole('normal user')}
          style={{
            background: role === 'normal user' ? 'var(--accent-primary)' : 'transparent',
            color: role === 'normal user' ? 'white' : 'var(--text-primary)',
            border: role === 'normal user' ? 'none' : '1px solid rgba(0,0,0,0.2)',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            cursor: 'pointer',
            transition: 'all 0.3s',
            flex: 1
          }}
        >
          Normal User
        </button>
        <button
          type="button"
          onClick={() => setRole('member')}
          style={{
            background: role === 'member' ? 'var(--accent-primary)' : 'transparent',
            color: role === 'member' ? 'white' : 'var(--text-primary)',
            border: role === 'member' ? 'none' : '1px solid rgba(0,0,0,0.2)',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            cursor: 'pointer',
            transition: 'all 0.3s',
            flex: 1
          }}
        >
          Member
        </button>
      </div>

      <motion.div
        key={role}
        initial={{ opacity: 0, x: role === 'member' ? 20 : -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        style={{ width: '100%' }}
      >
        {role === 'normal user' ? <NormalUserRegisterForm /> : <MemberRegisterForm />}
      </motion.div>
    </div>
  );
};

export default Register;
