interface Env {
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  ALLOWED_DOMAINS: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';
    
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const allowedDomains = env.ALLOWED_DOMAINS.split(',').map(d => d.trim());
    const isAllowed = allowedDomains.some(domain => 
      origin.includes(domain) || url.hostname.includes(domain)
    );

    if (!isAllowed && origin) {
      return new Response('Unauthorized origin', { 
        status: 403,
        headers: corsHeaders 
      });
    }

    if (url.pathname === '/auth') {
      const provider = url.searchParams.get('provider');
      if (provider !== 'github') {
        return new Response('Unsupported provider', { 
          status: 400,
          headers: corsHeaders 
        });
      }

      const redirectUri = `${url.origin}/callback`;
      const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');
      githubAuthUrl.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
      githubAuthUrl.searchParams.set('redirect_uri', redirectUri);
      githubAuthUrl.searchParams.set('scope', 'repo,user');
      githubAuthUrl.searchParams.set('state', crypto.randomUUID());

      return Response.redirect(githubAuthUrl.toString(), 302);
    }

    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');
      if (!code) {
        return new Response('Missing code parameter', { 
          status: 400,
          headers: corsHeaders 
        });
      }

      const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code: code,
        }),
      });

      const responseText = await tokenResponse.text();
      const tokenData = JSON.parse(responseText);
      
      if (tokenData.error) {
        return new Response(`GitHub OAuth error: ${tokenData.error_description}`, { 
          status: 400,
          headers: corsHeaders 
        });
      }

      const userResponse = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
          'Accept': 'application/json',
        },
      });

      // const userData = await userResponse.json() as any;

      const successHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Authorization Success</title>
          <script>
            (function() {
              function postAuthMessage() {
                if (window.opener) {
                  // Decap CMS expects this exact format
                  const token = '${tokenData.access_token}';
                  
                  // Send authorizing message first
                  window.opener.postMessage('authorizing:github', '*');
                  
                  // Then send success with token
                  window.opener.postMessage(
                    'authorization:github:success:' + JSON.stringify({ token: token }),
                    '*'
                  );
                  
                  setTimeout(() => window.close(), 1000);
                } else {
                  document.getElementById('token').textContent = '${tokenData.access_token}';
                }
              }
              
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', postAuthMessage);
              } else {
                postAuthMessage();
              }
            })();
          </script>
        </head>
        <body>
          <h1>Authorization Successful!</h1>
          <p>You can close this window.</p>
          <p>Token: <code id="token">Loading...</code></p>
        </body>
        </html>
      `;

      return new Response(successHtml, {
        headers: {
          'Content-Type': 'text/html',
          ...corsHeaders,
        },
      });
    }

    if (url.pathname === '/api') {
      if (request.method !== 'POST') {
        return new Response('Method not allowed', { 
          status: 405,
          headers: corsHeaders 
        });
      }

      const authHeader = request.headers.get('Authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new Response('Missing authorization header', { 
          status: 401,
          headers: corsHeaders 
        });
      }

      const token = authHeader.substring(7);
      const body = await request.json() as any;

      const githubResponse = await fetch(`https://api.github.com${body.url}`, {
        method: body.method || 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...(body.headers || {}),
        },
        body: body.body ? JSON.stringify(body.body) : undefined,
      });

      const responseData = await githubResponse.text();
      
      return new Response(responseData, {
        status: githubResponse.status,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }

    return new Response('Not found', { 
      status: 404,
      headers: corsHeaders 
    });
  },
};