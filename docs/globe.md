Looking at your admin dashboard, I think you're building your **own analytics system**, not relying on Google Analytics. If your only goal is:

> **"Show from which country (or city) visitors accessed my website."**

then you **don't need a paid API or a complicated setup**.

## Architecture I'd recommend

```text
Visitor
    │
    ▼
Website
    │
    ▼
Get Visitor IP
    │
    ▼
GeoIP Database
    │
    ▼
Country
City
Latitude
Longitude
ASN
ISP
Timezone
    │
    ▼
Save to Database
    │
    ▼
Analytics Dashboard
```

---

# Free Solution (Recommended)

## 1. Get the Visitor's IP

Backend examples:

```php
$_SERVER['REMOTE_ADDR']
```

or if using Cloudflare

```php
$_SERVER['HTTP_CF_CONNECTING_IP']
```

---

## 2. Convert IP → Country

Use **MaxMind GeoLite2**.

Advantages:

* ✅ Completely free
* ✅ Works offline
* ✅ No API calls
* ✅ No rate limits
* ✅ Commercial use allowed under MaxMind's license (requires free account and periodic database updates)

It provides:

```
Country
State
City
Latitude
Longitude
Timezone
```

---

## 3. Store only what you need

Example table

```sql
visitor_logs

id
ip
country
country_code
city
latitude
longitude
visited_page
browser
device
created_at
```

---

## 4. Show a 3D Globe

Then read the data

```
India

28.61
77.20
```

Pass it to Globe.gl

```javascript
[
 {
   lat:28.61,
   lng:77.20,
   size:0.5,
   color:"orange"
 }
]
```

It automatically displays a glowing marker.

---

# If a new visitor comes

Suppose someone visits from

```
Germany
```

Your database gets

```
Germany

Berlin

52.52

13.40
```

Your globe instantly adds

```
● Germany
```

If someone visits from

```
Japan
```

```
● Japan
```

And so on.

---

# Even better

Instead of only points

Create animated arcs

```
Germany
      \
       \
        \
         India(Server)
```

Every visitor creates one animated arc.

It looks very premium.

---

# For your dashboard

I would replace the **Top Countries** table with a globe.

Current:

```
Top Countries

India
USA
Germany
```

Suggested:

```
        🌍

      ● Germany

             \
              \
               \
                ● India(Server)

      ● USA
```

And below it:

```
Today's Visitors : 125

Countries : 18

Cities : 64
```

---

# Libraries (All Free)

| Library          | Purpose           | License                     |
| ---------------- | ----------------- | --------------------------- |
| Three.js         | 3D rendering      | MIT                         |
| Globe.gl         | Interactive globe | MIT                         |
| GSAP             | Animations        | Free for most website uses  |
| MaxMind GeoLite2 | IP → Location     | Free (with account/updates) |
| Socket.IO        | Live updates      | MIT                         |

**Total cost:** **₹0**

---

## My suggestion for your project

Since you're already building a custom admin panel, I'd make the analytics page much richer than just "Top Countries":

* 🌍 **Interactive 3D globe** in the center.
* 🟢 Live glowing markers for current visitors.
* ✈️ Animated arcs from visitor location to your server (or nearest server).
* 📊 Side cards showing visitors today, countries reached, top pages, and active users.
* 🔍 Clicking a country filters the table below to show cities, pages visited, browser, device, and visit time.

It would give your analytics dashboard a polished, enterprise feel while still being entirely based on free, open-source technologies.
