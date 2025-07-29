# Secure GA4 Setup Guide

This guide explains how to set up Google Analytics 4 automation scripts securely using environment variables instead of hardcoded credentials.

## Security Best Practices

🔒 **Never commit credentials to version control**
- Use environment variables for all secrets
- Store tokens in user home directory, not project directory
- Use `.gitignore` to exclude any credential files

## Setup Methods

### Method 1: Environment Variables (Recommended)

1. **Set OAuth2 credentials as environment variables:**
   ```bash
   export GA4_CLIENT_ID='your-client-id-here'
   export GA4_CLIENT_SECRET='your-client-secret-here'
   export GA4_PROPERTY_ID='your-property-id-here'
   ```

2. **Optional: Set custom token storage location:**
   ```bash
   export GA4_TOKEN_PATH="$HOME/.ga4/token.json"
   ```

3. **Run the setup script:**
   ```bash
   python setup-ga4-secure.py --auth
   ```

### Method 2: Credentials File Path

1. **Store credentials file securely outside the project:**
   ```bash
   # Store in home directory
   mv credentials.json ~/.ga4/credentials.json
   
   # Set environment variable
   export GA4_CREDENTIALS_JSON="$HOME/.ga4/credentials.json"
   export GA4_PROPERTY_ID='your-property-id-here'
   ```

2. **Run the setup:**
   ```bash
   python setup-ga4-secure.py --auth
   ```

### Method 3: Service Account (for automation)

1. **Set service account path:**
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account.json"
   export GA4_PROPERTY_ID='your-property-id-here'
   ```

2. **Run the setup:**
   ```bash
   python setup-ga4-secure.py
   ```

## Creating Environment File

Generate an example `.env` file:
```bash
python setup-ga4-secure.py --create-env-example
```

This creates `.env.ga4.example` which you can copy and fill in:
```bash
cp .env.ga4.example .env
# Edit .env with your credentials
```

## Using with dotenv (Optional)

If you prefer using a `.env` file:

1. **Install python-dotenv:**
   ```bash
   pip install python-dotenv
   ```

2. **Add to the script:**
   ```python
   from dotenv import load_dotenv
   load_dotenv()
   ```

3. **Create `.env` file:**
   ```
   GA4_CLIENT_ID=your-client-id
   GA4_CLIENT_SECRET=your-client-secret
   GA4_PROPERTY_ID=your-property-id
   ```

## Token Storage

OAuth tokens are stored in:
- Default: `~/.ga4/token.json`
- Custom: Set `GA4_TOKEN_PATH` environment variable

## Running the Setup

1. **Activate virtual environment:**
   ```bash
   cd scripts
   source ga4-venv/bin/activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements-ga4.txt
   ```

3. **Run secure setup:**
   ```bash
   python setup-ga4-secure.py --auth
   ```

## Migration from Old Scripts

If you were using the old scripts with hardcoded credentials:

1. **Get your credentials from the old files**
2. **Set them as environment variables**
3. **Delete the old credential files:**
   ```bash
   rm -f credentials.json token.json
   ```
4. **Use the new secure script**

## Troubleshooting

- **"No GA4 credentials found!"** - Check that environment variables are set
- **"Token file not found"** - Normal on first run, will be created after auth
- **Import errors** - Make sure you're in the virtual environment

## Security Checklist

- [ ] No `credentials.json` in project directory
- [ ] No `token.json` in project directory  
- [ ] Environment variables set for credentials
- [ ] `.gitignore` includes credential patterns
- [ ] Token stored in user home directory
- [ ] Never log or print credentials