# Find admin - try known emails from the users list
$BASE = "http://localhost:8000/api"
$json = @{ "Content-Type" = "application/json" }

# First get the existing user token to list users
$body = '{"email":"admin@gmail.com","password":"password1234"}'
try {
    $r = Invoke-WebRequest -Uri "$BASE/auth/login" -Method POST -Headers $json -Body $body -UseBasicParsing
    $token = ($r.Content | ConvertFrom-Json).data
    $auth = @{ "Content-Type" = "application/json"; "Authorization" = "Bearer $token" }
    
    # Try to get users (may fail with 403 if MAHASISWA)
    try {
        $r2 = Invoke-WebRequest -Uri "$BASE/users" -Method GET -Headers $auth -UseBasicParsing
        Write-Host $r2.Content
    } catch {
        Write-Host "Cannot list users (403). Need to find admin manually."
    }
} catch {
    Write-Host "Login failed"
}

# Let's check using the roles route if there is one
try {
    $r = Invoke-WebRequest -Uri "$BASE/roles" -Method GET -Headers $auth -UseBasicParsing
    Write-Host "Roles: $($r.Content)"
} catch {
    Write-Host "No roles endpoint or 403"
}
