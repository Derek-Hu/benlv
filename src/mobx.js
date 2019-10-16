console.log({
  "actions": [
    {
      "action": "review",
      "module": "handlebars",
      "resolves": [
        {
          "id": 755,
          "path": "egg-bin>nyc>istanbul-reports>handlebars",
          "dev": true,
          "optional": false,
          "bundled": true
        },
        {
          "id": 1164,
          "path": "egg-bin>nyc>istanbul-reports>handlebars",
          "dev": true,
          "optional": false,
          "bundled": true
        }
      ]
    },
    {
      "action": "review",
      "module": "lodash",
      "resolves": [
        {
          "id": 1065,
          "path": "egg-bin>nyc>istanbul-reports>handlebars>async>lodash",
          "dev": true,
          "optional": false,
          "bundled": true
        }
      ]
    }
  ],
  "advisories": {
    "755": {
      "findings": [
        {
          "version": "4.1.0",
          "paths": [
            "egg-bin>nyc>istanbul-reports>handlebars"
          ]
        }
      ],
      "id": 755,
      "created": "2018-12-28T20:34:57.708Z",
      "updated": "2019-09-16T15:12:18.445Z",
      "deleted": null,
      "title": "Prototype Pollution",
      "found_by": {
        "link": "",
        "name": "Mahmoud Gamal, Matías Lang"
      },
      "reported_by": {
        "link": "",
        "name": "Mahmoud Gamal, Matías Lang"
      },
      "module_name": "handlebars",
      "cves": [],
      "vulnerable_versions": "<=4.0.13 || >=4.1.0 <4.1.2",
      "patched_versions": ">=4.0.14 <4.1.0 || >=4.1.2",
      "overview": "Versions of `handlebars` prior to 4.0.14 are vulnerable to Prototype Pollution. Templates may alter an Objects' prototype, thus allowing an attacker to execute arbitrary code on the server.",
      "recommendation": "For handlebars 4.1.x upgrade to 4.1.2 or later.\nFor handlebars 4.0.x upgrade to 4.0.14 or later.",
      "references": "",
      "access": "public",
      "severity": "critical",
      "cwe": "CWE-471",
      "metadata": {
        "module_type": "",
        "exploitability": 6,
        "affected_components": ""
      },
      "url": "https://npmjs.com/advisories/755"
    },
    "1065": {
      "findings": [
        {
          "version": "4.17.11",
          "paths": [
            "egg-bin>nyc>istanbul-reports>handlebars>async>lodash"
          ]
        }
      ],
      "id": 1065,
      "created": "2019-07-15T17:22:56.990Z",
      "updated": "2019-07-15T17:25:05.721Z",
      "deleted": null,
      "title": "Prototype Pollution",
      "found_by": {
        "link": "",
        "name": "Snyk Security Team"
      },
      "reported_by": {
        "link": "",
        "name": "Snyk Security Team"
      },
      "module_name": "lodash",
      "cves": [
        "CVE-2019-10744"
      ],
      "vulnerable_versions": "<4.17.12",
      "patched_versions": ">=4.17.12",
      "overview": "Versions of `lodash` before 4.17.12 are vulnerable to Prototype Pollution.  The function `defaultsDeep` allows a malicious user to modify the prototype of `Object` via `{constructor: {prototype: {...}}}` causing the addition or modification of an existing property that will exist on all objects.\n\n",
      "recommendation": "Update to version 4.17.12 or later.",
      "references": "- [Snyk Advisory](https://snyk.io/vuln/SNYK-JS-LODASH-450202)",
      "access": "public",
      "severity": "high",
      "cwe": "CWE-471",
      "metadata": {
        "module_type": "",
        "exploitability": 3,
        "affected_components": ""
      },
      "url": "https://npmjs.com/advisories/1065"
    },
    "1164": {
      "findings": [
        {
          "version": "4.1.0",
          "paths": [
            "egg-bin>nyc>istanbul-reports>handlebars"
          ]
        }
      ],
      "id": 1164,
      "created": "2019-09-16T15:14:43.509Z",
      "updated": "2019-09-25T18:17:35.480Z",
      "deleted": null,
      "title": "Prototype Pollution",
      "found_by": {
        "link": "",
        "name": "itszn"
      },
      "reported_by": {
        "link": "",
        "name": "itszn"
      },
      "module_name": "handlebars",
      "cves": [],
      "vulnerable_versions": "<4.3.0",
      "patched_versions": ">=4.3.0",
      "overview": "Versions of `handlebars` prior to are vulnerable to Prototype Pollution leading to Remote Code Execution. Templates may alter an Objects' `__proto__` and `__defineGetter__` properties, which may allow an attacker to execute arbitrary code through crafted payloads.",
      "recommendation": "Upgrade to version 4.3.0 or later.",
      "references": "",
      "access": "public",
      "severity": "high",
      "cwe": "CWE-471",
      "metadata": {
        "module_type": "",
        "exploitability": 6,
        "affected_components": ""
      },
      "url": "https://npmjs.com/advisories/1164"
    }
  },
  "muted": [],
  "metadata": {
    "vulnerabilities": {
      "info": 0,
      "low": 0,
      "moderate": 0,
      "high": 2,
      "critical": 1
    },
    "dependencies": 4464,
    "devDependencies": 16210,
    "optionalDependencies": 306,
    "totalDependencies": 20772
  },
  "runId": "fc709d7b-7c17-4f25-9bf5-9106bfd99d92"
});