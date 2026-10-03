/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import { SERVER_URL, SITE_ORIGIN } from "@/lib/config/env";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    let token = request.nextUrl.searchParams.get('token');
    if (!token) {
      let html = '<h1>Invalid Token</h1>';
      return new NextResponse(html, {
        headers: {
          'content--type': "text/html; charset=utf-8"
        }
      })
    };

    let res = await fetch(SERVER_URL + '/api/auth/Registration-verification/' + token, {
      method: 'POST',
      cache: 'no-cache'
    });

    if (res.ok) {
      return NextResponse.redirect(SITE_ORIGIN+'/login?registration_success=yes')
    } else {
      console.log(await res.json());
      let html = '<h1>Unknown Server Error, Registration Failed</h1>';
      return new NextResponse(html, {
        headers: {
          'content-type': "text/html; charset=utf-8"
        }
      })
    }
  } catch (error) {
    console.error(error);
    let html = '<h1>Unknown Server Error</h1>';
    return new NextResponse(html, {
      headers: {
        'content-type': "text/html; charset=utf-8"
      }
    })
  }
}
