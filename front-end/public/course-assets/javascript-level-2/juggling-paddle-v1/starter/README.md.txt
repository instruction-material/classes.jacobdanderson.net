# Juggling Paddle

Use the working keyboard paddle to bounce a falling ball. Complete updateBall
and paddleContactY in script.js. The starter supplies the preceding paddle project.

## Files and execution

Open index.html in a browser without a server. The site IDE runs the same files.
styles.css fits the logical 500-by-500 canvas to the available width.
Focus the canvas before holding Left or Right; a keyboard with arrow keys is needed.
CASES.md gives fixed movement and collision cases.

## Original game model

The black paddle starts at (200,300), measures 100 by 20 and moves 10 units/frame.
Its valid x range is 0 through 400. Both arrows cancel; release or focus loss stops it.
The red ball starts at (250,100), has radius 10 and moves vertically 1 unit/frame.
It keeps x=250. isFalling chooses down or up; the upward endpoint is center y=50.
This is fixed-speed animation: a hit turns the ball upward and the apex turns it down.
A miss continues below the canvas. Scoring, lives and automatic restart are optional
remixes rather than required behavior.

## Collision and update order

Use the actual rectangle and circle geometry. For a centered hit, contact occurs
when center y+radius equals paddle.y: 290+10=300.
For a rounded corner, clamp ball.x to the paddle's horizontal interval to get nearestX.
Set dx=ball.x-nearestX. If abs(dx)>radius, no contact is possible.
The circle boundary satisfies dx*dx+dy*dy=radius*radius. Its vertical reach is
sqrt(radius*radius-dx*dx), so contactY=paddle.y-sqrt(radius*radius-dx*dx).

During descent, bounce only when oldY<=contactY and nextY>=contactY.
Set y exactly to contactY and isFalling=false. This crossing check handles changed
speed and fractional contact positions. A ball already below the paddle keeps falling.
During ascent, clamp at ball.apex and turn downward when nextY<=ball.apex.
Update the paddle and ball before drawing their new state.

## Worked results and evidence

From y=289, one downward frame hits the centered paddle at y=290 and turns upward.
From y=50.5 while rising, the next frame reaches 50 and turns downward.
Move the paddle to x=0: the ball misses and eventually has y-radius>500.
CASES.md also covers changed radius, shifted paddle, corner contact and larger steps.

Show a hit, upward travel, return at y=50 and a miss that leaves the screen.
Explain the two direction changes and why collision uses the ball radius.
The unchanged starter draws both objects and moves the paddle; ball updates remain assigned.
