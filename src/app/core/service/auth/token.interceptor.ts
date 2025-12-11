import { HttpInterceptorFn } from '@angular/common/http';

// Interceptor to add JWT token to request headers
export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` },
    });
  }
  return next(req);
};
