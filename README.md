# calgary_hacks_2019 - Second Place Winners
https://devpost.com/software/calgary_hacks_2019

Topic: Best Artificial Intelligence/IoT Sustainable (Smart) Cities
## Contributors
<ul>
<li>Brandon Goberdhansingh</li>
<li>Komal Waseem</li>
<li>Konrad Wisniewski</li>
<li>Lawrence Nguyen</li>
<li>Michael Hoang</li>
</ul>

## The Problem
Given the critical importance of
safety and security in cities, find a
way that utilize innovations in
AI/IoT to improve public safety
and urban security (safety and
security)
## Background
In the case of missing persons, a city will often try to get assistance from the general population. One way that they involve the population is by sending out an amber alert to cell phones. We have seen in recent times that many people were unhappy with amber alerts and found them unhelpful and actually quite startling. Our aim was to help locate missing persons on a city-wide basis without alarming citizens. 
## Solution
Our plan was to deploy active facial recognition abilities to already existing passive surveillance cameras with the intent to locate missing persons. We figured that a city would already have video surveillance all over so if the cameras were constantly cross-referencing faces that it encounters then once a missing person's face is detected, police could be notified with the time and location.
## How we built it
To act as a "surveillance camera", we took advantage of any computer webcam or smartphone camera for the sake of demonstration. For the facial recognition, we leveraged Microsoft's Face API which can use computer vision to match faces against a custom database.

Our project consisted of two primary components: the photo uploader and the surveillance camera. These were built with React JS. The uploader is a mobile-friendly user interface that allows people to upload a photo of the missing person and enter other details such as name, last seen date, and an email for the notification. We used Firebase to host the photos. Microsoft Face API is then trained with this data. 

For demos, we had the camera take a screenshot of the current frame every x amount of time and then send the screenshot to the Face API. The Face API searches for faces in the photo and tries to match it with its training data. If there is a match above a certain confidence threshold then we alert on screen that _person name_ has been found at _current time_.
## Challenges
The hackathon was 24 hours so we felt rushed a lot of the time, hoping that we can deliver a working prototype at the end of it all. Microsoft Face API also rate-limited us, so we were only able to take a screenshot of the current camera frame every 10 seconds which was not ideal for real-time detection.
## What we learned
It is incredibly important to have a solid story and use cases flushed out before any development happens. This made the requirements very clear to us and we were then able to develop faster, and with fewer setbacks. 
