import { Navigate, useParams } from 'react-router-dom';

export function PublicUploadPage() {
  const { slug } = useParams();

  if (!slug) {
    return <Navigate to="/" replace />;
  }

  return <Navigate to={`/e/${slug}#upload`} replace />;
}