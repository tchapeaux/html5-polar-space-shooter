# WHITEBOARD
You should leave more messages for yourself, dude

(vaguely prioritized)

+ Handle player life & death
+ Resource loading with progress bar
+ Different levels
+ More enemy types
+ UI class for player life bar
+ Enemy types and levels described by JSON files
+ EXPLOSIONS


# Old stuff
+ I added a reference to the global PhysicsManager to every entity (lol)
+ This seemed great but it does not work.
+ Apparently the bullets are not registered in the physics manager.
+ Ok so they are but they do not have a 'size' so the collision function assumes zero size. duh.
+ changed 'basesize' to 'size' and now it works. yeah

+ How do I make bullet and ennemy disappear based on physics events?
+ I want to make an event queue thing with the observer pattern
+ I did the event queue but no observer (YAGNI).
