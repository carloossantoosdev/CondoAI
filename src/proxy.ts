import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permitir acesso público aos arquivos PWA sem qualquer autenticação
  if (
    pathname === '/manifest.json' ||
    pathname === '/sw.js' ||
    pathname.startsWith('/icon-') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/manifest.json',
    '/sw.js',
    '/icon-:path*',
    '/((?!_next/static|_next/image|api/).*)',
  ],
};

