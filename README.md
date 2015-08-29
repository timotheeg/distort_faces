# Distort Faces
This is a javascript and html5 implementation of one of my old flash pseudo fish-eye distortion effect. 

I know it's very juvenile, but boy do I get a kick and laughters out of distorting faces of my family members, friends, and colleagues :D . I hope you enjoy it too :D


## Features
* Awesome distortion effect that look smooth. It fools your brain so good that if stare t a pic long enough, the original image will feel distorted after a while. Haha!
* tunables to allow control over the effects (radius, scale, scale easing)
* 100% client-side code, including "upload" and "download"
* primitive multi-blob support (keyboard-controlled, works as long as the blob do not overlap)


## Demo

Play with [the demo](timotheegroleau.com/fun/distort_faces/) with 3 sample pics of my kids and I to get you started.


## How it works?

The algorithm is not based on some fancy pixel manipulation, but on a naive "intuitive" implementation instead.

The effect works by drawing concentric circles with diminishing radii on top of each other. In each circle, the pic is drawn again at a different scale. All the pics are drawn centered on the same point, relative to their scale.
The circles are decreasing by one pixels at each layer, but the scale the image is drawn at is controlled by an easing function.

The easing funcion that give the best results are  ```linear```, ```swing```, ```easeInSine```.

## Sample results

![Timothee](/img/sample_results/timothee.jpg?raw=true)
![Celestine](/img/sample_results/celestine.jpg?raw=true)
![Tristan](/img/sample_results/tristan.jpg?raw=true)
![Dinesh](/img/sample_results/dinesh.jpg?raw=true)


## Built with:
* [HTML5 boilerplate](https://html5boilerplate.com/) for the project skeleton
* [jquery](https://jquery.com/) for some minor dom manipulation
* [jquery-ui](https://jqueryui.com/) for the slider
* [Penner's easing equations](http://robertpenner.com/easing/) (jquery-ui's implementation) for the scale easing effects
 

## Licence

This is distributed under the MIT licence, as follow:

```
Copyright (c) 2015 Timothee Groleau

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
