SmallTalk
=========
SmallTalk, according to Wikipedia, is "an object-oriented, dynamically typed, reflective programming language". A rather succinct description for a language that brought object oriented programming into the mainstream.

What's so great about SmallTalk?
--------------------------------
SmallTalk is one of those languages that force you to think differently. One of the things that it is known for is having _everything_ be an object. Literally - the original SmallTalk implementation is implemented in SmallTalk.

What does SmallTalk code look like?
-----------------------------------
The canonical Hello World appears as follows:

    Transcript show:'Hello, world!'.

But that's not very interesting. How about something a little more complex? This is an example of selecting all values that are positive in an object:

    positive := amounts select: [:x | x isPositive]

Now, let's take a look at something you can't do in most other languages. By default, most SmallTalk implementations don't come with a Do-While loop. No problem, though; we can define our own:

    |val|
    x := 0.
    [
        x := x + 1.
        x displayNl.
        (x rem: 6) ~= 0
    ] whileTrue: [ ]

SmallTalk is simple, but incredibly powerful when one takes advantage of its capabilities.