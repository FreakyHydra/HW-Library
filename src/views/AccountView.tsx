import { CheckCircle2, LogOut, ShieldAlert } from 'lucide-react';
import { useEffect, useState } from 'react';
import { discordLoginPath, useAuth } from '../auth/AuthContext';
import { UserAvatar } from '../components/UserAvatar';

export function AccountView() {
  const { user, loading, updateDisplayName, logout } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  useEffect(() => setDisplayName(user?.displayName ?? ''), [user]);

  if (loading) return <div className="page"><div className="account-panel">Opening your profile...</div></div>;
  if (!user) return (
    <div className="page account-page"><section className="account-panel account-panel--signed-out"><span className="eyebrow">Your Orbis identity</span><h1>Sign in with Discord</h1><p>Your Discord account establishes permanent ownership of everything you create.</p><a className="button button--discord" href={discordLoginPath('/account')}>Continue with Discord</a></section></div>
  );

  const save = async (event: React.FormEvent) => {
    event.preventDefault(); setSaving(true); setMessage('');
    try { await updateDisplayName(displayName); setMessage('Display name saved.'); }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Could not save your name.'); }
    finally { setSaving(false); }
  };

  return (
    <div className="page account-page">
      <section className="account-panel">
        <div className="account-identity"><UserAvatar user={user} size={72} /><div><span className="eyebrow">Signed in through Discord</span><h1>{user.displayName}</h1><p>@{user.discordUsername}</p></div></div>
        <form className="profile-form" onSubmit={save}><label htmlFor="display-name">Orbis display name</label><div><input id="display-name" value={displayName} minLength={2} maxLength={40} onChange={(event) => setDisplayName(event.target.value)} /><button className="button button--primary" disabled={saving || displayName.trim() === user.displayName}>{saving ? 'Saving...' : 'Save name'}</button></div><small>This changes the author name shown on all your creations. Ownership stays tied to your Discord ID.</small>{message && <p className="form-message" role="status">{message}</p>}</form>
        <div className="permission-card">
          {user.permissions.canCreate ? <CheckCircle2 /> : <ShieldAlert />}
          <div><strong>{user.permissions.canCreate ? 'Verified creator' : 'Safe browsing access'}</strong><p>{user.permissions.canCreate ? 'You can view adult records and create or edit your own work.' : 'You can browse SFW records. Restricted cards lead to the verification guide.'}</p></div>
        </div>
        <button className="button button--ghost" onClick={() => void logout()}><LogOut size={16} /> Sign out</button>
      </section>
    </div>
  );
}
