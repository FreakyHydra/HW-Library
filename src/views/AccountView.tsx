import { CheckCircle2, LogOut, ShieldAlert } from 'lucide-react';
import { useEffect, useState } from 'react';
import { discordLoginPath, useAuth } from '../auth/AuthContext';
import { UserAvatar } from '../components/UserAvatar';
import { useI18n } from '../i18n/I18nContext';
import type { Locale } from '../i18n/translations';

export function AccountView() {
  const { user, loading, updateDisplayName, logout } = useAuth();
  const { locale, setLocale, t } = useI18n();
  const [displayName, setDisplayName] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  useEffect(() => setDisplayName(user?.displayName ?? ''), [user]);

  if (loading) return <div className="page"><div className="account-panel">{t('Opening your profile...')}</div></div>;
  if (!user) return (
    <div className="page account-page"><section className="account-panel account-panel--signed-out"><span className="eyebrow">{t('Your Coda identity')}</span><h1>{t('Sign in with Discord')}</h1><p>{t('Your Discord account establishes permanent ownership of everything you create.')}</p><a className="button button--discord" href={discordLoginPath('/account')}>{t('Continue with Discord')}</a></section></div>
  );

  const save = async (event: React.FormEvent) => {
    event.preventDefault(); setSaving(true); setMessage('');
    try { await updateDisplayName(displayName); setMessage(t('Display name saved.')); }
    catch (error) { setMessage(error instanceof Error ? error.message : t('Could not save your name.')); }
    finally { setSaving(false); }
  };

  return (
    <div className="page account-page">
      <section className="account-panel">
        <div className="account-identity"><UserAvatar user={user} size={72} /><div><span className="eyebrow">{t('Signed in through Discord')}</span><h1>{user.displayName}</h1><p>@{user.discordUsername}</p></div></div>
        <form className="profile-form" onSubmit={save}><label htmlFor="display-name">{t('Coda display name')}</label><div><input id="display-name" value={displayName} minLength={2} maxLength={40} onChange={(event) => setDisplayName(event.target.value)} /><button className="button button--primary" disabled={saving || displayName.trim() === user.displayName}>{saving ? t('Saving...') : t('Save name')}</button></div><small>{t('This changes the author name shown on all your creations. Ownership stays tied to your Discord ID.')}</small>{message && <p className="form-message" role="status">{message}</p>}</form>

        <div className="profile-form language-setting">
          <label htmlFor="interface-language">{t('Interface language')}</label>
          <div>
            <select id="interface-language" value={locale} onChange={(event) => setLocale(event.target.value as Locale)}>
              <option value="en">English</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
          <small>{t('The choice is saved on this device. User-authored worlds, characters and roleplay text are not translated automatically.')}</small>
        </div>

        <div className="permission-card">
          {user.permissions.canCreate ? <CheckCircle2 /> : <ShieldAlert />}
          <div><strong>{user.permissions.canCreate ? t('Verified creator') : t('Safe browsing access')}</strong><p>{user.permissions.canCreate ? t('You can view adult records and create or edit your own work.') : t('You can browse SFW records. Restricted cards lead to the verification guide.')}</p></div>
        </div>
        <button className="button button--ghost" onClick={() => void logout()}><LogOut size={16} /> {t('Sign out')}</button>
      </section>
    </div>
  );
}
