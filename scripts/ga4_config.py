"""
GA4 Configuration Module - Secure credential management
"""
import os
import json
import sys
from pathlib import Path


def get_oauth_credentials():
    """
    Get OAuth2 credentials from environment variables or file.
    
    Priority:
    1. Environment variables (GA4_CLIENT_ID, GA4_CLIENT_SECRET, GA4_REFRESH_TOKEN)
    2. GA4_CREDENTIALS_JSON environment variable (path to credentials file)
    3. credentials.json file in current directory (with warning)
    """
    # Check for individual environment variables
    client_id = os.getenv('GA4_CLIENT_ID')
    client_secret = os.getenv('GA4_CLIENT_SECRET')
    
    if client_id and client_secret:
        credentials = {
            "installed": {
                "client_id": client_id,
                "client_secret": client_secret,
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
                "redirect_uris": ["http://localhost"]
            }
        }
        return credentials
    
    # Check for credentials file path in environment
    creds_path = os.getenv('GA4_CREDENTIALS_JSON')
    if creds_path and os.path.exists(creds_path):
        with open(creds_path, 'r') as f:
            return json.load(f)
    
    # Fall back to local file with warning
    local_creds = Path('credentials.json')
    if local_creds.exists():
        print("⚠️  WARNING: Using local credentials.json file. This is not recommended for production!")
        print("   Set GA4_CLIENT_ID and GA4_CLIENT_SECRET environment variables instead.")
        with open(local_creds, 'r') as f:
            return json.load(f)
    
    # No credentials found
    print("\n❌ No GA4 credentials found!")
    print("\n📝 To fix this, use one of these methods:")
    print("\n1. Set environment variables (recommended):")
    print("   export GA4_CLIENT_ID='your-client-id'")
    print("   export GA4_CLIENT_SECRET='your-client-secret'")
    print("\n2. Set path to credentials file:")
    print("   export GA4_CREDENTIALS_JSON='/path/to/credentials.json'")
    print("\n3. For service account authentication:")
    print("   export GOOGLE_APPLICATION_CREDENTIALS='/path/to/service-account.json'")
    sys.exit(1)


def get_token_path():
    """
    Get path for storing OAuth2 token.
    Uses GA4_TOKEN_PATH environment variable or defaults to ~/.ga4/token.json
    """
    token_path = os.getenv('GA4_TOKEN_PATH')
    if token_path:
        return Path(token_path)
    
    # Default to user's home directory
    default_path = Path.home() / '.ga4' / 'token.json'
    default_path.parent.mkdir(parents=True, exist_ok=True)
    return default_path


def save_credentials_to_env_example():
    """
    Create an example .env file for GA4 credentials
    """
    env_example = """# Google Analytics 4 Credentials
# 
# Option 1: OAuth2 Credentials (for user authentication)
GA4_CLIENT_ID=your-client-id-here
GA4_CLIENT_SECRET=your-client-secret-here

# Option 2: Path to downloaded credentials JSON
# GA4_CREDENTIALS_JSON=/path/to/credentials.json

# Option 3: Service Account (for server-to-server auth)
# GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json

# Optional: Custom token storage location
# GA4_TOKEN_PATH=/path/to/token.json

# GA4 Property ID
GA4_PROPERTY_ID=your-property-id-here
"""
    
    with open('.env.ga4.example', 'w') as f:
        f.write(env_example)
    
    print("✅ Created .env.ga4.example file")
    print("   Copy this to .env and fill in your credentials")


if __name__ == '__main__':
    # Create example env file if run directly
    save_credentials_to_env_example()