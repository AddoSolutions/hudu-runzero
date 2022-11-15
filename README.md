# Hudu / RunZero Sync (Plus some Datto Stuff)

This is a pretty simple little Dockerfile that will sync your RunZero assets to Hudu.

It does some smart stuff like check for existing mac/IP addresses in existing devices.


## Getting Started

1. Add this to your env file, should look like this:

```env
HUDU_URL=https://hudu.mydomain.com/api/v1
HUDU_KEY=xLXXXXXxxXXXxxXXXxxXXXdX

RUNZERO_KEY=CTXXXXXXXXXXXXXXXXXXXXXXXX

# This runs daily at 2AM
CRON_SCHEDULE=0 2 * * *
```

2. Setup your device type map, call it `deviceTypeMap.js`

```javascript
module.exports = [
    {id:1, options:["Server", "Hypervisor","Desktop","Laptop"]},
    {id:8, options: ["Router","Switch","Firewall","NAS","Network Management Device","WAP","Ubiquiti Device"]},
    {id:5, options: ["Printer","Print Server","Multifunction Device"]},
    {id:10, options: ["UPS"]},
    {id:11, options: ["IP Camera"]},
    {id:12, options: ["IP Phone"]},
]
```

* `id` is the numeric ID of the asset layout
* `options` is an array of the RunZero device type names you want the program to put the appropriate assets into.
* In this example, `Server, Hypervisor, Desktop, Laptop` RunZero device types will connect to the `Computer` asset layout (id: `1`)


3. For each asset layout, you need to ensure you have the following attributes on an EACH assset layout your connect above:
```text
IP Address (Text) 
MAC Address (Text) 
Switch (AssetTag) # Links to Network Devices in my case 
Switch Port (Text) 
User (AssetTag) # Connects to people, only if you have datto sync
Make (Text) 
Model (Text) 
Hostname (Text) 
Last Seen Active (Date)  
Mac Age (Date) 
RunZero Data (RichText) 
RunZero ID (Text) 
```

4. Setup your Dockerfile by adding this to your hudu docker-compose file

```yaml
hudurunzero:
  image: addosolutions/hudu-runzero
  volumes:
    - ./.env:/app/.env
    - ./cache:/app/lib/tasks/cache
    - ./deviceTypeMap.js:/app/deviceTypeMap.js
  restart: unless-stopped
```

5. You need to create 

6. Run it with `docker-compose up -d`



## FAQ

### How does it know how to asociate the companies?

By name, make sure the names of the companies are the same in RunZero and Hudu, and it'll figure out the rest