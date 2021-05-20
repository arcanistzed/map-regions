# Map Regions

A tool to create the JSON for Map Regions for use on [5eTools](https://5e.tools).

# Usage

* Install (see below) or visit the [GitHub pages](https://arcanistzed.github.io/map-regions)
* Enter URL for map image in the textbox
* Start creating your first region by clicking to create points
* Once you've finished, enter the area name in the prompt
* Click `New` to start a new region
* Click `Export` to get the JSON

## Automation

* Click `Prefix` and enter a value that you would like prepended to all area names
* Click `Increment` and enter an integer that you would like the value that comes after the prefix to increment by. Then, enter the initial value. Setting this to anything besides zero will disable the prompt after each new area is created.

# Installation

* Clone the GitHub repository
* Navigate to the directory that you cloned it in
* Type `npm install` to install dependencies
* Type `npm start` to start a local webserver or `npm run build` to build
