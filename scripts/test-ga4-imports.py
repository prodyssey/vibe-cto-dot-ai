#!/usr/bin/env python3
"""Test if GA4 imports are working correctly"""

import sys
import subprocess

print("🔍 Testing GA4 imports...\n")

# Check Python version
print(f"Python executable: {sys.executable}")
print(f"Python version: {sys.version}")
print(f"Python path: {sys.path[:3]}...\n")

# Try importing each package
packages = [
    ('google.analytics.admin', 'AnalyticsAdminServiceClient'),
    ('google.auth', 'default'),
    ('google_auth_oauthlib.flow', 'InstalledAppFlow'),
    ('google.auth.transport.requests', 'Request'),
]

success_count = 0
for module_name, attr_name in packages:
    try:
        module = __import__(module_name, fromlist=[attr_name])
        attr = getattr(module, attr_name)
        print(f"✅ {module_name}.{attr_name}")
        success_count += 1
    except ImportError as e:
        print(f"❌ {module_name}: {e}")

print(f"\n{success_count}/{len(packages)} imports successful")

if success_count < len(packages):
    print("\n📦 Installing missing packages...")
    subprocess.check_call([sys.executable, '-m', 'pip', 'install', '-r', 'requirements-ga4.txt'])
    print("\n✅ Packages installed! Please run the setup script again.")