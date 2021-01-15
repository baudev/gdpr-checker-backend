![banner](banner.png)

This repository contains the code of a backend trying to identify the sites respecting the GDPR or not.
An instance of this server is available at https://gdpr-checker.herokuapp.com/ 

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
   "isCompleted":true,
   "report":{
      "domain":"google.com",
      "uuid":"c8158760-3eba-4b4f-9bae-03186cab005f",
      "createdAt":"2021-01-01T00:00:00.000Z",
      "updatedAt":"2021-01-01T00:00:00.000Z",
      "urls":[
         {
            "path":"google.com",
            "isHttps":true,
            "cookies":[
               {
                  "name":"NID",
                  "domain":"google.com",
                  "type":"Marketing",
                  "IP":"74.125.193.113",
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
