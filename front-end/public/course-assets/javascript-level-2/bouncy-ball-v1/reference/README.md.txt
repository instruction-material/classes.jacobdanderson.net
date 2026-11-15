# The Bouncy Ball

Open index.html without a server. The 480-by-320 canvas starts with a green ball at(240,290),radius 15,dx2 anddy-5. Each 10 ms tick applies gravity 0.08,then moves by velocity,handles collisions and draws. Damping is 0.8;stopSpeed is 0.1. Complete updateBall in the supplied drawing framework.

A center stays within x 15..465 and y 15..305. After movement,clamp an outward-moving ball to the crossed wall and reverse the perpendicular velocity,multiplying by 0.8. At the floor also multiply dx by 0.8. Positive dy moves downward. A top hit also loses speed,as the original assignment requires for every wall.

When the new floor rebound magnitude is below 0.1,set dy=0 and grounded=true. A grounded ball stays at y305,receives no gravity and loses horizontal speed by 0.8 per tick. When its horizontal magnitude is below 0.1,set dx=dy=0 and resting=true. Return immediately on future resting ticks. This stable ground/rest state prevents gravity from restarting a stopped ball.

The original reference applies gravity after its zero-velocity condition and omits top-wall damping. This implementation preserves the initial canvas,green ball,velocities,gravity and damping while making update order,bounds and stable rest explicit.

Show an ascent,a damped rebound,the floor and eventual rest. CASES.md gives exact next-state checks and changed-speed boundary cases. Keyboard controls and scoring are optional extensions.
