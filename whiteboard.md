# WHITEBOARD
You should leave more messages for yourself, dude

(vaguely prioritized)

+ Make bullets stay alive when their owner die (but cleverly)
+ Handle player life & death
+ Start screen
+ Different level
+ More enemy types
+ UI class for player life bar
+ Enemy types described by JSON files
+ I should write a tileanimation library for EXPLOSIONS


# Old stuff
+ I added a reference to the global PhysicsManager to every entity (lol)
+ This seemed great but it does not work.
+ Apparently the bullets are not registered in the physics manager.
+ Ok so they are but they do not have a 'size' so the collision function assumes zero size. duh.
+ changed 'basesize' to 'size' and now it works. yeah

+ How do I make bullet and ennemy disappear based on physics events?
+ I want to make an event queue thing with the observer pattern
+ I did the event queue but no observer (YAGNI).
