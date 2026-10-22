import { useState } from 'react';
import { Navigate, useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';
export default function LoginPage(){
  const [username,setUsername]=useState(''); const [password,setPassword]=useState('');
  const [errors,setErrors]=useState({}); const [loading,setLoading]=useState(false); const [apiError,setApiError]=useState('');
  const {login,isAuthenticated}=useAuth(); const location=useLocation(); const navigate=useNavigate();
  const target=location.state?.from?`${location.state.from.pathname||'/'}${location.state.from.search||''}`:'/';
  if(isAuthenticated)return <Navigate to={target} replace/>;
  async function submit(e){e.preventDefault();const err={};if(!username.trim())err.username='Username is required.';if(!password)err.password='Password is required.';setErrors(err);setApiError('');if(Object.keys(err).length)return;setLoading(true);try{await login(username,password);navigate(target,{replace:true});}catch(error){setApiError(error.message);}finally{setLoading(false);}}
  return <main className="page auth-page"><form className="auth-card" onSubmit={submit} noValidate><span className="eyebrow">WELCOME BACK</span><h1>Sign in to <em>FreshBite</em></h1><p>Sign in to manage your cart and orders.</p>{apiError&&<p className="error-text" role="alert">{apiError}</p>}<Input label="Username *" name="username" value={username} onChange={e=>setUsername(e.target.value)} error={errors.username} autoComplete="username" placeholder="Enter API username"/><Input label="Password *" name="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} error={errors.password} autoComplete="current-password" placeholder="Enter password"/><Button type="submit" disabled={loading}>{loading?'Signing in…':'Sign in'}</Button><small className="demo-note">Uses the DummyJSON authentication API. A network connection is required.</small><Link to="/">Continue browsing</Link></form></main>
}
