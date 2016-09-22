# WaterWaves.Me - an AngularJS & NodeJS & MongoDB apps

This project is based on angular-seed project, which provides a really heads-on code environment.
After hacking most parts of the angular-seed code, the prototype of my personal website has come
out.
Based on TDD, almost every module (node module for now) has a test file to guarantee the
reliability.
If interested, please feel free to visit my personal website: http://waterwaves.me


##Instruction:
* All log files from application are stored in the sibling directory of waterwaves-me/



## Done List
### Front-End
* Angular routing
* main page framework and sections control by ng-view
* navigation bar and fix-to-top feature
* dynamic footer with animation feature (with Service)
* responsible background image
* implemented with Twitter Bootstrap CSS lib
* using specific fonts for the entire website and social icons
* One sample blog
* Fix the footer behavior problem caused by AJAX-related body-resize issue
* enlarging effect of social icons when they are hovered
* profile page with my Resume (show)
* redirect the unknown url to 404 page
* add lifepieces page with AJAX while scrolling
* set cookies of username and password for admin panel
* build 404 page



### Back-End
* using Express.js as the framework of NodeJS
* deal with URLs from Angular appropriately
* implement MongoDB
* storing blogs in separated files while blog params (including comments) in MongoDB
* finish Twitter and LinkedIn API
* password crypto
* refactor the sendFile in utils/utils.js
* web interface for adding new writing, life pieces
* web interface for modifying new writing, life pieces



## TODO List
* refactor route system
* comment/message system (simple one)
* Resume download option
* dynamic profile page with time line
* instant message with social shares (LinkedIn, Google+)
* star / viewed function for blog page
* think about a better way store the blog
* make a interface for blog writing and saving (MAYBE)
* web interface for adding new blogs (with a good form format)
* ios app for web data access, add, modify
* how to maintain adding articles from both dev and prod ???????
* ...


## MongoDB
* only store indexes for blogs, writings, life-pieces
* store messages
* store comments for blogs



## Contact

* Shan He <sean.shanhe@gmail.com>
* LinkedIn, Twitter, Google+ are all available at http://waterwaves.me
* For more information on AngularJS please check out http://angularjs.org/
