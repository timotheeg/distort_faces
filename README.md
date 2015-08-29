# distort_faces
This is a javascript and html5 implementation of one of my old flash pseudo fish-eye distortion effect. 

I know it's very juvenile, but boy do I get a kick and laughters out of distorting faces of my family members, friends, and colleagues :D . I hope you enjoy it too :D


## Features
* tunables to allow control over the effects (radius, scale, scale easing)
* 100% client-side code, including "upload" and "download"
* primitive multi-blob support (keyboard-controlled, works as long as the blob do not overlap)


## Demo

Play with [the demo](timotheegroleau.com/fun/distort_faces/) with 3 sample pics of my kids and I to get you started.


## How it works?

The algorithm is not based on some fancy pixel manipulation, but on a naive "intuitive" implementation instead.

The effect works by drawing concentric circles with diminishing radii on top of each other. In each circle, the pic is drawn again at a different scale. All the pics are drawn centered on the same point, relative to their scale.
The circles are decreasing by one pixels at each layer, but the scale the image is drawn at is controlled by an easing function.
The easing funcion that give the best results are typically ```linear```, ```swing```, ```easeInSine```.

## Sample results



