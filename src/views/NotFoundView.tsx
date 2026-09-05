import { Link } from 'react-router-dom';

export function NotFoundView() {
  return <div className="page not-found"><span>404</span><h1>This shelf does not exist.</h1><p>The trail ends here, but the Library is still close.</p><Link className="button button--primary" to="/">Return to the Library</Link></div>;
}
