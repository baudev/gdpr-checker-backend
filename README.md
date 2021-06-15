![banner](banner.png)

This repository contains the code of a backend trying to identify the sites respecting the GDPR or not.
An instance of this server is available at https://gdpr-checker.herokuapp.com/ 


<div style="text-align:center"></div>
<p align="center">
    <img src="https://user-images.githubusercontent.com/29781702/122070676-7562f300-cdf6-11eb-970f-7f286393e510.png" height="500px" /><br>
    <b>An interface demo is available at https://baudev.github.io/gdpr-checker-frontend/</b>
</p>


## Installation

- Install dependencies

``` 
npm install
```

- Edit the `.env` file. Do not forget to specify database credentials.

- Run using `npm start:dev` or `npm start:prod`

- Open https://localhost:8080

## How to use it?

- **/report**  
*Method:* POST  
*Param:* domain (string). E.g `https://www.google.com`. The URL of the website to analyze.  
*Description:* Returns the related identifier of the requested domain.  
*Returns:*  
```json
{
    "domain": "www.google.com",
    "uuid": "9960b336-3cbd-4261-ba61-fb1f4d502f19",
    "updatedAt": "2021-01-01T00:00:00.000Z"
}
```  

- **/report/:uuid**  
*Method:* GET  
*Param:* `uuid` (string). The uuid retrieved by the previous route.  
*Description:* Returns an `EventStream` containing GDPR related information concerning the website.  
*Returns:*
```json
{
   "percentage":100,
   "report":{
      "domain":"google.com",
      "uuid":"c69d4eae-6e5b-45d6-8a79-6f5ac3cbfb73",
      "createdAt":"2021-01-15T21:48:53.260Z",
      "updatedAt":"2021-01-16T11:22:27.085Z",
      "urls":[
         {
            "path":"google.com",
            "isHttps":true,
            "cookies":[
               {
                  "name":"NID",
                  "domain":"google.com",
                  "provider":"Google",
                  "type":"Marketing",
                  "description":"This cookies is used to collect website statistics and track conversion rates and Google ad personalisation",
                  "retentionPeriod":"1 year",
                  "termsLink":"https://privacy.google.com/take-control.html",
                  "IP":"74.125.193.139",
                  "countryCodeIso":"US",
                  "hasAdequateLevelOfProtection":false,
                  "country":"United States"
               }
            ]
         }
      ]
   }
}
```

## TODO
- [X] Create a release (with master branch, database migrations...)
- [ ] Clean the code
- [ ] Write tests
- [ ] Implement more complex logic to detect non GDPR compliant websites
- [ ] Scan several urls for each domain

## CREDITS

<div>Icons made by <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">Smashicons</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>

## LICENSE

```
MIT License  
  
Copyright (c) 2021 Baudev.  
  
Permission is hereby granted, free of charge, to any person obtaining a copy  
of this software and associated documentation files (the "Software"), to deal  
in the Software without restriction, including without limitation the rights  
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell  
copies of the Software, and to permit persons to whom the Software is  
furnished to do so, subject to the following conditions:  
  
The above copyright notice and this permission notice shall be included in all  
copies or substantial portions of the Software.  
  
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR  
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,  
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE  
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER  
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,  
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE  
SOFTWARE.
```
