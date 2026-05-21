$BASE = "http://localhost:8000/api"

function Do-Req {
    param($Label, $Method, $Uri, [hashtable]$Headers, $Body)
    Write-Host ""
    Write-Host "===== $Label =====" -ForegroundColor Cyan
    try {
        $params = @{ Uri = $Uri; Method = $Method; Headers = $Headers; UseBasicParsing = $true }
        if ($Body) { $params["Body"] = $Body }
        $res = Invoke-WebRequest @params
        Write-Host "  Status: $($res.StatusCode)" -ForegroundColor Green
        $content = $res.Content
        if ($content.Length -gt 600) { $content = $content.Substring(0, 600) + "..." }
        Write-Host "  $content"
        return @{ Content = $res.Content; Code = $res.StatusCode; OK = $true }
    } catch {
        $code = 0
        $errBody = ""
        if ($_.Exception.Response) {
            $code = [int]$_.Exception.Response.StatusCode
            try {
                $sr = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
                $errBody = $sr.ReadToEnd()
                $sr.Close()
            } catch {}
        }
        if (-not $errBody) { $errBody = $_.Exception.Message }
        Write-Host "  Status: $code" -ForegroundColor Red
        Write-Host "  $errBody"
        return @{ Content = $errBody; Code = $code; OK = $false }
    }
}

$json = @{ "Content-Type" = "application/json" }

# 1. Register
$ts = Get-Date -Format "HHmmss"
$r = Do-Req "1. AUTH Register" "POST" "$BASE/auth/register" $json ('{"email":"tester'+$ts+'@test.com","name":"Tester '+$ts+'","nim":"99'+$ts+'","password":"password123","passwordConfirmation":"password123"}')

# 2. Login as MAHASISWA
$r = Do-Req "2. AUTH Login (MAHASISWA)" "POST" "$BASE/auth/login" $json ('{"email":"tester'+$ts+'@test.com","password":"password123"}')
$data = $r.Content | ConvertFrom-Json
$userToken = $data.data
$userAuth = @{ "Content-Type" = "application/json"; "Authorization" = "Bearer $userToken" }
Write-Host "  >> MAHASISWA token obtained" -ForegroundColor Yellow

# 3. Login as ADMIN
$r = Do-Req "3. Try ADMIN Login" "POST" "$BASE/auth/login" $json '{"email":"admin@gmail.com","password":"password1234"}'
if ($r.OK) {
    $d = $r.Content | ConvertFrom-Json
    $adminToken = $d.data
    Write-Host "  >> ADMIN token obtained!" -ForegroundColor Green
} else {
    Write-Host "`n>> Admin login failed!" -ForegroundColor Red
    exit 1
}
$adminAuth = @{ "Content-Type" = "application/json"; "Authorization" = "Bearer $adminToken" }

# 4. Buildings - Get All
$r = Do-Req "4. BUILDINGS Get All" "GET" "$BASE/buildings" $adminAuth

# 5. Buildings - Create
$r = Do-Req "5. BUILDINGS Create" "POST" "$BASE/buildings" $adminAuth '{"name":"Gedung Teknik Baru '+$ts+'"}'
$bid = ""
if ($r.OK) { $bid = ($r.Content | ConvertFrom-Json).data.id; Write-Host "  >> Building ID: $bid" -ForegroundColor Yellow }

# 6. Buildings - Get by ID
if ($bid) { $r = Do-Req "6. BUILDINGS Get by ID" "GET" "$BASE/buildings/$bid" $adminAuth }

# 7. Buildings - Update
if ($bid) { $r = Do-Req "7. BUILDINGS Update" "PUT" "$BASE/buildings/$bid" $adminAuth '{"name":"Gedung Teknik Updated '+$ts+'"}' }

# 8. Rooms - Create
$rid = ""
if ($bid) {
    $r = Do-Req "8. ROOMS Create" "POST" "$BASE/rooms" $adminAuth ('{"name":"Lab Komputer A '+$ts+'","buildingId":"'+$bid+'","floor":2}')
    if ($r.OK) { $rid = ($r.Content | ConvertFrom-Json).data.id; Write-Host "  >> Room ID: $rid" -ForegroundColor Yellow }
}

# 9. Rooms - Get All
$r = Do-Req "9. ROOMS Get All" "GET" "$BASE/rooms" $adminAuth

# 10. Rooms - Get by ID
if ($rid) { $r = Do-Req "10. ROOMS Get by ID" "GET" "$BASE/rooms/$rid" $adminAuth }

# 11. Rooms - Update
if ($rid) { $r = Do-Req "11. ROOMS Update" "PUT" "$BASE/rooms/$rid" $adminAuth ('{"name":"Lab Komputer B '+$ts+'","floor":3}') }

# 12. Categories - Get All
$r = Do-Req "12. CATEGORIES Get All" "GET" "$BASE/categories" $adminAuth
$catId = ""
if ($r.OK) {
    $cats = ($r.Content | ConvertFrom-Json).data
    if ($cats -and $cats.Count -gt 0) { $catId = $cats[0].id; Write-Host "  >> Category ID: $catId" -ForegroundColor Yellow }
}

# 13. Reports - Create #1
$repId = ""
if ($rid -and $catId) {
    $r = Do-Req "13. REPORTS Create #1" "POST" "$BASE/reports" $userAuth ('{"roomId":"'+$rid+'","description":"Lampu mati total di lab","categoryId":"'+$catId+'","isUrgent":false}')
    if ($r.OK) { $repId = ($r.Content | ConvertFrom-Json).data[0].id; Write-Host "  >> Report 1 ID: $repId" -ForegroundColor Yellow }
}

# 14. Reports - Create #2
$repId2 = ""
if ($rid -and $catId) {
    $r = Do-Req "14. REPORTS Create #2" "POST" "$BASE/reports" $userAuth ('{"roomId":"'+$rid+'","description":"AC tidak dingin","categoryId":"'+$catId+'","isUrgent":true}')
    if ($r.OK) { $repId2 = ($r.Content | ConvertFrom-Json).data[0].id; Write-Host "  >> Report 2 ID: $repId2" -ForegroundColor Yellow }
}

# 15. Reports - Get All
$r = Do-Req "15. REPORTS Get All" "GET" "$BASE/reports" $userAuth

# 16. Reports - Get by ID
if ($repId) { $r = Do-Req "16. REPORTS Get by ID" "GET" "$BASE/reports/$repId" $userAuth }

# 17. Reports - Update (PATCH)
if ($repId) { $r = Do-Req "17. REPORTS Update" "PATCH" "$BASE/reports/$repId" $adminAuth '{"status":"IN_PROGRESS","description":"Sedang diperbaiki teknisi"}' }

# 18. Reports - Dashboard
$r = Do-Req "18. REPORTS Dashboard" "GET" "$BASE/reports/dashboard" $adminAuth

# 19. Reports - Export CSV (all)
$r = Do-Req "19. REPORTS Export CSV (all)" "GET" "$BASE/reports/export/csv" $adminAuth

# 20. Reports - Export CSV (filtered)
$mo = (Get-Date).Month
$yr = (Get-Date).Year
$r = Do-Req "20. REPORTS Export CSV (month=$mo year=$yr)" "GET" "$BASE/reports/export/csv?month=$mo&year=$yr" $adminAuth

# 21. Reports - Export CSV (invalid)
$r = Do-Req "21. REPORTS Export CSV (invalid month=13)" "GET" "$BASE/reports/export/csv?month=13" $adminAuth

# 22. Reports - Delete
if ($repId2) { $r = Do-Req "22. REPORTS Delete" "DELETE" "$BASE/reports/$repId2" $adminAuth }

# 23. Dashboard after delete
$r = Do-Req "23. REPORTS Dashboard (post-delete)" "GET" "$BASE/reports/dashboard" $adminAuth

# 24. Change Password
$r = Do-Req "24. AUTH Change Password" "PUT" "$BASE/auth/change-password" $userAuth '{"oldPassword":"password123","newPassword":"newpass12345","passwordConfirmation":"newpass12345"}'

# 25. Users - Get All
$r = Do-Req "25. USERS Get All" "GET" "$BASE/users" $adminAuth

# Cleanup
if ($repId) { $r = Do-Req "26. Cleanup: Delete report 1" "DELETE" "$BASE/reports/$repId" $adminAuth }
if ($rid) { $r = Do-Req "27. Cleanup: Delete room" "DELETE" "$BASE/rooms/$rid" $adminAuth }
if ($bid) { $r = Do-Req "28. Cleanup: Delete building" "DELETE" "$BASE/buildings/$bid" $adminAuth }

Write-Host "`n========== ALL TESTS COMPLETED ==========" -ForegroundColor Green
